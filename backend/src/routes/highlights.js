import express from 'express';
import axios from 'axios';
import * as highlightsDb from '../storage/highlightsDatabase.js';

const router = express.Router();

// Auto-discover highlights for all teams
router.get('/discover', async (req, res) => {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: 'YouTube API key not configured' });
    }

    // Get teams and blacklist
    const teamsResponse = await fetch(`http://localhost:${process.env.PORT || 3001}/api/teams`);
    const teams = await teamsResponse.json();
    const blacklist = await highlightsDb.getBlacklist();
    
    if (teams.length === 0) {
      return res.json({ message: 'No favorite teams found', results: [] });
    }

    const searchHistory = await highlightsDb.getSearchHistory();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const allHighlights = [];
    const rateLimitDelay = 100; // 100ms between requests
    
    for (const team of teams) {
      // Check recent dates that haven't been searched
      for (const date of [today, yesterday]) {
        const searchKey = `${team.name}-${date}-${team.sport}`;
        const alreadySearched = searchHistory.find(s => s.searchKey === searchKey);
        
        if (!alreadySearched) {
          try {
            await new Promise(resolve => setTimeout(resolve, rateLimitDelay));
            
            const searchQuery = `${team.name} highlights ${team.sport} ${new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
            
            const youtubeResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
              params: {
                key: API_KEY,
                q: searchQuery,
                part: 'snippet',
                type: 'video',
                maxResults: 3, // Fewer results for auto-discovery
                order: 'relevance',
                publishedAfter: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // Last 7 days
              }
            });

            if (youtubeResponse.data.items.length > 0) {
              const highlights = youtubeResponse.data.items
                .filter(item => !blacklist.includes(item.id.videoId)) // Filter out blacklisted
                .map(item => ({
                  id: item.id.videoId,
                  title: item.snippet.title,
                  url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                  thumbnail: item.snippet.thumbnails.medium?.url,
                  publishedAt: item.snippet.publishedAt,
                  channelTitle: item.snippet.channelTitle,
                  team: team.name,
                  sport: team.sport,
                  searchDate: date
                }));
              
              allHighlights.push(...highlights);
            }
            
            // Record search to avoid duplicates
            await highlightsDb.addSearchHistory(team.name, date, team.sport);
            
          } catch (error) {
            if (error.response?.status === 403) {
              return res.status(429).json({ 
                error: 'YouTube API quota exceeded', 
                message: 'Please try again later or reduce the number of teams',
                partialResults: allHighlights
              });
            }
            console.error(`Error searching for ${team.name}:`, error.message);
          }
        }
      }
    }

    res.json({
      message: `Found ${allHighlights.length} new highlights`,
      results: allHighlights,
      teamsSearched: teams.length
    });
  } catch (error) {
    console.error('Auto-discovery error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Search YouTube highlights for teams
router.get('/', async (req, res) => {
  try {
    const { team, date, sport } = req.query;
    
    if (!team) {
      return res.status(400).json({ error: 'Team parameter required' });
    }

    const API_KEY = process.env.YOUTUBE_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: 'YouTube API key not configured' });
    }

    // Get blacklist to filter out deleted highlights
    const blacklist = await highlightsDb.getBlacklist();

    // Build search query
    let searchQuery = `${team} highlights`;
    if (sport) searchQuery += ` ${sport}`;
    if (date) {
      const searchDate = new Date(date);
      const dateStr = searchDate.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
      searchQuery += ` ${dateStr}`;
    }

    // YouTube Data API v3 search
    const youtubeResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: API_KEY,
        q: searchQuery,
        part: 'snippet',
        type: 'video',
        maxResults: 12,
        order: 'relevance',
        safeSearch: 'none',
        videoDefinition: 'any'
      }
    });

    // Transform YouTube response
    const videoIds = youtubeResponse.data.items.map(item => item.id.videoId);
    
    // Get video details for duration
    const videoDetailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        key: API_KEY,
        id: videoIds.join(','),
        part: 'contentDetails'
      }
    });

    // Create duration lookup
    const durationMap = {};
    videoDetailsResponse.data.items.forEach(video => {
      durationMap[video.id] = parseDuration(video.contentDetails.duration);
    });

    const highlights = youtubeResponse.data.items
      .filter(item => !blacklist.includes(item.id.videoId)) // Filter out blacklisted
      .map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        description: item.snippet.description,
        duration: durationMap[item.id.videoId] || 'N/A'
      }));

    // Record search history to avoid duplicates
    await highlightsDb.addSearchHistory(team, selectedDate, selectedSport);

    res.json({
      query: searchQuery,
      results: highlights
    });
  } catch (error) {
    console.error('Highlights search error:', error);
    
    if (error.response?.status === 400) {
      console.error('YouTube API Error:', error.response.data);
      return res.status(400).json({ 
        error: 'Invalid YouTube API request', 
        details: error.response.data?.error?.message || 'Bad request'
      });
    }
    
    if (error.response?.status === 403) {
      return res.status(403).json({ error: 'YouTube API quota exceeded or invalid key' });
    }
    
    res.status(500).json({ error: error.message });
  }
});

export default router;

// Helper function to parse YouTube duration format (PT4M13S -> 4:13)
function parseDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 'N/A';
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
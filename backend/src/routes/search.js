import express from 'express';
import * as tmdb from '../services/tmdb.js';
import * as googleBooks from '../services/googleBooks.js';
import * as anilist from '../services/anilist.js';

const router = express.Router();

router.get('/:mediaType', async (req, res) => {
  try {
    const { mediaType } = req.params;
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter required' });
    }

    let results = [];

    switch (mediaType) {
      case 'movie':
        results = await tmdb.searchMovies(query);
        break;
      case 'tv':
        results = await tmdb.searchTV(query);
        break;
      case 'book':
        results = await googleBooks.searchBooks(query);
        break;
      case 'anime':
        results = await anilist.searchAnime(query);
        break;
      case 'manga':
        results = await anilist.searchManga(query);
        break;
      case 'sports':
        // For now, return empty array since sports are manually added
        results = [];
        break;
      default:
        return res.status(400).json({ error: 'Invalid media type' });
    }

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
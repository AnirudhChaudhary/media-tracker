import React, { useState, useEffect } from 'react';
import { Search, Calendar, Play, ExternalLink, Heart, Plus, X, Eye, EyeOff, RefreshCw, BookmarkPlus, Check, Trash2 } from 'lucide-react';
import * as api from '../api/client';

function HighlightsView() {
  const [activeTab, setActiveTab] = useState('search'); // 'search', 'watchlist', or 'watched'
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [highlights, setHighlights] = useState([]);
  const [savedHighlights, setSavedHighlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', sport: '' });
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [trustedChannels, setTrustedChannels] = useState([]);
  const [showTrustedOnly, setShowTrustedOnly] = useState(false);
  const [showChannelManager, setShowChannelManager] = useState(false);
  const [newChannel, setNewChannel] = useState('');

  useEffect(() => {
    loadTeams();
    loadSavedHighlights();
    loadTrustedChannels();
  }, []);

  const loadSavedHighlights = async () => {
    try {
      const data = await api.getSavedHighlights();
      setSavedHighlights(data);
    } catch (error) {
      console.error('Error loading saved highlights:', error);
    }
  };

  const loadTrustedChannels = async () => {
    try {
      console.log('Loading trusted channels...');
      const data = await api.getTrustedChannels();
      console.log('Trusted channels loaded:', data);
      setTrustedChannels(data);
    } catch (error) {
      console.error('Error loading trusted channels:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const handleAddTrustedChannel = async (channelName) => {
    try {
      console.log('Adding trusted channel:', channelName);
      await api.addTrustedChannel(channelName);
      await loadTrustedChannels();
    } catch (error) {
      console.error('Error adding trusted channel:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const handleRemoveTrustedChannel = async (channelName) => {
    try {
      console.log('Removing trusted channel:', channelName);
      await api.removeTrustedChannel(channelName);
      await loadTrustedChannels();
    } catch (error) {
      console.error('Error removing trusted channel:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const handleAutoDiscover = async () => {
    setDiscovering(true);
    try {
      const data = await api.discoverHighlights();
      if (data.results && data.results.length > 0) {
        // Auto-save discovered highlights
        for (const highlight of data.results) {
          await api.saveHighlight(highlight);
        }
        await loadSavedHighlights();
        setActiveTab('watchlist');
      }
      alert(`${data.message}. Found ${data.results?.length || 0} new highlights!`);
    } catch (error) {
      if (error.response?.status === 429) {
        alert('YouTube API rate limit reached. Please try again later.');
      } else {
        console.error('Error discovering highlights:', error);
        alert('Error discovering highlights. Please try again.');
      }
    }
    setDiscovering(false);
  };

  const handleSaveHighlight = async (highlight) => {
    try {
      await api.saveHighlight(highlight);
      await loadSavedHighlights();
    } catch (error) {
      console.error('Error saving highlight:', error);
    }
  };

  const handleToggleWatched = async (id, watched) => {
    try {
      await api.updateSavedHighlight(id, { watched });
      await loadSavedHighlights();
    } catch (error) {
      console.error('Error updating highlight:', error);
    }
  };

  const handleDeleteSavedHighlight = async (id) => {
    try {
      await api.deleteSavedHighlight(id);
      await loadSavedHighlights();
    } catch (error) {
      console.error('Error deleting highlight:', error);
    }
  };

  const loadTeams = async () => {
    try {
      const data = await api.getTeams();
      setTeams(data);
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!newTeam.name || !newTeam.sport) return;
    
    try {
      await api.addTeam(newTeam);
      await loadTeams();
      setNewTeam({ name: '', sport: '' });
      setShowAddTeam(false);
    } catch (error) {
      console.error('Error adding team:', error);
    }
  };

  const handleDeleteTeam = async (id) => {
    try {
      await api.deleteTeam(id);
      await loadTeams();
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  const searchHighlights = async () => {
    if (!selectedTeam) return;
    
    setLoading(true);
    try {
      const data = await api.searchHighlights(selectedTeam, selectedDate, selectedSport);
      setHighlights(data.results || []);
    } catch (error) {
      console.error('Error searching highlights:', error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 p-4 min-h-screen relative">
      {/* Top-right Add Team Button */}
      <button
        onClick={() => setShowAddTeam(true)}
        className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-green-500/30 z-10"
      >
        <Plus className="w-4 h-4 text-white" />
        <span className="text-white text-sm">Add Team</span>
      </button>

      <div className="max-w-6xl mx-auto mt-16">
        {/* Tab Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'search'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Search className="w-4 h-4 inline mr-2" />
              Search Highlights
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'watchlist'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Heart className="w-4 h-4 inline mr-2" />
              Watchlist ({savedHighlights.filter(h => !h.watched).length})
            </button>
            <button
              onClick={() => setActiveTab('watched')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'watched'
                  ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Check className="w-4 h-4 inline mr-2" />
              Watched ({savedHighlights.filter(h => h.watched).length})
            </button>
          </div>
          
          <button
            onClick={handleAutoDiscover}
            disabled={discovering || teams.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 rounded-lg font-semibold transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${discovering ? 'animate-spin' : ''}`} />
            {discovering ? 'Discovering...' : 'Auto-Discover'}
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-8 text-center">
          {activeTab === 'search' ? 'Search Team Highlights' : 
           activeTab === 'watchlist' ? 'Your Watchlist' : 'Watched Highlights'}
        </h2>
        {/* Controls Panel */}
        <div className="bg-gray-800 rounded-xl p-4 mb-8 space-y-4">
          {/* Anti-Spoiler Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white mb-1">Anti-Spoiler Mode</h4>
              <p className="text-sm text-gray-400">Hide thumbnails to avoid game result spoilers</p>
            </div>
            <button
              onClick={() => setShowThumbnails(!showThumbnails)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                showThumbnails 
                  ? 'bg-red-600 hover:bg-red-500 text-white' 
                  : 'bg-green-600 hover:bg-green-500 text-white'
              }`}
            >
              {showThumbnails ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Hide Thumbnails
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Show Thumbnails
                </>
              )}
            </button>
          </div>

          {/* Trusted Channels Filter */}
          <div className="border-t border-gray-700 pt-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium text-white mb-1">Trusted Channels Filter</h4>
                <p className="text-sm text-gray-400">Show only highlights from trusted channels ({trustedChannels.length} channels)</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowChannelManager(true)}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
                >
                  Manage
                </button>
                <button
                  onClick={() => setShowTrustedOnly(!showTrustedOnly)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    showTrustedOnly 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                      : 'bg-gray-600 hover:bg-gray-500 text-white'
                  }`}
                >
                  {showTrustedOnly ? 'Trusted Only' : 'Show All'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Tab Content */}
        {activeTab === 'search' && (
          <>
            {/* Favorite Teams */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                Favorite Teams
              </h3>
              <div className="flex flex-wrap gap-2">
                {teams.map(team => (
                  <div key={team.id} className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2">
                    <span className="text-white">{team.name}</span>
                    <span className="text-gray-400 text-sm">({team.sport})</span>
                    <button
                      onClick={() => handleDeleteTeam(team.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {teams.length === 0 && (
                  <p className="text-gray-400 italic">No favorite teams yet. Add some to get started!</p>
                )}
              </div>
            </div>

        {/* Search Filters */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Team</label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="">Select team...</option>
                {teams.map(team => (
                  <option key={team.id} value={team.name}>{team.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sport</label>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="">Any sport</option>
                <option value="Basketball">Basketball</option>
                <option value="Football">Football</option>
                <option value="Soccer">Soccer</option>
                <option value="Baseball">Baseball</option>
                <option value="Hockey">Hockey</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={searchHighlights}
                disabled={!selectedTeam || loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-600 rounded-lg font-semibold transition-all"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Highlights Results */}
        {highlights.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights
              .filter(highlight => !showTrustedOnly || trustedChannels.includes(highlight.channelTitle))
              .map(highlight => {
                const isTrusted = trustedChannels.includes(highlight.channelTitle);
                return (
                  <div key={highlight.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <div className="relative">
                      {showThumbnails ? (
                        <img
                          src={highlight.thumbnail}
                          alt={highlight.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
                          <div className="text-center">
                            <EyeOff className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-400 text-sm">Thumbnail Hidden</p>
                            <p className="text-gray-500 text-xs">Anti-spoiler mode</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-sm">
                        {highlight.duration}
                      </div>
                      {isTrusted && (
                        <div className="absolute top-2 left-2 bg-green-600 px-2 py-1 rounded text-white text-xs font-medium">
                          ✓ Trusted
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-white mb-2 line-clamp-2">{highlight.title}</h4>
                      <p className="text-gray-400 text-sm mb-3">{highlight.channelTitle}</p>
                      <a
                        href={highlight.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-medium transition-colors mb-2"
                      >
                        <Play className="w-4 h-4" />
                        Watch on YouTube
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveHighlight(highlight)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition-colors"
                        >
                          <BookmarkPlus className="w-4 h-4" />
                          Save
                        </button>
                        {!isTrusted && (
                          <button
                            onClick={() => handleAddTrustedChannel(highlight.channelTitle)}
                            className="px-3 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white text-sm transition-colors"
                            title="Trust this channel"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        )}
          </>
        )}

        {/* Watchlist Tab Content */}
        {activeTab === 'watchlist' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedHighlights
              .filter(highlight => !highlight.watched && (!showTrustedOnly || trustedChannels.includes(highlight.channelTitle)))
              .map(highlight => {
                const isTrusted = trustedChannels.includes(highlight.channelTitle);
                return (
                  <div key={highlight.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-700">
                    <div className="relative">
                      {showThumbnails ? (
                        <img
                          src={highlight.thumbnail}
                          alt={highlight.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
                          <div className="text-center">
                            <EyeOff className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-400 text-sm">Thumbnail Hidden</p>
                            <p className="text-gray-500 text-xs">Anti-spoiler mode</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-sm">
                        {highlight.duration || 'N/A'}
                      </div>
                      {isTrusted && (
                        <div className="absolute top-2 left-2 bg-blue-600 px-2 py-1 rounded text-white text-xs font-medium">
                          ✓ Trusted
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-white mb-2 line-clamp-2">{highlight.title}</h4>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-blue-400 text-sm">{highlight.team}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400 text-sm">{highlight.channelTitle}</span>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={highlight.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-medium transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          Watch
                        </a>
                        <button
                          onClick={() => handleToggleWatched(highlight.id, true)}
                          className="px-3 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white transition-colors"
                          title="Mark as watched"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSavedHighlight(highlight.id)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white transition-colors"
                          title="Delete from watchlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {!isTrusted && (
                          <button
                            onClick={() => handleAddTrustedChannel(highlight.channelTitle)}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm transition-colors"
                            title="Trust this channel"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            }
            {savedHighlights.filter(highlight => !highlight.watched && (!showTrustedOnly || trustedChannels.includes(highlight.channelTitle))).length === 0 && (
              <div className="col-span-full text-center py-12">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 text-xl mb-2">
                  {showTrustedOnly ? 'No trusted highlights in watchlist' : 'No unwatched highlights'}
                </p>
                <p className="text-gray-400">
                  {showTrustedOnly 
                    ? 'Add channels to your trusted list or switch to "Show All"' 
                    : 'Search for highlights and save them to your watchlist'
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {/* Watched Tab Content */}
        {activeTab === 'watched' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedHighlights
              .filter(highlight => highlight.watched && (!showTrustedOnly || trustedChannels.includes(highlight.channelTitle)))
              .map(highlight => {
                const isTrusted = trustedChannels.includes(highlight.channelTitle);
                return (
                  <div key={highlight.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border-2 border-green-500/30">
                    <div className="relative">
                      {showThumbnails ? (
                        <img
                          src={highlight.thumbnail}
                          alt={highlight.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
                          <div className="text-center">
                            <EyeOff className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-400 text-sm">Thumbnail Hidden</p>
                            <p className="text-gray-500 text-xs">Anti-spoiler mode</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-sm">
                        {highlight.duration || 'N/A'}
                      </div>
                      <div className="absolute top-2 left-2 flex gap-1">
                        <div className="bg-green-600 px-2 py-1 rounded text-white text-xs font-medium">
                          ✓ Watched
                        </div>
                        {isTrusted && (
                          <div className="bg-blue-600 px-2 py-1 rounded text-white text-xs font-medium">
                            ✓ Trusted
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-white mb-2 line-clamp-2">{highlight.title}</h4>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-blue-400 text-sm">{highlight.team}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400 text-sm">{highlight.channelTitle}</span>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={highlight.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-medium transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          Watch Again
                        </a>
                        <button
                          onClick={() => handleToggleWatched(highlight.id, false)}
                          className="px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors"
                          title="Mark as unwatched"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSavedHighlight(highlight.id)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white transition-colors"
                          title="Delete permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            }
            {savedHighlights.filter(highlight => highlight.watched && (!showTrustedOnly || trustedChannels.includes(highlight.channelTitle))).length === 0 && (
              <div className="col-span-full text-center py-12">
                <Check className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 text-xl mb-2">
                  {showTrustedOnly ? 'No trusted watched highlights' : 'No watched highlights yet'}
                </p>
                <p className="text-gray-400">
                  {showTrustedOnly 
                    ? 'Watch some trusted highlights or switch to "Show All"' 
                    : 'Mark highlights as watched to see them here'
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Team Modal */}
      {showAddTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">Add Favorite Team</h3>
            <form onSubmit={handleAddTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Team Name</label>
                <input
                  type="text"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                  placeholder="e.g., Lakers, Cowboys, Arsenal"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sport</label>
                <select
                  value={newTeam.sport}
                  onChange={(e) => setNewTeam({...newTeam, sport: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  required
                >
                  <option value="">Select sport...</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Football">Football</option>
                  <option value="Soccer">Soccer</option>
                  <option value="Baseball">Baseball</option>
                  <option value="Hockey">Hockey</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddTeam(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
                >
                  Add Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Trusted Channels Manager Modal */}
      {showChannelManager && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Manage Trusted Channels</h3>
            
            {/* Add Channel Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (newChannel.trim()) {
                handleAddTrustedChannel(newChannel.trim());
                setNewChannel('');
              }
            }} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value)}
                  placeholder="Enter channel name (e.g., NFL, NBC Sports)"
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Trusted Channels List */}
            <div className="space-y-2 mb-6">
              <h4 className="font-medium text-white">Trusted Channels ({trustedChannels.length})</h4>
              {trustedChannels.length === 0 ? (
                <p className="text-gray-400 italic">No trusted channels yet</p>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {trustedChannels.map(channel => (
                    <div key={channel} className="flex items-center justify-between bg-gray-700 rounded-lg px-3 py-2">
                      <span className="text-white">{channel}</span>
                      <button
                        onClick={() => handleRemoveTrustedChannel(channel)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                setShowChannelManager(false);
                setNewChannel('');
              }}
              className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HighlightsView;
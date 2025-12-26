import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import * as api from '../api/client';

function SearchView({ onAddToLibrary }) {
  const [mediaType, setMediaType] = useState('movie');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await api.searchMedia(mediaType, searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {['movie', 'tv', 'book', 'anime', 'manga'].map(type => (
          <button
            key={type}
            onClick={() => setMediaType(type)}
            className={`px-4 py-2 rounded capitalize ${
              mediaType === type ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {type === 'tv' ? 'TV Show' : type}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={`Search ${mediaType}...`}
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50 flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>

      {loading && <div className="text-center py-8">Searching...</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchResults.map((item) => (
          <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden">
            {item.poster && (
              <img
                src={item.poster}
                alt={item.title}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-gray-400 mb-2">
                {item.year} {item.author && `• ${item.author}`}
              </p>
              {item.overview && (
                <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                  {item.overview}
                </p>
              )}
              <button
                onClick={() => onAddToLibrary(item)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add to Library
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchView;
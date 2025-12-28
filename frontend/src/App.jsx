import React, { useState, useEffect } from 'react';
import SearchView from './components/SearchView';
import LibraryView from './components/LibraryView';
import DetailView from './components/DetailView';
import SportsDetailView from './components/SportsDetailView';
import SportsMediaView from './components/SportsMediaView';
import SportsInputView from './components/SportsInputView';
import HighlightsView from './components/HighlightsView';
import './index.css';
import * as api from './api/client';

function App() {
  const [view, setView] = useState('library');
  const [mediaType, setMediaType] = useState('regular'); // 'regular' or 'sports'
  const [library, setLibrary] = useState([]);
  const [sportsLibrary, setSportsLibrary] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLibrary();
    loadSportsLibrary();
  }, []);

  const loadSportsLibrary = async () => {
    setLoading(true);
    try {
      const data = await api.getSportsLibrary();
      setSportsLibrary(data);
    } catch (error) {
      console.error('Error loading sports library:', error);
    }
    setLoading(false);
  };

  const loadLibrary = async () => {
    setLoading(true);
    try {
      const data = await api.getLibrary();
      setLibrary(data);
    } catch (error) {
      console.error('Error loading library:', error);
    }
    setLoading(false);
  };

  const handleAddSportsMedia = async (item) => {
    try {
      await api.addSportsMedia(item);
      await loadSportsLibrary();
      setView('sports-library');
    } catch (error) {
      console.error('Error adding sports media:', error);
    }
  };

  const handleUpdateSportsMedia = async (id, updates) => {
    try {
      await api.updateSportsMedia(id, updates);
      await loadSportsLibrary();
      if (selectedItem?.id === id) {
        const updated = await api.getSportsMedia(id);
        setSelectedItem(updated);
      }
    } catch (error) {
      console.error('Error updating sports media:', error);
    }
  };

  const handleDeleteSportsMedia = async (id) => {
    try {
      await api.deleteSportsMedia(id);
      await loadSportsLibrary();
      setSelectedItem(null);
      setView('sports-library');
    } catch (error) {
      console.error('Error deleting sports media:', error);
    }
  };

  const handleAddToLibrary = async (item) => {
    try {
      await api.addMedia(item);
      await loadLibrary();
      setView('library');
    } catch (error) {
      console.error('Error adding to library:', error);
    }
  };

  const handleUpdateItem = async (id, updates) => {
    try {
      await api.updateMedia(id, updates);
      await loadLibrary();
      if (selectedItem?.id === id) {
        const updated = await api.getMedia(id);
        setSelectedItem(updated);
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await api.deleteMedia(id);
      await loadLibrary();
      setSelectedItem(null);
      setView('library');
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Media Tracker</h1>
          <div className="flex gap-2">
            <button
              onClick={() => { setView('library'); setSelectedItem(null); setMediaType('regular'); }}
              className={`px-4 py-2 rounded ${
                view === 'library' && mediaType === 'regular' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              Media Library
            </button>
            <button
              onClick={() => { setView('sports-library'); setSelectedItem(null); setMediaType('sports'); }}
              className={`px-4 py-2 rounded ${
                view === 'sports-library' ? 'bg-orange-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              Sports
            </button>
            <button
              onClick={() => { setView('highlights'); setSelectedItem(null); }}
              className={`px-4 py-2 rounded ${
                view === 'highlights' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              Highlights
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {view === 'highlights' && (
          <HighlightsView />
        )}

        {view === 'library' && !selectedItem && (
          <LibraryView
            library={library}
            loading={loading}
            onSelectItem={setSelectedItem}
            onAddClick={() => setView('search')}
          />
        )}

        {view === 'search' && (
          <SearchView onAddToLibrary={handleAddToLibrary} />
        )}

        {view === 'add-sports' && (
          <SportsInputView onAddSportsMedia={handleAddSportsMedia} />
        )}

        {view === 'sports-library' && !selectedItem && (
          <SportsMediaView
            sportsLibrary={sportsLibrary}
            loading={loading}
            onSelectItem={setSelectedItem}
            onAddClick={() => setView('add-sports')}
          />
        )}

        {selectedItem && (
          selectedItem.id?.startsWith('sports_') ? (
            <SportsDetailView
              item={selectedItem}
              onBack={() => setSelectedItem(null)}
              onUpdate={handleUpdateSportsMedia}
              onDelete={handleDeleteSportsMedia}
            />
          ) : (
            <DetailView
              item={selectedItem}
              onBack={() => setSelectedItem(null)}
              onUpdate={handleUpdateItem}
              onDelete={handleDeleteItem}
            />
          )
        )}
      </div>
    </div>
  );
}

export default App;
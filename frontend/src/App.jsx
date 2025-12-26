import React, { useState, useEffect } from 'react';
import SearchView from './components/SearchView';
import LibraryView from './components/LibraryView';
import DetailView from './components/DetailView';
import './index.css';
import * as api from './api/client';

function App() {
  const [view, setView] = useState('library');
  const [library, setLibrary] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLibrary();
  }, []);

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
              onClick={() => { setView('library'); setSelectedItem(null); }}
              className={`px-4 py-2 rounded ${
                view === 'library' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              Library
            </button>
            <button
              onClick={() => setView('search')}
              className={`px-4 py-2 rounded ${
                view === 'search' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              Add Media
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {view === 'search' && (
          <SearchView onAddToLibrary={handleAddToLibrary} />
        )}

        {view === 'library' && !selectedItem && (
          <LibraryView
            library={library}
            loading={loading}
            onSelectItem={setSelectedItem}
            onAddClick={() => setView('search')}
          />
        )}

        {selectedItem && (
          <DetailView
            item={selectedItem}
            onBack={() => setSelectedItem(null)}
            onUpdate={handleUpdateItem}
            onDelete={handleDeleteItem}
          />
        )}
      </div>
    </div>
  );
}

export default App;
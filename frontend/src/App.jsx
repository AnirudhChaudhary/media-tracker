import React, { useState, useEffect } from 'react';
import SearchView from './components/SearchView';
import LibraryView from './components/LibraryView';
import DetailView from './components/DetailView';
import SportsDetailView from './components/SportsDetailView';
import SportsMediaView from './components/SportsMediaView';
import SportsInputView from './components/SportsInputView';
import HighlightsView from './components/HighlightsView';
import TodosView from './components/TodosView';
import HomeView from './components/HomeView';
import HabitsView from './components/HabitsView';
import ResearchView from './components/ResearchView';
import RelationshipsView from './components/RelationshipsView';
import './index.css';
import * as api from './api/client';

function App() {
  const [view, setView] = useState('home');
  const [todos, setTodos] = useState([]);
  const [mediaType, setMediaType] = useState('regular'); // 'regular' or 'sports'
  const [library, setLibrary] = useState([]);
  const [sportsLibrary, setSportsLibrary] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLibrary();
    loadSportsLibrary();
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await api.getTodos();
      setTodos(data);
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

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
      {/* Premium Navigation Header */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border-b border-gray-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Life Dashboard
                </h1>
                <p className="text-sm text-gray-400">Your personal command center</p>
              </div>
            </div>
            
            {/* Premium Tab Navigation */}
            <nav className="flex flex-wrap justify-center space-x-1 bg-gray-800/50 p-1 rounded-xl backdrop-blur-sm overflow-x-auto">
            {[
              { id: 'home', label: 'Home', icon: '🏠', gradient: 'from-indigo-500 to-purple-600' },
              { id: 'todos', label: 'Todos', icon: '✅', gradient: 'from-purple-500 to-pink-600' },
              { id: 'habits', label: 'Habits', icon: '🎯', gradient: 'from-emerald-500 to-teal-600' },
              { id: 'research', label: 'Research', icon: '📝', gradient: 'from-cyan-500 to-blue-600' },
              { id: 'relationships', label: 'People', icon: '👥', gradient: 'from-pink-500 to-rose-600' },
              { id: 'library', label: 'Media', icon: '📚', gradient: 'from-blue-500 to-cyan-600' },
              { id: 'sports-library', label: 'Sports', icon: '🏈', gradient: 'from-orange-500 to-red-600' },
              { id: 'highlights', label: 'Highlights', icon: '✨', gradient: 'from-green-500 to-emerald-600' }
            ].map(tab => {
              const isActive = view === tab.id || (tab.id === 'library' && view === 'library' && mediaType === 'regular');
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setView(tab.id);
                    setSelectedItem(null);
                    if (tab.id === 'library') setMediaType('regular');
                    if (tab.id === 'sports-library') setMediaType('sports');
                  }}
                  className={`relative flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 group min-w-0 ${
                    isActive
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg transform scale-105`
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <span className="text-lg sm:text-lg">{tab.icon}</span>
                  <span className="font-semibold text-xs sm:text-sm truncate">{tab.label}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-lg opacity-50"></div>
                  )}
                </button>
              );
            })}
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {view === 'home' && (
          <HomeView onNavigate={setView} />
        )}

        {view === 'highlights' && (
          <HighlightsView />
        )}

        {view === 'todos' && (
          <TodosView />
        )}

        {view === 'habits' && (
          <HabitsView />
        )}

        {view === 'research' && (
          <ResearchView />
        )}

        {view === 'relationships' && (
          <RelationshipsView />
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
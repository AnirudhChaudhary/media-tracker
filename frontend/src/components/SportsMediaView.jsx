import React, { useState } from 'react';
import { Trophy, Calendar, Clock, Users, Plus, Zap, Target, Waves, Mountain, Bike, Dumbbell } from 'lucide-react';

function SportsMediaView({ sportsLibrary = [], loading = false, onSelectItem = () => {}, onAddClick = () => {} }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedSport, setSelectedSport] = useState('all');

  // Get unique sports from the library (normalized)
  const availableSports = [...new Set(sportsLibrary.map(item => 
    item.sport.toLowerCase().replace(/^\w/, c => c.toUpperCase())
  ))].sort();
  
  // Filter library based on selected sport
  const filteredLibrary = selectedSport === 'all' 
    ? sportsLibrary 
    : sportsLibrary.filter(item => 
        item.sport.toLowerCase().replace(/^\w/, c => c.toUpperCase()) === selectedSport
      );

  const getSportIcon = (sport) => {
    const sportLower = sport.toLowerCase();
    switch (sportLower) {
      case 'basketball': return <Target className="w-4 h-4" />;
      case 'football': case 'american football': return <Trophy className="w-4 h-4" />;
      case 'soccer': case 'football': return <Target className="w-4 h-4" />;
      case 'tennis': return <Zap className="w-4 h-4" />;
      case 'swimming': return <Waves className="w-4 h-4" />;
      case 'cycling': case 'biking': return <Bike className="w-4 h-4" />;
      case 'climbing': case 'rock climbing': return <Mountain className="w-4 h-4" />;
      case 'weightlifting': case 'gym': return <Dumbbell className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const getDurationLabel = (duration) => {
    const labels = {
      'quarter': '1/4 Game',
      'half': '1/2 Game', 
      'three_quarters': '3/4 Game',
      'full': 'Full Game'
    };
    return labels[duration] || duration;
  };

  const getDurationColor = (duration) => {
    switch (duration) {
      case 'full': return 'text-green-400';
      case 'three_quarters': return 'text-blue-400';
      case 'half': return 'text-yellow-400';
      case 'quarter': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 bg-gray-900 min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading sports media...</p>
        </div>
      </div>
    );
  }

  if (sportsLibrary.length === 0) {
    return (
      <div className="flex items-center justify-center py-24 bg-gray-900 min-h-[50vh]">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Trophy className="w-12 h-12 text-orange-400" />
          </div>
          <p className="text-gray-300 text-xl mb-6">No sports media tracked yet</p>
          <button
            onClick={onAddClick}
            className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-orange-500/30"
          >
            Add Sports Media
          </button>
        </div>
      </div>
    );
  }

  // Show filtered empty state
  if (filteredLibrary.length === 0 && selectedSport !== 'all') {
    return (
      <div className="bg-gray-900 p-4 min-h-screen">
        {/* Sport Filter Tabs */}
        <div className="mb-6 mt-16">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedSport('all')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
            >
              <Trophy className="w-4 h-4" />
              All Sports ({sportsLibrary.length})
            </button>
            {availableSports.map(sport => {
              const count = sportsLibrary.filter(item => 
                item.sport.toLowerCase().replace(/^\w/, c => c.toUpperCase()) === sport
              ).length;
              return (
                <button
                  key={sport}
                  onClick={() => setSelectedSport(sport)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedSport === sport
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {getSportIcon(sport)}
                  {sport} ({count})
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            {getSportIcon(selectedSport)}
            <p className="text-gray-300 text-lg mb-4">No {selectedSport} games tracked yet</p>
            <button
              onClick={onAddClick}
              className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-orange-500/30"
            >
              Add {selectedSport} Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-4 min-h-screen relative">
      {/* Top-right Add Button */}
      <button
        onClick={onAddClick}
        className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-orange-500/30 z-10"
        title="Add Sports Media"
      >
        <Plus className="w-4 h-4 text-white" />
        <span className="text-white text-sm">Add Sports</span>
      </button>

      {/* Sport Filter Tabs */}
      {availableSports.length > 0 && (
        <div className="mb-6 mt-16">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedSport('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                selectedSport === 'all'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Trophy className="w-4 h-4" />
              All Sports ({sportsLibrary.length})
            </button>
            {availableSports.map(sport => {
              const count = sportsLibrary.filter(item => 
                item.sport.toLowerCase().replace(/^\w/, c => c.toUpperCase()) === sport
              ).length;
              return (
                <button
                  key={sport}
                  onClick={() => setSelectedSport(sport)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedSport === sport
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {getSportIcon(sport)}
                  {sport} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredLibrary.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectItem(item)}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="group relative cursor-pointer"
          >
            <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/20 via-red-500/10 to-transparent backdrop-blur-sm transition-all duration-300 border border-orange-500/20 ${
              hoveredId === item.id ? 'scale-105 shadow-2xl shadow-orange-500/40' : 'scale-100 shadow-lg shadow-black/50'
            }`}>
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  {getSportIcon(item.sport)}
                  <h3 className="font-bold text-lg text-white">{item.sport}</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{item.teams}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${getDurationColor(item.watchDuration)}`} />
                    <span className={`text-sm font-medium ${getDurationColor(item.watchDuration)}`}>
                      {getDurationLabel(item.watchDuration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(item.watchedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {item.notes && (
                  <div className="mt-4 p-3 bg-black/30 rounded-lg border border-gray-700/50">
                    <p className="text-xs text-gray-300 italic">"{item.notes}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Remove floating button since we have top-right button */}
    </div>
  );
}

export default SportsMediaView;
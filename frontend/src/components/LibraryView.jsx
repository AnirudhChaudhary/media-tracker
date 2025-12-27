import React, { useState } from 'react';
import { Star, CheckCircle, Clock, XCircle, Pause, Eye, Plus } from 'lucide-react';

function LibraryView({ library = [], loading = false, onSelectItem = () => {}, onAddClick = () => {} }) {
  const [hoveredId, setHoveredId] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'watching':
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-400" />;
      case 'dropped': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'on_hold': return <Pause className="w-4 h-4 text-yellow-400" />;
      default: return <Eye className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status) => status ? status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'N/A';
  const getStatusGradient = (status) => {
    switch (status) {
      case 'completed': return 'from-green-500/20 via-emerald-500/10 to-transparent';
      case 'watching': case 'in_progress': return 'from-blue-500/20 via-cyan-500/10 to-transparent';
      case 'dropped': return 'from-red-500/20 via-rose-500/10 to-transparent';
      case 'on_hold': return 'from-yellow-500/20 via-amber-500/10 to-transparent';
      default: return 'from-gray-500/20 via-slate-500/10 to-transparent';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 bg-gray-900 min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading your collection...</p>
        </div>
      </div>
    );
  }

  if (library.length === 0) {
    return (
      <div className="flex items-center justify-center py-24 bg-gray-900 min-h-[50vh]">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Eye className="w-12 h-12 text-purple-400" />
          </div>
          <p className="text-gray-300 text-xl mb-6">Your library is empty</p>
          <button
            onClick={onAddClick}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
          >
            Add Your First Item
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-4 min-h-screen relative">
      {/* Top-right Add Button */}
      <button
        onClick={onAddClick}
        className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30 z-10"
        title="Add Media"
      >
        <Plus className="w-4 h-4 text-white" />
        <span className="text-white text-sm">Add Media</span>
      </button>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 justify-center mt-16">
        {library.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectItem(item)}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="group relative cursor-pointer max-w-xs mx-auto"
          >
            <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${getStatusGradient(item.status)} backdrop-blur-sm transition-all duration-300 ${
              hoveredId === item.id ? 'scale-105 shadow-2xl shadow-purple-500/40' : 'scale-100 shadow-lg shadow-black/50'
            }`}>
              
              {/* Poster */}
              {item.poster ? (
                <img
                  src={item.poster}
                  alt={item.title}
                  className={`w-full h-56 object-cover transition-transform duration-500 ${
                    hoveredId === item.id ? 'scale-110' : 'scale-100'
                  }`}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-56 bg-gray-800 flex items-center justify-center">
                  <Eye className="w-12 h-12 text-gray-600" />
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full p-2 border border-white/10">
                {getStatusIcon(item.status)}
              </div>

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/95 to-transparent">
                <h3 className="font-bold text-sm text-white line-clamp-2">{item.title}</h3>
              </div>

              {/* Hover Overlay */}
              <div className={`absolute inset-0 bg-black/80 flex flex-col justify-end p-4 transition-opacity duration-300 ${
                hoveredId === item.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
                <h3 className="font-bold text-base text-white mb-2 line-clamp-2">{item.title}</h3>
                {item.userRating !== null && (
                  <div className="flex items-center gap-1.5 mb-2 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold">{item.userRating}</span>/10
                  </div>
                )}
                {item.progress && <div className="text-xs text-gray-300">Progress: {item.progress}</div>}
                {item.notes && <div className="text-xs text-gray-400 mt-1 line-clamp-3 italic border-t border-gray-700/50 pt-1">"{item.notes}"</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LibraryView;

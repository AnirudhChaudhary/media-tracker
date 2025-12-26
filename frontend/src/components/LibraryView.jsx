import React from 'react';
import { Star, CheckCircle, Clock, XCircle, Pause, Eye } from 'lucide-react';

function LibraryView({ library, loading, onSelectItem, onAddClick }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'dropped': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'on_hold': return <Pause className="w-4 h-4 text-yellow-500" />;
      default: return <Eye className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status) => {
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (library.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">Your library is empty</p>
        <button
          onClick={onAddClick}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Add Media
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {library.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelectItem(item)}
          className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
        >
          {item.poster ? (
            <img
              src={item.poster}
              alt={item.title}
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-64 bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          <div className="p-3">
            <h3 className="font-semibold text-sm mb-1 line-clamp-1">{item.title}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              {getStatusIcon(item.status)}
              <span>{getStatusLabel(item.status)}</span>
            </div>
            {item.userRating && (
              <div className="flex items-center gap-1 mt-1 text-xs text-yellow-400">
                <Star className="w-3 h-3 fill-current" />
                <span>{item.userRating}/10</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default LibraryView;
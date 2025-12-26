import React, { useState } from 'react';
import { ArrowLeft, Star, Calendar, Play, Check, Clock, Trash2, Edit3 } from 'lucide-react';

export default function DetailView({ item, onBack, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field, value) => {
    onUpdate(item.id, { [field]: value });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'watching': return 'bg-blue-600';
      case 'plan_to_watch': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <Check className="w-4 h-4" />;
      case 'watching': return <Play className="w-4 h-4" />;
      case 'plan_to_watch': return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          {isEditing ? 'Done Editing' : 'Edit'}
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="md:flex">
          {/* Poster */}
          {item.poster && (
            <div className="md:w-80 flex-shrink-0">
              <img
                src={item.poster}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 p-8">
            {/* Title & Year */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-2">{item.title}</h1>
              <div className="flex items-center gap-4 text-gray-400">
                <span className="text-lg">{item.year}</span>
                {item.genre && <span>• {item.genre}</span>}
                {item.runtime && <span>• {item.runtime} min</span>}
              </div>
            </div>

            {/* Status Badge */}
            <div className="mb-6">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(item.status)}`}>
                {getStatusIcon(item.status)}
                {item.status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Plan to Watch'}
              </div>
            </div>

            {/* Overview */}
            {item.overview && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Overview</h3>
                <p className="text-gray-300 leading-relaxed">{item.overview}</p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {/* Rating */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-400">Your Rating</span>
                </div>
                {isEditing ? (
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={item.userRating || ''}
                    onChange={(e) => handleChange('userRating', parseFloat(e.target.value))}
                    className="w-full bg-gray-600 rounded px-2 py-1 text-lg font-bold"
                    placeholder="0.0"
                  />
                ) : (
                  <div className="text-2xl font-bold">
                    {item.userRating ? `${item.userRating}/10` : '—'}
                  </div>
                )}
              </div>

              {/* Progress */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Play className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-400">Progress</span>
                </div>
                {isEditing ? (
                  <input
                    type="number"
                    min="0"
                    value={item.progress || ''}
                    onChange={(e) => handleChange('progress', parseInt(e.target.value))}
                    className="w-full bg-gray-600 rounded px-2 py-1 text-lg font-bold"
                    placeholder="0"
                  />
                ) : (
                  <div className="text-2xl font-bold">
                    {item.progress || '—'}
                  </div>
                )}
              </div>

              {/* Start Date */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-400">Started</span>
                </div>
                {isEditing ? (
                  <input
                    type="date"
                    value={item.startDate?.substring(0,10) || ''}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="w-full bg-gray-600 rounded px-2 py-1 text-sm"
                  />
                ) : (
                  <div className="text-sm font-medium">
                    {item.startDate ? new Date(item.startDate).toLocaleDateString() : '—'}
                  </div>
                )}
              </div>

              {/* Complete Date */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-400">Completed</span>
                </div>
                {isEditing ? (
                  <input
                    type="date"
                    value={item.completeDate?.substring(0,10) || ''}
                    onChange={(e) => handleChange('completeDate', e.target.value)}
                    className="w-full bg-gray-600 rounded px-2 py-1 text-sm"
                  />
                ) : (
                  <div className="text-sm font-medium">
                    {item.completeDate ? new Date(item.completeDate).toLocaleDateString() : '—'}
                  </div>
                )}
              </div>
            </div>

            {/* Status Selector */}
            {isEditing && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={item.status || 'plan_to_watch'}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="bg-gray-700 rounded-lg px-4 py-2 w-full md:w-auto"
                >
                  <option value="plan_to_watch">Plan to Watch</option>
                  <option value="watching">Watching</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            )}

            {/* Notes */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Notes</h3>
              {isEditing ? (
                <textarea
                  value={item.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className="w-full bg-gray-700 rounded-lg p-4 text-gray-100 resize-none"
                  rows={4}
                  placeholder="Add your thoughts, reviews, or reminders..."
                />
              ) : (
                <div className="bg-gray-700 rounded-lg p-4 min-h-[100px]">
                  {item.notes ? (
                    <p className="text-gray-300 whitespace-pre-wrap">{item.notes}</p>
                  ) : (
                    <p className="text-gray-500 italic">No notes yet</p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <button
                onClick={() => onDelete(item.id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

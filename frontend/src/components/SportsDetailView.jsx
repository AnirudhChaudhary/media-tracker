import React, { useState } from 'react';
import { ArrowLeft, Trophy, Calendar, Clock, Users, Edit3, Trash2, Target, Zap, Waves, Mountain, Bike, Dumbbell } from 'lucide-react';

export default function SportsDetailView({ item, onBack, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field, value) => {
    onUpdate(item.id, { [field]: value });
  };

  const getSportIcon = (sport) => {
    const sportLower = sport.toLowerCase();
    switch (sportLower) {
      case 'basketball': return <Target className="w-6 h-6 text-orange-400" />;
      case 'football': case 'american football': return <Trophy className="w-6 h-6 text-orange-400" />;
      case 'soccer': return <Target className="w-6 h-6 text-orange-400" />;
      case 'tennis': return <Zap className="w-6 h-6 text-orange-400" />;
      case 'swimming': return <Waves className="w-6 h-6 text-orange-400" />;
      case 'cycling': case 'biking': return <Bike className="w-6 h-6 text-orange-400" />;
      case 'climbing': case 'rock climbing': return <Mountain className="w-6 h-6 text-orange-400" />;
      case 'weightlifting': case 'gym': return <Dumbbell className="w-6 h-6 text-orange-400" />;
      default: return <Trophy className="w-6 h-6 text-orange-400" />;
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
      case 'full': return 'bg-green-600';
      case 'three_quarters': return 'bg-blue-600';
      case 'half': return 'bg-yellow-600';
      case 'quarter': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sports
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          {isEditing ? 'Done Editing' : 'Edit'}
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl p-8">
        {/* Sport & Teams */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {getSportIcon(item.sport)}
            <h1 className="text-4xl font-bold">{item.sport}</h1>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-xl">
            <Users className="w-5 h-5" />
            {isEditing ? (
              <input
                type="text"
                value={item.teams || ''}
                onChange={(e) => handleChange('teams', e.target.value)}
                className="bg-gray-700 rounded px-3 py-1 text-xl text-white flex-1"
                placeholder="Teams playing"
              />
            ) : (
              <span>{item.teams}</span>
            )}
          </div>
        </div>

        {/* Watch Duration Badge */}
        <div className="mb-8">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium ${getDurationColor(item.watchDuration)}`}>
            <Clock className="w-4 h-4" />
            {getDurationLabel(item.watchDuration)}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Watch Duration */}
          <div className="bg-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-lg font-medium text-gray-300">Watch Duration</span>
            </div>
            {isEditing ? (
              <select
                value={item.watchDuration || 'full'}
                onChange={(e) => handleChange('watchDuration', e.target.value)}
                className="w-full bg-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="quarter">Quarter (1/4)</option>
                <option value="half">Half (1/2)</option>
                <option value="three_quarters">Three Quarters (3/4)</option>
                <option value="full">Full Game</option>
              </select>
            ) : (
              <div className="text-2xl font-bold text-white">
                {getDurationLabel(item.watchDuration)}
              </div>
            )}
          </div>

          {/* Watch Date */}
          <div className="bg-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-green-400" />
              <span className="text-lg font-medium text-gray-300">Watch Date</span>
            </div>
            {isEditing ? (
              <input
                type="date"
                value={item.watchedDate?.substring(0,10) || ''}
                onChange={(e) => handleChange('watchedDate', new Date(e.target.value).toISOString())}
                className="w-full bg-gray-600 rounded-lg px-3 py-2 text-white"
              />
            ) : (
              <div className="text-xl font-bold text-white">
                {item.watchedDate ? new Date(item.watchedDate).toLocaleDateString() : '—'}
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-orange-400" />
            Game Notes
          </h3>
          {isEditing ? (
            <textarea
              value={item.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full bg-gray-700 rounded-lg p-4 text-gray-100 resize-none"
              rows={4}
              placeholder="How was the game? Any highlights or thoughts..."
            />
          ) : (
            <div className="bg-gray-700 rounded-lg p-4 min-h-[120px]">
              {item.notes ? (
                <p className="text-gray-300 whitespace-pre-wrap">{item.notes}</p>
              ) : (
                <p className="text-gray-500 italic">No notes about this game yet</p>
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
  );
}
import React, { useState } from 'react';
import { Trophy, Users, Clock, Calendar, FileText, Plus } from 'lucide-react';

function SportsInputView({ onAddSportsMedia = () => {} }) {
  const [formData, setFormData] = useState({
    sport: '',
    teams: '',
    watchDuration: 'full',
    watchedDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [sportSuggestions, setSportSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const knownSports = [
    'Basketball', 'Football', 'Soccer', 'Tennis', 'Baseball', 'Hockey',
    'Swimming', 'Cycling', 'Running', 'Golf', 'Volleyball', 'Boxing',
    'Wrestling', 'Climbing', 'Weightlifting', 'Gymnastics', 'Track'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sport || !formData.teams) return;
    
    // Normalize and spell-check sport name
    const normalizedSport = normalizeSportName(formData.sport);
    
    await onAddSportsMedia({
      ...formData,
      sport: normalizedSport,
      watchedDate: new Date(formData.watchedDate).toISOString()
    });
    
    setFormData({
      sport: '',
      teams: '',
      watchDuration: 'full',
      watchedDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  // Sport name normalization with spell checking
  const normalizeSportName = (input) => {
    const cleaned = input.trim().toLowerCase().replace(/^\w/, c => c.toUpperCase());
    
    // Find closest match using simple distance
    let bestMatch = cleaned;
    let minDistance = Infinity;
    
    for (const sport of knownSports) {
      const distance = levenshteinDistance(cleaned.toLowerCase(), sport.toLowerCase());
      if (distance < minDistance && distance <= 2) { // Allow up to 2 character differences
        minDistance = distance;
        bestMatch = sport;
      }
    }
    
    return bestMatch;
  };

  // Handle sport input changes with suggestions
  const handleSportChange = (value) => {
    setFormData({...formData, sport: value});
    
    if (value.length > 1) {
      const suggestions = knownSports.filter(sport => 
        sport.toLowerCase().includes(value.toLowerCase()) ||
        levenshteinDistance(value.toLowerCase(), sport.toLowerCase()) <= 2
      ).slice(0, 5);
      setSportSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (sport) => {
    setFormData({...formData, sport});
    setShowSuggestions(false);
  };

  // Simple Levenshtein distance calculation
  const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };

  return (
    <div className="bg-gray-900 p-6 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-8 h-8 text-orange-400" />
            <h2 className="text-2xl font-bold text-white">Add Sports Media</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Trophy className="w-4 h-4" />
                Sport
              </label>
              <input
                type="text"
                value={formData.sport}
                onChange={(e) => handleSportChange(e.target.value)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="e.g., Basketball, Football, Soccer"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                required
              />
              {showSuggestions && (
                <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg">
                  {sportSuggestions.map((sport, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectSuggestion(sport)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-600 text-white first:rounded-t-lg last:rounded-b-lg"
                    >
                      {sport}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Users className="w-4 h-4" />
                Teams
              </label>
              <input
                type="text"
                value={formData.teams}
                onChange={(e) => setFormData({...formData, teams: e.target.value})}
                placeholder="e.g., Lakers vs Warriors"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Clock className="w-4 h-4" />
                Watch Duration
              </label>
              <select
                value={formData.watchDuration}
                onChange={(e) => setFormData({...formData, watchDuration: e.target.value})}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="quarter">Quarter (1/4)</option>
                <option value="half">Half (1/2)</option>
                <option value="three_quarters">Three Quarters (3/4)</option>
                <option value="full">Full Game</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Calendar className="w-4 h-4" />
                Watch Date
              </label>
              <input
                type="date"
                value={formData.watchedDate}
                onChange={(e) => setFormData({...formData, watchedDate: e.target.value})}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <FileText className="w-4 h-4" />
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Any thoughts about the game..."
                rows={3}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-orange-500/30"
            >
              Add Sports Media
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SportsInputView;
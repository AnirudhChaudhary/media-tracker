import React, { useState, useEffect } from 'react';
import * as api from '../api/client';

const HabitsView = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', description: '', category: 'health', frequency: 'daily' });

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const data = await api.getHabits();
      setHabits(data);
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newHabit.name.trim()) return;
    
    try {
      await api.addHabit(newHabit);
      setNewHabit({ name: '', description: '', category: 'health', frequency: 'daily' });
      setShowAddForm(false);
      loadHabits();
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const handleCompleteHabit = async (id) => {
    try {
      await api.completeHabit(id);
      loadHabits();
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  };

  const handleUncompleteHabit = async (id) => {
    try {
      await api.uncompleteHabit(id);
      loadHabits();
    } catch (error) {
      console.error('Error uncompleting habit:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteHabit(id);
      loadHabits();
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const isCompletedToday = (habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completions.some(c => c.date === today && c.completed);
  };

  const getCategoryColor = (category) => {
    const colors = {
      health: 'from-green-500 to-emerald-600',
      productivity: 'from-blue-500 to-cyan-600',
      learning: 'from-purple-500 to-violet-600',
      personal: 'from-orange-500 to-red-600',
      social: 'from-pink-500 to-rose-600'
    };
    return colors[category] || colors.personal;
  };

  const getStreakEmoji = (streak) => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '✨';
    if (streak >= 3) return '💪';
    return '🌱';
  };

  if (loading) return <div className="text-center py-8">Loading habits...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Habit Tracker</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 px-4 py-2 rounded-lg font-medium transition-all duration-200"
        >
          Add Habit
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-800 p-6 rounded-xl">
          <form onSubmit={handleAddHabit} className="space-y-4">
            <input
              type="text"
              placeholder="Habit name"
              value={newHabit.name}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
              className="w-full p-3 bg-gray-700 rounded-lg"
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={newHabit.description}
              onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
              className="w-full p-3 bg-gray-700 rounded-lg h-20"
            />
            <div className="flex gap-4">
              <select
                value={newHabit.category}
                onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                className="p-3 bg-gray-700 rounded-lg"
              >
                <option value="health">Health</option>
                <option value="productivity">Productivity</option>
                <option value="learning">Learning</option>
                <option value="personal">Personal</option>
                <option value="social">Social</option>
              </select>
              <select
                value={newHabit.frequency}
                onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
                className="p-3 bg-gray-700 rounded-lg"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg">
                Add Habit
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {habits.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-xl mb-2">No habits yet</p>
          <p>Start building positive habits today!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map(habit => {
            const completedToday = isCompletedToday(habit);
            return (
              <div
                key={habit.id}
                className={`bg-gradient-to-br ${getCategoryColor(habit.category)} p-6 rounded-xl text-white relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getStreakEmoji(habit.streak)}</span>
                    <div>
                      <h3 className="font-bold text-lg">{habit.name}</h3>
                      <p className="text-sm opacity-90 capitalize">{habit.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(habit.id)}
                    className="text-white/70 hover:text-white text-sm"
                  >
                    ×
                  </button>
                </div>

                {habit.description && (
                  <p className="text-sm opacity-90 mb-4">{habit.description}</p>
                )}

                <div className="flex justify-between items-center mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{habit.streak}</div>
                    <div className="text-xs opacity-80">Current Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{habit.longestStreak}</div>
                    <div className="text-xs opacity-80">Best Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{habit.completions.length}</div>
                    <div className="text-xs opacity-80">Total</div>
                  </div>
                </div>

                <button
                  onClick={() => completedToday ? handleUncompleteHabit(habit.id) : handleCompleteHabit(habit.id)}
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                    completedToday
                      ? 'bg-white/30 hover:bg-white/20 text-white'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  {completedToday ? '↶ Undo Complete' : 'Mark Complete'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HabitsView;
import React, { useState, useEffect } from 'react';
import * as api from '../api/client';

const HomeView = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    todos: { total: 0, pending: 0, inProgress: 0, completed: 0 },
    media: { total: 0, watching: 0, completed: 0 },
    sports: { total: 0 },
    habits: { total: 0, completedToday: 0, currentStreak: 0 },
    loading: true
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const [todos, media, sports, habits] = await Promise.all([
        api.getTodos().catch(() => []),
        api.getLibrary().catch(() => []),
        api.getSportsLibrary().catch(() => []),
        api.getHabits().catch(() => [])
      ]);

      const todoStats = {
        total: todos.length,
        pending: todos.filter(t => t.status === 'todo').length,
        inProgress: todos.filter(t => t.status === 'in-progress').length,
        completed: todos.filter(t => t.status === 'done').length
      };

      const mediaStats = {
        total: media.length,
        watching: media.filter(m => m.status === 'watching' || m.status === 'plan_to_watch').length,
        completed: media.filter(m => m.status === 'completed').length
      };

      const today = new Date().toISOString().split('T')[0];
      const habitsStats = {
        total: habits.length,
        completedToday: habits.filter(h => h.completions.some(c => c.date === today)).length,
        currentStreak: habits.reduce((sum, h) => sum + h.streak, 0)
      };

      setStats({
        todos: todoStats,
        media: mediaStats,
        sports: { total: sports.length },
        habits: habitsStats,
        loading: false
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const navigationCards = [
    {
      id: 'todos',
      title: 'Todos',
      description: 'Manage your tasks and goals',
      icon: '✅',
      gradient: 'from-purple-600 to-purple-800',
      stats: [
        { label: 'Pending', value: stats.todos.pending, color: 'text-yellow-400' },
        { label: 'In Progress', value: stats.todos.inProgress, color: 'text-blue-400' },
        { label: 'Completed', value: stats.todos.completed, color: 'text-green-400' }
      ]
    },
    {
      id: 'habits',
      title: 'Habits',
      description: 'Build positive daily routines',
      icon: '🎯',
      gradient: 'from-emerald-600 to-teal-800',
      stats: [
        { label: 'Total Habits', value: stats.habits.total, color: 'text-emerald-400' },
        { label: 'Completed Today', value: stats.habits.completedToday, color: 'text-green-400' },
        { label: 'Total Streaks', value: stats.habits.currentStreak, color: 'text-yellow-400' }
      ]
    },
    {
      id: 'research',
      title: 'Research Hub',
      description: 'CS papers from arXiv with curation',
      icon: '📝',
      gradient: 'from-cyan-600 to-blue-800',
      stats: []
    },
    {
      id: 'library',
      title: 'Media Library',
      description: 'Track movies, shows, books & more',
      icon: '📚',
      gradient: 'from-blue-600 to-blue-800',
      stats: [
        { label: 'Total Items', value: stats.media.total, color: 'text-blue-400' },
        { label: 'Currently Watching', value: stats.media.watching, color: 'text-yellow-400' },
        { label: 'Completed', value: stats.media.completed, color: 'text-green-400' }
      ]
    },
    {
      id: 'sports-library',
      title: 'Sports',
      description: 'Follow your favorite teams & games',
      icon: '🏈',
      gradient: 'from-orange-600 to-orange-800',
      stats: [
        { label: 'Total Items', value: stats.sports.total, color: 'text-orange-400' }
      ]
    },
    {
      id: 'highlights',
      title: 'Highlights',
      description: 'Discover and save sports highlights',
      icon: '✨',
      gradient: 'from-green-600 to-green-800',
      stats: []
    }
  ];

  const quickActions = [
    { label: 'Add Todo', action: () => onNavigate('todos'), icon: '➕', color: 'bg-purple-600 hover:bg-purple-700' },
    { label: 'Add Habit', action: () => onNavigate('habits'), icon: '🎯', color: 'bg-emerald-600 hover:bg-emerald-700' },
    { label: 'Fetch Papers', action: () => onNavigate('research'), icon: '📝', color: 'bg-cyan-600 hover:bg-cyan-700' },
    { label: 'Add Media', action: () => onNavigate('search'), icon: '🎬', color: 'bg-blue-600 hover:bg-blue-700' }
  ];

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Life Dashboard
        </h1>
        <p className="text-xl text-gray-300 mb-8">Your personal command center for everything that matters</p>
        
        {/* Quick Stats */}
        <div className="flex justify-center gap-8 text-center">
          <div className="bg-gray-800/50 rounded-lg p-4 min-w-24">
            <div className="text-2xl font-bold text-purple-400">{stats.todos.pending}</div>
            <div className="text-sm text-gray-400">Pending Tasks</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 min-w-24">
            <div className="text-2xl font-bold text-emerald-400">{stats.habits.completedToday}</div>
            <div className="text-sm text-gray-400">Habits Today</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 min-w-24">
            <div className="text-2xl font-bold text-blue-400">{stats.media.watching}</div>
            <div className="text-sm text-gray-400">Currently Watching</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 min-w-24">
            <div className="text-2xl font-bold text-green-400">{stats.todos.completed + stats.media.completed}</div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {navigationCards.map(card => (
          <div
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className={`bg-gradient-to-br ${card.gradient} rounded-xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">{card.icon}</div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-2">{card.title}</h3>
            <p className="text-sm opacity-90 mb-4">{card.description}</p>
            
            {card.stats.length > 0 && (
              <div className="space-y-2">
                {card.stats.map((stat, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="opacity-80">{stat.label}</span>
                    <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Quick Actions</h2>
        <div className="flex justify-center gap-4 flex-wrap">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 hover:transform hover:scale-105`}
            >
              <span className="text-lg">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-gray-400">
          <p>Activity feed coming soon...</p>
          <p className="text-sm mt-2">Track your progress across all sections</p>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
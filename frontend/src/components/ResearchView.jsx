import React, { useState, useEffect } from 'react';
import * as api from '../api/client';

const ResearchView = () => {
  const [papers, setPapers] = useState([]);
  const [config, setConfig] = useState(null);
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newArea, setNewArea] = useState({ name: '', description: '', categories: '', keywords: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [papersData, configData, categoriesData] = await Promise.all([
        api.getPapers(),
        api.getResearchConfig(),
        api.getArxivCategories()
      ]);
      setPapers(papersData);
      setConfig(configData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading research data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchPapers = async () => {
    setFetching(true);
    try {
      const result = await api.fetchNewPapers();
      await loadData();
      alert(`Fetched ${result.total_fetched} papers, added ${result.added} relevant papers`);
    } catch (error) {
      console.error('Error fetching papers:', error);
      alert('Error fetching papers');
    } finally {
      setFetching(false);
    }
  };

  const handleStatusChange = async (paperId, newStatus) => {
    try {
      await api.updatePaper(paperId, { status: newStatus });
      loadData();
    } catch (error) {
      console.error('Error updating paper:', error);
    }
  };

  const handleToggleArea = async (areaId, enabled) => {
    try {
      const updated = await api.toggleResearchArea(areaId, enabled);
      setConfig(updated);
    } catch (error) {
      console.error('Error toggling research area:', error);
    }
  };

  const handleAddArea = async (e) => {
    e.preventDefault();
    if (!newArea.name.trim()) return;
    
    try {
      const areaData = {
        name: newArea.name,
        description: newArea.description,
        categories: newArea.categories.split(',').map(c => c.trim()).filter(c => c),
        keywords: newArea.keywords.split(',').map(k => k.trim()).filter(k => k)
      };
      
      const updated = await api.addResearchArea(areaData);
      setConfig(updated);
      setNewArea({ name: '', description: '', categories: '', keywords: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding research area:', error);
      alert('Error adding research area: ' + error.response?.data?.error || error.message);
    }
  };

  const handleRemoveArea = async (areaId) => {
    if (!confirm('Are you sure you want to remove this research area?')) return;
    
    try {
      const updated = await api.removeResearchArea(areaId);
      setConfig(updated);
    } catch (error) {
      console.error('Error removing research area:', error);
    }
  };

  const handleAddTag = async (paperId, tag) => {
    const paper = papers.find(p => p.paper_id === paperId);
    if (!paper || paper.tags.includes(tag)) return;
    
    try {
      await api.updatePaper(paperId, { tags: [...paper.tags, tag] });
      loadData();
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const filteredPapers = papers.filter(paper => {
    if (filter !== 'all' && paper.status !== filter) return false;
    if (selectedTopic !== 'all' && !paper.matched_topics.includes(selectedTopic)) return false;
    return true;
  }).sort((a, b) => {
    if (a.priority !== b.priority) {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return new Date(b.published_at) - new Date(a.published_at);
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread': return 'bg-gray-600';
      case 'reading': return 'bg-blue-600';
      case 'reviewed': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  if (loading) return <div className="text-center py-8">Loading research hub...</div>;

  const allTopics = config ? [...new Set(config.research_areas.map(area => area.name))] : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">CS Research Hub</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-200"
          >
            ⚙️ Settings
          </button>
          <button
            onClick={handleFetchPapers}
            disabled={fetching}
            className="bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
          >
            {fetching ? 'Fetching...' : 'Fetch New Papers'}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && config && (
        <div className="bg-gray-800 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Research Areas</h3>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
            >
              + Add Area
            </button>
          </div>
          
          {showAddForm && (
            <div className="bg-gray-700 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">Add New Research Area</h4>
              <form onSubmit={handleAddArea} className="space-y-3">
                <input
                  type="text"
                  placeholder="Research area name (e.g., Quantum Computing)"
                  value={newArea.name}
                  onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                  className="w-full p-2 bg-gray-600 rounded"
                  required
                />
                <textarea
                  placeholder="Description (e.g., Quantum algorithms and hardware)"
                  value={newArea.description}
                  onChange={(e) => setNewArea({ ...newArea, description: e.target.value })}
                  className="w-full p-2 bg-gray-600 rounded h-20"
                />
                <div>
                  <label className="block text-sm font-medium mb-2">Categories</label>
                  <input
                    type="text"
                    placeholder="e.g., cs.CR, cs.DC (comma-separated)"
                    value={newArea.categories}
                    onChange={(e) => setNewArea({ ...newArea, categories: e.target.value })}
                    className="w-full p-2 bg-gray-600 rounded mb-2"
                  />
                  {categories && (
                    <div className="bg-gray-600 p-3 rounded max-h-32 overflow-y-auto">
                      <p className="text-xs text-gray-300 mb-2">Common CS Categories:</p>
                      <div className="grid grid-cols-1 gap-1 text-xs">
                        {Object.entries(categories.categories).slice(0, 10).map(([code, name]) => (
                          <div key={code} className="flex justify-between">
                            <span className="text-blue-400">{code}</span>
                            <span className="text-gray-300">{name}</span>
                          </div>
                        ))}
                        <div className="text-gray-400 mt-1">...and {Object.keys(categories.categories).length - 10} more</div>
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Keywords (e.g., quantum, algorithm, cryptography)"
                  value={newArea.keywords}
                  onChange={(e) => setNewArea({ ...newArea, keywords: e.target.value })}
                  className="w-full p-2 bg-gray-600 rounded"
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">
                    Add Research Area
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.research_areas.map(area => (
              <div key={area.id} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{area.name}</h4>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={area.enabled !== false}
                        onChange={(e) => handleToggleArea(area.id, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">Active</span>
                    </label>
                    <button
                      onClick={() => handleRemoveArea(area.id)}
                      className="text-red-400 hover:text-red-300 text-sm ml-2"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-2">{area.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {area.categories.map(cat => (
                    <span key={cat} className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">
                      {cat}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {area.keywords.slice(0, 3).map(keyword => (
                    <span key={keyword} className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">
                      {keyword}
                    </span>
                  ))}
                  {area.keywords.length > 3 && (
                    <span className="text-xs text-gray-400">+{area.keywords.length - 3} more</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-xl">
        <div className="flex gap-4 flex-wrap">
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 bg-gray-700 rounded-lg"
            >
              <option value="all">All Papers</option>
              <option value="unread">Unread</option>
              <option value="reading">Reading</option>
              <option value="reviewed">Reviewed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Topic</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="p-2 bg-gray-700 rounded-lg"
            >
              <option value="all">All Topics</option>
              {allTopics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['unread', 'reading', 'reviewed', 'high'].map(stat => {
          const count = stat === 'high' 
            ? papers.filter(p => p.priority === 'high').length
            : papers.filter(p => p.status === stat).length;
          return (
            <div key={stat} className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400">{count}</div>
              <div className="text-sm text-gray-400 capitalize">{stat === 'high' ? 'High Priority' : stat}</div>
            </div>
          );
        })}
      </div>

      {/* Papers List */}
      <div className="space-y-4">
        {filteredPapers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-xl mb-2">No papers found</p>
            <p>Try fetching new papers or adjusting filters</p>
          </div>
        ) : (
          filteredPapers.map(paper => (
            <div
              key={paper.paper_id}
              className={`bg-gray-800 p-6 rounded-xl border-l-4 ${getPriorityColor(paper.priority)}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{paper.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {paper.authors.slice(0, 3).join(', ')}
                    {paper.authors.length > 3 && ` +${paper.authors.length - 3} more`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(paper.status)} text-white`}>
                    {paper.status}
                  </span>
                  <span className="text-xs text-gray-400">{paper.priority}</span>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-4 line-clamp-3">{paper.abstract}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {paper.matched_topics.map(topic => (
                  <span key={topic} className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">
                    {topic}
                  </span>
                ))}
                {paper.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {['unread', 'reading', 'reviewed'].filter(s => s !== paper.status).map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(paper.paper_id, status)}
                      className="text-xs bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded"
                    >
                      Mark {status}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  {paper.pdf_link && (
                    <a
                      href={paper.pdf_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white"
                    >
                      View PDF
                    </a>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(paper.published_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResearchView;
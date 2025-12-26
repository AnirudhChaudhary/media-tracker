import React, { useState } from 'react';
import * as api from '../api/client'; // your searchMedia function

export default function SearchView({ onAddToLibrary }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Metadata fields
  const [status, setStatus] = useState('plan_to_watch');
  const [userRating, setUserRating] = useState('');
  const [notes, setNotes] = useState('');
  const [startDate, setStartDate] = useState('');
  const [completeDate, setCompleteDate] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    try {
      const mediaResults = await api.searchMedia('movie', query); // adjust mediaType as needed
      setResults(mediaResults);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    if (!selectedItem) return;

    const newItem = {
      ...selectedItem,
      status,
      userRating: userRating ? Number(userRating) : null,
      notes,
      startDate: startDate || null,
      completeDate: completeDate || null,
    };

    onAddToLibrary(newItem);

    // Reset
    setSelectedItem(null);
    setResults([]);
    setQuery('');
    setStatus('plan_to_watch');
    setUserRating('');
    setNotes('');
    setStartDate('');
    setCompleteDate('');
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      {!selectedItem && (
        <>
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search media..."
              className="flex-1 px-2 py-1 rounded bg-gray-700 text-gray-100"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-1 bg-blue-600 rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>
          {loading && <div>Loading...</div>}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="cursor-pointer bg-gray-800 rounded overflow-hidden hover:ring-2 hover:ring-blue-500 transition"
                >
                {item.poster ? (
                    <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                    />
                ) : (
                    <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                )}
                <div className="p-2 text-sm text-gray-100 font-medium line-clamp-1">{item.title}</div>
                </div>

            ))}
          </div>
        </>
      )}

      {/* Metadata Form */}
      {selectedItem && (
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-lg font-semibold">{selectedItem.title}</h3>

          <div className="flex flex-col gap-2 mt-2">
            <label>
              Status:
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="ml-2 bg-gray-700 text-gray-100 rounded px-2"
              >
                <option value="plan_to_watch">Plan to Watch</option>
                <option value="watching">Watching</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
                <option value="dropped">Dropped</option>
              </select>
            </label>

            <label>
              Rating (0-10):
              <input
                type="number"
                min="0"
                max="10"
                value={userRating}
                onChange={(e) => setUserRating(e.target.value)}
                className="ml-2 bg-gray-700 text-gray-100 rounded px-2 w-20"
              />
            </label>

            <label>
              Notes:
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="ml-2 bg-gray-700 text-gray-100 rounded px-2 py-1 w-full"
              />
            </label>

            <label>
              Start Date:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="ml-2 bg-gray-700 text-gray-100 rounded px-2"
              />
            </label>

            <label>
              Complete Date:
              <input
                type="date"
                value={completeDate}
                onChange={(e) => setCompleteDate(e.target.value)}
                className="ml-2 bg-gray-700 text-gray-100 rounded px-2"
              />
            </label>
          </div>

          <button
            onClick={handleAdd}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Add to Library
          </button>
        </div>
      )}
    </div>
  );
}

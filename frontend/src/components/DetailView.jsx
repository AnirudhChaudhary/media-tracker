import React from 'react';

export default function DetailView({ item, onBack, onUpdate, onDelete }) {
  const handleChange = (field, value) => {
    onUpdate(item.id, { [field]: value });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
      <button
        className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
        onClick={onBack}
      >
        ← Back
      </button>

      <div className="flex gap-6">
        {item.poster && (
          <img
            src={item.poster}
            alt={item.title}
            className="w-48 rounded shadow"
          />
        )}
        <div className="flex-1 space-y-2">
          <h2 className="text-2xl font-bold">{item.title} ({item.year})</h2>
          <p className="text-gray-300">{item.overview}</p>

          <div className="space-y-2">
            {/* Status */}
            <label>
              Status:
              <select
                value={item.status || 'plan_to_watch'}
                onChange={(e) => handleChange('status', e.target.value)}
                className="ml-2 p-1 rounded bg-gray-700"
              >
                <option value="plan_to_watch">Plan to Watch</option>
                <option value="watching">Watching</option>
                <option value="completed">Completed</option>
              </select>
            </label>

            {/* Start Date */}
            <label>
              Start Date:
              <input
                type="date"
                value={item.startDate?.substring(0,10) || ''}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="ml-2 p-1 rounded bg-gray-700"
              />
            </label>

            {/* Complete Date */}
            <label>
              Complete Date:
              <input
                type="date"
                value={item.completeDate?.substring(0,10) || ''}
                onChange={(e) => handleChange('completeDate', e.target.value)}
                className="ml-2 p-1 rounded bg-gray-700"
              />
            </label>

            {/* User Rating */}
            <label>
              Rating (0–10):
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={item.userRating || ''}
                onChange={(e) => handleChange('userRating', parseFloat(e.target.value))}
                className="ml-2 p-1 rounded bg-gray-700 w-20"
              />
            </label>

            {/* Progress */}
            <label>
              Progress:
              <input
                type="number"
                min="0"
                value={item.progress || ''}
                onChange={(e) => handleChange('progress', parseInt(e.target.value))}
                className="ml-2 p-1 rounded bg-gray-700 w-20"
              />
            </label>

            {/* Notes */}
            <label className="block">
              Notes:
              <textarea
                value={item.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="w-full p-2 rounded bg-gray-700 mt-1 text-gray-100"
                rows={4}
              />
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onDelete(item.id)}
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

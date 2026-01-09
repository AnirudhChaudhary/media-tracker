import { useState, useEffect } from 'react';
import { relationshipsApi } from '../api/relationships';

export default function RelationshipsView() {
  const [relationships, setRelationships] = useState([]);
  const [categories, setCategories] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'friend',
    notes: '',
    contactInterval: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [relationshipsData, categoriesData] = await Promise.all([
      relationshipsApi.getAll(),
      relationshipsApi.getCategories()
    ]);
    setRelationships(relationshipsData);
    setCategories(categoriesData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await relationshipsApi.create(formData);
    setFormData({ name: '', category: 'friend', notes: '', contactInterval: '' });
    setShowForm(false);
    loadData();
  };

  const handleLogContact = async (id) => {
    await relationshipsApi.logContact(id);
    loadData();
  };

  const overdue = relationships.filter(r => r.isOverdue);
  const upcoming = relationships.filter(r => !r.isOverdue);

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Relationships</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Person
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded mb-6 border border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
            >
              {Object.entries(categories).map(([key, cat]) => (
                <option key={key} value={key} className="bg-gray-700 text-white">{cat.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Contact interval (days)"
              value={formData.contactInterval}
              onChange={(e) => setFormData({...formData, contactInterval: e.target.value})}
              className="p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
            />
          </div>
          <div className="mt-4">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600">
              Add
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
              Cancel
            </button>
          </div>
        </form>
      )}

      {overdue.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-red-600 mb-3">Overdue ({overdue.length})</h2>
          <div className="grid gap-3">
            {overdue.map(person => (
              <PersonCard key={person.id} person={person} categories={categories} onLogContact={handleLogContact} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-3">Up to Date ({upcoming.length})</h2>
        <div className="grid gap-3">
          {upcoming.map(person => (
            <PersonCard key={person.id} person={person} categories={categories} onLogContact={handleLogContact} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PersonCard({ person, categories, onLogContact }) {
  const categoryName = categories[person.category]?.name || person.category;
  const nextDue = new Date(person.nextContactDue).toLocaleDateString();
  
  return (
    <div className={`p-4 border rounded-lg ${person.isOverdue ? 'border-red-500 bg-red-900/20' : 'border-gray-600 bg-gray-800/50'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{person.name}</h3>
          <p className="text-sm text-gray-600">{categoryName} • Every {person.contactInterval} days</p>
          <p className="text-sm text-gray-500">
            Last contact: {person.daysSinceLastContact} days ago • Next due: {nextDue}
          </p>
          {person.notes && <p className="text-sm mt-1">{person.notes}</p>}
        </div>
        <button
          onClick={() => onLogContact(person.id)}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
        >
          Log Contact
        </button>
      </div>
    </div>
  );
}
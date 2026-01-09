const API_BASE = 'http://localhost:3001/api';

export const relationshipsApi = {
  getAll: () => fetch(`${API_BASE}/relationships`).then(res => res.json()),
  getCategories: () => fetch(`${API_BASE}/relationships/categories`).then(res => res.json()),
  create: (data) => fetch(`${API_BASE}/relationships`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  update: (id, data) => fetch(`${API_BASE}/relationships/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  logContact: (id) => fetch(`${API_BASE}/relationships/${id}/contact`, {
    method: 'POST'
  }).then(res => res.json()),
  delete: (id) => fetch(`${API_BASE}/relationships/${id}`, {
    method: 'DELETE'
  })
};
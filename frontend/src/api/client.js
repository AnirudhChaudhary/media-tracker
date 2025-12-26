import axios from 'axios';

const API_BASE = '/api';

export async function searchMedia(mediaType, query) {
  const response = await axios.get(`${API_BASE}/search/${mediaType}`, {
    params: { query }
  });
  return response.data;
}

export async function getLibrary() {
  const response = await axios.get(`${API_BASE}/media`);
  return response.data;
}

export async function getMedia(id) {
  const response = await axios.get(`${API_BASE}/media/${id}`);
  return response.data;
}

export async function addMedia(item) {
//   console.log('WRITING TO:', DB_PATH);
  const response = await axios.post(`${API_BASE}/media`, item);
  return response.data;
}

export async function updateMedia(id, updates) {
  const response = await axios.patch(`${API_BASE}/media/${id}`, updates);
  return response.data;
}

export async function deleteMedia(id) {
  await axios.delete(`${API_BASE}/media/${id}`);
}
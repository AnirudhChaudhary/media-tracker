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

// Sports Media API functions
export async function getSportsLibrary() {
  const response = await axios.get(`${API_BASE}/sports`);
  return response.data;
}

export async function getSportsMedia(id) {
  const response = await axios.get(`${API_BASE}/sports/${id}`);
  return response.data;
}

export async function addSportsMedia(item) {
  const response = await axios.post(`${API_BASE}/sports`, item);
  return response.data;
}

export async function updateSportsMedia(id, updates) {
  const response = await axios.patch(`${API_BASE}/sports/${id}`, updates);
  return response.data;
}

export async function deleteSportsMedia(id) {
  await axios.delete(`${API_BASE}/sports/${id}`);
}

// Teams API functions
export async function getTeams() {
  const response = await axios.get(`${API_BASE}/teams`);
  return response.data;
}

export async function addTeam(team) {
  const response = await axios.post(`${API_BASE}/teams`, team);
  return response.data;
}

export async function deleteTeam(id) {
  await axios.delete(`${API_BASE}/teams/${id}`);
}

// Highlights API functions
export async function searchHighlights(team, date, sport) {
  const params = { team };
  if (date) params.date = date;
  if (sport) params.sport = sport;
  
  const response = await axios.get(`${API_BASE}/highlights`, { params });
  return response.data;
}

export async function discoverHighlights() {
  const response = await axios.get(`${API_BASE}/highlights/discover`);
  return response.data;
}

// Saved Highlights API functions
export async function getSavedHighlights() {
  const response = await axios.get(`${API_BASE}/saved-highlights`);
  return response.data;
}

export async function saveHighlight(highlight) {
  const response = await axios.post(`${API_BASE}/saved-highlights`, highlight);
  return response.data;
}

export async function updateSavedHighlight(id, updates) {
  const response = await axios.patch(`${API_BASE}/saved-highlights/${id}`, updates);
  return response.data;
}

export async function deleteSavedHighlight(id) {
  await axios.delete(`${API_BASE}/saved-highlights/${id}`);
}

// Trusted Channels API functions
export async function getTrustedChannels() {
  const response = await axios.get(`${API_BASE}/saved-highlights/trusted-channels`);
  return response.data;
}

export async function addTrustedChannel(channelName) {
  const response = await axios.post(`${API_BASE}/saved-highlights/trusted-channels`, { channelName });
  return response.data;
}

export async function removeTrustedChannel(channelName) {
  await axios.delete(`${API_BASE}/saved-highlights/trusted-channels/${encodeURIComponent(channelName)}`);
}

// Todos API functions
export async function getTodos() {
  const response = await axios.get(`${API_BASE}/todos`);
  return response.data;
}

export async function getTodo(id) {
  const response = await axios.get(`${API_BASE}/todos/${id}`);
  return response.data;
}

export async function addTodo(todo) {
  const response = await axios.post(`${API_BASE}/todos`, todo);
  return response.data;
}

export async function updateTodo(id, updates) {
  const response = await axios.patch(`${API_BASE}/todos/${id}`, updates);
  return response.data;
}

export async function deleteTodo(id) {
  await axios.delete(`${API_BASE}/todos/${id}`);
}
// Habits API functions
export async function getHabits() {
  const response = await axios.get(`${API_BASE}/habits`);
  return response.data;
}

export async function getHabit(id) {
  const response = await axios.get(`${API_BASE}/habits/${id}`);
  return response.data;
}

export async function addHabit(habit) {
  const response = await axios.post(`${API_BASE}/habits`, habit);
  return response.data;
}

export async function updateHabit(id, updates) {
  const response = await axios.patch(`${API_BASE}/habits/${id}`, updates);
  return response.data;
}

export async function completeHabit(id, date) {
  const response = await axios.post(`${API_BASE}/habits/${id}/complete`, { date });
  return response.data;
}

export async function deleteHabit(id) {
  await axios.delete(`${API_BASE}/habits/${id}`);
}
export async function uncompleteHabit(id, date) {
  const response = await axios.post(`${API_BASE}/habits/${id}/uncomplete`, { date });
  return response.data;
}
// Papers API functions
export async function getPapers() {
  const response = await axios.get(`${API_BASE}/papers`);
  return response.data;
}

export async function getResearchConfig() {
  const response = await axios.get(`${API_BASE}/papers/config`);
  return response.data;
}

export async function fetchNewPapers() {
  const response = await axios.post(`${API_BASE}/papers/fetch`);
  return response.data;
}

export async function updatePaper(id, updates) {
  const response = await axios.patch(`${API_BASE}/papers/${id}`, updates);
  return response.data;
}

export async function deletePaper(id) {
  await axios.delete(`${API_BASE}/papers/${id}`);
}
export async function updateResearchConfig(updates) {
  const response = await axios.patch(`${API_BASE}/papers/config`, updates);
  return response.data;
}

export async function toggleResearchArea(areaId, enabled) {
  const response = await axios.post(`${API_BASE}/papers/areas/${areaId}/toggle`, { enabled });
  return response.data;
}
export async function addResearchArea(areaData) {
  const response = await axios.post(`${API_BASE}/papers/areas`, areaData);
  return response.data;
}

export async function removeResearchArea(areaId) {
  const response = await axios.delete(`${API_BASE}/papers/areas/${areaId}`);
  return response.data;
}
export async function getArxivCategories() {
  const response = await axios.get(`${API_BASE}/papers/categories`);
  return response.data;
}
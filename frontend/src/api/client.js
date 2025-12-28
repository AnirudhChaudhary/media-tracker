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
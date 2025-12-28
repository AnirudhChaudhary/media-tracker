import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HIGHLIGHTS_DB_PATH = path.join(__dirname, '../../data/highlights.json');

async function initHighlightsDB() {
  try {
    await fs.access(HIGHLIGHTS_DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(HIGHLIGHTS_DB_PATH), { recursive: true });
    await fs.writeFile(HIGHLIGHTS_DB_PATH, JSON.stringify({ 
      highlights: [], 
      searchHistory: [],
      blacklist: [],
      trustedChannels: []
    }, null, 2));
  }
}

export async function getAllHighlights() {
  await initHighlightsDB();
  const data = await fs.readFile(HIGHLIGHTS_DB_PATH, 'utf-8');
  return JSON.parse(data).highlights;
}

export async function saveHighlight(highlight) {
  await initHighlightsDB();
  const data = await fs.readFile(HIGHLIGHTS_DB_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  const savedHighlight = {
    ...highlight,
    savedAt: new Date().toISOString(),
    watched: false
  };
  
  // Avoid duplicates
  const exists = db.highlights.find(h => h.id === highlight.id);
  if (!exists) {
    db.highlights.push(savedHighlight);
    await fs.writeFile(HIGHLIGHTS_DB_PATH, JSON.stringify(db, null, 2));
  }
  
  return savedHighlight;
}

export async function updateHighlight(id, updates) {
  await initHighlightsDB();
  const data = await fs.readFile(HIGHLIGHTS_DB_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  const index = db.highlights.findIndex(h => h.id === id);
  if (index !== -1) {
    db.highlights[index] = { ...db.highlights[index], ...updates };
    await fs.writeFile(HIGHLIGHTS_DB_PATH, JSON.stringify(db, null, 2));
    return db.highlights[index];
  }
  return null;
}

export async function getSearchHistory() {
  await initHighlightsDB();
  const data = await fs.readFile(HIGHLIGHTS_DB_PATH, 'utf-8');
  return JSON.parse(data).searchHistory;
}

export async function addSearchHistory(team, date, sport) {
  await initHighlightsDB();
  const data = await fs.readFile(HIGHLIGHTS_DB_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  const searchKey = `${team}-${date}-${sport || 'any'}`;
  const exists = db.searchHistory.find(s => s.searchKey === searchKey);
  
  if (!exists) {
    db.searchHistory.push({
      searchKey,
      team,
      date,
      sport,
      searchedAt: new Date().toISOString()
    });
    await fs.writeFile(HIGHLIGHTS_DB_PATH, JSON.stringify(db, null, 2));
  }
}

export async function deleteHighlight(id) {
  await initHighlightsDB();
  const data = await fs.readFile(HIGHLIGHTS_DB_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  // Add to blacklist before deleting
  if (!db.blacklist) db.blacklist = [];
  const highlight = db.highlights.find(h => h.id === id);
  if (highlight && !db.blacklist.includes(id)) {
    db.blacklist.push(id);
  }
  
  db.highlights = db.highlights.filter(h => h.id !== id);
  await fs.writeFile(HIGHLIGHTS_DB_PATH, JSON.stringify(db, null, 2));
  return true;
}

export async function getBlacklist() {
  await initHighlightsDB();
  const data = await fs.readFile(HIGHLIGHTS_DB_PATH, 'utf-8');
  const db = JSON.parse(data);
  return db.blacklist || [];
}

export async function getTrustedChannels() {
  await initHighlightsDB();
  const data = await fs.readFile(HIGHLIGHTS_DB_PATH, 'utf-8');
  const db = JSON.parse(data);
  return db.trustedChannels || [];
}

export async function addTrustedChannel(channelName) {
  await initHighlightsDB();
  const data = await fs.readFile(HIGHLIGHTS_DB_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  if (!db.trustedChannels) db.trustedChannels = [];
  if (!db.trustedChannels.includes(channelName)) {
    db.trustedChannels.push(channelName);
    await fs.writeFile(HIGHLIGHTS_DB_PATH, JSON.stringify(db, null, 2));
  }
}

export async function removeTrustedChannel(channelName) {
  await initHighlightsDB();
  const data = await fs.readFile(HIGHLIGHTS_DB_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  if (!db.trustedChannels) db.trustedChannels = [];
  db.trustedChannels = db.trustedChannels.filter(channel => channel !== channelName);
  await fs.writeFile(HIGHLIGHTS_DB_PATH, JSON.stringify(db, null, 2));
}
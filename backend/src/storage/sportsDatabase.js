import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SPORTS_DB_PATH = path.join(__dirname, '../../data/sports.json');

async function initSportsDB() {
  try {
    await fs.access(SPORTS_DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(SPORTS_DB_PATH), { recursive: true });
    await fs.writeFile(SPORTS_DB_PATH, JSON.stringify({ sports: [] }, null, 2));
  }
}

export async function getAllSportsMedia() {
  await initSportsDB();
  const data = await fs.readFile(SPORTS_DB_PATH, 'utf-8');
  return JSON.parse(data).sports;
}

export async function getSportsMediaById(id) {
  const sports = await getAllSportsMedia();
  return sports.find(item => item.id === id);
}

export async function addSportsMedia(item) {
  await initSportsDB();
  const data = await fs.readFile(SPORTS_DB_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  const newItem = {
    ...item,
    id: `sports_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    addedDate: new Date().toISOString()
  };
  
  db.sports.push(newItem);
  await fs.writeFile(SPORTS_DB_PATH, JSON.stringify(db, null, 2));
  return newItem;
}

export async function updateSportsMedia(id, updates) {
  await initSportsDB();
  const data = await fs.readFile(SPORTS_DB_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  const index = db.sports.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  db.sports[index] = { ...db.sports[index], ...updates };
  await fs.writeFile(SPORTS_DB_PATH, JSON.stringify(db, null, 2));
  return db.sports[index];
}

export async function deleteSportsMedia(id) {
  await initSportsDB();
  const data = await fs.readFile(SPORTS_DB_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  db.sports = db.sports.filter(item => item.id !== id);
  await fs.writeFile(SPORTS_DB_PATH, JSON.stringify(db, null, 2));
  return true;
}
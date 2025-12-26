import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../../data/media.json');

// Initialize database file if it doesn't exist
async function initDB() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify({ media: [] }, null, 2));
  }
}

export async function getAllMedia() {
  await initDB();
  const data = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(data).media;
}

export async function getMediaById(id) {
  const media = await getAllMedia();
  return media.find(item => item.id === id);
}

export async function addMedia(item) {
  await initDB();
  const data = await fs.readFile(DB_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  const newItem = {
    ...item,
    status: item.status ?? 'plan_to_watch',
    startDate: item.startDate ?? null,
    completeDate: item.completeDate ?? null,
    userRating: item.userRating ?? null,
    notes: item.notes ?? '',
    progress: item.progress ?? null,
    addedDate: new Date().toISOString()
  };
  
  db.media.push(newItem);
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  return newItem;
}

export async function updateMedia(id, updates) {
  await initDB();
  const data = await fs.readFile(DB_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  const index = db.media.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  db.media[index] = { ...db.media[index], ...updates };
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  return db.media[index];
}

export async function deleteMedia(id) {
  await initDB();
  const data = await fs.readFile(DB_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  db.media = db.media.filter(item => item.id !== id);
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  return true;
}
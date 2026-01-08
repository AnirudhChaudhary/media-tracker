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

const TODOS_PATH = path.join(__dirname, '../../data/todos.json');

async function initTodosDB() {
  try {
    await fs.access(TODOS_PATH);
  } catch {
    await fs.mkdir(path.dirname(TODOS_PATH), { recursive: true });
    await fs.writeFile(TODOS_PATH, JSON.stringify({ todos: [] }, null, 2));
  }
}

export async function getAllTodos() {
  await initTodosDB();
  const data = await fs.readFile(TODOS_PATH, 'utf-8');
  return JSON.parse(data).todos;
}

export async function getTodoById(id) {
  const todos = await getAllTodos();
  return todos.find(item => item.id === id);
}

export async function addTodo(item) {
  await initTodosDB();
  const data = await fs.readFile(TODOS_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  const newTodo = {
    id: `todo_${Date.now()}`,
    title: item.title,
    description: item.description || '',
    status: item.status || 'todo',
    priority: item.priority || 'medium',
    category: item.category || 'personal',
    createdAt: new Date().toISOString(),
    dueDate: item.dueDate || null,
    completedAt: null
  };
  
  db.todos.push(newTodo);
  await fs.writeFile(TODOS_PATH, JSON.stringify(db, null, 2));
  return newTodo;
}

export async function updateTodo(id, updates) {
  await initTodosDB();
  const data = await fs.readFile(TODOS_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  const index = db.todos.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  const updatedTodo = { ...db.todos[index], ...updates };
  if (updates.status === 'done' && !updatedTodo.completedAt) {
    updatedTodo.completedAt = new Date().toISOString();
  }
  
  db.todos[index] = updatedTodo;
  await fs.writeFile(TODOS_PATH, JSON.stringify(db, null, 2));
  return updatedTodo;
}

export async function deleteTodo(id) {
  await initTodosDB();
  const data = await fs.readFile(TODOS_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  db.todos = db.todos.filter(item => item.id !== id);
  await fs.writeFile(TODOS_PATH, JSON.stringify(db, null, 2));
  return true;
}
const HABITS_PATH = path.join(__dirname, '../../data/habits.json');

async function initHabitsDB() {
  try {
    await fs.access(HABITS_PATH);
  } catch {
    await fs.mkdir(path.dirname(HABITS_PATH), { recursive: true });
    await fs.writeFile(HABITS_PATH, JSON.stringify({ habits: [] }, null, 2));
  }
}

export async function getAllHabits() {
  await initHabitsDB();
  const data = await fs.readFile(HABITS_PATH, 'utf-8');
  return JSON.parse(data).habits;
}

export async function getHabitById(id) {
  const habits = await getAllHabits();
  return habits.find(item => item.id === id);
}

export async function addHabit(item) {
  await initHabitsDB();
  const data = await fs.readFile(HABITS_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  const newHabit = {
    id: `habit_${Date.now()}`,
    name: item.name,
    description: item.description || '',
    category: item.category || 'personal',
    frequency: item.frequency || 'daily',
    streak: 0,
    longestStreak: 0,
    completions: [],
    createdAt: new Date().toISOString()
  };
  
  db.habits.push(newHabit);
  await fs.writeFile(HABITS_PATH, JSON.stringify(db, null, 2));
  return newHabit;
}

export async function updateHabit(id, updates) {
  await initHabitsDB();
  const data = await fs.readFile(HABITS_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  const index = db.habits.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  db.habits[index] = { ...db.habits[index], ...updates };
  await fs.writeFile(HABITS_PATH, JSON.stringify(db, null, 2));
  return db.habits[index];
}

export async function deleteHabit(id) {
  await initHabitsDB();
  const data = await fs.readFile(HABITS_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  db.habits = db.habits.filter(item => item.id !== id);
  await fs.writeFile(HABITS_PATH, JSON.stringify(db, null, 2));
  return true;
}

export async function completeHabit(id, date = new Date().toISOString().split('T')[0]) {
  await initHabitsDB();
  const data = await fs.readFile(HABITS_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  const index = db.habits.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  const habit = db.habits[index];
  const existingCompletion = habit.completions.find(c => c.date === date);
  
  if (!existingCompletion) {
    habit.completions.push({ date, completed: true, completedAt: new Date().toISOString() });
    habit.completions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Calculate streak
    const today = new Date().toISOString().split('T')[0];
    let streak = 0;
    const sortedCompletions = habit.completions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    for (let i = 0; i < sortedCompletions.length; i++) {
      const completionDate = new Date(sortedCompletions[i].date);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (completionDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
        streak++;
      } else {
        break;
      }
    }
    
    habit.streak = streak;
    habit.longestStreak = Math.max(habit.longestStreak, streak);
  }
  
  await fs.writeFile(HABITS_PATH, JSON.stringify(db, null, 2));
  return habit;
}
export async function uncompleteHabit(id, date = new Date().toISOString().split('T')[0]) {
  await initHabitsDB();
  const data = await fs.readFile(HABITS_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  const index = db.habits.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  const habit = db.habits[index];
  habit.completions = habit.completions.filter(c => c.date !== date);
  
  // Recalculate streak
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  const sortedCompletions = habit.completions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  for (let i = 0; i < sortedCompletions.length; i++) {
    const completionDate = new Date(sortedCompletions[i].date);
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    
    if (completionDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
      streak++;
    } else {
      break;
    }
  }
  
  habit.streak = streak;
  
  await fs.writeFile(HABITS_PATH, JSON.stringify(db, null, 2));
  return habit;
}
const PAPERS_PATH = path.join(__dirname, '../../data/papers.json');
const RESEARCH_CONFIG_PATH = path.join(__dirname, '../../data/research-config.json');

async function initPapersDB() {
  try {
    await fs.access(PAPERS_PATH);
  } catch {
    await fs.mkdir(path.dirname(PAPERS_PATH), { recursive: true });
    await fs.writeFile(PAPERS_PATH, JSON.stringify({ papers: [] }, null, 2));
  }
}

export async function getResearchConfig() {
  const data = await fs.readFile(RESEARCH_CONFIG_PATH, 'utf-8');
  return JSON.parse(data);
}

export async function getAllPapers() {
  await initPapersDB();
  const data = await fs.readFile(PAPERS_PATH, 'utf-8');
  return JSON.parse(data).papers;
}

export async function getPaperById(id) {
  const papers = await getAllPapers();
  return papers.find(item => item.paper_id === id);
}

function calculateRelevanceScore(paper, researchAreas) {
  let score = 0;
  const titleLower = paper.title.toLowerCase();
  const abstractLower = paper.abstract.toLowerCase();
  
  for (const area of researchAreas) {
    // Category match (high weight)
    if (area.categories.some(cat => paper.categories.includes(cat))) {
      score += 10;
    }
    
    // Keyword matches in title (high weight)
    const titleMatches = area.keywords.filter(keyword => 
      titleLower.includes(keyword.toLowerCase())
    ).length;
    score += titleMatches * 5;
    
    // Keyword matches in abstract (medium weight)
    const abstractMatches = area.keywords.filter(keyword => 
      abstractLower.includes(keyword.toLowerCase())
    ).length;
    score += abstractMatches * 2;
  }
  
  return score;
}

function autoTag(paper, researchAreas) {
  const tags = [];
  const titleLower = paper.title.toLowerCase();
  const abstractLower = paper.abstract.toLowerCase();
  
  for (const area of researchAreas) {
    const hasKeywords = area.keywords.some(keyword => 
      titleLower.includes(keyword.toLowerCase()) || 
      abstractLower.includes(keyword.toLowerCase())
    );
    const hasCategory = area.categories.some(cat => paper.categories.includes(cat));
    
    if (hasKeywords || hasCategory) {
      tags.push(area.name);
    }
  }
  
  return tags;
}

export async function addPaper(paperData) {
  await initPapersDB();
  const data = await fs.readFile(PAPERS_PATH, 'utf-8');
  const db = JSON.parse(data);
  const config = await getResearchConfig();
  
  // Check for duplicates
  const exists = db.papers.find(p => p.paper_id === paperData.paper_id);
  if (exists) return exists;
  
  const relevanceScore = calculateRelevanceScore(paperData, config.research_areas);
  const autoTags = autoTag(paperData, config.research_areas);
  
  // Filter out low-relevance papers
  if (relevanceScore < 5) return null;
  
  const newPaper = {
    paper_id: paperData.paper_id,
    title: paperData.title,
    authors: paperData.authors,
    abstract: paperData.abstract,
    categories: paperData.categories,
    published_at: paperData.published_at,
    pdf_link: paperData.pdf_link,
    matched_topics: autoTags,
    tags: [],
    status: 'unread',
    relevance_score: relevanceScore,
    priority: relevanceScore > 20 ? 'high' : relevanceScore > 10 ? 'medium' : 'low',
    added_at: new Date().toISOString()
  };
  
  db.papers.push(newPaper);
  await fs.writeFile(PAPERS_PATH, JSON.stringify(db, null, 2));
  return newPaper;
}

export async function updatePaper(id, updates) {
  await initPapersDB();
  const data = await fs.readFile(PAPERS_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  const index = db.papers.findIndex(item => item.paper_id === id);
  if (index === -1) return null;
  
  db.papers[index] = { ...db.papers[index], ...updates };
  await fs.writeFile(PAPERS_PATH, JSON.stringify(db, null, 2));
  return db.papers[index];
}

export async function deletePaper(id) {
  await initPapersDB();
  const data = await fs.readFile(PAPERS_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  db.papers = db.papers.filter(item => item.paper_id !== id);
  await fs.writeFile(PAPERS_PATH, JSON.stringify(db, null, 2));
  return true;
}
export async function updateResearchConfig(updates) {
  const data = await fs.readFile(RESEARCH_CONFIG_PATH, 'utf-8');
  const config = JSON.parse(data);
  
  const updatedConfig = { ...config, ...updates };
  await fs.writeFile(RESEARCH_CONFIG_PATH, JSON.stringify(updatedConfig, null, 2));
  return updatedConfig;
}

export async function toggleResearchArea(areaId, enabled) {
  const config = await getResearchConfig();
  const areaIndex = config.research_areas.findIndex(area => area.id === areaId);
  
  if (areaIndex === -1) return null;
  
  config.research_areas[areaIndex].enabled = enabled;
  await fs.writeFile(RESEARCH_CONFIG_PATH, JSON.stringify(config, null, 2));
  return config;
}

export async function getActiveResearchAreas() {
  const config = await getResearchConfig();
  return config.research_areas.filter(area => area.enabled !== false);
}
export async function addResearchArea(areaData) {
  const config = await getResearchConfig();
  
  const newArea = {
    id: areaData.id || areaData.name.toLowerCase().replace(/\s+/g, '_'),
    name: areaData.name,
    description: areaData.description || '',
    categories: areaData.categories || [],
    keywords: areaData.keywords || [],
    enabled: true
  };
  
  // Check for duplicate IDs
  if (config.research_areas.find(area => area.id === newArea.id)) {
    throw new Error('Research area with this ID already exists');
  }
  
  config.research_areas.push(newArea);
  await fs.writeFile(RESEARCH_CONFIG_PATH, JSON.stringify(config, null, 2));
  return config;
}

export async function removeResearchArea(areaId) {
  const config = await getResearchConfig();
  const initialLength = config.research_areas.length;
  
  config.research_areas = config.research_areas.filter(area => area.id !== areaId);
  
  if (config.research_areas.length === initialLength) {
    return null; // Area not found
  }
  
  await fs.writeFile(RESEARCH_CONFIG_PATH, JSON.stringify(config, null, 2));
  return config;
}
const ARXIV_CATEGORIES_PATH = path.join(__dirname, '../../data/arxiv-categories.json');

export async function getArxivCategories() {
  const data = await fs.readFile(ARXIV_CATEGORIES_PATH, 'utf-8');
  return JSON.parse(data);
}
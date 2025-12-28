import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEAMS_DB_PATH = path.join(__dirname, '../../data/teams.json');

async function initTeamsDB() {
  try {
    await fs.access(TEAMS_DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(TEAMS_DB_PATH), { recursive: true });
    await fs.writeFile(TEAMS_DB_PATH, JSON.stringify({ teams: [] }, null, 2));
  }
}

export async function getAllTeams() {
  await initTeamsDB();
  const data = await fs.readFile(TEAMS_DB_PATH, 'utf-8');
  return JSON.parse(data).teams;
}

export async function addTeam(team) {
  await initTeamsDB();
  const data = await fs.readFile(TEAMS_DB_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  const newTeam = {
    ...team,
    id: `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    addedDate: new Date().toISOString()
  };
  
  db.teams.push(newTeam);
  await fs.writeFile(TEAMS_DB_PATH, JSON.stringify(db, null, 2));
  return newTeam;
}

export async function deleteTeam(id) {
  await initTeamsDB();
  const data = await fs.readFile(TEAMS_DB_PATH, 'utf-8');
  const db = JSON.parse(data);
  
  db.teams = db.teams.filter(team => team.id !== id);
  await fs.writeFile(TEAMS_DB_PATH, JSON.stringify(db, null, 2));
  return true;
}
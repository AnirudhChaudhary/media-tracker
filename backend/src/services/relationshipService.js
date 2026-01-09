import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../../data/relationships.json');

const CATEGORIES = {
  immediate_family: { name: 'Immediate Family', defaultInterval: 7 },
  close_friend: { name: 'Close Friend', defaultInterval: 14 },
  friend: { name: 'Friend', defaultInterval: 30 },
  extended_family: { name: 'Extended Family', defaultInterval: 60 },
  acquaintance: { name: 'Acquaintance', defaultInterval: 90 },
  professional: { name: 'Professional', defaultInterval: 180 }
};

async function readRelationships() {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeRelationships(relationships) {
  await fs.writeFile(dataPath, JSON.stringify(relationships, null, 2));
}

function calculateNextContactDue(lastContact, intervalDays) {
  const lastContactDate = new Date(lastContact);
  const nextDue = new Date(lastContactDate);
  nextDue.setDate(nextDue.getDate() + intervalDays);
  return nextDue.toISOString();
}

export async function getAllRelationships() {
  const relationships = await readRelationships();
  const now = new Date();
  
  return relationships.map(person => {
    const lastContactDate = new Date(person.lastContact);
    const daysSince = Math.floor((now - lastContactDate) / (1000 * 60 * 60 * 24));
    
    return {
      ...person,
      isOverdue: new Date(person.nextContactDue) < now,
      daysSinceLastContact: daysSince >= 0 ? daysSince : 0
    };
  });
}

export async function createRelationship(data) {
  const relationships = await readRelationships();
  const category = CATEGORIES[data.category];
  const interval = data.contactInterval || category.defaultInterval;
  const lastContact = data.lastContact || new Date().toISOString();
  
  const newRelationship = {
    id: `person-${Date.now()}`,
    name: data.name,
    category: data.category,
    contactInterval: interval,
    lastContact,
    nextContactDue: calculateNextContactDue(lastContact, interval),
    notes: data.notes || '',
    contactMethods: data.contactMethods || ['phone']
  };
  
  relationships.push(newRelationship);
  await writeRelationships(relationships);
  return newRelationship;
}

export async function updateRelationship(id, data) {
  const relationships = await readRelationships();
  const index = relationships.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  const updated = { ...relationships[index], ...data };
  
  if (data.lastContact || data.contactInterval) {
    updated.nextContactDue = calculateNextContactDue(
      updated.lastContact, 
      updated.contactInterval
    );
  }
  
  relationships[index] = updated;
  await writeRelationships(relationships);
  return updated;
}

export async function logContact(id) {
  const now = new Date().toISOString();
  return updateRelationship(id, { lastContact: now });
}

export async function deleteRelationship(id) {
  const relationships = await readRelationships();
  const filtered = relationships.filter(p => p.id !== id);
  await writeRelationships(filtered);
  return true;
}

export function getCategories() {
  return CATEGORIES;
}
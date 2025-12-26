#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.resolve(__dirname, '../backend/data/media.json');

function listMedia() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    const items = JSON.parse(raw || '[]');
    console.log('Media items:', items.length);
    items.forEach((m, i) => console.log(i + 1, m.title || m.name));
  } catch (err) {
    console.error('Could not read media data:', err.message);
  }
}

listMedia();

import express from 'express';
import * as sportsDb from '../storage/sportsDatabase.js';

const router = express.Router();

// Get all sports media
router.get('/', async (req, res) => {
  try {
    const sports = await sportsDb.getAllSportsMedia();
    res.json(sports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sports media by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await sportsDb.getSportsMediaById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Sports media not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add sports media
router.post('/', async (req, res) => {
  try {
    const newItem = await sportsDb.addSportsMedia(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update sports media
router.patch('/:id', async (req, res) => {
  try {
    const updated = await sportsDb.updateSportsMedia(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Sports media not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete sports media
router.delete('/:id', async (req, res) => {
  try {
    await sportsDb.deleteSportsMedia(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
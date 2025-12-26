import express from 'express';
import * as db from '../storage/database.js';

const router = express.Router();

// Get all media
router.get('/', async (req, res) => {
  try {
    const media = await db.getAllMedia();
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get media by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await db.getMediaById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Media not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add media
router.post('/', async (req, res) => {
  try {
    console.log('REQ BODY:', req.body);
    const newItem = await db.addMedia(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update media
router.patch('/:id', async (req, res) => {
  try {
    const updated = await db.updateMedia(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Media not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete media
router.delete('/:id', async (req, res) => {
  try {
    await db.deleteMedia(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
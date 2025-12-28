import express from 'express';
import * as highlightsDb from '../storage/highlightsDatabase.js';

const router = express.Router();

// Get all saved highlights
router.get('/', async (req, res) => {
  try {
    const highlights = await highlightsDb.getAllHighlights();
    res.json(highlights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save highlight to watchlist
router.post('/', async (req, res) => {
  try {
    const savedHighlight = await highlightsDb.saveHighlight(req.body);
    res.status(201).json(savedHighlight);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update highlight (mark as watched/unwatched)
router.patch('/:id', async (req, res) => {
  try {
    const updated = await highlightsDb.updateHighlight(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Highlight not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete saved highlight
router.delete('/:id', async (req, res) => {
  try {
    await highlightsDb.deleteHighlight(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get trusted channels
router.get('/trusted-channels', async (req, res) => {
  try {
    const channels = await highlightsDb.getTrustedChannels();
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add trusted channel
router.post('/trusted-channels', async (req, res) => {
  try {
    const { channelName } = req.body;
    await highlightsDb.addTrustedChannel(channelName);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove trusted channel
router.delete('/trusted-channels/:name', async (req, res) => {
  try {
    const channelName = decodeURIComponent(req.params.name);
    await highlightsDb.removeTrustedChannel(channelName);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
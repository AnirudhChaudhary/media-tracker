import express from 'express';
import * as relationshipService from '../services/relationshipService.js';

const router = express.Router();

// Get all relationships
router.get('/', async (req, res) => {
  try {
    const relationships = await relationshipService.getAllRelationships();
    res.json(relationships);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get categories
router.get('/categories', (req, res) => {
  res.json(relationshipService.getCategories());
});

// Create relationship
router.post('/', async (req, res) => {
  try {
    const relationship = await relationshipService.createRelationship(req.body);
    res.status(201).json(relationship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update relationship
router.put('/:id', async (req, res) => {
  try {
    const relationship = await relationshipService.updateRelationship(req.params.id, req.body);
    if (!relationship) {
      return res.status(404).json({ error: 'Relationship not found' });
    }
    res.json(relationship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Log contact
router.post('/:id/contact', async (req, res) => {
  try {
    const relationship = await relationshipService.logContact(req.params.id);
    if (!relationship) {
      return res.status(404).json({ error: 'Relationship not found' });
    }
    res.json(relationship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete relationship
router.delete('/:id', async (req, res) => {
  try {
    await relationshipService.deleteRelationship(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
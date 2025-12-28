import express from 'express';
import * as teamsDb from '../storage/teamsDatabase.js';

const router = express.Router();

// Get all favorite teams
router.get('/', async (req, res) => {
  try {
    const teams = await teamsDb.getAllTeams();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add favorite team
router.post('/', async (req, res) => {
  try {
    const newTeam = await teamsDb.addTeam(req.body);
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete favorite team
router.delete('/:id', async (req, res) => {
  try {
    await teamsDb.deleteTeam(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
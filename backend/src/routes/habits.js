import express from 'express';
import * as db from '../storage/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const habits = await db.getAllHabits();
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const habit = await db.getHabitById(req.params.id);
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newHabit = await db.addHabit(req.body);
    res.status(201).json(newHabit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const updated = await db.updateHabit(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/complete', async (req, res) => {
  try {
    const { date } = req.body;
    const updated = await db.completeHabit(req.params.id, date);
    if (!updated) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/uncomplete', async (req, res) => {
  try {
    const { date } = req.body;
    const updated = await db.uncompleteHabit(req.params.id, date);
    if (!updated) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.deleteHabit(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
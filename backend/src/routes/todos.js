import express from 'express';
import * as db from '../storage/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const todos = await db.getAllTodos();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const todo = await db.getTodoById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newTodo = await db.addTodo(req.body);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const updated = await db.updateTodo(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.deleteTodo(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
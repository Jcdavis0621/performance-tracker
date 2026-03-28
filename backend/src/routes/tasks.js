const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// ─── Get All Tasks ──────────────────────────────────────────────────────────
router.get('/', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.findAll(req.user.userId);
    res.json(tasks);
  } catch (error) {
    console.error('Fetch tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// ─── Get Task by Quarter ────────────────────────────────────────────────────
router.get('/quarter/:quarter', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.getByQuarter(req.user.userId, req.params.quarter);
    res.json(tasks);
  } catch (error) {
    console.error('Fetch quarter tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// ─── Get Task by ID ─────────────────────────────────────────────────────────
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id, req.user.userId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error('Fetch task error:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// ─── Create Task ────────────────────────────────────────────────────────────
router.post('/',
  verifyToken,
  body('name').notEmpty(),
  body('status').notEmpty(),
  body('priority').notEmpty(),
  body('pie').notEmpty(),
  body('quarter').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const task = await Task.create(req.user.userId, req.body);
      res.status(201).json(task);
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  }
);

// ─── Update Task ────────────────────────────────────────────────────────────
router.put('/:id',
  verifyToken,
  body('name').optional().notEmpty(),
  body('status').optional().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const task = await Task.update(req.params.id, req.user.userId, req.body);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  }
);

// ─── Delete Task ────────────────────────────────────────────────────────────
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Task.delete(req.params.id, req.user.userId);
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// ─── Get Stats ──────────────────────────────────────────────────────────────
router.get('/stats/overview', verifyToken, async (req, res) => {
  try {
    const stats = await Task.getStats(req.user.userId);
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;

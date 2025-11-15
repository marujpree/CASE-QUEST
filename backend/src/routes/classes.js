const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

// GET all classes for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const classes = await Class.findAll(req.params.userId);
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET class by ID
router.get('/:id', async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json(classItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create class
router.post('/', async (req, res) => {
  try {
    const { userId, name, code, description, instructor } = req.body;
    
    if (!userId || !name) {
      return res.status(400).json({ error: 'User ID and class name are required' });
    }

    const classItem = await Class.create(userId, name, code, description, instructor);
    res.status(201).json(classItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update class
router.put('/:id', async (req, res) => {
  try {
    const { name, code, description, instructor } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Class name is required' });
    }

    const classItem = await Class.update(req.params.id, name, code, description, instructor);
    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json(classItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE class
router.delete('/:id', async (req, res) => {
  try {
    await Class.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

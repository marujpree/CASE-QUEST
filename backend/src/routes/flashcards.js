const express = require('express');
const router = express.Router();
const Flashcard = require('../models/Flashcard');

// GET all flashcards for a set
router.get('/set/:setId', async (req, res) => {
  try {
    const flashcards = await Flashcard.findBySetId(req.params.setId);
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET flashcard by ID
router.get('/:id', async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id);
    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    res.json(flashcard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create flashcard
router.post('/', async (req, res) => {
  try {
    const { flashcardSetId, question, answer, difficulty } = req.body;
    
    if (!flashcardSetId || !question || !answer) {
      return res.status(400).json({ error: 'Flashcard set ID, question, and answer are required' });
    }

    const flashcard = await Flashcard.create(flashcardSetId, question, answer, difficulty);
    res.status(201).json(flashcard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update flashcard
router.put('/:id', async (req, res) => {
  try {
    const { question, answer, difficulty } = req.body;
    
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }

    const flashcard = await Flashcard.update(req.params.id, question, answer, difficulty);
    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    res.json(flashcard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE flashcard
router.delete('/:id', async (req, res) => {
  try {
    await Flashcard.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const FlashcardSet = require('../models/FlashcardSet');
const Flashcard = require('../models/Flashcard');
const { generateFlashcardsByTopic } = require('../utils/flashcardGenerator');

// GET all flashcard sets for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const sets = await FlashcardSet.findAll(req.params.userId);
    res.json(sets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET flashcard set by ID
router.get('/:id', async (req, res) => {
  try {
    const set = await FlashcardSet.findById(req.params.id);
    if (!set) {
      return res.status(404).json({ error: 'Flashcard set not found' });
    }
    res.json(set);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create flashcard set
router.post('/', async (req, res) => {
  try {
    const { userId, classId, title, description } = req.body;
    
    if (!userId || !title) {
      return res.status(400).json({ error: 'User ID and title are required' });
    }

    const set = await FlashcardSet.create(userId, classId, title, description);
    res.status(201).json(set);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create flashcard set with AI-generated cards
router.post('/generate', async (req, res) => {
  try {
    const { userId, classId, title, description, topic, count } = req.body;
    
    if (!userId || !title || !topic) {
      return res.status(400).json({ error: 'User ID, title, and topic are required' });
    }

    // Create the flashcard set
    const set = await FlashcardSet.create(userId, classId, title, description);
    
    // Generate flashcards
    const generatedCards = generateFlashcardsByTopic(topic, count || 5);
    
    // Create flashcards in database
    const flashcards = [];
    for (const card of generatedCards) {
      const flashcard = await Flashcard.create(
        set.id,
        card.question,
        card.answer,
        card.difficulty
      );
      flashcards.push(flashcard);
    }
    
    res.status(201).json({ set, flashcards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update flashcard set
router.put('/:id', async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const set = await FlashcardSet.update(req.params.id, title, description);
    if (!set) {
      return res.status(404).json({ error: 'Flashcard set not found' });
    }
    res.json(set);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE flashcard set
router.delete('/:id', async (req, res) => {
  try {
    await FlashcardSet.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

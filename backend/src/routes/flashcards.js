const express = require('express');
const router = express.Router();
const Flashcard = require('../models/Flashcard');
const FlashcardSet = require('../models/FlashcardSet');
const { generateFlashcards, generateFlashcardsByTopic } = require('../utils/flashcardGenerator');

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

// POST generate flashcards from topic/notes
router.post('/generate', async (req, res) => {
  try {
    const { userId, classId, topic, notes, count = 10, title, description } = req.body;
    
    if (!userId || (!topic && !notes)) {
      return res.status(400).json({ error: 'User ID and either topic or notes are required' });
    }

    // Create flashcard set
    const setTitle = title || `Flashcards: ${topic || 'Generated'}`;
    const normalizedUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    const normalizedClassId = classId === '' || classId === undefined ? null : (typeof classId === 'string' ? parseInt(classId, 10) : classId);
    const set = await FlashcardSet.create(normalizedUserId, normalizedClassId, setTitle, description || `Generated flashcards for ${topic || 'your notes'}`);
    
    // Generate flashcards using AI
    let generatedCards;
    if (notes) {
      // Generate from notes content
      generatedCards = await generateFlashcards(notes, count);
    } else {
      // Generate from topic
      generatedCards = await generateFlashcardsByTopic(topic, count);
    }
    
    // Create flashcards in database
    const flashcards = [];
    for (const card of generatedCards) {
      const flashcard = await Flashcard.create(
        set.id,
        card.question,
        card.answer,
        card.difficulty || 'medium'
      );
      flashcards.push(flashcard);
    }
    
    res.status(201).json({ 
      message: 'Flashcards generated successfully',
      set, 
      flashcards 
    });
  } catch (error) {
    console.error('Error in /generate route:', error);
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
});

// PATCH update flashcard review status
router.patch('/:id/review', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['got_it', 'forgot'].includes(status)) {
      return res.status(400).json({ error: 'Status must be "got_it" or "forgot"' });
    }

    const flashcard = await Flashcard.updateReview(req.params.id, status);
    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    
    res.json(flashcard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

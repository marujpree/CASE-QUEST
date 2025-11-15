const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const { processEmail } = require('../utils/emailParser');

// GET all alerts for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const alerts = await Alert.findAll(req.params.userId);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET alert by ID
router.get('/:id', async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create alert manually
router.post('/', async (req, res) => {
  try {
    const { userId, classId, type, title, message, emailSubject, emailFrom } = req.body;
    
    if (!userId || !type || !title || !message) {
      return res.status(400).json({ error: 'User ID, type, title, and message are required' });
    }

    const alert = await Alert.create(userId, classId, type, title, message, emailSubject, emailFrom);
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST process email and create alert
router.post('/process-email', async (req, res) => {
  try {
    const { userId, classId, from, subject, body } = req.body;
    
    if (!userId || !from || !subject || !body) {
      return res.status(400).json({ error: 'User ID, from, subject, and body are required' });
    }

    const alertData = processEmail(from, subject, body);
    
    if (!alertData) {
      return res.status(200).json({ message: 'No important updates detected in email' });
    }

    const alert = await Alert.create(
      userId,
      classId,
      alertData.type,
      alertData.title,
      alertData.message,
      alertData.emailSubject,
      alertData.emailFrom
    );
    
    res.status(201).json({ message: 'Alert created from email', alert });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH mark alert as read
router.patch('/:id/read', async (req, res) => {
  try {
    const alert = await Alert.markAsRead(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE alert
router.delete('/:id', async (req, res) => {
  try {
    await Alert.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

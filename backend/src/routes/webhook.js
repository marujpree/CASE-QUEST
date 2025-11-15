const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const { processEmail } = require('../utils/emailParser');

/**
 * Email webhook endpoint
 * Accepts JSON: {subject, body, from, to}
 * Processes email and creates alert if important update detected
 */
router.post('/email', async (req, res) => {
  try {
    const { subject, body, from, to } = req.body;
    
    if (!from || !subject || !body) {
      return res.status(400).json({ 
        error: 'Missing required fields: from, subject, and body are required' 
      });
    }

    // Process email to detect alerts
    const alertData = processEmail(from, subject, body);
    
    if (!alertData) {
      return res.status(200).json({ 
        message: 'No important updates detected in email',
        processed: false
      });
    }

    // For now, we need userId and optionally classId
    // In production, you'd look up user by email (to field)
    // For this implementation, we'll require userId in the request
    // or extract from 'to' field if user lookup is implemented
    const { userId, classId } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        error: 'userId is required to create alert. In production, user would be looked up from email address.' 
      });
    }

    // Create alert
    const alert = await Alert.create(
      userId,
      classId || null,
      alertData.type,
      alertData.title,
      alertData.message,
      alertData.emailSubject,
      alertData.emailFrom,
      alertData.urgency
    );
    
    res.status(201).json({ 
      message: 'Alert created from email',
      alert,
      processed: true
    });
  } catch (error) {
    console.error('Error processing email webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


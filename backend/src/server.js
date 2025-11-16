const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { startEventReminderService } = require('./utils/eventReminders');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const classesRouter = require('./routes/classes');
const alertsRouter = require('./routes/alerts');
const flashcardSetsRouter = require('./routes/flashcardSets');
const flashcardsRouter = require('./routes/flashcards');
const webhookRouter = require('./routes/webhook');
const eventsRouter = require('./routes/events');

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/classes', classesRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/flashcard-sets', flashcardSetsRouter);
app.use('/api/flashcards', flashcardsRouter);
app.use('/api/webhook', webhookRouter);
app.use('/api/events', eventsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Classify API is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Classify API',
    version: '1.0.0',
      endpoints: {
      auth: '/api/auth (signup, login, me)',
      users: '/api/users',
      classes: '/api/classes',
      alerts: '/api/alerts',
      flashcardSets: '/api/flashcard-sets',
      flashcards: '/api/flashcards',
      webhook: '/api/webhook/email',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Classify API server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see available endpoints`);
  
  // Start the event reminder service
  startEventReminderService();
});

module.exports = app;

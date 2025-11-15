const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const usersRouter = require('./routes/users');
const classesRouter = require('./routes/classes');
const alertsRouter = require('./routes/alerts');
const flashcardSetsRouter = require('./routes/flashcardSets');
const flashcardsRouter = require('./routes/flashcards');

app.use('/api/users', usersRouter);
app.use('/api/classes', classesRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/flashcard-sets', flashcardSetsRouter);
app.use('/api/flashcards', flashcardsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ScholarSync API is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to ScholarSync API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      classes: '/api/classes',
      alerts: '/api/alerts',
      flashcardSets: '/api/flashcard-sets',
      flashcards: '/api/flashcards',
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
  console.log(`ScholarSync API server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see available endpoints`);
});

module.exports = app;

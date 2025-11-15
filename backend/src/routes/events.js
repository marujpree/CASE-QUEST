const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { createEvents, createEvent } = require('ics');
const Event = require('../models/Event');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

function toDateParts(d) {
  return [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes()];
}

// GET events for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { from, to } = req.query;
    const userId = parseInt(req.params.userId, 10);
    const events = await Event.findAllByUser(userId, from || null, to || null);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create manual event
router.post('/', async (req, res) => {
  try {
    const { userId, title, description, location, startTime, endTime, allDay } = req.body;
    if (!userId || !title || !startTime) {
      return res.status(400).json({ error: 'userId, title, startTime are required' });
    }
    const created = await Event.create({
      userId: typeof userId === 'string' ? parseInt(userId, 10) : userId,
      title,
      description,
      location,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : null,
      allDay: !!allDay,
      source: 'manual'
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST upload PDF -> parse events
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    if (!req.file) return res.status(400).json({ error: 'PDF file is required' });

    const data = await pdfParse(req.file.buffer);
    const text = data.text || '';

    // Very simple parser: lines with formats like MM/DD/YYYY or Month DD, YYYY and optional time
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const monthNames = '(January|February|March|April|May|June|July|August|September|October|November|December)';
    const dateRe1 = new RegExp(`${monthNames}\\s+([0-3]?\\d),\\s*(\\d{4})(?:\\s+at\\s+([0-1]?\\d:[0-5]\\d)\\s*(AM|PM)?)?`, 'i');
    const dateRe2 = /(\d{1,2})\/(\d{1,2})\/(\d{2,4})(?:\s+([0-1]?\d:[0-5]\d)\s*(AM|PM)?)/i;

    const created = [];
    for (const line of lines) {
      let m = line.match(dateRe1);
      let start = null;
      if (m) {
        const months = {
          january:1,february:2,march:3,april:4,may:5,june:6,
          july:7,august:8,september:9,october:10,november:11,december:12
        };
        const mon = months[m[1].toLowerCase()];
        const day = parseInt(m[2], 10);
        const yr = parseInt(m[3], 10);
        let hr = 9, min = 0;
        if (m[4]) {
          const [h, mi] = m[4].split(':').map(x => parseInt(x, 10));
          const ampm = (m[5] || '').toUpperCase();
          hr = (ampm === 'PM' && h !== 12) ? h + 12 : (ampm === 'AM' && h === 12 ? 0 : h);
          min = mi || 0;
        }
        start = new Date(yr, mon - 1, day, hr, min, 0);
      } else if ((m = line.match(dateRe2))) {
        const mon = parseInt(m[1], 10);
        const day = parseInt(m[2], 10);
        const yr = parseInt(m[3].length === 2 ? `20${m[3]}` : m[3], 10);
        let hr = 9, min = 0;
        if (m[4]) {
          const [h, mi] = m[4].split(':').map(x => parseInt(x, 10));
          const ampm = (m[5] || '').toUpperCase();
          hr = (ampm === 'PM' && h !== 12) ? h + 12 : (ampm === 'AM' && h === 12 ? 0 : h);
          min = mi || 0;
        }
        start = new Date(yr, mon - 1, day, hr, min, 0);
      }

      if (start) {
        const title = line.replace(/\s*-\s*\d{1,2}:\d{2}\s*(AM|PM)?/i, '').replace(dateRe1, '').replace(dateRe2, '').trim() || 'Imported Event';
        const ev = await Event.create({
          userId: parseInt(userId, 10),
          title,
          description: line,
          location: null,
          startTime: start,
          endTime: null,
          allDay: false,
          source: 'pdf'
        });
        created.push(ev);
      }
    }

    if (!created.length) {
      return res.status(400).json({ error: 'No recognizable events found in PDF.' });
    }
    res.status(201).json({ message: `Imported ${created.length} events`, events: created });
  } catch (err) {
    console.error('PDF upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update event
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, description, location, startTime, endTime, allDay } = req.body;
    const updated = await Event.update(id, {
      title,
      description,
      location,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : null,
      allDay: !!allDay
    });
    if (!updated) return res.status(404).json({ error: 'Event not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await Event.delete(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ICS for single event
router.get('/:id/ics', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const ev = await Event.findById(id);
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    const icsEvent = {
      title: ev.title,
      description: ev.description || '',
      location: ev.location || '',
      start: toDateParts(new Date(ev.start_time)),
      end: ev.end_time ? toDateParts(new Date(ev.end_time)) : undefined,
      startInputType: 'local',
      endInputType: 'local'
    };
    createEvent(icsEvent, (error, value) => {
      if (error) return res.status(500).json({ error: error.message });
      res.setHeader('Content-Type', 'text/calendar');
      res.setHeader('Content-Disposition', `attachment; filename=event-${id}.ics`);
      res.send(value);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ICS for all user events
router.get('/user/:userId/ics', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const events = await Event.findAllByUser(userId);
    const icsEvents = events.map(ev => ({
      title: ev.title,
      description: ev.description || '',
      location: ev.location || '',
      start: toDateParts(new Date(ev.start_time)),
      end: ev.end_time ? toDateParts(new Date(ev.end_time)) : undefined,
      startInputType: 'local',
      endInputType: 'local'
    }));
    createEvents(icsEvents, (error, value) => {
      if (error) return res.status(500).json({ error: error.message });
      res.setHeader('Content-Type', 'text/calendar');
      res.setHeader('Content-Disposition', 'attachment; filename=events.ics');
      res.send(value);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

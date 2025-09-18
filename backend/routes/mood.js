const express = require('express');
const router = express.Router();

// Simple in-memory storage (use database in production)
let moodEntries = [];

// Log mood entry
router.post('/log', (req, res) => {
  try {
    const { mood, emojis, note, timestamp = new Date().toISOString() } = req.body;
    
    const entry = {
      id: Date.now(),
      mood,
      emojis,
      note,
      timestamp
    };
    
    moodEntries.push(entry);
    
    res.json({ success: true, entry });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log mood' });
  }
});

// Get mood history
router.get('/history', (req, res) => {
  try {
    const recent = moodEntries.slice(-10).reverse(); // Last 10 entries
    res.json({ entries: recent });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get mood history' });
  }
});

module.exports = router;
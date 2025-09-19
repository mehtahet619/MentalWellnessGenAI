const express = require('express');
const router = express.Router();

// Simple in-memory storage (use database in production)
let journalEntries = [];

// Create journal entry
router.post('/entry', (req, res) => {
  try {
    const { title, content, mood, tags, isPrivate = true, language = 'en' } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const entry = {
      id: Date.now(),
      title: title || (language === 'hi' ? 'बिना शीर्षक' : 'Untitled'),
      content,
      mood,
      tags: tags || [],
      isPrivate,
      language,
      timestamp: new Date().toISOString(),
      wordCount: content.split(' ').length
    };
    
    journalEntries.push(entry);
    
    res.json({ success: true, entry });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create journal entry' });
  }
});

// Get journal entries
router.get('/entries', (req, res) => {
  try {
    const { limit = 10, mood, language } = req.query;
    
    let filtered = journalEntries.filter(entry => entry.isPrivate);
    
    if (mood) {
      filtered = filtered.filter(entry => entry.mood === mood);
    }
    
    if (language) {
      filtered = filtered.filter(entry => entry.language === language);
    }
    
    const recent = filtered
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, parseInt(limit));
    
    res.json({ entries: recent });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get journal entries' });
  }
});

// Get journal insights
router.get('/insights', (req, res) => {
  try {
    const entries = journalEntries.filter(entry => entry.isPrivate);
    const totalEntries = entries.length;
    
    if (totalEntries === 0) {
      return res.json({ 
        totalEntries: 0,
        averageWordsPerEntry: 0,
        moodDistribution: {},
        weeklyProgress: []
      });
    }
    
    // Calculate insights
    const totalWords = entries.reduce((sum, entry) => sum + entry.wordCount, 0);
    const averageWordsPerEntry = Math.round(totalWords / totalEntries);
    
    // Mood distribution
    const moodDistribution = {};
    entries.forEach(entry => {
      if (entry.mood) {
        moodDistribution[entry.mood] = (moodDistribution[entry.mood] || 0) + 1;
      }
    });
    
    // Weekly progress (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyEntries = entries.filter(entry => 
      new Date(entry.timestamp) >= weekAgo
    );
    
    const weeklyProgress = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayEntries = weeklyEntries.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate.toDateString() === date.toDateString();
      });
      
      weeklyProgress.push({
        date: date.toISOString().split('T')[0],
        count: dayEntries.length,
        averageMood: dayEntries.length > 0 ? 'mixed' : null
      });
    }
    
    res.json({
      totalEntries,
      averageWordsPerEntry,
      moodDistribution,
      weeklyProgress,
      streakDays: Math.min(7, weeklyEntries.length)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get insights' });
  }
});

module.exports = router;
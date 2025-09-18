const express = require('express');
const router = express.Router();
const { detectMood, generateResponse } = require('../services/chatService');

// Main chat endpoint
router.post('/message', async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Detect mood and risk factors
    const moodAnalysis = detectMood(message);
    
    // Generate appropriate response
    const response = await generateResponse(message, moodAnalysis, language);
    
    res.json({
      response: response.text,
      mood: moodAnalysis.mood,
      riskLevel: moodAnalysis.riskLevel,
      suggestedActivities: response.activities,
      language: language
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();

// Coping activities database
const copingActivities = {
  breathing_exercise: {
    en: {
      title: "4-7-8 Breathing",
      description: "Breathe in for 4 counts, hold for 7, exhale for 8. Repeat 3 times.",
      duration: "2-3 minutes"
    },
    hi: {
      title: "4-7-8 सांस की तकनीक",
      description: "4 गिनती में सांस लें, 7 गिनती रोकें, 8 गिनती में छोड़ें। 3 बार दोहराएं।",
      duration: "2-3 मिनट"
    }
  },
  affirmations: {
    en: {
      title: "Daily Affirmations",
      description: "I am capable. I am resilient. I can handle whatever comes my way today.",
      duration: "1-2 minutes"
    },
    hi: {
      title: "दैनिक सकारात्मक विचार",
      description: "मैं सक्षम हूं। मैं मजबूत हूं। मैं आज जो भी आए उसका सामना कर सकता हूं।",
      duration: "1-2 मिनट"
    }
  },
  journaling: {
    en: {
      title: "Quick Journal",
      description: "Write down 3 things: How you feel, why you might feel this way, one small step forward.",
      duration: "5 minutes"
    },
    hi: {
      title: "त्वरित डायरी",
      description: "3 चीजें लिखें: आप कैसा महसूस करते हैं, क्यों, और एक छोटा कदम आगे।",
      duration: "5 मिनट"
    }
  },
  motivational_story: {
    en: {
      title: "Student Success Story",
      description: "Ravi failed his first semester but didn't give up. He created a study schedule, found a study group, and graduated with honors. Every setback is a setup for a comeback.",
      duration: "1 minute read"
    },
    hi: {
      title: "छात्र सफलता की कहानी",
      description: "रवि अपने पहले सेमेस्टर में फेल हो गया था लेकिन हार नहीं मानी। उसने पढ़ाई का शेड्यूल बनाया और अंत में सम्मान के साथ स्नातक किया।",
      duration: "1 मिनट पढ़ना"
    }
  }
};

// Get coping activity by type
router.get('/activity/:type', (req, res) => {
  try {
    const { type } = req.params;
    const { language = 'en' } = req.query;
    
    const activity = copingActivities[type];
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    res.json({
      type,
      ...activity[language] || activity.en
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get activity' });
  }
});

// Get all available activities
router.get('/activities', (req, res) => {
  try {
    const { language = 'en' } = req.query;
    
    const activities = Object.keys(copingActivities).map(type => ({
      type,
      ...copingActivities[type][language] || copingActivities[type].en
    }));
    
    res.json({ activities });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get activities' });
  }
});

module.exports = router;
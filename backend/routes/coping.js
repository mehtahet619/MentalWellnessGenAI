const express = require('express');
const router = express.Router();

// Coping activities database
const copingActivities = {
  breathing_exercise: {
    en: {
      title: "4-7-8 Breathing",
      description: "Breathe in for 4 counts, hold for 7, exhale for 8. Repeat 3 times.",
      duration: "2-3 minutes",
      type: "breathing",
      instructions: ["Sit comfortably", "Inhale through nose for 4 counts", "Hold breath for 7 counts", "Exhale through mouth for 8 counts", "Repeat 3-4 times"]
    },
    hi: {
      title: "4-7-8 सांस की तकनीक",
      description: "4 गिनती में सांस लें, 7 गिनती रोकें, 8 गिनती में छोड़ें। 3 बार दोहराएं।",
      duration: "2-3 मिनट",
      type: "breathing",
      instructions: ["आराम से बैठें", "नाक से 4 गिनती में सांस लें", "7 गिनती तक सांस रोकें", "मुंह से 8 गिनती में सांस छोड़ें", "3-4 बार दोहराएं"]
    }
  },
  calming_art: {
    en: {
      title: "Digital Mandala Drawing",
      description: "Create beautiful, symmetrical patterns to calm your mind and focus your thoughts.",
      duration: "10-15 minutes",
      type: "creative",
      instructions: ["Choose your colors", "Start from the center", "Draw repetitive patterns", "Focus on the process, not perfection", "Let your creativity flow"]
    },
    hi: {
      title: "डिजिटल मंडला बनाना",
      description: "अपने मन को शांत करने और विचारों को केंद्रित करने के लिए सुंदर, सममित पैटर्न बनाएं।",
      duration: "10-15 मिनट",
      type: "creative",
      instructions: ["अपने रंग चुनें", "केंद्र से शुरू करें", "दोहराए जाने वाले पैटर्न बनाएं", "परफेक्शन नहीं, प्रक्रिया पर ध्यान दें", "अपनी रचनात्मकता को बहने दें"]
    }
  },
  affirmations: {
    en: {
      title: "Daily Affirmations",
      description: "Positive self-talk to boost confidence and reduce negative thoughts.",
      duration: "1-2 minutes",
      type: "mindfulness",
      affirmations: [
        "I am capable of handling whatever comes my way",
        "I am resilient and strong",
        "Every challenge is an opportunity to grow",
        "I deserve happiness and peace",
        "I am enough, just as I am"
      ]
    },
    hi: {
      title: "दैनिक सकारात्मक विचार",
      description: "आत्मविश्वास बढ़ाने और नकारात्मक विचारों को कम करने के लिए सकारात्मक आत्म-चर्चा।",
      duration: "1-2 मिनट",
      type: "mindfulness",
      affirmations: [
        "मैं जो भी आए उसका सामना करने में सक्षम हूं",
        "मैं मजबूत और लचीला हूं",
        "हर चुनौती बढ़ने का अवसर है",
        "मैं खुशी और शांति का हकदार हूं",
        "मैं जैसा हूं, वैसा ही पर्याप्त हूं"
      ]
    }
  },
  journaling: {
    en: {
      title: "Guided Reflection",
      description: "Structured writing prompts to help process emotions and thoughts.",
      duration: "5-10 minutes",
      type: "reflection",
      prompts: [
        "How am I feeling right now, and why?",
        "What is one thing I'm grateful for today?",
        "What challenge am I facing, and how can I approach it?",
        "What would I tell a friend in my situation?",
        "What is one small step I can take today?"
      ]
    },
    hi: {
      title: "निर्देशित चिंतन",
      description: "भावनाओं और विचारों को समझने में मदद करने के लिए संरचित लेखन संकेत।",
      duration: "5-10 मिनट",
      type: "reflection",
      prompts: [
        "मैं अभी कैसा महसूस कर रहा हूं, और क्यों?",
        "आज मैं किस एक चीज के लिए आभारी हूं?",
        "मैं किस चुनौती का सामना कर रहा हूं, और इसे कैसे संभाल सकता हूं?",
        "मैं अपनी स्थिति में किसी दोस्त को क्या कहूंगा?",
        "आज मैं कौन सा छोटा कदम उठा सकता हूं?"
      ]
    }
  },
  motivational_story: {
    en: {
      title: "Inspiring Student Stories",
      description: "Real stories of students who overcame challenges and found success.",
      duration: "2-3 minutes",
      type: "inspiration",
      stories: [
        {
          title: "From Failure to Success",
          content: "Ravi failed his first semester but didn't give up. He created a study schedule, found a study group, and graduated with honors. Every setback is a setup for a comeback."
        },
        {
          title: "Overcoming Anxiety",
          content: "Priya struggled with exam anxiety for years. She learned breathing techniques, practiced mindfulness, and built confidence through small wins. Now she helps other students cope with stress."
        }
      ]
    },
    hi: {
      title: "प्रेरणादायक छात्र कहानियां",
      description: "उन छात्रों की वास्तविक कहानियां जिन्होंने चुनौतियों पर काबू पाया और सफलता पाई।",
      duration: "2-3 मिनट",
      type: "inspiration",
      stories: [
        {
          title: "असफलता से सफलता तक",
          content: "रवि अपने पहले सेमेस्टर में फेल हो गया था लेकिन हार नहीं मानी। उसने पढ़ाई का शेड्यूल बनाया, स्टडी ग्रुप ज्वाइन किया, और सम्मान के साथ स्नातक किया।"
        },
        {
          title: "चिंता पर विजय",
          content: "प्रिया सालों से परीक्षा की चिंता से जूझती थी। उसने सांस की तकनीक सीखी, माइंडफुलनेस का अभ्यास किया, और छोटी जीत के माध्यम से आत्मविश्वास बनाया।"
        }
      ]
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
// Mood detection keywords
const moodKeywords = {
  anxious: ['anxious', 'worried', 'nervous', 'panic', 'stress', 'tense', 'चिंतित', 'परेशान', 'घबराहट'],
  sad: ['sad', 'depressed', 'down', 'lonely', 'hopeless', 'upset', 'उदास', 'निराश', 'अकेला'],
  angry: ['angry', 'frustrated', 'mad', 'irritated', 'furious', 'गुस्सा', 'क्रोधित', 'चिढ़'],
  happy: ['happy', 'good', 'great', 'excited', 'joy', 'खुश', 'अच्छा', 'प्रसन्न'],
  neutral: ['okay', 'fine', 'normal', 'ठीक', 'सामान्य']
};

const riskKeywords = ['suicide', 'kill myself', 'end it all', 'self harm', 'hurt myself', 'आत्महत्या', 'खुद को नुकसान'];

function detectMood(message) {
  const lowerMessage = message.toLowerCase();
  let detectedMood = 'neutral';
  let riskLevel = 'low';
  
  // Check for risk keywords first
  if (riskKeywords.some(keyword => lowerMessage.includes(keyword))) {
    riskLevel = 'high';
    detectedMood = 'crisis';
    return { mood: detectedMood, riskLevel, confidence: 0.9 };
  }
  
  // Detect mood
  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      detectedMood = mood;
      break;
    }
  }
  
  return { mood: detectedMood, riskLevel, confidence: 0.7 };
}

async function generateResponse(message, moodAnalysis, language) {
  const { mood, riskLevel } = moodAnalysis;
  
  // Crisis response
  if (riskLevel === 'high') {
    return {
      text: language === 'hi' 
        ? "आप अकेले नहीं हैं। अगर आप कभी असुरक्षित महसूस करें, तो कृपया iCall हेल्पलाइन पर कॉल करें: +91 9152987821"
        : "You're not alone. If you ever feel unsafe, please call iCall Helpline: +91 9152987821",
      activities: ['emergency_contact']
    };
  }
  
  // Mood-based responses
  const responses = {
    anxious: {
      en: "I hear that you're feeling anxious. That's completely normal, especially during studies. Try taking 5 deep breaths - in for 4 counts, hold for 4, out for 4.",
      hi: "मैं समझ सकता हूं कि आप चिंतित महसूस कर रहे हैं। यह बिल्कुल सामान्य है, खासकर पढ़ाई के दौरान। 5 गहरी सांसें लेने की कोशिश करें।",
      activities: ['breathing_exercise', 'calming_music', 'short_walk']
    },
    sad: {
      en: "I'm sorry you're feeling down. Remember, tough times don't last, but resilient people like you do. You've overcome challenges before, and you can do it again.",
      hi: "मुझे खुशी है कि आपने अपनी भावनाएं साझा कीं। याद रखें, कठिन समय हमेशा नहीं रहता, लेकिन आप जैसे मजबूत लोग हमेशा रहते हैं।",
      activities: ['affirmations', 'journaling', 'motivational_story']
    },
    happy: {
      en: "That's wonderful to hear! I'm so glad you're feeling good. Keep this positive energy going - maybe share this happiness with someone you care about.",
      hi: "यह सुनकर बहुत खुशी हुई! मुझे खुशी है कि आप अच्छा महसूस कर रहे हैं। इस सकारात्मक ऊर्जा को बनाए रखें।",
      activities: ['gratitude_practice', 'share_joy', 'creative_activity']
    },
    neutral: {
      en: "Thanks for checking in! How are you feeling today? Remember, I'm here to listen and support you through whatever you're experiencing.",
      hi: "बात करने के लिए धन्यवाद! आज आप कैसा महसूस कर रहे हैं? याद रखें, मैं यहां आपकी बात सुनने और सहायता करने के लिए हूं।",
      activities: ['mood_check', 'daily_reflection', 'mindfulness']
    }
  };
  
  const response = responses[mood] || responses.neutral;
  
  return {
    text: response[language] || response.en,
    activities: response.activities
  };
}

module.exports = { detectMood, generateResponse };
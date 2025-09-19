const express = require('express');
const router = express.Router();

// Simple in-memory storage (use database in production)
let communityPosts = [];
let supportMessages = [];

// Content moderation keywords
const moderationKeywords = ['suicide', 'self harm', 'kill myself', 'आत्महत्या', 'खुद को नुकसान'];

function moderateContent(content) {
  const lowerContent = content.toLowerCase();
  const hasRiskContent = moderationKeywords.some(keyword => lowerContent.includes(keyword));
  
  return {
    approved: !hasRiskContent,
    needsReview: hasRiskContent,
    riskLevel: hasRiskContent ? 'high' : 'low'
  };
}

// Create anonymous post
router.post('/post', (req, res) => {
  try {
    const { content, category = 'general', language = 'en' } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const moderation = moderateContent(content);
    
    const post = {
      id: Date.now(),
      content,
      category,
      language,
      timestamp: new Date().toISOString(),
      supportCount: 0,
      replies: [],
      isAnonymous: true,
      authorId: `anon_${Math.random().toString(36).substr(2, 9)}`,
      moderation
    };
    
    if (moderation.approved) {
      communityPosts.push(post);
      res.json({ success: true, post: { ...post, moderation: undefined } });
    } else {
      res.json({ 
        success: false, 
        message: language === 'hi' 
          ? 'आपका संदेश समीक्षा के लिए भेजा गया है। कृपया सहायता के लिए हेल्पलाइन से संपर्क करें।'
          : 'Your message has been sent for review. Please contact helpline for support.',
        helpline: '+91 9152987821'
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get community posts
router.get('/posts', (req, res) => {
  try {
    const { category, language, limit = 20 } = req.query;
    
    let filtered = communityPosts.filter(post => post.moderation.approved);
    
    if (category && category !== 'all') {
      filtered = filtered.filter(post => post.category === category);
    }
    
    if (language) {
      filtered = filtered.filter(post => post.language === language);
    }
    
    const recent = filtered
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, parseInt(limit))
      .map(post => ({
        ...post,
        moderation: undefined // Don't expose moderation details
      }));
    
    res.json({ posts: recent });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get posts' });
  }
});

// Send support to a post
router.post('/support/:postId', (req, res) => {
  try {
    const { postId } = req.params;
    const { message, language = 'en' } = req.body;
    
    const post = communityPosts.find(p => p.id === parseInt(postId));
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    post.supportCount += 1;
    
    if (message) {
      const supportMsg = {
        id: Date.now(),
        postId: parseInt(postId),
        message,
        language,
        timestamp: new Date().toISOString(),
        isAnonymous: true
      };
      
      const moderation = moderateContent(message);
      if (moderation.approved) {
        post.replies.push(supportMsg);
      }
    }
    
    res.json({ success: true, supportCount: post.supportCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send support' });
  }
});

// Get community categories
router.get('/categories', (req, res) => {
  const { language = 'en' } = req.query;
  
  const categories = {
    en: [
      { id: 'general', name: 'General Support', icon: '💬' },
      { id: 'academic', name: 'Academic Stress', icon: '📚' },
      { id: 'relationships', name: 'Relationships', icon: '👥' },
      { id: 'anxiety', name: 'Anxiety & Worry', icon: '😰' },
      { id: 'motivation', name: 'Motivation', icon: '💪' }
    ],
    hi: [
      { id: 'general', name: 'सामान्य सहायता', icon: '💬' },
      { id: 'academic', name: 'पढ़ाई का तनाव', icon: '📚' },
      { id: 'relationships', name: 'रिश्ते', icon: '👥' },
      { id: 'anxiety', name: 'चिंता और परेशानी', icon: '😰' },
      { id: 'motivation', name: 'प्रेरणा', icon: '💪' }
    ]
  };
  
  res.json({ categories: categories[language] || categories.en });
});

module.exports = router;
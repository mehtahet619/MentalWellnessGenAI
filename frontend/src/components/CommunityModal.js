import React, { useState, useEffect } from 'react';
import { X, Send, Users, Heart, MessageCircle } from 'lucide-react';
import axios from 'axios';

const CommunityModal = ({ isOpen, onClose, language }) => {
  const [activeTab, setActiveTab] = useState('browse');
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newPost, setNewPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchPosts();
    }
  }, [isOpen, language, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`/api/community/categories?language=${language}`);
      setCategories([
        { id: 'all', name: language === 'hi' ? 'सभी' : 'All', icon: '🌟' },
        ...response.data.categories
      ]);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/api/community/posts?category=${selectedCategory}&language=${language}&limit=10`);
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('/api/community/post', {
        content: newPost.trim(),
        category: selectedCategory === 'all' ? 'general' : selectedCategory,
        language
      });
      
      if (response.data.success) {
        setNewPost('');
        setActiveTab('browse');
        fetchPosts();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    }
    setIsLoading(false);
  };

  const handleSendSupport = async (postId) => {
    try {
      await axios.post(`/api/community/support/${postId}`, { language });
      fetchPosts(); // Refresh to show updated support count
    } catch (error) {
      console.error('Failed to send support:', error);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return language === 'hi' ? 'अभी' : 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}${language === 'hi' ? ' मिनट पहले' : 'm ago'}`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}${language === 'hi' ? ' घंटे पहले' : 'h ago'}`;
    return `${Math.floor(diffInMinutes / 1440)}${language === 'hi' ? ' दिन पहले' : 'd ago'}`;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content community-modal">
        <div className="modal-header">
          <div className="modal-title">
            <Users size={20} />
            <span>{language === 'hi' ? 'सुरक्षित समुदाय' : 'Safe Community'}</span>
          </div>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <div className="community-tabs">
          <button 
            className={`tab ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            {language === 'hi' ? 'ब्राउज़ करें' : 'Browse'}
          </button>
          <button 
            className={`tab ${activeTab === 'share' ? 'active' : ''}`}
            onClick={() => setActiveTab('share')}
          >
            {language === 'hi' ? 'साझा करें' : 'Share'}
          </button>
        </div>

        {activeTab === 'browse' && (
          <div className="modal-body">
            <div className="category-filter">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            <div className="posts-container">
              {posts.length === 0 ? (
                <div className="empty-state">
                  <p>{language === 'hi' ? 'अभी तक कोई पोस्ट नहीं है' : 'No posts yet'}</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="community-post">
                    <div className="post-header">
                      <span className="anonymous-badge">
                        {language === 'hi' ? 'गुमनाम' : 'Anonymous'}
                      </span>
                      <span className="post-time">{formatTimeAgo(post.timestamp)}</span>
                    </div>
                    <div className="post-content">
                      {post.content}
                    </div>
                    <div className="post-actions">
                      <button 
                        className="support-button"
                        onClick={() => handleSendSupport(post.id)}
                      >
                        <Heart size={16} />
                        <span>{post.supportCount} {language === 'hi' ? 'सहायता' : 'support'}</span>
                      </button>
                      <button className="reply-button">
                        <MessageCircle size={16} />
                        <span>{post.replies?.length || 0} {language === 'hi' ? 'जवाब' : 'replies'}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'share' && (
          <div className="modal-body">
            <div className="share-form">
              <p className="share-description">
                {language === 'hi' 
                  ? 'अपनी भावनाओं को गुमनाम रूप से साझा करें। आपकी पहचान सुरक्षित रहेगी।'
                  : 'Share your feelings anonymously. Your identity will remain safe.'
                }
              </p>
              
              <textarea
                placeholder={language === 'hi' 
                  ? 'आप क्या महसूस कर रहे हैं? दूसरों की मदद के लिए अपना अनुभव साझा करें...'
                  : 'What are you feeling? Share your experience to help others...'}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="share-textarea"
                rows={6}
              />
              
              <div className="share-footer">
                <div className="character-count">
                  {newPost.length}/500
                </div>
                <button 
                  onClick={handleCreatePost}
                  className="share-button"
                  disabled={!newPost.trim() || isLoading || newPost.length > 500}
                >
                  <Send size={16} />
                  {isLoading 
                    ? (language === 'hi' ? 'भेज रहे हैं...' : 'Sharing...') 
                    : (language === 'hi' ? 'साझा करें' : 'Share')
                  }
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityModal;
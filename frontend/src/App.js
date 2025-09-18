import React, { useState, useRef, useEffect } from 'react';
import { Send, Heart, Phone } from 'lucide-react';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      text: 'Hi! I\'m MannMitra, your wellness companion. How are you feeling today? 😊',
      textHi: 'नमस्ते! मैं मन्नमित्र हूं, आपका कल्याण साथी। आज आप कैसा महसूस कर रहे हैं? 😊'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('en');
  const [selectedMood, setSelectedMood] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState([]);
  const messagesEndRef = useRef(null);

  const moodEmojis = ['😊', '😢', '😰', '😡', '😴', '🤔', '😌'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    fetchActivities();
  }, [language]);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`/api/coping/activities?language=${language}`);
      setActivities(response.data.activities.slice(0, 3)); // Show top 3
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { type: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat/message', {
        message: inputText,
        language: language
      });

      const assistantMessage = {
        type: 'assistant',
        text: response.data.response,
        mood: response.data.mood,
        riskLevel: response.data.riskLevel,
        activities: response.data.suggestedActivities
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'assistant',
        text: language === 'hi' 
          ? 'क्षमा करें, कुछ गलत हुआ। कृपया फिर से कोशिश करें।'
          : 'Sorry, something went wrong. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setInputText('');
    setIsLoading(false);
  };

  const logMood = async () => {
    if (selectedMood.length === 0) return;

    try {
      await axios.post('/api/mood/log', {
        emojis: selectedMood,
        mood: 'custom',
        timestamp: new Date().toISOString()
      });
      
      setSelectedMood([]);
      alert(language === 'hi' ? 'मूड लॉग हो गया!' : 'Mood logged!');
    } catch (error) {
      console.error('Failed to log mood:', error);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <Heart className="inline mr-2" size={24} />
          MannMitra
        </div>
        <button onClick={toggleLanguage} className="language-toggle">
          {language === 'en' ? 'हिंदी' : 'English'}
        </button>
      </header>

      <main className="main-content">
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                {message.riskLevel === 'high' && (
                  <div className="emergency-banner">
                    <Phone className="inline mr-2" size={16} />
                    iCall Helpline: +91 9152987821
                  </div>
                )}
                <div>
                  {language === 'hi' && message.textHi ? message.textHi : message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant">
                <div>{language === 'hi' ? 'टाइप कर रहा हूं...' : 'Typing...'}</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === 'hi' 
                ? 'अपनी बात यहां लिखें...' 
                : 'Share how you\'re feeling...'}
              disabled={isLoading}
            />
            <button 
              onClick={sendMessage} 
              className="send-button"
              disabled={isLoading || !inputText.trim()}
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        <div className="sidebar">
          <div className="mood-tracker">
            <h3>{language === 'hi' ? 'आज का मूड' : 'Today\'s Mood'}</h3>
            <div className="mood-emojis">
              {moodEmojis.map((emoji, index) => (
                <button
                  key={index}
                  className={`emoji-button ${selectedMood.includes(emoji) ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedMood(prev => 
                      prev.includes(emoji) 
                        ? prev.filter(e => e !== emoji)
                        : [...prev, emoji]
                    );
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
            {selectedMood.length > 0 && (
              <button 
                onClick={logMood}
                style={{
                  background: '#4F46E5',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                {language === 'hi' ? 'मूड सेव करें' : 'Save Mood'}
              </button>
            )}
          </div>

          <div className="activities-panel">
            <h3>{language === 'hi' ? 'सुझावित गतिविधियां' : 'Suggested Activities'}</h3>
            {activities.map((activity, index) => (
              <div key={index} className="activity-card">
                <h4>{activity.title}</h4>
                <p style={{ fontSize: '0.9rem', color: '#6B7280', marginTop: '0.5rem' }}>
                  {activity.description}
                </p>
                <small style={{ color: '#9CA3AF' }}>{activity.duration}</small>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
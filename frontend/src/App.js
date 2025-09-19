import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Heart, Phone, BookOpen, Users, Palette, TrendingUp } from 'lucide-react';
import axios from 'axios';
import JournalModal from './components/JournalModal';
import CommunityModal from './components/CommunityModal';

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
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [journalEntries, setJournalEntries] = useState([]);
  const [insights, setInsights] = useState(null);
  const messagesEndRef = useRef(null);

  const moodEmojis = ['😊', '😢', '😰', '😡', '😴', '🤔', '😌'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchActivities = useCallback(async () => {
    try {
      const response = await axios.get(`/api/coping/activities?language=${language}`);
      setActivities(response.data.activities.slice(0, 3)); // Show top 3
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    }
  }, [language]);

  const fetchJournalEntries = useCallback(async () => {
    try {
      const response = await axios.get(`/api/journal/entries?limit=3&language=${language}`);
      setJournalEntries(response.data.entries);
    } catch (error) {
      console.error('Failed to fetch journal entries:', error);
    }
  }, [language]);

  const fetchInsights = useCallback(async () => {
    try {
      const response = await axios.get('/api/journal/insights');
      setInsights(response.data);
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
    fetchJournalEntries();
    fetchInsights();
  }, [fetchActivities, fetchJournalEntries, fetchInsights]);

  const handleSaveJournal = async (journalData) => {
    try {
      await axios.post('/api/journal/entry', journalData);
      fetchJournalEntries();
      fetchInsights();
    } catch (error) {
      console.error('Failed to save journal entry:', error);
      throw error;
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
              onKeyDown={handleKeyPress}
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
          <div className="quick-actions">
            <button
              className="action-button journal-button"
              onClick={() => setIsJournalOpen(true)}
            >
              <BookOpen size={16} />
              <span>{language === 'hi' ? 'डायरी लिखें' : 'Write Journal'}</span>
            </button>
            <button
              className="action-button community-button"
              onClick={() => setIsCommunityOpen(true)}
            >
              <Users size={16} />
              <span>{language === 'hi' ? 'समुदाय' : 'Community'}</span>
            </button>
          </div>

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
                className="save-mood-button"
              >
                {language === 'hi' ? 'मूड सेव करें' : 'Save Mood'}
              </button>
            )}
          </div>

          {insights && insights.totalEntries > 0 && (
            <div className="insights-panel">
              <h3>
                <TrendingUp size={16} />
                {language === 'hi' ? 'आपकी प्रगति' : 'Your Progress'}
              </h3>
              <div className="insight-stats">
                <div className="stat">
                  <span className="stat-number">{insights.totalEntries}</span>
                  <span className="stat-label">{language === 'hi' ? 'एंट्रीज' : 'entries'}</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{insights.streakDays}</span>
                  <span className="stat-label">{language === 'hi' ? 'दिन स्ट्रीक' : 'day streak'}</span>
                </div>
              </div>
            </div>
          )}

          <div className="activities-panel">
            <h3>
              <Palette size={16} />
              {language === 'hi' ? 'कॉपिंग टूलकिट' : 'Coping Toolkit'}
            </h3>
            {activities.map((activity, index) => (
              <div key={index} className="activity-card">
                <h4>{activity.title}</h4>
                <p>{activity.description}</p>
                <small>{activity.duration}</small>
              </div>
            ))}
          </div>

          {journalEntries.length > 0 && (
            <div className="recent-entries">
              <h3>{language === 'hi' ? 'हाल की एंट्रीज' : 'Recent Entries'}</h3>
              {journalEntries.slice(0, 2).map((entry) => (
                <div key={entry.id} className="entry-preview">
                  <div className="entry-title">{entry.title}</div>
                  <div className="entry-preview-text">
                    {entry.content.substring(0, 60)}...
                  </div>
                  <div className="entry-date">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <JournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        language={language}
        onSave={handleSaveJournal}
      />

      <CommunityModal
        isOpen={isCommunityOpen}
        onClose={() => setIsCommunityOpen(false)}
        language={language}
      />
    </div>
  );
}

export default App;
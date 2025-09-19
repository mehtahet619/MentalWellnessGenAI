import React, { useState } from 'react';
import { X, Save, BookOpen } from 'lucide-react';

const JournalModal = ({ isOpen, onClose, language, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const moodOptions = {
    en: [
      { value: 'happy', label: 'Happy 😊', color: '#10B981' },
      { value: 'sad', label: 'Sad 😢', color: '#6B7280' },
      { value: 'anxious', label: 'Anxious 😰', color: '#F59E0B' },
      { value: 'angry', label: 'Angry 😡', color: '#EF4444' },
      { value: 'peaceful', label: 'Peaceful 😌', color: '#8B5CF6' },
      { value: 'confused', label: 'Confused 🤔', color: '#6B7280' }
    ],
    hi: [
      { value: 'happy', label: 'खुश 😊', color: '#10B981' },
      { value: 'sad', label: 'उदास 😢', color: '#6B7280' },
      { value: 'anxious', label: 'चिंतित 😰', color: '#F59E0B' },
      { value: 'angry', label: 'गुस्सा 😡', color: '#EF4444' },
      { value: 'peaceful', label: 'शांत 😌', color: '#8B5CF6' },
      { value: 'confused', label: 'उलझन 🤔', color: '#6B7280' }
    ]
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    
    setIsLoading(true);
    try {
      await onSave({
        title: title.trim() || (language === 'hi' ? 'बिना शीर्षक' : 'Untitled'),
        content: content.trim(),
        mood,
        language
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setMood('');
      onClose();
    } catch (error) {
      console.error('Failed to save journal entry:', error);
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content journal-modal">
        <div className="modal-header">
          <div className="modal-title">
            <BookOpen size={20} />
            <span>{language === 'hi' ? 'नई डायरी एंट्री' : 'New Journal Entry'}</span>
          </div>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <input
              type="text"
              placeholder={language === 'hi' ? 'शीर्षक (वैकल्पिक)' : 'Title (optional)'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="journal-title-input"
            />
          </div>

          <div className="form-group">
            <label>{language === 'hi' ? 'आज आप कैसा महसूस कर रहे हैं?' : 'How are you feeling today?'}</label>
            <div className="mood-selector">
              {moodOptions[language].map((option) => (
                <button
                  key={option.value}
                  className={`mood-option ${mood === option.value ? 'selected' : ''}`}
                  onClick={() => setMood(option.value)}
                  style={{ borderColor: mood === option.value ? option.color : '#E5E7EB' }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <textarea
              placeholder={language === 'hi' 
                ? 'अपने विचार और भावनाएं यहां लिखें...' 
                : 'Write your thoughts and feelings here...'}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="journal-textarea"
              rows={8}
            />
            <div className="word-count">
              {content.split(' ').filter(word => word.length > 0).length} {language === 'hi' ? 'शब्द' : 'words'}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="cancel-button">
            {language === 'hi' ? 'रद्द करें' : 'Cancel'}
          </button>
          <button 
            onClick={handleSave} 
            className="save-button"
            disabled={!content.trim() || isLoading}
          >
            <Save size={16} />
            {isLoading 
              ? (language === 'hi' ? 'सेव हो रहा है...' : 'Saving...') 
              : (language === 'hi' ? 'सेव करें' : 'Save Entry')
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalModal;
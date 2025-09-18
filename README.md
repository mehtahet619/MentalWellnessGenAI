# MannMitra - Mental Wellness Companion

A supportive mental wellness companion designed specifically for students in India. MannMitra provides empathetic listening, emotion detection, and personalized coping strategies in both English and Hindi.

## Features

- **Bilingual Support**: Seamlessly switch between English and Hindi
- **Emotion Detection**: AI-powered mood analysis from user messages
- **Crisis Detection**: Automatic identification of high-risk situations with helpline information
- **Coping Activities**: Personalized suggestions for breathing exercises, affirmations, and mindfulness
- **Mood Tracking**: Daily mood logging with emoji-based interface
- **Student-Focused**: Content and responses tailored for Indian students

## Quick Start

1. **Install dependencies**:
   ```bash
   npm run install:all
   ```

2. **Set up environment**:
   ```bash
   cp backend/.env.example backend/.env
   ```

3. **Start development servers**:
   ```bash
   npm run dev
   ```

4. **Access the app**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Project Structure

```
mannmitra/
├── frontend/          # React app
│   ├── src/
│   │   ├── App.js     # Main component
│   │   └── index.css  # Styles
│   └── package.json
├── backend/           # Node.js API
│   ├── routes/        # API endpoints
│   ├── services/      # Business logic
│   └── server.js      # Express server
└── README.md
```

## API Endpoints

- `POST /api/chat/message` - Send message and get AI response
- `POST /api/mood/log` - Log mood entry
- `GET /api/mood/history` - Get mood history
- `GET /api/coping/activities` - Get coping activities
- `GET /api/coping/activity/:type` - Get specific activity

## Safety Features

- Crisis keyword detection
- Automatic helpline information display
- Rate limiting for API protection
- Input validation and sanitization

## Technologies

- **Frontend**: React, Axios, Lucide React
- **Backend**: Node.js, Express, CORS, Helmet
- **Styling**: CSS with modern gradients and glassmorphism

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For mental health emergencies, contact:
- **iCall Helpline**: +91 9152987821
- **KIRAN Mental Health Helpline**: 1800-599-0019

## License

This project is created for educational and wellness purposes.
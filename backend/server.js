const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));

// Import routes
const chatRoutes = require('./routes/chat');
const moodRoutes = require('./routes/mood');
const copingRoutes = require('./routes/coping');

// Use routes
app.use('/api/chat', chatRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/coping', copingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MannMitra API is running' });
});

app.listen(PORT, () => {
  console.log(`MannMitra backend running on port ${PORT}`);
});
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Load Environment Variables
dotenv.config();

// Pre-register Mongoose Models (needed for mongoose db queries)
import './models/Review.js';
import './models/Settings.js';
import './models/Analytics.js';

// Import Routes
import authRoutes from './routes/auth.js';
import reviewRoutes from './routes/reviews.js';
import settingsRoutes from './routes/settings.js';
import analyticsRoutes from './routes/analytics.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Monica Portfolio API is running smoothly' });
});

// Root route
app.get('/', (req, res) => {
  res.send('Monica Portfolio API Server');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

// Connect to Database then Start Server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[Server] running on port ${PORT}`);
  });
}

startServer();

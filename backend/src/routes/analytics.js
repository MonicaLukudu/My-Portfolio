import express from 'express';
import { dbService } from '../config/db.js';
import { requireAdmin } from './auth.js';

const router = express.Router();

// GET analytics dashboard data (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const analytics = await dbService.getAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST record hit (public)
router.post('/hit', async (req, res) => {
  const { referrer } = req.body;
  try {
    const analytics = await dbService.recordHit(referrer);
    res.json({ success: true, hits: analytics.hits });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST record engagement (public)
router.post('/engagement', async (req, res) => {
  const { seconds } = req.body;
  if (!seconds || isNaN(seconds)) {
    return res.status(400).json({ error: 'Valid seconds count is required' });
  }

  try {
    const analytics = await dbService.recordEngagement(Number(seconds));
    res.json({ success: true, totalEngagementSeconds: analytics.engagementSeconds });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

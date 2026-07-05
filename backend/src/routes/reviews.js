import express from 'express';
import { dbService } from '../config/db.js';
import { requireAdmin } from './auth.js';

const router = express.Router();

// GET approved reviews (public)
router.get('/', async (req, res) => {
  try {
    const reviews = await dbService.getReviews(false);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all reviews (admin only)
router.get('/all', requireAdmin, async (req, res) => {
  try {
    const reviews = await dbService.getReviews(true);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST submit review (public)
router.post('/', async (req, res) => {
  const { name, email, message, rating } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  
  try {
    const review = await dbService.createReview({ name, email, message, rating });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update status (admin only)
router.put('/:id/status', requireAdmin, async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const updated = await dbService.updateReviewStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE review (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const success = await dbService.deleteReview(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

import express from 'express';
import multer from 'multer';
import path from 'path';
import { put } from '@vercel/blob';
import { dbService } from '../config/db.js';
import { requireAdmin } from './auth.js';

const router = express.Router();

// Store the upload in memory — we forward the buffer straight to Blob storage,
// never touching local disk (Vercel's filesystem is read-only/ephemeral anyway)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  }
});

// GET portfolio settings (public)
router.get('/', async (req, res) => {
  try {
    const settings = await dbService.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST upload CV file (admin only)
router.post('/upload-cv', requireAdmin, upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const ext = path.extname(req.file.originalname);
    const blob = await put(`cv-${Date.now()}${ext}`, req.file.buffer, {
      access: 'public',
      contentType: req.file.mimetype,
    });

    const updated = await dbService.updateSettings({ cvUrl: blob.url });
    res.json({ cvUrl: blob.url, settings: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update portfolio settings (admin only)
router.put('/', requireAdmin, async (req, res) => {
  try {
    const updated = await dbService.updateSettings(req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
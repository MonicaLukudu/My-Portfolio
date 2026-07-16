import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dbService } from '../config/db.js';
import { requireAdmin } from './auth.js';
import { error } from 'console';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = process.env.VERCEL
? '/tmp/uploads'
: path.join(__dirname, '../../uploads');

try{
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.error('Could not create upload dir:', err.message);
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `cv-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
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

    const fileUrl = `/uploads/${req.file.filename}`;
    const updated = await dbService.updateSettings({ cvUrl: fileUrl });
    res.json({ cvUrl: fileUrl, settings: updated });
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

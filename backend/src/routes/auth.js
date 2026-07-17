import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many login attempts, try again in 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware to verify Admin JWT token
export function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token is invalid or expired' });
  }
}

// POST login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminUsername = process.env.ADMIN_USERNAME;
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;

    const validUsername = username === adminUsername;
    const validPassword = passwordHash
      ? await bcrypt.compare(password, passwordHash)
      : false;

    if (validUsername && validPassword) {
      const token = jwt.sign(
        { username: adminUsername, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      return res.json({ token, username: adminUsername });
    }

    return res.status(401).json({ error: 'Invalid username or password' });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ error: 'Something went wrong during login' });
  }
});

// GET verify token
router.get('/verify', requireAdmin, (req, res) => {
  res.json({ valid: true, username: req.admin.username });
});

export default router;
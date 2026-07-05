import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify Admin JWT token
export function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token is invalid or expired' });
  }
}

// POST login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const adminUsername = process.env.ADMIN_USERNAME ;
  const adminPassword = process.env.ADMIN_PASSWORD ;

  if (username === adminUsername && password === adminPassword) {
    // Generate token
    const token = jwt.sign(
      { username: adminUsername, role: 'admin' },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '24h' }
    );
    return res.json({ token, username: adminUsername });
  } else {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
});

// GET verify token
router.get('/verify', requireAdmin, (req, res) => {
  res.json({ valid: true, username: req.admin.username });
});

export default router;

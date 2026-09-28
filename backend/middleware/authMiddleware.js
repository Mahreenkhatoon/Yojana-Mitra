const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── Protect: require valid JWT ────────────────────────────────────────────────
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorised – no token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id).select('-password');

    if (!user)          return res.status(401).json({ success: false, message: 'User no longer exists.' });
    if (!user.isActive) return res.status(401).json({ success: false, message: 'Account has been deactivated.' });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Not authorised – invalid or expired token.' });
  }
};

// ── Admin-only gate ───────────────────────────────────────────────────────────
const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  return res.status(403).json({ success: false, message: 'Access denied – admin only.' });
};

// ── Token generator ───────────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

module.exports = { protect, adminOnly, generateToken };

const { validationResult } = require('express-validator');
const User                 = require('../models/User');
const { generateToken }    = require('../middleware/authMiddleware');

// ── helpers ───────────────────────────────────────────────────────────────────
const safeUser = (u) => ({
  _id    : u._id,
  name   : u.name,
  email  : u.email,
  role   : u.role,
  profile: u.profile,
});

// ── @POST /api/auth/register ──────────────────────────────────────────────────
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ 
      success: false, 
      message: errors.array()[0]?.msg || 'Validation error occurred.', 
      errors: errors.array() 
    });

  const { name, email, password } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ 
        success: false, 
        message: 'This email address is already registered. Please sign in or use a different email.' 
      });
    }

    const user  = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({ success: true, message: 'Registration successful', token, user: safeUser(user) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'This email address is already registered. Please sign in or use a different email.' 
      });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ 
        success: false, 
        message: messages.join(', ') || 'Validation failed on user data.' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: err.message || 'Server error occurred during registration. Please try again later.' 
    });
  }
};

// ── @POST /api/auth/login ─────────────────────────────────────────────────────
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    if (!user.isActive)
      return res.status(401).json({ success: false, message: 'Account has been deactivated.' });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    res.json({ success: true, message: 'Login successful', token, user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @GET /api/auth/me ─────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @PUT /api/auth/profile ────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    if (req.body.name)    user.name    = req.body.name;
    if (req.body.profile) user.profile = { ...user.profile.toObject(), ...req.body.profile };

    const updated = await user.save();
    res.json({ success: true, message: 'Profile updated successfully.', user: safeUser(updated) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @PUT /api/auth/change-password ───────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Both current and new password are required.' });

    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });

    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.matchPassword(currentPassword)))
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword };

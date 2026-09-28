const Scheme   = require('../models/Scheme');
const User     = require('../models/User');
const Category = require('../models/Category');

// ── @GET /api/admin/stats ────────────────────────────────────────────────────
const getStats = async (req, res) => {
  try {
    const [totalSchemes, totalUsers, activeSchemes, featuredSchemes, recentUsers] =
      await Promise.all([
        Scheme.countDocuments(),
        User.countDocuments({ role: 'user' }),
        Scheme.countDocuments({ isActive: true }),
        Scheme.countDocuments({ isFeatured: true }),
        User.find({ role: 'user' }).sort('-createdAt').limit(5).select('name email createdAt'),
      ]);

    const categoryCounts = await Scheme.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort:  { count: -1 } },
    ]);

    res.json({
      success: true,
      stats: { totalSchemes, totalUsers, activeSchemes, featuredSchemes, categoryCounts, recentUsers },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @GET /api/admin/users ────────────────────────────────────────────────────
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name  : { $regex: search, $options: 'i' } },
        { email : { $regex: search, $options: 'i' } },
      ];
    }
    const skip  = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, total, pages: Math.ceil(total / Number(limit)), users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @PATCH /api/admin/users/:id/toggle ───────────────────────────────────────
const toggleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'admin')
      return res.status(400).json({ success: false, message: 'Cannot deactivate an admin account.' });

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @GET /api/admin/schemes ──────────────────────────────────────────────────
const getAdminSchemes = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };

    const skip    = (Number(page) - 1) * Number(limit);
    const total   = await Scheme.countDocuments(query);
    const schemes = await Scheme.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, total, pages: Math.ceil(total / Number(limit)), schemes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @POST /api/admin/schemes ─────────────────────────────────────────────────
const createScheme = async (req, res) => {
  try {
    const scheme = await Scheme.create(req.body);
    res.status(201).json({ success: true, message: 'Scheme created.', scheme });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @PUT /api/admin/schemes/:id ──────────────────────────────────────────────
const updateScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found.' });
    res.json({ success: true, message: 'Scheme updated.', scheme });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @DELETE /api/admin/schemes/:id ───────────────────────────────────────────
const deleteScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found.' });
    res.json({ success: true, message: 'Scheme deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @PATCH /api/admin/schemes/:id/toggle ─────────────────────────────────────
const toggleScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found.' });
    scheme.isActive = !scheme.isActive;
    await scheme.save();
    res.json({ success: true, message: `Scheme ${scheme.isActive ? 'activated' : 'deactivated'}.`, scheme });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getStats, getUsers, toggleUser,
  getAdminSchemes, createScheme, updateScheme, deleteScheme, toggleScheme,
};

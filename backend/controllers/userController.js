const SavedScheme = require('../models/SavedScheme');

// ── @GET /api/users/saved-schemes ────────────────────────────────────────────
const getSavedSchemes = async (req, res) => {
  try {
    const saved = await SavedScheme.find({ user: req.user._id })
      .populate({ path: 'scheme', select: '-eligibilityCriteria' })
      .sort('-createdAt');
    res.json({ success: true, savedSchemes: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @POST /api/users/saved-schemes/:schemeId ─────────────────────────────────
const saveScheme = async (req, res) => {
  try {
    const existing = await SavedScheme.findOne({
      user   : req.user._id,
      scheme : req.params.schemeId,
    });
    if (existing)
      return res.status(400).json({ success: false, message: 'Scheme already bookmarked.' });

    await SavedScheme.create({ user: req.user._id, scheme: req.params.schemeId });
    res.json({ success: true, message: 'Scheme bookmarked.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @DELETE /api/users/saved-schemes/:schemeId ───────────────────────────────
const removeSavedScheme = async (req, res) => {
  try {
    await SavedScheme.findOneAndDelete({ user: req.user._id, scheme: req.params.schemeId });
    res.json({ success: true, message: 'Scheme removed from bookmarks.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getSavedSchemes, saveScheme, removeSavedScheme };

const Scheme      = require('../models/Scheme');
const SavedScheme = require('../models/SavedScheme');

// ── @GET /api/schemes ─────────────────────────────────────────────────────────
const getSchemes = async (req, res) => {
  try {
    const {
      search, category, state, benefitType, tag,
      sort = '-createdAt',
      page = 1, limit = 12,
      featured,
    } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name        : { $regex: search, $options: 'i' } },
        { description : { $regex: search, $options: 'i' } },
        { ministry    : { $regex: search, $options: 'i' } },
        { tags        : { $regex: search, $options: 'i' } },
      ];
    }
    if (category)    query.category    = { $regex: `^${category}$`, $options: 'i' };
    if (benefitType) query.benefitType = benefitType;
    if (tag)         query.tags        = { $in: [tag] };
    if (featured === 'true') query.isFeatured = true;
    if (state) {
      // schemes with empty states array = pan-India; else must include state
      query.$or = [{ states: { $size: 0 } }, { states: { $in: [state] } }];
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Scheme.countDocuments(query);

    const schemes = await Scheme.find(query)
      .select('-eligibilityCriteria')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success : true,
      total,
      page    : Number(page),
      pages   : Math.ceil(total / Number(limit)),
      schemes,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @GET /api/schemes/featured ────────────────────────────────────────────────
const getFeaturedSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find({ isActive: true, isFeatured: true })
      .select('-eligibilityCriteria')
      .limit(6)
      .sort('-viewCount');
    res.json({ success: true, schemes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @GET /api/schemes/saved  (auth required) ──────────────────────────────────
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

// ── @GET /api/schemes/:id ─────────────────────────────────────────────────────
const getScheme = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = /^[a-f\d]{24}$/i.test(id);

    const scheme = await Scheme.findOne({
      ...(isObjectId ? { _id: id } : { slug: id }),
      isActive: true,
    });

    if (!scheme)
      return res.status(404).json({ success: false, message: 'Scheme not found.' });

    scheme.viewCount += 1;
    await scheme.save({ validateBeforeSave: false });

    res.json({ success: true, scheme });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @POST /api/schemes/:id/save ───────────────────────────────────────────────
const saveScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme)
      return res.status(404).json({ success: false, message: 'Scheme not found.' });

    const existing = await SavedScheme.findOne({ user: req.user._id, scheme: req.params.id });
    if (existing)
      return res.status(400).json({ success: false, message: 'Scheme already bookmarked.' });

    await SavedScheme.create({ user: req.user._id, scheme: req.params.id });
    res.json({ success: true, message: 'Scheme bookmarked successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @DELETE /api/schemes/:id/save ─────────────────────────────────────────────
const unsaveScheme = async (req, res) => {
  try {
    await SavedScheme.findOneAndDelete({ user: req.user._id, scheme: req.params.id });
    res.json({ success: true, message: 'Scheme removed from bookmarks.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getSchemes, getScheme, getFeaturedSchemes, getSavedSchemes, saveScheme, unsaveScheme };

const Category = require('../models/Category');
const Scheme   = require('../models/Scheme');

// ── @GET /api/categories ──────────────────────────────────────────────────────
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('name');

    // Attach live scheme counts
    const enriched = await Promise.all(
      categories.map(async (cat) => {
        const count = await Scheme.countDocuments({ category: cat.name, isActive: true });
        return { ...cat.toObject(), schemeCount: count };
      })
    );

    res.json({ success: true, categories: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @POST /api/categories  (admin) ───────────────────────────────────────────
const createCategory = async (req, res) => {
  try {
    const { name, description, icon, color } = req.body;
    if (!name)
      return res.status(400).json({ success: false, message: 'Category name is required.' });

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const category = await Category.create({ name, slug, description, icon, color });
    res.status(201).json({ success: true, category });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ success: false, message: 'Category already exists.' });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @PUT /api/categories/:id  (admin) ────────────────────────────────────────
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category)
      return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @DELETE /api/categories/:id  (admin) ─────────────────────────────────────
const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };

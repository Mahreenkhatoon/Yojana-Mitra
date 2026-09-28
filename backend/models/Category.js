const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name        : { type: String, required: true, unique: true, trim: true },
  slug        : { type: String, required: true, unique: true, lowercase: true },
  description : { type: String, default: '' },
  icon        : { type: String, default: '📋' },   // emoji or icon class name
  color       : { type: String, default: '#1a56db' },
  isActive    : { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);

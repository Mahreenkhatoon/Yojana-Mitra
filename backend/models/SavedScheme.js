const mongoose = require('mongoose');

const savedSchemeSchema = new mongoose.Schema({
  user   : { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
  scheme : { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
  notes  : { type: String, default: '' },
}, { timestamps: true });

// Prevent the same scheme being saved twice by the same user
savedSchemeSchema.index({ user: 1, scheme: 1 }, { unique: true });

module.exports = mongoose.model('SavedScheme', savedSchemeSchema);

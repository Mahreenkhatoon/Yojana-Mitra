const mongoose = require('mongoose');

/**
 * A single eligibility rule.
 * field    – profile key to test  (e.g. "age", "income", "gender")
 * operator – lte | gte | lt | gt | eq | ne | in | nin | between | boolean
 * value    – scalar or array
 * valueMax – used only for "between"
 * label    – human-readable description of the condition
 * fieldLabel – friendly name for the field (e.g. "Age", "Annual Income")
 */
const ruleSchema = new mongoose.Schema({
  field      : { type: String, required: true },
  operator   : { type: String, required: true },
  value      : { type: mongoose.Schema.Types.Mixed, required: true },
  valueMax   : { type: mongoose.Schema.Types.Mixed },
  label      : { type: String, required: true },
  fieldLabel : { type: String, required: true },
}, { _id: false });

const schemeSchema = new mongoose.Schema({
  name        : { type: String, required: [true, 'Scheme name is required'], trim: true },
  slug        : { type: String, unique: true, lowercase: true },
  description : { type: String, required: [true, 'Description is required'] },
  objective   : { type: String, default: '' },

  category    : { type: String, required: [true, 'Category is required'] },
  ministry    : { type: String, required: [true, 'Ministry / Department is required'] },
  targetBeneficiaries : { type: String, default: '' },

  // ── Eligibility ─────────────────────────────────────────────────────────────
  eligibilityCriteria : [ruleSchema],
  eligibilitySummary  : { type: String, default: '' },   // plain-text for display

  // ── Benefits ─────────────────────────────────────────────────────────────────
  benefits       : [{ type: String }],
  benefitAmount  : { type: String, default: '' },
  benefitType    : {
    type    : String,
    enum    : ['financial', 'subsidy', 'loan', 'insurance', 'education',
               'housing', 'employment', 'health', 'other'],
    default : 'other',
  },

  // ── Documents & Process ───────────────────────────────────────────────────────
  documents           : [{ type: String }],
  applicationProcess  : [{ type: String }],

  // ── Links ─────────────────────────────────────────────────────────────────────
  officialWebsite  : { type: String, default: '' },
  applicationLink  : { type: String, default: '' },
  helplineNumber   : { type: String, default: '' },

  // ── Metadata ──────────────────────────────────────────────────────────────────
  launchYear  : { type: Number },
  isActive    : { type: Boolean, default: true },
  isFeatured  : { type: Boolean, default: false },
  states      : [{ type: String }],   // empty array = pan-India
  tags        : [{ type: String }],
  viewCount   : { type: Number, default: 0 },
}, { timestamps: true });

// Auto-generate slug from name before save
schemeSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

module.exports = mongoose.model('Scheme', schemeSchema);

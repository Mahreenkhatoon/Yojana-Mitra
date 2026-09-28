const Scheme                = require('../models/Scheme');
const { matchSchemes }      = require('../middleware/eligibilityEngine');

// Required profile fields – any missing field triggers a 400
const REQUIRED = ['age', 'gender', 'state', 'income', 'occupation', 'category', 'location'];

// ── @POST /api/eligibility/check ──────────────────────────────────────────────
// Open to all – no auth needed so citizens can check without registering
const checkEligibility = async (req, res) => {
  try {
    const profile = req.body.profile;

    if (!profile || typeof profile !== 'object')
      return res.status(400).json({ success: false, message: 'A "profile" object is required in the request body.' });

    // Validate required fields
    const missing = REQUIRED.filter(f => profile[f] === undefined || profile[f] === '' || profile[f] === null);
    if (missing.length > 0)
      return res.status(400).json({
        success : false,
        message : `Missing required fields: ${missing.join(', ')}`,
        missing,
      });

    // Coerce numeric fields
    profile.age        = Number(profile.age);
    profile.income     = Number(profile.income);
    if (profile.familySize) profile.familySize = Number(profile.familySize);

    // Normalise booleans
    profile.disability    = profile.disability    === true || profile.disability    === 'true';
    profile.landOwnership = profile.landOwnership === true || profile.landOwnership === 'true';
    profile.bankAccount   = profile.bankAccount   !== false && profile.bankAccount  !== 'false';

    // Load all active schemes (including eligibilityCriteria)
    const schemes = await Scheme.find({ isActive: true });

    if (schemes.length === 0)
      return res.json({
        success : true,
        profile,
        summary : { total: 0, eligible: 0, partial: 0, notEligible: 0 },
        results : [],
        message : 'No schemes found in the database. Please run the seed script.',
      });

    // Run the engine
    const results     = matchSchemes(schemes, profile);
    const eligible    = results.filter(r => r.status === 'eligible');
    const partial     = results.filter(r => r.status === 'partial');
    const notEligible = results.filter(r => r.status === 'not_eligible');

    res.json({
      success : true,
      profile,
      summary : {
        total      : results.length,
        eligible   : eligible.length,
        partial    : partial.length,
        notEligible: notEligible.length,
      },
      results,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { checkEligibility };

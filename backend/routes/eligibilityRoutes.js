const express = require('express');
const router  = express.Router();
const { checkEligibility } = require('../controllers/eligibilityController');

// Public route — no auth required so citizens can check without registering
router.post('/check', checkEligibility);

module.exports = router;

const express = require('express');
const router  = express.Router();
const { getSavedSchemes, saveScheme, removeSavedScheme } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // all user routes require login

router.get('/saved-schemes',                getSavedSchemes);
router.post('/saved-schemes/:schemeId',     saveScheme);
router.delete('/saved-schemes/:schemeId',   removeSavedScheme);

module.exports = router;

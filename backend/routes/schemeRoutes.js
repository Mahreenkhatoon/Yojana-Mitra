const express = require('express');
const router  = express.Router();
const {
  getSchemes, getScheme, getFeaturedSchemes,
  getSavedSchemes, saveScheme, unsaveScheme,
} = require('../controllers/schemeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',          getSchemes);
router.get('/featured',  getFeaturedSchemes);
router.get('/saved',     protect, getSavedSchemes);
router.get('/:id',       getScheme);
router.post('/:id/save',   protect, saveScheme);
router.delete('/:id/save', protect, unsaveScheme);

module.exports = router;

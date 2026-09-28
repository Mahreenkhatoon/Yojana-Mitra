const express = require('express');
const router  = express.Router();
const {
  getStats, getUsers, toggleUser,
  getAdminSchemes, createScheme, updateScheme, deleteScheme, toggleScheme,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly); // all admin routes require admin JWT

router.get('/stats',                  getStats);
router.get('/users',                  getUsers);
router.patch('/users/:id/toggle',     toggleUser);

router.get('/schemes',                getAdminSchemes);
router.post('/schemes',               createScheme);
router.put('/schemes/:id',            updateScheme);
router.delete('/schemes/:id',         deleteScheme);
router.patch('/schemes/:id/toggle',   toggleScheme);

module.exports = router;

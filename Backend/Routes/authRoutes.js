const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
} = require('../Controllers/authController');
const { protect } = require('../Middleware/authMiddleware');

// Public routes (accessible by anonymous guests)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private route (requires token verification)
router.get('/me', protect, getMe);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../Middleware/authMiddleware');
const User = require('../Model/userModel');

// @route   GET /api/admin/users
// @desc    Get all registered users (Admin Only)
// @access  Private/Admin
router.get('/users', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/admin/user-status/:id
// @desc    Activate/Deactivate user account (Admin Only)
// @access  Private/Admin
router.put('/user-status/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
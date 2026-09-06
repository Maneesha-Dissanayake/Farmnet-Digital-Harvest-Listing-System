const express = require('express');
const router = express.Router();
const adminAuth = require('../Middleware/adminAuth');
const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getPendingAds,
  moderateAd,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getChatAudits,
  updateAdminPassword,
  getPlatformSummaryReport,
  getAnalytics,
  getAdminSettings,
  updateAdminSettings,
} = require('../Controllers/adminController');

// Protect all admin routes globally with the admin authorization middleware
router.use(adminAuth);

// Dashboard Statistics Route
router.get('/stats', getDashboardStats);

// User Management Routes
router.get('/users', getAllUsers);
router.put('/users/:id/:action', updateUserStatus);

// Advertisement Moderation Routes
router.get('/ads/pending', getPendingAds);
router.put('/ads/:id/:action', moderateAd);

// Category Management Routes
router.get('/categories', getCategories);
router.post('/categories', addCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Chat Audits Route
router.get('/chats', getChatAudits);

// Admin Settings Routes (Profile & Password)
router.get('/settings', getAdminSettings);
router.put('/settings', updateAdminSettings);
router.put('/settings/password', updateAdminPassword);

// Platform Summary Report Route
router.get('/reports/summary', getPlatformSummaryReport);

// Analytics Route
router.get('/analytics', getAnalytics);
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
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
<<<<<<< Updated upstream
=======

// Analytics Route
router.get('/analytics', getAnalytics);
>>>>>>> Stashed changes

module.exports = router;
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
  deleteCategory,
  getChatAudits,
  updateAdminPassword,
  getPlatformSummaryReport,
} = require('../Controllers/adminController');

// Protect all admin routes with admin authorization middleware
router.use(adminAuth);

// Dashboard Statistics
router.get('/stats', getDashboardStats);

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id/:action', updateUserStatus);

// Ad Moderation
router.get('/ads/pending', getPendingAds);
router.put('/ads/:id/:action', moderateAd);

// Category Setup
router.get('/categories', getCategories);
router.post('/categories', addCategory);
router.delete('/categories/:id', deleteCategory);

// Chat Audits
router.get('/chats', getChatAudits);

// Settings
router.put('/settings/password', updateAdminPassword);

//New Report Summary
router.get('/reports/summary', getPlatformSummaryReport);

module.exports = router;
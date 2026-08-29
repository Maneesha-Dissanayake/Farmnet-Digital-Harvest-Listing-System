const express = require('express');
const router = express.Router();

// Import middleware and controllers
const adminAuth = require('../Middleware/adminAuth');
const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getPendingAds,
  moderateAd
} = require('../Controllers/adminController');

// Apply adminAuth middleware to all routes in this file
// router.use(adminAuth); // Temporarily commented for Postman testing

// Dashboard routes
router.get('/dashboard-stats', getDashboardStats);

// User management routes
router.get('/users', getAllUsers);
router.patch('/users/:userId/status', updateUserStatus);

// Advertisement moderation routes
router.get('/ads/pending', getPendingAds);
router.patch('/ads/:adId/moderate', moderateAd);

module.exports = router;
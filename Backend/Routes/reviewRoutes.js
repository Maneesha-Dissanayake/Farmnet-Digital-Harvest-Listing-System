// Express router for handling review endpoints
const express = require('express');
const router = express.Router();
const { createReview } = require('../Controllers/reviewController');

// Optional: If you use authentication middleware to check the token, import it here:
// const verifyToken = require('../Middleware/MiddlewareName');

// POST route: /api/reviews
router.post('/', createReview);
// If using auth middleware: router.post('/', verifyToken, createReview);

module.exports = router;
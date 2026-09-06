const mongoose = require('mongoose');

// Defines the review schema structure
const reviewSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Links to the seller being reviewed
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Links to the logged-in buyer giving the review
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  badge: {
    type: String,
    default: 'Verified Purchase'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Review', reviewSchema);
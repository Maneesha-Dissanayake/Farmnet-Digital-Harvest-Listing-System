const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Buyer', 'Seller', 'Admin'], // Role-based access
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Verified', 'Blocked'],
      default: 'Pending',
    },
    rating: {
      type: Number,
      default: 0, // Average rating for sellers
    },
    reviewCount: {
      type: Number,
      default: 0, // Total reviews received
    }
  },
  { timestamps: true } // Auto manage createdAt and updatedAt
);

module.exports = mongoose.model('User', userSchema);
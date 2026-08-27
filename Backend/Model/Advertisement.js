const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // Reference to category model
      required: true,
    },
    localVariety: {
      type: String,
      required: true, // e.g., 'Jaffna Special'
    },
    location: {
      type: String,
      required: true,
    },
    pricePerKg: {
      type: Number,
      required: true,
    },
    stockAvailable: {
      type: Number,
      required: true, // in kg
    },
    harvestDate: {
      type: Date,
      required: true,
    },
    images: {
      type: [String],
      validate: [arrayLimit, 'Exceeds the limit of 5 images'], // Max 5 Cloudinary URLs
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    }
  },
  { timestamps: true }
);

// Custom validation for max 5 images
function arrayLimit(val) {
  return val.length <= 5;
}

module.exports = mongoose.model('Advertisement', advertisementSchema);
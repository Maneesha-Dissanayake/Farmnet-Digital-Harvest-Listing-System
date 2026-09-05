const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportedItem: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // Can be User ID, Ad ID, or Chat ID
    },
    itemType: {
      type: String,
      enum: ['User', 'Advertisement', 'Chat'],
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Resolved'],
      default: 'Pending',
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      }
    ],
    isFlagged: {
      type: Boolean,
      default: false, // Admin can set this to true if spam is detected
    },
    lastMessageText: {
      type: String, // Useful for the chat audit preview UI
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', conversationSchema);
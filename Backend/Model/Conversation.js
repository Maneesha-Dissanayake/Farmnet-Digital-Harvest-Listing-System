const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
   participants: [
  {
    type: String,
    required: true,
  }
],

 // Product related to this conversation
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Advertisement",
      required: false,
    },
    
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
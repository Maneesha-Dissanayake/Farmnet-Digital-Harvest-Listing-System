const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
   participants: {
  type: [String],
  required: true,
  validate: {
    validator: (arr) => arr.length === 2,
    message: "A conversation must have exactly two participants",
      },
    },

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
      type: String,
      default: "", // Useful for the chat audit preview UI
    }
  },
  { timestamps: true }
);

// Prevent duplicate conversations
conversationSchema.index(
  { participants: 1, productId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  'Conversation',
  conversationSchema
);

module.exports = mongoose.model('Conversation', conversationSchema);
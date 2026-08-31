const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: false,
    },
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      trim: true,
    },
    text: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Fallback to ensure either text or message is populated
messageSchema.pre("save", function (next) {
  if (!this.message && this.text) {
    this.message = this.text;
  } else if (!this.text && this.message) {
    this.text = this.message;
  }
  next();
});

module.exports = mongoose.model("Message", messageSchema);
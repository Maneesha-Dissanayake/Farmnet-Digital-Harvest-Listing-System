const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      trim: true,
      required: true,
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
messageSchema.pre("save", function () {
  if (!this.message && this.text) {
    this.message = this.text;
  } else if (!this.text && this.message) {
    this.text = this.message;
  }
});

module.exports = mongoose.model("Message", messageSchema);
const Message = require("../Model/Message");
const Conversation = require("../Model/Conversation");

// Send message
const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message, productId } = req.body;

    if (!senderId || !receiverId || !message || !productId) {
      return res.status(400).json({
        success: false,
        message: "senderId, receiverId, message, and productId are required",
      });
    }

    // --- NEW LOGIC: Manage the Conversation for Admin Chat Audits ---
    // Check if a conversation already exists between these two users
   let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
    productId: productId,
  });

    // If it doesn't exist, create a new conversation
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        lastMessageText: message,
        productId: productId,
      });
    } else {
      // If it exists, just update the last message text and save
      conversation.lastMessageText = message;
      await conversation.save();
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      senderId,
      receiverId,
      message,
      text: message // Saving in 'text' as well due to pre-save hook fallback in Message model
    });

    const savedMessage = await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: savedMessage,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get conversation between two users
// Get messages for a specific product conversation
const getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId is required",
      });
    }

    // Find conversation for these two users + this product
    const conversation = await Conversation.findOne({
      participants: { $all: [user1, user2] },
      productId: productId,
    });

    // No conversation yet = no messages
    if (!conversation) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // Load only messages belonging to this conversation
    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: messages,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
module.exports = {
  sendMessage,
  getMessages,
};
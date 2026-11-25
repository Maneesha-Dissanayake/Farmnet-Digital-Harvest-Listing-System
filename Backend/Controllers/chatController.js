const Message = require("../Model/Message");
const Conversation = require("../Model/Conversation");
const User = require("../Model/userModel");

// Send message
const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message, productId } = req.body;

    if (!senderId || !receiverId || !message) {
      return res.status(400).json({
        success: false,
        message: "senderId, receiverId, message, and productId are required",
      });
    }

    // --- NEW LOGIC: Manage the Conversation for Admin Chat Audits ---
    // Check if a conversation already exists between these two users
   let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
    
  });

    // If it doesn't exist, create a new conversation
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        lastMessageText: message,
        ...(productId ? { productId } : {}),
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

    

    // Find conversation for these two users + this product
    const conversation = await Conversation.findOne({
      participants: { $all: [user1, user2] },
     
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
const createOrGetConversation = async (req, res) => {
  try {
    const { buyerId, sellerId, productId } = req.body;

    if (!buyerId || !sellerId) {
      return res.status(400).json({
        success: false,
        message: "buyerId and sellerId are required",
      });
    }

    // Check whether conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [buyerId, sellerId] },
    });

    // Create only if it doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [buyerId, sellerId],
        productId: productId || null,
        lastMessageText: "",
      });
    }

    return res.status(200).json({
      success: true,
      data: conversation,
    });

  } catch (error) {
    console.error("Conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Get all conversations for this user
    const conversations = await Conversation.find({
      participants: userId,
    }).sort({ updatedAt: -1 });

    // Get the other user's details
    const conversationList = await Promise.all(
      conversations.map(async (conversation) => {

        const otherUserId = conversation.participants.find(
          (id) => id !== userId
        );

        const otherUser = await User.findById(otherUserId).select(
          "username fullName profileImage role"
        );

        return {
          conversationId: conversation._id,
          userId: otherUserId,

          name:
            otherUser?.username ||
            otherUser?.fullName ||
            "User",

          image: otherUser?.profileImage || "",
          role: otherUser?.role || "",

          lastMessage:
            conversation.lastMessageText || "No messages yet",

          productId: conversation.productId,
          updatedAt: conversation.updatedAt,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: conversationList,
    });

  } catch (error) {
    console.error("Get conversations error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
module.exports = {
  sendMessage,
  getMessages,
  createOrGetConversation,
  getUserConversations,
};
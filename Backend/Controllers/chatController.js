const mongoose = require("mongoose");
const Advertisement = require("../Model/advertiesetment");

const Message = require("../Model/Message");
const Conversation = require("../Model/Conversation");
const User = require("../Model/userModel");

const createParticipantKey = (user1, user2) => {
  return [String(user1), String(user2)].sort().join("_");
};

const getCurrentUserId = (req) => String(req.user._id);

// Validate product ID
const isValidProductId = (productId) => {
  return !productId || mongoose.Types.ObjectId.isValid(productId);
};

// Find conversation using participants and product
const findConversation = (user1, user2, productId) => {
  const query = {
    participants: {
      $all: [String(user1), String(user2)],
      $size: 2,
    },
  };

  if (productId) {
    query.productId = new mongoose.Types.ObjectId(productId);
  } else {
    query.$or = [
      { productId: null },
      { productId: { $exists: false } },
    ];
  }

  return Conversation.findOne(query);
};

// Send message
const sendMessage = async (req, res) => {
  try {
    const senderId = getCurrentUserId(req);
    const { receiverId, message, productId } = req.body;

        
      if (!receiverId) {
        return res.status(400).json({
          success: false,
          message: "Receiver ID is required",
        });
      }

      if (typeof message !== "string") {
        return res.status(400).json({
          success: false,
          message: "Message must be a string",
        });
      }


      if (!cleanMessage) {
        return res.status(400).json({
          success: false,
          message: "Message cannot be empty",
        });
      }

      if (cleanMessage.length > 1000) {
        return res.status(400).json({
          success: false,
          message: "Message cannot exceed 1000 characters",
        });
      }


    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid receiver ID",
      });
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    if (!["buyer", "seller"].includes(receiver.role)) {
      return res.status(403).json({
        success: false,
        message: "Invalid receiver role",
      });
    }

    if (!receiver.isActive) {
      return res.status(403).json({
        success: false,
        message: "Receiver account is inactive",
      });
    }

    const sender = await User.findById(senderId);

    if (!sender) {
      return res.status(404).json({
        success: false,
        message: "Sender not found",
      });
    }

    if (!["buyer", "seller"].includes(sender.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to send messages",
      });
    }

    if (sender.role === receiver.role) {
      return res.status(403).json({
        success: false,
        message: "Chat is only allowed between buyers and sellers",
      });
    }

    if (!sender.isActive) {
      return res.status(403).json({
        success: false,
        message: "Sender account is inactive",
      });
    }



    if (senderId === String(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a message to yourself",
     });
   }

  if (!isValidProductId(productId)) {
  return res.status(400).json({
    success: false,
    message: "Invalid product ID",
  });
}

    if (productId) {
      const product = await Advertisement.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Advertisement not found",
        });
      }

      const sellerParticipantId =sender.role === "seller" ? senderId : receiverId;

      if (String(product.seller_id) !== String(sellerParticipantId)) {
        return res.status(403).json({
          success: false,
          message: "This product does not belong to the receiver",
        });
      }
    }

    let conversation = await findConversation(
  senderId,
  receiverId,
  productId
);

    // If it doesn't exist, create a new conversation
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        lastMessageText: "",
        ...(productId ? { productId } : {}),
      });
    } 

    const cleanMessage = message.trim();
    const newMessage = new Message({
      conversationId: conversation._id,
      senderId,
      receiverId,
      message: cleanMessage,
      text: cleanMessage,
    });

    const savedMessage = await newMessage.save();
    conversation.lastMessageText = cleanMessage;
    await conversation.save();
     // Emit message after saving
    const io = req.app.get("io");

    if (io) {
      io.to(String(receiverId)).emit("receiveMessage", savedMessage);
    }

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
    const currentUserId = getCurrentUserId(req);

        if (String(user1) === String(user2)) {
            return res.status(400).json({
              success: false,
              message: "Invalid conversation participants",
            });
          }
        if (
          !mongoose.Types.ObjectId.isValid(user1) ||
          !mongoose.Types.ObjectId.isValid(user2)
        ) {
          return res.status(400).json({
            success: false,
            message: "Invalid user ID",
          });
        }

      if (
        String(user1) !== currentUserId &&
        String(user2) !== currentUserId
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to view this conversation",
        });
      }

    

    // Find conversation for these two users + this product
    if (!isValidProductId(productId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }

  if (productId) {
  const product = await Advertisement.findById(productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Advertisement not found",
    });
  }
}

  const conversation = await findConversation(
    user1,
    user2,
    productId
  );

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

if (
  !mongoose.Types.ObjectId.isValid(buyerId) ||
  !mongoose.Types.ObjectId.isValid(sellerId)
) {
  return res.status(400).json({
    success: false,
    message: "Invalid buyer or seller ID",
  });
}

if (String(buyerId) === String(sellerId)) {
  return res.status(400).json({
    success: false,
    message: "Buyer and seller cannot be the same user",
  });
}



const buyer = await User.findById(buyerId);

if (!buyer) {
  return res.status(404).json({
    success: false,
    message: "Buyer not found",
  });
}


const seller = await User.findById(sellerId);

if (!seller) {
  return res.status(404).json({
    success: false,
    message: "Seller not found",
  });
}


if (buyer.role !== "buyer") {
  return res.status(403).json({
    success: false,
    message: "User is not a buyer",
  });
}

if (seller.role !== "seller") {
  return res.status(403).json({
    success: false,
    message: "User is not a seller",
  });
}


if (!buyer.isActive) {
  return res.status(403).json({
    success: false,
    message: "Buyer account is inactive",
  });
}

if (!seller.isActive) {
  return res.status(403).json({
    success: false,
    message: "Seller account is inactive",
  });
}




const currentUserId = getCurrentUserId(req);

if (
  String(buyerId) !== currentUserId &&
  String(sellerId) !== currentUserId
) {
  return res.status(403).json({
    success: false,
    message: "You are not allowed to create this conversation",
  });
}

    // Check whether conversation already exists
      if (!isValidProductId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

      if (productId) {
        const product = await Advertisement.findById(productId);

        if (!product) {
          return res.status(404).json({
            success: false,
            message: "Advertisement not found",
          });
        }

        if (String(product.seller_id) !== String(sellerId)) {
          return res.status(403).json({
            success: false,
            message: "This product does not belong to the seller",
          });
        }
    }

    let conversation = await findConversation(
      buyerId,
      sellerId,
      productId
    );

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

    const currentUserId = getCurrentUserId(req);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }


    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (String(userId) !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own conversations",
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
          (id) => String(id) !== String(userId)
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
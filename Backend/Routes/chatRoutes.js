const express = require("express");

const {
  sendMessage,
  getMessages,
  createOrGetConversation,
  getUserConversations,
} = require("../Controllers/chatController");

const router = express.Router();

router.post("/conversation", createOrGetConversation);

router.get("/conversations/:userId", getUserConversations);

router.post("/send", sendMessage);

router.get("/:user1/:user2", getMessages);

module.exports = router;
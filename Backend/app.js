require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/configure");
const chatRoutes = require("./Routes/chatRoutes");
const AdvertiestmentRoute = require("./Routes/AdvertiestmentRoute");
const authRoutes = require("./Routes/authRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const adminRoutes = require('./Routes/adminRoutes');

const app = express();
const server = http.createServer(app);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Socket Events
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.userId = userId;
    socket.join(userId);

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);

    const users = Array.from(onlineUsers.keys());
    console.log("JOIN:", userId);
    console.log("ONLINE USERS:", users);

    io.emit("onlineUsers", users);
  });

  socket.on("sendMessage", (data) => {
    io.to(data.receiverId).emit("receiveMessage", data);
  });

  socket.on("typing", (data) => {
    console.log("Typing Event:", data);
    socket.to(data.receiverId).emit("typing", {
      senderId: data.senderId,
    });
  });

  socket.on("stopTyping", (data) => {
    console.log("Stop Typing Event:", data);
    socket.to(data.receiverId).emit("stopTyping", {
      senderId: data.senderId,
    });
  });

  socket.on("disconnect", () => {
    const userId = socket.userId;

    if (userId && onlineUsers.has(userId)) {
      onlineUsers.get(userId).delete(socket.id);

      if (onlineUsers.get(userId).size === 0) {
        onlineUsers.delete(userId);
      }
    }

    const users = Array.from(onlineUsers.keys());
    console.log("DISCONNECT:", userId);
    console.log("ONLINE USERS:", users);

    io.emit("onlineUsers", users);
  });
});

// Global Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/advertisement", AdvertiestmentRoute);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/admin', adminRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "FarmNet API is live" });
});

app.get("/", (req, res) => {
  res.send("Database is connected and server is running");
});

// Connect to MongoDB 
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.log("Server failed to start:", err);
});

module.exports = app;
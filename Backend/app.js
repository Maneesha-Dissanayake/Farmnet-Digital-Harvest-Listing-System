const http = require("http");
const { Server } = require("socket.io");

const chatRoutes = require("./Routes/chatRoutes");

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/configure");
const AdvertiestmentRoute = require("./Routes/advertisementRoutes");
const authRoutes = require("./Routes/authRoutes");


const app = express();

const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//Socket events
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.userId = userId;
    socket.join(userId);

    // One user can have multiple sockets/tabs
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

  // typing started
socket.on("typing", (data) => {
  console.log("Typing Event:", data);
  socket.to(data.receiverId).emit("typing", {
    senderId: data.senderId,
  });
});

// typing stopped
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

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/advertisement", AdvertiestmentRoute);
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "FarmNet API is live" });
});


// Test route
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


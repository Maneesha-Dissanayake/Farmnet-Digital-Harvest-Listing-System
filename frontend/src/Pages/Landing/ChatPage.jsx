import {io} from "socket.io-client";

import React, { useEffect, useState } from "react";

import ChatSidebar from "../../Components/Chat/ChatSidebar";
import ChatHeader from "../../Components/Chat/ChatHeader";
import MessageList from "../../Components/Chat/MessageList";
import MessageInput from "../../Components/Chat/MessageInput";

const socket = io("http://localhost:5000");
function ChatPage() {
 const params = new URLSearchParams(window.location.search);

const currentUserId =
  params.get("user") || "seller001";
   const [selectedUser, setSelectedUser] = useState(currentUserId==="seller001"?{
    id: 1,
    userId: "buyer001",
    name: "Kasun Perera",
    status: "ACTIVE NEGOTIATION",
  }:{
    id: 1,
        userId: "seller001",
        name: "Seller",
        status: "ACTIVE NEGOTIATION",
  }
);

  const selectedUserId = selectedUser.userId;
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});

   // Socket.IO useEffect

   useEffect(() => {
  const handleOnlineUsers = (users) => {
    console.log("Online users:", users);
    setOnlineUsers(users);
  };

  const handleReceiveMessage = (data) => {
    console.log("Received message:", data);
    if (data.senderId !== selectedUserId){
      setUnreadCounts((prev) => ({
        ...prev,
        [data.senderId]: (prev[data.senderId] || 0) + 1,
      }));

      return;
    }
    
    const newMessage = {
      id: Date.now(),
      sender: "other",
      text: data.message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      newMessage,
    ]);
  };


  // Typing started
  const handleTyping = (data) => {
    if (data.senderId === selectedUserId) {
      setIsTyping(true);
    }
  };

  // Typing stopped
  const handleStopTyping = (data) => {
    if (data.senderId === selectedUserId) {
      setIsTyping(false);
    }
  };

  // Listener first
  socket.on("onlineUsers", handleOnlineUsers);
  socket.on("receiveMessage", handleReceiveMessage);
  socket.on("typing", handleTyping);
  socket.on("stopTyping", handleStopTyping);

  // Then join room
  socket.emit("join", currentUserId);

  return () => {
    socket.off("onlineUsers", handleOnlineUsers);
    socket.off("receiveMessage", handleReceiveMessage);
    socket.off("typing", handleTyping);
    socket.off("stopTyping", handleStopTyping);
  };
}, [currentUserId, selectedUserId]);
    

  // Load messages from backend
  useEffect(() => {
    const loadMessages = async () => {
      try {
        console.log("Loading messages...");

        const response = await fetch(
          `http://localhost:5000/api/chat/${currentUserId}/${selectedUserId}`
        );

        const data = await response.json();

        console.log("Backend response:", data);

        if (data.success) {
          const formattedMessages = data.data.map((msg) => ({
            id: msg._id,
            sender: msg.senderId === currentUserId ? "me" : "other",
            text: msg.message,
            time: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));

          console.log("Formatted messages:", formattedMessages);

          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();
  }, [selectedUserId]);

  // Send message
  const sendMessage = async (message) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/chat/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: currentUserId,
            receiverId: selectedUserId,
            message: message,
          }),
        }
      );

      const data = await response.json();

      console.log("Send response:", data);

      if (data.success) {
        const savedMessage = data.data;

        const newMessage = {
          id: savedMessage._id,
          sender: "me",
          text: savedMessage.message,
          time: new Date(savedMessage.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prevMessages) => [
          ...prevMessages,
          newMessage,
        ]);
        // Emit the message to the receiver via Socket.IO
        socket.emit("sendMessage", {
          senderId: currentUserId,
          receiverId: selectedUserId,
          message: savedMessage.message,
        });

      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {currentUserId === "seller001" && (
        <ChatSidebar
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        unreadCounts={unreadCounts}
        setUnreadCounts={setUnreadCounts}
      />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader user={selectedUser}
        isOnline={onlineUsers.includes(selectedUserId)} />

        <MessageList messages={messages} isTyping={isTyping} typingUser={selectedUser.name} />

        <MessageInput
            sendMessage={sendMessage}
            onTyping={() => {
              socket.emit("typing", {
                senderId: currentUserId,
                receiverId: selectedUserId,
              });
            }}
            onStopTyping={() => {
              socket.emit("stopTyping", {
                senderId: currentUserId,
                receiverId: selectedUserId,
              });
            }}
        />
      </div>
    </div>
  );
}

export default ChatPage;
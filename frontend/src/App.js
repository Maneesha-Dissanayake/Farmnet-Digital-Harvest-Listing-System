import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Landing/Home";
import ChatPage from "./Pages/Landing/ChatPage";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mainhome" element={<Home />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
}

export default App;
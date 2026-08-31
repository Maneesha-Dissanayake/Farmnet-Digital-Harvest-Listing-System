import React, { useState, useEffect } from 'react';
import Sidebar from './Components/AdminSidebar';
import { Search, Bell, ArrowRightLeft } from 'lucide-react';

const ChatAudits = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Removed dummy data and initialized with an empty array for database fetching
  const [chatLogs, setChatLogs] = useState([]);

  // Fetch data from the database on component mount and when search term changes
  useEffect(() => {
    fetchChatLogs();
  }, [searchTerm]);

  const fetchChatLogs = async () => {
    try {
      // URL for the backend Admin Chat API endpoint (Adjust this based on your actual backend route)
      let url = 'http://localhost:5000/api/admin/chats';
      
      if (searchTerm) {
        url += `?search=${searchTerm}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      // Update state with the data fetched from the database
      setChatLogs(data);
    } catch (error) {
      console.error("Error fetching chat audits from database:", error);
    }
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans">
      {/* Reusable Admin Sidebar */}
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Header Section */}
        <header className="bg-white px-8 py-6 flex justify-between items-start border-b border-gray-100">
          <div>
            <h1 className="text-[32px] font-bold text-gray-900 leading-tight">Chat audits</h1>
            <p className="text-gray-500 text-sm mt-1">Scan conversations for spam or fraud.</p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Global search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-[300px] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Main Content Container */}
        <div className="p-8">
          <div className="bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
            
            {/* Chat List Container */}
            <div className="flex flex-col">
              {chatLogs.length > 0 ? (
                chatLogs.map((chat, index) => (
                  <div 
                    key={chat._id} 
                    className={`flex items-center justify-between p-4 ${
                      index !== chatLogs.length - 1 ? 'border-b border-gray-100' : ''
                    } hover:bg-gray-50 transition-colors cursor-pointer rounded-lg`}
                  >
                    {/* Left Side: Users and Message Snippet */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                        {/* These properties might vary based on your backend response structure (e.g., chat.sender.name) */}
                        <span>{chat.user1Name || 'User 1'}</span>
                        <ArrowRightLeft size={14} className="text-gray-400" />
                        <span>{chat.user2Name || 'User 2'}</span>
                      </div>
                      <p className="text-xs text-gray-400 font-medium">
                        {chat.lastMessage || chat.message}
                      </p>
                    </div>

                    {/* Right Side: Badges and Checkbox */}
                    <div className="flex items-center gap-4">
                      {chat.isFlagged && (
                        <span className="bg-red-50 text-red-500 text-[11px] font-bold px-3 py-1 rounded-full border border-red-100">
                          Flagged
                        </span>
                      )}
                      
                      {/* Checkbox placeholder */}
                      <div className="w-5 h-5 border-2 border-gray-200 rounded-md cursor-pointer hover:border-emerald-500 transition-colors flex items-center justify-center">
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No chat logs found in the database.
                </div>
              )}
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default ChatAudits;
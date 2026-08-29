import React, { useState } from "react";

import kasunImg from "../../Assets/kasun.png";
import anilImg from "../../Assets/Anil.png";
import priyaImg from "../../Assets/priya.png";

function ChatSidebar({ selectedUser, setSelectedUser, unreadCounts, setUnreadCounts }) {
  const [search, setSearch] = useState("");

  const users = [
    {
      id: 1,
      userId: "buyer001",
      name: "Kasun Perera",
      image: kasunImg,
      lastMessage: "Let's meet at 435 LKR/kg.",
      time: "10:30 AM",
    },
    {
      id: 2,
      userId: "buyer002",
      name: "Anil Silva",
      image: anilImg,
      lastMessage: "Is the price negotiable?",
      time: "10:30 AM",
    },
    {
      id: 3,
      userId: "buyer003",
      name: "Priya Sharma",
      image: priyaImg,
      lastMessage: "Are you saying the option of delivery is available?",
      time: "10:30 AM",
    },
  ];

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-[190px] shrink-0 border-r border-gray-200 bg-white">
      <div className="flex h-[60px] items-center gap-2 border-b border-gray-200 px-4">
        <span className="text-sm text-gray-500">⌕</span>

        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-none bg-transparent text-[10px] outline-none placeholder:text-gray-500"
        />
      </div>

      <div className="flex flex-col">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => {
              setSelectedUser({
                id: user.id,
                userId: user.userId,
                name: user.name,
                image: user.image,
                status: "ACTIVE NEGOTIATION",
              });
              setUnreadCounts((prev) => ({
                ...prev,
                [user.userId]: 0,
              }));
            }}
            className={`flex cursor-pointer items-center gap-2 border-b border-gray-200 px-3 py-3 ${
              selectedUser.id === user.id
                ? "bg-emerald-50"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <img
              src={user.image}
              alt={user.name}
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="truncate text-[10px] font-semibold text-gray-800">
                  {user.name}
                </h4>
                <div className="flex items-center gap-1">
                  {unreadCounts[user.userId] > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-700 px-1 text-[7px] font-bold text-white">
                      {unreadCounts[user.userId]}
                    </span>
                  )}

                <span className="shrink-0 text-[6px] text-gray-500">
                  {user.time}
                </span>
              </div>
              </div>

              <p className="mt-0.5 line-clamp-2 text-[8px] leading-tight text-gray-600">
                {user.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default ChatSidebar;
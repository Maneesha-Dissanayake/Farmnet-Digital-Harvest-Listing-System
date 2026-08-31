import React from "react";
import kasunImg from "../../Assets/kasun.png";

function ChatHeader({ user, isOnline }) {
  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="flex items-center gap-2">
        <img
          src={user.image || kasunImg}
          alt={user.name}
          className="h-12 w-12 rounded-full object-cover"
        />

        <div>
          <h3 className="text-[14px] font-semibold leading-tight text-gray-900">
            {user.name}
          </h3>

         <p
              className={`mt-0.5 text-[7px] font-bold ${
                isOnline ? "text-green-600" : "text-gray-400"
              }`}
            >
              {isOnline ? "ONLINE" : "OFFLINE"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-950 text-sm">
          🌿
        </div>

        <div className="h-8 w-16 rounded-md border border-gray-100 bg-white"></div>
      </div>
    </header>
  );
}

export default ChatHeader;
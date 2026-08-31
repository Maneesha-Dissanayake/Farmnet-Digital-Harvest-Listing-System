import React from "react";

function MessageList({ messages,isTyping,typingUser }) {
  return (
    <div className="flex-1 overflow-y-auto bg-white px-5 py-4">
      {messages.map((message) => {
        const isMe = message.sender === "me";

        return (
          <div
            key={message.id}
            className={`mb-4 flex flex-col ${
              isMe ? "items-end" : "items-start"
            }`}
          >
            {!isMe && (
              <span className="mb-1 ml-1 text-[9px] font-medium text-gray-700">
                Kasun Perera
              </span>
            )}

            <div
              className={`max-w-[72%] rounded-xl px-3 py-2 text-[14px] leading-relaxed ${
                isMe
                  ? "border border-emerald-50 bg-emerald-50/30 text-emerald-950 shadow-sm"
                  : "border border-gray-200 bg-white text-gray-800 shadow-sm"
              }`}
            >
              {message.text}
            </div>

            <span
              className={`mt-1 text-[6px] text-gray-400 ${
                isMe ? "mr-1" : "ml-1"
              }`}
            >
              {message.time}
              {isMe && " ✓✓"}
            </span>
          </div>
        );
      })}

    
      {isTyping && (
        <div className="mb-3 ml-1 text-[8px] italic text-gray-400">
          {typingUser} is typing...
        </div>
      )}

      <div className="mx-auto mt-2 w-fit rounded-full border border-emerald-300 px-4 py-1 text-[9px] text-emerald-600">
        Negotiation is trending 15% below market average for this region
      </div>
    </div>
  );
}

export default MessageList;
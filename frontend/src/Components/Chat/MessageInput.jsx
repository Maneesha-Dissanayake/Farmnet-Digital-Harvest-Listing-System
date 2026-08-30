import React, { useState } from "react";

function MessageInput({
  sendMessage,
  onTyping,
  onStopTyping,
}) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    sendMessage(message);

    // typing indicator stop
    onStopTyping();

    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;

    setMessage(value);

    if (value.trim()) {
      console.log("Typing...");
      onTyping();
    } else {
      console.log("Stopped typing");
      onStopTyping();
    }
  };

  return (
    <div className="flex h-[72px] shrink-0 items-center gap-2 border-t border-gray-200 bg-white px-4">

      <button
        type="button"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-lg text-gray-700"
      >
        +
      </button>

      <div className="flex h-10 flex-1 items-center rounded-full border border-gray-300 bg-white px-3">

        <input
          type="text"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message or counter-offer..."
          className="h-full min-w-0 flex-1 border-none bg-transparent text-[13px] text-gray-700 outline-none placeholder:text-gray-400"
        />

        <button
          type="button"
          className="ml-2 bg-transparent text-sm font-size:1.87rem"
        >
          ☺
        </button>

      </div>

      <button
        type="button"
        onClick={handleSend}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-900 text-sm text-white hover:bg-emerald-800"
      >
        ➤
      </button>

    </div>
  );
}

export default MessageInput;
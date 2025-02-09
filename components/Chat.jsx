"use client";
import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

const Chat = ({ conversationId }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "other", text: "Hi!", time: "22:00" },
    { id: 2, sender: "me", text: "lol", time: "22:01" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      { id: Date.now(), sender: "me", text: input, time: "22:02" },
    ]);
    setInput("");
  };

  if (!conversationId)
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center text-gray-500">
        Select a conversation
      </div>
    );

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b flex justify-between items-center bg-white">
        <span className="font-medium text-lg">Jane Doe</span>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            } mb-2`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                msg.sender === "me"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex items-center bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border px-4 py-2 rounded-lg"
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Chat;

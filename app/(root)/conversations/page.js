"use client";

import { useState } from "react";
import Conversation from "@/components/Conversation";
import ChatWindow from "@/components/ChatWindow";

const ChatPage = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);

  return (
    <div className="flex h-screen"> {/* 👈 full screen height */}
      <div className="hidden md:block w-72 border-r">
        <Conversation onSelect={setSelectedChatId} />
      </div>
      <div className="flex-1 overflow-hidden"> {/* 👈 allow chat to scroll inside */}
        {selectedChatId ? (
          <ChatWindow chatId={selectedChatId} />
        ) : (
          <div className="p-4 text-gray-500">Select a conversation</div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

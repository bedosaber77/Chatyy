"use client";

import { useState } from "react";
import Conversation from "@/components/Conversation";
import ChatWindow from "@/components/ChatWindow";
import { useMediaQuery } from "react-responsive";

const ChatPage = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedChat, setSelectedChat] = useState({});
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const handleChatSelection = (chatId, chatName, chatImg) => {
    setSelectedChatId(chatId);
    setSelectedChat({ chatId, chatName, chatImg });
  };

  const SetSelectedChatId = (chatId) => {
    setSelectedChatId(chatId);
    setSelectedChat((prev) => ({ ...prev, chatId })); // Update chatId in selectedChat
  };
  return (
    <>
      {isMobile ? (
        selectedChatId ? (
          <div className="flex h-screen">
            <ChatWindow chat={selectedChat} setChatId={SetSelectedChatId} />
          </div>
        ) : (
          <div className="flex h-screen">
            <div className="block w-full border-r">
              <Conversation onSelect={handleChatSelection} />
            </div>
          </div>
        )
      ) : (
        <div className="flex h-screen">
          <div className="hidden md:block w-72 border-r">
            <Conversation onSelect={handleChatSelection} />
          </div>
          <div className="flex-1 overflow-hidden">
            {selectedChatId ? (
              <ChatWindow chat={selectedChat} setChatId={SetSelectedChatId} />
            ) : (
              <div className="p-4 text-gray-500 items-center">
                Select a conversation
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPage;

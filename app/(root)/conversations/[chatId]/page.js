"use client";
import ChatWindow from "@/components/ChatWindow";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  const fetchChat = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/conversation?userId=${id}`);
      if (!res.ok) throw new Error("Failed to fetch chat");
      const data = await res.json();
      const chatData = data.find((chat) => chat.id === chatId);

      if (!chatData) {
        throw new Error("Chat not found");
      }

      const finalChatdata = {
        chatId: chatData.id,
        chatName: chatData.name,
        chatImg: chatData.image || "/default-avatar.png",
      };
      return finalChatdata;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatId && session?.user?.id) {
      console.log("Fetching chat for chatId:", chatId);
      fetchChat(session.user.id).then(setChat);
    }
  }, [chatId, session?.user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-4">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No chat selected</p>
      </div>
    );
  }

  return <ChatWindow chat={chat} />;
}

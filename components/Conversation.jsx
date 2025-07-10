"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import loading from "../app/loading";
import { UserPhoto } from "./userPhoto";

const Conversations = ({ onSelect }) => {
  const { data: session, status } = useSession();
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState(null);
  const [stillloading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const handleChatSelection = (chatId, chatName, chatImg) => {
    onSelect(chatId, chatName, chatImg);
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`/api/conversation?userId=${session.user.id}`);
        if (!res.ok) throw new Error("Failed to fetch conversations");

        const data = await res.json();
        setConversations(data);
        console.log("Conversations fetched:", data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError("Failed to load conversations.");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id && !hasFetched.current) {
      hasFetched.current = true;
      setLoading(true);
      fetchConversations();
    }
  }, [session]);

  if (status === "loading" || stillloading) return loading();

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="h-screen bg-white border-r flex flex-col">
      <h2 className="text-lg font-bold p-4 border-b">Conversations</h2>
      <div className="flex flex-col">
        {conversations.length === 0 ? (
          <p className="p-4 text-gray-500">No conversations yet.</p>
        ) : (
          conversations.map((chat) => (
            <button
              key={chat.id}
              className="p-4 text-left hover:bg-gray-100 border-b flex flex-row items-center gap-4"
              onClick={() => {
                handleChatSelection(chat.id, chat.name, chat.image);
              }}
            >
              <UserPhoto img={chat.image} />
              <div className="flex flex-col">
                <div className="font-medium">{chat.name}</div>
                <div className="text-sm text-gray-500">
                  {chat.lastMessage || "No messages yet"}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Conversations;

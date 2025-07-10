"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import { UserPhoto } from "./userPhoto";

let socket; // define socket outside to avoid multiple connections

const ChatWindow = ({ chat, setChatId }) => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Connect to socket server
  useEffect(() => {
    socket = io("http://localhost:4000");

    socket.on("newMessage", (msg) => {
      if (msg.chatId === chat.chatId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [chat]);

  // Fetch existing messages from API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?chatId=${chat.chatId}`);
        if (!res.ok) throw new Error("Failed to fetch messages");

        const data = await res.json();
        setMessages(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (chat.chatId) fetchMessages();
  }, [chat]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage = {
      chatId: chat.chatId,
      userId: session.user.id,
      text: messageInput,
    };

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const savedMessage = await res.json();

      socket.emit("newMessage", savedMessage);

      setMessages((prev) => [...prev, savedMessage]);
      setMessageInput("");
    } catch (err) {
      console.error("Send message error:", err);
      setError("Failed to send message.");
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row p-4 border-b bg-white items-center w-full gap-6">
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => {
            setChatId(null);
            setMessages([]);
          }}
        >
          &larr;
        </button>
        <div className="flex flex-row items-center gap-3">
          <UserPhoto img={chat.chatImg} />
          <h2 className="text-lg font-bold mt-2">{chat.chatName}</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.userId === session?.user?.id;
            const currDate = new Date(msg.createdAt);
            const prevDate =
              index > 0 ? new Date(messages[index - 1].createdAt) : null;
            const isNewDay =
              !prevDate || currDate.toDateString() !== prevDate.toDateString();

            const formattedDate = new Intl.DateTimeFormat("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            }).format(currDate);

            return (
              <div key={msg.id}>
                {isNewDay && (
                  <div className="text-center my-4 text-sm text-gray-500">
                    {formattedDate}
                  </div>
                )}
                <div
                  className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm shadow ${
                      isMe
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="mt-4 flex">
        <input
          type="text"
          className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring"
          placeholder="Type your message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;

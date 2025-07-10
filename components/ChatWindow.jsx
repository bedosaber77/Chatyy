"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import { UserPhoto } from "./userPhoto";
import loading from "../app/loading"; // assumed to be a function/component returning JSX

let socket;

const ChatWindow = ({ chat, setChatId }) => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [error, setError] = useState(null);
  const [loadingState, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Show center placeholder when no conversation is selected
  if (!chat) {
    return (
      <div className="flex h-full w-full">
        <div className="m-auto text-center text-gray-500 text-lg">
          Select a conversation
        </div>
      </div>
    );
  }

  // Socket connection
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

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?chatId=${chat.chatId}`);
        if (!res.ok) throw new Error("Failed to fetch messages");

        const data = await res.json();
        setMessages(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (chat.chatId) fetchMessages();
  }, [chat]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
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
      setError("Failed to send message.");
    }
  };

  if (error) {
    return <p className="text-red-500 p-4">{error}</p>;
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b bg-white">
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => {
            setChatId(null);
            setMessages([]);
          }}
        >
          &larr;
        </button>
        <UserPhoto img={chat.chatImg} />
        <h2 className="text-lg font-bold">{chat.chatName}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {loadingState ? (
          <div className="flex justify-center items-center h-full">
            {loading()}
          </div>
        ) : messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet.</p>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.userId === session?.user?.id;
            const currDate = new Date(msg.createdAt);
            const prevDate =
              index > 0 ? new Date(messages[index - 1].createdAt) : null;
            const isNewDay =
              !prevDate || currDate.toDateString() !== prevDate.toDateString();

            const formattedDate = currDate.toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            });

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
                      {currDate.toLocaleTimeString([], {
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

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex p-4 border-t bg-white">
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

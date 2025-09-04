"use client";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { UserPhoto } from "./userPhoto";
import loading from "../app/loading";

let socket;

const ChatWindow = ({ chat }) => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [error, setError] = useState(null);
  const [loadingState, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const router = useRouter();

  if (!chat) {
    return (
      <div className="flex justify-center items-center h-full">{loading()}</div>
    );
  }

  const { chatId, chatName, chatImg } = chat;

  // Socket connection
  const socketRef = useRef(null);

  useEffect(() => {
    if (!chatId || socketRef.current) return;

    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL,{
      transports: ["websocket"],
    });
    const socket = socketRef.current;

    socket.emit("joinRoom", chatId);

    socket.on("newMessage", (msg) => {
      if (msg.chatId === chatId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [chatId]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;

      try {
        setLoading(true);
        const res = await fetch(`/api/messages?chatId=${chatId}`);
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !session?.user?.id) return;

    const newMessage = {
      chatId,
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

      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("sendMessage", savedMessage);
      }

      setMessageInput("");
    } catch (err) {
      setError("Failed to send message.");
    }
  };

  if (error) {
    return <p className="text-red-500 p-4">{error}</p>;
  }

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">
      {/* Header - Responsive */}
      <div className="flex items-center gap-3 p-3 sm:p-4 border-b bg-white shadow-sm">
        <button
          className="text-gray-500 hover:text-gray-700 p-1 sm:p-2 -ml-1"
          onClick={() => router.back()}
        >
          ←
        </button>
        <UserPhoto img={chatImg} className="w-8 h-8 sm:w-10 sm:h-10" />
        <h2 className="text-base sm:text-lg font-semibold truncate">
          {chatName}
        </h2>
      </div>

      {/* Messages - Responsive */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
        {loadingState ? (
          <div className="flex justify-center items-center h-full">
            {loading()}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">
              No messages yet. Start the conversation!
            </p>
          </div>
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
                  <div className="text-center my-4 text-xs sm:text-sm text-gray-500">
                    {formattedDate}
                  </div>
                )}
                <div
                  className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}
                >
                  <div
                    className={`
                      max-w-[280px] sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl
                      px-3 py-2 rounded-lg text-sm shadow-sm
                      ${
                        isMe
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none border"
                      }
                    `}
                  >
                    <p className="break-words">{msg.text}</p>
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

      {/* Input - Responsive */}
      <div className="border-t bg-white p-3 sm:p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            disabled={!session?.user?.id}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium min-w-[60px]"
            disabled={!session?.user?.id || !messageInput.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;

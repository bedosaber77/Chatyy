"use client";
import { useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import loading from "../app/loading";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const { data: session, status } = useSession();
  const [fetching, setFetching] = useState(true);

  const fetchFriends = async () => {
    try {
      const response = await fetch(`/api/users/${session.user.id}/friends`);
      if (!response.ok) {
        throw new Error("Failed to fetch friends");
      }
      const data = await response.json();
      setFriends(data.friends || []);
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleMessage = (friendId) => {
    // Handle message click - navigate to chat or open chat
    console.log(`Start chat with friend: ${friendId}`);
    // You can add navigation logic here
    // router.push(`/chat/${friendId}`) or similar
  };

  useEffect(() => {
    fetchFriends();
  }, [session]);

  return (
    <div className="w-full h-screen bg-white border-r flex flex-col">
      <h2 className="text-lg font-bold p-4 border-b">Friends</h2>
      <div className="flex flex-col">
        {status === "loading" || fetching ? (
          loading()
        ) : friends.length === 0 ? (
          <p className="p-4 text-gray-500">No friends found.</p>
        ) : (
          friends.map((friend) => (
            <div
              key={friend.id}
              className="p-4 text-left hover:bg-gray-100 border-b flex flex-row items-center gap-4 justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={friend.image || "/default-avatar.png"}
                  alt={friend.name}
                  className="w-8 h-8 rounded-full"
                />
                <span>{friend.name}</span>
              </div>
              <button
                onClick={() => handleMessage(friend.id)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                title="Send message"
              >
                <MessageCircle size={20} className="text-gray-600" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Friends;

"use client";
import { useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
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
      // Update state with fetched friends
      setFriends(data.friends || []);
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setFetching(false);
    }
  };
  useEffect(() => {
    fetchFriends();
  }, [session]);

  return (
    <div className="w-72 h-screen bg-white border-r flex flex-col">
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
              className="p-4 text-left hover:bg-gray-100 border-b flex flex-row items-center gap-4"
            >
              <img
                src={friend.image || "/default-avatar.png"}
                alt={friend.name}
                className="w-8 h-8 rounded-full"
              />
              <span>{friend.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Friends;

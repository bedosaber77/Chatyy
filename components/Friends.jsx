"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import FriendRequests from "./FriendRequests";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [searchFriends, setSearchFriends] = useState([]);
  const [friendEmail, setFriendEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fetching, setFetching] = useState(true);

  const { data: session, status } = useSession();
  const router = useRouter();

  const fetchFriends = async () => {
    try {
      const res = await fetch(`/api/users/${session.user.id}/friends`);
      if (!res.ok) throw new Error("Failed to fetch friends");

      const data = await res.json();
      setFriends(data.friends || []);
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) fetchFriends();
  }, [session]);

  const handleAddFriend = () => {
    setShowModal(true);
  };

  const handleSearchFriends = async (e) => {
    const query = e.target.value;
    setFriendEmail(query);

    if (query.length < 3) {
      setSearchFriends([]);
      return;
    }

    try {
      const res = await fetch(`/api/users/search?query=${query}`);
      const data = await res.json();

      const filtered = data.friends.filter(
        (user) =>
          user.id !== session.user.id &&
          !friends.some((friend) => friend.id === user.id)
      );
      console.log("Filtered friends:", filtered);
      setSearchFriends(filtered);
    } catch (error) {
      console.error("Error searching friends:", error);
    }
  };

  const handleAdd = async (friendEmail) => {
    try {
      const response = await fetch(
        `/api/users/${session.user.id}/friendRequests`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ friendEmail }),
        }
      );

      if (!response.ok) throw new Error("Failed to add friend");

      const data = await response.json();
      console.log("Friend request sent:", data);
      setFriendEmail("");
      setSearchFriends([]);
      setShowModal(false);
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const handleMessage = async (friendId) => {
    const response = await fetch(
      `/api/conversation?userId=${session.user.id}&friendId=${friendId}`,
      { method: "POST" }
    );
    const { chatId } = await response.json();
    router.push(`/conversations/${chatId}`);
  };

  return (
    <>
      <FriendRequests userId={session?.user?.id} onAccept={fetchFriends} />
      <div className="w-full h-screen bg-white border-r flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold">Friends</h2>
          <button
            className="w-8 h-8 flex items-center justify-center text-xl text-white bg-blue-600 rounded hover:bg-blue-700 transition"
            onClick={handleAddFriend}
          >
            +
          </button>
        </div>

        {/* Friend List */}
        <div className="flex flex-col">
          {status === "loading" || fetching ? (
            <p className="p-4 text-gray-500">Loading...</p>
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

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Add a Friend</h3>

              <input
                type="email"
                placeholder="Search by email"
                className="w-full border border-gray-300 p-2 rounded mb-4"
                value={friendEmail}
                onChange={handleSearchFriends}
              />

              {searchFriends.length > 0 ? (
                searchFriends.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={user.image || "/default-avatar.png"}
                        alt={user.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{user.name}</span>
                    </div>
                    <button
                      onClick={() => handleAdd(user.email)}
                      className="text-sm text-blue-600 border border-blue-600 px-2 py-1 rounded hover:bg-blue-600 hover:text-white transition"
                    >
                      Add
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No users found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Friends;

"use client";

import { useEffect, useState } from "react";

const FriendRequests = ({ userId, onAccept }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`/api/users/${userId}/friendRequests`);
      const data = await res.json();
      setRequests(data.friendRequests || []);
    } catch (err) {
      console.error("Error fetching friend requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchRequests();
  }, [userId]);

  const handleAccept = async (requestId) => {
    try {
      await fetch(`/api/users/${userId}/friendRequests/${requestId}/accept`, {
        method: "POST",
      });
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
      onAccept(); // to refresh friend list
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await fetch(`/api/users/${userId}/friendRequests/${requestId}/reject`, {
        method: "POST",
      });
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  if (loading) return <p className="p-4 text-gray-500">Loading requests...</p>;
  if (requests.length === 0) return null;

  return (
    <div className="border-b p-4">
      <h3 className="font-semibold mb-2">Friend Requests</h3>
      {requests.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between hover:bg-gray-100 p-2 rounded"
        >
          <div className="flex items-center gap-2">
            <img
              src={user.image || "/default-avatar.png"}
              alt={user.name}
              className="w-6 h-6 rounded-full"
            />
            <span>{user.name}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleAccept(user.id)}
              className="text-sm text-green-600 border border-green-600 px-2 py-1 rounded hover:bg-green-600 hover:text-white transition"
            >
              Accept
            </button>
            <button
              onClick={() => handleReject(user.id)}
              className="text-sm text-red-600 border border-red-600 px-2 py-1 rounded hover:bg-red-600 hover:text-white transition"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequests;

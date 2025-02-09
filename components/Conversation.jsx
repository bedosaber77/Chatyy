import { getServerSession } from "next-auth";
import loading from "../app/loading";
import { authOptions } from "@/lib/auth";
const Conversations = async ({ onSelect }) => {
  const session = await getServerSession(authOptions);
  //useEffect(() => {
  if (session?.user?.id) {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`/api/conversation?userId=${session.user.id}`);
        if (!res.ok) throw new Error("Failed to fetch conversations");

        const data = await res.json();
        setConversations(data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError("Failed to load conversations.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }
  //}, [status, session?.user?.id]); // ✅ Runs when session status or user ID changes

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-72 h-screen bg-white border-r flex flex-col">
      <h2 className="text-lg font-bold p-4 border-b">Conversations</h2>
      <div className="flex flex-col">
        {stillloading ? (
          loading()
        ) : conversations.length === 0 ? (
          <p className="p-4 text-gray-500">No conversations yet.</p>
        ) : (
          conversations.map((chat) => (
            <button
              key={chat.id}
              className="p-4 text-left hover:bg-gray-100 border-b"
              onClick={() => onSelect(chat.id)}
            >
              <div className="font-medium">{chat.name}</div>
              <div className="text-sm text-gray-500">
                {chat.lastMessage || "No messages yet"}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Conversations;

import Sidebar from "../components/sidebar";
import Conversations from "../components/Conversation";
import Friends from "../components/Friends";
import Chat from "../components/Chat";

export default function Home() {
  return (
    <div className="flex h-screen">
      {/* <Sidebar setActiveTab={setActiveTab} />
      {activeTab === "chat" ? (
        <Conversations onSelect={setSelectedConversation} />
      ) : (
        <Friends />
      )}
      <Chat conversationId={selectedConversation} /> */}
    </div>
  );
}

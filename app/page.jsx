"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";
import Conversations from "../components/Conversation";
import Friends from "../components/Friends";
import Chat from "../components/Chat";
import loading from "./loading";

export default function Home() {
  const [activeTab, setActiveTab] = useState("chat"); // Default to Chat
  const [selectedConversation, setSelectedConversation] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to /login if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (!session) return loading();
  return (
    <div className="flex h-screen">
      <Sidebar setActiveTab={setActiveTab} />
      {activeTab === "chat" ? (
        <Conversations onSelect={setSelectedConversation} />
      ) : (
        <Friends />
      )}
      <Chat conversationId={selectedConversation} />
    </div>
  );
}

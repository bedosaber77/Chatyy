"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";
import Conversations from "../components/Conversation";
import Friends from "../components/Friends";
import Chat from "../components/Chat";

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

  // ✅ Show a rotating spinner while session is loading
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-solid border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return null; // Prevent rendering before redirection

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

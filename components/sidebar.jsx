"use client";
import { useState } from "react";
import Image from "next/image";
import {
  ChatBubbleLeftIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";

const Sidebar = ({ setActiveTab }) => {
  const [selectedTab, setSelectedTab] = useState("chat");
  const { data: session, status } = useSession();

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    setActiveTab(tab);
  };

  return (
    <div className="w-16 h-screen flex flex-col items-center bg-gray-100 py-4 border-r">
      <button
        className={`p-3 rounded-lg ${
          selectedTab === "chat" ? "bg-gray-300" : "hover:bg-gray-200"
        }`}
        onClick={() => handleTabClick("chat")}
      >
        <ChatBubbleLeftIcon className="h-6 w-6 text-gray-600" />
      </button>
      <button
        className={`p-3 rounded-lg mt-4 ${
          selectedTab === "friends" ? "bg-gray-300" : "hover:bg-gray-200"
        }`}
        onClick={() => handleTabClick("friends")}
      >
        <UserGroupIcon className="h-6 w-6 text-gray-600" />
      </button>

      <button className="p-3 rounded-lg hover:bg-gray-200 mt-auto mb-4">
        <Cog6ToothIcon className="h-6 w-6 text-gray-600" />
      </button>
      <button
        className="p-3 rounded-lg hover:bg-gray-200"
        onClick={() => signOut()}
      >
        <ArrowRightOnRectangleIcon className="h-6 w-6 text-gray-600" />
      </button>
      {status === "authenticated" && (
        <Image
          src={session.user.image || "/default-avatar.png"} // ✅ Use a default avatar if image is null
          alt="User Avatar"
          width={32}
          height={32}
          className="rounded-full mt-2"
        />
      )}
    </div>
  );
};

export default Sidebar;

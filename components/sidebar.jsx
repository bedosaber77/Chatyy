"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChatBubbleLeftIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";

const Sidebar = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="w-16 h-screen flex flex-col items-center bg-gray-100 py-4 border-r">
      {/* Conversations Link */}
      <Link
        href="/conversations"
        className={`p-3 rounded-lg ${
          pathname === "/conversations" ? "bg-gray-400" : "bg-gray-200"
        }`}
      >
        <ChatBubbleLeftIcon className="h-6 w-6 text-gray-600" />
      </Link>

      {/* Friends Link */}
      <Link
        href="/friends"
        className={`p-3 rounded-lg mt-4 ${
          pathname === "/friends" ? "bg-gray-400" : "bg-gray-200"
        }`}
      >
        <UserGroupIcon className="h-6 w-6 text-gray-600" />
      </Link>

      {/* Settings Link */}
      <Link
        href="/settings"
        className="p-3 rounded-lg hover:bg-gray-200 mt-auto mb-4"
      >
        <Cog6ToothIcon className="h-6 w-6 text-gray-600" />
      </Link>

      {/* Sign Out Button */}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="p-3 rounded-lg hover:bg-gray-200"
      >
        <ArrowRightOnRectangleIcon className="h-6 w-6 text-gray-600" />
      </button>

      {/* Extra children (e.g., user profile) */}
      {children}
    </div>
  );
};

export default Sidebar;

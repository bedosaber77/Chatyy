"use client";
import { useState } from "react";
import { FiMessageSquare, FiSettings, FiUser } from "react-icons/fi";
import { CiBrightnessUp } from "react-icons/ci";
export default function Sidebar() {
  const [selected, setSelected] = useState("messages");

  return (
    <div className="w-16 h-screen bg-white-100 flex flex-col items-center py-4 border-r">
      <button
        className={`p-3 rounded-lg ${
          selected === "messages"
            ? "bg-blue-500 text-white"
            : "hover:bg-gray-200"
        }`}
        onClick={() => setSelected("messages")}
      >
        <FiMessageSquare size={24} />
      </button>
      <button
        className={`p-3 rounded-lg mt-4 ${
          selected === "users" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
        }`}
        onClick={() => setSelected("users")}
      >
        <FiUser size={24} />
      </button>
      <button
        className={`p-3 rounded-lg mt-auto
            text-white" : "hover:bg-gray-200"
        `}
        onClick={() => setSelected("theme")}
      >
        <CiBrightnessUp size={24} />
      </button>

      <button
        className={`p-3 rounded-lg mb-4 ${
          selected === "settings"
            ? "bg-blue-500 text-white"
            : "hover:bg-gray-200"
        }`}
        onClick={() => setSelected("settings")}
      >
        <FiSettings size={24} />
      </button>
    </div>
  );
}

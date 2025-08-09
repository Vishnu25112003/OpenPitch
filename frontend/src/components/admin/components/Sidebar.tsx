// Sidebar.tsx
import React from "react";
import {
  FaUsers,
  FaFileAlt,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/users", icon: FaUsers, label: "Users" },
    { path: "/posts", icon: FaFileAlt, label: "Posts" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="bg-white shadow-lg w-64 h-screen fixed left-0 top-16 z-40">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <Icon className="text-lg" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

import React from "react";
import { FaHome, FaPlus, FaUser, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  // Common button styles
  const menuItemClass =
    "px-4 py-2 flex items-center cursor-pointer hover:bg-blue-500 hover:text-white transition-colors duration-200";

  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed left-0 top-0 flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-around h-16 bg-gray-800">
        <h1 className="text-2xl font-semibold text-blue-600">OpenPitch</h1>
        <FaBars className="ml-2 text-blue-500" />
      </div>
      {/* Menu List */}
      <div className="flex-1 overflow-y-auto">
        <ul className="mt-4 space-y-1">
          <li onClick={() => navigate("/dashboard")} className={menuItemClass}>
            <FaHome className="mr-2 text-blue-300" />
            <span>Dashboard</span>
          </li>

          <li onClick={() => navigate("/posts")} className={menuItemClass}>
            <FaPlus className="mr-2 text-blue-300" />
            <span>Posts</span>
          </li>

          <li onClick={() => navigate("/users")} className={menuItemClass}>
            <FaUser className="mr-2 text-blue-300" />
            <span>Users</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

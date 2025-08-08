import React from "react";
import { useNavigate } from "react-router-dom";

const AdminNavbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="bg-gray-800 text-white text-500 p-4">
        <h1>Welcome, Admin</h1>
      </div>
        <button
          onClick={handleLogout}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
  );
};

export default AdminNavbar;

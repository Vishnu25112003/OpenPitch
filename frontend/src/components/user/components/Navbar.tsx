import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaSignOutAlt,
  FaHome,
  FaUser,
  FaPlus,
  FaFire,
  FaSearch,
  FaBell,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useState, useEffect } from "react";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name);
      setUserAvatar(
        user.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.name
          )}&background=6366f1&color=fff`
      );
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/homepage", icon: FaHome, label: "Home", color: "text-blue-600" },
    { path: "/create", icon: FaPlus, label: "Create", color: "text-green-600" },
    {
      path: "/toppost",
      icon: FaFire,
      label: "Trending",
      color: "text-orange-600",
    },
    {
      path: "/profile",
      icon: FaUser,
      label: "Profile",
      color: "text-purple-600",
    },
  ];

  return (
    <>
      {/* Enhanced Desktop Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Brand Section */}
            <Link to="/homepage" className="flex items-center space-x-4">
              <div>
                <div className="text-3xl font-bold text-indigo-600">
                  OpenPitch
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Share Ideas • Build Future • Connect Minds
                </p>
              </div>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search ideas..."
                />
              </div>
            </div>

            {/* Desktop Navigation Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate("/homepage")}
                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full"
              >
                <FaHome className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full">
                <FaBell className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate("/create")}
                className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
              >
                <FaPlus className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center space-x-2"
              >
                <img
                  src={userAvatar}
                  alt={userName}
                  className="h-8 w-8 rounded-full border-2 border-gray-200"
                />
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {userName}
                </span>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg border border-red-200 transition-all duration-200 font-medium"
              >
                <FaSignOutAlt className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className=" md:hidden p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
                <FaBars className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              {/* Mobile Search */}
              <div className="px-4 mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Search ideas..."
                  />
                </div>
              </div>

              {/* Mobile Navigation Items */}
              <div className="space-y-1 px-4">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        isActive(item.path)
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                      }`}
                    >
                      <IconComponent
                        className={`h-5 w-5 ${
                          isActive(item.path) ? "text-indigo-600" : item.color
                        }`}
                      />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile User Section */}
              <div className="mt-6 pt-6 border-t border-gray-200 px-4">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="h-10 w-10 rounded-full border-2 border-gray-200"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{userName}</p>
                    <p className="text-sm text-gray-500">Idea Contributor</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaSignOutAlt className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0  bg-white border-t border-gray-200 md:hidden z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-3 rounded-lg transition-colors min-w-0 flex-1 ${
                  isActive(item.path)
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                <IconComponent className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium truncate">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navbar;

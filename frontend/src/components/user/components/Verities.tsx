import { Link, useLocation } from "react-router-dom";
import { FaHome, FaPlus, FaUser, FaFire } from "react-icons/fa";

const Verities: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: FaHome, label: "Home" },
    { path: "/create", icon: FaPlus, label: "Create" },
    { path: "/toppost", icon: FaFire, label: "Trending" },
    { path: "/profile", icon: FaUser, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                isActive
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              <IconComponent className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Verities;

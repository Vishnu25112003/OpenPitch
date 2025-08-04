import { Link } from "react-router-dom";

const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = "/login";
};

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md px-30 py-4 flex justify-between items-center">
      <div className="text-6xl font-bold text-blue-600">
        <Link to="/homepage">OpenPitch</Link>
      </div>
      <button
        onClick={handleLogout}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Signin from "./auth/Signin";
import Homepage from "./components/user/pages/Homepage";
import Profile from "./components/user/pages/Profile";
import CreatePost from "./components/user/pages/CreatePost";
import Dashboard from "./components/admin/pages/Dashboard";
import Navbar from "./components/user/components/Navbar";
import Verities from "./components/user/components/Verities";
import CommentPage from "./components/user/pages/CommentPage";
import TrendingPost from "./components/user/pages/TrendingPost";
import Sidebar from "./components/admin/components/Sidebar";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* Login */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>

      {/* User */}
      <Routes>
        <Route
          path="/homepage"
          element={
            <>
              <Navbar /> <Homepage />
              <Verities />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <Navbar /> <Profile />
              <Verities />
            </>
          }
        />
        <Route
          path="/create"
          element={
            <>
              <Navbar /> <CreatePost />
              <Verities />
            </>
          }
        />
        <Route
          path="/comment/:id"
          element={
            <>
              <Navbar /> <CommentPage />
              <Verities />
            </>
          }
        />
        <Route path="/toppost" element={<TrendingPost />} />
      </Routes>

      {/* Admin */}
      <Routes>
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

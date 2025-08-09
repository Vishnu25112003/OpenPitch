import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Signin from "./auth/Signin";
import Homepage from "./components/user/pages/Homepage";
import Profile from "./components/user/pages/Profile";
import CreatePost from "./components/user/pages/CreatePost";
import Navbar from "./components/user/components/Navbar";
import Verities from "./components/user/components/Verities";
import CommentPage from "./components/user/pages/CommentPage";
import TrendingPost from "./components/user/pages/TrendingPost";
import Sidebar from "./components/admin/components/Sidebar";
import Posts from "./components/admin/pages/Posts";
import Users from "./components/admin/pages/Users";
import AdminNavbar from "./components/admin/components/AdminNavbar";
import SavedPosts from "./components/user/pages/SavedPosts";

const AdminPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex">
      <div className="fixed left-0 top-0 h-screen w-64">
        <Sidebar />
      </div>
      <div className="ml-64 flex flex-col w-full">
        <div className="h-16 bg-gray-800 text-white flex items-center px-4 shadow">
          <AdminNavbar />
        </div>
        <main className="flex-1 bg-gray-100 p-6">{children}</main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* Auth Routes */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>

      {/* User Routes */}
      <Routes>
        <Route
          path="/homepage"
          element={
            <>
              <Navbar /> <Homepage /> <Verities />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <Navbar /> <Profile /> <Verities />
            </>
          }
        />
        <Route
          path="/create"
          element={
            <>
              <Navbar /> <CreatePost /> <Verities />
            </>
          }
        />
        <Route
          path="/comment/:id"
          element={
            <>
              <Navbar /> <CommentPage /> <Verities />
            </>
          }
        />
        <Route
          path="/toppost"
          element={
            <>
              <Navbar />
              <TrendingPost />
              <Verities />
            </>
          }
        />
        <Route
          path="/savedpost"
          element={
            <>
              <Navbar />
              <SavedPosts />
              <Verities />
            </>
          }
        />
      </Routes>

      {/* Admin Routes - Always show Sidebar */}
      <Routes>
        <Route
          path="/posts"
          element={
            <AdminPage>
              <Posts />
            </AdminPage>
          }
        />
        <Route
          path="/users"
          element={
            <AdminPage>
              <Users />
            </AdminPage>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

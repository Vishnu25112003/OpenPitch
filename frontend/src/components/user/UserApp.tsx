import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import Verities from "./components/Verities";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";

const UserApp = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Verities />
    </>
  );
};

export default UserApp;

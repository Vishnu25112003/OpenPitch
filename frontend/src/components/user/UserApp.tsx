// src/components/user/UserApp.tsx
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage"; // Changed to correct relative path

const UserApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
    </Routes>
  );
};

export default UserApp;

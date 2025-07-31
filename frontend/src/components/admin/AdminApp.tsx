// src/components/admin/AdminApp.tsx
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard"; // Changed to correct relative path

const AdminApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
};

export default AdminApp;

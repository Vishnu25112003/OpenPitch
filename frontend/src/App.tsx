// src/App.tsx
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Signin from "./auth/Signin";

import UserApp from "./components/user/UserApp";
import AdminApp from "./components/admin/AdminApp";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/user/*" element={<UserApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

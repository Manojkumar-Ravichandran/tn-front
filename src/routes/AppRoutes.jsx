import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import ContributorLayout from "../layouts/ContributorLayout";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";

import ProtectedRoute from "./ProtectedRoute";
import AddTemple from "../pages/Temple/Temple";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Pages */}
        <Route
          element={
            <ProtectedRoute>
              <ContributorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-temple" element={<AddTemple />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
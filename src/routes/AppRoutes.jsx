import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import ContributorLayout from "../layouts/ContributorLayout";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";

import ProtectedRoute from "./ProtectedRoute";
import AddTemple from "../pages/Temple/Temple";
import Master from "../pages/Master/Master";
import Contributor from "../pages/Contributor/Contributor";
import SetPassword from "../pages/Login/SetPassword";
import TempleDetail from "../pages/Temple/TempleDetail";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/temples/:slug" element={<TempleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/set-password" element={<SetPassword />} />
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
          <Route path="/temples" element={<AddTemple />} />
          <Route path="/masters" element={<Master />} />
          <Route path="/contributor" element={<Contributor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Public Pages
import Landing from "../Pages/Landing";
import Login from "../Pages/Login";
import Register from "../Pages/register";

// Authenticated Pages
import Home from "../Pages/Home"; // Invoice History
import CreateInvoice from "../Pages/CreateInvoice";
import ManageProducts from "../Pages/Admin/ManageProducts";

// Admin Pages (You would create a separate Admin Dashboard here)
import AdminDashboard from "../Pages/Admin/Dashboard";

// Component to protect routes
const PrivateRoute = ({ children, role = null }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-20">Loading app...</div>; // Simple loading state
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === "admin" && !isAdmin) {
    return <Navigate to="/" replace />; // Redirect non-admins if they try to access admin route
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Employee/Authenticated Routes */}
      <Route
        path="/history"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-invoice"
        element={
          <PrivateRoute>
            <CreateInvoice />
          </PrivateRoute>
        }
      />
      <Route
        path="/manage-products"
        element={
          <PrivateRoute role="admin">
            <ManageProducts />
          </PrivateRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* Redirect Home after login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

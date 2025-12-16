import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Public Pages
import Landing from "../Pages/Landing";
import Login from "../Pages/Login";
import Register from "../Pages/register";

// Admin Special Login
import AdminLogin from "../Pages/Admin/Login";

// Authenticated Pages (Employee)
import Home from "../Pages/Home"; // Invoice History
import CreateInvoice from "../Pages/CreateInvoice";

// Admin Pages
import ManageProducts from "../Pages/Admin/ManageProducts";
import AdminDashboard from "../Pages/Admin/Dashboard";

// Component to protect routes
const PrivateRoute = ({ children, role = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to appropriate login based on intended role (simple heuristic)
    if (role === "admin") return <Navigate to="/admin/login" replace />;
    return <Navigate to="/login" replace />;
  }

  // Role-based Access Control
  if (role === "admin" && user?.role !== "admin") {
    return <Navigate to="/" replace />; // Unauthorized for this role
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Login - Hidden/Separate from main flow */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ================= EMPLOYEE ROUTES ================= */}
      {/* 
         "History" is effectively the Employee Dashboard currently.
         We can alias /dashboard or /employee to it if needed.
      */}
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

      {/* ================= ADMIN ROUTES ================= */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute role="admin">
            <AdminDashboard />
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

      {/* Redirects */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

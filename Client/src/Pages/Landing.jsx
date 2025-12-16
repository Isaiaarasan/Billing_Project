import React from "react";
import { Link, Navigate } from "react-router-dom";
import { FileText, DollarSign, Users, ArrowRight } from "lucide-react";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const Landing = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (isAuthenticated) {
    if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md mx-auto">
        <FileText size={64} className="text-blue-600 mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          QuickBill
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The simple solution for generating professional bills, managing
          products, and tracking employee sales.
        </p>

        <div className="space-y-4">
          <Link to="/login">
            <Button className="w-full">
              <DollarSign size={20} /> Employee Login
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" className="w-full">
              <Users size={20} /> Create New Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;

import React from "react";
import { Link } from "react-router-dom";
import { FileText, DollarSign, Users } from "lucide-react";
import Button from "../components/Button";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md mx-auto">
        <FileText size={64} className="text-blue-600 mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          QuickBill: Effortless Mobile Invoicing
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The simple solution for generating professional bills, managing
          products, and tracking employee sales.
        </p>

        <div className="space-y-4">
          <Link to="/login">
            <Button className="w-full">
              <DollarSign size={20} /> Get Started - Employee Login
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" className="w-full">
              <Users size={20} /> Create New Account
            </Button>
          </Link>
        </div>

        <div className="mt-10 text-sm text-gray-500">
          <p>For Administrative access, please log in with an Admin account.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;

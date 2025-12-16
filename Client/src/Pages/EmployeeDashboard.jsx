import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    PlusCircle,
    History,
    LogOut,
    User,
    TrendingUp,
    FileText
} from "lucide-react";
import Button from "../components/Button";

const EmployeeDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white px-6 py-5 shadow-sm sticky top-0 z-10">
                <div className="max-w-md mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                            <User className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 leading-tight">
                                {user?.name || "Employee"}
                            </h1>
                            <p className="text-xs text-gray-500">Welcome back</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 max-w-md mx-auto w-full flex flex-col gap-6">

                {/* Quick Actions Title */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">Dashboard</h2>
                    <p className="text-sm text-gray-500">What would you like to do today?</p>
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 gap-4">

                    {/* Bill Now Card */}
                    <Link to="/create-invoice" className="group">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all hover:border-blue-200 active:scale-98">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-600 text-white p-4 rounded-xl shadow-lg shadow-blue-200 group-hover:shadow-blue-300 transition-all">
                                    <PlusCircle size={32} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Bill Now</h3>
                                    <p className="text-sm text-gray-500">Create a new invoice</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                                <FileText className="text-gray-400 group-hover:text-blue-500" size={20} />
                            </div>
                        </div>
                    </Link>

                    {/* History Card */}
                    <Link to="/history" className="group">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all hover:border-purple-200 active:scale-98">
                            <div className="flex items-center gap-4">
                                <div className="bg-purple-600 text-white p-4 rounded-xl shadow-lg shadow-purple-200 group-hover:shadow-purple-300 transition-all">
                                    <History size={32} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">History</h3>
                                    <p className="text-sm text-gray-500">View past invoices</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-full group-hover:bg-purple-50 transition-colors">
                                <TrendingUp className="text-gray-400 group-hover:text-purple-500" size={20} />
                            </div>
                        </div>
                    </Link>

                </div>

                {/* Info Card / Stats Placeholder */}
                <div className="mt-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-xl shadow-gray-200">
                    <div className="flex items-start gap-4">
                        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                            <TrendingUp size={24} className="text-green-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Sales Focus</h4>
                            <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                                Keep track of your daily sales and ensure all products are billed correctly using the new lookup feature.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmployeeDashboard;

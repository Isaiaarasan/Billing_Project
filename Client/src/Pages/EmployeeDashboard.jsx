import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    PlusCircle,
    History,
    LogOut,
    User,
    TrendingUp,
    FileText,
    Bell,
    Search,
    Settings
} from "lucide-react";
import Button from "../components/Button";

const EmployeeDashboard = () => {
    const { user, logout } = useAuth();

    // Fake notifications for UI
    const hasNotifications = true;

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col">

            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[100px] -z-10"></div>

            {/* Modern Desktop Navigation */}
            <header className="px-6 py-4 glass-panel sticky top-0 z-50 border-b-0 border-white/20">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-12">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/30">
                                <FileText size={22} className="stroke-[2.5px]" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
                                QuickBill <span className="text-indigo-600">.</span>
                            </h1>
                        </div>

                        {/* Desktop Menu links (Visual Only) */}
                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
                            <Link to="#" className="text-slate-900 transition-colors">Overview</Link>
                            <Link to="#" className="hover:text-slate-900 transition-colors">Reports</Link>
                            <Link to="#" className="hover:text-slate-900 transition-colors">Support</Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar (Visual) */}
                        <div className="hidden lg:flex items-center bg-slate-100/50 rounded-full px-4 py-2 border border-slate-200 text-sm w-64 focus-within:ring-2 ring-indigo-500/20 transition-all">
                            <Search size={16} className="text-slate-400 mr-2" />
                            <input type="text" placeholder="Search..." className="bg-transparent border-0 p-0 focus:ring-0 w-full placeholder-slate-400" />
                        </div>

                        <div className="flex items-center gap-2 border-l border-slate-200 pl-4 ml-2">
                            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                                <Bell size={20} />
                                {hasNotifications && <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>}
                            </button>

                            <div className="flex items-center gap-3 pl-2">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-slate-900 leading-none">{user?.name}</p>
                                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Employee</p>
                                </div>
                                <User className="bg-slate-100 p-1.5 rounded-full text-slate-600 box-content border border-slate-200" size={24} />
                                <button
                                    onClick={logout}
                                    className="ml-2 p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">

                {/* Welcome Section */}
                <div className="mb-10 animate-fade-in-up">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Good Morning, {user?.name.split(' ')[0]} 👋</h2>
                    <p className="text-slate-500">Here's what's happening with your billing today.</p>
                </div>

                {/* Action Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-100">

                    {/* Bill Now Card - FEATURED */}
                    <Link to="/create-invoice" className="group col-span-1 lg:col-span-2 relative overflow-hidden">
                        <div className="h-full bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] border border-white/10 relative z-10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/20 mb-4">
                                        <TrendingUp size={12} className="text-green-300" /> Fast & Secure
                                    </div>
                                    <h3 className="text-3xl font-bold mb-2">Create New Invoice</h3>
                                    <p className="text-indigo-100 max-w-md">Start a new transaction instantly. Access updated product prices and manage customer billing in real-time.</p>
                                </div>

                                <div className="mt-8 flex items-center gap-4">
                                    <div className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 group-hover:gap-4 transition-all shadow-lg">
                                        Start Billing <PlusCircle size={20} />
                                    </div>
                                    <div className="text-sm font-medium opacity-80 decoration-slice">
                                        Press 'N' shortcut
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Image/Pattern */}
                        <div className="hidden sm:block absolute bottom-0 right-4 w-64 opacity-20 pointer-events-none group-hover:opacity-30 group-hover:translate-x-2 transition-all">
                            {/* Could be an SVG pattern or Image */}
                            <FileText size={200} className="stroke-1 text-white" />
                        </div>
                    </Link>

                    {/* History Card */}
                    <Link to="/history" className="group">
                        <div className="h-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/40 transition-all hover:-translate-y-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                            <div className="relative z-10">
                                <div className="h-14 w-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:rotate-12 transition-transform shadow-inner">
                                    <History size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">Transaction History</h3>
                                <p className="text-slate-500 text-sm mb-6">Review past invoices, check status, and print receipts.</p>

                                <div className="flex items-center text-purple-600 font-semibold group-hover:gap-2 transition-all">
                                    View Records <TrendingUp size={16} className="ml-1" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Third Card / Stat (Optional) */}
                    <div className="hidden lg:block bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Quick Stats</h3>
                                <p className="text-xs text-slate-500">Today's Performance</p>
                            </div>
                            <Settings size={20} className="text-slate-300 hover:text-slate-600 cursor-pointer transition-colors" />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-sm font-medium text-slate-600">Pending</span>
                                <span className="font-bold text-orange-500">0</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-sm font-medium text-slate-600">Completed</span>
                                <span className="font-bold text-green-500">Ready</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                            <p className="text-xs text-slate-400">System Status: <span className="text-green-500 font-bold">Online</span></p>
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
};

export default EmployeeDashboard;

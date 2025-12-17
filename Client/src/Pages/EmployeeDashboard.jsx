import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import {
    PlusCircle,
    History,
    LogOut,
    User,
    TrendingUp,
    FileText,
    Bell,
    Search,
    Printer,
    ClipboardList // Added for the stats section
} from "lucide-react";
import { printInvoice } from "../utils/printInvoice";

const EmployeeDashboard = () => {
    const { user, logout } = useAuth();
    const { invoices, fetchInvoices } = useShop();
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    // Calculate stats for "Today"
    const today = new Date().toDateString();
    // Use .slice().sort() to ensure consistency, assuming createdAt is a Date string or convertible
    const todaysInvoices = (invoices || [])
        .filter(inv => new Date(inv.createdAt).toDateString() === today)
        // Sort by creation date descending (newest first)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 
        
    const todaysRevenue = todaysInvoices.reduce((acc, curr) => acc + curr.totalAmount, 0);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            // Navigate to History with search query (requires History page to handle it)
            navigate('/history');
        }
    };

    // Filtered list for the dashboard table (showing newest 5 today's invoices)
    const recentTodaysInvoices = todaysInvoices.slice(0, 5);

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col bg-slate-50">

            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[100px] -z-10"></div>

            {/* Modern Desktop Navigation */}
            <header className="px-6 py-4 bg-white shadow-md sticky top-0 z-50 border-b border-slate-100">
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

                        {/* Desktop Menu links - Functional! */}
                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
                            <Link to="/dashboard" className="text-slate-900 transition-colors">Overview</Link>
                            <Link to="/history" className="hover:text-slate-900 transition-colors">History</Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="hidden lg:flex items-center bg-slate-100/50 rounded-full px-4 py-2 border border-slate-200 text-sm w-64 focus-within:ring-2 ring-indigo-500/20 transition-all">
                            <Search size={16} className="text-slate-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Search invoices..."
                                className="bg-transparent border-0 p-0 focus:ring-0 w-full placeholder-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>

                        <div className="flex items-center gap-2 border-l border-slate-200 pl-4 ml-2">
                            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                                <Bell size={20} />
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
                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Good Morning, {user?.name?.split(' ')[0] || 'User'} 👋</h2>
                    <p className="text-slate-500">Here's your activity overview for today, {today}.</p>
                </div>

                {/* Action Grid (Top Row) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

                    {/* Bill Now Card - FEATURED (Spans 2 columns) */}
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

                        <div className="hidden sm:block absolute bottom-0 right-4 w-64 opacity-20 pointer-events-none group-hover:opacity-30 group-hover:translate-x-2 transition-all">
                            <FileText size={200} className="stroke-1 text-white" />
                        </div>
                    </Link>

                    {/* History Card (1 column) */}
                    <Link to="/history" className="group">
                        <div className="h-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/40 transition-all hover:-translate-y-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                            <div className="relative z-10">
                                <div className="h-14 w-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:rotate-12 transition-transform shadow-inner">
                                    <History size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">Transaction History</h3>
                                <p className="text-slate-500 text-sm mb-6">Review past invoices and check status.</p>

                                <div className="flex items-center text-purple-600 font-semibold group-hover:gap-2 transition-all">
                                    View Records <TrendingUp size={16} className="ml-1" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* STATS & RECENT INVOICES SECTION (New Side-by-Side Layout) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Column 1: Today's Stats (1/3 width on large screens) */}
                    <div className="col-span-1">
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 h-full">
                            <div className="flex items-center gap-3 mb-6">
                                <ClipboardList size={24} className="text-teal-600" />
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Today's Stats</h3>
                                    <p className="text-xs text-slate-500">Daily Performance</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-teal-50 rounded-xl border border-teal-100">
                                    <span className="text-sm font-medium text-teal-700">Invoices Generated</span>
                                    <span className="font-extrabold text-2xl text-teal-600">{todaysInvoices.length}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                    <span className="text-sm font-medium text-indigo-700">Total Revenue</span>
                                    <span className="font-extrabold text-2xl text-indigo-600">₹{todaysRevenue.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                                <p className="text-xs text-slate-400">Data updated in real-time.</p>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Recent Invoices (2/3 width on large screens) */}
                    <div className="col-span-1 lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden h-full">
                            <div className="p-6 border-b border-slate-100">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <History className="text-indigo-600" size={20} />
                                    Your Recent Invoices (Today)
                                </h3>
                            </div>

                            {recentTodaysInvoices.length === 0 ? (
                                <div className="p-12 text-center text-slate-400">
                                    <p>No invoices generated today yet.</p>
                                    <Link to="/create-invoice" className="text-indigo-600 font-semibold hover:underline mt-2 inline-block">Create your first invoice</Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                <th className="p-5">Customer</th>
                                                <th className="p-5 text-center">Items</th>
                                                <th className="p-5 text-center">Total</th>
                                                <th className="p-5 text-center">Mode</th>
                                                <th className="p-5 text-center">Time</th>
                                                <th className="p-5 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {/* Note: Invoices are already sorted newest first by the time they reach this point */}
                                            {recentTodaysInvoices.map((invoice) => (
                                                <tr key={invoice._id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="p-5">
                                                        <p className="font-bold text-slate-800">{invoice.customerName || 'Walk-in Customer'}</p>
                                                        <p className="text-xs text-slate-500">{invoice.customerMobile || 'N/A'}</p>
                                                    </td>
                                                    <td className="p-5 text-center">
                                                        <span className="bg-slate-100 text-slate-600 py-1 px-3 rounded-full text-xs font-bold">
                                                            {invoice.items.length}
                                                        </span>
                                                    </td>
                                                    <td className="p-5 text-center font-bold text-indigo-900">
                                                        ₹{invoice.totalAmount.toLocaleString()}
                                                    </td>
                                                    <td className="p-5 text-center">
                                                        <span className={`py-1 px-3 rounded-full text-xs font-bold uppercase ${invoice.paymentMode === 'Cash' ? 'bg-green-100 text-green-700' :
                                                            invoice.paymentMode === 'Card' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                                            }`}>
                                                            {invoice.paymentMode || 'Cash'}
                                                        </span>
                                                    </td>
                                                    <td className="p-5 text-center text-sm text-slate-500">
                                                        {new Date(invoice.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </td>
                                                    <td className="p-5 text-right">
                                                        <button
                                                            onClick={() => printInvoice(invoice)}
                                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                                                            title="Print Bill"
                                                        >
                                                            <Printer size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </main >
        </div >
    );
};

export default EmployeeDashboard;
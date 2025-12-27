import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import adminService from "../../services/adminService";
import { useAuth } from "../../context/AuthContext";
import {
    Users,
    Package,
    FileText,
    TrendingUp,
    Plus,
    Edit,
    Trash2,
    BarChart3,
    Briefcase,
    LogOut,
    UserCheck, // New icon for User Management Card
} from "lucide-react";
import Input from "../../components/Input"; // Assuming this component exists
import Button from "../../components/Button"; // Assuming this component exists
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddUser, setShowAddUser] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("employee");

    // Get logout function
    const { logout } = useAuth(); // Assuming useAuth provides a logout function

    // --- Styling Classes ---
    const primaryColor = "text-indigo-600";
    const primaryBg = "bg-indigo-600";
    const primaryHoverBg = "hover:bg-indigo-700";
    const primaryShadow = "shadow-lg shadow-indigo-500/20";

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsData, usersData] = await Promise.all([
                adminService.getEmployeeStats(),
                adminService.getAllUsers(),
            ]);
            setStats(statsData);
            // Sort users to put Admins first
            const sortedUsers = usersData.sort((a, b) => {
                if (a.role === "admin" && b.role !== "admin") return -1;
                if (a.role !== "admin" && b.role === "admin") return 1;
                return 0;
            });
            setUsers(sortedUsers);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName("");
        setEmail("");
        setPassword("");
        setRole("employee");
        setEditingUser(null);
        setShowAddUser(false);
    };

    const handleAddUser = async () => {
        if (!name || !email || !password)
            return alert("Please fill in all required fields.");

        try {
            await adminService.createUser({ name, email, password, role });
            resetForm();
            fetchDashboardData();
        } catch (error) {
            console.error("Failed to add user:", error);
            alert("Failed to add user");
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
        setPassword(""); // Don't show password
        setShowAddUser(true);
    };

    const handleUpdateUser = async () => {
        if (!name || !email) return alert("Name and Email are required.");

        try {
            const updatePayload = { name, email, role };
            await adminService.updateUser(editingUser._id, updatePayload);
            resetForm();
            fetchDashboardData();
        } catch (error) {
            console.error("Failed to update user:", error);
            alert("Failed to update user");
        }
    };

    const handleDeleteUser = async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this user? This action cannot be undone."
            )
        )
            return;

        try {
            await adminService.deleteUser(id);
            fetchDashboardData();
        } catch (error) {
            console.error("Failed to delete user:", error);
            alert("Failed to delete user");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading system data...</p>
                </div>
            </div>
        );
    }

    // Calculated Total Invoices
    const totalInvoices = stats?.employeeStats?.reduce(
        (acc, emp) => acc + emp.invoiceCount,
        0
    ) || 0;

    const userFormContent = (
        <div className="p-6 border-b border-slate-100 bg-slate-50/70 rounded-xl shadow-inner mb-6">
            <h3 className="text-lg font-bold mb-4 text-slate-800">
                {editingUser ? "Edit Employee Details" : "Add New Employee"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input
                    label="Name"
                    placeholder="Ex: Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <Input
                    label="Email"
                    type="email"
                    placeholder="ex@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {!editingUser && (
                    <Input
                        label="Initial Password"
                        type="password"
                        placeholder="Set initial password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                )}
                <div className={editingUser ? "md:col-span-2" : ""}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Role
                    </label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow bg-white"
                    >
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>
            <div className="flex gap-3">
                <Button
                    onClick={editingUser ? handleUpdateUser : handleAddUser}
                    className={`${primaryBg} ${primaryHoverBg} text-white font-semibold py-2 px-4 rounded-xl shadow-md`}
                >
                    {editingUser ? "Save Changes" : "Create Employee"}
                </Button>
                <Button
                    onClick={resetForm}
                    className="bg-slate-300 hover:bg-slate-400 text-slate-800 font-semibold py-2 px-4 rounded-xl transition-colors"
                >
                    Cancel
                </Button>
            </div>
        </div>
    );


    return (
        <div className="min-h-screen bg-slate-100/50">
            {/* Header */}
            <div className="bg-white px-6 py-4 shadow-md border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Briefcase size={24} className={primaryColor} />
                        <h1 className="text-2xl font-extrabold text-slate-900">
                            Admin Central Console
                        </h1>
                    </div>

                    {/* LOGOUT BUTTON */}
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors shadow-sm"
                        title="Log Out"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>

            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
                {/* 1. Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* Total Sales */}
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100/50 transform hover:scale-[1.01] transition-transform duration-300">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 font-semibold tracking-wide uppercase mb-1">Total Sales</p>
                                    <p className="text-3xl font-extrabold text-slate-900">
                                        ₹{stats.grandTotal.toLocaleString()}
                                    </p>
                                </div>
                                <div className={`p-3 ${primaryBg} rounded-xl text-white ${primaryShadow}`}>
                                    <TrendingUp size={24} />
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Data aggregated across all employees.</p>
                        </div>

                        {/* Total Employees */}
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100/50 transform hover:scale-[1.01] transition-transform duration-300">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 font-semibold tracking-wide uppercase mb-1">Active Employees</p>
                                    <p className="text-3xl font-extrabold text-slate-900">
                                        {users.length}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-500 rounded-xl text-white shadow-lg shadow-blue-500/20">
                                    <Users size={24} />
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Includes Admins and Employees.</p>
                        </div>

                        {/* Total Invoices */}
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100/50 transform hover:scale-[1.01] transition-transform duration-300">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 font-semibold tracking-wide uppercase mb-1">Total Invoices</p>
                                    <p className="text-3xl font-extrabold text-slate-900">
                                        {totalInvoices}
                                    </p>
                                </div>
                                <div className="p-3 bg-teal-500 rounded-xl text-white shadow-lg shadow-teal-500/20">
                                    <FileText size={24} />
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Bills generated across the system.</p>
                        </div>

                        {/* Total Products (Kept it as column 4) */}
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100/50 transform hover:scale-[1.01] transition-transform duration-300">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 font-semibold tracking-wide uppercase mb-1">Total Products</p>
                                    <p className="text-3xl font-extrabold text-slate-900">
                                        {stats.productCount || "N/A"}
                                    </p>
                                </div>
                                <div className="p-3 bg-yellow-500 rounded-xl text-white shadow-lg shadow-yellow-500/20">
                                    <Package size={24} />
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Inventory items currently stocked.</p>
                        </div>
                    </div>
                )}

                {/* 2. Charts & Main Sections (New 3-Column Layout on large screens) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT (Col 1/2): Performance & Charts - 2/3 width */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 2.1 Category Sales Chart */}
                        {stats && stats.categoryStats && (
                            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200/80">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <BarChart3 className={primaryColor} size={20} />
                                        Category Sales Analysis
                                    </h2>
                                </div>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={stats.categoryStats.map(s => ({ name: s._id || 'Unknown', sales: s.totalSales, count: s.count }))}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                cursor={{ fill: '#f1f5f9' }}
                                            />
                                            <Legend iconType="circle" />
                                            <Bar dataKey="sales" name="Total Sales (₹)" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* 2.2 Employee Performance */}
                        {stats && stats.employeeStats.length > 0 && (
                            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200/80">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <TrendingUp className={primaryColor} size={20} />
                                        Top Employee Performance
                                    </h2>
                                    <Link
                                        to="/reports"
                                        className="text-sm font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
                                    >
                                        View Full Report &rarr;
                                    </Link>
                                </div>

                                <div className="space-y-4 divide-y divide-slate-100">
                                    {stats.employeeStats.slice(0, 5).map((emp, index) => (
                                        <div
                                            key={emp.employeeEmail}
                                            className="flex items-center justify-between pt-4 pb-2 hover:bg-slate-50 rounded-lg -mx-2 px-2 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`font-extrabold text-lg w-6 text-center ${index < 3 ? "text-indigo-500" : "text-slate-400"
                                                        }`}
                                                >
                                                    #{index + 1}
                                                </span>
                                                <div>
                                                    <p className="font-semibold text-slate-800">
                                                        {emp.employeeName}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {emp.employeeEmail}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-slate-900">
                                                    ₹{emp.totalSales.toLocaleString()}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {emp.invoiceCount} invoices
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT (Col 3): Quick Actions & User Management - 1/3 width */}
                    <div className="lg:col-span-1 space-y-8">

                        {/* 3.1 Quick Actions */}
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200/80 h-fit">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">
                                Quick Links
                            </h2>
                            <div className="space-y-4">
                                <LinkButton
                                    to="/manage-products"
                                    icon={Package}
                                    label="Product Inventory"
                                    color="blue"
                                />
                                <LinkButton
                                    to="/admin/history"
                                    icon={TrendingUp}
                                    label="Detailed Sales History"
                                    color="purple"
                                />
                                <LinkButton
                                    to="/settings"
                                    icon={Briefcase}
                                    label="System Settings"
                                    color="slate"
                                />
                            </div>
                        </div>

                        {/* 3.2 User Management (Compact) */}
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80">
                            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <UserCheck className={primaryColor} size={20} />
                                    Staff Accounts
                                </h2>
                                <Button
                                    onClick={() => {
                                        setEditingUser(null);
                                        resetForm();
                                        setShowAddUser(true);
                                    }}
                                    className={`flex items-center gap-1 ${primaryBg} ${primaryHoverBg} text-white font-semibold transition-all py-2 px-3 rounded-xl text-sm`}
                                >
                                    <Plus size={14} />
                                    Add
                                </Button>
                            </div>

                            {/* Users List (Now compact) */}
                            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                                {users.map((user) => (
                                    <div
                                        key={user._id}
                                        className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                    >
                                        <div>
                                            <p className="font-semibold text-sm text-slate-900">{user.name}</p>
                                            <p className="text-xs text-slate-600">
                                                <span
                                                    className={`font-bold uppercase tracking-wider mr-2 ${user.role === "admin"
                                                        ? "text-red-500"
                                                        : "text-indigo-600"
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                                | {user.email}
                                            </p>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="p-1 text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors"
                                                title="Edit User"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Add/Edit User Form (Moved to the bottom or as a Modal/Drawer) */}
                {/* Keeping it here but using the flag 'showAddUser' */}
                {showAddUser && userFormContent}

            </div>
        </div>
    );
};

// Helper component for Quick Links
const LinkButton = ({ to, icon: Icon, label, color }) => {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
        green: "bg-green-50 text-green-600 hover:bg-green-100",
        purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
        slate: "bg-slate-200/50 text-slate-600 hover:bg-slate-200",
    };

    return (
        <Link
            to={to}
            className={`flex items-center gap-4 p-4 rounded-xl transition-all border border-transparent hover:border-slate-200 ${colorClasses[color]}`}
        >
            <div className={`p-2 rounded-full bg-white shadow-sm`}>
                <Icon size={18} />
            </div>
            <span className="font-semibold">{label}</span>
        </Link>
    );
};

export default AdminDashboard;
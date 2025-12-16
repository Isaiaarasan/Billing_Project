import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import adminService from "../../services/adminService";
import {
  Users,
  Package,
  FileText,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import Input from "../../components/Input";
import Button from "../../components/Button";

const Dashboard = () => {
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
      setUsers(usersData);
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
    if (!name || !email || !password) return;

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
    if (!name || !email) return;

    try {
      await adminService.updateUser(editingUser._id, { name, email, role });
      resetForm();
      fetchDashboardData();
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-3 shadow-sm border-b">
        <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      <div className="p-4 max-w-7xl mx-auto space-y-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{stats.grandTotal.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Invoices</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.employeeStats.reduce(
                      (acc, emp) => acc + emp.invoiceCount,
                      0
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/manage-products"
              className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Package className="text-blue-600" size={20} />
              <span className="font-medium text-blue-900">Manage Products</span>
            </Link>
            <Link
              to="/create-invoice"
              className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FileText className="text-green-600" size={20} />
              <span className="font-medium text-green-900">Create Invoice</span>
            </Link>
            <Link
              to="/history"
              className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <TrendingUp className="text-purple-600" size={20} />
              <span className="font-medium text-purple-900">View Reports</span>
            </Link>
          </div>
        </div>

        {/* Employee Performance */}
        {stats && stats.employeeStats.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Employee Performance</h2>
            <div className="space-y-3">
              {stats.employeeStats.map((emp) => (
                <div
                  key={emp.employeeEmail}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {emp.employeeName}
                    </p>
                    <p className="text-sm text-gray-600">{emp.employeeEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ₹{emp.totalSales.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {emp.invoiceCount} invoices
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Employee Management</h2>
            <Button
              onClick={() => setShowAddUser(true)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Add Employee
            </Button>
          </div>

          {/* Add/Edit User Form */}
          {showAddUser && (
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-md font-semibold mb-4">
                {editingUser ? "Edit Employee" : "Add New Employee"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {!editingUser && (
                  <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={editingUser ? handleUpdateUser : handleAddUser}
                >
                  {editingUser ? "Update Employee" : "Add Employee"}
                </Button>
                <Button onClick={resetForm} variant="secondary">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Users List */}
          <div className="divide-y divide-gray-100">
            {users.map((user) => (
              <div
                key={user._id}
                className="p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500">
                    Role:{" "}
                    <span
                      className={`font-medium ${
                        user.role === "admin" ? "text-red-600" : "text-blue-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
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
  );
};

export default Dashboard;

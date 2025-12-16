import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserPlus, FileText } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); // Default role
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password, role);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center mb-6">
          <FileText size={36} className="text-blue-600 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            type="text"
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
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Role Selection (Admin should be hidden/protected in a real app, but exposed for testing/initial setup) */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1.5 ml-1">
              Account Type
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin (Restricted)</option>
            </select>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="mt-6">
            <UserPlus size={20} /> {loading ? "Registering..." : "Sign Up"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already registered?
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline ml-1"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

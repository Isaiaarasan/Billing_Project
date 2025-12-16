import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn, FileText } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAdmin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      // Navigate based on user role
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/history");
      }
    } catch (err) {
      // Assuming backend sends a structured error message
      const errorMessage =
        err.response?.data?.message || "Login failed. Check credentials.";
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
          <h2 className="text-2xl font-bold text-gray-900">Employee Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="employee@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="mt-6">
            <LogIn size={20} /> {loading ? "Logging In..." : "Log In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline ml-1"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

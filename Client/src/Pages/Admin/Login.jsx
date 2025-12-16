import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ShieldCheck, Lock } from "lucide-react";
import Input from "../../components/Input";
import Button from "../../components/Button";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // We'll handle isAdmin check manually after login

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Perform Login
      const userData = await login(email, password);

      // 2. Check Role Strict
      if (userData && userData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        setError("Access Denied: You do not have administrator privileges.");
        // Optionally logout immediately if you want to prevent non-admins from staying logged in session
        // logout(); 
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Admin Login failed. Verify credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
        <div className="text-center mb-8">
          <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
             <ShieldCheck size={32} className="text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h2>
          <p className="text-gray-400 text-sm mt-2">Restricted Access only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
           {/* Custom styling for inputs to match dark theme */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1.5 ml-1">
                Admin Email
            </label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                className="w-full p-3 bg-gray-700/50 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner placeholder-gray-500"
                required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1.5 ml-1">
                Password
            </label>
             <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-gray-700/50 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner placeholder-gray-500"
                required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-800 text-red-300 rounded-lg text-sm flex items-center gap-2">
              <Lock size={16} /> {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="mt-6 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 border-0">
            {loading ? "Warping in..." : "Access Dashboard"}
          </Button>
        </form>
        
        <div className="mt-8 text-center">
            <p className="text-gray-600 text-xs">
                Secure System • v1.0.0
            </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserPlus, FileText, ArrowLeft, Mail, Lock, User } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-0 relative overflow-hidden">

      {/* Background Shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] animate-float opacity-50 z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] animate-float delay-100 opacity-50 z-0"></div>

      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2 z-10 border border-white/50 m-4 lg:m-8">

        {/* Left Side: Visuals (Desktop Only) - Swapped for Register */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-purple-600 to-indigo-700 text-white relative p-12 overflow-hidden order-2">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80')] bg-cover opacity-10 mix-blend-overlay"></div>

          <div className="relative z-10 text-center max-w-md">
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
              <UserPlus size={64} className="relative z-10 text-white mx-auto" strokeWidth={1.5} />
            </div>

            <h3 className="text-2xl font-bold mb-4">Join the Team</h3>
            <p className="text-purple-100 leading-relaxed font-light">
              Create your employee account to start managing invoices and customers instantly.
            </p>
          </div>
        </div>

        {/* Right Side: Form - Order 1 */}
        <div className="p-8 lg:p-12 flex flex-col justify-center order-1">
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-purple-600 transition-colors mb-6 group w-fit">
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>

          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
            <p className="text-slate-500">Enter your details to register.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <User className="absolute left-3 top-9 z-10 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-3 top-9 z-10 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-9 z-10 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            {/* Role Selection */}
            <div className="flex flex-col">
              <label className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-1.5 ml-1">
                Account Type
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm appearance-none"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin (Restricted)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-center gap-2 animate-shake">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 mt-2 bg-gradient-to-r from-purple-600 to-pink-600">
              {loading ? "Registering..." : "Sign Up"} <UserPlus size={20} />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already registered?
            <Link
              to="/login"
              className="text-purple-600 font-semibold hover:text-purple-700 hover:underline ml-1"
            >
              Log In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;

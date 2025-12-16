import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn, FileText, ArrowLeft, Lock, Mail } from "lucide-react";
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
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Check credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-0 relative overflow-hidden">

      {/* Background Shapes */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] animate-float opacity-50 z-0"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[100px] animate-float delay-100 opacity-50 z-0"></div>

      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2 z-10 border border-white/50 m-4 lg:m-8">

        {/* Left Side: Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors mb-8 group w-fit">
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>

          <div className="mb-8">
            <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
              <FileText size={24} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Please enter your credentials to access your workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <Mail className="absolute left-3 top-9 z-10 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <Input
                label="Email Address"
                type="email"
                placeholder="employee@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                //className="pl-8" // Custom padding for icon
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-9 z-10 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-center gap-2 animate-shake">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 mt-4">
              {loading ? "Signing In..." : "Log In"} <LogIn size={20} />
            </button>
          </form>
          {/* 
          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?
            <Link
              to="/register"
              className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline ml-1"
            >
              Sign Up
            </Link>
          </p> */}
        </div>

        {/* Right Side: Visuals (Desktop Only) */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative p-12 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80')] bg-cover opacity-10 mix-blend-overlay"></div>

          <div className="relative z-10 text-center max-w-md">
            <div className="mb-6 p-4 glass-panel rounded-2xl w-full mx-auto transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="h-2 w-24 bg-slate-200 rounded mb-4"></div>
              <div className="h-2 w-full bg-slate-100 rounded mb-2"></div>
              <div className="h-2 w-2/3 bg-slate-100 rounded"></div>
            </div>

            <h3 className="text-2xl font-bold mb-4">Streamline Your Invoicing</h3>
            <p className="text-indigo-100 leading-relaxed font-light">
              Join thousands of businesses managing their billing with efficiency and style.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;

import React from "react";
import { Link, Navigate } from "react-router-dom";
import { FileText, DollarSign, Users, ArrowRight, ShieldCheck, Zap, BarChart } from "lucide-react";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const Landing = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (isAuthenticated) {
    if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">

      {/* Abstract Background Element */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px] animate-float"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] animate-float delay-200"></div>

      <div className="max-w-5xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">

        {/* Left: Content */}
        <div className="space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-indigo-100 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-sm font-medium text-indigo-900">Sales is now live</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Billing made <br />
            <span className="text-gradient">Effortless.</span>
          </h1>

          <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
            Experience the next generation of mobile invoicing. Professional bills, real-time tracking, and effortless product management.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 text-white font-semibold shadow-lg shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                Employee Login <ArrowRight size={18} />
              </button>
            </Link>
            <Link to="/admin/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-slate-900 border border-slate-200 font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                Admin Login
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-8 text-slate-400 text-sm font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-green-500" /> Secure Data
            </div>
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-yellow-500" /> Instant Sync
            </div>
          </div>
        </div>

        {/* Right: Visual Feature Cards */}
        <div className="relative hidden lg:block h-[600px] w-full animate-fade-in-up delay-200">
          {/* Floating decorative cards */}
          <div className="absolute top-10 right-10 z-20 glass-panel p-6 rounded-2xl w-64 animate-float delay-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                <FileText size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">New Invoice</h4>
                <p className="text-xs text-slate-500">Just created</p>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-blue-500 rounded-full"></div>
            </div>
          </div>

          <div className="absolute bottom-20 left-10 z-30 glass-panel p-6 rounded-2xl w-72 animate-float delay-300">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-sm text-slate-500">Total Sales</p>
                <h3 className="text-2xl font-bold text-slate-900">₹124,500</h3>
              </div>
              <BarChart className="text-green-500" />
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded w-fit">
              <TrendingUp size={12} /> +12.5% vs last week
            </div>
          </div>

          {/* Main Glass Circle/Blob */}
          <div className="absolute inset-0 m-auto w-[400px] h-[400px] bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        </div>

      </div>
    </div>
  );
};
// Helper icon for decoration (needs import if not present)
const TrendingUp = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
)

export default Landing;

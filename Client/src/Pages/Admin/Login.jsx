import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ShieldCheck, Lock, Mail, ArrowLeft, Server } from "lucide-react";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const userData = await login(email, password);

            if (userData && userData.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                setError("Access Denied: You do not have administrator privileges.");
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || "Admin Login failed. Verify credentials.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // --- Blue Theme Variables ---
    const primaryColorClass = "text-blue-600";
    const primaryBgClass = "bg-blue-600";
    const secondaryColorClass = "text-sky-500";
    const primaryRingClass = "focus:ring-blue-500";
    const primaryGradientClass = "bg-gradient-to-tr from-blue-600 to-sky-600";
    const buttonClass = `w-full py-3.5 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 mt-4 text-white ${primaryGradientClass} hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30`;

    return (
        // Changed min-h-screen to h-screen and removed p-4/lg:p-0 from the div itself.
        // The flex container is now the exact height of the screen.
        <div className="h-screen flex items-center justify-center relative overflow-hidden bg-slate-50">

            {/* Background Shapes - Blue theme */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] animate-float opacity-50 z-0"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-sky-400/20 rounded-full blur-[100px] animate-float delay-100 opacity-50 z-0"></div>

            {/* Container - Added max-h-full (or max-h-[95vh] for safety) and adjusted margin/padding */}
            <div className="w-full max-w-5xl max-h-[90vh] bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2 z-10 border border-slate-200 m-4 lg:m-8">

                {/* Left Side: Form - Adjusted padding to be slightly smaller (p-8) to save vertical space */}
                <div className="p-8 flex flex-col justify-center overflow-y-auto">
                    <Link to="/" className={`inline-flex items-center text-slate-500 hover:${primaryColorClass} transition-colors mb-6 group w-fit`}>
                        <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Public Site
                    </Link>

                    <div className="mb-6">
                        <div className={`h-12 w-12 ${primaryGradientClass} rounded-xl flex items-center justify-center text-white mb-3 shadow-lg shadow-blue-500/30`}>
                            <ShieldCheck size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">System Administration</h2>
                        <p className="text-sm text-slate-500">Log in for full system configuration and control.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <Mail className={`absolute left-3 top-[2.4rem] z-10 text-slate-400 group-focus-within:${primaryColorClass} transition-colors`} size={18} />
                            <div className="flex flex-col">
                                <label className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-1 ml-1">
                                    Admin Account Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="administrator@domain.com"
                                    className={`w-full p-3 pl-10 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 ${primaryRingClass} transition-all shadow-sm placeholder-slate-400 text-sm`}
                                    required
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <Lock className={`absolute left-3 top-[2.4rem] z-10 text-slate-400 group-focus-within:${primaryColorClass} transition-colors`} size={18} />
                            <div className="flex flex-col">
                                <label className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-1 ml-1">
                                    Secret Key Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full p-3 pl-10 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 ${primaryRingClass} transition-all shadow-sm placeholder-slate-400 text-sm`}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-2 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs flex items-center gap-2 animate-shake">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading} className={`${buttonClass} text-base py-3`}>
                            {loading ? "Verifying Credentials..." : "Initiate Control Panel"} <Server size={18} />
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-xs">
                            High Security Protocol • Authorized Personnel Only
                        </p>
                    </div>
                </div>

                {/* Right Side: Visuals (Desktop Only) */}
                {/* Reduced padding to p-8 to match the left side */}
                <div className="hidden lg:flex flex-col justify-center items-center bg-slate-800 text-white relative p-8 overflow-hidden border-l border-slate-700">
                    {/* Dark Background and Pattern Overlay */}
                    <div className="absolute inset-0 bg-slate-900/80 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-white/5 opacity-10"></div>
                    
                    <div className="relative z-10 text-center max-w-md">
                        <div className="mb-6 relative">
                            <div className={`absolute inset-0 ${primaryBgClass}/30 blur-3xl rounded-full`}></div>
                            <Server size={70} className={`relative z-10 ${secondaryColorClass} mx-auto`} strokeWidth={1.5} />
                        </div>

                        <h3 className="text-xl font-bold mb-3 text-white">Central Command Access</h3>
                        <p className="text-sm text-slate-300 leading-relaxed font-normal mb-6">
                            Gain access to vital configuration logs, manage user permissions, deploy system updates, and monitor server health.
                        </p>
                        
                        <p className="text-xs font-semibold text-slate-400 mt-6">
                            Admin access required to perform high-level system operations.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminLogin;
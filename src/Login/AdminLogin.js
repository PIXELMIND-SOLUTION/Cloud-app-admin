// pages/AdminLogin.jsx
import React, { useState } from 'react';
import {
    Smartphone, Shield, Eye, EyeOff, Lock, Mail,
    ArrowRight, AlertCircle, CheckCircle2, Cloud,
    Check, Copy
} from 'lucide-react';
import bgImage from '../assets/admin.png';
import { useNavigate } from 'react-router-dom';

const FEATURE_PILLS = [
    { icon: Shield, label: "Enterprise-grade security" },
    { icon: Smartphone, label: "3,847 devices managed" },
];

export const AdminLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);

        setTimeout(() => {
            sessionStorage.setItem("adminAuth", "true");

            setLoading(false);
            navigate("/admin/dashboard");
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">

                <div className="flex flex-col lg:flex-row">

                    {/* Left Side - Background */}
                    <div className="relative lg:w-1/2 h-64 sm:h-72 md:h-80 lg:h-[600px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-red-600 to-orange-500">
                            <div className="absolute inset-0">
                                <img
                                    src={bgImage}
                                    alt=""
                                    className="w-full h-full object-cover opacity-20"
                                />
                            </div>
                        </div>

                        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 lg:px-16 text-white">
                            <div className="max-w-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                                        <img src='/logo.png' className='w-10 h-10 object-cover' />
                                    </div>
                                    <span className="text-xl font-bold">RV Admin</span>
                                </div>

                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                    Welcome Back!
                                </h1>

                                <p className="text-base sm:text-lg text-white/90">
                                    Sign in to manage your cloud infrastructure.
                                </p>


                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
                        <div className="w-full max-w-sm">
                            <div className="mb-6 lg:mb-8">
                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                                    Sign In
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    Access your cloud dashboard
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="admin@mdm.io"
                                            className="w-full h-12 rounded-xl border border-slate-200 pl-12 pr-4 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type={showPw ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full h-12 rounded-xl border border-slate-200 pl-12 pr-12 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPw(!showPw)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-sm text-rose-500 bg-rose-50 rounded-lg px-4 py-2.5 border border-rose-100">
                                        <AlertCircle size={16} className="shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {success && (
                                    <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 rounded-lg px-4 py-2.5 border border-emerald-100">
                                        <CheckCircle2 size={16} className="shrink-0" />
                                        <span>Login successful! Redirecting...</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-500 to-orange-400 text-white font-semibold hover:shadow-lg hover:shadow-rose-200 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing In...
                                        </>
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
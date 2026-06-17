// pages/SubAdminLogin.jsx
import React, { useState } from 'react';
import {
    Smartphone, UserCog, Eye, EyeOff, Lock, Mail,
    ArrowRight, AlertCircle, CheckCircle2, Shield,
    Layers, Bell, Cloud
} from 'lucide-react';
import bgImage from '../assets/staff.png';
import { useNavigate } from 'react-router-dom';

const FEATURE_PILLS = [
    { icon: Shield, label: "Scoped access control" },
    { icon: Smartphone, label: "1,247 devices managed" },
];

export const SubAdminLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [orgCode, setOrgCode] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password || !orgCode) { setError('Please fill in all fields.'); return; }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1200);
        navigate('/dashboard')
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">

                <div className="flex flex-col lg:flex-row">

                    {/* Left Side - Background */}
                    <div className="relative lg:w-1/2 h-64 sm:h-72 md:h-80 lg:h-[600px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700">
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
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <Cloud size={22} className="text-white" />
                                    </div>
                                    <span className="text-xl font-bold">MDM Admin</span>
                                </div>

                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                    Sub Admin<br />
                                    <span className="text-emerald-200">Access Portal</span>
                                </h1>

                                <p className="text-base sm:text-lg text-white/90">
                                    Sign in with your organization code to manage your assigned devices.
                                </p>

                                <div className="hidden sm:flex flex-wrap gap-3 mt-6">
                                    {FEATURE_PILLS.map((pill, idx) => (
                                        <div key={idx} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                                            <pill.icon size={16} className="text-white/80" />
                                            <span className="text-sm text-white/90">{pill.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
                        <div className="w-full max-w-sm">
                            <div className="mb-6 lg:mb-8">
                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                                    Sub Admin Sign In
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    Access your delegated management console
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">

                                {/* Organization Code */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Organization Code
                                    </label>
                                    <div className="relative">
                                        <Layers size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={orgCode}
                                            onChange={(e) => setOrgCode(e.target.value.toUpperCase())}
                                            placeholder="ORG-001"
                                            className="w-full h-12 rounded-xl border border-slate-200 pl-12 pr-4 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all font-mono tracking-widest uppercase"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
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
                                            placeholder="subadmin@mdm.io"
                                            className="w-full h-12 rounded-xl border border-slate-200 pl-12 pr-4 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
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
                                            className="w-full h-12 rounded-xl border border-slate-200 pl-12 pr-12 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
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

                                {/* Error */}
                                {error && (
                                    <div className="flex items-center gap-2 text-sm text-rose-500 bg-rose-50 rounded-lg px-4 py-2.5 border border-rose-100">
                                        <AlertCircle size={16} className="shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Success */}
                                {success && (
                                    <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 rounded-lg px-4 py-2.5 border border-emerald-100">
                                        <CheckCircle2 size={16} className="shrink-0" />
                                        <span>Login successful! Redirecting...</span>
                                    </div>
                                )}

                                {/* Forgot Password */}
                                <div className="text-right">
                                    <button type="button" className="text-sm text-emerald-500 hover:text-emerald-600 font-medium transition-colors">
                                        Forgot password?
                                    </button>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

                                {/* Demo Credentials */}
                                {/* <div className="text-xs text-center text-slate-400 mt-4 space-y-1">
                                    <p>Demo: subadmin@mdm.io / sub123 / ORG-001</p>
                                </div> */}

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
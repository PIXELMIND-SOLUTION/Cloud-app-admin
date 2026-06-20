// pages/AdminLogin.jsx - Dark Theme with Background Image
import React, { useState } from 'react';
import {
    Smartphone, Shield, Eye, EyeOff, Lock, Mail,
    ArrowRight, AlertCircle, CheckCircle2, Cloud,
    Check, Copy, Cpu
} from 'lucide-react';
import bgImage from '../assets/admin.png'; // Your background image
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
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Image with Dark Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={bgImage}
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, rgba(10, 6, 24, 0.92), rgba(26, 16, 53, 0.88), rgba(13, 8, 32, 0.95))',
                    }}
                />
                {/* Subtle purple glow */}
                <div className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(circle at 30% 50%, rgba(139,92,246,0.08), transparent 70%)',
                    }}
                />
            </div>

            <div className="relative z-10 w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden"
                style={{
                    background: 'rgba(20, 16, 36, 0.85)',
                    border: '1px solid rgba(139,92,246,0.2)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                <div className="flex flex-col lg:flex-row">

                    {/* Left Side - Info */}
                    <div className="relative lg:w-1/2 h-64 sm:h-72 md:h-80 lg:h-[600px] overflow-hidden">
                        {/* Background with image overlay */}
                        <div className="absolute inset-0">
                            <img
                                src={bgImage}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(124,58,237,0.85), rgba(99,102,241,0.75))',
                                }}
                            />
                        </div>

                        {/* Animated particles effect */}
                        <div className="absolute inset-0 overflow-hidden">
                            {[...Array(30)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute rounded-full animate-pulse"
                                    style={{
                                        width: Math.random() * 4 + 2 + 'px',
                                        height: Math.random() * 4 + 2 + 'px',
                                        background: 'rgba(255,255,255,0.15)',
                                        left: Math.random() * 100 + '%',
                                        top: Math.random() * 100 + '%',
                                        animationDuration: Math.random() * 4 + 2 + 's',
                                        animationDelay: Math.random() * 3 + 's',
                                    }}
                                />
                            ))}
                        </div>

                        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 lg:px-16 text-white">
                            <div className="max-w-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                        style={{
                                            background: 'rgba(255,255,255,0.15)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            backdropFilter: 'blur(10px)',
                                            boxShadow: '0 0 30px rgba(124,58,237,0.2)',
                                        }}
                                    >
                                        <img src='/logo.png' className='w-8 h-8 object-cover' alt="Logo" />
                                    </div>
                                    <span className="text-2xl font-bold tracking-tight text-white">
                                        RV Admin
                                    </span>
                                </div>

                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                    Welcome Back!
                                </h1>

                                <p className="text-base sm:text-lg text-white/90 mb-6">
                                    Sign in to manage your cloud infrastructure and monitor your devices in real-time.
                                </p>

                                {/* Decorative glow */}
                                <div className="absolute bottom-8 right-8 opacity-30">
                                    <div className="w-40 h-40 rounded-full"
                                        style={{
                                            background: 'radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)',
                                            filter: 'blur(20px)',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
                        <div className="w-full max-w-sm">
                            <div className="mb-6 lg:mb-8">
                                <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#e2d9f3' }}>
                                    Sign In
                                </h2>
                                <p className="text-sm mt-1" style={{ color: '#9c8fc0' }}>
                                    Access your cloud dashboard
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#9c8fc0' }}>
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#5a4f72' }} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="admin@mdm.io"
                                            className="w-full h-12 rounded-xl pl-12 pr-4 outline-none transition-all"
                                            style={{
                                                background: 'rgba(139,92,246,0.08)',
                                                border: '1px solid rgba(139,92,246,0.15)',
                                                color: '#e2d9f3',
                                            }}
                                            onFocus={e => {
                                                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)';
                                                e.currentTarget.style.boxShadow = '0 0 20px rgba(139,92,246,0.1)';
                                            }}
                                            onBlur={e => {
                                                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#9c8fc0' }}>
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#5a4f72' }} />
                                        <input
                                            type={showPw ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full h-12 rounded-xl pl-12 pr-12 outline-none transition-all"
                                            style={{
                                                background: 'rgba(139,92,246,0.08)',
                                                border: '1px solid rgba(139,92,246,0.15)',
                                                color: '#e2d9f3',
                                            }}
                                            onFocus={e => {
                                                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)';
                                                e.currentTarget.style.boxShadow = '0 0 20px rgba(139,92,246,0.1)';
                                            }}
                                            onBlur={e => {
                                                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPw(!showPw)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                                            style={{ color: '#5a4f72' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#9c8fc0'}
                                            onMouseLeave={e => e.currentTarget.style.color = '#5a4f72'}
                                        >
                                            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Forgot password link */}
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="text-xs font-medium transition-colors"
                                        style={{ color: '#a78bfa' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#c4b5fd'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#a78bfa'}
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-sm rounded-lg px-4 py-2.5 border"
                                        style={{
                                            color: '#f87171',
                                            background: 'rgba(239,68,68,0.08)',
                                            borderColor: 'rgba(239,68,68,0.2)',
                                        }}
                                    >
                                        <AlertCircle size={16} className="shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {success && (
                                    <div className="flex items-center gap-2 text-sm rounded-lg px-4 py-2.5 border"
                                        style={{
                                            color: '#34d399',
                                            background: 'rgba(52,211,153,0.08)',
                                            borderColor: 'rgba(52,211,153,0.2)',
                                        }}
                                    >
                                        <CheckCircle2 size={16} className="shrink-0" />
                                        <span>Login successful! Redirecting...</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 rounded-xl text-white font-semibold transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
                                    style={{
                                        background: 'linear-gradient(135deg, #7c3aed, #9333ea)',
                                        boxShadow: '0 0 20px rgba(124,58,237,0.3)',
                                    }}
                                    onMouseEnter={e => {
                                        if (!e.currentTarget.disabled) {
                                            e.currentTarget.style.boxShadow = '0 0 40px rgba(124,58,237,0.5)';
                                            e.currentTarget.style.transform = 'scale(1.02)';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.boxShadow = '0 0 20px rgba(124,58,237,0.3)';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.2))',
                                        }}
                                    />
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Signing In...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Sign In</span>
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                <div className="flex items-center gap-2 justify-center mt-4">
                                    <div className="h-px flex-1" style={{ background: 'rgba(139,92,246,0.1)' }} />
                                    <span className="text-xs" style={{ color: '#5a4f72' }}>Secure Login</span>
                                    <div className="h-px flex-1" style={{ background: 'rgba(139,92,246,0.1)' }} />
                                </div>

                                <div className="flex flex-wrap items-center justify-center gap-3 text-xs" style={{ color: '#5a4f72' }}>
                                    <span className="flex items-center gap-1">
                                        <Shield size={12} style={{ color: '#a78bfa' }} />
                                        256-bit encryption
                                    </span>
                                    <span className="w-px h-3" style={{ background: 'rgba(139,92,246,0.1)' }} />
                                    <span className="flex items-center gap-1">
                                        <Check size={12} style={{ color: '#34d399' }} />
                                        2FA available
                                    </span>
                                    <span className="w-px h-3" style={{ background: 'rgba(139,92,246,0.1)' }} />
                                    <span className="flex items-center gap-1">
                                        <Cpu size={12} style={{ color: '#a78bfa' }} />
                                        v3.2.1
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
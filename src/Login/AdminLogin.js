// pages/AdminLogin.jsx - Optimized Dark Theme with Background Image
import React, { useState } from 'react';
import {
    Smartphone, Shield, Eye, EyeOff, Lock, Mail,
    ArrowRight, AlertCircle, CheckCircle2, Cloud,
    Check, Copy, Cpu, X, Key, Send, Users
} from 'lucide-react';
import bgImage from '../assets/logoC.png';
import { useNavigate } from 'react-router-dom';

// Reusable Input Component
const InputField = ({ icon: Icon, type, value, onChange, placeholder, toggleShow, showPassword }) => (
    <div className="relative">
        <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#5a4f72' }} />
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
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
        {toggleShow && (
            <button
                type="button"
                onClick={toggleShow}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: '#5a4f72' }}
                onMouseEnter={e => e.currentTarget.style.color = '#9c8fc0'}
                onMouseLeave={e => e.currentTarget.style.color = '#5a4f72'}
            >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        )}
    </div>
);

const Message = ({ type, message }) => {
    if (!message) return null;

    const isError = type === "error";

    const colors = isError
        ? {
            color: "#f87171",
            backgroundColor: "rgba(239,68,68,0.08)",
            borderColor: "rgba(239,68,68,0.2)",
        }
        : {
            color: "#34d399",
            backgroundColor: "rgba(52,211,153,0.08)",
            borderColor: "rgba(52,211,153,0.2)",
        };

    return (
        <div
            className="flex items-center gap-2 text-sm rounded-lg px-4 py-2.5 border"
            style={colors}
        >
            {isError ? (
                <AlertCircle size={16} className="shrink-0" />
            ) : (
                <CheckCircle2 size={16} className="shrink-0" />
            )}

            <span>{message}</span>
        </div>
    );
};

// Reusable Button Component
const Button = ({ children, loading, onClick, type = 'submit', fullWidth = true, variant = 'primary' }) => {
    const isPrimary = variant === 'primary';
    const baseStyle = fullWidth ? 'w-full' : '';
    const colorStyle = isPrimary
        ? { background: 'linear-gradient(135deg, #FF7D38, #FF6B1A)', boxShadow: '0 0 20px rgba(255,125,56,0.3)' }
        : { background: 'rgba(255,125,56,0.1)', color: '#FF7D38', border: '1px solid rgba(255,125,56,0.15)' };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading}
            className={`${baseStyle} h-12 rounded-xl text-white font-semibold transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isPrimary ? 'relative overflow-hidden group' : ''}`}
            style={colorStyle}
            onMouseEnter={e => {
                if (!e.currentTarget.disabled && isPrimary) {
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(255,125,56,0.5)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                } else if (!isPrimary) {
                    e.currentTarget.style.background = 'rgba(255,125,56,0.2)';
                }
            }}
            onMouseLeave={e => {
                if (isPrimary) {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(255,125,56,0.3)';
                    e.currentTarget.style.transform = 'scale(1)';
                } else {
                    e.currentTarget.style.background = 'rgba(255,125,56,0.1)';
                }
            }}
        >
            {isPrimary && (
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(135deg, rgba(255,125,56,0.3), rgba(255,107,26,0.3))' }}
                />
            )}
            {loading ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Loading...</span>
                </>
            ) : children}
        </button>
    );
};

export const AdminLogin = ({ onLogin }) => {
    const [state, setState] = useState({
        email: '',
        password: '',
        showPw: false,
        loading: false,
        error: '',
        success: false
    });

    const [resetState, setResetState] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: '',
        showNewPw: false,
        showConfirmPw: false,
        step: 1,
        loading: false,
        error: '',
        success: ''
    });

    const [showForgotModal, setShowForgotModal] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const navigate = useNavigate();

    const updateState = (key, value) => setState(prev => ({ ...prev, [key]: value }));
    const updateResetState = (key, value) => setResetState(prev => ({ ...prev, [key]: value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        const { email, password } = state;
        if (!email || !password) {
            updateState('error', 'Please fill in all fields.');
            return;
        }
        updateState('loading', true);
        setTimeout(() => {
            sessionStorage.setItem('adminAuth', 'true');
            updateState('loading', false);
            navigate('/admin/dashboard');
        }, 1200);
    };

    const handleSendOTP = (e) => {
        e.preventDefault();
        const { email } = resetState;
        if (!email) {
            updateResetState('error', 'Please enter your email address.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            updateResetState('error', 'Please enter a valid email address.');
            return;
        }
        updateResetState('loading', true);

        setTimeout(() => {
            updateResetState('loading', false);
            updateResetState('success', 'OTP sent successfully to your email!');
            updateResetState('step', 2);
        }, 1500);
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        const { otp, newPassword, confirmPassword } = resetState;
        if (!otp || !newPassword || !confirmPassword) {
            updateResetState('error', 'Please fill in all fields.');
            return;
        }
        if (newPassword.length < 6) {
            updateResetState('error', 'Password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            updateResetState('error', 'Passwords do not match.');
            return;
        }
        updateResetState('loading', true);
        setTimeout(() => {
            updateResetState('loading', false);
            updateResetState('success', 'Password reset successful!');
            setTimeout(() => {
                setShowForgotModal(false);
                setResetState({
                    email: '', otp: '', newPassword: '', confirmPassword: '',
                    showNewPw: false, showConfirmPw: false, step: 1,
                    loading: false, error: '', success: ''
                });
            }, 1500);
        }, 1500);
    };

    const closeModal = () => {
        setShowForgotModal(false);
        setResetState(prev => ({ ...prev, step: 1, error: '', success: '' }));
    };

    const STAFF_LOGIN_URL = `${window.location.origin}/staff-login`;

    const copyStaffLoginLink = async () => {
        try {
            await navigator.clipboard.writeText(STAFF_LOGIN_URL);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 3000);
        } catch {
            const textArea = document.createElement("textarea");
            textArea.value = STAFF_LOGIN_URL;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 3000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fff, #fff)', boxShadow: '0 0 20px rgba(2,32,60,0.3)' }}>
            {/* Background */}
            <div className="absolute inset-0 z-0">
                {/* <img src={bgImage} alt="Background" className="w-full h-full object-cover" /> */}
                {/* <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(2,32,60,0.92), rgba(2,32,60,0.88), rgba(2,32,60,0.95))' }} />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 50%, rgba(255,125,56,0.08), transparent 70%)' }} /> */}
            </div>

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden" style={{ border: '1px solid rgba(255,125,56,0.2)', backdropFilter: 'blur(10px)' }}>
                <div className="flex flex-col lg:flex-row" style={{ background: 'linear-gradient(135deg, #02203C, #02203C)', boxShadow: '0 0 20px rgba(2,32,60,0.3)' }}>
                    {/* Left Panel */}
                    <div className="relative lg:w-1/2 h-64 sm:h-72 md:h-80 lg:h-[600px] overflow-hidden">
                        <div className="absolute inset-0">
                            <img src={bgImage} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute inset-0 overflow-hidden">
                            {[...Array(30)].map((_, i) => (
                                <div key={i} className="absolute rounded-full animate-pulse" style={{
                                    width: Math.random() * 4 + 2 + 'px',
                                    height: Math.random() * 4 + 2 + 'px',
                                    background: 'rgba(255,125,56,0.15)',
                                    left: Math.random() * 100 + '%',
                                    top: Math.random() * 100 + '%',
                                    animationDuration: Math.random() * 4 + 2 + 's',
                                    animationDelay: Math.random() * 3 + 's',
                                }} />
                            ))}
                        </div>
                    </div>

                    {/* Right Panel - Login Form */}
                    <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
                        <div className="w-full max-w-md">
                            <div className="mb-6 lg:mb-8">
                                <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#e2d9f3' }}>Login</h2>
                                <p className="text-sm sm:text-base mt-1" style={{ color: '#5a4f72' }}>Access your Dashboard</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#9c8fc0' }}>Admin Email Address</label>
                                    <InputField
                                        icon={Mail}
                                        type="email"
                                        placeholder="Enter your admin email"
                                        value={state.email}
                                        onChange={e => updateState('email', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#9c8fc0' }}>Password</label>
                                    <InputField
                                        icon={Lock}
                                        type={state.showPw ? "text" : "password"}
                                        value={state.password}
                                        placeholder="Enter your password"
                                        onChange={e => updateState('password', e.target.value)}
                                        toggleShow={() => updateState('showPw', !state.showPw)}
                                        showPassword={state.showPw}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button type="button" onClick={() => setShowForgotModal(true)} className="text-xs font-medium transition-colors" style={{ color: '#FF7D38' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#FF9A5F'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#FF7D38'}>
                                        Forgot password?
                                    </button>
                                </div>
                                <Message type="error" message={state.error} />
                                <Message type="success" message={state.success ? 'Login successful! Redirecting...' : ''} />

                                <Button loading={state.loading}>
                                    Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Button>

                                {/* Staff Portal */}
                                <div
                                    className="mt-8 pt-6 border-t"
                                    style={{ borderColor: "#2b2540" }}
                                >
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                                        {/* Left */}
                                        <div className="flex items-center gap-3 text-center md:text-left">
                                            <div
                                                className="w-11 h-11 rounded-xl flex items-center justify-center"
                                                style={{ background: "rgb(255, 255, 255)" }}
                                            >
                                                <Users size={20} style={{ color: "#FF7D38" }} />
                                            </div>

                                            <div>
                                                <p
                                                    className="text-sm font-semibold"
                                                    style={{ color: "#e2d9f3" }}
                                                >
                                                    Staff Portal
                                                </p>

                                                {/* <p
                                                    className="text-xs"
                                                    style={{ color: "#8b82a5" }}
                                                >
                                                    Access the staff dashboard
                                                </p> */}
                                            </div>
                                        </div>

                                        {/* Right */}
                                        <div className="flex w-full md:w-auto gap-2">
                                            <a
                                                href="/staff-login"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 md:flex-none text-center px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
                                                style={{
                                                    background: "#FF7D38",
                                                    color: "#fff",
                                                }}
                                            >
                                                Staff Login
                                            </a>

                                            <button
                                                type="button"
                                                onClick={copyStaffLoginLink}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
                                                style={{
                                                    background: copySuccess ? "#34d399" : "#1F2937",
                                                    color: "#fff",
                                                }}
                                            >
                                                {copySuccess ? (
                                                    <>
                                                        <Check size={16} />
                                                        Copied
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={16} />
                                                        Copy Link
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0" style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }} onClick={closeModal} />
                    <div className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'rgba(20, 16, 36, 0.95)', border: '1px solid rgba(255,125,56,0.2)', backdropFilter: 'blur(20px)' }}>
                        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(255,125,56,0.15)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,125,56,0.15)' }}>
                                    <Key size={16} style={{ color: '#FF7D38' }} />
                                </div>
                                <h3 className="text-lg font-semibold" style={{ color: '#e2d9f3' }}>Reset Password</h3>
                            </div>
                            <button onClick={closeModal} className="p-1 rounded-lg transition-colors" style={{ color: '#5a4f72' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#9c8fc0'}
                                onMouseLeave={e => e.currentTarget.style.color = '#5a4f72'}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="px-6 py-6">
                            {resetState.step === 1 ? (
                                <form onSubmit={handleSendOTP} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5" style={{ color: '#9c8fc0' }}>Email Address</label>
                                        <InputField
                                            icon={Mail}
                                            type="email"
                                            value={resetState.email}
                                            onChange={e => updateResetState('email', e.target.value)}
                                            placeholder="Enter your registered email"
                                        />
                                        <p className="text-xs mt-2" style={{ color: '#5a4f72' }}>We'll send a verification code to this email</p>
                                    </div>
                                    <Message type="error" message={resetState.error} />
                                    <Message type="success" message={resetState.success} />
                                    <Button loading={resetState.loading}><Send size={18} /> Send OTP</Button>
                                </form>
                            ) : (
                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5" style={{ color: '#9c8fc0' }}>OTP Code</label>
                                        <InputField
                                            icon={Shield}
                                            type="text"
                                            value={resetState.otp}
                                            onChange={e => updateResetState('otp', e.target.value.slice(0, 6))}
                                            placeholder="Enter 6-digit OTP"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5" style={{ color: '#9c8fc0' }}>New Password</label>
                                        <InputField
                                            icon={Lock}
                                            type={resetState.showNewPw ? "text" : "password"}
                                            value={resetState.newPassword}
                                            onChange={e => updateResetState('newPassword', e.target.value)}
                                            placeholder="Enter new password"
                                            toggleShow={() => updateResetState('showNewPw', !resetState.showNewPw)}
                                            showPassword={resetState.showNewPw}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5" style={{ color: '#9c8fc0' }}>Confirm Password</label>
                                        <InputField
                                            icon={Lock}
                                            type={resetState.showConfirmPw ? "text" : "password"}
                                            value={resetState.confirmPassword}
                                            onChange={e => updateResetState('confirmPassword', e.target.value)}
                                            placeholder="Confirm new password"
                                            toggleShow={() => updateResetState('showConfirmPw', !resetState.showConfirmPw)}
                                            showPassword={resetState.showConfirmPw}
                                        />
                                    </div>
                                    <Message type="error" message={resetState.error} />
                                    <Message type="success" message={resetState.success} />
                                    <div className="flex gap-3">
                                        <Button type="button" variant="secondary" onClick={() => {
                                            updateResetState('step', 1);
                                            updateResetState('error', '');
                                            updateResetState('success', '');
                                        }}>Back</Button>
                                        <Button loading={resetState.loading}><Key size={18} /> Reset Password</Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
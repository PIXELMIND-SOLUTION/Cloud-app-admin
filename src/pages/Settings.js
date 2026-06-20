// pages/Settings.js - Dark Theme
import React, { useState, useRef } from 'react';
import {
    User, Mail, Key, Eye, EyeOff, Save, Camera,
    CheckCircle, Lock, Cpu, Shield, Cog
} from 'lucide-react';

const Panel = ({ children, className = "" }) => (
    <div
        className={`rounded-2xl p-5 ${className}`}
        style={{
            background: 'rgba(20, 16, 36, 0.8)',
            border: '1px solid rgba(139,92,246,0.15)',
            backdropFilter: 'blur(12px)',
        }}
    >
        {children}
    </div>
);

export const Settings = () => {
    const fileRef = useRef();
    const [avatar, setAvatar] = useState(null);
    const [form, setForm] = useState({ name: "Vijay N", email: "vijay@corp.mdm.io" });
    const [passwords, setPasswords] = useState({ current: "", newPw: "", confirm: "" });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [profileSaved, setProfileSaved] = useState(false);
    const [pwSaved, setPwSaved] = useState(false);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) setAvatar(URL.createObjectURL(file));
    };

    const handleProfileSave = () => {
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 2500);
    };

    const handlePwSave = () => {
        setPwSaved(true);
        setTimeout(() => setPwSaved(false), 2500);
    };

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold" style={{ color: '#e2d9f3' }}>Settings</h1>
                    <p className="text-sm mt-0.5" style={{ color: '#5a4f72' }}>Manage your admin profile and password</p>
                </div>
                <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl"
                    style={{ color: '#5a4f72', background: 'rgba(20, 16, 36, 0.8)', border: '1px solid rgba(139,92,246,0.15)' }}>
                    <Cog size={16} style={{ color: '#a78bfa' }} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* ── Profile card ── */}
                <Panel>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center"
                            style={{ boxShadow: '0 0 10px rgba(124,58,237,0.3)' }}>
                            <User size={16} className="text-white" />
                        </div>
                        <div>
                            <h2 className="font-semibold" style={{ color: '#e2d9f3' }}>Profile</h2>
                            <p className="text-xs" style={{ color: '#5a4f72' }}>Name, email, and profile photo</p>
                        </div>
                    </div>

                    {/* Avatar */}
                    <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl"
                        style={{
                            background: 'rgba(139,92,246,0.08)',
                            border: '1px solid rgba(139,92,246,0.1)'
                        }}
                    >
                        <div className="relative shrink-0">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-sm overflow-hidden">
                                {avatar
                                    ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                                    : form.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
                                }
                            </div>
                            <button
                                onClick={() => fileRef.current.click()}
                                className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                                style={{
                                    background: 'rgba(20, 16, 36, 0.9)',
                                    border: '1px solid rgba(139,92,246,0.2)',
                                    color: '#9c8fc0'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#c4b5fd'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#9c8fc0'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)'; }}
                            >
                                <Camera size={11} />
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold" style={{ color: '#e2d9f3' }}>{form.name || "Admin"}</p>
                            <p className="text-xs mt-0.5" style={{ color: '#5a4f72' }}>{form.email}</p>
                            <button
                                onClick={() => fileRef.current.click()}
                                className="text-xs font-medium mt-1.5 transition-colors"
                                style={{ color: '#a78bfa' }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#c4b5fd'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#a78bfa'; }}
                            >
                                Change photo
                            </button>
                        </div>
                    </div>

                    {/* Name & Email */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: '#5a4f72' }}>Full Name</label>
                            <div className="relative">
                                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#5a4f72' }} />
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all"
                                    style={{
                                        background: 'rgba(139,92,246,0.08)',
                                        border: '1px solid rgba(139,92,246,0.15)',
                                        color: '#e2d9f3'
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
                                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: '#5a4f72' }}>Email Address</label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#5a4f72' }} />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all"
                                    style={{
                                        background: 'rgba(139,92,246,0.08)',
                                        border: '1px solid rgba(139,92,246,0.15)',
                                        color: '#e2d9f3'
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
                                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-5">
                        <button
                            onClick={handleProfileSave}
                            className={`flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl transition-all ${
                                profileSaved ? "text-white" : "text-white"
                            }`}
                            style={profileSaved
                                ? { background: 'linear-gradient(135deg, #34d399, #10b981)' }
                                : { background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }
                            }
                            onMouseEnter={e => { if (!profileSaved) { e.currentTarget.style.boxShadow = '0 0 20px rgba(124,58,237,0.4)'; } }}
                            onMouseLeave={e => { if (!profileSaved) { e.currentTarget.style.boxShadow = '0 0 10px rgba(124,58,237,0.2)'; } }}
                        >
                            {profileSaved ? <><CheckCircle size={15} /> Saved</> : <><Save size={15} /> Save Changes</>}
                        </button>
                    </div>
                </Panel>

                {/* ── Password card ── */}
                <Panel>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center"
                            style={{ boxShadow: '0 0 10px rgba(99,102,241,0.3)' }}>
                            <Shield size={16} className="text-white" />
                        </div>
                        <div>
                            <h2 className="font-semibold" style={{ color: '#e2d9f3' }}>Change Password</h2>
                            <p className="text-xs" style={{ color: '#5a4f72' }}>Update your account password</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: '#5a4f72' }}>Current Password</label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#5a4f72' }} />
                                <input
                                    type={showCurrent ? "text" : "password"}
                                    value={passwords.current}
                                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl transition-all"
                                    style={{
                                        background: 'rgba(139,92,246,0.08)',
                                        border: '1px solid rgba(139,92,246,0.15)',
                                        color: '#e2d9f3'
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
                                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'}
                                />
                                <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {showCurrent ? <EyeOff size={13} style={{ color: '#5a4f72' }} /> : <Eye size={13} style={{ color: '#5a4f72' }} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: '#5a4f72' }}>New Password</label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#5a4f72' }} />
                                <input
                                    type={showNew ? "text" : "password"}
                                    value={passwords.newPw}
                                    onChange={e => setPasswords({ ...passwords, newPw: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl transition-all"
                                    style={{
                                        background: 'rgba(139,92,246,0.08)',
                                        border: '1px solid rgba(139,92,246,0.15)',
                                        color: '#e2d9f3'
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
                                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'}
                                />
                                <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {showNew ? <EyeOff size={13} style={{ color: '#5a4f72' }} /> : <Eye size={13} style={{ color: '#5a4f72' }} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: '#5a4f72' }}>Confirm New Password</label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#5a4f72' }} />
                                <input
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all"
                                    style={{
                                        background: 'rgba(139,92,246,0.08)',
                                        border: passwords.confirm && passwords.newPw !== passwords.confirm
                                            ? '1px solid rgba(248,113,113,0.3)'
                                            : '1px solid rgba(139,92,246,0.15)',
                                        color: passwords.confirm && passwords.newPw !== passwords.confirm
                                            ? '#f87171'
                                            : '#e2d9f3'
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
                                    onBlur={e => e.currentTarget.style.borderColor = passwords.confirm && passwords.newPw !== passwords.confirm
                                        ? 'rgba(248,113,113,0.3)'
                                        : 'rgba(139,92,246,0.15)'
                                    }
                                />
                            </div>
                            {passwords.confirm && passwords.newPw !== passwords.confirm && (
                                <p className="text-xs mt-1" style={{ color: '#f87171' }}>Passwords do not match</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end mt-5">
                        <button
                            onClick={handlePwSave}
                            disabled={!passwords.current || !passwords.newPw || passwords.newPw !== passwords.confirm}
                            className={`flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                                pwSaved ? "text-white" : "text-white"
                            }`}
                            style={pwSaved
                                ? { background: 'linear-gradient(135deg, #34d399, #10b981)' }
                                : { background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }
                            }
                            onMouseEnter={e => { if (!pwSaved && !e.currentTarget.disabled) { e.currentTarget.style.boxShadow = '0 0 20px rgba(124,58,237,0.4)'; } }}
                            onMouseLeave={e => { if (!pwSaved) { e.currentTarget.style.boxShadow = '0 0 10px rgba(124,58,237,0.2)'; } }}
                        >
                            {pwSaved ? <><CheckCircle size={15} /> Updated</> : <><Key size={15} /> Update Password</>}
                        </button>
                    </div>
                </Panel>
            </div>
        </div>
    );
};
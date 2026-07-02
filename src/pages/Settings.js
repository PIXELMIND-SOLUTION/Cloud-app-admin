// pages/Settings.js - Light Theme with Saffron Accents
import React, { useState, useRef } from 'react';
import {
    User, Mail, Key, Eye, EyeOff, Save, Camera,
    CheckCircle, Lock, Cpu, Shield, Cog
} from 'lucide-react';

const Panel = ({ children, className = "" }) => (
    <div
        className={`rounded-2xl p-5 bg-white ${className}`}
        style={{
            border: '1px solid rgba(255,125,56,0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
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
        <div className="space-y-6 bg-gray-50 min-h-screen p-4 rounded-2xl">
            {/* Page header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-orange-200 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Settings</h1>
                    <p className="text-sm mt-0.5 text-gray-500">Manage your admin profile and password</p>
                </div>
                <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-orange-50 text-orange-500 border border-orange-200">
                    <Cog size={16} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* ── Profile card ── */}
                <Panel>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
                            <User size={16} className="text-white" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-800">Profile</h2>
                            <p className="text-xs text-gray-500">Name, email, and profile photo</p>
                        </div>
                    </div>

                    {/* Avatar */}
                    <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-orange-50 border border-orange-200">
                        <div className="relative shrink-0">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-xl font-bold shadow-md overflow-hidden">
                                {avatar
                                    ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                                    : form.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
                                }
                            </div>
                            <button
                                onClick={() => fileRef.current.click()}
                                className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-colors bg-white border border-orange-200 text-gray-400 hover:text-orange-500 hover:border-orange-400 shadow-sm"
                            >
                                <Camera size={11} />
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">{form.name || "Admin"}</p>
                            <p className="text-xs mt-0.5 text-gray-500">{form.email}</p>
                            <button
                                onClick={() => fileRef.current.click()}
                                className="text-xs font-medium mt-1.5 transition-colors text-orange-500 hover:text-orange-600"
                            >
                                Change photo
                            </button>
                        </div>
                    </div>

                    {/* Name & Email */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium mb-1.5 text-gray-600">Full Name</label>
                            <div className="relative">
                                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5 text-gray-600">Email Address</label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-5">
                        <button
                            onClick={handleProfileSave}
                            className={`flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl transition-all ${
                                profileSaved ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-orange-500/30"
                            } text-white shadow-sm`}
                        >
                            {profileSaved ? <><CheckCircle size={15} /> Saved</> : <><Save size={15} /> Save Changes</>}
                        </button>
                    </div>
                </Panel>

                {/* ── Password card ── */}
                <Panel>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
                            <Shield size={16} className="text-white" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-800">Change Password</h2>
                            <p className="text-xs text-gray-500">Update your account password</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium mb-1.5 text-gray-600">Current Password</label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showCurrent ? "text" : "password"}
                                    value={passwords.current}
                                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                                />
                                <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500">
                                    {showCurrent ? <EyeOff size={13} /> : <Eye size={13} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-1.5 text-gray-600">New Password</label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showNew ? "text" : "password"}
                                    value={passwords.newPw}
                                    onChange={e => setPasswords({ ...passwords, newPw: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                                />
                                <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500">
                                    {showNew ? <EyeOff size={13} /> : <Eye size={13} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-1.5 text-gray-600">Confirm New Password</label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                                    style={{
                                        borderColor: passwords.confirm && passwords.newPw !== passwords.confirm
                                            ? '#ef4444'
                                            : undefined,
                                        color: passwords.confirm && passwords.newPw !== passwords.confirm
                                            ? '#ef4444'
                                            : undefined
                                    }}
                                />
                            </div>
                            {passwords.confirm && passwords.newPw !== passwords.confirm && (
                                <p className="text-xs mt-1 text-red-500">Passwords do not match</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end mt-5">
                        <button
                            onClick={handlePwSave}
                            disabled={!passwords.current || !passwords.newPw || passwords.newPw !== passwords.confirm}
                            className={`flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                                pwSaved ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-orange-500/30"
                            } text-white shadow-sm`}
                        >
                            {pwSaved ? <><CheckCircle size={15} /> Updated</> : <><Key size={15} /> Update Password</>}
                        </button>
                    </div>
                </Panel>
            </div>
        </div>
    );
};
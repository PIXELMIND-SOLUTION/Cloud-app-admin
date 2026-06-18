// pages/Settings.js
import React, { useState, useRef } from 'react';
import {
    User, Mail, Key, Eye, EyeOff, Save, Camera,
    CheckCircle, Lock, Cpu, Shield,
    Cog
} from 'lucide-react';

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
                    <h1 className="text-xl font-bold text-slate-800">Settings</h1>
                    <p className="text-sm text-slate-400 mt-0.5">Manage your admin profile and password</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-white border border-slate-100 px-3 py-2 rounded-xl">
                    <Cog size={16} className="text-violet-400" />
                    
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* ── Profile card ── */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-sm">
                            <User size={16} className="text-white" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-slate-800">Profile</h2>
                            <p className="text-xs text-slate-400">Name, email, and profile photo</p>
                        </div>
                    </div>

                    {/* Avatar */}
                    <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 rounded-2xl">
                        <div className="relative shrink-0">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-sm overflow-hidden">
                                {avatar
                                    ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                                    : form.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
                                }
                            </div>
                            <button
                                onClick={() => fileRef.current.click()}
                                className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors"
                            >
                                <Camera size={11} className="text-slate-500" />
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">{form.name || "Admin"}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{form.email}</p>
                            <button
                                onClick={() => fileRef.current.click()}
                                className="text-xs text-violet-600 hover:text-violet-700 font-medium mt-1.5"
                            >
                                Change photo
                            </button>
                        </div>
                    </div>

                    {/* Name & Email */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">Full Name</label>
                            <div className="relative">
                                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full pl-9 pr-3.5 py-2.5 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="w-full pl-9 pr-3.5 py-2.5 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-5">
                        <button
                            onClick={handleProfileSave}
                            className={`flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl transition-all ${profileSaved ? "bg-emerald-500 text-white" : "bg-violet-600 hover:bg-violet-700 text-white"}`}
                        >
                            {profileSaved ? <><CheckCircle size={15} /> Saved</> : <><Save size={15} /> Save Changes</>}
                        </button>
                    </div>
                </div>

                {/* ── Password card ── */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center shadow-sm">
                            <Shield size={16} className="text-white" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-slate-800">Change Password</h2>
                            <p className="text-xs text-slate-400">Update your account password</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">Current Password</label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showCurrent ? "text" : "password"}
                                    value={passwords.current}
                                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-9 py-2.5 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
                                />
                                <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {showCurrent ? <EyeOff size={13} className="text-slate-400" /> : <Eye size={13} className="text-slate-400" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">New Password</label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showNew ? "text" : "password"}
                                    value={passwords.newPw}
                                    onChange={e => setPasswords({ ...passwords, newPw: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-9 py-2.5 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
                                />
                                <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {showNew ? <EyeOff size={13} className="text-slate-400" /> : <Eye size={13} className="text-slate-400" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">Confirm New Password</label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                    placeholder="••••••••"
                                    className={`w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all ${
                                        passwords.confirm && passwords.newPw !== passwords.confirm
                                            ? "border-rose-300 text-rose-600"
                                            : "border-slate-200 text-slate-700"
                                    }`}
                                />
                            </div>
                            {passwords.confirm && passwords.newPw !== passwords.confirm && (
                                <p className="text-xs text-rose-500 mt-1">Passwords do not match</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end mt-5">
                        <button
                            onClick={handlePwSave}
                            disabled={!passwords.current || !passwords.newPw || passwords.newPw !== passwords.confirm}
                            className={`flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed ${pwSaved ? "bg-emerald-500 text-white" : "bg-violet-600 hover:bg-violet-700 text-white"}`}
                        >
                            {pwSaved ? <><CheckCircle size={15} /> Updated</> : <><Key size={15} /> Update Password</>}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
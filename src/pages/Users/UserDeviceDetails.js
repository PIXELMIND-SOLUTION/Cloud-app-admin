// pages/UserDeviceDetail.js
import React, { useState } from 'react';
import {
    ArrowLeft, Smartphone, Tablet, Monitor, Watch,
    ShieldCheck, ShieldAlert, WifiOff, Battery,
    HardDrive, RefreshCw, Lock, Key, CheckCircle,
    XCircle, Clock, Package, Cpu, AlertCircle,
    ChevronDown, ChevronUp, Settings, MoreVertical,
    BarChart3, Globe
} from 'lucide-react';

// ── Helpers ──────────────────────────────────────────────────────────────────
function DeviceIcon({ type, size = 18 }) {
    const cls = "text-white";
    if (type === 'tablet')   return <Tablet size={size} className={cls} />;
    if (type === 'laptop')   return <Monitor size={size} className={cls} />;
    if (type === 'wearable') return <Watch size={size} className={cls} />;
    return <Smartphone size={size} className={cls} />;
}

function statusMeta(status) {
    if (status === 'compliant') return { bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500", text: "text-emerald-700", label: "Compliant" };
    if (status === 'warning')   return { bg: "bg-amber-50",   border: "border-amber-200",   dot: "bg-amber-500",   text: "text-amber-700",   label: "Warning" };
    return                             { bg: "bg-slate-50",   border: "border-slate-200",   dot: "bg-slate-400",   text: "text-slate-500",   label: "Offline" };
}

function MiniBar({ value, warn = 70 }) {
    const color = value >= warn ? "from-rose-400 to-rose-500" : value >= 40 ? "from-violet-400 to-purple-500" : "from-amber-400 to-orange-400";
    return (
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r ${color} transition-all`} style={{ width: `${value}%` }} />
        </div>
    );
}

function ConfigCheck({ ok, label }) {
    return (
        <div className="flex items-center gap-2">
            {ok
                ? <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                : <XCircle    size={14} className="text-rose-400 shrink-0" />
            }
            <span className={`text-xs ${ok ? "text-slate-600" : "text-rose-500 font-medium"}`}>{label}</span>
        </div>
    );
}

function DeviceCard({ device }) {
    const [open, setOpen] = useState(false);
    const meta = statusMeta(device.status);

    const typeGrad = {
        mobile:   "from-violet-500 to-purple-600",
        tablet:   "from-sky-500 to-blue-600",
        laptop:   "from-indigo-500 to-blue-700",
        wearable: "from-emerald-500 to-teal-600",
    }[device.type] || "from-slate-400 to-slate-500";

    return (
        <div className={`rounded-2xl border ${meta.border} ${meta.bg} overflow-hidden transition-all`}>
            {/* Card header */}
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${typeGrad} flex items-center justify-center shadow-sm shrink-0`}>
                            <DeviceIcon type={device.type} size={17} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">{device.name}</p>
                            <p className="text-xs text-slate-500">{device.model} · {device.os}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${meta.text} bg-white border ${meta.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                            {meta.label}
                        </span>
                        <button
                            onClick={() => setOpen(!open)}
                            className="w-7 h-7 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                            {open ? <ChevronUp size={13} className="text-slate-500" /> : <ChevronDown size={13} className="text-slate-500" />}
                        </button>
                    </div>
                </div>

                {/* Battery + Storage bars */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                            <span className="flex items-center gap-1"><Battery size={11} /> Battery</span>
                            <span className="font-semibold text-slate-700">{device.battery}%</span>
                        </div>
                        <MiniBar value={device.battery} warn={80} />
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                            <span className="flex items-center gap-1"><HardDrive size={11} /> Storage</span>
                            <span className="font-semibold text-slate-700">{device.storage}%</span>
                        </div>
                        <MiniBar value={device.storage} warn={80} />
                    </div>
                </div>
            </div>

            {/* Expandable config detail */}
            {open && (
                <div className="border-t border-slate-200 bg-white p-4 space-y-4">
                    {/* Meta row */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-50 rounded-xl p-3">
                            <p className="text-[10px] text-slate-400 mb-0.5">Device ID</p>
                            <p className="text-xs font-semibold text-slate-700 font-mono">{device.id}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                            <p className="text-[10px] text-slate-400 mb-0.5">Enrolled</p>
                            <p className="text-xs font-semibold text-slate-700">{device.enrolled}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                            <p className="text-[10px] text-slate-400 mb-0.5">Last Sync</p>
                            <p className="text-xs font-semibold text-slate-700">{device.lastSync}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* MDM Configuration */}
                        <div>
                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">MDM Configuration</p>
                            <div className="space-y-2">
                                <ConfigCheck ok={device.mdmProfile}  label="MDM Profile Installed" />
                                <ConfigCheck ok={device.encryption}  label="Disk Encryption" />
                                <ConfigCheck ok={device.passcode}    label="Passcode Enforced" />
                            </div>
                        </div>

                        {/* Apps */}
                        <div>
                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">App Management</p>
                            <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                                    <Package size={14} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-slate-800">{device.appCount}</p>
                                    <p className="text-[10px] text-slate-400">Managed apps</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                        <button className="flex-1 py-2 text-xs font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                            <RefreshCw size={12} /> Force Sync
                        </button>
                        <button className="flex-1 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                            <Lock size={12} /> Lock Device
                        </button>
                        <button className="flex-1 py-2 text-xs font-medium text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                            <AlertCircle size={12} /> Wipe
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Main export ───────────────────────────────────────────────────────────────
export const UserDeviceDetail = ({ user, onBack }) => {
    const active   = user.devices.filter(d => d.status === 'active').length;
    const warn      = user.devices.filter(d => d.status === 'warning').length;
    const offline   = user.devices.filter(d => d.status === 'offline').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                    <ArrowLeft size={15} /> Back
                </button>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-slate-800">Device Overview</h1>
                    <p className="text-sm text-slate-400 mt-0.5">All devices registered under this user</p>
                </div>
            </div>

            {/* User profile banner */}
            <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5`}>
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${user.avatarGrad} flex items-center justify-center text-white text-lg font-bold shadow-sm shrink-0`}>
                        {user.avatar}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-lg font-bold text-slate-800">{user.name}</h2>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${user.role === 'Sub Admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                                {user.role}
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-0.5">{user.email} · {user.region}</p>
                        <p className="text-xs text-slate-400 mt-1">Last seen: {user.lastSeen}</p>
                    </div>

                    {/* Device health summary */}
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="text-center px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl">
                            <p className="text-xl font-bold text-emerald-700">{active}</p>
                            <p className="text-[10px] text-emerald-600">Active</p>
                        </div>
                        {warn > 0 && (
                            <div className="text-center px-4 py-2 bg-amber-50 border border-amber-100 rounded-2xl">
                                <p className="text-xl font-bold text-amber-700">{warn}</p>
                                <p className="text-[10px] text-amber-600">Warning</p>
                            </div>
                        )}
                        {offline > 0 && (
                            <div className="text-center px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl">
                                <p className="text-xl font-bold text-slate-600">{offline}</p>
                                <p className="text-[10px] text-slate-400">Offline</p>
                            </div>
                        )}
                        <div className="text-center px-4 py-2 bg-violet-50 border border-violet-100 rounded-2xl">
                            <p className="text-xl font-bold text-violet-700">{user.totalDevices}</p>
                            <p className="text-[10px] text-violet-600">Total</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Device cards grid */}
            <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">
                    {user.totalDevices} Registered Device{user.totalDevices !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {user.devices.map(device => (
                        <DeviceCard key={device.id} device={device} />
                    ))}
                </div>
            </div>
        </div>
    );
};
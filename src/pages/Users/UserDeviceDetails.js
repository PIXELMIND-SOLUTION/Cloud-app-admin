// pages/UserDeviceDetail.js
import React, { useState } from 'react';
import {
    ArrowLeft, Smartphone, Tablet, Monitor, Watch,
    Battery, HardDrive, RefreshCw, Lock,
    CheckCircle, XCircle, Package, AlertCircle,
    ChevronDown, ChevronUp
} from 'lucide-react';

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function DeviceIcon({ type, size = 18 }) {
    if (type === 'tablet')   return <Tablet size={size} className="text-white" />;
    if (type === 'laptop')   return <Monitor size={size} className="text-white" />;
    if (type === 'wearable') return <Watch size={size} className="text-white" />;
    return <Smartphone size={size} className="text-white" />;
}

function statusMeta(status) {
    const map = {
        active:    { bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.2)',  dot: '#34d399', text: '#6ee7b7',  label: 'Active' },
        compliant: { bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.2)',  dot: '#34d399', text: '#6ee7b7',  label: 'Compliant' },
        warning:   { bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.2)',  dot: '#fbbf24', text: '#fcd34d',  label: 'Warning' },
        offline:   { bg: 'rgba(100,116,139,0.1)',  border: 'rgba(100,116,139,0.2)', dot: '#64748b', text: '#94a3b8',  label: 'Offline' },
    };
    return map[status] || map.offline;
}

function MiniBar({ value, warn = 70 }) {
    const color = value >= warn
        ? 'linear-gradient(90deg, #f87171, #ef4444)'
        : value >= 40
            ? 'linear-gradient(90deg, #8b5cf6, #a855f7)'
            : 'linear-gradient(90deg, #f59e0b, #f97316)';
    return (
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(139,92,246,0.12)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
        </div>
    );
}

function ConfigCheck({ ok, label }) {
    return (
        <div className="flex items-center gap-2">
            {ok
                ? <CheckCircle size={14} style={{ color: '#34d399', flexShrink: 0 }} />
                : <XCircle size={14} style={{ color: '#f87171', flexShrink: 0 }} />}
            <span className="text-xs" style={{ color: ok ? '#9c8fc0' : '#f87171', fontWeight: ok ? 400 : 500 }}>
                {label}
            </span>
        </div>
    );
}

/* ── Device card ─────────────────────────────────────────────────────────── */
function DeviceCard({ device }) {
    const [open, setOpen] = useState(false);
    const meta = statusMeta(device.status);

    const typeGrad = {
        mobile:   'linear-gradient(135deg, #7c3aed, #9333ea)',
        tablet:   'linear-gradient(135deg, #0ea5e9, #0284c7)',
        laptop:   'linear-gradient(135deg, #4f46e5, #1d4ed8)',
        wearable: 'linear-gradient(135deg, #059669, #0d9488)',
    }[device.type] || 'linear-gradient(135deg, #64748b, #475569)';

    return (
        <div className="rounded-2xl overflow-hidden transition-all"
            style={{
                background: meta.bg,
                border: `1px solid ${meta.border}`,
                backdropFilter: 'blur(12px)',
            }}>
            {/* Card header */}
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0"
                            style={{ background: typeGrad, boxShadow: '0 0 12px rgba(124,58,237,0.3)' }}>
                            <DeviceIcon type={device.type} size={17} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold" style={{ color: '#e2d9f3' }}>{device.name}</p>
                            <p className="text-xs" style={{ color: '#7c6fa0' }}>{device.model} · {device.os}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{
                                color: meta.text,
                                background: 'rgba(15,12,25,0.6)',
                                border: `1px solid ${meta.border}`,
                            }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.dot }} />
                            {meta.label}
                        </span>
                        <button onClick={() => setOpen(!open)}
                            className="w-7 h-7 flex items-center justify-center rounded-xl transition-colors"
                            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(139,92,246,0.1)'}>
                            {open
                                ? <ChevronUp size={13} style={{ color: '#a78bfa' }} />
                                : <ChevronDown size={13} style={{ color: '#a78bfa' }} />}
                        </button>
                    </div>
                </div>

                {/* Battery + Storage */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                    {[
                        { label: 'Battery', value: device.battery, icon: Battery },
                        { label: 'Storage', value: device.storage, icon: HardDrive },
                    ].map(bar => (
                        <div key={bar.label}>
                            <div className="flex justify-between text-xs mb-1.5" style={{ color: '#7c6fa0' }}>
                                <span className="flex items-center gap-1">
                                    <bar.icon size={11} /> {bar.label}
                                </span>
                                <span className="font-semibold" style={{ color: '#c4b5fd' }}>{bar.value}%</span>
                            </div>
                            <MiniBar value={bar.value} warn={80} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Expandable detail */}
            {open && (
                <div className="p-4 space-y-4" style={{ borderTop: `1px solid ${meta.border}`, background: 'rgba(10,8,20,0.6)' }}>
                    {/* Meta */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Device ID', value: device.id, mono: true },
                            { label: 'Enrolled', value: device.enrolled },
                            { label: 'Last Sync', value: device.lastSync },
                        ].map(item => (
                            <div key={item.label} className="rounded-xl p-3"
                                style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.12)' }}>
                                <p className="text-[10px] mb-0.5" style={{ color: '#5a4f72' }}>{item.label}</p>
                                <p className="text-xs font-semibold" style={{ color: '#c4b5fd', fontFamily: item.mono ? 'monospace' : undefined }}>{item.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* MDM config */}
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: '#5a4f72' }}>MDM Configuration</p>
                            <div className="space-y-2">
                                <ConfigCheck ok={device.mdmProfile} label="MDM Profile Installed" />
                                <ConfigCheck ok={device.encryption} label="Disk Encryption" />
                                <ConfigCheck ok={device.passcode} label="Passcode Enforced" />
                            </div>
                        </div>

                        {/* App management */}
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: '#5a4f72' }}>App Management</p>
                            <div className="rounded-xl p-3 flex items-center gap-3"
                                style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.12)' }}>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 0 10px rgba(124,58,237,0.3)' }}>
                                    <Package size={14} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold" style={{ color: '#e2d9f3' }}>{device.appCount}</p>
                                    <p className="text-[10px]" style={{ color: '#5a4f72' }}>Managed apps</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                        {[
                            { icon: RefreshCw, label: 'Force Sync', bg: 'rgba(124,58,237,0.15)', hov: 'rgba(124,58,237,0.25)', color: '#c4b5fd', border: 'rgba(139,92,246,0.25)' },
                            { icon: Lock, label: 'Lock Device', bg: 'rgba(100,116,139,0.12)', hov: 'rgba(100,116,139,0.2)', color: '#94a3b8', border: 'rgba(100,116,139,0.2)' },
                            { icon: AlertCircle, label: 'Wipe', bg: 'rgba(239,68,68,0.1)', hov: 'rgba(239,68,68,0.18)', color: '#f87171', border: 'rgba(239,68,68,0.2)' },
                        ].map(btn => (
                            <button key={btn.label}
                                className="flex-1 py-2 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all"
                                style={{ background: btn.bg, color: btn.color, border: `1px solid ${btn.border}` }}
                                onMouseEnter={e => e.currentTarget.style.background = btn.hov}
                                onMouseLeave={e => e.currentTarget.style.background = btn.bg}>
                                <btn.icon size={12} /> {btn.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Main export ─────────────────────────────────────────────────────────── */
export const UserDeviceDetail = ({ user, onBack }) => {
    const active  = user.devices.filter(d => d.status === 'active').length;
    const warn    = user.devices.filter(d => d.status === 'warning').length;
    const offline = user.devices.filter(d => d.status === 'offline').length;

    const summaryCards = [
        { val: active, label: 'Active', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)', color: '#6ee7b7' },
        ...(warn > 0 ? [{ val: warn, label: 'Warning', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', color: '#fcd34d' }] : []),
        ...(offline > 0 ? [{ val: offline, label: 'Offline', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.2)', color: '#94a3b8' }] : []),
        { val: user.totalDevices, label: 'Total', bg: 'rgba(124,58,237,0.1)', border: 'rgba(139,92,246,0.25)', color: '#c4b5fd' },
    ];

    const roleStyle = user.role === 'Sub Admin'
        ? { background: 'rgba(99,102,241,0.15)', color: '#a5b4fc' }
        : { background: 'rgba(100,116,139,0.12)', color: '#94a3b8' };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={onBack}
                    className="flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-xl transition-all"
                    style={{ color: '#9c8fc0', background: 'rgba(20,16,36,0.8)', border: '1px solid rgba(139,92,246,0.2)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#c4b5fd'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#9c8fc0'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)'; }}>
                    <ArrowLeft size={15} /> Back
                </button>
                <div className="flex-1">
                    <h1 className="text-xl font-bold" style={{ color: '#e2d9f3' }}>Device Overview</h1>
                    <p className="text-sm mt-0.5" style={{ color: '#5a4f72' }}>All devices registered under this user</p>
                </div>
            </div>

            {/* User profile banner */}
            <div className="rounded-2xl p-5"
                style={{ background: 'rgba(20,16,36,0.8)', border: '1px solid rgba(139,92,246,0.15)', backdropFilter: 'blur(12px)' }}>
                <div className="flex items-center gap-4 flex-wrap">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${user.avatarGrad} flex items-center justify-center text-white text-lg font-bold shrink-0`}
                        style={{ boxShadow: '0 0 20px rgba(124,58,237,0.3)' }}>
                        {user.avatar}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-lg font-bold" style={{ color: '#e2d9f3' }}>{user.name}</h2>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={roleStyle}>
                                {user.role}
                            </span>
                        </div>
                        <p className="text-sm mt-0.5" style={{ color: '#7c6fa0' }}>{user.email} · {user.region}</p>
                        <p className="text-xs mt-1" style={{ color: '#5a4f72' }}>Last seen: {user.lastSeen}</p>
                    </div>

                    {/* Device health summary */}
                    <div className="hidden sm:flex items-center gap-3">
                        {summaryCards.map(card => (
                            <div key={card.label} className="text-center px-4 py-2 rounded-2xl"
                                style={{ background: card.bg, border: `1px solid ${card.border}` }}>
                                <p className="text-xl font-bold" style={{ color: card.color }}>{card.val}</p>
                                <p className="text-[10px]" style={{ color: card.color, opacity: 0.7 }}>{card.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Device cards */}
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3 px-1" style={{ color: '#5a4f72' }}>
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
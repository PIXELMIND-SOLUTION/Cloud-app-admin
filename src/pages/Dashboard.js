// pages/Dashboard.js - Optimized & Responsive with Saffron Theme
import React, { useState, useMemo } from 'react';
import {
    TrendingUp, TrendingDown, AlertCircle, Activity, Cpu,
    Smartphone, Users, ShieldCheck, Grid, RefreshCw,
    UserCog, UserPlus, BarChart3, Eye,
    ChevronDown, ChevronUp, MoreVertical, Download, Filter,
    Clock, CheckCircle, XCircle, Zap, Award, Target,
    FileText, Bell, CreditCard
} from 'lucide-react';

// ── Updated Data Structure ──────────────────────────────────────────────────
const STATS = [
    { label: "Total Users", value: "1,284", change: "+12%", up: true, icon: Users, grad: "from-orange-500 to-amber-600" },
    { label: "Total Devices", value: "3,608", change: "+18%", up: true, icon: UserPlus, grad: "from-orange-400 to-amber-500" },
    { label: "Total Plans", value: "24", change: "+4", up: true, icon: CreditCard, grad: "from-amber-500 to-yellow-600" },
    { label: "Total Staff", value: "156", change: "+8", up: true, icon: Bell, grad: "from-orange-600 to-amber-700" },
    { label: "Total Reports", value: "89", change: "+12", up: true, icon: FileText, grad: "from-amber-400 to-orange-500" },
    { label: "Total Notifications", value: "89", change: "+12", up: true, icon: FileText, grad: "from-orange-500 to-amber-600" },
];

// Recent Users Data
const RECENT_USERS = [
    { name: "Dr. Ananya Sharma", role: "Super Admin", dept: "Corporate IT", status: "active", time: "2m ago", avatar: "AS" },
    { name: "Rajesh Kumar", role: "Sub Admin", dept: "Delhi Region", status: "active", time: "15m ago", avatar: "RK" },
    { name: "Priya Mehta", role: "User", dept: "Sales", status: "active", time: "32m ago", avatar: "PM" },
    { name: "Arjun Singh", role: "Super Admin", dept: "Security", status: "inactive", time: "1h ago", avatar: "AS" },
    { name: "Neha Gupta", role: "User", dept: "HR", status: "active", time: "2h ago", avatar: "NG" },
    { name: "Vikram Patel", role: "Sub Admin", dept: "Mumbai Region", status: "active", time: "3h ago", avatar: "VP" },
];

// Recent Devices Data
const RECENT_DEVICES = [
    { name: "iPhone 14 Pro – Raj Mehta", type: "Super User", status: "active", lastSeen: "2m ago", battery: 82, storage: 61 },
    { name: "Galaxy S23 Ultra – Priya Nair", type: "Sub User", status: "active", lastSeen: "15m ago", battery: 47, storage: 78 },
    { name: "Surface Pro 9 – Admin 1", type: "Super User", status: "inactive", lastSeen: "1h ago", battery: 76, storage: 45 },
    { name: "Pixel 7 Pro – Arjun Das", type: "Sub User", status: "active", lastSeen: "32m ago", battery: 91, storage: 34 },
    { name: "iPad Pro – Ananya Roy", type: "Sub User", status: "inactive", lastSeen: "2h ago", battery: 12, storage: 55 },
];

// Recent Reports Data
const RECENT_REPORTS = [
    { title: "Monthly User Activity Report", type: "Analytics", date: "2024-01-15", status: "completed"},
    { title: "Security Compliance Report", type: "Security", date: "2024-01-14", status: "pending" },
    { title: "Device Enrollment Summary", type: "Device", date: "2024-01-13", status: "completed" },
    { title: "User Growth Analytics", type: "Analytics", date: "2024-01-12", status: "processing" },
    { title: "Subscription Status Report", type: "Billing", date: "2024-01-11", status: "completed" },
];

// ── Reusable Components ──────────────────────────────────────────────────────

const Panel = ({ children, className = "", onClick }) => (
    <div
        className={`rounded-2xl p-4 sm:p-5 transition-all ${className}`}
        style={{
            background: 'linear-gradient(135deg, rgba(255,125,56,0.12), rgba(255,107,26,0.08))',
            border: '1px solid rgba(255,125,56,0.25)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(255,125,56,0.1)',
        }}
        onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(255,125,56,0.5)';
            e.currentTarget.style.boxShadow = '0 4px 30px rgba(255,125,56,0.2)';
            e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,125,56,0.25)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,125,56,0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
        }}
        onClick={onClick}
    >
        {children}
    </div>
);

const StatusBadge = ({ status }) => {
    const map = {
        active: { bg: 'rgba(255,125,56,0.2)', color: '#FF7D38', border: 'rgba(255,125,56,0.3)', icon: CheckCircle },
        inactive: { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8', border: 'rgba(100,116,139,0.25)', icon: XCircle },
        pending: { bg: 'rgba(251,191,36,0.2)', color: '#fbbf24', border: 'rgba(251,191,36,0.3)', icon: AlertCircle },
        processing: { bg: 'rgba(56,189,248,0.15)', color: '#7dd3fc', border: 'rgba(56,189,248,0.25)', icon: Activity },
        completed: { bg: 'rgba(52,211,153,0.15)', color: '#6ee7b7', border: 'rgba(52,211,153,0.25)', icon: CheckCircle },
    };
    const s = map[status] || map.inactive;
    const Icon = s.icon;
    return (
        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
            style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
            <Icon size={10} /> {status}
        </span>
    );
};

const UserStatusBadge = ({ status }) => {
    const active = status === 'active';
    return (
        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
            style={active
                ? { background: 'rgba(255,125,56,0.2)', color: '#FF7D38' }
                : { background: 'rgba(100,116,139,0.12)', color: '#94a3b8' }
            }>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`} />
            {status}
        </span>
    );
};

const StatCard = ({ stat }) => (
    <Panel className="p-4 hover:scale-[1.02] transition-transform cursor-pointer">
        <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs font-medium truncate" style={{ color: '#FF9A5F' }}>{stat.label}</p>
                <p className="text-lg sm:text-xl font-bold mt-1 truncate" style={{ color: '#FF7D38' }}>{stat.value}</p>
                <div className="flex items-center gap-1 text-[10px] font-semibold mt-0.5"
                    style={{ color: stat.up ? '#FF7D38' : '#f87171' }}>
                    {stat.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {stat.change} this month
                </div>
            </div>
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br ${stat.grad} flex items-center justify-center shrink-0`}
                style={{ boxShadow: '0 0 15px rgba(255,125,56,0.4)' }}>
                <stat.icon size={14} className="text-white" />
            </div>
        </div>
    </Panel>
);

// ── Donut Chart ─────────────────────────────────────────────────────────────

const DonutChart = ({ data, title, subtitle, size = 140 }) => {
    const R = size * 0.37, CX = size / 2, CY = size / 2, STROKE = size * 0.16;
    const circ = 2 * Math.PI * R;
    let offset = 0;

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="max-w-full">
                <circle cx={CX} cy={CY} r={R} fill="none"
                    stroke="rgba(255,125,56,0.15)" strokeWidth={STROKE} />
                {data.map((s, i) => {
                    const dash = (s.pct / 100) * circ;
                    const el = (
                        <circle key={i} cx={CX} cy={CY} r={R} fill="none"
                            stroke={s.color} strokeWidth={STROKE}
                            strokeDasharray={`${dash} ${circ - dash}`}
                            strokeDashoffset={-offset} strokeLinecap="butt"
                            style={{ transform: "rotate(-90deg)", transformOrigin: `${CX}px ${CY}px` }} />
                    );
                    offset += dash;
                    return el;
                })}
                <text x={CX} y={CY - 4} textAnchor="middle" fontSize={size * 0.09} fontWeight={700} fill="#FF7D38">{title}</text>
                <text x={CX} y={CY + 10} textAnchor="middle" fontSize={size * 0.07} fill="#FF9A5F">{subtitle}</text>
            </svg>
            <div className="flex flex-col gap-1.5 w-full max-w-[180px]">
                {data.map(s => (
                    <div key={s.label} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                        <span className="text-xs flex-1 truncate" style={{ color: '#FF9A5F' }}>{s.label}</span>
                        <span className="text-xs font-semibold" style={{ color: '#FF7D38' }}>{s.pct}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── User Row ────────────────────────────────────────────────────────────────

const UserRow = ({ user }) => {
    const roleStyle = {
        'Super Admin': { background: 'rgba(255,125,56,0.2)', color: '#FF7D38' },
        'Sub Admin': { background: 'rgba(56,189,248,0.12)', color: '#7dd3fc' },
        'User': { background: 'rgba(100,116,139,0.12)', color: '#94a3b8' }
    }[user.role] || { background: 'rgba(100,116,139,0.12)', color: '#94a3b8' };

    const avatarGrad = {
        'Super Admin': 'linear-gradient(135deg,#FF7D38,#FF6B1A)',
        'Sub Admin': 'linear-gradient(135deg,#0ea5e9,#06b6d4)',
        'User': 'linear-gradient(135deg,#64748b,#475569)'
    }[user.role] || 'linear-gradient(135deg,#64748b,#475569)';

    return (
        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer"
            style={{ border: '1px solid transparent' }}
            onMouseEnter={e => { 
                e.currentTarget.style.background = 'rgba(255,125,56,0.12)'; 
                e.currentTarget.style.borderColor = 'rgba(255,125,56,0.25)'; 
            }}
            onMouseLeave={e => { 
                e.currentTarget.style.background = 'transparent'; 
                e.currentTarget.style.borderColor = 'transparent'; 
            }}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-semibold text-xs text-white shrink-0"
                style={{ background: avatarGrad }}>
                {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    <p className="text-xs sm:text-sm font-medium truncate" style={{ color: '#FF7D38' }}>{user.name}</p>
                    <span className="text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap" style={roleStyle}>
                        {user.role}
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[10px] sm:text-xs" style={{ color: '#FF9A5F' }}>
                   
                    <span className="flex items-center gap-1">
                        <Clock size={10} /> {user.time}
                    </span>
                </div>
            </div>
            <UserStatusBadge status={user.status} />
            <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#FF7D38' }}>
                <MoreVertical size={13} />
            </button>
        </div>
    );
};

// ── Device Row ──────────────────────────────────────────────────────────────

const DeviceRow = ({ device }) => (
    <div className="space-y-2 p-3 rounded-xl transition-all hover:bg-orange-500/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm font-medium" style={{ color: '#FF7D38' }}>{device.name}</span>
                <span className="text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={device.type === 'Super Admin'
                        ? { background: 'rgba(255,125,56,0.2)', color: '#FF7D38', border: '1px solid rgba(255,125,56,0.3)' }
                        : { background: 'rgba(56,189,248,0.1)', color: '#7dd3fc', border: '1px solid rgba(56,189,248,0.2)' }
                    }>
                    {device.type}
                </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] sm:text-xs" style={{ color: '#FF9A5F' }}>{device.lastSeen}</span>
                <StatusBadge status={device.status} />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
            {[
                { label: 'Battery', value: device.battery },
                { label: 'Storage', value: device.storage },
            ].map(bar => (
                <div key={bar.label}>
                    <div className="flex justify-between text-[10px] sm:text-xs mb-0.5" style={{ color: '#FF9A5F' }}>
                        <span>{bar.label}</span>
                        <span className="font-medium">{bar.value}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,125,56,0.15)' }}>
                        <div className="h-full rounded-full transition-all duration-500" 
                            style={{ 
                                width: `${bar.value}%`, 
                                background: bar.value >= 75 
                                    ? 'linear-gradient(90deg, #f87171, #ef4444)' 
                                    : 'linear-gradient(90deg, #FF7D38, #FF6B1A)'
                            }} />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// ── Report Row ──────────────────────────────────────────────────────────────

const ReportRow = ({ report }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer"
        style={{ border: '1px solid transparent' }}
        onMouseEnter={e => { 
            e.currentTarget.style.background = 'rgba(255,125,56,0.12)'; 
            e.currentTarget.style.borderColor = 'rgba(255,125,56,0.25)'; 
        }}
        onMouseLeave={e => { 
            e.currentTarget.style.background = 'transparent'; 
            e.currentTarget.style.borderColor = 'transparent'; 
        }}>
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,125,56,0.15)' }}>
            <FileText size={14} style={{ color: '#FF7D38' }} />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <p className="text-xs sm:text-sm font-medium truncate" style={{ color: '#FF7D38' }}>{report.title}</p>
                <span className="text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap"
                    style={{ background: 'rgba(56,189,248,0.12)', color: '#7dd3fc' }}>
                    {report.type}
                </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs" style={{ color: '#FF9A5F' }}>
                <span>{report.date}</span>
                <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(255,125,56,0.3)' }} />
            </div>
        </div>
        <StatusBadge status={report.status} />
        <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#FF7D38' }}>
            <MoreVertical size={13} />
        </button>
    </div>
);

// ── Main Component ──────────────────────────────────────────────────────────

export const Dashboard = () => {
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    };

    // User Distribution Data
    const userDistribution = [
        { label: "Super Admin", pct: 8, color: "#FF7D38" },
        { label: "Sub Admin", pct: 22, color: "#fbbf24" },
        { label: "Standard Users", pct: 70, color: "#f59e0b" },
    ];

    // Device Status Distribution
    const deviceStatus = [
        { label: "Active", pct: 72, color: "#FF7D38" },
        { label: "Inactive", pct: 18, color: "#fbbf24" },
        { label: "Pending", pct: 10, color: "#f59e0b" },
    ];

    return (
        <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-lg sm:text-xl font-bold" style={{ color: '#FF7D38' }}>Dashboard</h1>
                    <p className="text-xs sm:text-sm mt-0.5" style={{ color: '#FF9A5F' }}>Overview of users, devices, and system analytics</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <button 
                        onClick={handleRefresh}
                        className={`flex items-center gap-1 sm:gap-2 text-xs font-medium text-white px-3 sm:px-4 py-2 rounded-xl transition-all ${refreshing ? 'opacity-70' : ''}`}
                        style={{ background: 'linear-gradient(135deg, #FF7D38, #FF6B1A)', boxShadow: '0 0 16px rgba(255,125,56,0.3)' }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 24px rgba(255,125,56,0.5)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 16px rgba(255,125,56,0.3)'}
                        disabled={refreshing}>
                        <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} /> 
                        <span className="hidden xs:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                    </button>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3">
                {STATS.map((s, i) => <StatCard key={i} stat={s} />)}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                <Panel className="lg:col-span-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h3 className="font-semibold text-sm sm:text-base" style={{ color: '#FF7D38' }}>User Growth Analytics</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#FF9A5F' }}>Monthly user registration trends</p>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {[["Total Users", "#FF7D38"], ["Sub Users", "#fbbf24"], ["Super Admin", "#f59e0b"]].map(([l, c]) => (
                                <div key={l} className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full" style={{ background: c }} />
                                    <span className="text-[10px] sm:text-xs whitespace-nowrap" style={{ color: '#FF9A5F' }}>{l}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <svg viewBox="0 0 800 120" className="w-full">
                            {/* Simple bar chart representation */}
                            {[65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88, 92].map((val, i) => {
                                const colors = ['#FF7D38', '#fbbf24', '#f59e0b', '#f97316'];
                                return (
                                    <rect 
                                        key={i}
                                        x={15 + i * 65}
                                        y={20 + (100 - val)}
                                        width={40}
                                        height={val}
                                        rx={3}
                                        fill={colors[i % colors.length]}
                                        opacity={0.85}
                                        className="transition-all hover:opacity-100"
                                    />
                                );
                            })}
                            {/* Month labels */}
                            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, i) => (
                                <text 
                                    key={i}
                                    x={35 + i * 65}
                                    y={130}
                                    textAnchor="middle"
                                    fontSize={9}
                                    fill="#FF9A5F"
                                >
                                    {month}
                                </text>
                            ))}
                        </svg>
                    </div>
                </Panel>
            </div>

            {/* Device Status Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Panel>
                    <div className="flex items-center justify-center">
                        <div className="w-full max-w-[200px]">
                            <h3 className="font-semibold text-center mb-4 text-sm sm:text-base" style={{ color: '#FF7D38' }}>User Distribution</h3>
                            <DonutChart data={userDistribution} title="Users" subtitle="Distribution" size={150} />
                        </div>
                    </div>
                </Panel>

                <Panel>
                    <div className="flex items-center justify-center">
                        <div className="w-full max-w-[200px]">
                            <h3 className="font-semibold text-center mb-4 text-sm sm:text-base" style={{ color: '#FF7D38' }}>Device Status</h3>
                            <DonutChart data={deviceStatus} title="Devices" subtitle="Status" size={150} />
                        </div>
                    </div>
                </Panel>
            </div>

            {/* Recent Users */}
            <Panel>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                        <h3 className="font-semibold text-sm sm:text-base" style={{ color: '#FF7D38' }}>Recent Users</h3>
                        <p className="text-xs mt-0.5" style={{ color: '#FF9A5F' }}>Latest user registrations and activity</p>
                    </div>
                    <button className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                        style={{ color: '#FF7D38', background: 'rgba(255,125,56,0.15)', border: '1px solid rgba(255,125,56,0.3)' }}
                        onMouseEnter={e => { 
                            e.currentTarget.style.background = 'rgba(255,125,56,0.25)';
                            e.currentTarget.style.borderColor = 'rgba(255,125,56,0.5)';
                        }}
                        onMouseLeave={e => { 
                            e.currentTarget.style.background = 'rgba(255,125,56,0.15)';
                            e.currentTarget.style.borderColor = 'rgba(255,125,56,0.3)';
                        }}>
                        View All
                    </button>
                </div>
                <div className="divide-y divide-orange-500/10">
                    {RECENT_USERS.map((user, i) => <UserRow key={i} user={user} />)}
                </div>
            </Panel>

            {/* Recent Devices & Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Panel>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h3 className="font-semibold text-sm sm:text-base" style={{ color: '#FF7D38' }}>Recent Devices</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#FF9A5F' }}>Latest device activity</p>
                        </div>
                        <button className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                            style={{ color: '#FF7D38', background: 'rgba(255,125,56,0.15)', border: '1px solid rgba(255,125,56,0.3)' }}
                            onMouseEnter={e => { 
                                e.currentTarget.style.background = 'rgba(255,125,56,0.25)';
                                e.currentTarget.style.borderColor = 'rgba(255,125,56,0.5)';
                            }}
                            onMouseLeave={e => { 
                                e.currentTarget.style.background = 'rgba(255,125,56,0.15)';
                                e.currentTarget.style.borderColor = 'rgba(255,125,56,0.3)';
                            }}>
                            View All
                        </button>
                    </div>
                    <div className="divide-y divide-orange-500/10">
                        {RECENT_DEVICES.map((device, i) => <DeviceRow key={i} device={device} />)}
                    </div>
                </Panel>

                <Panel>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h3 className="font-semibold text-sm sm:text-base" style={{ color: '#FF7D38' }}>Recent Reports</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#FF9A5F' }}>Latest generated reports</p>
                        </div>
                        <button className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                            style={{ color: '#FF7D38', background: 'rgba(255,125,56,0.15)', border: '1px solid rgba(255,125,56,0.3)' }}
                            onMouseEnter={e => { 
                                e.currentTarget.style.background = 'rgba(255,125,56,0.25)';
                                e.currentTarget.style.borderColor = 'rgba(255,125,56,0.5)';
                            }}
                            onMouseLeave={e => { 
                                e.currentTarget.style.background = 'rgba(255,125,56,0.15)';
                                e.currentTarget.style.borderColor = 'rgba(255,125,56,0.3)';
                            }}>
                            View All
                        </button>
                    </div>
                    <div className="divide-y divide-orange-500/10">
                        {RECENT_REPORTS.map((report, i) => <ReportRow key={i} report={report} />)}
                    </div>
                </Panel>
            </div>

            {/* Status Footer */}
            <div className="rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-2"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,125,56,0.12), rgba(255,107,26,0.08))',
                    border: '1px solid rgba(255,125,56,0.25)',
                    boxShadow: '0 4px 20px rgba(255,125,56,0.1)',
                }}
            >
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] sm:text-xs" style={{ color: '#FF9A5F' }}>
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        System Online
                    </span>
                    <span className="hidden xs:inline w-px h-4" style={{ background: 'rgba(255,125,56,0.3)' }} />
                    <span className="hidden xs:inline">Last updated: {new Date().toLocaleString()}</span>
                    <span className="flex items-center gap-1">
                        <Award size={12} style={{ color: '#FF7D38' }} />
                        {STATS.reduce((acc, s) => acc + parseInt(s.value.replace(/,/g, '')), 0).toLocaleString()} total assets
                    </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] sm:text-xs" style={{ color: '#FF9A5F' }}>
                    <span>v3.2.1</span>
                    <span className="hidden xs:inline w-px h-4" style={{ background: 'rgba(255,125,56,0.3)' }} />
                    <span className="hidden xs:inline">100% uptime</span>
                </div>
            </div>
        </div>
    );
};
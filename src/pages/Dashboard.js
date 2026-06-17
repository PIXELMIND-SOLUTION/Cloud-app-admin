// pages/Dashboard.js
import React, { useState } from 'react';
import {
    TrendingUp, TrendingDown, AlertCircle, Zap, Activity, Cpu,
    Smartphone, Users, ShieldCheck, Grid, ShieldAlert, RefreshCw,
    UserCog, UserPlus, Clock, BarChart3, PieChart, Eye,
    ChevronDown, ChevronUp, MoreVertical, Download, Filter
} from 'lucide-react';

// Enhanced STATS with super admin and sub-device data
const STATS = [
    { label: "Total Devices", value: "4,892", change: "+12%", up: true, icon: Smartphone, gradient: "from-violet-400 to-purple-500", bg: "from-violet-50 to-purple-50", border: "border-violet-100" },
    { label: "Super Admin Devices", value: "247", change: "+5%", up: true, icon: UserCog, gradient: "from-indigo-400 to-blue-600", bg: "from-indigo-50 to-blue-50", border: "border-indigo-100" },
    { label: "Sub-Devices", value: "4,645", change: "+13%", up: true, icon: Users, gradient: "from-sky-400 to-blue-500", bg: "from-sky-50 to-blue-50", border: "border-sky-100" },
    { label: "Active Users", value: "3,428", change: "+8%", up: true, icon: Users, gradient: "from-emerald-400 to-teal-500", bg: "from-emerald-50 to-teal-50", border: "border-emerald-100" },
    { label: "Compliance Rate", value: "93.7%", change: "+2.3%", up: true, icon: ShieldCheck, gradient: "from-green-400 to-emerald-500", bg: "from-green-50 to-emerald-50", border: "border-green-100" },
    { label: "Apps Deployed", value: "156", change: "+18%", up: true, icon: Grid, gradient: "from-rose-400 to-pink-500", bg: "from-rose-50 to-pink-50", border: "border-rose-100" },
];

// Enhanced recent events with more types
const RECENT_EVENTS = [
    { type: "alert", msg: "Jailbreak detected on iPhone 13 – Kiran B.", time: "3m ago", color: "text-rose-500 bg-rose-50" },
    { type: "admin", msg: "New super admin added: Priya Sharma (Corporate)", time: "12m ago", color: "text-indigo-500 bg-indigo-50" },
    { type: "info", msg: "New device enrollment request from Meena P.", time: "18m ago", color: "text-sky-500 bg-sky-50" },
    { type: "success", msg: "OS update pushed to 142 Android devices", time: "1h ago", color: "text-emerald-500 bg-emerald-50" },
    { type: "alert", msg: "Password policy non-compliance – 7 devices", time: "2h ago", color: "text-amber-500 bg-amber-50" },
    { type: "sub", msg: "Sub-device registration: 5 new devices in Delhi region", time: "3h ago", color: "text-blue-500 bg-blue-50" },
    { type: "info", msg: "Slack v24.1 deployed to all iOS fleet", time: "4h ago", color: "text-sky-500 bg-sky-50" },
    { type: "success", msg: "Security patch applied to 89 super admin devices", time: "5h ago", color: "text-emerald-500 bg-emerald-50" },
];

// Enhanced device list with super admin and sub-device indicators
const DEVICES = [
    { name: "iPhone 14 – Raj Mehta", dept: "Sales", battery: 82, storage: 61, status: "compliant", type: "sub" },
    { name: "Galaxy S23 – Priya Nair", dept: "Support", battery: 47, storage: 78, status: "warning", type: "sub" },
    { name: "Surface Pro – Admin 1", dept: "IT Admin", battery: 76, storage: 45, status: "compliant", type: "super" },
    { name: "Pixel 7 – Arjun Das", dept: "Engineering", battery: 91, storage: 34, status: "compliant", type: "sub" },
    { name: "Surface Pro 9 – Ananya Roy", dept: "HR", battery: 12, storage: 55, status: "offline", type: "sub" },
    { name: "iPad Pro – Vikram Singh", dept: "Field Ops", battery: 74, storage: 48, status: "compliant", type: "sub" },
    { name: "ThinkPad – Admin 2", dept: "Security", battery: 88, storage: 32, status: "compliant", type: "super" },
    { name: "iPhone 15 – Meera Patel", dept: "Marketing", battery: 95, storage: 28, status: "compliant", type: "sub" },
];

// Recent users data
const RECENT_USERS = [
    { name: "Dr. Ananya Sharma", role: "Super Admin", dept: "Corporate IT", status: "active", time: "2m ago", avatar: "AS" },
    { name: "Rajesh Kumar", role: "Sub Admin", dept: "Delhi Region", status: "active", time: "15m ago", avatar: "RK" },
    { name: "Priya Mehta", role: "User", dept: "Sales", status: "active", time: "32m ago", avatar: "PM" },
    { name: "Arjun Singh", role: "Super Admin", dept: "Security", status: "inactive", time: "1h ago", avatar: "AS" },
    { name: "Neha Gupta", role: "User", dept: "HR", status: "active", time: "2h ago", avatar: "NG" },
    { name: "Vikram Patel", role: "Sub Admin", dept: "Mumbai Region", status: "active", time: "3h ago", avatar: "VP" },
    { name: "Sneha Reddy", role: "User", dept: "Engineering", status: "inactive", time: "4h ago", avatar: "SR" },
    { name: "Amit Desai", role: "Super Admin", dept: "Operations", status: "active", time: "5h ago", avatar: "AD" },
];

function StatusBadge({ status }) {
    const map = {
        compliant: "bg-emerald-100 text-emerald-700",
        warning: "bg-amber-100 text-amber-700",
        offline: "bg-slate-100 text-slate-500",
    };
    return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] || map.compliant}`}>
            {status}
        </span>
    );
}

function DeviceTypeBadge({ type }) {
    return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            type === 'super' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-50 text-blue-600'
        }`}>
            {type === 'super' ? 'Super Admin' : 'Sub-Device'}
        </span>
    );
}

function UsageBar({ value, warn = 75 }) {
    const color = value >= warn ? "from-rose-400 to-rose-500" : "from-violet-400 to-purple-500";
    return (
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full bg-gradient-to-r ${color} transition-all`}
                style={{ width: `${value}%` }}
            />
        </div>
    );
}

function UserStatusBadge({ status }) {
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${
            status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
        }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            {status}
        </span>
    );
}

function MiniBarChart({ height = 100 }) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = [
        [60, 30, 80, 70],
        [45, 55, 40, 60],
        [70, 25, 90, 50],
        [55, 65, 50, 75],
        [80, 40, 70, 85],
        [65, 50, 85, 55],
        [75, 35, 60, 90],
        [50, 60, 75, 45],
        [85, 45, 65, 70],
        [60, 75, 50, 80],
        [90, 55, 80, 65],
        [70, 65, 55, 85],
    ];
    const colors = ["#8b5cf6", "#38bdf8", "#f472b6", "#34d399"];
    const BAR_W = 6, GAP = 2, GROUP_GAP = 12, H = height, TOP = 5;

    return (
        <svg viewBox={`0 0 ${months.length * (4 * BAR_W + 3 * GAP + GROUP_GAP)} ${H + 20}`} className="w-full">
            {months.map((m, gi) => {
                const gx = gi * (4 * BAR_W + 3 * GAP + GROUP_GAP);
                return (
                    <g key={m}>
                        {data[gi].map((v, bi) => {
                            const bh = (v / 100) * H;
                            return (
                                <rect
                                    key={bi}
                                    x={gx + bi * (BAR_W + GAP)}
                                    y={TOP + H - bh}
                                    width={BAR_W}
                                    height={bh}
                                    rx={1.5}
                                    fill={colors[bi % colors.length]}
                                    opacity={0.8}
                                />
                            );
                        })}
                        <text
                            x={gx + (4 * BAR_W + 3 * GAP) / 2}
                            y={TOP + H + 14}
                            textAnchor="middle"
                            fontSize={7}
                            fill="#94a3b8"
                        >
                            {m}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

function DonutChart({ data, title, subtitle, size = 140 }) {
    const R = size * 0.37, CX = size/2, CY = size/2, STROKE = size * 0.16;
    const circ = 2 * Math.PI * R;
    let offset = 0;

    return (
        <div className="flex flex-col items-center gap-4">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle cx={CX} cy={CY} r={R} fill="none" stroke="#f1f5f9" strokeWidth={STROKE} />
                {data.map((s, i) => {
                    const dash = (s.pct / 100) * circ;
                    const gap = circ - dash;
                    const el = (
                        <circle
                            key={i}
                            cx={CX} cy={CY} r={R}
                            fill="none"
                            stroke={s.color}
                            strokeWidth={STROKE}
                            strokeDasharray={`${dash} ${gap}`}
                            strokeDashoffset={-offset}
                            strokeLinecap="butt"
                            style={{ transform: "rotate(-90deg)", transformOrigin: `${CX}px ${CY}px` }}
                        />
                    );
                    offset += dash;
                    return el;
                })}
                <text x={CX} y={CY - 4} textAnchor="middle" fontSize={size * 0.09} fontWeight={700} fill="#1e293b">{title}</text>
                <text x={CX} y={CY + 10} textAnchor="middle" fontSize={size * 0.07} fill="#94a3b8">{subtitle}</text>
            </svg>
            <div className="flex flex-col gap-1.5 w-full">
                {data.map(s => (
                    <div key={s.label} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                        <span className="text-xs text-slate-600 flex-1">{s.label}</span>
                        <span className="text-xs font-semibold text-slate-800">{s.pct}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Analytics section with advanced metrics
function AnalyticsSection() {
    const osData = [
        { label: "iOS", pct: 42, color: "#8b5cf6" },
        { label: "Android", pct: 35, color: "#38bdf8" },
        { label: "Windows", pct: 18, color: "#34d399" },
        { label: "Other", pct: 5, color: "#f472b6" },
    ];

    const adminData = [
        { label: "Super Admin", pct: 5, color: "#6366f1" },
        { label: "Sub-Admin", pct: 15, color: "#8b5cf6" },
        { label: "Standard", pct: 80, color: "#38bdf8" },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-semibold text-slate-800">Device Analytics</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Monthly device enrollments by type</p>
                    </div>
                    <div className="flex gap-3">
                        {[["Super Admin", "#6366f1"], ["Sub-Devices", "#38bdf8"], ["Standard", "#f472b6"]].map(([l, c]) => (
                            <div key={l} className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full" style={{ background: c }} />
                                <span className="text-xs text-slate-500">{l}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <MiniBarChart height={120} />
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
                    <div>
                        <p className="text-xs text-slate-500">Avg. Enrollment</p>
                        <p className="text-lg font-bold text-slate-800">347</p>
                        <p className="text-xs text-emerald-600">↑ 12% monthly</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">Peak Month</p>
                        <p className="text-lg font-bold text-slate-800">Oct</p>
                        <p className="text-xs text-slate-500">412 devices</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">Growth Rate</p>
                        <p className="text-lg font-bold text-slate-800">+18.4%</p>
                        <p className="text-xs text-emerald-600">↑ YoY</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-semibold text-slate-800 mb-4 text-center">Admin Distribution</h3>
                <DonutChart data={adminData} title="Admin" subtitle="Types" size={160} />
            </div>
        </div>
    );
}

// Recent Users component
function RecentUsers() {
    const [expanded, setExpanded] = useState(false);
    const displayUsers = expanded ? RECENT_USERS : RECENT_USERS.slice(0, 4);

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-slate-800">Recent Users</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Latest user activities and status</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
                        <Filter size={16} className="text-slate-400" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
                        <Download size={16} className="text-slate-400" />
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {displayUsers.map((user, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm text-white
                            ${user.role === 'Super Admin' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 
                              user.role === 'Sub Admin' ? 'bg-gradient-to-br from-blue-500 to-cyan-600' : 
                              'bg-gradient-to-br from-slate-400 to-slate-500'}`}>
                            {user.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                                    user.role === 'Super Admin' ? 'bg-indigo-100 text-indigo-700' : 
                                    user.role === 'Sub Admin' ? 'bg-blue-100 text-blue-700' : 
                                    'bg-slate-100 text-slate-600'
                                }`}>
                                    {user.role}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span>{user.dept}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span>{user.time}</span>
                            </div>
                        </div>
                        <UserStatusBadge status={user.status} />
                        <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                            <MoreVertical size={14} className="text-slate-400" />
                        </button>
                    </div>
                ))}
            </div>

            {RECENT_USERS.length > 4 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full mt-4 py-2 text-sm text-slate-600 hover:text-slate-800 flex items-center justify-center gap-1 border-t border-slate-100 pt-3 hover:bg-slate-50 rounded-xl transition-colors"
                >
                    {expanded ? (
                        <>Show Less <ChevronUp size={16} /></>
                    ) : (
                        <>Show More ({RECENT_USERS.length - 4} more) <ChevronDown size={16} /></>
                    )}
                </button>
            )}
        </div>
    );
}

export const Dashboard = () => {
    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
                    <p className="text-sm text-slate-400 mt-0.5">Overview of your mobile device fleet with super admin insights</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400 bg-white border border-slate-100 px-3 py-2 rounded-xl">
                        <Cpu size={12} className="text-violet-400" />
                        All systems operational
                    </div>
                    <button className="flex items-center gap-2 text-xs font-medium text-white bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-xl transition-colors">
                        <RefreshCw size={14} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats row - now with 6 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                {STATS.map(s => (
                    <div
                        key={s.label}
                        className={`rounded-2xl border ${s.border} bg-gradient-to-br ${s.bg} p-4 flex flex-col gap-2`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-medium text-slate-500">{s.label}</span>
                            <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-sm`}>
                                <s.icon size={13} className="text-white" />
                            </div>
                        </div>
                        <div className="text-xl font-bold text-slate-800">{s.value}</div>
                        <div className={`flex items-center gap-1 text-[10px] font-semibold ${s.up ? "text-emerald-600" : "text-rose-500"}`}>
                            {s.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                            {s.change} this month
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Section */}
            <AnalyticsSection />

            {/* Bottom row with devices and users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Device health with super admin and sub-device indicators */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-semibold text-slate-800">Device Health</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Super admin & sub-device status</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
                                {DEVICES.filter(d => d.type === 'super').length} Super Admin
                            </span>
                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                                {DEVICES.filter(d => d.type === 'sub').length} Sub-Devices
                            </span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {DEVICES.slice(0, 6).map(d => (
                            <div key={d.name}>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-slate-700">{d.name}</span>
                                        <DeviceTypeBadge type={d.type} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400">{d.dept}</span>
                                        <StatusBadge status={d.status} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                                            <span>Battery</span><span>{d.battery}%</span>
                                        </div>
                                        <UsageBar value={d.battery} />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                                            <span>Storage</span><span>{d.storage}%</span>
                                        </div>
                                        <UsageBar value={d.storage} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Users Component */}
                <RecentUsers />
            </div>

            {/* Recent Events - Full width */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-semibold text-slate-800">Recent Events</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Real-time system notifications and alerts</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs bg-rose-50 text-rose-600 px-2 py-1 rounded-full flex items-center gap-1">
                            <AlertCircle size={12} />
                            {RECENT_EVENTS.filter(e => e.type === 'alert').length} Alerts
                        </span>
                        <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full flex items-center gap-1">
                            <UserCog size={12} />
                            Admin Events
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {RECENT_EVENTS.slice(0, 8).map((e, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                            <span className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${e.color}`}>
                                {e.type === "alert" ? <AlertCircle size={14} /> : 
                                 e.type === "success" ? <RefreshCw size={14} /> : 
                                 e.type === "admin" ? <UserCog size={14} /> :
                                 e.type === "sub" ? <Users size={14} /> :
                                 <Activity size={14} />}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-700 leading-snug">{e.msg}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{e.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
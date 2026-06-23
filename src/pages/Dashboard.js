// pages/Dashboard.js - Optimized & Responsive
import React, { useState, useMemo } from 'react';
import {
    TrendingUp, TrendingDown, AlertCircle, Activity, Cpu,
    Smartphone, Users, ShieldCheck, Grid, RefreshCw,
    UserCog, UserPlus, BarChart3, Eye,
    ChevronDown, ChevronUp, MoreVertical, Download, Filter,
    Clock, CheckCircle, XCircle, Zap, Award, Target
} from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────
const STATS = [
    { label: "Total Devices", value: "4,892", change: "+12%", up: true, icon: Smartphone, grad: "from-violet-500 to-purple-600" },
    { label: "Super Admin", value: "247", change: "+5%", up: true, icon: UserCog, grad: "from-indigo-500 to-blue-600" },
    { label: "Sub-Devices", value: "4,645", change: "+13%", up: true, icon: Users, grad: "from-sky-500 to-blue-500" },
    { label: "Active Users", value: "3,428", change: "+8%", up: true, icon: Users, grad: "from-emerald-500 to-teal-500" },
    { label: "Compliance", value: "93.7%", change: "+2.3%", up: true, icon: ShieldCheck, grad: "from-green-500 to-emerald-500" },
    { label: "Apps Deployed", value: "156", change: "+18%", up: true, icon: Grid, grad: "from-rose-500 to-pink-500" },
];

const RECENT_EVENTS = [
    { type: "alert", msg: "Jailbreak detected on iPhone 13 – Kiran B.", time: "3m ago", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
    { type: "admin", msg: "New super admin added: Priya Sharma (Corporate)", time: "12m ago", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
    { type: "info", msg: "New device enrollment request from Meena P.", time: "18m ago", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
    { type: "success", msg: "OS update pushed to 142 Android devices", time: "1h ago", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { type: "alert", msg: "Password policy non-compliance – 7 devices", time: "2h ago", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    { type: "sub", msg: "Sub-device registration: 5 new devices in Delhi region", time: "3h ago", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { type: "info", msg: "Slack v24.1 deployed to all iOS fleet", time: "4h ago", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
    { type: "success", msg: "Security patch applied to 89 super admin devices", time: "5h ago", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
];

const DEVICES = [
    { name: "iPhone 14 – Raj Mehta", dept: "Sales", battery: 82, storage: 61, status: "compliant", type: "sub" },
    { name: "Galaxy S23 – Priya Nair", dept: "Support", battery: 47, storage: 78, status: "warning", type: "sub" },
    { name: "Surface Pro – Admin 1", dept: "IT Admin", battery: 76, storage: 45, status: "compliant", type: "super" },
    { name: "Pixel 7 – Arjun Das", dept: "Engineering", battery: 91, storage: 34, status: "compliant", type: "sub" },
    { name: "Surface Pro 9 – Ananya Roy", dept: "HR", battery: 12, storage: 55, status: "offline", type: "sub" },
    { name: "iPad Pro – Vikram Singh", dept: "Field Ops", battery: 74, storage: 48, status: "compliant", type: "sub" },
];

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

// ── Reusable Components ──────────────────────────────────────────────────────

const Panel = ({ children, className = "", onClick }) => (
    <div
        className={`rounded-2xl p-4 sm:p-5 transition-all ${className}`}
        style={{
            background: 'rgba(20, 16, 36, 0.8)',
            border: '1px solid rgba(139,92,246,0.15)',
            backdropFilter: 'blur(12px)',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.35)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'}
        onClick={onClick}
    >
        {children}
    </div>
);

const StatusBadge = ({ status }) => {
    const map = {
        compliant: { bg: 'rgba(52,211,153,0.12)', color: '#6ee7b7', border: 'rgba(52,211,153,0.25)', icon: CheckCircle },
        warning: { bg: 'rgba(251,191,36,0.12)', color: '#fcd34d', border: 'rgba(251,191,36,0.25)', icon: AlertCircle },
        offline: { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8', border: 'rgba(100,116,139,0.25)', icon: XCircle },
    };
    const s = map[status] || map.offline;
    const Icon = s.icon;
    return (
        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
            style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
            <Icon size={10} /> {status}
        </span>
    );
};

const DeviceTypeBadge = ({ type }) => (
    <span className="text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
        style={type === 'super'
            ? { background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)' }
            : { background: 'rgba(56,189,248,0.1)', color: '#7dd3fc', border: '1px solid rgba(56,189,248,0.2)' }
        }>
        {type === 'super' ? 'Super Admin' : 'Sub-Device'}
    </span>
);

const UsageBar = ({ value, warn = 75 }) => {
    const color = value >= warn
        ? 'linear-gradient(90deg, #f87171, #ef4444)'
        : 'linear-gradient(90deg, #8b5cf6, #a855f7)';
    return (
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(139,92,246,0.12)' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, background: color }} />
        </div>
    );
};

const UserStatusBadge = ({ status }) => {
    const active = status === 'active';
    return (
        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
            style={active
                ? { background: 'rgba(52,211,153,0.12)', color: '#6ee7b7' }
                : { background: 'rgba(100,116,139,0.12)', color: '#94a3b8' }
            }>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            {status}
        </span>
    );
};

const StatCard = ({ stat }) => (
    <Panel className="p-4 hover:scale-[1.02] transition-transform cursor-pointer">
        <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs font-medium truncate" style={{ color: '#5a4f72' }}>{stat.label}</p>
                <p className="text-lg sm:text-xl font-bold mt-1 truncate" style={{ color: '#e2d9f3' }}>{stat.value}</p>
                <div className="flex items-center gap-1 text-[10px] font-semibold mt-0.5"
                    style={{ color: stat.up ? '#34d399' : '#f87171' }}>
                    {stat.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {stat.change} this month
                </div>
            </div>
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br ${stat.grad} flex items-center justify-center shrink-0`}
                style={{ boxShadow: '0 0 10px rgba(124,58,237,0.3)' }}>
                <stat.icon size={14} className="text-white" />
            </div>
        </div>
    </Panel>
);

// ── Mini Bar Chart ──────────────────────────────────────────────────────────

const MiniBarChart = ({ height = 100 }) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = [
        [60, 30, 80, 70], [45, 55, 40, 60], [70, 25, 90, 50], [55, 65, 50, 75],
        [80, 40, 70, 85], [65, 50, 85, 55], [75, 35, 60, 90], [50, 60, 75, 45],
        [85, 45, 65, 70], [60, 75, 50, 80], [90, 55, 80, 65], [70, 65, 55, 85],
    ];
    const colors = ["#8b5cf6", "#38bdf8", "#f472b6", "#34d399"];
    const BAR_W = 6, GAP = 2, GROUP_GAP = 12, H = height, TOP = 5;

    return (
        <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${months.length * (4 * BAR_W + 3 * GAP + GROUP_GAP)} ${H + 20}`} className="w-full min-w-[500px]">
                {months.map((m, gi) => {
                    const gx = gi * (4 * BAR_W + 3 * GAP + GROUP_GAP);
                    return (
                        <g key={m}>
                            {data[gi].map((v, bi) => {
                                const bh = (v / 100) * H;
                                return (
                                    <rect key={bi} x={gx + bi * (BAR_W + GAP)} y={TOP + H - bh}
                                        width={BAR_W} height={bh} rx={1.5}
                                        fill={colors[bi % colors.length]} opacity={0.85}
                                        className="transition-all hover:opacity-100" />
                                );
                            })}
                            <text x={gx + (4 * BAR_W + 3 * GAP) / 2} y={TOP + H + 14}
                                textAnchor="middle" fontSize={7} fill="#5a4f72">{m}</text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

// ── Donut Chart ─────────────────────────────────────────────────────────────

const DonutChart = ({ data, title, subtitle, size = 140 }) => {
    const R = size * 0.37, CX = size / 2, CY = size / 2, STROKE = size * 0.16;
    const circ = 2 * Math.PI * R;
    let offset = 0;

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="max-w-full">
                <circle cx={CX} cy={CY} r={R} fill="none"
                    stroke="rgba(139,92,246,0.12)" strokeWidth={STROKE} />
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
                <text x={CX} y={CY - 4} textAnchor="middle" fontSize={size * 0.09} fontWeight={700} fill="#e2d9f3">{title}</text>
                <text x={CX} y={CY + 10} textAnchor="middle" fontSize={size * 0.07} fill="#7c6fa0">{subtitle}</text>
            </svg>
            <div className="flex flex-col gap-1.5 w-full max-w-[180px]">
                {data.map(s => (
                    <div key={s.label} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                        <span className="text-xs flex-1 truncate" style={{ color: '#9c8fc0' }}>{s.label}</span>
                        <span className="text-xs font-semibold" style={{ color: '#c4b5fd' }}>{s.pct}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── Event Card ──────────────────────────────────────────────────────────────

const EventCard = ({ event }) => {
    const icons = {
        alert: AlertCircle,
        success: CheckCircle,
        admin: UserCog,
        sub: Users,
        info: Activity
    };
    const Icon = icons[event.type] || Activity;

    return (
        <div className="flex items-start gap-3 p-3 rounded-xl transition-all group"
            style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.06)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.12)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.04)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.06)'; }}>
            <span className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${event.bg} border`}>
                <Icon size={13} className={event.color} />
            </span>
            <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm leading-snug" style={{ color: '#c4b5fd' }}>{event.msg}</p>
                <p className="text-[10px] sm:text-xs mt-0.5 flex items-center gap-1" style={{ color: '#5a4f72' }}>
                    <Clock size={10} /> {event.time}
                </p>
            </div>
        </div>
    );
};

// ── Device Row ──────────────────────────────────────────────────────────────

const DeviceRow = ({ device }) => (
    <div className="space-y-2 p-3 rounded-xl transition-all hover:bg-purple-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm font-medium" style={{ color: '#c4b5fd' }}>{device.name}</span>
                <DeviceTypeBadge type={device.type} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] sm:text-xs" style={{ color: '#5a4f72' }}>{device.dept}</span>
                <StatusBadge status={device.status} />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
            {[
                { label: 'Battery', value: device.battery },
                { label: 'Storage', value: device.storage },
            ].map(bar => (
                <div key={bar.label}>
                    <div className="flex justify-between text-[10px] sm:text-xs mb-0.5" style={{ color: '#5a4f72' }}>
                        <span>{bar.label}</span>
                        <span className="font-medium">{bar.value}%</span>
                    </div>
                    <UsageBar value={bar.value} />
                </div>
            ))}
        </div>
    </div>
);

// ── User Row ────────────────────────────────────────────────────────────────

const UserRow = ({ user }) => {
    const roleStyle = {
        'Super Admin': { background: 'rgba(99,102,241,0.15)', color: '#a5b4fc' },
        'Sub Admin': { background: 'rgba(56,189,248,0.12)', color: '#7dd3fc' },
        'User': { background: 'rgba(100,116,139,0.12)', color: '#94a3b8' }
    }[user.role] || { background: 'rgba(100,116,139,0.12)', color: '#94a3b8' };

    const avatarGrad = {
        'Super Admin': 'linear-gradient(135deg,#6366f1,#8b5cf6)',
        'Sub Admin': 'linear-gradient(135deg,#0ea5e9,#06b6d4)',
        'User': 'linear-gradient(135deg,#64748b,#475569)'
    }[user.role] || 'linear-gradient(135deg,#64748b,#475569)';

    return (
        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer"
            style={{ border: '1px solid transparent' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-semibold text-xs text-white shrink-0"
                style={{ background: avatarGrad }}>
                {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    <p className="text-xs sm:text-sm font-medium truncate" style={{ color: '#e2d9f3' }}>{user.name}</p>
                    <span className="text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap" style={roleStyle}>
                        {user.role}
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[10px] sm:text-xs" style={{ color: '#5a4f72' }}>
                    <span>{user.dept}</span>
                    <span className="w-1 h-1 rounded-full hidden sm:inline" style={{ background: '#3d3358' }} />
                    <span className="flex items-center gap-1">
                        <Clock size={10} /> {user.time}
                    </span>
                </div>
            </div>
            <UserStatusBadge status={user.status} />
            <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#3d3358' }}>
                <MoreVertical size={13} />
            </button>
        </div>
    );
};

// ── Analytics Section ──────────────────────────────────────────────────────

const AnalyticsSection = () => {
    const adminData = [
        { label: "Super Admin", pct: 5, color: "#6366f1" },
        { label: "Sub-Admin", pct: 15, color: "#8b5cf6" },
        { label: "Standard", pct: 80, color: "#38bdf8" },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Panel className="lg:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                        <h3 className="font-semibold text-sm sm:text-base" style={{ color: '#e2d9f3' }}>Device Analytics</h3>
                        <p className="text-xs mt-0.5" style={{ color: '#5a4f72' }}>Monthly device enrollments by type</p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        {[["Super Admin", "#6366f1"], ["Sub-Devices", "#38bdf8"], ["Standard", "#f472b6"]].map(([l, c]) => (
                            <div key={l} className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full" style={{ background: c }} />
                                <span className="text-[10px] sm:text-xs whitespace-nowrap" style={{ color: '#7c6fa0' }}>{l}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <MiniBarChart height={100} />
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-4 pt-4" style={{ borderTop: '1px solid rgba(139,92,246,0.12)' }}>
                    {[
                        { label: "Avg. Enrollment", val: "347", sub: "↑ 12% monthly", subColor: '#34d399' },
                        { label: "Peak Month", val: "Oct", sub: "412 devices", subColor: '#7c6fa0' },
                        { label: "Growth Rate", val: "+18.4%", sub: "↑ YoY", subColor: '#34d399' },
                    ].map(item => (
                        <div key={item.label} className="text-center sm:text-left">
                            <p className="text-[10px] sm:text-xs" style={{ color: '#5a4f72' }}>{item.label}</p>
                            <p className="text-base sm:text-lg font-bold" style={{ color: '#e2d9f3' }}>{item.val}</p>
                            <p className="text-[10px] sm:text-xs" style={{ color: item.subColor }}>{item.sub}</p>
                        </div>
                    ))}
                </div>
            </Panel>

            <Panel className="flex items-center justify-center">
                <div className="w-full max-w-[200px]">
                    <h3 className="font-semibold text-center mb-4 text-sm sm:text-base" style={{ color: '#e2d9f3' }}>Admin Distribution</h3>
                    <DonutChart data={adminData} title="Admin" subtitle="Types" size={150} />
                </div>
            </Panel>
        </div>
    );
};

// ── Recent Users Section ──────────────────────────────────────────────────

const RecentUsersSection = () => {
    const [expanded, setExpanded] = useState(false);
    const displayUsers = expanded ? RECENT_USERS : RECENT_USERS.slice(0, 4);

    return (
        <Panel className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                    <h3 className="font-semibold text-sm sm:text-base" style={{ color: '#e2d9f3' }}>Recent Users</h3>
                    <p className="text-xs mt-0.5" style={{ color: '#5a4f72' }}>Latest user activities and status</p>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                    {[Filter, Download].map((Icon, i) => (
                        <button key={i} className="p-1.5 rounded-lg transition-colors hover:bg-purple-500/10"
                            style={{ color: '#5a4f72' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#c4b5fd'}
                            onMouseLeave={e => e.currentTarget.style.color = '#5a4f72'}>
                            <Icon size={14} />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
                {displayUsers.map((user, i) => (
                    <UserRow key={i} user={user} />
                ))}
            </div>

            {RECENT_USERS.length > 4 && (
                <button onClick={() => setExpanded(!expanded)}
                    className="w-full mt-3 py-2 text-xs sm:text-sm flex items-center justify-center gap-1.5 rounded-xl transition-colors"
                    style={{ color: '#7c6fa0', borderTop: '1px solid rgba(139,92,246,0.1)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#c4b5fd'; e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#7c6fa0'; e.currentTarget.style.background = 'transparent'; }}>
                    {expanded
                        ? <><ChevronUp size={14} /> Show Less</>
                        : <><ChevronDown size={14} /> Show More ({RECENT_USERS.length - 4} more)</>}
                </button>
            )}
        </Panel>
    );
};

// ── Main Component ──────────────────────────────────────────────────────────

export const Dashboard = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [showAllEvents, setShowAllEvents] = useState(false);
    const displayEvents = showAllEvents ? RECENT_EVENTS : RECENT_EVENTS.slice(0, 4);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    };

    // Memoized stats for performance
    const stats = useMemo(() => STATS, []);

    return (
        <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-lg sm:text-xl font-bold" style={{ color: '#e2d9f3' }}>Dashboard</h1>
                    <p className="text-xs sm:text-sm mt-0.5" style={{ color: '#5a4f72' }}>Overview of your mobile device fleet with super admin insights</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="hidden sm:flex items-center gap-2 text-xs px-3 py-2 rounded-xl"
                        style={{ color: '#7c6fa0', background: 'rgba(20,16,36,0.8)', border: '1px solid rgba(139,92,246,0.15)' }}>
                        <Cpu size={12} style={{ color: '#a78bfa' }} />
                        All systems operational
                    </div>
                    <button 
                        onClick={handleRefresh}
                        className={`flex items-center gap-1 sm:gap-2 text-xs font-medium text-white px-3 sm:px-4 py-2 rounded-xl transition-all ${refreshing ? 'opacity-70' : ''}`}
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)', boxShadow: '0 0 16px rgba(124,58,237,0.3)' }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 24px rgba(124,58,237,0.5)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 16px rgba(124,58,237,0.3)'}
                        disabled={refreshing}>
                        <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} /> 
                        <span className="hidden xs:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                    </button>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                {stats.map((s, i) => <StatCard key={i} stat={s} />)}
            </div>

            {/* Analytics */}
            <AnalyticsSection />

            {/* Bottom row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Device health */}
                <Panel>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h3 className="font-semibold text-sm sm:text-base" style={{ color: '#e2d9f3' }}>Device Health</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#5a4f72' }}>Super admin & sub-device status</p>
                        </div>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                            {[
                                { label: `${DEVICES.filter(d => d.type === 'super').length} Super Admin`, color: 'rgba(99,102,241,0.15)', text: '#a5b4fc' },
                                { label: `${DEVICES.filter(d => d.type === 'sub').length} Sub-Devices`, color: 'rgba(56,189,248,0.1)', text: '#7dd3fc' },
                            ].map(b => (
                                <span key={b.label} className="text-[10px] sm:text-xs px-2 py-1 rounded-full whitespace-nowrap"
                                    style={{ background: b.color, color: b.text }}>{b.label}</span>
                            ))}
                        </div>
                    </div>
                    <div className="divide-y divide-purple-500/5">
                        {DEVICES.map((d, i) => <DeviceRow key={i} device={d} />)}
                    </div>
                </Panel>

                <RecentUsersSection />
            </div>

            {/* Recent Events */}
            <Panel>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                        <h3 className="font-semibold text-sm sm:text-base" style={{ color: '#e2d9f3' }}>Recent Events</h3>
                        <p className="text-xs mt-0.5" style={{ color: '#5a4f72' }}>Real-time system notifications and alerts</p>
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                        <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full flex items-center gap-1"
                            style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}>
                            <AlertCircle size={11} />
                            {RECENT_EVENTS.filter(e => e.type === 'alert').length} Alerts
                        </span>
                        <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full flex items-center gap-1"
                            style={{ background: 'rgba(99,102,241,0.12)', color: '#a5b4fc' }}>
                            <UserCog size={11} /> Admin Events
                        </span>
                        <button 
                            onClick={() => setShowAllEvents(!showAllEvents)}
                            className="text-[10px] sm:text-xs px-2 py-1 rounded-full transition-colors"
                            style={{ color: '#5a4f72' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#c4b5fd'}>
                            {showAllEvents ? 'Show Less' : 'View All'}
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                    {displayEvents.map((e, i) => <EventCard key={i} event={e} />)}
                </div>
            </Panel>

            {/* Status Footer */}
            <div className="rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-2"
                style={{
                    background: 'rgba(20, 16, 36, 0.8)',
                    border: '1px solid rgba(139,92,246,0.15)',
                }}
            >
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] sm:text-xs" style={{ color: '#5a4f72' }}>
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        System Online
                    </span>
                    <span className="hidden xs:inline w-px h-4" style={{ background: 'rgba(139,92,246,0.15)' }} />
                    <span className="hidden xs:inline">Last updated: {new Date().toLocaleString()}</span>
                    <span className="flex items-center gap-1">
                        <Award size={12} style={{ color: '#a78bfa' }} />
                        {STATS.reduce((acc, s) => acc + parseInt(s.value.replace(/,/g, '')), 0).toLocaleString()} total assets
                    </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] sm:text-xs" style={{ color: '#5a4f72' }}>
                    <span>v3.2.1</span>
                    <span className="hidden xs:inline w-px h-4" style={{ background: 'rgba(139,92,246,0.15)' }} />
                    <span className="hidden xs:inline">100% uptime</span>
                </div>
            </div>
        </div>
    );
};
// pages/Dashboard.js - Optimized & Responsive with Light Theme & Saffron Accents
import React, { useState, useMemo } from 'react';
import {
    TrendingUp, TrendingDown, AlertCircle, Activity,
    Smartphone, Users, RefreshCw, UserPlus,
    ChevronDown, MoreVertical,
    Clock, CheckCircle, XCircle, Zap, Award,
    FileText, Bell, CreditCard, Calendar,
    Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── Data Generation Functions ──────────────────────────────────────────────────
const generateStats = (period) => {
    const multipliers = {
        today: 0.1,
        week: 0.7,
        month: 1,
        year: 12
    };
    const mul = multipliers[period] || 1;

    return [
        { label: "Total Staff", value: Math.round(5 * mul), change: `+${Math.round(8 * mul)}`, up: true, icon: Users, grad: "from-orange-500 to-amber-600" },
        { label: "Total Admins", value: Math.round(1284 * mul), change: `+${Math.round(12 * mul)}%`, up: true, icon: UserPlus, grad: "from-orange-400 to-amber-500" },
        { label: "Total Devices", value: Math.round(3608 * mul), change: `+${Math.round(18 * mul)}%`, up: true, icon: Smartphone, grad: "from-amber-500 to-yellow-600" },
        { label: "Total Plans", value: Math.round(3 * mul), change: `+${Math.round(4 * mul)}`, up: true, icon: CreditCard, grad: "from-orange-600 to-amber-700" },
        { label: "Total Reports", value: Math.round(89 * mul), change: `+${Math.round(12 * mul)}%`, up: true, icon: FileText, grad: "from-amber-400 to-orange-500" },
        { label: "Total Notifications", value: Math.round(89 * mul), change: `+${Math.round(12 * mul)}%`, up: true, icon: Bell, grad: "from-orange-500 to-amber-600" },
    ];
};

const generateRecentUsers = (period) => {
    const allUsers = [
        { name: "Dr. Ananya Sharma", role: "Super Admin", dept: "Corporate IT", status: "active", time: "2m ago", avatar: "AS" },
        { name: "Rajesh Kumar", role: "Sub Admin", dept: "Delhi Region", status: "active", time: "15m ago", avatar: "RK" },
        { name: "Priya Mehta", role: "User", dept: "Sales", status: "active", time: "32m ago", avatar: "PM" },
        { name: "Arjun Singh", role: "Super Admin", dept: "Security", status: "inactive", time: "1h ago", avatar: "AS" },
        { name: "Neha Gupta", role: "User", dept: "HR", status: "active", time: "2h ago", avatar: "NG" },
        { name: "Vikram Patel", role: "Sub Admin", dept: "Mumbai Region", status: "active", time: "3h ago", avatar: "VP" },
        { name: "Sneha Reddy", role: "User", dept: "Marketing", status: "active", time: "4h ago", avatar: "SR" },
        { name: "Amit Kumar", role: "Super Admin", dept: "Operations", status: "inactive", time: "5h ago", avatar: "AK" },
        { name: "Priya Singh", role: "Sub Admin", dept: "Bangalore Region", status: "active", time: "6h ago", avatar: "PS" },
        { name: "Rahul Verma", role: "User", dept: "Finance", status: "active", time: "7h ago", avatar: "RV" },
    ];

    const counts = { today: 3, week: 6, month: 10, year: 10 };
    return allUsers.slice(0, counts[period] || 6);
};

const generateRecentDevices = (period) => {
    const allDevices = [
        { name: "iPhone 14 Pro – Raj Mehta", type: "device", status: "active", lastSeen: "2m ago", battery: 82, storage: 61, network: "Wi-Fi", networkName: "vijay Wi-Fi" },
        { name: "Galaxy S23 Ultra – Priya Nair", type: "device", status: "active", lastSeen: "15m ago", battery: 47, storage: 78, network: "Mobile Data", networkName: "JIo" },
        { name: "Surface Pro 9 – Admin 1", type: "device", status: "inactive", lastSeen: "1h ago", battery: 76, storage: 45, network: "Wi-Fi", networkName: "Work Wi-Fi" },
        { name: "Pixel 7 Pro – Arjun Das", type: "device", status: "active", lastSeen: "32m ago", battery: 91, storage: 34, network: "Mobile Data", networkName: "Airtel" },
        { name: "iPad Pro – Ananya Roy", type: "device", status: "inactive", lastSeen: "2h ago", battery: 12, storage: 55, network: "Wi-Fi", networkName: "FastSpec Wi-Fi" },
        { name: "MacBook Pro – Vikram Singh", type: "device", status: "active", lastSeen: "3h ago", battery: 65, storage: 72, network: "Mobile Data", networkName: "BSNL" },
        { name: "OnePlus 11 – Sneha Patel", type: "device", status: "active", lastSeen: "4h ago", battery: 88, storage: 43, network: "Wi-Fi", networkName: "Home Wi-Fi" },
    ];

    const counts = { today: 3, week: 5, month: 7, year: 7 };
    return allDevices.slice(0, counts[period] || 5);
};

const generateRecentReports = (period) => {
    const allComplaints = [
        {
            title: "Unable to Login to Admin App",
            type: "Authentication",
            date: "2024-01-15",
            status: "open"
        },
        {
            title: "Device Enrollment Failed",
            type: "Device",
            date: "2024-01-14",
            status: "in-progress"
        },
        {
            title: "Payment Successful but Plan Not Activated",
            type: "Billing",
            date: "2024-01-13",
            status: "pending"
        },
        {
            title: "Application Crashes During Enrollment",
            type: "Technical",
            date: "2024-01-12",
            status: "open"
        },
        {
            title: "Dashboard Loading Slowly",
            type: "Performance",
            date: "2024-01-11",
            status: "resolved"
        },
        {
            title: "Security Policy Not Applied",
            type: "Security",
            date: "2024-01-10",
            status: "in-progress"
        },
        {
            title: "Push Notifications Not Received",
            type: "Notification",
            date: "2024-01-09",
            status: "pending"
        },
        {
            title: "Device Location Not Updating",
            type: "GPS",
            date: "2024-01-08",
            status: "open"
        },
        {
            title: "Unable to Reset Password",
            type: "Authentication",
            date: "2024-01-07",
            status: "resolved"
        },
        {
            title: "Battery Information Not Syncing",
            type: "Device",
            date: "2024-01-06",
            status: "pending"
        }
    ];

    const counts = { today: 2, week: 4, month: 7, year: 7 };
    return allComplaints.slice(0, counts[period] || 5);
};

// ── Reusable Components ──────────────────────────────────────────────────────

const Panel = ({ children, className = "", onClick }) => (
    <div
        className={`rounded-2xl p-4 sm:p-5 transition-all bg-white ${className}`}
        style={{
            border: '1px solid rgba(255,125,56,0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        }}
        onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(255,125,56,0.4)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,125,56,0.12)';
            e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,125,56,0.2)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
            e.currentTarget.style.transform = 'translateY(0)';
        }}
        onClick={onClick}
    >
        {children}
    </div>
);

const StatusBadge = ({ status }) => {
    const map = {
        active: { bg: 'rgba(255,125,56,0.15)', color: '#FF7D38', border: 'rgba(255,125,56,0.25)', icon: CheckCircle },
        inactive: { bg: 'rgba(100,116,139,0.1)', color: '#64748b', border: 'rgba(100,116,139,0.2)', icon: XCircle },
        pending: { bg: 'rgba(251,191,36,0.15)', color: '#d97706', border: 'rgba(251,191,36,0.25)', icon: AlertCircle },
        processing: { bg: 'rgba(56,189,248,0.1)', color: '#0284c7', border: 'rgba(56,189,248,0.2)', icon: Activity },
        completed: { bg: 'rgba(52,211,153,0.1)', color: '#059669', border: 'rgba(52,211,153,0.2)', icon: CheckCircle },
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
                ? { background: 'rgba(255,125,56,0.15)', color: '#FF7D38' }
                : { background: 'rgba(100,116,139,0.1)', color: '#94a3b8' }
            }>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-orange-500 animate-pulse' : 'bg-slate-400'}`} />
            {status}
        </span>
    );
};

const StatCard = ({ stat }) => (
    <Panel className="relative overflow-hidden p-4 hover:scale-[1.02] transition-transform cursor-pointer">

        {/* Decorative Saffron Elements */}
        <div
            className="absolute -top-10 -left-10 w-28 h-28 rounded-full"
            style={{
                background: 'rgba(255,125,56,0.14)',
            }}
        />

        <div
            className="absolute -top-6 -left-6 w-40 h-40 rounded-full border"
            style={{
                borderColor: 'rgba(255,125,56,0.12)',
            }}
        />

        <div
            className="absolute -top-10 -left-10 w-52 h-52 rounded-full border"
            style={{
                borderColor: 'rgba(255,125,56,0.08)',
            }}
        />

        <div
            className="absolute -bottom-5 -right-5 w-16 h-16 rounded-full"
            style={{
                background: 'rgba(255,125,56,0.08)',
            }}
        />

        {/* Card Content */}
        <div className="relative flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs font-medium truncate text-gray-500">
                    {stat.label}
                </p>

                <p className="text-lg sm:text-xl font-bold mt-1 truncate text-gray-800">
                    {stat.value}
                </p>

                <div
                    className="flex items-center gap-1 text-[10px] font-semibold mt-0.5"
                    style={{ color: stat.up ? "#FF7D38" : "#ef4444" }}
                >
                    {stat.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {stat.change} this period
                </div>
            </div>

            <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br ${stat.grad} flex items-center justify-center shrink-0`}
                style={{
                    boxShadow: "0 0 15px rgba(255,125,56,0.3)",
                }}
            >
                <stat.icon size={14} className="text-white" />
            </div>
        </div>
    </Panel>
);





// ── Device Row ──────────────────────────────────────────────────────────────

const DeviceRow = ({ device }) => (
    <div className="space-y-3 p-3 rounded-xl bg-white hover:bg-orange-50/50 transition-all">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

            <div className="flex items-center gap-2 flex-wrap min-w-0">
                <span className="text-sm font-semibold text-gray-800 truncate">
                    {device.name}
                </span>

                <span
                    className="text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={
                        device.type === "Super Admin"
                            ? {
                                background: "rgba(255,125,56,0.15)",
                                color: "#FF7D38",
                                border: "1px solid rgba(255,125,56,0.2)",
                            }
                            : device.type === "Sub Admin"
                                ? {
                                    background: "rgba(56,189,248,0.1)",
                                    color: "#0ea5e9",
                                    border: "1px solid rgba(56,189,248,0.15)",
                                }
                                : {
                                    background: "rgba(100,116,139,0.1)",
                                    color: "#64748b",
                                    border: "1px solid rgba(100,116,139,0.15)",
                                }
                    }
                >
                    {device.type}
                </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500">{device.lastSeen}</span>
                <StatusBadge status={device.status} />
            </div>
        </div>

        {/* Battery & Storage */}
        <div className="grid grid-cols-2 gap-3">
            {[
                { label: "Battery", value: device.battery },
                { label: "Storage", value: device.storage },
            ].map((bar) => (
                <div key={bar.label}>
                    <div className="flex justify-between text-xs mb-1 text-gray-500">
                        <span>{bar.label}</span>
                        <span className="font-medium">{bar.value}%</span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${bar.value}%`,
                                background:
                                    bar.value >= 75
                                        ? "linear-gradient(90deg,#f87171,#ef4444)"
                                        : "linear-gradient(90deg,#FF7D38,#FF6B1A)",
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>

        {/* Network Details */}
        <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-orange-100 bg-orange-50 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wide text-gray-500">
                    Network
                </p>
                <p className="text-sm font-semibold text-gray-800">
                    {device.network}
                </p>
            </div>

            <div className="rounded-lg border border-orange-100 bg-orange-50 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wide text-gray-500">
                    Network Name
                </p>
                <p className="text-sm font-semibold text-gray-800">
                    {device.networkName}
                </p>
            </div>
        </div>

    </div>
);

// ── Report Row ──────────────────────────────────────────────────────────────

const ReportRow = ({ report }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer bg-white"
        style={{ border: '1px solid transparent' }}
        onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,125,56,0.06)';
            e.currentTarget.style.borderColor = 'rgba(255,125,56,0.2)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.borderColor = 'transparent';
        }}>
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 bg-orange-50">
            <FileText size={14} className="text-orange-500" />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <p className="text-xs sm:text-sm font-medium truncate text-gray-800">{report.title}</p>
                <span className="text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap bg-blue-50 text-blue-600">
                    {report.type}
                </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-gray-500">
                <span>{report.date}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
            </div>
        </div>
        <StatusBadge status={report.status} />
        <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-orange-500">
            <MoreVertical size={13} />
        </button>
    </div>
);

// ── Main Component ──────────────────────────────────────────────────────────

export const Dashboard = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navigate = useNavigate();

    // Data based on selected period
    const stats = useMemo(() => generateStats(selectedPeriod), [selectedPeriod]);
    const recentUsers = useMemo(() => generateRecentUsers(selectedPeriod), [selectedPeriod]);
    const recentDevices = useMemo(() => generateRecentDevices(selectedPeriod), [selectedPeriod]);
    const recentReports = useMemo(() => generateRecentReports(selectedPeriod), [selectedPeriod]);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    };

    const periodLabels = {
        today: 'Today',
        week: 'This Week',
        month: 'This Month',
        year: 'This Year'
    };

    // User Distribution Data
    const userDistribution = [
        { label: "Staff", pct: 8, color: "#FF7D38" },
        { label: "Admin", pct: 22, color: "#fbbf24" },
        { label: "Devices", pct: 70, color: "#f59e0b" },
    ];

    // Device Status Distribution
    const deviceStatus = [
        { label: "Active", pct: 72, color: "#FF7D38" },
        { label: "Inactive", pct: 18, color: "#fbbf24" },
        { label: "Pending", pct: 10, color: "#f59e0b" },
    ];

    return (
        <div className="space-y-4 sm:space-y-6 px-2 sm:px-0 bg-gray-50 min-h-screen py-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-sm border border-orange-100">
                <div>
                    <h1 className="text-lg sm:text-xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-xs sm:text-sm mt-0.5 text-gray-500">
                        Overview of users, devices, and system analytics for {periodLabels[selectedPeriod]}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {/* Period Filter Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 text-xs font-medium px-3 sm:px-4 py-2 rounded-xl transition-all text-white"
                            style={{
                                background: 'linear-gradient(135deg, #FF7D38, #FF6B1A)',
                                boxShadow: '0 0 16px rgba(255,125,56,0.3)'
                            }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 24px rgba(255,125,56,0.5)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 16px rgba(255,125,56,0.3)'}
                        >
                            <Calendar size={13} />
                            <span className="hidden xs:inline">{periodLabels[selectedPeriod]}</span>
                            <ChevronDown size={13} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 rounded-xl overflow-hidden z-20 bg-white border border-orange-200 shadow-lg">
                                {['today', 'week', 'month', 'year'].map((period) => (
                                    <button
                                        key={period}
                                        onClick={() => {
                                            setSelectedPeriod(period);
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-xs transition-colors"
                                        style={{
                                            color: selectedPeriod === period ? '#FF7D38' : '#4a4a4a',
                                            background: selectedPeriod === period ? 'rgba(255,125,56,0.08)' : 'transparent'
                                        }}
                                        onMouseEnter={e => {
                                            if (selectedPeriod !== period) {
                                                e.currentTarget.style.background = 'rgba(255,125,56,0.05)';
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (selectedPeriod !== period) {
                                                e.currentTarget.style.background = 'transparent';
                                            }
                                        }}
                                    >
                                        {periodLabels[period]}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleRefresh}
                        className={`flex items-center gap-1 sm:gap-2 text-xs font-medium text-white px-3 sm:px-4 py-2 rounded-xl transition-all ${refreshing ? 'opacity-70' : ''}`}
                        style={{ background: 'linear-gradient(135deg, #FF7D38, #FF6B1A)', boxShadow: '0 0 16px rgba(255,125,56,0.3)' }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 24px rgba(255,125,56,0.5)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 16px rgba(255,125,56,0.3)'}
                        disabled={refreshing}
                    >
                        <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
                        <span className="hidden xs:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                    </button>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3">
                {stats.map((s, i) => <StatCard key={i} stat={s} />)}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                <Panel className="lg:col-span-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h3 className="font-semibold text-sm sm:text-base text-gray-800">User Growth Analytics</h3>
                            <p className="text-xs mt-0.5 text-gray-500">
                                {selectedPeriod === 'today' ? 'Hourly user registration trends' :
                                    selectedPeriod === 'week' ? 'Daily user registration trends' :
                                        selectedPeriod === 'month' ? 'Daily user registration trends' :
                                            'Monthly user registration trends'}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {[["Total Users", "#FF7D38"], ["Sub Admins", "#fbbf24"], ["Super Admins", "#f59e0b"]].map(([l, c]) => (
                                <div key={l} className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full" style={{ background: c }} />
                                    <span className="text-[10px] sm:text-xs whitespace-nowrap text-gray-600">{l}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <svg viewBox="0 0 800 120" className="w-full">
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
                                        opacity={0.8}
                                        className="transition-all hover:opacity-100"
                                    />
                                );
                            })}
                            {selectedPeriod === 'today' ?
                                ["6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM", "10PM", "12AM", "2AM", "4AM"].map((label, i) => (
                                    <text key={i} x={35 + i * 65} y={130} textAnchor="middle" fontSize={9} fill="#94a3b8">{label}</text>
                                )) :
                                selectedPeriod === 'week' || selectedPeriod === 'month' ?
                                    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map((label, i) => (
                                        <text key={i} x={35 + i * 65} y={130} textAnchor="middle" fontSize={9} fill="#94a3b8">{label}</text>
                                    )) :
                                    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((label, i) => (
                                        <text key={i} x={35 + i * 65} y={130} textAnchor="middle" fontSize={9} fill="#94a3b8">{label}</text>
                                    ))
                            }
                        </svg>
                    </div>
                </Panel>
            </div>

            {/* Recent Devices & Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Panel>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h3 className="font-semibold text-sm sm:text-base text-gray-800">Recent Devices</h3>
                            <p className="text-xs mt-0.5 text-gray-500">Latest device activity</p>
                        </div>
                        <button onClick={() => navigate('/admin/users')} className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors text-orange-500 bg-orange-50 border border-orange-200 hover:bg-orange-100 hover:border-orange-300">
                            View All
                        </button>
                    </div>
                    <div className="divide-y divide-orange-100/50">
                        {recentDevices.map((device, i) => <DeviceRow key={i} device={device} />)}
                    </div>
                </Panel>

                <Panel>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h3 className="font-semibold text-sm sm:text-base text-gray-800">Recent Complaints</h3>
                            <p className="text-xs mt-0.5 text-gray-500">Latest generated complaints</p>
                        </div>
                        <button onClick={() => navigate('/admin/complaints')} className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors text-orange-500 bg-orange-50 border border-orange-200 hover:bg-orange-100 hover:border-orange-300">
                            View All
                        </button>
                    </div>
                    <div className="divide-y divide-orange-100/50">
                        {recentReports.map((report, i) => <ReportRow key={i} report={report} />)}
                    </div>
                </Panel>
            </div>

            {/* Status Footer */}
            <div className="rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-2 bg-white border border-orange-200 shadow-sm">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-gray-500">
                    
                    
                    <span className="flex items-center gap-1">
                        <Star size={12} className="text-orange-500" />
                        RV Technologies Pvt. Ltd. - All Rights Reserved 2026
                    </span>
                </div>
                
            </div>
        </div>
    );
};
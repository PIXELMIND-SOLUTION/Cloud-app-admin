// pages/RegisteredUsers.js
import React, { useState } from 'react';
import {
    Users, Smartphone, Search, Eye,
    ShieldCheck, ShieldAlert, WifiOff,
    Cpu, Download, CheckCircle,
    UserPlus, ChevronLeft, ChevronRight
} from 'lucide-react';
import { UserDeviceDetail } from './UserDeviceDetails';

// ── Data ─────────────────────────────────────────────────────────────────────
const REGISTERED_USERS = [
    {
        id: 1, name: "Raj Mehta", email: "raj.mehta@corp.io", role: "Sub Admin",
        avatar: "RM", avatarGrad: "from-violet-500 to-purple-600", region: "Mumbai",
        totalDevices: 3, activeDevices: 3, status: "active", lastSeen: "2m ago",
        devices: [
            { id: "D001", name: "iPhone 14 Pro", os: "iOS 17.4", model: "Apple", type: "mobile", status: "active", battery: 82, storage: 61, enrolled: "12 Jan 2024", appCount: 24, mdmProfile: true, encryption: true, passcode: true, lastSync: "5m ago" },
            { id: "D002", name: "iPad Air 5", os: "iPadOS 17.2", model: "Apple", type: "tablet", status: "active", battery: 74, storage: 48, enrolled: "20 Feb 2024", appCount: 18, mdmProfile: true, encryption: true, passcode: true, lastSync: "1h ago" },
            { id: "D003", name: "MacBook Pro 14", os: "macOS 14.3", model: "Apple", type: "laptop", status: "active", battery: 45, storage: 78, enrolled: "5 Mar 2024", appCount: 32, mdmProfile: true, encryption: false, passcode: true, lastSync: "3h ago" },
        ],
    },
    {
        id: 2, name: "Priya Nair", email: "priya.nair@corp.io", role: "User",
        avatar: "PN", avatarGrad: "from-sky-500 to-blue-600", region: "Bangalore",
        totalDevices: 2, activeDevices: 1, status: "active", lastSeen: "18m ago",
        devices: [
            { id: "D004", name: "Samsung Galaxy S23", os: "Android 14", model: "Samsung", type: "mobile", status: "active", battery: 47, storage: 78, enrolled: "8 Feb 2024", appCount: 21, mdmProfile: true, encryption: true, passcode: false, lastSync: "2h ago" },
            { id: "D005", name: "Galaxy Tab S9", os: "Android 13", model: "Samsung", type: "tablet", status: "active", battery: 12, storage: 55, enrolled: "15 Mar 2024", appCount: 14, mdmProfile: false, encryption: true, passcode: true, lastSync: "2d ago" },
        ],
    },
    {
        id: 3, name: "Arjun Das", email: "arjun.das@corp.io", role: "User",
        avatar: "AD", avatarGrad: "from-emerald-500 to-teal-600", region: "Delhi",
        totalDevices: 4, activeDevices: 4, status: "active", lastSeen: "Just now",
        devices: [
            { id: "D006", name: "Pixel 7 Pro", os: "Android 14", model: "Google", type: "mobile", status: "active", battery: 91, storage: 34, enrolled: "1 Jan 2024", appCount: 28, mdmProfile: true, encryption: true, passcode: true, lastSync: "Just now" },
            { id: "D007", name: "Pixel Watch 2", os: "Wear OS 4", model: "Google", type: "wearable", status: "active", battery: 68, storage: 20, enrolled: "1 Jan 2024", appCount: 8, mdmProfile: true, encryption: true, passcode: true, lastSync: "10m ago" },
            { id: "D008", name: "ThinkPad X1 Carbon", os: "Windows 11 Pro", model: "Lenovo", type: "laptop", status: "active", battery: 76, storage: 45, enrolled: "10 Jan 2024", appCount: 45, mdmProfile: true, encryption: true, passcode: true, lastSync: "30m ago" },
            { id: "D009", name: "iPhone 15", os: "iOS 17.4", model: "Apple", type: "mobile", status: "active", battery: 88, storage: 29, enrolled: "15 Feb 2024", appCount: 19, mdmProfile: true, encryption: true, passcode: true, lastSync: "1h ago" },
        ],
    },
    {
        id: 4, name: "Meera Patel", email: "meera.patel@corp.io", role: "User",
        avatar: "MP", avatarGrad: "from-rose-500 to-pink-600", region: "Chennai",
        totalDevices: 1, activeDevices: 1, status: "active", lastSeen: "1h ago",
        devices: [
            { id: "D010", name: "iPhone 15 Plus", os: "iOS 17.3", model: "Apple", type: "mobile", status: "active", battery: 95, storage: 28, enrolled: "20 Jan 2024", appCount: 16, mdmProfile: true, encryption: true, passcode: true, lastSync: "1h ago" },
        ],
    },
    {
        id: 5, name: "Vikram Singh", email: "vikram.singh@corp.io", role: "Sub Admin",
        avatar: "VS", avatarGrad: "from-indigo-500 to-blue-600", region: "Hyderabad",
        totalDevices: 3, activeDevices: 2, status: "inactive", lastSeen: "2d ago",
        devices: [
            { id: "D011", name: "iPad Pro 12.9", os: "iPadOS 17.1", model: "Apple", type: "tablet", status: "active", battery: 74, storage: 48, enrolled: "5 Jan 2024", appCount: 22, mdmProfile: true, encryption: true, passcode: true, lastSync: "2d ago" },
            { id: "D012", name: "Surface Pro 9", os: "Windows 11", model: "Microsoft", type: "laptop", status: "active", battery: 0, storage: 62, enrolled: "10 Jan 2024", appCount: 38, mdmProfile: false, encryption: false, passcode: false, lastSync: "5d ago" },
            { id: "D013", name: "Galaxy S22", os: "Android 13", model: "Samsung", type: "mobile", status: "active", battery: 61, storage: 41, enrolled: "15 Jan 2024", appCount: 20, mdmProfile: true, encryption: true, passcode: true, lastSync: "3d ago" },
        ],
    },
    {
        id: 6, name: "Sneha Reddy", email: "sneha.reddy@corp.io", role: "User",
        avatar: "SR", avatarGrad: "from-amber-500 to-orange-600", region: "Pune",
        totalDevices: 2, activeDevices: 2, status: "active", lastSeen: "45m ago",
        devices: [
            { id: "D014", name: "OnePlus 11", os: "Android 14", model: "OnePlus", type: "mobile", status: "active", battery: 79, storage: 37, enrolled: "22 Feb 2024", appCount: 23, mdmProfile: true, encryption: true, passcode: true, lastSync: "45m ago" },
            { id: "D015", name: "iPad Mini 6", os: "iPadOS 16.7", model: "Apple", type: "tablet", status: "active", battery: 33, storage: 71, enrolled: "1 Mar 2024", appCount: 12, mdmProfile: true, encryption: true, passcode: false, lastSync: "6h ago" },
        ],
    },
    {
        id: 7, name: "Kiran Bose", email: "kiran.bose@corp.io", role: "User",
        avatar: "KB", avatarGrad: "from-teal-500 to-cyan-600", region: "Kolkata",
        totalDevices: 2, activeDevices: 2, status: "active", lastSeen: "10m ago",
        devices: [
            { id: "D016", name: "iPhone 13", os: "iOS 16.6", model: "Apple", type: "mobile", status: "active", battery: 38, storage: 82, enrolled: "1 Dec 2023", appCount: 17, mdmProfile: true, encryption: true, passcode: true, lastSync: "10m ago" },
            { id: "D017", name: "Dell XPS 13", os: "Windows 11", model: "Dell", type: "laptop", status: "active", battery: 72, storage: 44, enrolled: "15 Dec 2023", appCount: 29, mdmProfile: true, encryption: true, passcode: true, lastSync: "20m ago" },
        ],
    },
    {
        id: 8, name: "Anita Joshi", email: "anita.joshi@corp.io", role: "Sub Admin",
        avatar: "AJ", avatarGrad: "from-fuchsia-500 to-purple-600", region: "Ahmedabad",
        totalDevices: 2, activeDevices: 1, status: "inactive", lastSeen: "3d ago",
        devices: [
            { id: "D018", name: "Pixel 6a", os: "Android 13", model: "Google", type: "mobile", status: "offline", battery: 5, storage: 60, enrolled: "10 Nov 2023", appCount: 15, mdmProfile: false, encryption: true, passcode: false, lastSync: "3d ago" },
            { id: "D019", name: "iPad 10th Gen", os: "iPadOS 16.5", model: "Apple", type: "tablet", status: "active", battery: 88, storage: 30, enrolled: "12 Nov 2023", appCount: 11, mdmProfile: true, encryption: true, passcode: true, lastSync: "4h ago" },
        ],
    },
    {
        id: 9, name: "Rohan Verma", email: "rohan.verma@corp.io", role: "User",
        avatar: "RV", avatarGrad: "from-lime-500 to-green-600", region: "Jaipur",
        totalDevices: 1, activeDevices: 1, status: "active", lastSeen: "5m ago",
        devices: [
            { id: "D020", name: "Galaxy A54", os: "Android 14", model: "Samsung", type: "mobile", status: "active", battery: 66, storage: 42, enrolled: "5 Feb 2024", appCount: 13, mdmProfile: true, encryption: true, passcode: true, lastSync: "5m ago" },
        ],
    },
    {
        id: 10, name: "Divya Menon", email: "divya.menon@corp.io", role: "User",
        avatar: "DM", avatarGrad: "from-orange-500 to-red-500", region: "Kochi",
        totalDevices: 3, activeDevices: 2, status: "active", lastSeen: "30m ago",
        devices: [
            { id: "D021", name: "iPhone 12", os: "iOS 16.7", model: "Apple", type: "mobile", status: "active", battery: 71, storage: 38, enrolled: "20 Oct 2023", appCount: 20, mdmProfile: true, encryption: true, passcode: true, lastSync: "30m ago" },
            { id: "D022", name: "Surface Go 3", os: "Windows 11 S", model: "Microsoft", type: "tablet", status: "active", battery: 28, storage: 77, enrolled: "25 Oct 2023", appCount: 16, mdmProfile: true, encryption: false, passcode: true, lastSync: "5h ago" },
            { id: "D023", name: "HP Pavilion", os: "Windows 11", model: "HP", type: "laptop", status: "active", battery: 0, storage: 55, enrolled: "1 Nov 2023", appCount: 34, mdmProfile: false, encryption: false, passcode: false, lastSync: "6d ago" },
        ],
    },
    {
        id: 11, name: "Suresh Iyer", email: "suresh.iyer@corp.io", role: "User",
        avatar: "SI", avatarGrad: "from-cyan-500 to-blue-500", region: "Coimbatore",
        totalDevices: 1, activeDevices: 1, status: "active", lastSeen: "1h ago",
        devices: [
            { id: "D024", name: "Moto G84", os: "Android 13", model: "Motorola", type: "mobile", status: "active", battery: 84, storage: 31, enrolled: "28 Jan 2024", appCount: 10, mdmProfile: true, encryption: true, passcode: true, lastSync: "1h ago" },
        ],
    },
    {
        id: 12, name: "Pooja Sharma", email: "pooja.sharma@corp.io", role: "Sub Admin",
        avatar: "PS", avatarGrad: "from-pink-500 to-rose-600", region: "Lucknow",
        totalDevices: 2, activeDevices: 2, status: "active", lastSeen: "8m ago",
        devices: [
            { id: "D025", name: "iPhone 14", os: "iOS 17.2", model: "Apple", type: "mobile", status: "active", battery: 77, storage: 45, enrolled: "14 Feb 2024", appCount: 22, mdmProfile: true, encryption: true, passcode: true, lastSync: "8m ago" },
            { id: "D026", name: "MacBook Air M2", os: "macOS 14.2", model: "Apple", type: "laptop", status: "active", battery: 92, storage: 27, enrolled: "14 Feb 2024", appCount: 38, mdmProfile: true, encryption: true, passcode: true, lastSync: "15m ago" },
        ],
    },
];

const PAGE_SIZE = 5;

const SUMMARY = [
    { label: "Total Users", value: REGISTERED_USERS.length, icon: Users, gradient: "from-violet-400 to-purple-500", bg: "from-violet-50 to-purple-50", border: "border-violet-100" },
    { label: "Total Devices", value: REGISTERED_USERS.reduce((a, u) => a + u.totalDevices, 0), icon: Smartphone, gradient: "from-sky-400 to-blue-500", bg: "from-sky-50 to-blue-50", border: "border-sky-100" },
    { label: "Compliant", value: REGISTERED_USERS.flatMap(u => u.devices).filter(d => d.status === "compliant").length, icon: ShieldCheck, gradient: "from-emerald-400 to-teal-500", bg: "from-emerald-50 to-teal-50", border: "border-emerald-100" },
    { label: "Needs Attention", value: REGISTERED_USERS.flatMap(u => u.devices).filter(d => d.status !== "compliant").length, icon: ShieldAlert, gradient: "from-rose-400 to-pink-500", bg: "from-rose-50 to-pink-50", border: "border-rose-100" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function RoleBadge({ role }) {
    return (
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${role === "Sub Admin" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"}`}>
            {role}
        </span>
    );
}

function UserStatusDot({ status }) {
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            {status}
        </span>
    );
}

function HealthPills({ devices }) {
    const compliant = devices.filter(d => d.status === 'compliant').length;
    const warn = devices.filter(d => d.status === 'warning').length;
    const offline = devices.filter(d => d.status === 'offline').length;
    return (
        <div className="flex items-center gap-1.5 flex-wrap">
            {compliant > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle size={9} /> {compliant}
                </span>
            )}
            {warn > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                    ⚠ {warn}
                </span>
            )}
            {offline > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    <WifiOff size={9} /> {offline}
                </span>
            )}
        </div>
    );
}

// ── Ellipsis Pagination ───────────────────────────────────────────────────────
function Pagination({ current, total, onChange }) {
    if (total <= 1) return null;

    const pages = [];
    const delta = 1; // pages around current

    for (let i = 1; i <= total; i++) {
        if (
            i === 1 ||
            i === total ||
            (i >= current - delta && i <= current + delta)
        ) {
            pages.push(i);
        } else if (
            i === current - delta - 1 ||
            i === current + delta + 1
        ) {
            pages.push('...');
        }
    }

    // dedupe consecutive ellipsis
    const deduped = pages.filter((p, i) => !(p === '...' && pages[i - 1] === '...'));

    return (
        <div className="flex items-center gap-1">
            <button
                onClick={() => onChange(current - 1)}
                disabled={current === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft size={15} />
            </button>

            {deduped.map((p, i) =>
                p === '...' ? (
                    <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-slate-400">
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onChange(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === current
                                ? "bg-violet-600 text-white shadow-sm"
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                onClick={() => onChange(current + 1)}
                disabled={current === total}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight size={15} />
            </button>
        </div>
    );
}

// ── Mobile Card ───────────────────────────────────────────────────────────────
function UserCard({ user, onView }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
            {/* Top row */}
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${user.avatarGrad} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                        <RoleBadge role={user.role} />
                    </div>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
                <UserStatusDot status={user.status} />
            </div>

            {/* Meta row */}
            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 rounded-xl py-2">
                    <p className="text-xs font-bold text-slate-800">{user.totalDevices}</p>
                    <p className="text-[10px] text-slate-400">Devices</p>
                </div>
                <div className="bg-slate-50 rounded-xl py-2">
                    <p className="text-xs font-bold text-slate-800">{user.region}</p>
                    <p className="text-[10px] text-slate-400">Region</p>
                </div>
                <div className="bg-slate-50 rounded-xl py-2">
                    <p className="text-xs font-bold text-slate-800">{user.lastSeen}</p>
                    <p className="text-[10px] text-slate-400">Last seen</p>
                </div>
            </div>

            {/* Health + action */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <HealthPills devices={user.devices} />
                <button
                    onClick={() => onView(user)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors"
                >
                    <Eye size={13} /> View
                </button>
            </div>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export const RegisteredUsers = () => {
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedUser, setSelectedUser] = useState(null);
    const [page, setPage] = useState(1);

    const filtered = REGISTERED_USERS.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.region.toLowerCase().includes(search.toLowerCase());
        const matchRole = filterRole === 'All' || u.role === filterRole;
        const matchStatus = filterStatus === 'All' || u.status === filterStatus;
        return matchSearch && matchRole && matchStatus;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value);
        setPage(1);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    if (selectedUser) {
        return <UserDeviceDetail user={selectedUser} onBack={() => setSelectedUser(null)} />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Registered Users</h1>
                    <p className="text-sm text-slate-400 mt-0.5">All enrolled users and their assigned devices</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-white border border-slate-100 px-3 py-2 rounded-xl">
                    <Cpu size={12} className="text-violet-400" />
                    <span className="hidden sm:inline">All systems operational</span>
                    <span className="sm:hidden">Live</span>
                </div>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {SUMMARY.map(s => (
                    <div key={s.label} className={`rounded-2xl border ${s.border} bg-gradient-to-br ${s.bg} p-4 flex items-center gap-3`}>
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-sm shrink-0`}>
                            <s.icon size={15} className="text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-medium text-slate-500">{s.label}</p>
                            <p className="text-xl font-bold text-slate-800">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or region…"
                            value={search}
                            onChange={handleSearch}
                            className="w-full pl-9 pr-3.5 py-2.5 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
                        />
                    </div>
                    <select
                        value={filterRole}
                        onChange={handleFilterChange(setFilterRole)}
                        className="px-3.5 py-2.5 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
                    >
                        {['All', 'Sub Admin', 'User'].map(r => <option key={r}>{r}</option>)}
                    </select>
                    <select
                        value={filterStatus}
                        onChange={handleFilterChange(setFilterStatus)}
                        className="px-3.5 py-2.5 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
                    >
                        {['All', 'active', 'inactive'].map(s => <option key={s}>{s}</option>)}
                    </select>
                    <button className="flex items-center justify-center gap-2 px-3.5 py-2.5 text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                        <Download size={14} /> <span className="hidden sm:inline">Export</span>
                    </button>
                </div>
            </div>

            {/* ── Mobile cards (< md) ── */}
            <div className="md:hidden space-y-3">
                {paginated.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-100">
                        <Users size={32} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No users match your filters</p>
                    </div>
                ) : (
                    paginated.map(user => (
                        <UserCard key={user.id} user={user} onView={setSelectedUser} />
                    ))
                )}
            </div>

            {/* ── Desktop table (≥ md) ── */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">User</th>
                                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Devices</th>
                                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Region</th>
                                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Status</th>
                                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Last Seen</th>
                                <th className="text-xs font-semibold text-slate-500 px-4 py-3.5">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-16 text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users size={32} className="opacity-30" />
                                            <p className="text-sm">No users match your filters</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginated.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${user.avatarGrad} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                                                {user.avatar}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                                                <p className="text-xs text-slate-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <Smartphone size={13} className="text-slate-400" />
                                            <span className="text-sm font-semibold text-slate-800">{user.totalDevices}</span>
                                            <span className="text-xs text-slate-400">devices</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-slate-600">{user.region}</td>
                                    <td className="px-4 py-4"><UserStatusDot status={user.status} /></td>
                                    <td className="px-4 py-4 text-xs text-slate-500">{user.lastSeen}</td>
                                    <td className="px-4 py-4">
                                        <button
                                            onClick={() => setSelectedUser(user)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors"
                                        >
                                            <Eye size={13} /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination footer */}
                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50">
                    <p className="text-xs text-slate-400">
                        Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} users
                    </p>
                    <Pagination current={page} total={totalPages} onChange={setPage} />
                </div>
            </div>

            {/* Mobile pagination footer */}
            <div className="md:hidden bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                    {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <Pagination current={page} total={totalPages} onChange={setPage} />
            </div>
        </div>
    );
};
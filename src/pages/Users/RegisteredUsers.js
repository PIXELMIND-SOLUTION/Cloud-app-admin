// pages/RegisteredAdmins.js - Optimized with Routing & Saffron Theme (Light) with Edit/Delete
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, Smartphone, Search, Eye, ShieldCheck, ShieldAlert,
    WifiOff, Cpu, Download, CheckCircle, ChevronLeft, ChevronRight, Filter,
    UserX, UserCheck, UserCog, Edit, Trash2, X, Save
} from 'lucide-react';
import { canDelete, canEdit, canExport, canView } from '../../view/Permissions';

// ── Data ─────────────────────────────────────────────────────────────────────
const REGISTERED_ADMINS = [
    {
        id: 1, name: "Raj Mehta", email: "raj.mehta@corp.io", role: "Sub Admin", mobile: "+91 9876543210",
        avatar: "RM", avatarGrad: "from-orange-500 to-amber-600", region: "Mumbai",
        totalDevices: 3, activeDevices: 3, status: "active", lastSeen: "2m ago",
        devices: [
            { id: "D001", name: "iPhone 14 Pro", os: "iOS 17.4", model: "Apple", type: "mobile", status: "active", battery: 82, storage: 61, enrolled: "12 Jan 2024", appCount: 24, mdmProfile: true, encryption: true, passcode: true, lastSync: "5m ago" },
            { id: "D002", name: "iPad Air 5", os: "iPadOS 17.2", model: "Apple", type: "tablet", status: "active", battery: 74, storage: 48, enrolled: "20 Feb 2024", appCount: 18, mdmProfile: true, encryption: true, passcode: true, lastSync: "1h ago" },
            { id: "D003", name: "MacBook Pro 14", os: "macOS 14.3", model: "Apple", type: "laptop", status: "inactive", battery: 45, storage: 78, enrolled: "5 Mar 2024", appCount: 32, mdmProfile: true, encryption: false, passcode: true, lastSync: "3h ago" },
        ],
    },
    {
        id: 2, name: "Priya Nair", email: "priya.nair@corp.io", role: "Admin", mobile: "+91 9876543210",
        avatar: "PN", avatarGrad: "from-amber-400 to-orange-500", region: "Bangalore",
        totalDevices: 2, activeDevices: 1, status: "active", lastSeen: "18m ago",
        devices: [
            { id: "D004", name: "Samsung Galaxy S23", os: "Android 14", model: "Samsung", type: "mobile", status: "active", battery: 47, storage: 78, enrolled: "8 Feb 2024", appCount: 21, mdmProfile: true, encryption: true, passcode: false, lastSync: "2h ago" },
            { id: "D005", name: "Galaxy Tab S9", os: "Android 13", model: "Samsung", type: "tablet", status: "active", battery: 12, storage: 55, enrolled: "15 Mar 2024", appCount: 14, mdmProfile: false, encryption: true, passcode: true, lastSync: "2d ago" },
        ],
    },
    {
        id: 3, name: "Arjun Das", email: "arjun.das@corp.io", role: "Admin", mobile: "+91 9876543210",
        avatar: "AD", avatarGrad: "from-orange-600 to-amber-700", region: "Delhi",
        totalDevices: 4, activeDevices: 4, status: "active", lastSeen: "Just now",
        devices: [
            { id: "D006", name: "Pixel 7 Pro", os: "Android 14", model: "Google", type: "mobile", status: "active", battery: 91, storage: 34, enrolled: "1 Jan 2024", appCount: 28, mdmProfile: true, encryption: true, passcode: true, lastSync: "Just now" },
            { id: "D007", name: "Pixel Watch 2", os: "Wear OS 4", model: "Google", type: "wearable", status: "active", battery: 68, storage: 20, enrolled: "1 Jan 2024", appCount: 8, mdmProfile: true, encryption: true, passcode: true, lastSync: "10m ago" },
            { id: "D008", name: "ThinkPad X1 Carbon", os: "Windows 11 Pro", model: "Lenovo", type: "laptop", status: "active", battery: 76, storage: 45, enrolled: "10 Jan 2024", appCount: 45, mdmProfile: true, encryption: true, passcode: true, lastSync: "30m ago" },
            { id: "D009", name: "iPhone 15", os: "iOS 17.4", model: "Apple", type: "mobile", status: "active", battery: 88, storage: 29, enrolled: "15 Feb 2024", appCount: 19, mdmProfile: true, encryption: true, passcode: true, lastSync: "1h ago" },
        ],
    },
    {
        id: 4, name: "Meera Patel", email: "meera.patel@corp.io", role: "Admin", mobile: "+91 9876543210",
        avatar: "MP", avatarGrad: "from-amber-500 to-yellow-600", region: "Chennai",
        totalDevices: 1, activeDevices: 1, status: "active", lastSeen: "1h ago",
        devices: [
            { id: "D010", name: "iPhone 15 Plus", os: "iOS 17.3", model: "Apple", type: "mobile", status: "active", battery: 95, storage: 28, enrolled: "20 Jan 2024", appCount: 16, mdmProfile: true, encryption: true, passcode: true, lastSync: "1h ago" },
        ],
    },
    {
        id: 5, name: "Vikram Singh", email: "vikram.singh@corp.io", role: "Sub Admin", mobile: "+91 9876543210",
        avatar: "VS", avatarGrad: "from-orange-400 to-amber-500", region: "Hyderabad",
        totalDevices: 3, activeDevices: 2, status: "inactive", lastSeen: "2d ago",
        devices: [
            { id: "D011", name: "iPad Pro 12.9", os: "iPadOS 17.1", model: "Apple", type: "tablet", status: "active", battery: 74, storage: 48, enrolled: "5 Jan 2024", appCount: 22, mdmProfile: true, encryption: true, passcode: true, lastSync: "2d ago" },
            { id: "D012", name: "Surface Pro 9", os: "Windows 11", model: "Microsoft", type: "laptop", status: "active", battery: 0, storage: 62, enrolled: "10 Jan 2024", appCount: 38, mdmProfile: false, encryption: false, passcode: false, lastSync: "5d ago" },
            { id: "D013", name: "Galaxy S22", os: "Android 13", model: "Samsung", type: "mobile", status: "active", battery: 61, storage: 41, enrolled: "15 Jan 2024", appCount: 20, mdmProfile: true, encryption: true, passcode: true, lastSync: "3d ago" },
        ],
    },
    {
        id: 6, name: "Sneha Reddy", email: "sneha.reddy@corp.io", role: "Admin", mobile: "+91 9876543210",
        avatar: "SR", avatarGrad: "from-amber-600 to-orange-700", region: "Pune",
        totalDevices: 2, activeDevices: 2, status: "active", lastSeen: "45m ago",
        devices: [
            { id: "D014", name: "OnePlus 11", os: "Android 14", model: "OnePlus", type: "mobile", status: "active", battery: 79, storage: 37, enrolled: "22 Feb 2024", appCount: 23, mdmProfile: true, encryption: true, passcode: true, lastSync: "45m ago" },
            { id: "D015", name: "iPad Mini 6", os: "iPadOS 16.7", model: "Apple", type: "tablet", status: "active", battery: 33, storage: 71, enrolled: "1 Mar 2024", appCount: 12, mdmProfile: true, encryption: true, passcode: false, lastSync: "6h ago" },
        ],
    },
    {
        id: 7, name: "Kiran Bose", email: "kiran.bose@corp.io", role: "Admin", mobile: "+91 9876543210",
        avatar: "KB", avatarGrad: "from-yellow-500 to-amber-600", region: "Kolkata",
        totalDevices: 2, activeDevices: 2, status: "active", lastSeen: "10m ago",
        devices: [
            { id: "D016", name: "iPhone 13", os: "iOS 16.6", model: "Apple", type: "mobile", status: "active", battery: 38, storage: 82, enrolled: "1 Dec 2023", appCount: 17, mdmProfile: true, encryption: true, passcode: true, lastSync: "10m ago" },
            { id: "D017", name: "Dell XPS 13", os: "Windows 11", model: "Dell", type: "laptop", status: "active", battery: 72, storage: 44, enrolled: "15 Dec 2023", appCount: 29, mdmProfile: true, encryption: true, passcode: true, lastSync: "20m ago" },
        ],
    },
    {
        id: 8, name: "Anita Joshi", email: "anita.joshi@corp.io", role: "Sub Admin", mobile: "+91 9876543210",
        avatar: "AJ", avatarGrad: "from-orange-500 to-amber-600", region: "Ahmedabad",
        totalDevices: 2, activeDevices: 1, status: "inactive", lastSeen: "3d ago",
        devices: [
            { id: "D018", name: "Pixel 6a", os: "Android 13", model: "Google", type: "mobile", status: "offline", battery: 5, storage: 60, enrolled: "10 Nov 2023", appCount: 15, mdmProfile: false, encryption: true, passcode: false, lastSync: "3d ago" },
            { id: "D019", name: "iPad 10th Gen", os: "iPadOS 16.5", model: "Apple", type: "tablet", status: "active", battery: 88, storage: 30, enrolled: "12 Nov 2023", appCount: 11, mdmProfile: true, encryption: true, passcode: true, lastSync: "4h ago" },
        ],
    },
    {
        id: 9, name: "Rohan Verma", email: "rohan.verma@corp.io", role: "Admin", mobile: "+91 9876543210",
        avatar: "RV", avatarGrad: "from-amber-400 to-yellow-500", region: "Jaipur",
        totalDevices: 1, activeDevices: 1, status: "active", lastSeen: "5m ago",
        devices: [
            { id: "D020", name: "Galaxy A54", os: "Android 14", model: "Samsung", type: "mobile", status: "active", battery: 66, storage: 42, enrolled: "5 Feb 2024", appCount: 13, mdmProfile: true, encryption: true, passcode: true, lastSync: "5m ago" },
        ],
    },
    {
        id: 10, name: "Divya Menon", email: "divya.menon@corp.io", role: "Admin", mobile: "+91 9876543210",
        avatar: "DM", avatarGrad: "from-orange-600 to-red-500", region: "Kochi",
        totalDevices: 3, activeDevices: 2, status: "active", lastSeen: "30m ago",
        devices: [
            { id: "D021", name: "iPhone 12", os: "iOS 16.7", model: "Apple", type: "mobile", status: "active", battery: 71, storage: 38, enrolled: "20 Oct 2023", appCount: 20, mdmProfile: true, encryption: true, passcode: true, lastSync: "30m ago" },
            { id: "D022", name: "Surface Go 3", os: "Windows 11 S", model: "Microsoft", type: "tablet", status: "active", battery: 28, storage: 77, enrolled: "25 Oct 2023", appCount: 16, mdmProfile: true, encryption: false, passcode: true, lastSync: "5h ago" },
            { id: "D023", name: "HP Pavilion", os: "Windows 11", model: "HP", type: "laptop", status: "active", battery: 0, storage: 55, enrolled: "1 Nov 2023", appCount: 34, mdmProfile: false, encryption: false, passcode: false, lastSync: "6d ago" },
        ],
    },
    {
        id: 11, name: "Suresh Iyer", email: "suresh.iyer@corp.io", role: "Admin", mobile: "+91 9876543210",
        avatar: "SI", avatarGrad: "from-amber-500 to-orange-600", region: "Coimbatore",
        totalDevices: 1, activeDevices: 1, status: "active", lastSeen: "1h ago",
        devices: [
            { id: "D024", name: "Moto G84", os: "Android 13", model: "Motorola", type: "mobile", status: "active", battery: 84, storage: 31, enrolled: "28 Jan 2024", appCount: 10, mdmProfile: true, encryption: true, passcode: true, lastSync: "1h ago" },
        ],
    },
    {
        id: 12, name: "Pooja Sharma", email: "pooja.sharma@corp.io", role: "Sub Admin", mobile: "+91 9876543210",
        avatar: "PS", avatarGrad: "from-orange-400 to-amber-500", region: "Lucknow",
        totalDevices: 2, activeDevices: 2, status: "active", lastSeen: "8m ago",
        devices: [
            { id: "D025", name: "iPhone 14", os: "iOS 17.2", model: "Apple", type: "mobile", status: "active", battery: 77, storage: 45, enrolled: "14 Feb 2024", appCount: 22, mdmProfile: true, encryption: true, passcode: true, lastSync: "8m ago" },
            { id: "D026", name: "MacBook Air M2", os: "macOS 14.2", model: "Apple", type: "laptop", status: "active", battery: 92, storage: 27, enrolled: "14 Feb 2024", appCount: 38, mdmProfile: true, encryption: true, passcode: true, lastSync: "15m ago" },
        ],
    },
];

const PAGE_SIZE = 5;

const SUMMARY = [
    {
        label: "Total Admins",
        value: REGISTERED_ADMINS.length,
        icon: Users,
        grad: "from-orange-500 to-amber-600",
    },
    {
        label: "Active Admins",
        value: REGISTERED_ADMINS.filter(
            (admin) => admin.status?.toLowerCase() === "active"
        ).length,
        icon: UserCheck,
        grad: "from-green-500 to-emerald-600",
    },
    {
        label: "Inactive Admins",
        value: REGISTERED_ADMINS.filter(
            (admin) => admin.status?.toLowerCase() === "inactive"
        ).length,
        icon: UserX,
        grad: "from-red-500 to-rose-600",
    },
    {
        label: "Total Devices",
        value: REGISTERED_ADMINS.reduce(
            (total, admin) => total + (admin.totalDevices || 0),
            0
        ),
        icon: Smartphone,
        grad: "from-amber-400 to-orange-500",
    },
];

// ── Reusable Components ──────────────────────────────────────────────────
const AdminStatusDot = ({ status }) => (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: status === 'active' ? '#FF7D38' : '#64748b' }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: status === 'active' ? '#FF7D38' : '#475569' }} />
        {status}
    </span>
);

const HealthPills = ({ devices }) => {
    const counts = {
        compliant: devices.filter(d => d.status === 'compliant').length,
        warning: devices.filter(d => d.status === 'warning').length,
        offline: devices.filter(d => d.status === 'offline').length
    };
    const pills = [
        { key: 'compliant', label: <CheckCircle size={9} />, color: '#FF7D38', bg: 'rgba(255,125,56,0.15)' },
        { key: 'warning', label: '⚠', color: '#fcd34d', bg: 'rgba(251,191,36,0.12)' },
        { key: 'offline', label: <WifiOff size={9} />, color: '#94a3b8', bg: 'rgba(100,116,139,0.15)' }
    ];
    return (
        <div className="flex items-center gap-1.5 flex-wrap">
            {pills.map(({ key, label, color, bg }) => counts[key] > 0 && (
                <span key={key} className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: bg, color }}>
                    {label} {counts[key]}
                </span>
            ))}
        </div>
    );
};

const Pagination = ({ current, total, onChange }) => {
    if (total <= 1) return null;
    const pages = [];
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) pages.push(i);
        else if (i === current - 2 || i === current + 2) pages.push('...');
    }
    const deduped = pages.filter((p, i) => !(p === '...' && pages[i - 1] === '...'));

    return (
        <div className="flex items-center gap-1">
            <button onClick={() => onChange(current - 1)} disabled={current === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-orange-400 hover:bg-orange-50">
                <ChevronLeft size={15} />
            </button>
            {deduped.map((p, i) =>
                p === '...' ? (
                    <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
                ) : (
                    <button key={p} onClick={() => onChange(p)}
                        className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
                        style={p === current
                            ? { background: 'linear-gradient(135deg,#FF7D38,#FF6B1A)', color: '#fff', boxShadow: '0 0 10px rgba(255,125,56,0.4)' }
                            : { color: '#4a4a4a' }}>
                        {p}
                    </button>
                )
            )}
            <button onClick={() => onChange(current + 1)} disabled={current === total}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-orange-400 hover:bg-orange-50">
                <ChevronRight size={15} />
            </button>
        </div>
    );
};

const Panel = ({ children, className = "" }) => (
    <div className={`rounded-2xl bg-white ${className}`} style={{
        border: '1px solid rgba(255,125,56,0.2)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
    }}>
        {children}
    </div>
);

// ── Edit Admin Modal ──────────────────────────────────────────────────────
const EditAdminModal = ({ admin, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    React.useEffect(() => {
        if (admin) {
            setFormData({
                name: admin.name || '',
                email: admin.email || '',
                mobile: admin.mobile || '',
                role: admin.role || 'Admin',
                region: admin.region || '',
                status: admin.status || 'active'
            });
        }
    }, [admin]);

    if (!isOpen || !admin) return null;

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';
        if (!formData.region.trim()) newErrors.region = 'Region is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onSave({ ...admin, ...formData });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col bg-white border border-orange-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-orange-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                            <UserCog size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Edit Admin</h2>
                            <p className="text-xs text-gray-500">Update admin information</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-orange-50 text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-600">Full Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                                placeholder="Enter full name"
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-600">Email *</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                                placeholder="Enter email"
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-600">Mobile *</label>
                            <input
                                type="text"
                                value={formData.mobile}
                                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                                placeholder="Enter mobile number"
                            />
                            {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-600">Role</label>
                            <select
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                            >
                                <option value="Admin">Admin</option>
                                <option value="Sub Admin">Sub Admin</option>
                                <option value="Super Admin">Super Admin</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-600">Region *</label>
                            <input
                                type="text"
                                value={formData.region}
                                onChange={e => setFormData({ ...formData, region: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                                placeholder="Enter region"
                            />
                            {errors.region && <p className="mt-1 text-xs text-red-500">{errors.region}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-600">Status</label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </form>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-orange-100 rounded-b-2xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-xl transition-colors text-gray-600 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-orange-500/30 shadow-sm">
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Admin Card ──────────────────────────────────────────────────────────────
const AdminCard = ({ admin, onView, onEdit, onDelete }) => (
    <Panel className="p-4 space-y-3 hover:shadow-lg transition-all">
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${admin.avatarGrad} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg`}>
                {admin.avatar}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold truncate text-gray-800">{admin.name}</p>
                </div>
                <p className="text-xs truncate text-gray-500">{admin.email}</p>
            </div>
            <AdminStatusDot status={admin.status} />
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
            {[
                { val: admin.totalDevices, label: 'Devices' },
                { val: admin.region, label: 'Region' },
                { val: admin.lastSeen, label: 'Last seen' },
            ].map(item => (
                <div key={item.label} className="rounded-xl py-2 bg-orange-50 border border-orange-200">
                    <p className="text-xs font-bold text-orange-500">{item.val}</p>
                    <p className="text-[10px] text-gray-500">{item.label}</p>
                </div>
            ))}
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-orange-200">
            <HealthPills devices={admin.devices} />
            <div className="flex items-center gap-1.5">
                <button onClick={() => onView(admin.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl transition-all bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-100 hover:scale-105">
                    <Eye size={13} /> View
                </button>
                <button onClick={() => onEdit(admin)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl transition-all bg-blue-50 text-blue-500 border border-blue-200 hover:bg-blue-100 hover:scale-105">
                    <Edit size={13} /> Edit
                </button>
                <button onClick={() => onDelete(admin.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl transition-all bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 hover:scale-105">
                    <Trash2 size={13} /> Delete
                </button>
            </div>
        </div>
    </Panel>
);

// ── Main Component ────────────────────────────────────────────────────────
export const RegisteredUsers = () => {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState(REGISTERED_ADMINS);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [page, setPage] = useState(1);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Check permissions for the 'users' component
    const hasViewPermission = canView('users');
    const hasEditPermission = canEdit('users');
    const hasDeletePermission = canDelete('users');
    const hasExportPermission = canExport('users');

    const filtered = admins.filter(admin => {
        const matchSearch = admin.name.toLowerCase().includes(search.toLowerCase()) ||
            admin.email.toLowerCase().includes(search.toLowerCase()) ||
            admin.region.toLowerCase().includes(search.toLowerCase());
        const matchRole = filterRole === 'All' || admin.role === filterRole;
        const matchStatus = filterStatus === 'All' || admin.status === filterStatus;
        return matchSearch && matchRole && matchStatus;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleViewAdmin = (adminId) => {
        navigate(`/admin/user/${adminId}`);
    };

    const handleEditAdmin = (admin) => {
        setEditingAdmin(admin);
        setIsEditModalOpen(true);
    };

    const handleSaveAdmin = (updatedAdmin) => {
        setAdmins(prev => prev.map(a => a.id === updatedAdmin.id ? updatedAdmin : a));
    };

    const handleDeleteAdmin = (adminId) => {
        if (!window.confirm('Are you sure you want to delete this admin? This action cannot be undone.')) return;
        setAdmins(prev => prev.filter(a => a.id !== adminId));
    };

    const handleFilterChange = setter => e => { setter(e.target.value); setPage(1); };

    return (
        <div className="space-y-6 bg-gray-50 min-h-screen p-4 rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-2 bg-white p-4 rounded-2xl border border-orange-200 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Registered Admins</h1>
                    <p className="text-sm mt-0.5 text-gray-500">All enrolled admins and their assigned devices</p>
                </div>
                <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-gray-50 border border-orange-200 text-gray-600">
                    <Cpu size={12} className="text-orange-500" />
                    
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {SUMMARY.map(s => (
                    <div
                        key={s.label}
                        className="relative overflow-hidden rounded-2xl p-4 flex items-center gap-3 transition-all hover:scale-105 bg-white border border-orange-200 shadow-sm hover:shadow-md"
                    >
                        <div className="absolute -top-8 -left-8 w-20 h-20 rounded-full bg-orange-400/10" />
                        <div className="absolute -top-3 -left-3 w-28 h-28 rounded-full border border-orange-300/20" />
                        <div className="absolute -bottom-5 -right-5 w-12 h-12 rounded-full bg-orange-400/10" />

                        <div className="relative w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-lg">
                            <s.icon size={15} className="text-orange-500" />
                        </div>

                        <div className="relative">
                            <p className="text-[10px] font-medium text-gray-500">{s.label}</p>
                            <p className="text-xl font-bold text-orange-500">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <Panel className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or region…"
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all bg-white border border-orange-200 text-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                        />
                    </div>
                    {[
                        { value: filterRole, setter: setFilterRole, opts: ['All', 'Sub Admin', 'Admin'] },
                        { value: filterStatus, setter: setFilterStatus, opts: ['All', 'active', 'inactive'] },
                    ].map((sel, i) => (
                        <select key={i} value={sel.value} onChange={handleFilterChange(sel.setter)}
                            className="px-3.5 py-2.5 text-sm rounded-xl bg-white border border-orange-200 text-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-200">
                            {sel.opts.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    ))}
                    {hasExportPermission && (
                        <button className="flex items-center justify-center gap-2 px-3.5 py-2.5 text-sm rounded-xl transition-all bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-100">
                            <Download size={14} /> <span className="hidden sm:inline">Export</span>
                        </button>
                    )}
                </div>
            </Panel>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
                {paginated.length === 0 ? (
                    <div className="text-center py-16 rounded-2xl bg-white border border-orange-200 text-gray-500">
                        <Users size={32} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No admins match your filters</p>
                    </div>
                ) : paginated.map(admin => (
                    <AdminCard
                        key={admin.id}
                        admin={admin}
                        onView={handleViewAdmin}
                        onEdit={handleEditAdmin}
                        onDelete={handleDeleteAdmin}
                    />
                ))}
            </div>

            {/* Desktop table */}
            <Panel className="hidden md:block overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-orange-200 bg-orange-50">
                                {['Admin', 'Mobile', 'Devices', 'Region', 'Status', 'Last Seen', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-xs font-semibold px-5 py-3.5 text-gray-600">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-16 text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users size={32} className="opacity-30" />
                                            <p className="text-sm">No admins match your filters</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginated.map((admin, idx) => (
                                <tr key={admin.id}
                                    className={`${idx < paginated.length - 1 ? 'border-b border-orange-100' : ''} hover:bg-orange-50 transition-colors`}>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${admin.avatarGrad} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md`}>
                                                {admin.avatar}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">{admin.name}</p>
                                                <p className="text-xs text-gray-500">{admin.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-600">{admin.mobile}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <Smartphone size={13} className="text-gray-400" />
                                            <span className="text-sm font-semibold text-orange-500">{admin.totalDevices}</span>
                                            <span className="text-xs text-gray-500">devices</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-600">{admin.region}</td>
                                    <td className="px-4 py-4"><AdminStatusDot status={admin.status} /></td>
                                    <td className="px-4 py-4 text-xs text-gray-500">{admin.lastSeen}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1.5">
                                            {hasViewPermission && (
                                                <button onClick={() => handleViewAdmin(admin.id)}
                                                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-100">
                                                    <Eye size={13} />
                                                </button>
                                            )}
                                            {hasEditPermission && (
                                                <button onClick={() => handleEditAdmin(admin)}
                                                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all bg-blue-50 text-blue-500 border border-blue-200 hover:bg-blue-100">
                                                    <Edit size={13} />
                                                </button>
                                            )}
                                            {hasDeletePermission && (
                                                <button onClick={() => handleDeleteAdmin(admin.id)}
                                                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all bg-red-50 text-red-500 border border-red-200 hover:bg-red-100">
                                                    <Trash2 size={13} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-5 py-3 flex items-center justify-between border-t border-orange-200 bg-orange-50">
                    <p className="text-xs text-gray-600">
                        Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} admins
                    </p>
                    <Pagination current={page} total={totalPages} onChange={setPage} />
                </div>
            </Panel>

            {/* Mobile pagination */}
            <Panel className="md:hidden px-4 py-3 flex items-center justify-between">
                <p className="text-xs text-gray-600">
                    {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <Pagination current={page} total={totalPages} onChange={setPage} />
            </Panel>

            {/* Edit Modal */}
            <EditAdminModal
                admin={editingAdmin}
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingAdmin(null);
                }}
                onSave={handleSaveAdmin}
            />
        </div>
    );
};

export default RegisteredUsers;
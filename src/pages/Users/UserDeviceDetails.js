// pages/AdminDeviceDetails.jsx - Fully Responsive Admin Details Page with Light Theme
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Smartphone, Laptop, Tablet, Watch,
    CheckCircle, XCircle, AlertCircle, Battery, HardDrive,
    Calendar, Clock, Shield, Lock, Wifi, Cpu, User, Mail, Phone, MapPin, Briefcase,
    ChevronUp, ChevronDown, UserCog
} from 'lucide-react';

// ── Data (same as above) ─────────────────────────────────────────────────────
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

// ── Reusable Components ──────────────────────────────────────────────────

const Panel = ({ children, className = "" }) => (
    <div
        className={`rounded-2xl bg-white ${className}`}
        style={{
            border: '1px solid rgba(255,125,56,0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}
    >
        {children}
    </div>
);

const StatusBadge = ({ status }) => {
    const configs = {
        active: { color: '#FF7D38', bg: 'rgba(255,125,56,0.15)', icon: CheckCircle },
        inactive: { color: '#64748b', bg: 'rgba(100,116,139,0.1)', icon: XCircle },
        offline: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: AlertCircle },
        warning: { color: '#d97706', bg: 'rgba(217,119,6,0.1)', icon: AlertCircle },
    };
    const config = configs[status] || configs.inactive;
    const Icon = config.icon;
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
            style={{ color: config.color, background: config.bg }}
        >
            <Icon size={12} /> {status}
        </span>
    );
};

const DeviceTypeIcon = ({ type }) => {
    const icons = {
        mobile: Smartphone,
        tablet: Tablet,
        laptop: Laptop,
        wearable: Watch,
    };
    const Icon = icons[type] || Smartphone;
    return <Icon size={18} className="shrink-0 text-orange-500" />;
};

const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 gap-1 sm:gap-4 border-b border-orange-100">
        <span className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            {Icon && <Icon size={14} className="shrink-0" />}
            <span className="font-medium">{label}</span>
        </span>
        <span className="text-xs sm:text-sm font-medium break-all text-orange-500">{value}</span>
    </div>
);

const DeviceCard = ({ device }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className="rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-white border border-orange-200"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div
                        className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl bg-orange-50"
                    >
                        <DeviceTypeIcon type={device.type} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm md:text-base truncate pr-2 text-gray-800">
                            {device.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                            {device.model} • {device.os}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    <StatusBadge status={device.status} />
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors shrink-0 bg-orange-50 text-orange-500 hover:bg-orange-100 hover:scale-110"
                    >
                        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                </div>
            </div>

            {/* Expanded Details */}
            {expanded && (
                <>
                    <div className="my-4 border-t border-orange-100" />

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                        <InfoRow label="Device ID" value={device.id} />
                        <InfoRow label="Enrolled" value={device.enrolled} icon={Calendar} />
                        <InfoRow label="Battery" value={`${device.battery}%`} icon={Battery} />
                        <InfoRow label="Storage" value={`${device.storage}% used`} icon={HardDrive} />
                        <InfoRow label="Apps" value={device.appCount} icon={Cpu} />
                        <InfoRow label="Last Sync" value={device.lastSync} icon={Clock} />
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {device.mdmProfile && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 bg-orange-50 text-orange-500">
                                <Shield size={12} /> MDM Profile
                            </span>
                        )}
                        {device.encryption && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 bg-amber-50 text-amber-600">
                                <Lock size={12} /> Encrypted
                            </span>
                        )}
                        {device.passcode && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 bg-gray-50 text-gray-600">
                                <Lock size={12} /> Passcode
                            </span>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────

export const UserDeviceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const admin = REGISTERED_ADMINS.find(u => u.id === parseInt(id));

    if (!admin) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4 bg-gray-50">
                <div className="text-center max-w-sm bg-white p-8 rounded-2xl border border-orange-200 shadow-sm">
                    <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
                    <h2 className="text-2xl font-bold text-gray-800">Admin Not Found</h2>
                    <p className="mt-2 text-sm text-gray-500">The admin you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/admin/admins')}
                        className="mt-6 px-6 py-2.5 rounded-xl transition-all text-sm font-medium hover:scale-105 bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-100"
                    >
                        ← Back to Admins
                    </button>
                </div>
            </div>
        );
    }

    const stats = {
        total: admin.devices.length,
        active: admin.devices.filter(d => d.status === 'active').length,
        offline: admin.devices.filter(d => d.status === 'offline').length,
        warning: admin.devices.filter(d => d.status === 'warning').length,
    };

    return (
        <div className="space-y-4 md:space-y-6 px-2 sm:px-0 bg-gray-50 min-h-screen p-4 rounded-2xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-white p-4 rounded-2xl border border-orange-200 shadow-sm">
                <button
                    onClick={() => navigate('/admin/users')}
                    className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all text-sm shrink-0 hover:scale-105 bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-100"
                >
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">Back to Admins</span>
                    <span className="sm:hidden">Back</span>
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate text-gray-800">
                            {admin.name}
                        </h1>
                        <StatusBadge status={admin.status} />
                    </div>
                    <p className="text-xs sm:text-sm truncate text-gray-500">
                        {admin.email} • {admin.role}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {[
                    { label: 'Total Devices', value: stats.total, icon: Smartphone },
                    { label: 'Active', value: stats.active, icon: CheckCircle, color: '#FF7D38' },
                    { label: 'Warning', value: stats.warning, icon: AlertCircle, color: '#d97706' },
                    { label: 'Offline', value: stats.offline, icon: XCircle, color: '#ef4444' },
                ].map(stat => (
                    <div
                        key={stat.label}
                        className="relative overflow-hidden rounded-2xl p-3 sm:p-4 text-center transition-all hover:scale-105 bg-white border border-orange-200 shadow-sm hover:shadow-lg"
                    >
                        {/* Decorative Background */}
                        <div className="absolute -top-8 -left-8 w-20 h-20 rounded-full bg-orange-400/10" />
                        <div className="absolute -top-4 -left-4 w-28 h-28 rounded-full border border-orange-300/20" />
                        <div className="absolute -top-8 -left-8 w-36 h-36 rounded-full border border-orange-300/10" />

                        <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-orange-400/10" />

                        {/* Content */}
                        <div className="relative z-10">
                            <stat.icon
                                size={18}
                                className="mx-auto mb-1.5"
                                style={{ color: stat.color || "#FF7D38" }}
                            />

                            <p className="text-xl sm:text-2xl font-bold text-orange-500">
                                {stat.value}
                            </p>

                            <p className="text-[10px] sm:text-xs text-gray-500">
                                {stat.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Admin Information */}
            <Panel className="p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-gray-800">
                    <UserCog size={18} className="text-orange-500" /> Admin Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    <InfoRow label="Full Name" value={admin.name} icon={User} />
                    <InfoRow label="Email" value={admin.email} icon={Mail} />
                    <InfoRow label="Mobile" value={admin.mobile} icon={Phone} />
                    <InfoRow label="Region" value={admin.region} icon={MapPin} />
                    <InfoRow label="Role" value={admin.role} icon={Briefcase} />
                    <InfoRow label="Last Seen" value={admin.lastSeen} icon={Clock} />
                </div>
            </Panel>

            {/* Devices */}
            <div>
                <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-gray-800">
                    <Smartphone size={18} className="text-orange-500" />
                    Devices ({admin.devices.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                    {admin.devices.map((device) => (
                        <DeviceCard key={device.id} device={device} />
                    ))}
                </div>
            </div>
        </div>
    );
};
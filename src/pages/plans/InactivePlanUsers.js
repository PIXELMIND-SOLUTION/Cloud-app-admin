// pages/InactivePlanUsers.js - With Pagination & Saffron Theme
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Search, UserX, Users, Calendar, Smartphone,
    Mail, Building, Clock, ArrowLeft, AlertCircle,
    Filter, Grid, List, Download, RefreshCw, Eye,
    ChevronLeft, ChevronRight
} from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────
const REGISTERED_USERS = [
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
        id: 2, name: "Priya Nair", email: "priya.nair@corp.io", role: "User", mobile: "+91 9876543210",
        avatar: "PN", avatarGrad: "from-amber-400 to-orange-500", region: "Bangalore",
        totalDevices: 2, activeDevices: 1, status: "active", lastSeen: "18m ago",
        devices: [
            { id: "D004", name: "Samsung Galaxy S23", os: "Android 14", model: "Samsung", type: "mobile", status: "active", battery: 47, storage: 78, enrolled: "8 Feb 2024", appCount: 21, mdmProfile: true, encryption: true, passcode: false, lastSync: "2h ago" },
            { id: "D005", name: "Galaxy Tab S9", os: "Android 13", model: "Samsung", type: "tablet", status: "active", battery: 12, storage: 55, enrolled: "15 Mar 2024", appCount: 14, mdmProfile: false, encryption: true, passcode: true, lastSync: "2d ago" },
        ],
    },
    {
        id: 3, name: "Arjun Das", email: "arjun.das@corp.io", role: "User", mobile: "+91 9876543210",
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
        id: 4, name: "Meera Patel", email: "meera.patel@corp.io", role: "User", mobile: "+91 9876543210",
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
        id: 6, name: "Sneha Reddy", email: "sneha.reddy@corp.io", role: "User", mobile: "+91 9876543210",
        avatar: "SR", avatarGrad: "from-amber-600 to-orange-700", region: "Pune",
        totalDevices: 2, activeDevices: 2, status: "active", lastSeen: "45m ago",
        devices: [
            { id: "D014", name: "OnePlus 11", os: "Android 14", model: "OnePlus", type: "mobile", status: "active", battery: 79, storage: 37, enrolled: "22 Feb 2024", appCount: 23, mdmProfile: true, encryption: true, passcode: true, lastSync: "45m ago" },
            { id: "D015", name: "iPad Mini 6", os: "iPadOS 16.7", model: "Apple", type: "tablet", status: "active", battery: 33, storage: 71, enrolled: "1 Mar 2024", appCount: 12, mdmProfile: true, encryption: true, passcode: false, lastSync: "6h ago" },
        ],
    },
    {
        id: 7, name: "Kiran Bose", email: "kiran.bose@corp.io", role: "User", mobile: "+91 9876543210",
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
        id: 9, name: "Rohan Verma", email: "rohan.verma@corp.io", role: "User", mobile: "+91 9876543210",
        avatar: "RV", avatarGrad: "from-amber-400 to-yellow-500", region: "Jaipur",
        totalDevices: 1, activeDevices: 1, status: "active", lastSeen: "5m ago",
        devices: [
            { id: "D020", name: "Galaxy A54", os: "Android 14", model: "Samsung", type: "mobile", status: "active", battery: 66, storage: 42, enrolled: "5 Feb 2024", appCount: 13, mdmProfile: true, encryption: true, passcode: true, lastSync: "5m ago" },
        ],
    },
    {
        id: 10, name: "Divya Menon", email: "divya.menon@corp.io", role: "User", mobile: "+91 9876543210",
        avatar: "DM", avatarGrad: "from-orange-600 to-red-500", region: "Kochi",
        totalDevices: 3, activeDevices: 2, status: "active", lastSeen: "30m ago",
        devices: [
            { id: "D021", name: "iPhone 12", os: "iOS 16.7", model: "Apple", type: "mobile", status: "active", battery: 71, storage: 38, enrolled: "20 Oct 2023", appCount: 20, mdmProfile: true, encryption: true, passcode: true, lastSync: "30m ago" },
            { id: "D022", name: "Surface Go 3", os: "Windows 11 S", model: "Microsoft", type: "tablet", status: "active", battery: 28, storage: 77, enrolled: "25 Oct 2023", appCount: 16, mdmProfile: true, encryption: false, passcode: true, lastSync: "5h ago" },
            { id: "D023", name: "HP Pavilion", os: "Windows 11", model: "HP", type: "laptop", status: "active", battery: 0, storage: 55, enrolled: "1 Nov 2023", appCount: 34, mdmProfile: false, encryption: false, passcode: false, lastSync: "6d ago" },
        ],
    },
    {
        id: 11, name: "Suresh Iyer", email: "suresh.iyer@corp.io", role: "User", mobile: "+91 9876543210",
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

const Panel = ({ children, className = "" }) => (
    <div
        className={`rounded-2xl ${className}`}
        style={{
            background: 'linear-gradient(135deg, rgba(255,125,56,0.12), rgba(255,107,26,0.08))',
            border: '1px solid rgba(255,125,56,0.25)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(255,125,56,0.1)'
        }}
    >
        {children}
    </div>
);

// ── Pagination Component ──────────────────────────────────────────────────────

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }

        range.forEach((i) => {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        });

        return rangeWithDots;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t" style={{ borderColor: 'rgba(255,125,56,0.1)' }}>
            <p className="text-xs" style={{ color: '#FF9A5F' }}>
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}–
                {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} users
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ color: '#FF9A5F' }}
                    onMouseEnter={e => { if (currentPage > 1) e.currentTarget.style.background = 'rgba(255,125,56,0.12)'; }}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <ChevronLeft size={15} />
                </button>

                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span key={`dots-${index}`} className="w-8 h-8 flex items-center justify-center text-xs" style={{ color: '#FF9A5F' }}>…</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
                            style={page === currentPage
                                ? { background: 'linear-gradient(135deg,#FF7D38,#FF6B1A)', color: '#fff', boxShadow: '0 0 15px rgba(255,125,56,0.4)' }
                                : { color: '#FF9A5F' }
                            }
                            onMouseEnter={e => { if (page !== currentPage) e.currentTarget.style.background = 'rgba(255,125,56,0.12)'; }}
                            onMouseLeave={e => { if (page !== currentPage) e.currentTarget.style.background = 'transparent'; }}
                        >
                            {page}
                        </button>
                    )
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ color: '#FF9A5F' }}
                    onMouseEnter={e => { if (currentPage < totalPages) e.currentTarget.style.background = 'rgba(255,125,56,0.12)'; }}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <ChevronRight size={15} />
                </button>
            </div>
        </div>
    );
};

// ── Inactive Users Component ──────────────────────────────────────────────────

export const InactivePlanUsers = () => {
    const navigate = useNavigate();
    const { planId } = useParams();
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [sortBy, setSortBy] = useState('lastSeen');
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;

    const plan = { id: parseInt(planId), name: "Professional Plan" };

    // Get inactive users
    const inactiveUsers = REGISTERED_USERS.filter(user => user.status === 'inactive');
    const storedUsers = JSON.parse(localStorage.getItem('planUsers') || '[]');
    const storedInactiveUsers = storedUsers.filter(u => u.planId === parseInt(planId) && u.status === 'inactive');
    const allInactiveUsers = inactiveUsers.length > 0 ? inactiveUsers : storedInactiveUsers;

    const getDaysInactive = (user) => {
        const lastSeen = user.lastSeen || '';
        if (lastSeen.includes('d')) return parseInt(lastSeen);
        return 0;
    };

    // Filter and sort users
    const filteredUsers = useMemo(() => {
        return allInactiveUsers.filter(u => {
            const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
                u.email?.toLowerCase().includes(search.toLowerCase()) ||
                u.region?.toLowerCase().includes(search.toLowerCase()) ||
                u.company?.toLowerCase().includes(search.toLowerCase());
            const matchRole = filterRole === 'All' || u.role === filterRole;
            return matchSearch && matchRole;
        });
    }, [allInactiveUsers, search, filterRole]);

    const sortedUsers = useMemo(() => {
        return [...filteredUsers].sort((a, b) => {
            if (sortBy === 'name') return a.name?.localeCompare(b.name);
            if (sortBy === 'lastSeen') {
                const daysA = getDaysInactive(a);
                const daysB = getDaysInactive(b);
                return daysB - daysA;
            }
            return 0;
        });
    }, [filteredUsers, sortBy]);

    // Pagination
    const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = sortedUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const roles = ['All', ...new Set(allInactiveUsers.map(u => u.role).filter(Boolean))];
    const handleUserClick = (user) => navigate(`/admin/user/${user.id}`);

    const getInactivityReason = (user) => {
        const days = getDaysInactive(user);
        if (days > 30) return 'Long-term inactive';
        if (days > 14) return 'Recently inactive';
        return 'Temporarily inactive';
    };

    const UserCard = ({ user }) => {
        const reason = getInactivityReason(user);
        const days = getDaysInactive(user);

        return (
            <div
                className="rounded-xl p-4 transition-all duration-200 opacity-75 hover:opacity-100 cursor-pointer"
                style={{
                    background: 'rgba(255,125,56,0.04)',
                    border: '1px solid rgba(255,125,56,0.08)'
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,125,56,0.12)';
                    e.currentTarget.style.borderColor = 'rgba(255,125,56,0.2)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,125,56,0.1)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,125,56,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255,125,56,0.08)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => handleUserClick(user)}
            >
                <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${user.avatarGrad || 'from-gray-500 to-gray-600'} flex items-center justify-center text-white text-sm font-bold shrink-0 grayscale`}>
                        {user.avatar || user.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-semibold truncate" style={{ color: '#FF9A5F' }}>{user.name}</p>
                                <p className="text-xs truncate flex items-center gap-1" style={{ color: '#FF9A5F' }}>
                                    <Mail size={10} /> {user.email}
                                </p>
                            </div>
                            <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
                                style={{ background: 'rgba(100,116,139,0.12)', color: '#94a3b8' }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                Inactive
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,125,56,0.12)', color: '#FF7D38' }}>
                                {user.role || 'User'}
                            </span>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: 'rgba(255,125,56,0.08)', color: '#FF9A5F' }}>
                                <Building size={10} /> {user.company || user.region || 'N/A'}
                            </span>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: 'rgba(255,125,56,0.08)', color: '#FF9A5F' }}>
                                <Smartphone size={10} /> {user.totalDevices || user.deviceCount || 0} devices
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 mt-2">
                            <div className="flex flex-wrap items-center gap-2 text-[10px]" style={{ color: '#FF9A5F' }}>
                                <span className="flex items-center gap-1">
                                    <Calendar size={10} />
                                    Joined {user.enrolled ? new Date(user.enrolled).toLocaleDateString() : 'N/A'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={10} />
                                    Last seen {user.lastSeen || 'Unknown'}
                                </span>
                            </div>
                            {days > 0 && (
                                <div className="flex items-center gap-1.5 text-[10px]">
                                    <AlertCircle size={10} style={{ color: '#f59e0b' }} />
                                    <span style={{ color: '#f59e0b' }}>{reason}</span>
                                    <span style={{ color: '#FF9A5F' }}>({days} days)</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Reset page when search/filter/sort changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search, filterRole, sortBy]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <button
                        onClick={() => navigate('/admin/plans')}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm"
                        style={{
                            background: 'rgba(255,125,56,0.15)',
                            color: '#FF7D38',
                            border: '1px solid rgba(255,125,56,0.25)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,125,56,0.25)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,125,56,0.15)'}
                    >
                        <ArrowLeft size={16} /> Back to Plans
                    </button>
                    <div>
                        <h1 className="text-lg sm:text-xl font-bold" style={{ color: '#FF7D38' }}>Inactive Users</h1>
                        <p className="text-xs sm:text-sm" style={{ color: '#FF9A5F' }}>
                            {plan.name} • {allInactiveUsers.length} inactive subscribers
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,125,56,0.2)' }}>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-orange-500/20' : ''}`}
                            style={{ color: viewMode === 'grid' ? '#FF7D38' : '#FF9A5F' }}
                        >
                            <Grid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-orange-500/20' : ''}`}
                            style={{ color: viewMode === 'list' ? '#FF7D38' : '#FF9A5F' }}
                        >
                            <List size={16} />
                        </button>
                    </div>
                    <button className="p-2 rounded-lg transition-colors" style={{ color: '#FF9A5F' }}>
                        <RefreshCw size={16} />
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-sm" style={{ color: '#FF9A5F' }}>
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {[
                    { label: 'Total Inactive', value: allInactiveUsers.length, icon: UserX, color: '#94a3b8' },
                    { label: 'Long-term (>30d)', value: allInactiveUsers.filter(u => getDaysInactive(u) > 30).length, icon: AlertCircle, color: '#f87171' },
                    { label: 'Recent (14-30d)', value: allInactiveUsers.filter(u => getDaysInactive(u) > 14 && getDaysInactive(u) <= 30).length, icon: Clock, color: '#f59e0b' },
                    { label: 'With Devices', value: allInactiveUsers.filter(u => u.totalDevices > 0).length, icon: Smartphone, color: '#60a5fa' },
                ].map(stat => (
                    <div key={stat.label} className="rounded-2xl p-3 sm:p-4 text-center" style={{ background: 'rgba(2,32,60,0.8)', border: '1px solid rgba(255,125,56,0.15)' }}>
                        <stat.icon size={16} className="mx-auto mb-1" style={{ color: stat.color }} />
                        <p className="text-lg sm:text-xl font-bold" style={{ color: '#FF7D38' }}>{stat.value}</p>
                        <p className="text-[10px] sm:text-xs" style={{ color: '#FF9A5F' }}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <Panel className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#FF9A5F' }} />
                        <input
                            type="text"
                            placeholder="Search inactive users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all"
                            style={{
                                background: 'rgba(255,125,56,0.08)',
                                border: '1px solid rgba(255,125,56,0.2)',
                                color: '#FF7D38'
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,125,56,0.5)'}
                            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,125,56,0.2)'}
                        />
                    </div>
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-3.5 py-2.5 text-sm rounded-xl transition-all"
                        style={{
                            background: 'rgba(255,125,56,0.08)',
                            border: '1px solid rgba(255,125,56,0.2)',
                            color: '#FF7D38'
                        }}
                    >
                        {roles.map(role => (
                            <option key={role} value={role} style={{ background: '#02203C', color: '#FF7D38' }}>{role}</option>
                        ))}
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3.5 py-2.5 text-sm rounded-xl transition-all"
                        style={{
                            background: 'rgba(255,125,56,0.08)',
                            border: '1px solid rgba(255,125,56,0.2)',
                            color: '#FF7D38'
                        }}
                    >
                        <option value="lastSeen" style={{ background: '#02203C', color: '#FF7D38' }}>Last Seen</option>
                        <option value="name" style={{ background: '#02203C', color: '#FF7D38' }}>Name</option>
                    </select>
                    <div className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl whitespace-nowrap" style={{ color: '#FF9A5F', background: 'rgba(255,125,56,0.08)', border: '1px solid rgba(255,125,56,0.15)' }}>
                        <Users size={14} />
                        <span>{sortedUsers.length} users</span>
                    </div>
                </div>
            </Panel>

            {/* User Grid */}
            {sortedUsers.length === 0 ? (
                <div className="text-center py-16 rounded-2xl" style={{ background: 'rgba(2,32,60,0.8)', border: '1px solid rgba(255,125,56,0.15)' }}>
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(255,125,56,0.08)' }}>
                        <UserX size={32} style={{ color: '#FF9A5F' }} />
                    </div>
                    <p className="text-sm font-medium" style={{ color: '#FF7D38' }}>No inactive users found</p>
                    <p className="text-xs mt-1" style={{ color: '#FF9A5F' }}>Try adjusting your search or filters</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {paginatedUsers.map(user => <UserCard key={user.id} user={user} />)}
                </div>
            ) : (
                <Panel className="overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b" style={{ borderColor: 'rgba(255,125,56,0.1)' }}>
                                    <th className="text-left text-xs font-semibold px-5 py-3.5" style={{ color: '#FF9A5F' }}>User</th>
                                    <th className="text-left text-xs font-semibold px-4 py-3.5" style={{ color: '#FF9A5F' }}>Role</th>
                                    <th className="text-left text-xs font-semibold px-4 py-3.5" style={{ color: '#FF9A5F' }}>Devices</th>
                                    <th className="text-left text-xs font-semibold px-4 py-3.5" style={{ color: '#FF9A5F' }}>Status</th>
                                    <th className="text-left text-xs font-semibold px-4 py-3.5" style={{ color: '#FF9A5F' }}>Last Seen</th>
                                    <th className="text-left text-xs font-semibold px-4 py-3.5" style={{ color: '#FF9A5F' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map(user => (
                                    <tr key={user.id} className="border-b transition-colors opacity-75" style={{ borderColor: 'rgba(255,125,56,0.06)' }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,125,56,0.05)'; e.currentTarget.style.opacity = '1'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.opacity = '0.75'; }}>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${user.avatarGrad || 'from-gray-500 to-gray-600'} flex items-center justify-center text-white text-xs font-bold grayscale`}>
                                                    {user.avatar || user.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold" style={{ color: '#FF9A5F' }}>{user.name}</p>
                                                    <p className="text-xs" style={{ color: '#FF9A5F' }}>{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm" style={{ color: '#FF9A5F' }}>{user.role || 'User'}</td>
                                        <td className="px-4 py-4 text-sm" style={{ color: '#FF9A5F' }}>{user.totalDevices || 0}</td>
                                        <td className="px-4 py-4">
                                            <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#94a3b8' }}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                                Inactive
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-xs" style={{ color: '#FF9A5F' }}>{user.lastSeen || 'Unknown'}</td>
                                        <td className="px-4 py-4">
                                            <button className="flex items-center gap-1 text-xs font-medium transition-colors" style={{ color: "#FF7D38" }} onClick={() => handleUserClick(user)}>
                                                <Eye size={14} /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Panel>
            )}

            {/* Pagination */}
            {sortedUsers.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={sortedUsers.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                />
            )}
        </div>
    );
};

export default InactivePlanUsers;
// pages/ActivePlanUsers.js - Light Theme with Saffron Accents
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Search, UserCheck, Users, Calendar, Smartphone,
    Mail, Building, Clock, ArrowLeft, Filter, ChevronDown,
    Grid, List, Download, RefreshCw, Eye,
    ChevronLeft, ChevronRight
} from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────
const REGISTERED_USERS = [
    {
        id: 1, name: "Raj Mehta", email: "raj.mehta@corp.io", role: "Sub Admin", mobile: "+91 9876543210",
        avatar: "RM", avatarGrad: "from-orange-500 to-amber-600", region: "Mumbai",
        totalDevices: 3, activeDevices: 3, status: "active", lastSeen: "2m ago",
        devices: []
    },
    {
        id: 2, name: "Priya Nair", email: "priya.nair@corp.io", role: "User", mobile: "+91 9876543210",
        avatar: "PN", avatarGrad: "from-amber-400 to-orange-500", region: "Bangalore",
        totalDevices: 2, activeDevices: 1, status: "active", lastSeen: "18m ago",
        devices: []
    },
    {
        id: 3, name: "Arjun Das", email: "arjun.das@corp.io", role: "User", mobile: "+91 9876543210",
        avatar: "AD", avatarGrad: "from-orange-600 to-amber-700", region: "Delhi",
        totalDevices: 4, activeDevices: 4, status: "active", lastSeen: "Just now",
        devices: []
    },
    {
        id: 4, name: "Meera Patel", email: "meera.patel@corp.io", role: "User", mobile: "+91 9876543210",
        avatar: "MP", avatarGrad: "from-amber-500 to-yellow-600", region: "Chennai",
        totalDevices: 1, activeDevices: 1, status: "active", lastSeen: "1h ago",
        devices: []
    },
    {
        id: 5, name: "Vikram Singh", email: "vikram.singh@corp.io", role: "Sub Admin", mobile: "+91 9876543210",
        avatar: "VS", avatarGrad: "from-orange-400 to-amber-500", region: "Hyderabad",
        totalDevices: 3, activeDevices: 2, status: "inactive", lastSeen: "2d ago",
        devices: []
    },
    {
        id: 6, name: "Sneha Reddy", email: "sneha.reddy@corp.io", role: "User", mobile: "+91 9876543210",
        avatar: "SR", avatarGrad: "from-amber-600 to-orange-700", region: "Pune",
        totalDevices: 2, activeDevices: 2, status: "active", lastSeen: "45m ago",
        devices: []
    },
];

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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-orange-200 bg-orange-50">
            <p className="text-xs text-gray-600">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}–
                {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} users
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:bg-orange-50"
                >
                    <ChevronLeft size={15} />
                </button>

                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span key={`dots-${index}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
                            style={page === currentPage
                                ? { background: 'linear-gradient(135deg,#FF7D38,#FF6B1A)', color: '#fff', boxShadow: '0 0 15px rgba(255,125,56,0.4)' }
                                : { color: '#4a4a4a' }
                            }
                            onMouseEnter={e => { if (page !== currentPage) e.currentTarget.style.background = 'rgba(255,125,56,0.08)'; }}
                            onMouseLeave={e => { if (page !== currentPage) e.currentTarget.style.background = 'transparent'; }}
                        >
                            {page}
                        </button>
                    )
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:bg-orange-50"
                >
                    <ChevronRight size={15} />
                </button>
            </div>
        </div>
    );
};

// ── Active Users Component ──────────────────────────────────────────────────

export const ActivePlanUsers = () => {
    const navigate = useNavigate();
    const { planId } = useParams();
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;

    const plan = { id: parseInt(planId), name: "Professional Plan" };

    // Get active users
    const activeUsers = REGISTERED_USERS.filter(user => user.status === 'active');
    const storedUsers = JSON.parse(localStorage.getItem('planUsers') || '[]');
    const storedActiveUsers = storedUsers.filter(u => u.planId === parseInt(planId) && u.status === 'active');
    const allActiveUsers = activeUsers.length > 0 ? activeUsers : storedActiveUsers;

    // Filter and sort users
    const filteredUsers = useMemo(() => {
        return allActiveUsers.filter(u => {
            const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
                u.email?.toLowerCase().includes(search.toLowerCase()) ||
                u.region?.toLowerCase().includes(search.toLowerCase()) ||
                u.company?.toLowerCase().includes(search.toLowerCase());
            const matchRole = filterRole === 'All' || u.role === filterRole;
            return matchSearch && matchRole;
        });
    }, [allActiveUsers, search, filterRole]);

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const roles = ['All', ...new Set(allActiveUsers.map(u => u.role).filter(Boolean))];

    const handleUserClick = (user) => navigate(`/admin/user/${user.id}`);

    const UserCard = ({ user }) => (
        <div
            className="rounded-xl p-4 transition-all duration-200 hover:-translate-y-1 cursor-pointer bg-white border border-orange-200 shadow-sm hover:shadow-md"
            onClick={() => handleUserClick(user)}
        >
            <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${user.avatarGrad || 'from-orange-500 to-amber-600'} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                    {user.avatar || user.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-semibold truncate text-gray-800">{user.name}</p>
                            <p className="text-xs truncate flex items-center gap-1 text-gray-500">
                                <Mail size={10} /> {user.email}
                            </p>
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap bg-orange-50 text-orange-500 border border-orange-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                            Active
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-500 border border-orange-200">
                            {user.role || 'User'}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 bg-gray-50 text-gray-500 border border-gray-200">
                            <Building size={10} /> {user.company || user.region || 'N/A'}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 bg-gray-50 text-gray-500 border border-gray-200">
                            <Smartphone size={10} /> {user.totalDevices || user.deviceCount || 0} devices
                        </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1">
                            <Calendar size={10} />
                            Joined {user.enrolled ? new Date(user.enrolled).toLocaleDateString() : 'N/A'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock size={10} />
                            Last seen {user.lastSeen || 'Just now'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    // Reset page when search/filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search, filterRole]);

    return (
        <div className="space-y-6 bg-gray-50 min-h-screen p-4 rounded-2xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-orange-200 shadow-sm">
                <div className="flex items-center gap-4 flex-wrap">
                    <button
                        onClick={() => navigate('/admin/plans')}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-100"
                    >
                        <ArrowLeft size={16} /> Back to Plans
                    </button>
                    <div>
                        <h1 className="text-lg sm:text-xl font-bold text-gray-800">Active Users</h1>
                        <p className="text-xs sm:text-sm text-gray-500">
                            {plan.name} • {allActiveUsers.length} active subscribers
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex rounded-lg overflow-hidden border border-orange-200">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-white text-gray-400 hover:bg-orange-50'}`}
                        >
                            <Grid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-white text-gray-400 hover:bg-orange-50'}`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                    <button className="p-2 rounded-lg transition-colors text-gray-400 hover:text-orange-500 hover:bg-orange-50">
                        <RefreshCw size={16} />
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-sm bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-100">
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {[
                    { label: 'Total Active', value: allActiveUsers.length, icon: UserCheck, color: '#FF7D38' },
                    { label: 'With Devices', value: allActiveUsers.filter(u => u.totalDevices > 0).length, icon: Smartphone, color: '#60a5fa' },
                    { label: 'Roles', value: new Set(allActiveUsers.map(u => u.role)).size, icon: Users, color: '#FF7D38' },
                    { label: 'Recently Active', value: allActiveUsers.filter(u => u.lastSeen?.includes('m') || u.lastSeen === 'Just now').length, icon: Clock, color: '#fcd34d' },
                ].map(stat => (
                    <div
                        key={stat.label}
                        className="relative overflow-hidden rounded-2xl p-3 sm:p-4 text-center bg-white border border-orange-200 shadow-sm hover:shadow-lg hover:scale-105 transition-all"
                    >
                        {/* Decorative Background */}
                        <div className="absolute -top-8 -left-8 w-20 h-20 rounded-full bg-orange-400/10" />
                        <div className="absolute -top-4 -left-4 w-28 h-28 rounded-full border border-orange-300/20" />
                        <div className="absolute -top-8 -left-8 w-36 h-36 rounded-full border border-orange-300/10" />

                        <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-orange-400/10" />

                        {/* Content */}
                        <div className="relative z-10">
                            <stat.icon
                                size={16}
                                className="mx-auto mb-1"
                                style={{ color: stat.color }}
                            />

                            <p className="text-lg sm:text-xl font-bold text-orange-500">
                                {stat.value}
                            </p>

                            <p className="text-[10px] sm:text-xs text-gray-500">
                                {stat.label}
                            </p>
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
                            placeholder="Search active users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                        />
                    </div>
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-3.5 py-2.5 text-sm rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    >
                        {roles.map(role => (
                            <option key={role} value={role} className="bg-white">{role}</option>
                        ))}
                    </select>
                    <div className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl whitespace-nowrap bg-orange-50 text-gray-600 border border-orange-200">
                        <Users size={14} />
                        <span>{filteredUsers.length} users</span>
                    </div>
                </div>
            </Panel>

            {/* User Grid */}
            {filteredUsers.length === 0 ? (
                <div className="text-center py-16 rounded-2xl bg-white border border-orange-200">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-orange-50">
                        <UserCheck size={32} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-800">No active users found</p>
                    <p className="text-xs mt-1 text-gray-500">Try adjusting your search or filters</p>
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
                                <tr className="border-b border-orange-200 bg-orange-50">
                                    <th className="text-left text-xs font-semibold px-5 py-3.5 text-gray-600">User</th>
                                    <th className="text-left text-xs font-semibold px-4 py-3.5 text-gray-600">Role</th>
                                    <th className="text-left text-xs font-semibold px-4 py-3.5 text-gray-600">Devices</th>
                                    <th className="text-left text-xs font-semibold px-4 py-3.5 text-gray-600">Status</th>
                                    <th className="text-left text-xs font-semibold px-4 py-3.5 text-gray-600">Last Seen</th>
                                    <th className="text-left text-xs font-semibold px-4 py-3.5 text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map(user => (
                                    <tr key={user.id} className="border-b border-orange-100 hover:bg-orange-50 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${user.avatarGrad || 'from-orange-500 to-amber-600'} flex items-center justify-center text-white text-xs font-bold`}>
                                                    {user.avatar || user.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-700">{user.role || 'User'}</td>
                                        <td className="px-4 py-4 text-sm text-gray-700">{user.totalDevices || 0}</td>
                                        <td className="px-4 py-4">
                                            <span className="flex items-center gap-1.5 text-xs font-medium text-orange-500">
                                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-xs text-gray-500">{user.lastSeen || "Just now"}</td>
                                        <td className="px-4 py-4">
                                            <button className="flex items-center gap-1 text-xs font-medium transition-colors text-orange-500 hover:text-orange-600" onClick={() => handleUserClick(user)}>
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
            {filteredUsers.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={filteredUsers.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                />
            )}
        </div>
    );
};

export default ActivePlanUsers;
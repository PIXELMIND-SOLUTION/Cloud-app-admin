// components/InactiveUsersList.js
import React, { useState, useEffect } from 'react';
import { Search, X, UserX, Users, Calendar, Smartphone, Mail, Building, AlertCircle, Clock } from 'lucide-react';

const InactivePlanUsers = ({ plan, onClose }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [sortBy, setSortBy] = useState('joinedDate');

    useEffect(() => {
        const allUsers = JSON.parse(localStorage.getItem('planUsers') || '[]');
        const planUsers = allUsers.filter(u => u.planId === plan.id && u.status === 'inactive');
        setUsers(planUsers);
        setLoading(false);
    }, [plan]);

    const filtered = users.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.company.toLowerCase().includes(search.toLowerCase());
        const matchRole = filterRole === 'All' || u.role === filterRole;
        return matchSearch && matchRole;
    });

    // Sort users
    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'joinedDate') {
            return new Date(b.joinedDate) - new Date(a.joinedDate);
        }
        if (sortBy === 'lastActive') {
            return new Date(b.lastActive) - new Date(a.lastActive);
        }
        return a.name.localeCompare(b.name);
    });

    const roles = ['All', ...new Set(users.map(u => u.role))];

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-400 border-t-transparent mx-auto" />
                    <p className="mt-4 text-sm text-slate-400">Loading inactive users...</p>
                </div>
            </div>
        );
    }

    const getInactivityReason = (user) => {
        const daysSinceLastActive = Math.floor((Date.now() - new Date(user.lastActive).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceLastActive > 30) return 'Long-term inactive';
        if (daysSinceLastActive > 14) return 'Recently inactive';
        return 'Temporarily inactive';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center">
                                <UserX size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">Inactive Users</h2>
                                <p className="text-sm text-slate-400">
                                    {plan.name} • {users.length} inactive subscribers
                                </p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Filters */}
                <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search inactive users by name, email, or company..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3.5 py-2.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all"
                            />
                        </div>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-3.5 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300"
                        >
                            {roles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3.5 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300"
                        >
                            <option value="joinedDate">Joined Date</option>
                            <option value="lastActive">Last Active</option>
                            <option value="name">Name</option>
                        </select>
                        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2.5 rounded-xl border border-slate-200">
                            <Users size={14} />
                            <span>{sorted.length} users</span>
                        </div>
                    </div>
                </div>

                {/* User Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    {sorted.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                <UserX size={32} className="text-slate-300" />
                            </div>
                            <p className="text-sm font-medium text-slate-600">No inactive users found</p>
                            <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sorted.map(user => {
                                const reason = getInactivityReason(user);
                                const daysInactive = Math.floor((Date.now() - new Date(user.lastActive).getTime()) / (1000 * 60 * 60 * 24));
                                
                                return (
                                    <div key={user.id} 
                                         className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:border-slate-300 group opacity-80 hover:opacity-100"
                                    >
                                        <div className="flex items-start gap-3">
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-12 h-12 rounded-full border-2 border-slate-200 group-hover:border-slate-400 transition-colors grayscale"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                                                        <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                                                            <Mail size={10} /> {user.email}
                                                        </p>
                                                    </div>
                                                    <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                                        Inactive
                                                    </span>
                                                </div>
                                                
                                                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                                        {user.role}
                                                    </span>
                                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
                                                        <Building size={10} /> {user.company}
                                                    </span>
                                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 flex items-center gap-1">
                                                        <Smartphone size={10} /> {user.deviceCount} devices
                                                    </span>
                                                </div>
                                                
                                                <div className="flex flex-col gap-1 mt-2">
                                                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={10} />
                                                            Joined {new Date(user.joinedDate).toLocaleDateString()}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={10} />
                                                            Last active {new Date(user.lastActive).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px]">
                                                        <AlertCircle size={10} className="text-amber-500" />
                                                        <span className="text-amber-600 font-medium">{reason}</span>
                                                        <span className="text-slate-400">({daysInactive} days)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>Showing {sorted.length} of {users.length} inactive users</span>
                        <span className="w-px h-4 bg-slate-200" />
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                            {users.filter(u => {
                                const days = Math.floor((Date.now() - new Date(u.lastActive).getTime()) / (1000 * 60 * 60 * 24));
                                return days > 30;
                            }).length} long-term
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-slate-400" />
                            {users.filter(u => {
                                const days = Math.floor((Date.now() - new Date(u.lastActive).getTime()) / (1000 * 60 * 60 * 24));
                                return days <= 30 && days > 14;
                            }).length} recent
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InactivePlanUsers;
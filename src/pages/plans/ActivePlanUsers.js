// components/ActiveUsersList.js
import React, { useState, useEffect } from 'react';
import { Search, X, UserCheck, Users, Calendar, Smartphone, Mail, Building } from 'lucide-react';

const ActivePlanUsers = ({ plan, onClose }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('All');

    useEffect(() => {
        const allUsers = JSON.parse(localStorage.getItem('planUsers') || '[]');
        const planUsers = allUsers.filter(u => u.planId === plan.id && u.status === 'active');
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

    // Get unique roles for filter
    const roles = ['All', ...new Set(users.map(u => u.role))];

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-400 border-t-transparent mx-auto" />
                    <p className="mt-4 text-sm text-slate-400">Loading active users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                                <UserCheck size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">Active Users</h2>
                                <p className="text-sm text-slate-400">
                                    {plan.name} • {users.length} active subscribers
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
                                placeholder="Search active users by name, email, or company..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3.5 py-2.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all"
                            />
                        </div>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-3.5 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        >
                            {roles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2.5 rounded-xl border border-slate-200">
                            <Users size={14} />
                            <span>{filtered.length} users</span>
                        </div>
                    </div>
                </div>

                {/* User Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    {filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                <UserCheck size={32} className="text-slate-300" />
                            </div>
                            <p className="text-sm font-medium text-slate-600">No active users found</p>
                            <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filtered.map(user => (
                                <div key={user.id} 
                                     className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:border-emerald-200 group"
                                >
                                    <div className="flex items-start gap-3">
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-12 h-12 rounded-full border-2 border-emerald-200 group-hover:border-emerald-400 transition-colors"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                                                    <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                                                        <Mail size={10} /> {user.email}
                                                    </p>
                                                </div>
                                                <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    Active
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
                                            
                                            <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={10} />
                                                    Joined {new Date(user.joinedDate).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <ClockIcon size={10} />
                                                    Last active {new Date(user.lastActive).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
                    <p className="text-xs text-slate-400">
                        Showing {filtered.length} of {users.length} active users
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivePlanUsers;

// Clock Icon component (since lucide-react might not have it)
const ClockIcon = ({ size, className }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);
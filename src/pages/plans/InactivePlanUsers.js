// components/InactivePlanUsers.js - Dark Theme
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                <div className="rounded-2xl shadow-2xl w-full max-w-4xl p-12 text-center"
                    style={{
                        background: 'rgba(20, 16, 36, 0.95)',
                        border: '1px solid rgba(139,92,246,0.2)',
                    }}
                >
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-400 border-t-transparent mx-auto" />
                    <p className="mt-4 text-sm" style={{ color: '#5a4f72' }}>Loading inactive users...</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
            <div className="rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col"
                style={{
                    background: 'rgba(20, 16, 36, 0.95)',
                    border: '1px solid rgba(139,92,246,0.2)',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(139,92,246,0.15)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center">
                            <UserX size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold" style={{ color: '#e2d9f3' }}>Inactive Users</h2>
                            <p className="text-sm" style={{ color: '#5a4f72' }}>
                                {plan.name} • {users.length} inactive subscribers
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: '#5a4f72' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#c4b5fd'; e.currentTarget.style.background = 'rgba(139,92,246,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#5a4f72'; e.currentTarget.style.background = 'transparent'; }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Filters */}
                <div className="p-6 border-b" style={{ borderColor: 'rgba(139,92,246,0.1)' }}>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#5a4f72' }} />
                            <input
                                type="text"
                                placeholder="Search inactive users by name, email, or company..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all"
                                style={{
                                    background: 'rgba(139,92,246,0.08)',
                                    border: '1px solid rgba(139,92,246,0.15)',
                                    color: '#e2d9f3'
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
                                onBlur={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'}
                            />
                        </div>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-3.5 py-2.5 text-sm rounded-xl transition-all"
                            style={{
                                background: 'rgba(139,92,246,0.08)',
                                border: '1px solid rgba(139,92,246,0.15)',
                                color: '#e2d9f3'
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
                            onBlur={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'}
                        >
                            {roles.map(role => (
                                <option key={role} value={role} style={{ background: '#1a1430', color: '#e2d9f3' }}>{role}</option>
                            ))}
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3.5 py-2.5 text-sm rounded-xl transition-all"
                            style={{
                                background: 'rgba(139,92,246,0.08)',
                                border: '1px solid rgba(139,92,246,0.15)',
                                color: '#e2d9f3'
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
                            onBlur={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'}
                        >
                            <option value="joinedDate" style={{ background: '#1a1430', color: '#e2d9f3' }}>Joined Date</option>
                            <option value="lastActive" style={{ background: '#1a1430', color: '#e2d9f3' }}>Last Active</option>
                            <option value="name" style={{ background: '#1a1430', color: '#e2d9f3' }}>Name</option>
                        </select>
                        <div className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl" style={{ color: '#9c8fc0', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.1)' }}>
                            <Users size={14} />
                            <span>{sorted.length} users</span>
                        </div>
                    </div>
                </div>

                {/* User Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    {sorted.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(139,92,246,0.08)' }}>
                                <UserX size={32} style={{ color: '#5a4f72' }} />
                            </div>
                            <p className="text-sm font-medium" style={{ color: '#9c8fc0' }}>No inactive users found</p>
                            <p className="text-xs mt-1" style={{ color: '#5a4f72' }}>Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sorted.map(user => {
                                const reason = getInactivityReason(user);
                                const daysInactive = Math.floor((Date.now() - new Date(user.lastActive).getTime()) / (1000 * 60 * 60 * 24));
                                
                                return (
                                    <div key={user.id} 
                                        className="rounded-xl p-4 transition-all duration-200 group opacity-70 hover:opacity-100"
                                        style={{
                                            background: 'rgba(139,92,246,0.04)',
                                            border: '1px solid rgba(139,92,246,0.06)'
                                        }}
                                        onMouseEnter={e => { 
                                            e.currentTarget.style.background = 'rgba(139,92,246,0.1)';
                                            e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)';
                                        }}
                                        onMouseLeave={e => { 
                                            e.currentTarget.style.background = 'rgba(139,92,246,0.04)';
                                            e.currentTarget.style.borderColor = 'rgba(139,92,246,0.06)';
                                        }}
                                    >
                                        <div className="flex items-start gap-3">
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-12 h-12 rounded-full border-2 transition-colors grayscale"
                                                style={{ borderColor: 'rgba(100,116,139,0.2)' }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-sm font-semibold truncate" style={{ color: '#9c8fc0' }}>{user.name}</p>
                                                        <p className="text-xs truncate flex items-center gap-1" style={{ color: '#5a4f72' }}>
                                                            <Mail size={10} /> {user.email}
                                                        </p>
                                                    </div>
                                                    <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
                                                        style={{ background: 'rgba(100,116,139,0.12)', color: '#94a3b8' }}>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                                        Inactive
                                                    </span>
                                                </div>
                                                
                                                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa' }}>
                                                        {user.role}
                                                    </span>
                                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: 'rgba(139,92,246,0.08)', color: '#9c8fc0' }}>
                                                        <Building size={10} /> {user.company}
                                                    </span>
                                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: 'rgba(168,85,247,0.08)', color: '#a78bfa' }}>
                                                        <Smartphone size={10} /> {user.deviceCount} devices
                                                    </span>
                                                </div>
                                                
                                                <div className="flex flex-col gap-1 mt-2">
                                                    <div className="flex items-center gap-3 text-[10px]" style={{ color: '#5a4f72' }}>
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
                                                        <AlertCircle size={10} style={{ color: '#f59e0b' }} />
                                                        <span style={{ color: '#f59e0b' }}>{reason}</span>
                                                        <span style={{ color: '#5a4f72' }}>({daysInactive} days)</span>
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
                <div className="flex items-center justify-between px-6 py-4 border-t rounded-b-2xl" style={{ borderColor: 'rgba(139,92,246,0.15)' }}>
                    <div className="flex items-center gap-4 text-xs" style={{ color: '#5a4f72' }}>
                        <span>Showing {sorted.length} of {users.length} inactive users</span>
                        <span className="w-px h-4" style={{ background: 'rgba(139,92,246,0.15)' }} />
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full" style={{ background: '#f59e0b' }} />
                            {users.filter(u => {
                                const days = Math.floor((Date.now() - new Date(u.lastActive).getTime()) / (1000 * 60 * 60 * 24));
                                return days > 30;
                            }).length} long-term
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full" style={{ background: '#94a3b8' }} />
                            {users.filter(u => {
                                const days = Math.floor((Date.now() - new Date(u.lastActive).getTime()) / (1000 * 60 * 60 * 24));
                                return days <= 30 && days > 14;
                            }).length} recent
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium rounded-xl transition-colors"
                        style={{ color: '#9c8fc0' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InactivePlanUsers;
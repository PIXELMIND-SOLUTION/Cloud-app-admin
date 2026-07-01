// pages/AdminNotifications.js - Simplified Notification Management with Saffron Theme
import React, { useState, useEffect, useMemo } from 'react';
import {
    Bell, BellOff, Check, X, Trash2, Edit, Eye,
    Send, Clock, AlertCircle, Info, CheckCircle,
    AlertTriangle, Filter, Search, RefreshCw,
    MoreVertical, ChevronDown, ChevronUp,
    Plus, Calendar, Users, Smartphone, Shield,
    Tag, MessageSquare, Mail, Zap, Star, Pin,
    PinOff, Archive, Bookmark, BookmarkCheck
} from 'lucide-react';

const Panel = ({ children, className = "" }) => (
    <div
        className={`rounded-2xl p-4 sm:p-5 transition-all ${className}`}
        style={{
            background: 'linear-gradient(135deg, rgba(255,125,56,0.12), rgba(255,107,26,0.08))',
            border: '1px solid rgba(255,125,56,0.25)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(255,125,56,0.1)'
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,125,56,0.5)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,125,56,0.25)'}
    >
        {children}
    </div>
);

// ── Notification Service ──────────────────────────────────────────────────────

const NotificationService = {
    getAll: () => {
        const stored = localStorage.getItem('notifications');
        if (stored) return JSON.parse(stored);
        const defaultNotifications = [
            {
                id: 1,
                title: "Security Alert: Unauthorized Access Attempt",
                message: "Multiple failed login attempts detected from IP 192.168.1.100.",
                type: "alert",
                priority: "high",
                status: "unread",
                createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
                category: "security"
            },
            {
                id: 2,
                title: "New Device Enrollment Request",
                message: "iPhone 14 Pro requests enrollment from user Raj Mehta.",
                type: "info",
                priority: "medium",
                status: "unread",
                createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
                category: "device"
            },
            {
                id: 3,
                title: "System Update Available",
                message: "MDM Server v3.2.0 is now available with security improvements.",
                type: "info",
                priority: "low",
                status: "read",
                createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
                category: "system"
            },
            {
                id: 4,
                title: "Compliance Violation Detected",
                message: "7 devices are out of compliance with security policies.",
                type: "alert",
                priority: "high",
                status: "unread",
                createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
                category: "compliance"
            },
            {
                id: 5,
                title: "Weekly Analytics Report Available",
                message: "Your weekly device analytics report is ready.",
                type: "success",
                priority: "low",
                status: "read",
                createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
                category: "analytics"
            }
        ];
        localStorage.setItem('notifications', JSON.stringify(defaultNotifications));
        return defaultNotifications;
    },

    create: (notification) => {
        const notifications = NotificationService.getAll();
        const newNotification = {
            ...notification,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            status: 'unread'
        };
        notifications.unshift(newNotification);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        return newNotification;
    },

    markAsRead: (id) => {
        const notifications = NotificationService.getAll();
        const index = notifications.findIndex(n => n.id === id);
        if (index === -1) return;
        notifications[index].status = 'read';
        notifications[index].readAt = new Date().toISOString();
        localStorage.setItem('notifications', JSON.stringify(notifications));
        return notifications[index];
    },

    markAllAsRead: () => {
        const notifications = NotificationService.getAll();
        const updated = notifications.map(n => ({ ...n, status: 'read', readAt: new Date().toISOString() }));
        localStorage.setItem('notifications', JSON.stringify(updated));
        return updated;
    },

    delete: (id) => {
        const notifications = NotificationService.getAll();
        const filtered = notifications.filter(n => n.id !== id);
        localStorage.setItem('notifications', JSON.stringify(filtered));
        return filtered;
    },

    deleteAll: () => {
        localStorage.setItem('notifications', JSON.stringify([]));
        return [];
    },

    getUnreadCount: () => {
        const notifications = NotificationService.getAll();
        return notifications.filter(n => n.status === 'unread').length;
    }
};

// ── Notification Type Icons ──────────────────────────────────────────────────

const NotificationIcon = ({ type, size = 18 }) => {
    const configs = {
        alert: { icon: AlertCircle, color: '#FF7D38', bg: 'rgba(255,125,56,0.15)' },
        warning: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
        info: { icon: Info, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
        success: { icon: CheckCircle, color: '#34d399', bg: 'rgba(52,211,153,0.15)' }
    };
    const config = configs[type] || configs.info;
    const Icon = config.icon;
    return (
        <div className="p-2 rounded-xl" style={{ background: config.bg }}>
            <Icon size={size} style={{ color: config.color }} />
        </div>
    );
};

// ── Priority Badge ────────────────────────────────────────────────────────────

const PriorityBadge = ({ priority }) => {
    const configs = {
        high: { color: '#FF7D38', bg: 'rgba(255,125,56,0.15)' },
        medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
        low: { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' }
    };
    const config = configs[priority] || configs.low;
    return (
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full capitalize"
            style={{ background: config.bg, color: config.color }}>
            {priority}
        </span>
    );
};

// ── Status Badge ──────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${status === 'unread' ? 'bg-orange-500/10 text-orange-400' : 'bg-slate-500/10 text-slate-400'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${status === 'unread' ? 'bg-orange-500 animate-pulse' : 'bg-slate-400'}`} />
        {status}
    </span>
);

// ── Create Notification Modal ────────────────────────────────────────────────

const CreateNotificationModal = ({ isOpen, onClose, onCreate }) => {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'info',
        priority: 'medium',
        category: 'system'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isOpen) {
            setFormData({ title: '', message: '', type: 'info', priority: 'medium', category: 'system' });
            setErrors({});
        }
    }, [isOpen]);

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.message.trim()) newErrors.message = 'Message is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onCreate(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"
                style={{ background: 'rgba(2,32,60,0.95)', border: '1px solid rgba(255,125,56,0.3)' }}>
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(255,125,56,0.15)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                            <Bell size={20} className="text-white" />
                        </div>
                        <h2 className="text-lg font-bold" style={{ color: '#FF7D38' }}>Create Notification</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: '#FF9A5F' }}>
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#FF9A5F' }}>Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl transition-all"
                                style={{
                                    background: 'rgba(255,125,56,0.08)',
                                    border: errors.title ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,125,56,0.2)',
                                    color: '#FF7D38'
                                }}
                                placeholder="Enter notification title..."
                            />
                            {errors.title && <p className="mt-1 text-xs" style={{ color: '#f87171' }}>{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#FF9A5F' }}>Message *</label>
                            <textarea
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-xl transition-all resize-none"
                                style={{
                                    background: 'rgba(255,125,56,0.08)',
                                    border: errors.message ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,125,56,0.2)',
                                    color: '#FF7D38'
                                }}
                                placeholder="Enter notification message..."
                            />
                            {errors.message && <p className="mt-1 text-xs" style={{ color: '#f87171' }}>{errors.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: '#FF9A5F' }}>Type</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl transition-all"
                                    style={{ background: 'rgba(255,125,56,0.08)', border: '1px solid rgba(255,125,56,0.2)', color: '#FF7D38' }}
                                >
                                    <option value="info" style={{ background: '#02203C' }}>Info</option>
                                    <option value="success" style={{ background: '#02203C' }}>Success</option>
                                    <option value="warning" style={{ background: '#02203C' }}>Warning</option>
                                    <option value="alert" style={{ background: '#02203C' }}>Alert</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: '#FF9A5F' }}>Priority</label>
                                <select
                                    value={formData.priority}
                                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl transition-all"
                                    style={{ background: 'rgba(255,125,56,0.08)', border: '1px solid rgba(255,125,56,0.2)', color: '#FF7D38' }}
                                >
                                    <option value="low" style={{ background: '#02203C' }}>Low</option>
                                    <option value="medium" style={{ background: '#02203C' }}>Medium</option>
                                    <option value="high" style={{ background: '#02203C' }}>High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: '#FF9A5F' }}>Category</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl transition-all"
                                    style={{ background: 'rgba(255,125,56,0.08)', border: '1px solid rgba(255,125,56,0.2)', color: '#FF7D38' }}
                                >
                                    <option value="system" style={{ background: '#02203C' }}>System</option>
                                    <option value="security" style={{ background: '#02203C' }}>Security</option>
                                    <option value="device" style={{ background: '#02203C' }}>Device</option>
                                    <option value="user" style={{ background: '#02203C' }}>User</option>
                                    <option value="compliance" style={{ background: '#02203C' }}>Compliance</option>
                                    <option value="analytics" style={{ background: '#02203C' }}>Analytics</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t rounded-b-2xl" style={{ borderColor: 'rgba(255,125,56,0.15)' }}>
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-xl transition-colors" style={{ color: '#FF9A5F' }}>
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #FF7D38, #FF6B1A)', boxShadow: '0 0 15px rgba(255,125,56,0.3)' }}>
                        <Send size={16} /> Send Notification
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────

export const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [expandedId, setExpandedId] = useState(null);

    const loadNotifications = () => {
        setLoading(true);
        setTimeout(() => {
            const data = NotificationService.getAll();
            setNotifications(data);
            setLoading(false);
        }, 300);
    };

    useEffect(() => { loadNotifications(); }, []);

    const handleCreate = (data) => {
        const newNotification = NotificationService.create(data);
        setNotifications(prev => [newNotification, ...prev]);
    };

    const handleDelete = (id) => {
        if (!window.confirm('Delete this notification?')) return;
        const remaining = NotificationService.delete(id);
        setNotifications(remaining);
    };

    const handleMarkAsRead = (id) => {
        const updated = NotificationService.markAsRead(id);
        if (updated) setNotifications(prev => prev.map(n => n.id === updated.id ? updated : n));
    };

    const handleMarkAllAsRead = () => {
        const updated = NotificationService.markAllAsRead();
        setNotifications(updated);
    };

    const handleDeleteAll = () => {
        if (!window.confirm('Delete all notifications?')) return;
        NotificationService.deleteAll();
        setNotifications([]);
    };

    const filtered = useMemo(() => {
        return notifications.filter(n => {
            const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
                n.message.toLowerCase().includes(search.toLowerCase());
            const matchType = filterType === 'All' || n.type === filterType;
            const matchStatus = filterStatus === 'All' || n.status === filterStatus;
            return matchSearch && matchType && matchStatus;
        });
    }, [notifications, search, filterType, filterStatus]);

    const unreadCount = useMemo(() => notifications.filter(n => n.status === 'unread').length, [notifications]);

    const formatTime = (dateString) => {
        const diff = Date.now() - new Date(dateString).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const NotificationCard = ({ notification }) => {
        const isExpanded = expandedId === notification.id;

        return (
            <div
                className={`rounded-xl p-4 transition-all ${notification.status === 'unread' ? 'border-orange-500/30' : ''}`}
                style={{
                    background: notification.status === 'unread' ? 'rgba(255,125,56,0.08)' : 'rgba(2,32,60,0.6)',
                    border: `1px solid ${notification.status === 'unread' ? 'rgba(255,125,56,0.2)' : 'rgba(255,125,56,0.06)'}`
                }}
            >
                <div className="flex items-start gap-3">
                    <NotificationIcon type={notification.type} />
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold" style={{ color: '#FF7D38' }}>{notification.title}</h4>
                                <p className="text-xs mt-0.5" style={{ color: '#FF9A5F' }}>{notification.message}</p>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <PriorityBadge priority={notification.priority} />
                                <StatusBadge status={notification.status} />
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="text-[10px]" style={{ color: '#FF9A5F' }}>
                                <Clock size={10} className="inline mr-1" />
                                {formatTime(notification.createdAt)}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full capitalize" style={{ background: 'rgba(255,125,56,0.08)', color: '#FF7D38' }}>
                                {notification.category}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => setExpandedId(isExpanded ? null : notification.id)}
                            className="p-1 rounded-lg transition-colors"
                            style={{ color: '#FF9A5F' }}
                        >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        {notification.status === 'unread' && (
                            <button onClick={() => handleMarkAsRead(notification.id)}
                                className="p-1 rounded-lg transition-colors" style={{ color: '#FF9A5F' }} title="Mark as read">
                                <Check size={14} />
                            </button>
                        )}
                        <button onClick={() => handleDelete(notification.id)}
                            className="p-1 rounded-lg transition-colors" style={{ color: '#FF9A5F' }} title="Delete">
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-400 border-t-transparent mx-auto" />
                    <p className="mt-4 text-sm" style={{ color: '#FF9A5F' }}>Loading notifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-lg sm:text-xl font-bold" style={{ color: '#FF7D38' }}>Notifications</h1>
                    <p className="text-xs sm:text-sm mt-0.5" style={{ color: '#FF9A5F' }}>
                        {unreadCount} unread • {notifications.length} total
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {unreadCount > 0 && (
                        <button onClick={handleMarkAllAsRead}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl transition-colors"
                            style={{ color: '#FF7D38', border: '1px solid rgba(255,125,56,0.2)' }}>
                            <Check size={14} /> Mark All Read
                        </button>
                    )}
                    {notifications.length > 0 && (
                        <button onClick={handleDeleteAll}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl transition-colors"
                            style={{ color: '#f87171', border: '1px solid rgba(239,68,68,0.15)' }}>
                            <Trash2 size={14} /> Clear All
                        </button>
                    )}
                    <button onClick={loadNotifications}
                        className="p-2 rounded-xl transition-colors" style={{ color: '#FF9A5F', border: '1px solid rgba(255,125,56,0.2)' }}>
                        <RefreshCw size={16} />
                    </button>
                    <button onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-xl transition-all"
                        style={{ background: 'linear-gradient(135deg, #FF7D38, #FF6B1A)', boxShadow: '0 0 15px rgba(255,125,56,0.3)' }}>
                        <Plus size={16} /> New
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {[
                    { label: 'Total', value: notifications.length, icon: Bell, color: '#FF7D38' },
                    { label: 'Unread', value: unreadCount, icon: Bell, color: '#34d399' },
                    { label: 'Read', value: notifications.filter(n => n.status === 'read').length, icon: Check, color: '#3b82f6' },
                    { label: 'Alerts', value: notifications.filter(n => n.type === 'alert').length, icon: AlertCircle, color: '#f87171' },
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
                        <input type="text" placeholder="Search notifications..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all"
                            style={{ background: 'rgba(255,125,56,0.08)', border: '1px solid rgba(255,125,56,0.2)', color: '#FF7D38' }} />
                    </div>
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                        className="px-3.5 py-2.5 text-sm rounded-xl transition-all"
                        style={{ background: 'rgba(255,125,56,0.08)', border: '1px solid rgba(255,125,56,0.2)', color: '#FF7D38' }}>
                        <option value="All" style={{ background: '#02203C' }}>All Types</option>
                        <option value="info" style={{ background: '#02203C' }}>Info</option>
                        <option value="success" style={{ background: '#02203C' }}>Success</option>
                        <option value="warning" style={{ background: '#02203C' }}>Warning</option>
                        <option value="alert" style={{ background: '#02203C' }}>Alert</option>
                    </select>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3.5 py-2.5 text-sm rounded-xl transition-all"
                        style={{ background: 'rgba(255,125,56,0.08)', border: '1px solid rgba(255,125,56,0.2)', color: '#FF7D38' }}>
                        <option value="All" style={{ background: '#02203C' }}>All Status</option>
                        <option value="unread" style={{ background: '#02203C' }}>Unread</option>
                        <option value="read" style={{ background: '#02203C' }}>Read</option>
                    </select>
                    <div className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl whitespace-nowrap" style={{ color: '#FF9A5F', background: 'rgba(255,125,56,0.08)', border: '1px solid rgba(255,125,56,0.15)' }}>
                        <Bell size={14} />
                        <span>{filtered.length}</span>
                    </div>
                </div>
            </Panel>

            {/* Notifications List */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 rounded-2xl" style={{ background: 'rgba(2,32,60,0.8)', border: '1px solid rgba(255,125,56,0.15)' }}>
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(255,125,56,0.08)' }}>
                        <BellOff size={32} style={{ color: '#FF9A5F' }} />
                    </div>
                    <p className="text-sm font-medium" style={{ color: '#FF7D38' }}>No notifications</p>
                    <p className="text-xs mt-1" style={{ color: '#FF9A5F' }}>Try adjusting your filters</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(notification => (
                        <NotificationCard key={notification.id} notification={notification} />
                    ))}
                </div>
            )}

            {/* Create Modal */}
            <CreateNotificationModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreate} />
        </div>
    );
};

export default AdminNotifications;
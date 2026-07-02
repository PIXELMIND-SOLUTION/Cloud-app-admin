// pages/AdminNotifications.js - Light Theme with Saffron Accents - Notification Management with Pagination
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Bell, BellOff, Check, X, Trash2, Edit, Eye,
    Send, Clock, AlertCircle, Info, CheckCircle,
    AlertTriangle, Filter, Search, RefreshCw,
    MoreVertical, ChevronDown, ChevronUp,
    Plus, Calendar, Users, Smartphone, Shield,
    Tag, MessageSquare, Mail, Zap, Star, Pin,
    PinOff, Archive, Bookmark, BookmarkCheck,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { canDelete, canEdit, canView } from '../view/Permissions';

const ITEMS_PER_PAGE = 5;

const Panel = ({ children, className = "" }) => (
    <div
        className={`rounded-2xl p-4 sm:p-5 transition-all bg-white ${className}`}
        style={{
            border: '1px solid rgba(255,125,56,0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,125,56,0.4)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,125,56,0.2)'}
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
                message: "Multiple failed login attempts detected from IP 192.168.1.100. Please review your security settings. This is a critical security issue that requires immediate attention.",
                type: "alert",
                priority: "high",
                status: "unread",
                createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
                category: "security"
            },
            {
                id: 2,
                title: "New Device Enrollment Request",
                message: "iPhone 14 Pro requests enrollment from user Raj Mehta. Please approve or deny the request.",
                type: "info",
                priority: "medium",
                status: "unread",
                createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
                category: "device"
            },
            {
                id: 3,
                title: "System Update Available",
                message: "MDM Server v3.2.0 is now available with security improvements and bug fixes.",
                type: "info",
                priority: "low",
                status: "read",
                createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
                category: "system"
            },
            {
                id: 4,
                title: "Compliance Violation Detected",
                message: "7 devices are out of compliance with security policies. Immediate action required.",
                type: "alert",
                priority: "high",
                status: "unread",
                createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
                category: "compliance"
            },
            {
                id: 5,
                title: "Weekly Analytics Report Available",
                message: "Your weekly device analytics report is ready for review. Click to view insights.",
                type: "success",
                priority: "low",
                status: "unread",
                createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
                category: "analytics"
            },
            {
                id: 6,
                title: "User Account Locked",
                message: "User account for Priya Sharma has been locked due to multiple failed login attempts.",
                type: "warning",
                priority: "high",
                status: "unread",
                createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
                category: "user"
            },
            {
                id: 7,
                title: "New User Registration",
                message: "Vikram Singh has registered as a new user. Please verify and approve the account.",
                type: "success",
                priority: "medium",
                status: "read",
                createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
                category: "user"
            },
            {
                id: 8,
                title: "Server Maintenance Scheduled",
                message: "Server maintenance is scheduled for this weekend. Downtime expected: 2 hours.",
                type: "warning",
                priority: "medium",
                status: "unread",
                createdAt: new Date(Date.now() - 10 * 3600000).toISOString(),
                category: "system"
            },
            {
                id: 9,
                title: "New Feature: Device Analytics",
                message: "New device analytics feature is now available. Check it out in the dashboard.",
                type: "success",
                priority: "low",
                status: "read",
                createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
                category: "analytics"
            },
            {
                id: 10,
                title: "Security Patch Required",
                message: "A critical security patch is required for all devices. Please update immediately.",
                type: "alert",
                priority: "high",
                status: "unread",
                createdAt: new Date(Date.now() - 14 * 3600000).toISOString(),
                category: "security"
            },
            {
                id: 11,
                title: "User Onboarding Complete",
                message: "New user onboarding process has been completed for 50 users this week.",
                type: "success",
                priority: "low",
                status: "read",
                createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
                category: "user"
            },
            {
                id: 12,
                title: "Storage Alert",
                message: "Server storage is at 85% capacity. Please consider upgrading or cleaning up.",
                type: "warning",
                priority: "medium",
                status: "unread",
                createdAt: new Date(Date.now() - 20 * 3600000).toISOString(),
                category: "system"
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
        alert: { icon: AlertCircle, color: '#FF7D38', bg: 'rgba(255,125,56,0.12)' },
        warning: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
        info: { icon: Info, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
        success: { icon: CheckCircle, color: '#34d399', bg: 'rgba(52,211,153,0.12)' }
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
        high: { color: '#FF7D38', bg: 'rgba(255,125,56,0.12)' },
        medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
        low: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' }
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
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${status === 'unread' ? 'bg-orange-50 text-orange-500 border border-orange-200' : 'bg-gray-100 text-gray-500'
        }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${status === 'unread' ? 'bg-orange-500 animate-pulse' : 'bg-gray-400'}`} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col bg-white border border-orange-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-orange-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                            <Bell size={20} className="text-white" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">Create Notification</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-orange-50 text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-600">Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                                placeholder="Enter notification title..."
                            />
                            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-600">Message *</label>
                            <textarea
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-xl transition-all resize-none bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                                placeholder="Enter notification message..."
                            />
                            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-gray-600">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                                >
                                    <option value="info" className="bg-white">Info</option>
                                    <option value="success" className="bg-white">Success</option>
                                    <option value="warning" className="bg-white">Warning</option>
                                    <option value="alert" className="bg-white">Alert</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-gray-600">Priority</label>
                                <select
                                    value={formData.priority}
                                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                                >
                                    <option value="low" className="bg-white">Low</option>
                                    <option value="medium" className="bg-white">Medium</option>
                                    <option value="high" className="bg-white">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-gray-600">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                                >
                                    <option value="system" className="bg-white">System</option>
                                    <option value="security" className="bg-white">Security</option>
                                    <option value="device" className="bg-white">Device</option>
                                    <option value="user" className="bg-white">User</option>
                                    <option value="compliance" className="bg-white">Compliance</option>
                                    <option value="analytics" className="bg-white">Analytics</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-orange-100 rounded-b-2xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-xl transition-colors text-gray-600 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all shadow-sm bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-orange-500/30">
                        <Send size={16} /> Send Notification
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Pagination Component ──────────────────────────────────────────────────────

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
    const getPageNumbers = useCallback(() => {
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
    }, [currentPage, totalPages]);

    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-orange-200">
            <div className="text-xs text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} notifications
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-orange-50 border border-orange-200 text-gray-500 hover:bg-orange-100 hover:text-orange-500"
                >
                    <ChevronLeft size={16} />
                </button>

                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span key={`dots-${index}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`min-w-[32px] h-8 px-2 rounded-lg text-xs transition-all ${page === currentPage
                                ? 'font-semibold bg-orange-500 text-white shadow-md'
                                : 'text-gray-600 hover:bg-orange-50'
                                }`}
                        >
                            {page}
                        </button>
                    )
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-orange-50 border border-orange-200 text-gray-500 hover:bg-orange-100 hover:text-orange-500"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

// ── Notification Card Component ──────────────────────────────────────────────

const NotificationCard = ({ notification, onMarkAsRead, onDelete, hasDeletePermission }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(prev => !prev);
    };

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

    return (
        <div
            className={`rounded-xl p-4 transition-all cursor-pointer ${notification.status === 'unread'
                ? 'bg-orange-50 border border-orange-200 hover:shadow-md'
                : 'bg-white border border-gray-200 hover:shadow-md'
                }`}
        >
            <div className="flex items-start gap-3">
                <div onClick={toggleExpand} className="cursor-pointer">
                    <NotificationIcon type={notification.type} />
                </div>
                <div className="flex-1 min-w-0" onClick={toggleExpand}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-800">{notification.title}</h4>
                            <p
                                className={`text-xs mt-0.5 transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'
                                    }`}
                                style={{ color: '#6b7280' }}
                            >
                                {notification.message}
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <PriorityBadge priority={notification.priority} />
                            <StatusBadge status={notification.status} />
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="text-[10px] text-gray-500">
                            <Clock size={10} className="inline mr-1" />
                            {formatTime(notification.createdAt)}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full capitalize bg-orange-50 text-orange-500 border border-orange-200">
                            {notification.category}
                        </span>
                        {notification.status === 'unread' && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onMarkAsRead(notification.id);
                                }}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-500 border border-blue-200 hover:bg-blue-100 transition-colors"
                            >
                                Mark as Read
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    {/* <button
                        onClick={toggleExpand}
                        className="p-1 rounded-lg transition-colors text-gray-400 hover:text-orange-500 hover:bg-orange-50"
                        title={isExpanded ? "Collapse" : "Expand"}
                    >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button> */}
                    {hasDeletePermission && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(notification.id);
                            }}
                            className="p-1 rounded-lg transition-colors text-red-400 hover:text-red-500 hover:bg-red-50"
                            title="Delete"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
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
    const [currentPage, setCurrentPage] = useState(1);

    // Check permissions for the 'notifications' component
    const hasViewPermission = canView('notifications');
    const hasEditPermission = canEdit('notifications');
    const hasDeletePermission = canDelete('notifications');

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

    // Pagination
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginatedNotifications = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filtered, currentPage]);

    const unreadCount = useMemo(() => notifications.filter(n => n.status === 'unread').length, [notifications]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, filterType, filterStatus]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-2xl">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-400 border-t-transparent mx-auto" />
                    <p className="mt-4 text-sm text-gray-500">Loading notifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6 px-2 sm:px-0 bg-gray-50 min-h-screen p-4 rounded-2xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-orange-200 shadow-sm">
                <div>
                    <h1 className="text-lg sm:text-xl font-bold text-gray-800">Notifications</h1>
                    <p className="text-xs sm:text-sm mt-0.5 text-gray-500">
                        {unreadCount} unread • {notifications.length} total
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {unreadCount > 0 && (
                        <button onClick={handleMarkAllAsRead}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl transition-colors bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-100">
                            <Check size={14} /> Mark All Read
                        </button>
                    )}
                    {notifications.length > 0 && hasDeletePermission && (
                        <button onClick={handleDeleteAll}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl transition-colors bg-red-50 text-red-500 border border-red-200 hover:bg-red-100">
                            <Trash2 size={14} /> Clear All
                        </button>
                    )}
                    <button onClick={loadNotifications}
                        className="p-2 rounded-xl transition-colors bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-100">
                        <RefreshCw size={16} />
                    </button>
                    {/* <button onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-xl transition-all bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-orange-500/30 shadow-sm">
                        <Plus size={16} /> New
                    </button> */}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {[
                    { label: 'Total', value: notifications.length, icon: Bell, color: '#FF7D38' },
                    { label: 'Unread', value: unreadCount, icon: Bell, color: '#34d399' },
                    { label: 'Read', value: notifications.filter(n => n.status === 'read').length, icon: Check, color: '#3b82f6' },
                    { label: 'Alerts', value: notifications.filter(n => n.type === 'alert').length, icon: AlertCircle, color: '#ef4444' },
                ].map(stat => (
                    <div
                        key={stat.label}
                        className="relative overflow-hidden rounded-2xl p-3 sm:p-4 text-center bg-white border border-orange-200 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                        <div className="absolute -top-8 -left-8 w-20 h-20 rounded-full bg-orange-400/10" />
                        <div className="absolute -top-4 -left-4 w-28 h-28 rounded-full border border-orange-300/20" />
                        <div className="absolute -top-8 -left-8 w-36 h-36 rounded-full border border-orange-300/10" />
                        <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-orange-400/10" />
                        <div className="relative z-10">
                            <stat.icon size={16} className="mx-auto mb-2" style={{ color: stat.color }} />
                            <p className="text-lg sm:text-xl font-bold text-orange-500">{stat.value}</p>
                            <p className="text-[10px] sm:text-xs text-gray-500">{stat.label}</p>
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
                            placeholder="Search notifications..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all bg-white border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                        />
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3.5 py-2.5 text-sm rounded-xl transition-all bg-white border border-orange-200 text-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    >
                        <option value="All" className="bg-white">All Types</option>
                        <option value="info" className="bg-white">Info</option>
                        <option value="success" className="bg-white">Success</option>
                        <option value="warning" className="bg-white">Warning</option>
                        <option value="alert" className="bg-white">Alert</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3.5 py-2.5 text-sm rounded-xl transition-all bg-white border border-orange-200 text-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    >
                        <option value="All" className="bg-white">All Status</option>
                        <option value="unread" className="bg-white">Unread</option>
                        <option value="read" className="bg-white">Read</option>
                    </select>
                    <div className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl whitespace-nowrap bg-orange-50 text-orange-500 border border-orange-200">
                        <Bell size={14} />
                        <span>{filtered.length}</span>
                    </div>
                </div>
            </Panel>

            {/* Notifications List */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 rounded-2xl bg-white border border-orange-200">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-orange-50">
                        <BellOff size={32} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-800">No notifications</p>
                    <p className="text-xs mt-1 text-gray-500">Try adjusting your filters</p>
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {paginatedNotifications.map(notification => (
                            <NotificationCard
                                key={notification.id}
                                notification={notification}
                                onMarkAsRead={handleMarkAsRead}
                                onDelete={handleDelete}
                                hasDeletePermission={hasDeletePermission}
                            />
                        ))}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filtered.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                    />
                </>
            )}

            {/* Create Modal */}
            <CreateNotificationModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreate}
            />
        </div>
    );
};

export default AdminNotifications;
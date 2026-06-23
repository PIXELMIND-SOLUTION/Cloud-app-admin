// pages/AdminNotifications.js - Complete Notification Management
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
            background: 'rgba(20, 16, 36, 0.8)',
            border: '1px solid rgba(139,92,246,0.15)',
            backdropFilter: 'blur(12px)',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.35)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'}
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
                message: "Multiple failed login attempts detected from IP 192.168.1.100. Immediate action required.",
                type: "alert",
                priority: "high",
                status: "unread",
                createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
                readAt: null,
                category: "security",
                actions: [
                    { label: "Block IP", action: "block" },
                    { label: "Investigate", action: "investigate" }
                ],
                metadata: {
                    ip: "192.168.1.100",
                    attempts: 5,
                    location: "Unknown"
                }
            },
            {
                id: 2,
                title: "New Device Enrollment Request",
                message: "iPhone 14 Pro (Serial: F2LZR4N8HD) requests enrollment from user Raj Mehta.",
                type: "info",
                priority: "medium",
                status: "unread",
                createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
                readAt: null,
                category: "device",
                actions: [
                    { label: "Approve", action: "approve" },
                    { label: "Reject", action: "reject" }
                ],
                metadata: {
                    device: "iPhone 14 Pro",
                    user: "Raj Mehta",
                    serial: "F2LZR4N8HD"
                }
            },
            {
                id: 3,
                title: "System Update: New Version Available",
                message: "MDM Server v3.2.0 is now available. Features include enhanced security and performance improvements.",
                type: "info",
                priority: "low",
                status: "read",
                createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
                readAt: new Date(Date.now() - 1.5 * 3600000).toISOString(),
                category: "system",
                actions: [
                    { label: "Update Now", action: "update" },
                    { label: "Schedule", action: "schedule" }
                ],
                metadata: {
                    version: "3.2.0",
                    releaseDate: "2024-01-15"
                }
            },
            {
                id: 4,
                title: "Compliance Violation Detected",
                message: "7 devices are out of compliance with security policies. Immediate action required.",
                type: "alert",
                priority: "high",
                status: "unread",
                createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
                readAt: null,
                category: "compliance",
                actions: [
                    { label: "View Devices", action: "view" },
                    { label: "Enforce Policy", action: "enforce" }
                ],
                metadata: {
                    deviceCount: 7,
                    policy: "Security Policy v2.1"
                }
            },
            {
                id: 5,
                title: "Weekly Analytics Report Available",
                message: "Your weekly device analytics report is ready. 342 new devices enrolled, 12 security incidents resolved.",
                type: "success",
                priority: "low",
                status: "read",
                createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
                readAt: new Date(Date.now() - 4.5 * 3600000).toISOString(),
                category: "analytics",
                actions: [
                    { label: "View Report", action: "view" }
                ],
                metadata: {
                    period: "Week 3",
                    newDevices: 342,
                    resolvedIncidents: 12
                }
            },
            {
                id: 6,
                title: "Certificate Expiration Warning",
                message: "SSL certificate for api.mdm.io will expire in 7 days. Please renew to avoid service disruption.",
                type: "warning",
                priority: "medium",
                status: "unread",
                createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
                readAt: null,
                category: "security",
                actions: [
                    { label: "Renew Certificate", action: "renew" },
                    { label: "Remind Later", action: "remind" }
                ],
                metadata: {
                    certificate: "api.mdm.io SSL",
                    expiresIn: "7 days"
                }
            },
            {
                id: 7,
                title: "New User Registration",
                message: "5 new users have registered in the last hour. Welcome them to the platform.",
                type: "info",
                priority: "low",
                status: "read",
                createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
                readAt: new Date(Date.now() - 5.5 * 3600000).toISOString(),
                category: "user",
                actions: [
                    { label: "View Users", action: "view" }
                ],
                metadata: {
                    newUsers: 5,
                    timeRange: "1 hour"
                }
            },
            {
                id: 8,
                title: "Device Offline Alert",
                message: "Critical device 'Server-01' is offline for more than 30 minutes. Investigation recommended.",
                type: "alert",
                priority: "high",
                status: "unread",
                createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
                readAt: null,
                category: "device",
                actions: [
                    { label: "Investigate", action: "investigate" },
                    { label: "Acknowledge", action: "acknowledge" }
                ],
                metadata: {
                    device: "Server-01",
                    offlineDuration: "30 minutes"
                }
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
            status: 'unread',
            readAt: null
        };
        notifications.unshift(newNotification);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        return newNotification;
    },

    update: (id, updates) => {
        const notifications = NotificationService.getAll();
        const index = notifications.findIndex(n => n.id === id);
        if (index === -1) throw new Error('Notification not found');
        notifications[index] = {
            ...notifications[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem('notifications', JSON.stringify(notifications));
        return notifications[index];
    },

    delete: (id) => {
        const notifications = NotificationService.getAll();
        const filtered = notifications.filter(n => n.id !== id);
        localStorage.setItem('notifications', JSON.stringify(filtered));
        return filtered;
    },

    markAsRead: (id) => {
        return NotificationService.update(id, { 
            status: 'read', 
            readAt: new Date().toISOString() 
        });
    },

    markAllAsRead: () => {
        const notifications = NotificationService.getAll();
        const updated = notifications.map(n => ({
            ...n,
            status: 'read',
            readAt: new Date().toISOString()
        }));
        localStorage.setItem('notifications', JSON.stringify(updated));
        return updated;
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
        alert: { icon: AlertCircle, color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
        warning: { icon: AlertTriangle, color: '#fcd34d', bg: 'rgba(251,191,36,0.12)' },
        info: { icon: Info, color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
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
        high: { color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
        medium: { color: '#fcd34d', bg: 'rgba(251,191,36,0.12)' },
        low: { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' }
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
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${status === 'unread' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${status === 'unread' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
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
        category: 'system',
        actions: [{ label: '', action: '' }]
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                title: '',
                message: '',
                type: 'info',
                priority: 'medium',
                category: 'system',
                actions: [{ label: '', action: '' }]
            });
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
        
        const notification = {
            ...formData,
            actions: formData.actions.filter(a => a.label.trim() && a.action.trim())
        };
        onCreate(notification);
        onClose();
    };

    const addAction = () => {
        setFormData(prev => ({
            ...prev,
            actions: [...prev.actions, { label: '', action: '' }]
        }));
    };

    const removeAction = (index) => {
        setFormData(prev => ({
            ...prev,
            actions: prev.actions.filter((_, i) => i !== index)
        }));
    };

    const updateAction = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            actions: prev.actions.map((a, i) => i === index ? { ...a, [field]: value } : a)
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                style={{ background: 'rgba(20, 16, 36, 0.95)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(139,92,246,0.15)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                            <Bell size={20} className="text-white" />
                        </div>
                        <h2 className="text-lg font-bold" style={{ color: '#e2d9f3' }}>Create Notification</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-purple-500/10" style={{ color: '#5a4f72' }}>
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#9c8fc0' }}>Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl transition-all"
                                style={{
                                    background: 'rgba(139,92,246,0.08)',
                                    border: errors.title ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(139,92,246,0.15)',
                                    color: '#e2d9f3'
                                }}
                                placeholder="Enter notification title..."
                            />
                            {errors.title && <p className="mt-1 text-xs" style={{ color: '#f87171' }}>{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#9c8fc0' }}>Message *</label>
                            <textarea
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2.5 rounded-xl transition-all resize-none"
                                style={{
                                    background: 'rgba(139,92,246,0.08)',
                                    border: errors.message ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(139,92,246,0.15)',
                                    color: '#e2d9f3'
                                }}
                                placeholder="Enter notification message..."
                            />
                            {errors.message && <p className="mt-1 text-xs" style={{ color: '#f87171' }}>{errors.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: '#9c8fc0' }}>Type</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl transition-all"
                                    style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', color: '#e2d9f3' }}
                                >
                                    <option value="info" style={{ background: '#1a1430' }}>Info</option>
                                    <option value="success" style={{ background: '#1a1430' }}>Success</option>
                                    <option value="warning" style={{ background: '#1a1430' }}>Warning</option>
                                    <option value="alert" style={{ background: '#1a1430' }}>Alert</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: '#9c8fc0' }}>Priority</label>
                                <select
                                    value={formData.priority}
                                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl transition-all"
                                    style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', color: '#e2d9f3' }}
                                >
                                    <option value="low" style={{ background: '#1a1430' }}>Low</option>
                                    <option value="medium" style={{ background: '#1a1430' }}>Medium</option>
                                    <option value="high" style={{ background: '#1a1430' }}>High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: '#9c8fc0' }}>Category</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl transition-all"
                                    style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', color: '#e2d9f3' }}
                                >
                                    <option value="system" style={{ background: '#1a1430' }}>System</option>
                                    <option value="security" style={{ background: '#1a1430' }}>Security</option>
                                    <option value="device" style={{ background: '#1a1430' }}>Device</option>
                                    <option value="user" style={{ background: '#1a1430' }}>User</option>
                                    <option value="compliance" style={{ background: '#1a1430' }}>Compliance</option>
                                    <option value="analytics" style={{ background: '#1a1430' }}>Analytics</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#9c8fc0' }}>Actions</label>
                            <div className="space-y-2">
                                {formData.actions.map((action, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={action.label}
                                            onChange={e => updateAction(index, 'label', e.target.value)}
                                            className="flex-1 px-4 py-2 rounded-xl transition-all"
                                            style={{
                                                background: 'rgba(139,92,246,0.08)',
                                                border: '1px solid rgba(139,92,246,0.15)',
                                                color: '#e2d9f3'
                                            }}
                                            placeholder="Action label..."
                                        />
                                        <input
                                            type="text"
                                            value={action.action}
                                            onChange={e => updateAction(index, 'action', e.target.value)}
                                            className="flex-1 px-4 py-2 rounded-xl transition-all"
                                            style={{
                                                background: 'rgba(139,92,246,0.08)',
                                                border: '1px solid rgba(139,92,246,0.15)',
                                                color: '#e2d9f3'
                                            }}
                                            placeholder="Action key..."
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeAction(index)}
                                            disabled={formData.actions.length === 1}
                                            className="p-2 rounded-lg transition-colors hover:bg-red-500/10 disabled:opacity-30"
                                            style={{ color: '#f87171' }}
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addAction}
                                    className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-purple-300"
                                    style={{ color: '#a78bfa' }}
                                >
                                    <Plus size={16} /> Add Action
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t rounded-b-2xl" style={{ borderColor: 'rgba(139,92,246,0.15)' }}>
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-xl transition-colors hover:bg-purple-500/10" style={{ color: '#9c8fc0' }}>
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all shadow-sm hover:shadow-purple-500/50"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)', boxShadow: '0 0 10px rgba(124,58,237,0.2)' }}>
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
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    const loadNotifications = () => {
        setLoading(true);
        setTimeout(() => {
            const data = NotificationService.getAll();
            setNotifications(data);
            setLoading(false);
        }, 300);
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleCreate = (data) => {
        const newNotification = NotificationService.create(data);
        setNotifications(prev => [newNotification, ...prev]);
    };

    const handleDelete = (id) => {
        if (!window.confirm('Are you sure you want to delete this notification?')) return;
        const remaining = NotificationService.delete(id);
        setNotifications(remaining);
    };

    const handleMarkAsRead = (id) => {
        const updated = NotificationService.markAsRead(id);
        setNotifications(prev => prev.map(n => n.id === updated.id ? updated : n));
    };

    const handleMarkAllAsRead = () => {
        const updated = NotificationService.markAllAsRead();
        setNotifications(updated);
    };

    const handleDeleteAll = () => {
        if (!window.confirm('Are you sure you want to delete all notifications?')) return;
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

    const unreadCount = useMemo(() => {
        return notifications.filter(n => n.status === 'unread').length;
    }, [notifications]);

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
                className={`rounded-xl p-4 transition-all ${notification.status === 'unread' ? 'border-purple-500/30' : ''}`}
                style={{
                    background: notification.status === 'unread' 
                        ? 'rgba(139,92,246,0.08)' 
                        : 'rgba(20,16,36,0.6)',
                    border: `1px solid ${notification.status === 'unread' ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.06)'}`
                }}
            >
                <div className="flex items-start gap-3">
                    <NotificationIcon type={notification.type} />
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold" style={{ color: '#e2d9f3' }}>{notification.title}</h4>
                                <p className="text-xs mt-0.5" style={{ color: '#5a4f72' }}>{notification.message}</p>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <PriorityBadge priority={notification.priority} />
                                <StatusBadge status={notification.status} />
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="text-[10px]" style={{ color: '#5a4f72' }}>
                                <Clock size={10} className="inline mr-1" />
                                {formatTime(notification.createdAt)}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full capitalize" style={{ background: 'rgba(139,92,246,0.06)', color: '#7c6fa0' }}>
                                {notification.category}
                            </span>
                        </div>
                        {isExpanded && notification.actions.length > 0 && (
                            <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(139,92,246,0.08)' }}>
                                <p className="text-[10px] font-medium mb-2" style={{ color: '#5a4f72' }}>Actions</p>
                                <div className="flex flex-wrap gap-2">
                                    {notification.actions.map((action, i) => (
                                        <button key={i} className="text-xs px-3 py-1 rounded-lg transition-colors hover:bg-purple-500/20"
                                            style={{ background: 'rgba(139,92,246,0.08)', color: '#a78bfa' }}>
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {isExpanded && notification.metadata && (
                            <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(139,92,246,0.08)' }}>
                                <p className="text-[10px] font-medium mb-2" style={{ color: '#5a4f72' }}>Details</p>
                                <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: '#7c6fa0' }}>
                                    {Object.entries(notification.metadata).map(([key, value]) => (
                                        <div key={key} className="flex items-center gap-1">
                                            <span className="capitalize">{key}:</span>
                                            <span style={{ color: '#c4b5fd' }}>{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => setExpandedId(isExpanded ? null : notification.id)}
                            className="p-1 rounded-lg transition-colors hover:bg-purple-500/10"
                            style={{ color: '#5a4f72' }}
                        >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        {notification.status === 'unread' && (
                            <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="p-1 rounded-lg transition-colors hover:bg-emerald-500/10"
                                style={{ color: '#5a4f72' }}
                                title="Mark as read"
                            >
                                <Check size={14} />
                            </button>
                        )}
                        <button
                            onClick={() => handleDelete(notification.id)}
                            className="p-1 rounded-lg transition-colors hover:bg-red-500/10"
                            style={{ color: '#5a4f72' }}
                            title="Delete"
                        >
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
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-400 border-t-transparent mx-auto" />
                    <p className="mt-4 text-sm" style={{ color: '#5a4f72' }}>Loading notifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-lg sm:text-xl font-bold" style={{ color: '#e2d9f3' }}>Notifications</h1>
                    <p className="text-xs sm:text-sm mt-0.5" style={{ color: '#5a4f72' }}>
                        {unreadCount} unread notifications • {notifications.length} total
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl transition-colors hover:bg-purple-500/10"
                            style={{ color: '#a78bfa', border: '1px solid rgba(139,92,246,0.15)' }}
                        >
                            <Check size={14} /> Mark All Read
                        </button>
                    )}
                    {notifications.length > 0 && (
                        <button
                            onClick={handleDeleteAll}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl transition-colors hover:bg-red-500/10"
                            style={{ color: '#f87171', border: '1px solid rgba(239,68,68,0.15)' }}
                        >
                            <Trash2 size={14} /> Clear All
                        </button>
                    )}
                    <button
                        onClick={loadNotifications}
                        className="p-2 rounded-xl transition-colors hover:bg-purple-500/10"
                        style={{ color: '#5a4f72', border: '1px solid rgba(139,92,246,0.15)' }}
                    >
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-xl transition-all shadow-sm hover:shadow-purple-500/50"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)', boxShadow: '0 0 10px rgba(124,58,237,0.2)' }}
                    >
                        <Plus size={16} /> New Notification
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {[
                    { label: 'Total', value: notifications.length, icon: Bell, color: '#a78bfa' },
                    { label: 'Unread', value: unreadCount, icon: Bell, color: '#34d399' },
                    { label: 'Read', value: notifications.filter(n => n.status === 'read').length, icon: Check, color: '#60a5fa' },
                    { label: 'Alerts', value: notifications.filter(n => n.type === 'alert').length, icon: AlertCircle, color: '#f87171' },
                ].map(stat => (
                    <div key={stat.label} className="rounded-2xl p-3 sm:p-4 text-center" style={{ background: 'rgba(20,16,36,0.8)', border: '1px solid rgba(139,92,246,0.12)' }}>
                        <stat.icon size={16} className="mx-auto mb-1" style={{ color: stat.color }} />
                        <p className="text-lg sm:text-xl font-bold" style={{ color: '#e2d9f3' }}>{stat.value}</p>
                        <p className="text-[10px] sm:text-xs" style={{ color: '#5a4f72' }}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <Panel className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#5a4f72' }} />
                        <input
                            type="text"
                            placeholder="Search notifications..."
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
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3.5 py-2.5 text-sm rounded-xl transition-all"
                        style={{
                            background: 'rgba(139,92,246,0.08)',
                            border: '1px solid rgba(139,92,246,0.15)',
                            color: '#e2d9f3'
                        }}
                    >
                        <option value="All" style={{ background: '#1a1430' }}>All Types</option>
                        <option value="info" style={{ background: '#1a1430' }}>Info</option>
                        <option value="success" style={{ background: '#1a1430' }}>Success</option>
                        <option value="warning" style={{ background: '#1a1430' }}>Warning</option>
                        <option value="alert" style={{ background: '#1a1430' }}>Alert</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3.5 py-2.5 text-sm rounded-xl transition-all"
                        style={{
                            background: 'rgba(139,92,246,0.08)',
                            border: '1px solid rgba(139,92,246,0.15)',
                            color: '#e2d9f3'
                        }}
                    >
                        <option value="All" style={{ background: '#1a1430' }}>All Status</option>
                        <option value="unread" style={{ background: '#1a1430' }}>Unread</option>
                        <option value="read" style={{ background: '#1a1430' }}>Read</option>
                    </select>
                    <div className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl whitespace-nowrap" style={{ color: '#9c8fc0', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.1)' }}>
                        <Bell size={14} />
                        <span>{filtered.length} notifications</span>
                    </div>
                </div>
            </Panel>

            {/* Notifications List */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 rounded-2xl" style={{ background: 'rgba(20,16,36,0.8)', border: '1px solid rgba(139,92,246,0.15)' }}>
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(139,92,246,0.08)' }}>
                        <BellOff size={32} style={{ color: '#5a4f72' }} />
                    </div>
                    <p className="text-sm font-medium" style={{ color: '#9c8fc0' }}>No notifications found</p>
                    <p className="text-xs mt-1" style={{ color: '#5a4f72' }}>Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(notification => (
                        <NotificationCard key={notification.id} notification={notification} />
                    ))}
                </div>
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
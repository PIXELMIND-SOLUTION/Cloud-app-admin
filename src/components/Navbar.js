// components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, ChevronRight, X, Check, Clock, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';

const NAV_ITEMS = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Registered Users", path: "/admin/users" },
  { label: "Analytics", path: "/admin/analytics" },
  { label: "Complaints", path: "/admin/complaints" },
  { label: "All Plans", path: "/admin/plans" },
  { label: "Staff Members", path: "/admin/staff" },
  { label: "Staff Creation", path: "/admin/staff/add" },
  { label: "Notifications", path: "/admin/notifications" },
  { label: "Settings", path: "/admin/settings" },
];

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
        message: "Your weekly device analytics report is ready for review.",
        type: "success",
        priority: "low",
        status: "unread",
        createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
        category: "analytics"
      }
    ];
    localStorage.setItem('notifications', JSON.stringify(defaultNotifications));
    return defaultNotifications;
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

  getUnreadCount: () => {
    const notifications = NotificationService.getAll();
    return notifications.filter(n => n.status === 'unread').length;
  }
};

// ── Notification Icon Helper ──────────────────────────────────────────────────
const getNotificationIcon = (type) => {
  const configs = {
    alert: { icon: AlertCircle, color: '#FF7D38', bg: 'rgba(255,125,56,0.12)' },
    warning: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    info: { icon: Info, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    success: { icon: CheckCircle, color: '#34d399', bg: 'rgba(52,211,153,0.12)' }
  };
  return configs[type] || configs.info;
};

// ── Format Time Helper ──────────────────────────────────────────────────────
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

// ── Notification Dropdown Component ──────────────────────────────────────────
const NotificationDropdown = ({ isOpen, onClose, onNotificationCountChange }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  const loadNotifications = () => {
    setLoading(true);
    setTimeout(() => {
      const data = NotificationService.getAll();
      setNotifications(data);
      setLoading(false);
    }, 200);
  };

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleMarkAsRead = (id) => {
    const updated = NotificationService.markAsRead(id);
    if (updated) {
      setNotifications(prev => prev.map(n => n.id === updated.id ? updated : n));
      onNotificationCountChange();
    }
  };

  const handleMarkAllAsRead = () => {
    const updated = NotificationService.markAllAsRead();
    setNotifications(updated);
    onNotificationCountChange();
  };

  const handleDelete = (id) => {
    const remaining = NotificationService.delete(id);
    setNotifications(remaining);
    onNotificationCountChange();
  };

  const unreadCount = notifications.filter(n => n.status === 'unread').length;
  const recentNotifications = notifications.slice(0, 5);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-96 max-h-[480px] bg-white rounded-2xl shadow-2xl border border-orange-200 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-orange-100 bg-orange-50">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-orange-500" />
          <span className="font-semibold text-gray-800">Notifications</span>
          {unreadCount > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-500 text-white">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs font-medium text-orange-500 hover:text-orange-600 transition-colors"
            >
              Mark all read
            </button>
          )}
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-orange-100 transition-colors text-gray-400">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="overflow-y-auto max-h-[380px]">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-orange-400 border-t-transparent" />
          </div>
        ) : recentNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-500">No notifications</p>
            <p className="text-xs text-gray-400">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-orange-100">
            {recentNotifications.map((notification) => {
              const iconConfig = getNotificationIcon(notification.type);
              const Icon = iconConfig.icon;
              const isUnread = notification.status === 'unread';

              return (
                <div
                  key={notification.id}
                  className={`px-4 py-3 transition-colors hover:bg-orange-50 cursor-pointer ${
                    isUnread ? 'bg-orange-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="p-1.5 rounded-lg shrink-0 mt-0.5"
                      style={{ background: iconConfig.bg }}
                    >
                      <Icon size={14} style={{ color: iconConfig.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs font-medium ${isUnread ? 'text-gray-800' : 'text-gray-600'}`}>
                          {notification.title}
                        </p>
                        {isUnread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] text-gray-400 flex items-center gap-0.5">
                          <Clock size={10} />
                          {formatTime(notification.createdAt)}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full capitalize bg-orange-50 text-orange-500 border border-orange-200">
                          {notification.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        {isUnread && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-500 border border-blue-200 hover:bg-blue-100 transition-colors"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                          className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
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
      {notifications.length > 0 && (
        <div className="px-4 py-2.5 border-t border-orange-100 bg-gray-50">
          <button
            onClick={() => {
              onClose();
              window.location.href = '/admin/notifications';
            }}
            className="w-full text-center text-xs font-medium text-orange-500 hover:text-orange-600 transition-colors"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

// ── Main Navbar Component ──────────────────────────────────────────────────────
export const Navbar = ({ setOpen, activePage }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDot, setShowDot] = useState(true);

  const label = NAV_ITEMS.find(n => n.path === activePage)?.label ?? "Dashboard";

  const updateUnreadCount = () => {
    const count = NotificationService.getUnreadCount();
    setUnreadCount(count);
    setShowDot(count > 0);
  };

  useEffect(() => {
    updateUnreadCount();
    // Listen for notification changes
    const handleStorageChange = () => {
      updateUnreadCount();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (isNotificationOpen) {
      // Re-fetch count when closing
      updateUnreadCount();
    }
  };

  return (
    <header className="flex items-center px-4 gap-4 shrink-0 sticky top-0 z-10 h-16 bg-white border-b border-orange-200/30 shadow-sm">
      {/* Mobile menu toggle */}
      <button
        className="lg:hidden p-1.5 rounded-lg transition-colors text-orange-500 hover:bg-orange-50"
        onClick={() => setOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-600 text-xs">CloudApp</span>
        <ChevronRight size={12} className="text-orange-500" />
        <span className="font-semibold text-gray-900 text-xs">{label}</span>
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={toggleNotification}
            className="relative p-2 rounded-xl transition-all bg-orange-50/50 border border-orange-200/30 text-orange-500 hover:bg-orange-100/50 hover:border-orange-300/50"
          >
            <Bell size={16} />
            {showDot && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shadow-lg shadow-red-500/50 animate-pulse" />
            )}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[9px] font-bold text-white bg-red-500 rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg shadow-red-500/30">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={() => {
              setIsNotificationOpen(false);
              updateUnreadCount();
            }}
            onNotificationCountChange={updateUnreadCount}
          />
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold cursor-pointer overflow-hidden transition-all bg-gradient-to-br from-orange-500 to-orange-600 border border-orange-300/50 shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/40 hover:border-orange-400/70">
          <img src='/admin.png' className='w-9 h-9 object-cover' alt="admin" />
        </div>
      </div>
    </header>
  );
};
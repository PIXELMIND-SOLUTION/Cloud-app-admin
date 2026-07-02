// components/AdminReports.js - Light Theme with Saffron Accents - Complaint Management with Inline Edit
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    BarChart3, Download, Filter,
    Calendar, Users, Smartphone, DollarSign, TrendingUp,
    TrendingDown, Activity, AlertCircle, CheckCircle,
    Clock, Zap, Shield, Server, RefreshCw,
    FileText, Printer, Mail,
    UserCheck, UserX, Package, CreditCard, Percent,
    ArrowUpRight, ArrowDownRight, Minus, X,
    MessageSquare, ThumbsUp, ThumbsDown, Star,
    Clock as ClockIcon, Search, Eye,
    ChevronLeft, ChevronRight, MoreHorizontal, Flag,
    Edit, Trash2, Save
} from 'lucide-react';
import { canDelete, canEdit, canView } from '../view/Permissions';

// ── Constants ──────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 5;

const STATUS_COLORS = {
    'open': { bg: 'rgba(255,125,56,0.15)', text: '#FF7D38' },
    'in progress': { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b' },
    'resolved': { bg: 'rgba(52,211,153,0.15)', text: '#34d399' },
    'escalated': { bg: 'rgba(239,68,68,0.15)', text: '#ef4444' },
    'pending': { bg: 'rgba(139,92,246,0.15)', text: '#8b5cf6' },
    'closed': { bg: 'rgba(107,114,128,0.15)', text: '#6b7280' },
    'read': { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6' }
};

const STATUS_OPTIONS = ['Open', 'In Progress', 'Resolved', 'Escalated', 'Pending', 'Closed', 'Read'];

const PRIORITY_COLORS = {
    'critical': '#ef4444',
    'high': '#FF7D38',
    'medium': '#f59e0b',
    'low': '#34d399'
};

const CATEGORY_COLORS = {
    'technical': { bg: 'rgba(255,125,56,0.15)', text: '#FF7D38' },
    'billing': { bg: 'rgba(52,211,153,0.15)', text: '#34d399' },
    'usability': { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6' },
    'security': { bg: 'rgba(239,68,68,0.15)', text: '#ef4444' },
    'performance': { bg: 'rgba(167,139,250,0.15)', text: '#a78bfa' },
    'network': { bg: 'rgba(236,72,153,0.15)', text: '#ec4899' },
    'account': { bg: 'rgba(251,191,36,0.15)', text: '#f59e0b' }
};

// ── UI Components ─────────────────────────────────────────────────────────────
const Panel = ({ children, className = "" }) => (
    <div
        className={`rounded-2xl p-5 bg-white ${className}`}
        style={{
            border: '1px solid rgba(255,125,56,0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}
    >
        {children}
    </div>
);

const StatCard = ({ label, value, icon: Icon, color, change, changeLabel }) => (
    <div className="relative overflow-hidden rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg bg-white border border-orange-200 shadow-sm">
        <div className="absolute -top-8 -left-8 w-20 h-20 rounded-full bg-orange-400/10" />
        <div className="absolute -top-4 -left-4 w-28 h-28 rounded-full border border-orange-300/20" />
        <div className="absolute -top-8 -left-8 w-36 h-36 rounded-full border border-orange-300/10" />
        <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-orange-400/10" />
        <div className="relative z-10 flex items-start justify-between">
            <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</p>
                <p className="text-2xl font-bold mt-1 text-gray-800">{value}</p>
                {change && (
                    <div className="flex items-center gap-1 mt-1">
                        <span className={`text-xs font-medium ${change.includes("+") ? "text-green-500" : "text-red-500"}`}>
                            {change}
                        </span>
                        <span className="text-xs text-gray-400">{changeLabel}</span>
                    </div>
                )}
            </div>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg shrink-0`}>
                <Icon size={18} className="text-white" />
            </div>
        </div>
    </div>
);

// ── Complaint Modal Component ──────────────────────────────────────────────────
const ComplaintModal = ({ complaint, isOpen, onClose }) => {
    if (!isOpen || !complaint) return null;

    const statusStyle = STATUS_COLORS[complaint.status.toLowerCase()] || STATUS_COLORS['open'];
    const priorityColor = PRIORITY_COLORS[complaint.priority.toLowerCase()] || '#6b7280';
    const categoryStyle = CATEGORY_COLORS[complaint.category.toLowerCase()] || CATEGORY_COLORS['technical'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col bg-white border border-orange-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-orange-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-50">
                            <FileText size={20} className="text-orange-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Complaint Details</h2>
                            <p className="text-xs text-gray-500">ID: {complaint.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-orange-50 text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: statusStyle.bg, color: statusStyle.text }}>
                            {complaint.status}
                        </span>
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: categoryStyle.bg, color: categoryStyle.text }}>
                            {complaint.category}
                        </span>
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: priorityColor + '20', color: priorityColor }}>
                            <Flag size={12} className="inline mr-1" />
                            {complaint.priority}
                        </span>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-800">{complaint.title}</h3>
                        <p className="text-sm mt-2 text-gray-600">{complaint.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-orange-50 border border-orange-200">
                        <div>
                            <p className="text-xs text-gray-500">User</p>
                            <p className="text-sm font-medium text-gray-700">{complaint.user}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Device</p>
                            <p className="text-sm font-medium text-gray-700">{complaint.device || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Time</p>
                            <p className="text-sm font-medium text-gray-700">{complaint.time}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Comments</p>
                            <p className="text-sm font-medium text-gray-700">{complaint.comments}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end px-6 py-4 border-t border-orange-100 rounded-b-2xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-xl transition-colors text-gray-600 hover:bg-gray-50">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Complaint Card with Inline Status Edit ────────────────────────────────────
const ComplaintCard = ({ complaint, onViewDetails, onStatusChange, onDelete, hasEditPermission, hasViewPermission, hasDeletePermission }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(complaint.status);

    const statusStyle = STATUS_COLORS[complaint.status.toLowerCase()] || STATUS_COLORS['open'];
    const priorityColor = PRIORITY_COLORS[complaint.priority.toLowerCase()] || '#6b7280';
    const categoryStyle = CATEGORY_COLORS[complaint.category.toLowerCase()] || CATEGORY_COLORS['technical'];

    const handleSaveStatus = () => {
        if (selectedStatus !== complaint.status) {
            onStatusChange({ ...complaint, status: selectedStatus });
        }
        setIsEditing(false);
    };

    return (
        <div className="rounded-xl p-4 border transition-all duration-200 hover:border-orange-300 bg-white border-orange-200 shadow-sm hover:shadow-md">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-gray-500">{complaint.id}</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: categoryStyle.bg, color: categoryStyle.text }}>
                        {complaint.category}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: priorityColor + '20', color: priorityColor }}>
                        <Flag size={10} className="inline mr-1" />
                        {complaint.priority}
                    </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs flex items-center gap-1 text-gray-500">
                        <ClockIcon size={12} /> {complaint.time}
                    </span>
                </div>
            </div>

            <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-800">{complaint.title}</h4>
                    <p className="text-xs mt-1 line-clamp-2 text-gray-600">{complaint.description}</p>
                </div>

                {isEditing ? (
                    <div className="flex items-center gap-1 shrink-0">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="text-[10px] font-medium px-2 py-1 rounded-lg border border-orange-200 bg-white text-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                        >
                            {STATUS_OPTIONS.map(status => (
                                <option key={status} value={status.toLowerCase()}>{status}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleSaveStatus}
                            className="p-1 rounded-lg transition-colors bg-green-50 text-green-500 hover:bg-green-100"
                        >
                            <Save size={14} />
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setSelectedStatus(complaint.status);
                            }}
                            className="p-1 rounded-lg transition-colors bg-gray-50 text-gray-500 hover:bg-gray-100"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-medium px-2.5 py-1 rounded-full" style={{ background: statusStyle.bg, color: statusStyle.text }}>
                            {complaint.status}
                        </span>
                        {hasEditPermission && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-1 rounded-lg transition-colors text-gray-400 hover:text-orange-500 hover:bg-orange-50"
                                title="Edit Status"
                            >
                                <Edit size={14} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                <div className="flex items-center gap-3">
                    <span className="text-gray-600">
                        <UserCheck size={12} className="inline mr-1 text-gray-400" />
                        {complaint.user}
                    </span>
                    <span className="text-gray-600">
                        <MessageSquare size={12} className="inline mr-1 text-gray-400" />
                        {complaint.comments} comments
                    </span>
                    {complaint.device && (
                        <span className="text-gray-600">
                            <Smartphone size={12} className="inline mr-1 text-gray-400" />
                            {complaint.device}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {hasViewPermission && (
                        <button
                            onClick={() => onViewDetails(complaint)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-100"
                        >
                            <Eye size={12} /> View
                        </button>
                    )}
                    {hasEditPermission && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium bg-blue-50 text-blue-500 border border-blue-200 hover:bg-blue-100"
                        >
                            <Edit size={12} /> Edit
                        </button>
                    )}

                    {hasDeletePermission && (
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this complaint?')) {
                                    onDelete(complaint.id);
                                }
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium bg-red-50 text-red-500 border border-red-200 hover:bg-red-100"
                        >
                            <Trash2 size={12} /> Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Pagination Component ──────────────────────────────────────────────────────
const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
    const getPageNumbers = useCallback(() => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    }, [currentPage, totalPages]);

    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-orange-200">
            <div className="text-xs text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} complaints
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
                    <button
                        key={index}
                        onClick={() => typeof page === 'number' && onPageChange(page)}
                        disabled={page === '...' || page === currentPage}
                        className={`min-w-[32px] h-8 px-2 rounded-lg text-xs transition-all ${page === currentPage ? 'font-semibold bg-orange-500 text-white shadow-md' : 'text-gray-600 hover:bg-orange-50'
                            }`}
                    >
                        {page}
                    </button>
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

// ── Data Service ──────────────────────────────────────────────────────────
const ComplaintService = {
    getAppOverview: () => ({
        totalComplaints: 347,
        pendingComplaints: 89,
        resolvedComplaints: 212,
        escalatedComplaints: 46,
        satisfactionRate: 87,
        responseRate: 92,
        avgResolutionTime: '4.2h'
    }),

    getRecentComplaints: () => [
        {
            id: 'C-1001',
            title: 'Payment completed but subscription not activated',
            user: 'Vijay N',
            category: 'Billing',
            priority: 'High',
            status: 'In Progress',
            time: '2 min ago',
            description: 'Facing issue even after completing payment for Pro plan. Amount deducted but subscription not active.',
            comments: 5,
            device: 'iPhone 14 Pro'
        },
        {
            id: 'C-1002',
            title: 'App crashes on device enrollment',
            user: 'Raj Kumar',
            category: 'Technical',
            priority: 'Critical',
            status: 'Open',
            time: '10 min ago',
            description: 'App crashes consistently when trying to enroll new devices. Happening on multiple devices.',
            comments: 8,
            device: 'Galaxy S23'
        },
        {
            id: 'C-1003',
            title: 'Double charged for subscription',
            user: 'Priya Sharma',
            category: 'Billing',
            priority: 'High',
            status: 'Open',
            time: '25 min ago',
            description: 'Charged twice for monthly subscription. Need immediate refund for duplicate charge.',
            comments: 3,
            device: 'iPhone 13'
        },
        {
            id: 'C-1004',
            title: 'Dashboard loading very slow',
            user: 'Amit Patel',
            category: 'Performance',
            priority: 'Medium',
            status: 'In Progress',
            time: '1 hour ago',
            description: 'Dashboard takes 15+ seconds to load. Affecting daily workflow significantly.',
            comments: 4,
            device: 'MacBook Pro'
        },
        {
            id: 'C-1005',
            title: 'Security vulnerability detected',
            user: 'Sneha Reddy',
            category: 'Security',
            priority: 'Critical',
            status: 'Escalated',
            time: '2 hours ago',
            description: 'Potential data leak during synchronization. Need immediate security audit.',
            comments: 12,
            device: 'Windows PC'
        },
        {
            id: 'C-1006',
            title: 'Push notifications not working',
            user: 'Arjun Nair',
            category: 'Technical',
            priority: 'High',
            status: 'In Progress',
            time: '3 hours ago',
            description: 'Users are not receiving push notifications. Critical for real-time updates.',
            comments: 6,
            device: 'Pixel 7 Pro'
        },
        {
            id: 'C-1007',
            title: 'Payment gateway timeout',
            user: 'Meera Joshi',
            category: 'Billing',
            priority: 'Critical',
            status: 'Escalated',
            time: '4 hours ago',
            description: 'Payment gateway times out during peak hours. Many users facing this issue.',
            comments: 15,
            device: 'iPad Air'
        },
        {
            id: 'C-1008',
            title: 'UI navigation confusing for new users',
            user: 'Vikram Singh',
            category: 'Usability',
            priority: 'Low',
            status: 'Resolved',
            time: '5 hours ago',
            description: 'New users finding navigation confusing. Need better onboarding flow.',
            comments: 3,
            device: 'iPhone 15'
        },
        {
            id: 'C-1009',
            title: 'Data export missing fields',
            user: 'Divya Menon',
            category: 'Performance',
            priority: 'Medium',
            status: 'Open',
            time: '6 hours ago',
            description: 'Exported reports missing some critical fields. Need to fix export functionality.',
            comments: 4,
            device: 'Dell XPS'
        },
        {
            id: 'C-1010',
            title: 'Unable to reset password',
            user: 'Kiran Bose',
            category: 'Account',
            priority: 'High',
            status: 'Open',
            time: '7 hours ago',
            description: 'Password reset link not working. Users getting stuck on login screen.',
            comments: 7,
            device: 'Samsung Galaxy'
        },
        {
            id: 'C-1011',
            title: 'Network connectivity issues',
            user: 'Anita Desai',
            category: 'Network',
            priority: 'High',
            status: 'In Progress',
            time: '8 hours ago',
            description: 'Frequent network disconnections in specific regions. Affecting user experience.',
            comments: 9,
            device: 'iPhone 12'
        },
        {
            id: 'C-1012',
            title: 'Incorrect billing calculation',
            user: 'Suresh Iyer',
            category: 'Billing',
            priority: 'Medium',
            status: 'Resolved',
            time: '9 hours ago',
            description: 'Billing calculation incorrect for annual subscription. Overcharged by 10%.',
            comments: 2,
            device: 'MacBook Air'
        }
    ],

    getSatisfactionData: () => ({
        ratings: { '5': 45, '4': 32, '3': 12, '2': 7, '1': 4 },
        totalResponses: 234,
        averageRating: 4.1
    }),

    getResponseTimes: () => ({
        under1Hour: 45,
        under6Hours: 38,
        under24Hours: 12,
        over24Hours: 5
    }),

    getTopComplaints: () => ({
        'Billing Issues': 34,
        'Payment Processing': 28,
        'App Performance': 22,
        'Device Enrollment': 18,
        'Push Notifications': 15,
        'Security Concerns': 12,
        'UI/UX Issues': 10,
        'Account Management': 8
    })
};

// ── Main Component ────────────────────────────────────────────────────────────
const AdminReports = () => {
    const [data, setData] = useState({
        appOverview: null,
        recentComplaints: [],
        satisfactionData: null,
        responseTimes: null,
        topComplaints: null
    });
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Check permissions for the 'reports' component
    const hasViewPermission = canView('reports');
    const hasEditPermission = canEdit('reports');
    const hasDeletePermission = canDelete('reports');


    const loadData = useCallback(() => {
        setLoading(true);
        setTimeout(() => {
            setData({
                appOverview: ComplaintService.getAppOverview(),
                recentComplaints: ComplaintService.getRecentComplaints(),
                satisfactionData: ComplaintService.getSatisfactionData(),
                responseTimes: ComplaintService.getResponseTimes(),
                topComplaints: ComplaintService.getTopComplaints()
            });
            setLoading(false);
        }, 300);
    }, []);

    useEffect(() => { loadData(); }, [loadData]);
    useEffect(() => { setCurrentPage(1); }, [selectedCategory, selectedStatus, searchTerm]);

    const handleViewComplaint = (complaint) => {
        setSelectedComplaint(complaint);
        setIsModalOpen(true);
    };

    const handleStatusChange = (updatedComplaint) => {
        setData(prev => ({
            ...prev,
            recentComplaints: prev.recentComplaints.map(c =>
                c.id === updatedComplaint.id ? updatedComplaint : c
            )
        }));
    };

    const handleDeleteComplaint = (id) => {
        setData(prev => ({
            ...prev,
            recentComplaints: prev.recentComplaints.filter(c => c.id !== id)
        }));
    };

    const filteredComplaints = useMemo(() => {
        return data.recentComplaints.filter(complaint => {
            const matchesCategory = selectedCategory === 'all' || complaint.category.toLowerCase() === selectedCategory;
            const matchesStatus = selectedStatus === 'all' || complaint.status.toLowerCase() === selectedStatus;
            const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                complaint.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesStatus && matchesSearch;
        });
    }, [data.recentComplaints, selectedCategory, selectedStatus, searchTerm]);

    const paginatedComplaints = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredComplaints.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredComplaints, currentPage]);

    const totalPages = Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE);
    const { appOverview, topComplaints } = data;

    const categories = useMemo(() => {
        const cats = new Set(data.recentComplaints.map(c => c.category.toLowerCase()));
        return ['all', ...Array.from(cats)];
    }, [data.recentComplaints]);

    const statuses = useMemo(() => {
        const stats = new Set(data.recentComplaints.map(c => c.status.toLowerCase()));
        return ['all', ...Array.from(stats)];
    }, [data.recentComplaints]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-2xl">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-400 border-t-transparent mx-auto" />
                    <p className="mt-4 text-sm text-gray-500">Loading complaints...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 bg-gray-50 min-h-screen p-4 rounded-2xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-orange-200 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Complaints Management</h1>
                    <p className="text-sm mt-0.5 text-gray-500">Monitor and resolve user complaints</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={loadData}
                        className="flex items-center gap-2 px-3.5 py-2 text-sm rounded-xl transition-colors bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-100"
                    >
                        <RefreshCw size={14} /> Refresh
                    </button>
                    <button className="flex items-center gap-2 px-3.5 py-2 text-sm text-white rounded-xl transition-all bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-orange-500/30 shadow-sm">
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* Stats */}
            {appOverview && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatCard
                        label="Total Complaints"
                        value={appOverview.totalComplaints}
                        icon={MessageSquare}
                        color="from-amber-400 to-orange-500"
                        change="+12%"
                        changeLabel="vs last month"
                    />
                    <StatCard
                        label="Pending"
                        value={appOverview.pendingComplaints}
                        icon={Clock}
                        color="from-orange-400 to-amber-500"
                        change="+5%"
                        changeLabel="vs last month"
                    />
                    <StatCard
                        label="Resolved"
                        value={appOverview.resolvedComplaints}
                        icon={CheckCircle}
                        color="from-amber-400 to-yellow-500"
                        change="+18%"
                        changeLabel="vs last month"
                    />
                    <StatCard
                        label="Satisfaction"
                        value={`${appOverview.satisfactionRate}%`}
                        icon={ThumbsUp}
                        color="from-orange-400 to-amber-500"
                        change="+3%"
                        changeLabel="vs last month"
                    />
                </div>
            )}

            {/* Top Complaints */}
            <Panel>
                <h3 className="text-sm font-semibold mb-4 text-gray-800">Top Complaint Categories</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {topComplaints && Object.entries(topComplaints).map(([feature, count]) => (
                        <div key={feature} className="flex items-center justify-between p-3 rounded-xl bg-orange-50 border border-orange-200">
                            <span className="text-gray-700">{feature}</span>
                            <span className="text-sm font-semibold text-orange-500">{count}</span>
                        </div>
                    ))}
                </div>
            </Panel>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search complaints by title, user, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl transition-all bg-white border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3.5 py-2.5 text-sm rounded-xl transition-all bg-white border border-orange-200 text-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                        ))}
                    </select>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-3.5 py-2.5 text-sm rounded-xl transition-all bg-white border border-orange-200 text-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    >
                        {statuses.map(status => (
                            <option key={status} value={status}>{status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Recent Complaints */}
            <Panel>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <h3 className="text-sm font-semibold text-gray-800">Recent Complaints ({filteredComplaints.length})</h3>
                    <span className="text-xs text-gray-500">Showing most recent first</span>
                </div>
                {paginatedComplaints.length === 0 ? (
                    <div className="text-center py-8">
                        <MessageSquare size={40} className="mx-auto mb-3 opacity-20 text-gray-400" />
                        <p className="text-gray-500">No complaints found matching your filters</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">
                            {paginatedComplaints.map((complaint) => (
                                <ComplaintCard
                                    key={complaint.id}
                                    complaint={complaint}
                                    onViewDetails={handleViewComplaint}
                                    onStatusChange={handleStatusChange}
                                    onDelete={handleDeleteComplaint}
                                    hasEditPermission={hasEditPermission}
                                    hasViewPermission={hasViewPermission}
                                    hasDeletePermission={hasDeletePermission}
                                />
                            ))}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalItems={filteredComplaints.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                        />
                    </>
                )}
            </Panel>

            {/* Footer */}
            <div className="rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-3 bg-white border border-orange-200 shadow-sm">
                <span className="text-xs text-gray-500">Last updated: {new Date().toLocaleString()}</span>
                <span className="text-xs text-gray-500">Total complaints: {data.recentComplaints.length}</span>
            </div>

            {/* Complaint Modal - View Only */}
            <ComplaintModal
                complaint={selectedComplaint}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedComplaint(null);
                }}
            />
        </div>
    );
};

export default AdminReports;
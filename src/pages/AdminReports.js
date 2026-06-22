// components/AppReports.js - Dark Theme (Optimized with Pagination)
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    BarChart3, LineChart, PieChart, Download, Filter,
    Calendar, Users, Smartphone, DollarSign, TrendingUp,
    TrendingDown, Activity, AlertCircle, CheckCircle,
    Clock, Zap, Shield, Server, Globe, RefreshCw,
    ChevronDown, ChevronUp, FileText, Printer, Mail,
    UserCheck, UserX, Package, CreditCard, Percent,
    ArrowUpRight, ArrowDownRight, Minus, X,
    MessageSquare, ThumbsUp, ThumbsDown, Star,
    Flag, Clock as ClockIcon, Search, Eye,
    ChevronLeft, ChevronRight, MoreHorizontal
} from 'lucide-react';

// ── Constants ──────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 5;
const STATUS_COLORS = {
    'open': { bg: 'rgba(245,158,11,0.08)', text: '#f59e0b' },
    'in progress': { bg: 'rgba(59,130,246,0.08)', text: '#3b82f6' },
    'resolved': { bg: 'rgba(52,211,153,0.08)', text: '#34d399' },
    'escalated': { bg: 'rgba(239,68,68,0.08)', text: '#ef4444' }
};

const PRIORITY_COLORS = {
    'critical': '#ef4444',
    'high': '#f59e0b',
    'medium': '#3b82f6',
    'low': '#34d399'
};

const CATEGORY_COLORS = {
    technical: { bg: 'rgba(245,158,11,0.08)', text: '#f59e0b' },
    billing: { bg: 'rgba(52,211,153,0.08)', text: '#34d399' },
    usability: { bg: 'rgba(59,130,246,0.08)', text: '#3b82f6' },
    security: { bg: 'rgba(239,68,68,0.08)', text: '#ef4444' },
    performance: { bg: 'rgba(167,139,250,0.08)', text: '#a78bfa' }
};

// ── UI Components ─────────────────────────────────────────────────────────────
const Panel = ({ children, className = "" }) => (
    <div
        className={`rounded-2xl p-5 ${className}`}
        style={{
            background: 'rgba(20, 16, 36, 0.8)',
            border: '1px solid rgba(139,92,246,0.15)',
            backdropFilter: 'blur(12px)',
        }}
    >
        {children}
    </div>
);

const StatCard = ({ label, value, icon: Icon, trend, color, subtitle }) => {
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
    const trendColor = trend === 'up' ? '#34d399' : trend === 'down' ? '#f87171' : '#5a4f72';

    return (
        <div className="rounded-2xl p-5 transition-all duration-200 hover:border-opacity-40"
            style={{
                background: 'rgba(20, 16, 36, 0.8)',
                border: '1px solid rgba(139,92,246,0.15)',
                backdropFilter: 'blur(12px)',
            }}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#5a4f72' }}>{label}</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: '#e2d9f3' }}>{value}</p>
                    {subtitle && <p className="text-xs mt-0.5" style={{ color: '#5a4f72' }}>{subtitle}</p>}
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm shrink-0`}
                    style={{ boxShadow: '0 0 10px rgba(124,58,237,0.3)' }}>
                    <Icon size={18} className="text-white" />
                </div>
            </div>
            
        </div>
    );
};

const ReportCard = ({ report, onViewDetails }) => {
    const statusStyle = STATUS_COLORS[report.status.toLowerCase()] || STATUS_COLORS['open'];
    const priorityColor = PRIORITY_COLORS[report.priority.toLowerCase()] || '#5a4f72';

    return (
        <div 
            className="rounded-xl p-4 border transition-all duration-200 hover:border-opacity-40"
            style={{
                background: 'rgba(20, 16, 36, 0.6)',
                border: '1px solid rgba(139,92,246,0.15)',
            }}
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono" style={{ color: '#5a4f72' }}>{report.id}</span>
                    <span 
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: statusStyle.bg, color: statusStyle.text }}
                    >
                        {report.status}
                    </span>
                    <span 
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ 
                            background: `rgba(${priorityColor === '#ef4444' ? '239,68,68' : priorityColor === '#f59e0b' ? '245,158,11' : priorityColor === '#3b82f6' ? '59,130,246' : '52,211,153'}, 0.08)`,
                            color: priorityColor
                        }}
                    >
                        {report.priority}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ 
                            background: CATEGORY_COLORS[report.category.toLowerCase()]?.bg || 'rgba(139,92,246,0.06)',
                            color: CATEGORY_COLORS[report.category.toLowerCase()]?.text || '#5a4f72'
                        }}
                    >
                        {report.category}
                    </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} 
                            style={{ color: i < report.rating ? '#f59e0b' : 'rgba(139,92,246,0.08)' }}
                            fill={i < report.rating ? '#f59e0b' : 'none'}
                        />
                    ))}
                </div>
            </div>
            
            <h4 className="text-sm font-semibold mb-1" style={{ color: '#e2d9f3' }}>{report.title}</h4>
            <p className="text-xs mb-2 line-clamp-2" style={{ color: '#9c8fc0' }}>{report.description}</p>
            
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                    <span style={{ color: '#5a4f72' }}>
                        <UserCheck size={12} className="inline mr-1" style={{ color: '#5a4f72' }} />
                        {report.user}
                    </span>
                    <span style={{ color: '#5a4f72' }}>
                        <MessageSquare size={12} className="inline mr-1" style={{ color: '#5a4f72' }} />
                        {report.comments}
                    </span>
                    <span style={{ color: '#5a4f72' }}>
                        <ClockIcon size={12} className="inline mr-1" style={{ color: '#5a4f72' }} />
                        {report.time}
                    </span>
                </div>
                <button
                    onClick={() => onViewDetails(report)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg transition-colors text-xs font-medium"
                    style={{ color: '#a78bfa', background: 'rgba(139,92,246,0.08)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.15)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; }}
                >
                    <Eye size={12} /> View
                </button>
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
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t"
            style={{ borderColor: 'rgba(139,92,246,0.08)' }}
        >
            <div className="text-xs" style={{ color: '#5a4f72' }}>
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} reports
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ 
                        color: '#9c8fc0',
                        background: 'rgba(139,92,246,0.06)',
                        border: '1px solid rgba(139,92,246,0.08)'
                    }}
                    onMouseEnter={e => {
                        if (!e.currentTarget.disabled) {
                            e.currentTarget.style.background = 'rgba(139,92,246,0.12)';
                            e.currentTarget.style.color = '#c4b5fd';
                        }
                    }}
                    onMouseLeave={e => {
                        if (!e.currentTarget.disabled) {
                            e.currentTarget.style.background = 'rgba(139,92,246,0.06)';
                            e.currentTarget.style.color = '#9c8fc0';
                        }
                    }}
                >
                    <ChevronLeft size={16} />
                </button>
                
                {getPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => typeof page === 'number' && onPageChange(page)}
                        disabled={page === '...' || page === currentPage}
                        className={`min-w-[32px] h-8 px-2 rounded-lg text-xs transition-all ${
                            page === currentPage ? 'font-semibold' : ''
                        }`}
                        style={{
                            background: page === currentPage ? 'rgba(139,92,246,0.15)' : 'transparent',
                            color: page === currentPage ? '#c4b5fd' : page === '...' ? '#5a4f72' : '#9c8fc0',
                            border: page === currentPage ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent',
                            cursor: page === '...' ? 'default' : 'pointer'
                        }}
                        onMouseEnter={e => {
                            if (page !== '...' && page !== currentPage) {
                                e.currentTarget.style.background = 'rgba(139,92,246,0.08)';
                                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)';
                            }
                        }}
                        onMouseLeave={e => {
                            if (page !== '...' && page !== currentPage) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderColor = 'transparent';
                            }
                        }}
                    >
                        {page}
                    </button>
                ))}
                
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ 
                        color: '#9c8fc0',
                        background: 'rgba(139,92,246,0.06)',
                        border: '1px solid rgba(139,92,246,0.08)'
                    }}
                    onMouseEnter={e => {
                        if (!e.currentTarget.disabled) {
                            e.currentTarget.style.background = 'rgba(139,92,246,0.12)';
                            e.currentTarget.style.color = '#c4b5fd';
                        }
                    }}
                    onMouseLeave={e => {
                        if (!e.currentTarget.disabled) {
                            e.currentTarget.style.background = 'rgba(139,92,246,0.06)';
                            e.currentTarget.style.color = '#9c8fc0';
                        }
                    }}
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

// ── Mock Data Service ──────────────────────────────────────────────────────────
const ReportService = {
    getAppOverview: () => ({
        totalUsers: 1247,
        activeUsers: 1023,
        totalReports: 345,
        pendingReports: 89,
        resolvedReports: 212,
        escalatedReports: 44,
        avgResolutionTime: '4.2h',
        satisfactionRate: 87,
        responseRate: 92,
        criticalIssues: 12,
        highPriority: 28,
        mediumPriority: 156,
        lowPriority: 149
    }),

    getReportCategories: () => ({
        technical: { count: 142, percentage: 41 },
        billing: { count: 78, percentage: 23 },
        usability: { count: 56, percentage: 16 },
        security: { count: 34, percentage: 10 },
        performance: { count: 35, percentage: 10 }
    }),

    getReportTrends: () => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map(day => ({
            day,
            reports: Math.floor(Math.random() * 30) + 10,
            resolved: Math.floor(Math.random() * 20) + 5,
            escalated: Math.floor(Math.random() * 8) + 1
        }));
    },

    getComplaintTypes: () => ({
        appCrash: 45,
        loginIssues: 38,
        paymentFailed: 52,
        slowPerformance: 41,
        uiIssues: 29,
        dataSync: 34,
        notificationIssues: 28,
        other: 78
    }),

    // Generate more reports for pagination demo
    getRecentReports: () => {
        const baseReports = [
            {
                id: 'R-1001',
                title: 'App crashes on device enrollment',
                user: 'Raj Kumar',
                category: 'Technical',
                priority: 'High',
                status: 'In Progress',
                time: '2 min ago',
                rating: 3,
                description: 'The app crashes consistently when trying to enroll new devices. Occurs on both iOS and Android.',
                comments: 5
            },
            {
                id: 'R-1002',
                title: 'Billing discrepancy in subscription',
                user: 'Priya Sharma',
                category: 'Billing',
                priority: 'Medium',
                status: 'Open',
                time: '15 min ago',
                rating: 2,
                description: 'Double charged for Pro subscription. Need immediate refund and correction.',
                comments: 3
            },
            {
                id: 'R-1003',
                title: 'Slow loading of dashboard',
                user: 'Amit Patel',
                category: 'Performance',
                priority: 'Low',
                status: 'Resolved',
                time: '1 hour ago',
                rating: 4,
                description: 'Dashboard takes 10+ seconds to load on mobile devices. Affects productivity.',
                comments: 2
            },
            {
                id: 'R-1004',
                title: 'Security vulnerability in data sync',
                user: 'Sneha Reddy',
                category: 'Security',
                priority: 'Critical',
                status: 'Escalated',
                time: '2 hours ago',
                rating: 1,
                description: 'Potential data leak during synchronization. User data might be exposed.',
                comments: 8
            },
            {
                id: 'R-1005',
                title: 'UI navigation confusing',
                user: 'Vikram Singh',
                category: 'Usability',
                priority: 'Low',
                status: 'Resolved',
                time: '3 hours ago',
                rating: 5,
                description: 'New users find navigation confusing. Suggestions for improvement attached.',
                comments: 4
            },
            {
                id: 'R-1006',
                title: 'Push notifications not working',
                user: 'Meera Joshi',
                category: 'Technical',
                priority: 'High',
                status: 'In Progress',
                time: '4 hours ago',
                rating: 3,
                description: 'Users not receiving push notifications for important updates. Affects engagement.',
                comments: 6
            },
            {
                id: 'R-1007',
                title: 'Payment gateway timeout',
                user: 'Arjun Nair',
                category: 'Billing',
                priority: 'Critical',
                status: 'Escalated',
                time: '5 hours ago',
                rating: 1,
                description: 'Payment gateway times out during peak hours. Users unable to complete transactions.',
                comments: 12
            },
            {
                id: 'R-1008',
                title: 'Data export format issues',
                user: 'Divya Menon',
                category: 'Performance',
                priority: 'Medium',
                status: 'Open',
                time: '6 hours ago',
                rating: 4,
                description: 'Exported reports missing some fields. Format inconsistent with expected output.',
                comments: 3
            },
            {
                id: 'R-1009',
                title: 'Login screen flickering',
                user: 'Karan Singh',
                category: 'Usability',
                priority: 'Low',
                status: 'Resolved',
                time: '7 hours ago',
                rating: 5,
                description: 'Login screen flickers on some Android devices. Fixed in latest update.',
                comments: 2
            },
            {
                id: 'R-1010',
                title: '2FA not working properly',
                user: 'Priya Sharma',
                category: 'Security',
                priority: 'High',
                status: 'In Progress',
                time: '8 hours ago',
                rating: 2,
                description: 'Two-factor authentication sometimes fails to send OTP to registered email.',
                comments: 7
            },
            {
                id: 'R-1011',
                title: 'App size too large',
                user: 'Suresh Reddy',
                category: 'Performance',
                priority: 'Low',
                status: 'Open',
                time: '9 hours ago',
                rating: 4,
                description: 'App size has increased significantly in recent updates. Users with limited storage affected.',
                comments: 2
            },
            {
                id: 'R-1012',
                title: 'Billing cycle confusion',
                user: 'Anita Desai',
                category: 'Billing',
                priority: 'Medium',
                status: 'Resolved',
                time: '10 hours ago',
                rating: 3,
                description: 'Users confused about billing cycle dates. Need clearer communication.',
                comments: 4
            }
        ];
        return baseReports;
    },

    getSatisfactionData: () => ({
        ratings: {
            '5': 45,
            '4': 32,
            '3': 12,
            '2': 7,
            '1': 4
        },
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
        'Device Enrollment': 28,
        'Payment Processing': 22,
        'Dashboard Performance': 18,
        'Push Notifications': 15,
        'User Authentication': 12,
        'Data Export': 5
    })
};

// ── Main Component ────────────────────────────────────────────────────────────
const AdminReports = () => {
    // State
    const [data, setData] = useState({
        appOverview: null,
        reportCategories: null,
        reportTrends: [],
        complaintTypes: null,
        recentReports: [],
        satisfactionData: null,
        responseTimes: null,
        topComplaints: null
    });
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('7d');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list');
    const [currentPage, setCurrentPage] = useState(1);

    // Load data
    const loadData = useCallback(() => {
        setLoading(true);
        setTimeout(() => {
            setData({
                appOverview: ReportService.getAppOverview(),
                reportCategories: ReportService.getReportCategories(),
                reportTrends: ReportService.getReportTrends(),
                complaintTypes: ReportService.getComplaintTypes(),
                recentReports: ReportService.getRecentReports(),
                satisfactionData: ReportService.getSatisfactionData(),
                responseTimes: ReportService.getResponseTimes(),
                topComplaints: ReportService.getTopComplaints()
            });
            setLoading(false);
        }, 500);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchTerm]);

    // Filter and paginate reports
    const filteredReports = useMemo(() => {
        return data.recentReports.filter(report => {
            const matchesCategory = selectedCategory === 'all' || 
                report.category.toLowerCase() === selectedCategory;
            const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.id.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [data.recentReports, selectedCategory, searchTerm]);

    const paginatedReports = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredReports.slice(startIndex, endIndex);
    }, [filteredReports, currentPage]);

    const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);

    // Helper functions
    const getStatusCount = useCallback((status) => {
        return data.recentReports.filter(r => r.status.toLowerCase() === status.toLowerCase()).length;
    }, [data.recentReports]);

    const formatPercentage = (value) => `${value.toFixed(1)}%`;

    const getCategoryIcon = (category) => {
        const icons = {
            technical: <AlertCircle size={14} style={{ color: '#f59e0b' }} />,
            billing: <DollarSign size={14} style={{ color: '#34d399' }} />,
            usability: <ThumbsUp size={14} style={{ color: '#3b82f6' }} />,
            security: <Shield size={14} style={{ color: '#ef4444' }} />,
            performance: <Zap size={14} style={{ color: '#a78bfa' }} />
        };
        return icons[category.toLowerCase()] || <MessageSquare size={14} style={{ color: '#5a4f72' }} />;
    };

    const handleViewDetails = useCallback((report) => {
        console.log('View details:', report);
        // Implement detail view logic here
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-400 border-t-transparent mx-auto" />
                    <p className="mt-4 text-sm" style={{ color: '#5a4f72' }}>Loading reports & analytics...</p>
                </div>
            </div>
        );
    }

    const { appOverview, reportCategories, satisfactionData, responseTimes, topComplaints } = data;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold" style={{ color: '#e2d9f3' }}>App Reports & Complaints</h1>
                    <p className="text-sm mt-0.5" style={{ color: '#5a4f72' }}>Monitor user feedback, issues, and satisfaction metrics</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-3.5 py-2 text-sm rounded-xl transition-all"
                        style={{
                            background: 'rgba(139,92,246,0.08)',
                            border: '1px solid rgba(139,92,246,0.15)',
                            color: '#e2d9f3'
                        }}
                    >
                        <option value="7d" style={{ background: '#1a1430', color: '#e2d9f3' }}>Last 7 Days</option>
                        <option value="30d" style={{ background: '#1a1430', color: '#e2d9f3' }}>Last 30 Days</option>
                        <option value="90d" style={{ background: '#1a1430', color: '#e2d9f3' }}>Last 90 Days</option>
                        <option value="all" style={{ background: '#1a1430', color: '#e2d9f3' }}>All Time</option>
                    </select>
                    <button
                        onClick={loadData}
                        className="flex items-center gap-2 px-3.5 py-2 text-sm rounded-xl transition-colors"
                        style={{ color: '#9c8fc0', border: '1px solid rgba(139,92,246,0.15)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; e.currentTarget.style.color = '#c4b5fd'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9c8fc0'; }}
                    >
                        <RefreshCw size={14} /> Refresh
                    </button>
                    <button className="flex items-center gap-2 px-3.5 py-2 text-sm text-white rounded-xl transition-all shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(124,58,237,0.4)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 10px rgba(124,58,237,0.2)'; }}>
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* Overview Stats */}
            {appOverview && (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <StatCard
                            label="Total Reports"
                            value={appOverview.totalReports}
                            icon={MessageSquare}
                            trend="up"
                            color="from-violet-400 to-purple-500"
                            subtitle={`${appOverview.pendingReports} pending`}
                        />
                        <StatCard
                            label="Resolution Rate"
                            value={formatPercentage((appOverview.resolvedReports / appOverview.totalReports) * 100)}
                            icon={CheckCircle}
                            trend="up"
                            color="from-emerald-400 to-teal-500"
                            subtitle={`${appOverview.resolvedReports} resolved`}
                        />
                        <StatCard
                            label="Avg Resolution Time"
                            value={appOverview.avgResolutionTime}
                            icon={Clock}
                            trendValue="-0.8h"
                            color="from-sky-400 to-blue-500"
                        />
                        <StatCard
                            label="Satisfaction Rate"
                            value={formatPercentage(appOverview.satisfactionRate)}
                            icon={ThumbsUp}
                            trendValue="+2.4%"
                            color="from-amber-400 to-orange-500"
                            subtitle={`${appOverview.responseRate}% response rate`}
                        />
                    </div>

                    {/* Status Breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="rounded-2xl p-4" style={{
                            background: 'rgba(20, 16, 36, 0.8)',
                            border: '1px solid rgba(139,92,246,0.15)',
                        }}>
                            <p className="text-xs font-medium" style={{ color: '#5a4f72' }}>Pending</p>
                            <p className="text-xl font-bold mt-1" style={{ color: '#f59e0b' }}>
                                {getStatusCount('open') + getStatusCount('in progress')}
                            </p>
                            <p className="text-xs" style={{ color: '#5a4f72' }}>{appOverview.pendingReports} total pending</p>
                        </div>
                        <div className="rounded-2xl p-4" style={{
                            background: 'rgba(20, 16, 36, 0.8)',
                            border: '1px solid rgba(139,92,246,0.15)',
                        }}>
                            <p className="text-xs font-medium" style={{ color: '#5a4f72' }}>Resolved</p>
                            <p className="text-xl font-bold mt-1" style={{ color: '#34d399' }}>{appOverview.resolvedReports}</p>
                            <p className="text-xs" style={{ color: '#5a4f72' }}>{((appOverview.resolvedReports / appOverview.totalReports) * 100).toFixed(0)}% of total</p>
                        </div>
                        <div className="rounded-2xl p-4" style={{
                            background: 'rgba(20, 16, 36, 0.8)',
                            border: '1px solid rgba(139,92,246,0.15)',
                        }}>
                            <p className="text-xs font-medium" style={{ color: '#5a4f72' }}>Escalated</p>
                            <p className="text-xl font-bold mt-1" style={{ color: '#ef4444' }}>{appOverview.escalatedReports}</p>
                            <p className="text-xs" style={{ color: '#5a4f72' }}>Critical issues</p>
                        </div>
                        <div className="rounded-2xl p-4" style={{
                            background: 'rgba(20, 16, 36, 0.8)',
                            border: '1px solid rgba(139,92,246,0.15)',
                        }}>
                            <p className="text-xs font-medium" style={{ color: '#5a4f72' }}>Response Rate</p>
                            <p className="text-xl font-bold mt-1" style={{ color: '#a78bfa' }}>{appOverview.responseRate}%</p>
                            <p className="text-xs" style={{ color: '#5a4f72' }}>Timely responses</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#5a4f72' }} />
                            <input
                                type="text"
                                placeholder="Search reports by title, user, or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl transition-all"
                                style={{
                                    background: 'rgba(20, 16, 36, 0.8)',
                                    border: '1px solid rgba(139,92,246,0.15)',
                                    color: '#e2d9f3'
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
                                onBlur={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'}
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {['All', 'Technical', 'Billing', 'Usability', 'Security', 'Performance'].map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category.toLowerCase())}
                                    className={`px-3.5 py-2 text-sm rounded-xl transition-all whitespace-nowrap ${
                                        selectedCategory === category.toLowerCase() ? 'font-semibold' : ''
                                    }`}
                                    style={{
                                        background: selectedCategory === category.toLowerCase() ? 'rgba(139,92,246,0.15)' : 'rgba(20, 16, 36, 0.6)',
                                        border: selectedCategory === category.toLowerCase() ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(139,92,246,0.08)',
                                        color: selectedCategory === category.toLowerCase() ? '#c4b5fd' : '#5a4f72'
                                    }}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category Distribution */}
                    <Panel>
                        <h3 className="text-sm font-semibold mb-4" style={{ color: '#e2d9f3' }}>Report Categories</h3>
                        <div className="space-y-3">
                            {reportCategories && Object.entries(reportCategories).map(([category, data]) => {
                                const color = CATEGORY_COLORS[category] || { bg: 'rgba(139,92,246,0.06)', text: '#5a4f72' };
                                return (
                                    <div key={category}>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                {getCategoryIcon(category)}
                                                <span className="text-sm capitalize" style={{ color: '#9c8fc0' }}>{category}</span>
                                            </div>
                                            <span className="text-sm font-semibold" style={{ color: '#e2d9f3' }}>
                                                {data.count} ({data.percentage}%)
                                            </span>
                                        </div>
                                        <div className="w-full rounded-full h-2" style={{ background: 'rgba(139,92,246,0.08)' }}>
                                            <div 
                                                className="h-2 rounded-full transition-all"
                                                style={{ width: `${data.percentage}%`, background: color.text }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Panel>

                    {/* Recent Reports List with Pagination */}
                    <Panel>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold" style={{ color: '#e2d9f3' }}>
                                Recent Reports & Complaints ({filteredReports.length})
                            </h3>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className="p-1.5 rounded-lg transition-colors"
                                    style={{
                                        background: viewMode === 'list' ? 'rgba(139,92,246,0.08)' : 'transparent',
                                        color: viewMode === 'list' ? '#c4b5fd' : '#5a4f72'
                                    }}
                                >
                                    <MessageSquare size={16} />
                                </button>
                                <button 
                                    onClick={() => setViewMode('grid')}
                                    className="p-1.5 rounded-lg transition-colors"
                                    style={{
                                        background: viewMode === 'grid' ? 'rgba(139,92,246,0.08)' : 'transparent',
                                        color: viewMode === 'grid' ? '#c4b5fd' : '#5a4f72'
                                    }}
                                >
                                    <Activity size={16} />
                                </button>
                            </div>
                        </div>
                        
                        {paginatedReports.length === 0 ? (
                            <div className="text-center py-8">
                                <MessageSquare size={40} className="mx-auto mb-3 opacity-20" style={{ color: '#5a4f72' }} />
                                <p style={{ color: '#5a4f72' }}>No reports found matching your filters</p>
                            </div>
                        ) : (
                            <>
                                <div className={`space-y-3 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-3 space-y-0' : ''}`}>
                                    {paginatedReports.map((report) => (
                                        <ReportCard 
                                            key={report.id} 
                                            report={report} 
                                            onViewDetails={handleViewDetails}
                                        />
                                    ))}
                                </div>
                                
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                    totalItems={filteredReports.length}
                                    itemsPerPage={ITEMS_PER_PAGE}
                                />
                            </>
                        )}
                    </Panel>

                    {/* Satisfaction & Response Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Panel>
                            <h3 className="text-sm font-semibold mb-3" style={{ color: '#e2d9f3' }}>User Satisfaction</h3>
                            {satisfactionData && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm" style={{ color: '#9c8fc0' }}>Average Rating</span>
                                        <span className="text-xl font-bold" style={{ color: '#f59e0b' }}>{satisfactionData.averageRating} ★</span>
                                    </div>
                                    {Object.entries(satisfactionData.ratings).reverse().map(([rating, count]) => {
                                        const percentage = (count / satisfactionData.totalResponses) * 100;
                                        return (
                                            <div key={rating}>
                                                <div className="flex items-center justify-between text-xs mb-0.5">
                                                    <span style={{ color: '#5a4f72' }}>{rating} ★</span>
                                                    <span style={{ color: '#9c8fc0' }}>{count} ({percentage.toFixed(0)}%)</span>
                                                </div>
                                                <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(139,92,246,0.08)' }}>
                                                    <div 
                                                        className="h-1.5 rounded-full transition-all"
                                                        style={{ 
                                                            width: `${percentage}%`, 
                                                            background: rating >= 4 ? '#34d399' : rating >= 3 ? '#f59e0b' : '#ef4444'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <p className="text-xs mt-2" style={{ color: '#5a4f72' }}>Based on {satisfactionData.totalResponses} responses</p>
                                </div>
                            )}
                        </Panel>

                        <Panel>
                            <h3 className="text-sm font-semibold mb-3" style={{ color: '#e2d9f3' }}>Response Time Distribution</h3>
                            {responseTimes && (
                                <div className="space-y-3">
                                    {Object.entries(responseTimes).map(([time, percentage]) => (
                                        <div key={time}>
                                            <div className="flex items-center justify-between text-xs mb-0.5">
                                                <span className="capitalize" style={{ color: '#5a4f72' }}>
                                                    {time.replace(/([A-Z])/g, ' $1').trim()}
                                                </span>
                                                <span style={{ color: '#9c8fc0' }}>{percentage}%</span>
                                            </div>
                                            <div className="w-full rounded-full h-2" style={{ background: 'rgba(139,92,246,0.08)' }}>
                                                <div 
                                                    className="h-2 rounded-full transition-all"
                                                    style={{ 
                                                        width: `${percentage}%`, 
                                                        background: percentage > 70 ? '#34d399' : percentage > 40 ? '#f59e0b' : '#ef4444'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="mt-3 p-3 rounded-xl" style={{
                                background: 'rgba(139,92,246,0.06)',
                                border: '1px solid rgba(139,92,246,0.08)'
                            }}>
                                <p className="text-xs" style={{ color: '#5a4f72' }}>
                                    <ClockIcon size={12} className="inline mr-1" /> 
                                    Avg response time: {appOverview?.avgResolutionTime}
                                </p>
                            </div>
                        </Panel>
                    </div>

                    {/* Top Complaints */}
                    <Panel>
                        <h3 className="text-sm font-semibold mb-4" style={{ color: '#e2d9f3' }}>Top Complaints by Feature</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {topComplaints && Object.entries(topComplaints).map(([feature, count]) => (
                                <div key={feature} className="flex items-center justify-between p-3 rounded-xl"
                                    style={{
                                        background: 'rgba(139,92,246,0.06)',
                                        border: '1px solid rgba(139,92,246,0.08)'
                                    }}
                                >
                                    <span className="text-sm" style={{ color: '#c4b5fd' }}>{feature}</span>
                                    <span className="text-sm font-semibold" style={{ color: '#e2d9f3' }}>{count}</span>
                                </div>
                            ))}
                        </div>
                    </Panel>
                </>
            )}

            {/* Footer Actions */}
            <div className="rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-3"
                style={{
                    background: 'rgba(20, 16, 36, 0.8)',
                    border: '1px solid rgba(139,92,246,0.15)',
                }}
            >
                <div className="flex items-center gap-4 text-xs" style={{ color: '#5a4f72' }}>
                    <span>Last updated: {new Date().toLocaleString()}</span>
                    <span className="w-px h-4" style={{ background: 'rgba(139,92,246,0.15)' }} />
                    <span>Data source: App Analytics & User Feedback</span>
                </div>
                <div className="flex items-center gap-2">
                    {[Printer, Mail, FileText].map((Icon, i) => (
                        <button key={i} className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors"
                            style={{ color: '#9c8fc0' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; e.currentTarget.style.color = '#c4b5fd'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9c8fc0'; }}
                        >
                            <Icon size={14} /> {['Print', 'Email', 'PDF'][i]}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
// components/AppReports.js - Simplified with Saffron Theme
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
    ChevronLeft, ChevronRight, MoreHorizontal
} from 'lucide-react';

// ── Constants ──────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 5;
const STATUS_COLORS = {
    'open': { bg: 'rgba(255,125,56,0.15)', text: '#FF7D38' },
    'in progress': { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
    'resolved': { bg: 'rgba(52,211,153,0.12)', text: '#34d399' },
    'escalated': { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' }
};

const PRIORITY_COLORS = {
    'critical': '#ef4444',
    'high': '#FF7D38',
    'medium': '#f59e0b',
    'low': '#34d399'
};

const CATEGORY_COLORS = {
    technical: { bg: 'rgba(255,125,56,0.12)', text: '#FF7D38' },
    billing: { bg: 'rgba(52,211,153,0.12)', text: '#34d399' },
    usability: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
    security: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
    performance: { bg: 'rgba(167,139,250,0.12)', text: '#a78bfa' }
};

// ── UI Components ─────────────────────────────────────────────────────────────
const Panel = ({ children, className = "" }) => (
    <div
        className={`rounded-2xl p-5 ${className}`}
        style={{
            background: 'linear-gradient(135deg, rgba(255,125,56,0.12), rgba(255,107,26,0.08))',
            border: '1px solid rgba(255,125,56,0.25)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(255,125,56,0.1)'
        }}
    >
        {children}
    </div>
);

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div
        className="rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02]"
        style={{
            background: 'linear-gradient(135deg, rgba(255,125,56,0.12), rgba(255,107,26,0.08))',
            border: '1px solid rgba(255,125,56,0.25)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(255,125,56,0.1)'
        }}
    >
        <div className="flex items-start justify-between">
            <div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#FF9A5F' }}>{label}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#FF7D38' }}>{value}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm shrink-0`}
                style={{ boxShadow: '0 0 15px rgba(255,125,56,0.3)' }}>
                <Icon size={18} className="text-white" />
            </div>
        </div>
    </div>
);

const ReportCard = ({ report, onViewDetails }) => {
    const statusStyle = STATUS_COLORS[report.status.toLowerCase()] || STATUS_COLORS['open'];
    const priorityColor = PRIORITY_COLORS[report.priority.toLowerCase()] || '#FF9A5F';

    return (
        <div
            className="rounded-xl p-4 border transition-all duration-200 hover:border-orange-500/50"
            style={{
                background: 'rgba(2,32,60,0.6)',
                border: '1px solid rgba(255,125,56,0.15)',
            }}
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono" style={{ color: '#FF9A5F' }}>{report.id}</span>
                    <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: statusStyle.bg, color: statusStyle.text }}
                    >
                        {report.status}
                    </span>
                    
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{
                            background: CATEGORY_COLORS[report.category.toLowerCase()]?.bg || 'rgba(255,125,56,0.06)',
                            color: CATEGORY_COLORS[report.category.toLowerCase()]?.text || '#FF9A5F'
                        }}
                    >
                        {report.category}
                    </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12}
                            style={{ color: i < report.rating ? '#FF7D38' : 'rgba(255,125,56,0.15)' }}
                            fill={i < report.rating ? '#FF7D38' : 'none'}
                        />
                    ))}
                </div>
            </div>

            <h4 className="text-sm font-semibold mb-1" style={{ color: '#FF7D38' }}>{report.title}</h4>
            <p className="text-xs mb-2 line-clamp-2" style={{ color: '#FF9A5F' }}>{report.description}</p>

            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                    <span style={{ color: '#FF9A5F' }}>
                        <UserCheck size={12} className="inline mr-1" style={{ color: '#FF9A5F' }} />
                        {report.user}
                    </span>
                    <span style={{ color: '#FF9A5F' }}>
                        <MessageSquare size={12} className="inline mr-1" style={{ color: '#FF9A5F' }} />
                        {report.comments}
                    </span>
                    <span style={{ color: '#FF9A5F' }}>
                        <ClockIcon size={12} className="inline mr-1" style={{ color: '#FF9A5F' }} />
                        {report.time}
                    </span>
                </div>
                <button
                    onClick={() => onViewDetails(report)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg transition-colors text-xs font-medium"
                    style={{ color: '#FF7D38', background: 'rgba(255,125,56,0.12)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,125,56,0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,125,56,0.12)'; }}
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
            style={{ borderColor: 'rgba(255,125,56,0.08)' }}
        >
            <div className="text-xs" style={{ color: '#FF9A5F' }}>
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} reports
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                        color: '#FF9A5F',
                        background: 'rgba(255,125,56,0.08)',
                        border: '1px solid rgba(255,125,56,0.15)'
                    }}
                    onMouseEnter={e => {
                        if (!e.currentTarget.disabled) {
                            e.currentTarget.style.background = 'rgba(255,125,56,0.15)';
                            e.currentTarget.style.color = '#FF7D38';
                        }
                    }}
                    onMouseLeave={e => {
                        if (!e.currentTarget.disabled) {
                            e.currentTarget.style.background = 'rgba(255,125,56,0.08)';
                            e.currentTarget.style.color = '#FF9A5F';
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
                        className={`min-w-[32px] h-8 px-2 rounded-lg text-xs transition-all ${page === currentPage ? 'font-semibold' : ''
                            }`}
                        style={{
                            background: page === currentPage ? 'rgba(255,125,56,0.15)' : 'transparent',
                            color: page === currentPage ? '#FF7D38' : page === '...' ? '#FF9A5F' : '#FF9A5F',
                            border: page === currentPage ? '1px solid rgba(255,125,56,0.3)' : '1px solid transparent',
                            cursor: page === '...' ? 'default' : 'pointer'
                        }}
                        onMouseEnter={e => {
                            if (page !== '...' && page !== currentPage) {
                                e.currentTarget.style.background = 'rgba(255,125,56,0.08)';
                                e.currentTarget.style.borderColor = 'rgba(255,125,56,0.15)';
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
                        color: '#FF9A5F',
                        background: 'rgba(255,125,56,0.08)',
                        border: '1px solid rgba(255,125,56,0.15)'
                    }}
                    onMouseEnter={e => {
                        if (!e.currentTarget.disabled) {
                            e.currentTarget.style.background = 'rgba(255,125,56,0.15)';
                            e.currentTarget.style.color = '#FF7D38';
                        }
                    }}
                    onMouseLeave={e => {
                        if (!e.currentTarget.disabled) {
                            e.currentTarget.style.background = 'rgba(255,125,56,0.08)';
                            e.currentTarget.style.color = '#FF9A5F';
                        }
                    }}
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

// ── Data Service ──────────────────────────────────────────────────────────
const ReportService = {
    getAppOverview: () => ({
        totalReports: 345,
        pendingReports: 89,
        resolvedReports: 212,
        escalatedReports: 44,
        satisfactionRate: 87,
        responseRate: 92,
        avgResolutionTime: '4.2h'
    }),

    getRecentReports: () => [
        { id: 'R-1001', title: 'App crashes on device enrollment', user: 'Raj Kumar', category: 'Technical', priority: 'High', status: 'In Progress', time: '2 min ago', rating: 3, description: 'App crashes when trying to enroll new devices', comments: 5 },
        { id: 'R-1002', title: 'Billing discrepancy in subscription', user: 'Priya Sharma', category: 'Billing', priority: 'Medium', status: 'Open', time: '15 min ago', rating: 2, description: 'Double charged for Pro subscription', comments: 3 },
        { id: 'R-1003', title: 'Slow loading of dashboard', user: 'Amit Patel', category: 'Performance', priority: 'Low', status: 'Resolved', time: '1 hour ago', rating: 4, description: 'Dashboard takes 10+ seconds to load', comments: 2 },
        { id: 'R-1004', title: 'Security vulnerability in data sync', user: 'Sneha Reddy', category: 'Security', priority: 'Critical', status: 'Escalated', time: '2 hours ago', rating: 1, description: 'Potential data leak during synchronization', comments: 8 },
        { id: 'R-1005', title: 'UI navigation confusing', user: 'Vikram Singh', category: 'Usability', priority: 'Low', status: 'Resolved', time: '3 hours ago', rating: 5, description: 'New users find navigation confusing', comments: 4 },
        { id: 'R-1006', title: 'Push notifications not working', user: 'Meera Joshi', category: 'Technical', priority: 'High', status: 'In Progress', time: '4 hours ago', rating: 3, description: 'Users not receiving push notifications', comments: 6 },
        { id: 'R-1007', title: 'Payment gateway timeout', user: 'Arjun Nair', category: 'Billing', priority: 'Critical', status: 'Escalated', time: '5 hours ago', rating: 1, description: 'Payment gateway times out during peak hours', comments: 12 },
        { id: 'R-1008', title: 'Data export format issues', user: 'Divya Menon', category: 'Performance', priority: 'Medium', status: 'Open', time: '6 hours ago', rating: 4, description: 'Exported reports missing some fields', comments: 3 }
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
    const [data, setData] = useState({
        appOverview: null,
        reportCategories: null,
        recentReports: [],
        satisfactionData: null,
        responseTimes: null,
        topComplaints: null
    });
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const loadData = useCallback(() => {
        setLoading(true);
        setTimeout(() => {
            setData({
                appOverview: ReportService.getAppOverview(),
                recentReports: ReportService.getRecentReports(),
                satisfactionData: ReportService.getSatisfactionData(),
                responseTimes: ReportService.getResponseTimes(),
                topComplaints: ReportService.getTopComplaints()
            });
            setLoading(false);
        }, 300);
    }, []);

    useEffect(() => { loadData(); }, [loadData]);
    useEffect(() => { setCurrentPage(1); }, [selectedCategory, searchTerm]);

    const filteredReports = useMemo(() => {
        return data.recentReports.filter(report => {
            const matchesCategory = selectedCategory === 'all' || report.category.toLowerCase() === selectedCategory;
            const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.id.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [data.recentReports, selectedCategory, searchTerm]);

    const paginatedReports = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredReports.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredReports, currentPage]);

    const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
    const { appOverview, reportCategories, satisfactionData, responseTimes, topComplaints } = data;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-400 border-t-transparent mx-auto" />
                    <p className="mt-4 text-sm" style={{ color: '#FF9A5F' }}>Loading reports...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold" style={{ color: '#FF7D38' }}>App Reports</h1>
                    <p className="text-sm mt-0.5" style={{ color: '#FF9A5F' }}>Monitor user feedback and complaints</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={loadData}
                        className="flex items-center gap-2 px-3.5 py-2 text-sm rounded-xl transition-colors"
                        style={{ color: '#FF9A5F', border: '1px solid rgba(255,125,56,0.2)' }}
                    >
                        <RefreshCw size={14} /> Refresh
                    </button>
                    <button className="flex items-center gap-2 px-3.5 py-2 text-sm text-white rounded-xl transition-all"
                        style={{ background: 'linear-gradient(135deg, #FF7D38, #FF6B1A)', boxShadow: '0 0 15px rgba(255,125,56,0.3)' }}>
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* Stats */}
            {appOverview && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatCard label="Total Reports" value={appOverview.totalReports} icon={MessageSquare} color="from-amber-400 to-orange-500" />
                    <StatCard label="Pending" value={appOverview.pendingReports} icon={Clock} color="from-orange-400 to-amber-500" />
                    <StatCard label="Resolved" value={appOverview.resolvedReports} icon={CheckCircle} color="from-amber-400 to-yellow-500" />
                    <StatCard label="Satisfaction" value={`${appOverview.satisfactionRate}%`} icon={ThumbsUp} color="from-orange-400 to-amber-500" />
                </div>
            )}

            {/* Top Complaints */}
            <Panel>
                <h3 className="text-sm font-semibold mb-4" style={{ color: '#FF7D38' }}>Top Complaints</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {topComplaints && Object.entries(topComplaints).map(([feature, count]) => (
                        <div key={feature} className="flex items-center justify-between p-3 rounded-xl"
                            style={{ background: 'rgba(255,125,56,0.06)', border: '1px solid rgba(255,125,56,0.08)' }}>
                            <span style={{ color: '#FF7D38' }}>{feature}</span>
                            <span className="text-sm font-semibold" style={{ color: '#FF7D38' }}>{count}</span>
                        </div>
                    ))}
                </div>
            </Panel>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#FF9A5F' }} />
                    <input
                        type="text"
                        placeholder="Search reports..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl transition-all"
                        style={{
                            background: 'rgba(2,32,60,0.8)',
                            border: '1px solid rgba(255,125,56,0.2)',
                            color: '#FF7D38'
                        }}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {['All', 'Technical', 'Billing', 'Usability', 'Security', 'Performance'].map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category.toLowerCase())}
                            className={`px-3.5 py-2 text-sm rounded-xl transition-all whitespace-nowrap ${selectedCategory === category.toLowerCase() ? 'font-semibold' : ''}`}
                            style={{
                                background: selectedCategory === category.toLowerCase() ? 'rgba(255,125,56,0.15)' : 'rgba(2,32,60,0.6)',
                                border: selectedCategory === category.toLowerCase() ? '1px solid rgba(255,125,56,0.3)' : '1px solid rgba(255,125,56,0.08)',
                                color: selectedCategory === category.toLowerCase() ? '#FF7D38' : '#FF9A5F'
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Reports */}
            <Panel>
                <h3 className="text-sm font-semibold mb-4" style={{ color: '#FF7D38' }}>Recent Reports ({filteredReports.length})</h3>
                {paginatedReports.length === 0 ? (
                    <div className="text-center py-8">
                        <MessageSquare size={40} className="mx-auto mb-3 opacity-20" style={{ color: '#FF9A5F' }} />
                        <p style={{ color: '#FF9A5F' }}>No reports found</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">
                            {paginatedReports.map((report) => (
                                <ReportCard key={report.id} report={report} onViewDetails={() => { }} />
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



            {/* Footer */}
            <div className="rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-3"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,125,56,0.12), rgba(255,107,26,0.08))',
                    border: '1px solid rgba(255,125,56,0.25)',
                }}
            >
                <span className="text-xs" style={{ color: '#FF9A5F' }}>Last updated: {new Date().toLocaleString()}</span>

            </div>
        </div>
    );
};

export default AdminReports;
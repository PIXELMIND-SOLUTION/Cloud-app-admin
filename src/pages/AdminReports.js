// components/AdminReports.js - Dark Theme
import React, { useState, useEffect } from 'react';
import {
    BarChart3, LineChart, PieChart, Download, Filter,
    Calendar, Users, Smartphone, DollarSign, TrendingUp,
    TrendingDown, Activity, AlertCircle, CheckCircle,
    Clock, Zap, Shield, Server, Globe, RefreshCw,
    ChevronDown, ChevronUp, FileText, Printer, Mail,
    UserCheck, UserX, Package, CreditCard, Percent,
    ArrowUpRight, ArrowDownRight, Minus, X
} from 'lucide-react';

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

// ── Mock Data Service ──────────────────────────────────────────────────────────
const ReportService = {
    getOverview: () => ({
        totalUsers: 1247,
        newUsersThisMonth: 89,
        activeUsers: 1023,
        inactiveUsers: 224,
        totalDevices: 2156,
        compliantDevices: 1842,
        nonCompliantDevices: 314,
        totalPlans: 5,
        activePlans: 3,
        monthlyRevenue: 28450,
        revenueGrowth: 12.5,
        mdmCoverage: 85.4
    }),

    getUserGrowth: () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        return months.map((month, i) => ({
            month,
            newUsers: Math.floor(Math.random() * 50) + 20,
            activeUsers: Math.floor(Math.random() * 200) + 800,
            totalUsers: Math.floor(Math.random() * 300) + 900
        }));
    },

    getDeviceDistribution: () => ({
        mobile: 842,
        tablet: 456,
        laptop: 678,
        desktop: 120,
        wearable: 60
    }),

    getPlanDistribution: () => {
        const plans = JSON.parse(localStorage.getItem('plans') || '[]');
        return plans.map(plan => ({
            name: plan.name,
            users: plan.subscriberCount || Math.floor(Math.random() * 200) + 10,
            revenue: (plan.subscriberCount || Math.floor(Math.random() * 200) + 10) * plan.price,
            active: plan.status === 'active'
        }));
    },

    getComplianceData: () => ({
        mdmEnrolled: 1842,
        encryptionEnabled: 1567,
        passcodeRequired: 1723,
        osUpdated: 1345,
        totalDevices: 2156
    }),

    getRecentActivities: () => {
        const activities = [
            { type: 'user_added', user: 'Raj Kumar', plan: 'Pro', time: '2 min ago' },
            { type: 'device_enrolled', user: 'Priya Sharma', device: 'iPhone 14', time: '15 min ago' },
            { type: 'compliance_alert', user: 'Amit Patel', issue: 'Encryption disabled', time: '1 hour ago' },
            { type: 'plan_upgraded', user: 'Sneha Reddy', from: 'Basic', to: 'Pro', time: '2 hours ago' },
            { type: 'user_added', user: 'Vikram Singh', plan: 'Enterprise', time: '3 hours ago' },
            { type: 'device_enrolled', user: 'Meera Joshi', device: 'MacBook Pro', time: '5 hours ago' },
            { type: 'compliance_alert', user: 'Arjun Nair', issue: 'OS out of date', time: '6 hours ago' },
            { type: 'user_removed', user: 'Divya Menon', plan: 'Basic', time: '8 hours ago' },
        ];
        return activities;
    },

    getRevenueData: () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        return months.map((month, i) => ({
            month,
            revenue: Math.floor(Math.random() * 5000) + 15000,
            subscriptions: Math.floor(Math.random() * 100) + 50,
            upgrades: Math.floor(Math.random() * 20) + 5
        }));
    }
};

// ── Stat Card Component ──────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, trend, trendValue, color, bgColor }) => {
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
    const trendColor = trend === 'up' ? '#34d399' : trend === 'down' ? '#f87171' : '#5a4f72';

    return (
        <div className="rounded-2xl p-5 transition-all"
            style={{
                background: 'rgba(20, 16, 36, 0.8)',
                border: '1px solid rgba(139,92,246,0.15)',
                backdropFilter: 'blur(12px)',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.35)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#5a4f72' }}>{label}</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: '#e2d9f3' }}>{value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm shrink-0`}
                    style={{ boxShadow: '0 0 10px rgba(124,58,237,0.3)' }}>
                    <Icon size={18} className="text-white" />
                </div>
            </div>
            {trend && (
                <div className="flex items-center gap-1.5 mt-3">
                    <TrendIcon size={14} style={{ color: trendColor }} />
                    <span className={`text-xs font-semibold`} style={{ color: trendColor }}>
                        {trendValue}
                    </span>
                    <span className="text-xs" style={{ color: '#5a4f72' }}>vs last month</span>
                </div>
            )}
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const AdminReports = () => {
    const [overview, setOverview] = useState(null);
    const [userGrowth, setUserGrowth] = useState([]);
    const [deviceDistribution, setDeviceDistribution] = useState(null);
    const [planDistribution, setPlanDistribution] = useState([]);
    const [complianceData, setComplianceData] = useState(null);
    const [recentActivities, setRecentActivities] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('6m');

    const loadData = () => {
        setLoading(true);
        setTimeout(() => {
            setOverview(ReportService.getOverview());
            setUserGrowth(ReportService.getUserGrowth());
            setDeviceDistribution(ReportService.getDeviceDistribution());
            setPlanDistribution(ReportService.getPlanDistribution());
            setComplianceData(ReportService.getComplianceData());
            setRecentActivities(ReportService.getRecentActivities());
            setRevenueData(ReportService.getRevenueData());
            setLoading(false);
        }, 500);
    };

    useEffect(() => {
        loadData();
    }, [timeRange]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'user_added': return <UserCheck size={14} style={{ color: '#34d399' }} />;
            case 'user_removed': return <UserX size={14} style={{ color: '#f87171' }} />;
            case 'device_enrolled': return <Smartphone size={14} style={{ color: '#60a5fa' }} />;
            case 'compliance_alert': return <AlertCircle size={14} style={{ color: '#f59e0b' }} />;
            case 'plan_upgraded': return <ArrowUpRight size={14} style={{ color: '#a78bfa' }} />;
            default: return <Activity size={14} style={{ color: '#5a4f72' }} />;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'user_added': return { bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.15)' };
            case 'user_removed': return { bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.15)' };
            case 'device_enrolled': return { bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.15)' };
            case 'compliance_alert': return { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)' };
            case 'plan_upgraded': return { bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.15)' };
            default: return { bg: 'rgba(139,92,246,0.06)', border: 'rgba(139,92,246,0.08)' };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-400 border-t-transparent mx-auto" />
                    <p className="mt-4 text-sm" style={{ color: '#5a4f72' }}>Loading reports...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold" style={{ color: '#e2d9f3' }}>Reports & Analytics</h1>
                    <p className="text-sm mt-0.5" style={{ color: '#5a4f72' }}>Comprehensive insights into your MDM ecosystem</p>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-3.5 py-2 text-sm rounded-xl transition-all"
                        style={{
                            background: 'rgba(139,92,246,0.08)',
                            border: '1px solid rgba(139,92,246,0.15)',
                            color: '#e2d9f3'
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'}
                    >
                        <option value="30d" style={{ background: '#1a1430', color: '#e2d9f3' }}>Last 30 Days</option>
                        <option value="3m" style={{ background: '#1a1430', color: '#e2d9f3' }}>Last 3 Months</option>
                        <option value="6m" style={{ background: '#1a1430', color: '#e2d9f3' }}>Last 6 Months</option>
                        <option value="1y" style={{ background: '#1a1430', color: '#e2d9f3' }}>Last Year</option>
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
            {overview && (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <StatCard
                            label="Total Users"
                            value={overview.totalUsers.toLocaleString()}
                            icon={Users}
                            trend="up"
                            trendValue={`+${overview.newUsersThisMonth} this month`}
                            color="from-violet-400 to-purple-500"
                        />
                        <StatCard
                            label="Active Users"
                            value={overview.activeUsers.toLocaleString()}
                            icon={UserCheck}
                            trend="up"
                            trendValue={`${((overview.activeUsers / overview.totalUsers) * 100).toFixed(1)}%`}
                            color="from-emerald-400 to-teal-500"
                        />
                        <StatCard
                            label="Total Devices"
                            value={overview.totalDevices.toLocaleString()}
                            icon={Smartphone}
                            trend="up"
                            trendValue="+156"
                            color="from-sky-400 to-blue-500"
                        />
                        <StatCard
                            label="Monthly Revenue"
                            value={formatCurrency(overview.monthlyRevenue)}
                            icon={DollarSign}
                            trend="up"
                            trendValue={`+${overview.revenueGrowth}%`}
                            color="from-amber-400 to-orange-500"
                        />
                    </div>

                    {/* Secondary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="rounded-2xl p-4"
                            style={{
                                background: 'rgba(20, 16, 36, 0.8)',
                                border: '1px solid rgba(139,92,246,0.15)',
                            }}
                        >
                            <p className="text-xs font-medium" style={{ color: '#5a4f72' }}>MDM Coverage</p>
                            <p className="text-xl font-bold mt-1" style={{ color: '#e2d9f3' }}>{overview.mdmCoverage}%</p>
                            <div className="w-full rounded-full h-1.5 mt-2" style={{ background: 'rgba(139,92,246,0.08)' }}>
                                <div 
                                    className="h-1.5 rounded-full transition-all"
                                    style={{ width: `${overview.mdmCoverage}%`, background: 'linear-gradient(90deg, #7c3aed, #9333ea)' }}
                                />
                            </div>
                        </div>
                        <div className="rounded-2xl p-4"
                            style={{
                                background: 'rgba(20, 16, 36, 0.8)',
                                border: '1px solid rgba(139,92,246,0.15)',
                            }}
                        >
                            <p className="text-xs font-medium" style={{ color: '#5a4f72' }}>Compliant Devices</p>
                            <p className="text-xl font-bold mt-1" style={{ color: '#34d399' }}>{overview.compliantDevices.toLocaleString()}</p>
                            <p className="text-xs" style={{ color: '#5a4f72' }}>{((overview.compliantDevices / overview.totalDevices) * 100).toFixed(1)}% of total</p>
                        </div>
                        <div className="rounded-2xl p-4"
                            style={{
                                background: 'rgba(20, 16, 36, 0.8)',
                                border: '1px solid rgba(139,92,246,0.15)',
                            }}
                        >
                            <p className="text-xs font-medium" style={{ color: '#5a4f72' }}>Non-Compliant</p>
                            <p className="text-xl font-bold mt-1" style={{ color: '#f87171' }}>{overview.nonCompliantDevices.toLocaleString()}</p>
                            <p className="text-xs" style={{ color: '#5a4f72' }}>{((overview.nonCompliantDevices / overview.totalDevices) * 100).toFixed(1)}% of total</p>
                        </div>
                        <div className="rounded-2xl p-4"
                            style={{
                                background: 'rgba(20, 16, 36, 0.8)',
                                border: '1px solid rgba(139,92,246,0.15)',
                            }}
                        >
                            <p className="text-xs font-medium" style={{ color: '#5a4f72' }}>Active Plans</p>
                            <p className="text-xl font-bold mt-1" style={{ color: '#e2d9f3' }}>{overview.activePlans} / {overview.totalPlans}</p>
                            <p className="text-xs" style={{ color: '#5a4f72' }}>Subscription plans</p>
                        </div>
                    </div>

                    {/* Plan Distribution */}
                    <Panel>
                        <h3 className="text-sm font-semibold mb-4" style={{ color: '#e2d9f3' }}>Plan Distribution</h3>
                        <div className="space-y-3">
                            {planDistribution.map((plan, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl"
                                    style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.08)' }}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`w-2.5 h-2.5 rounded-full`} 
                                              style={{ backgroundColor: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'][i] }} />
                                        <span className="text-sm" style={{ color: '#c4b5fd' }}>{plan.name}</span>
                                        {plan.active && (
                                            <span className="text-[8px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-semibold" style={{ color: '#e2d9f3' }}>{plan.users}</span>
                                        <span className="text-xs" style={{ color: '#5a4f72' }}>{formatCurrency(plan.revenue)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Panel>

                    {/* Compliance Overview */}
                    <Panel>
                        <h3 className="text-sm font-semibold mb-4" style={{ color: '#e2d9f3' }}>Compliance Overview</h3>
                        <div className="space-y-3">
                            {complianceData && Object.entries({
                                'MDM Enrolled': { value: complianceData.mdmEnrolled, color: '#8B5CF6' },
                                'Encryption Enabled': { value: complianceData.encryptionEnabled, color: '#3B82F6' },
                                'Passcode Required': { value: complianceData.passcodeRequired, color: '#10B981' },
                                'OS Updated': { value: complianceData.osUpdated, color: '#F59E0B' }
                            }).map(([label, { value, color }]) => {
                                const percentage = (value / complianceData.totalDevices) * 100;
                                return (
                                    <div key={label}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm" style={{ color: '#9c8fc0' }}>{label}</span>
                                            <span className="text-sm font-semibold" style={{ color: '#e2d9f3' }}>
                                                {value.toLocaleString()} ({percentage.toFixed(1)}%)
                                            </span>
                                        </div>
                                        <div className="w-full rounded-full h-2" style={{ background: 'rgba(139,92,246,0.08)' }}>
                                            <div 
                                                className="h-2 rounded-full transition-all"
                                                style={{ width: `${percentage}%`, backgroundColor: color }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Panel>

                    {/* Recent Activities */}
                    <Panel>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold" style={{ color: '#e2d9f3' }}>Recent Activities</h3>
                            <button className="text-xs font-medium transition-colors" style={{ color: '#a78bfa' }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#c4b5fd'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#a78bfa'; }}
                            >
                                View All
                            </button>
                        </div>
                        <div className="space-y-2">
                            {recentActivities.map((activity, i) => {
                                const colors = getActivityColor(activity.type);
                                return (
                                    <div 
                                        key={i}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-colors`}
                                        style={{ background: colors.bg, borderColor: colors.border }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.12)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = colors.bg; }}
                                    >
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center"
                                            style={{ background: 'rgba(20, 16, 36, 0.8)' }}
                                        >
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm" style={{ color: '#c4b5fd' }}>
                                                <span className="font-semibold" style={{ color: '#e2d9f3' }}>{activity.user}</span>
                                                {activity.type === 'user_added' && ` joined ${activity.plan} plan`}
                                                {activity.type === 'user_removed' && ` left ${activity.plan} plan`}
                                                {activity.type === 'device_enrolled' && ` enrolled ${activity.device}`}
                                                {activity.type === 'compliance_alert' && ` has compliance issue: ${activity.issue}`}
                                                {activity.type === 'plan_upgraded' && ` upgraded from ${activity.from} to ${activity.to}`}
                                            </p>
                                        </div>
                                        <span className="text-xs whitespace-nowrap" style={{ color: '#5a4f72' }}>{activity.time}</span>
                                    </div>
                                );
                            })}
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
                    <span>Data source: Live MDM Database</span>
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
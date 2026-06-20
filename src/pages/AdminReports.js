// components/AdminReports.js
import React, { useState, useEffect, useMemo } from 'react';
import {
    BarChart3, LineChart, PieChart, Download, Filter,
    Calendar, Users, Smartphone, DollarSign, TrendingUp,
    TrendingDown, Activity, AlertCircle, CheckCircle,
    Clock, Zap, Shield, Server, Globe, RefreshCw,
    ChevronDown, ChevronUp, FileText, Printer, Mail,
    UserCheck, UserX, Package, CreditCard, Percent,
    ArrowUpRight, ArrowDownRight, Minus, X
} from 'lucide-react';

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

// ── Chart Components (Simplified SVG based) ──────────────────────────────────

const BarChart = ({ data, xKey, yKey, color = '#8B5CF6', height = 200 }) => {
    const maxValue = Math.max(...data.map(d => d[yKey]));
    const padding = { top: 20, bottom: 30, left: 10, right: 10 };
    const chartHeight = height - padding.top - padding.bottom;
    const chartWidth = 100 - padding.left - padding.right;

    return (
        <div className="w-full">
            <div className="relative" style={{ height: `${height}px` }}>
                <svg className="w-full h-full" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((val) => (
                        <line
                            key={val}
                            x1="0"
                            y1={height - (val / 100) * chartHeight - padding.bottom}
                            x2="100"
                            y2={height - (val / 100) * chartHeight - padding.bottom}
                            stroke="#E2E8F0"
                            strokeWidth="0.5"
                            strokeDasharray="2,2"
                        />
                    ))}

                    {/* Bars */}
                    {data.map((d, i) => {
                        const barWidth = (chartWidth / data.length) * 0.6;
                        const x = padding.left + (i / data.length) * chartWidth + (chartWidth / data.length) * 0.2;
                        const barHeight = (d[yKey] / maxValue) * chartHeight;
                        const y = height - barHeight - padding.bottom;

                        return (
                            <g key={i}>
                                <rect
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={barHeight}
                                    fill={color}
                                    rx="2"
                                    className="hover:opacity-80 transition-opacity cursor-pointer"
                                >
                                    <title>{`${d[xKey]}: ${d[yKey]}`}</title>
                                </rect>
                                {/* Value label */}
                                <text
                                    x={x + barWidth / 2}
                                    y={y - 5}
                                    textAnchor="middle"
                                    fontSize="4"
                                    fill="#64748B"
                                >
                                    {d[yKey]}
                                </text>
                            </g>
                        );
                    })}

                    {/* X-axis labels */}
                    {data.map((d, i) => {
                        const x = padding.left + (i / data.length) * chartWidth + (chartWidth / data.length) * 0.5;
                        return (
                            <text
                                key={i}
                                x={x}
                                y={height - 2}
                                textAnchor="middle"
                                fontSize="4"
                                fill="#94A3B8"
                            >
                                {d[xKey]}
                            </text>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

const DoughnutChart = ({ data, colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'] }) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = 0;
    const radius = 40;
    const center = 50;

    return (
        <div className="w-full max-w-[200px] mx-auto">
            <svg viewBox="0 0 100 100">
                {data.map((d, i) => {
                    const percentage = d.value / total;
                    const angle = percentage * 360;
                    const startAngle = currentAngle;
                    const endAngle = currentAngle + angle;
                    currentAngle = endAngle;

                    const startRad = (startAngle - 90) * Math.PI / 180;
                    const endRad = (endAngle - 90) * Math.PI / 180;

                    const x1 = center + radius * Math.cos(startRad);
                    const y1 = center + radius * Math.sin(startRad);
                    const x2 = center + radius * Math.cos(endRad);
                    const y2 = center + radius * Math.sin(endRad);

                    const largeArcFlag = angle > 180 ? 1 : 0;

                    return (
                        <g key={i}>
                            <path
                                d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                                fill={colors[i % colors.length]}
                                className="hover:opacity-80 transition-opacity cursor-pointer"
                            >
                                <title>{`${d.label}: ${d.value} (${(percentage * 100).toFixed(1)}%)`}</title>
                            </path>
                            {/* Percentage label in center */}
                            {i === 0 && (
                                <text
                                    x={center}
                                    y={center}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fontSize="10"
                                    fontWeight="bold"
                                    fill="#1E293B"
                                >
                                    {total}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

// ── Stat Card Component ──────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, trend, trendValue, color, bgColor }) => {
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
    const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-slate-400';

    return (
        <div className={`rounded-2xl border border-slate-100 bg-gradient-to-br ${bgColor} p-5`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm shrink-0`}>
                    <Icon size={18} className="text-white" />
                </div>
            </div>
            {trend && (
                <div className="flex items-center gap-1.5 mt-3">
                    <TrendIcon size={14} className={trendColor} />
                    <span className={`text-xs font-semibold ${trendColor}`}>
                        {trendValue}
                    </span>
                    <span className="text-xs text-slate-400">vs last month</span>
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
    const [selectedReport, setSelectedReport] = useState('overview');
    const [showFilters, setShowFilters] = useState(false);

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
            case 'user_added': return <UserCheck size={14} className="text-emerald-500" />;
            case 'user_removed': return <UserX size={14} className="text-red-500" />;
            case 'device_enrolled': return <Smartphone size={14} className="text-blue-500" />;
            case 'compliance_alert': return <AlertCircle size={14} className="text-amber-500" />;
            case 'plan_upgraded': return <ArrowUpRight size={14} className="text-violet-500" />;
            default: return <Activity size={14} className="text-slate-500" />;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'user_added': return 'bg-emerald-50 border-emerald-200';
            case 'user_removed': return 'bg-red-50 border-red-200';
            case 'device_enrolled': return 'bg-blue-50 border-blue-200';
            case 'compliance_alert': return 'bg-amber-50 border-amber-200';
            case 'plan_upgraded': return 'bg-violet-50 border-violet-200';
            default: return 'bg-slate-50 border-slate-200';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-400 border-t-transparent mx-auto" />
                    <p className="mt-4 text-sm text-slate-400">Loading reports...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Reports & Analytics</h1>
                    <p className="text-sm text-slate-400 mt-0.5">Comprehensive insights into your MDM ecosystem</p>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-3.5 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
                    >
                        <option value="30d">Last 30 Days</option>
                        <option value="3m">Last 3 Months</option>
                        <option value="6m">Last 6 Months</option>
                        <option value="1y">Last Year</option>
                    </select>
                    <button
                        onClick={loadData}
                        className="flex items-center gap-2 px-3.5 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        <RefreshCw size={14} /> Refresh
                    </button>
                    <button
                        className="flex items-center gap-2 px-3.5 py-2 text-sm text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors shadow-sm"
                    >
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                    label="Total Users"
                    value={overview.totalUsers.toLocaleString()}
                    icon={Users}
                    trend="up"
                    trendValue={`+${overview.newUsersThisMonth} this month`}
                    color="from-violet-400 to-purple-500"
                    bgColor="from-violet-50 to-purple-50"
                />
                <StatCard
                    label="Active Users"
                    value={overview.activeUsers.toLocaleString()}
                    icon={UserCheck}
                    trend="up"
                    trendValue={`${((overview.activeUsers / overview.totalUsers) * 100).toFixed(1)}%`}
                    color="from-emerald-400 to-teal-500"
                    bgColor="from-emerald-50 to-teal-50"
                />
                <StatCard
                    label="Total Devices"
                    value={overview.totalDevices.toLocaleString()}
                    icon={Smartphone}
                    trend="up"
                    trendValue="+156"
                    color="from-sky-400 to-blue-500"
                    bgColor="from-sky-50 to-blue-50"
                />
                <StatCard
                    label="Monthly Revenue"
                    value={formatCurrency(overview.monthlyRevenue)}
                    icon={DollarSign}
                    trend="up"
                    trendValue={`+${overview.revenueGrowth}%`}
                    color="from-amber-400 to-orange-500"
                    bgColor="from-amber-50 to-orange-50"
                />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-2xl border border-slate-100 p-4">
                    <p className="text-xs text-slate-400 font-medium">MDM Coverage</p>
                    <p className="text-xl font-bold text-slate-800 mt-1">{overview.mdmCoverage}%</p>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                        <div 
                            className="bg-violet-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${overview.mdmCoverage}%` }}
                        />
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-4">
                    <p className="text-xs text-slate-400 font-medium">Compliant Devices</p>
                    <p className="text-xl font-bold text-emerald-600 mt-1">{overview.compliantDevices.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">{((overview.compliantDevices / overview.totalDevices) * 100).toFixed(1)}% of total</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-4">
                    <p className="text-xs text-slate-400 font-medium">Non-Compliant</p>
                    <p className="text-xl font-bold text-red-500 mt-1">{overview.nonCompliantDevices.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">{((overview.nonCompliantDevices / overview.totalDevices) * 100).toFixed(1)}% of total</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-4">
                    <p className="text-xs text-slate-400 font-medium">Active Plans</p>
                    <p className="text-xl font-bold text-slate-800 mt-1">{overview.activePlans} / {overview.totalPlans}</p>
                    <p className="text-xs text-slate-400">Subscription plans</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-slate-800">User Growth</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-violet-500" />
                                New
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                Active
                            </span>
                        </div>
                    </div>
                    <div className="h-[200px]">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {userGrowth.map((d, i) => {
                                const x = (i / (userGrowth.length - 1)) * 90 + 5;
                                const maxUsers = Math.max(...userGrowth.map(u => u.totalUsers));
                                const newY = 90 - (d.newUsers / maxUsers) * 80;
                                const activeY = 90 - (d.activeUsers / maxUsers) * 80;

                                return (
                                    <g key={i}>
                                        {/* New users line */}
                                        <circle
                                            cx={x}
                                            cy={newY}
                                            r="1.5"
                                            fill="#8B5CF6"
                                            className="hover:r-3 transition-all cursor-pointer"
                                        />
                                        {/* Active users line */}
                                        <circle
                                            cx={x}
                                            cy={activeY}
                                            r="1.5"
                                            fill="#10B981"
                                            className="hover:r-3 transition-all cursor-pointer"
                                        />
                                        {/* Connect lines */}
                                        {i > 0 && (
                                            <>
                                                <line
                                                    x1={(i - 1) / (userGrowth.length - 1) * 90 + 5}
                                                    y1={90 - (userGrowth[i - 1].newUsers / maxUsers) * 80}
                                                    x2={x}
                                                    y2={newY}
                                                    stroke="#8B5CF6"
                                                    strokeWidth="1"
                                                    opacity="0.5"
                                                />
                                                <line
                                                    x1={(i - 1) / (userGrowth.length - 1) * 90 + 5}
                                                    y1={90 - (userGrowth[i - 1].activeUsers / maxUsers) * 80}
                                                    x2={x}
                                                    y2={activeY}
                                                    stroke="#10B981"
                                                    strokeWidth="1"
                                                    opacity="0.5"
                                                />
                                            </>
                                        )}
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                        {userGrowth.map(d => (
                            <span key={d.month}>{d.month}</span>
                        ))}
                    </div>
                </div>

                {/* Plan Distribution */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-sm font-semibold text-slate-800 mb-4">Plan Distribution</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-full max-w-[180px]">
                            <DoughnutChart 
                                data={planDistribution.map(p => ({
                                    label: p.name,
                                    value: p.users
                                }))}
                                colors={['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444']}
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            {planDistribution.map((plan, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full`} 
                                              style={{ backgroundColor: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'][i] }} />
                                        <span className="text-sm text-slate-600">{plan.name}</span>
                                        {plan.active && (
                                            <span className="text-[8px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-semibold text-slate-800">{plan.users}</span>
                                        <span className="text-xs text-slate-400">{formatCurrency(plan.revenue)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Compliance & Revenue */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Compliance Overview */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-sm font-semibold text-slate-800 mb-4">Compliance Overview</h3>
                    <div className="space-y-3">
                        {complianceData && Object.entries({
                            'MDM Enrolled': { value: complianceData.mdmEnrolled, icon: Shield, color: 'violet' },
                            'Encryption Enabled': { value: complianceData.encryptionEnabled, icon: Server, color: 'blue' },
                            'Passcode Required': { value: complianceData.passcodeRequired, icon: LockIcon, color: 'emerald' },
                            'OS Updated': { value: complianceData.osUpdated, icon: Zap, color: 'amber' }
                        }).map(([label, { value, icon: Icon, color }]) => {
                            const percentage = (value / complianceData.totalDevices) * 100;
                            const colors = {
                                violet: 'bg-violet-500',
                                blue: 'bg-blue-500',
                                emerald: 'bg-emerald-500',
                                amber: 'bg-amber-500'
                            };
                            return (
                                <div key={label}>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <Icon size={14} className={`text-${color}-500`} />
                                            <span className="text-sm text-slate-600">{label}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-800">
                                            {value.toLocaleString()} ({percentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div 
                                            className={`${colors[color]} h-2 rounded-full transition-all`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Revenue Overview */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-slate-800">Revenue Overview</h3>
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            +{overview.revenueGrowth}% growth
                        </span>
                    </div>
                    <div className="space-y-4">
                        {revenueData.slice(-3).map((d, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{d.month}</p>
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <span className="text-xs text-slate-400">{d.subscriptions} subscriptions</span>
                                        <span className="text-xs text-slate-400">{d.upgrades} upgrades</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-800">{formatCurrency(d.revenue)}</p>
                                    <p className="text-xs text-emerald-600">
                                        +{((d.revenue / revenueData[0].revenue - 1) * 100).toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-800">Recent Activities</h3>
                    <button className="text-xs text-violet-600 hover:text-violet-700 font-medium">
                        View All
                    </button>
                </div>
                <div className="space-y-2">
                    {recentActivities.map((activity, i) => (
                        <div 
                            key={i}
                            className={`flex items-center gap-3 p-3 rounded-xl border ${getActivityColor(activity.type)} transition-colors hover:shadow-sm`}
                        >
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-700">
                                    <span className="font-semibold">{activity.user}</span>
                                    {activity.type === 'user_added' && ` joined ${activity.plan} plan`}
                                    {activity.type === 'user_removed' && ` left ${activity.plan} plan`}
                                    {activity.type === 'device_enrolled' && ` enrolled ${activity.device}`}
                                    {activity.type === 'compliance_alert' && ` has compliance issue: ${activity.issue}`}
                                    {activity.type === 'plan_upgraded' && ` upgraded from ${activity.from} to ${activity.to}`}
                                </p>
                            </div>
                            <span className="text-xs text-slate-400 whitespace-nowrap">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-4">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Last updated: {new Date().toLocaleString()}</span>
                    <span className="w-px h-4 bg-slate-200" />
                    <span>Data source: Live MDM Database</span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Printer size={14} /> Print
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Mail size={14} /> Email
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <FileText size={14} /> PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;

// Lock Icon component
const LockIcon = ({ size, className }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);
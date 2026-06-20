// components/AnalyticsPage.js
import React, { useState, useEffect, useMemo } from 'react';
import {
    TrendingUp, TrendingDown, Users, Smartphone, Shield,
    AlertTriangle, CheckCircle, Clock, Zap, Server,
    Download, Filter, Calendar, ChevronDown, ChevronUp,
    BarChart3, LineChart, PieChart, Activity, Globe,
    DollarSign, Percent, Package, UserCheck, UserX,
    ArrowUpRight, ArrowDownRight, Minus, RefreshCw,
    Eye, EyeOff, Maximize2, Minimize2, X
} from 'lucide-react';

// ── Analytics Service ──────────────────────────────────────────────────────────
const AnalyticsService = {
    getRealTimeStats: () => ({
        onlineDevices: 1842,
        offlineDevices: 314,
        totalUsers: 1247,
        activeSessions: 823,
        mdmCoverage: 85.4,
        avgResponseTime: 124,
        uptime: 99.97,
        alerts: 23
    }),

    getHistoricalData: (days = 30) => {
        const data = [];
        const now = Date.now();
        for (let i = days; i >= 0; i--) {
            const date = new Date(now - i * 24 * 60 * 60 * 1000);
            data.push({
                date: date.toISOString().split('T')[0],
                users: Math.floor(Math.random() * 200) + 1000,
                devices: Math.floor(Math.random() * 300) + 1800,
                activeUsers: Math.floor(Math.random() * 150) + 800,
                compliance: Math.floor(Math.random() * 15) + 75,
                revenue: Math.floor(Math.random() * 5000) + 20000
            });
        }
        return data;
    },

    getDeviceAnalytics: () => ({
        byOS: {
            iOS: 842,
            Android: 634,
            Windows: 456,
            macOS: 178,
            Linux: 46
        },
        byType: {
            Mobile: 842,
            Tablet: 456,
            Laptop: 678,
            Desktop: 120,
            Wearable: 60
        },
        byManufacturer: {
            Apple: 1024,
            Samsung: 456,
            Dell: 234,
            HP: 189,
            Lenovo: 145,
            Google: 108
        },
        batteryHealth: {
            excellent: 634,
            good: 845,
            fair: 456,
            poor: 221
        },
        storageUsage: {
            under50: 456,
            '50-75': 789,
            '75-90': 567,
            over90: 344
        }
    }),

    getUserAnalytics: () => ({
        byRole: {
            Admin: 45,
            'Sub Admin': 156,
            User: 1046
        },
        byRegion: {
            'North America': 345,
            Europe: 289,
            'Asia Pacific': 423,
            'Latin America': 123,
            'Middle East': 67
        },
        byPlan: {
            Basic: 234,
            Pro: 456,
            Enterprise: 189,
            Starter: 234,
            Business: 134
        },
        retention: {
            '30 days': 92,
            '60 days': 87,
            '90 days': 81,
            '180 days': 73,
            '365 days': 65
        },
        engagement: {
            daily: 823,
            weekly: 289,
            monthly: 112,
            rarely: 23
        }
    }),

    getSecurityAnalytics: () => ({
        mdmEnrollment: 85.4,
        encryptionRate: 72.6,
        passcodeCompliance: 79.9,
        osUpdateCompliance: 62.4,
        jailbreakDetected: 12,
        compromisedDevices: 8,
        securityAlerts: {
            critical: 3,
            high: 8,
            medium: 15,
            low: 23
        },
        threatsByType: {
            Malware: 5,
            Phishing: 12,
            'Data Leak': 3,
            'Unauthorized Access': 4,
            'Device Compromise': 2
        }
    }),

    getPerformanceMetrics: () => ({
        deviceHealth: {
            excellent: 634,
            good: 845,
            fair: 456,
            poor: 221
        },
        networkPerformance: {
            latency: 124,
            throughput: 2345,
            packetLoss: 0.34,
            jitter: 12
        },
        appPerformance: {
            avgLoadTime: 1.8,
            crashRate: 0.34,
            responseTime: 234,
            errorRate: 0.89
        },
        systemPerformance: {
            cpuUsage: 45.6,
            memoryUsage: 62.3,
            diskUsage: 58.7,
            networkUsage: 34.2
        }
    })
};



const HorizontalBarChart = ({ data, color = '#8B5CF6' }) => {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="space-y-2">
            {data.map((d, i) => (
                <div key={i}>
                    <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs text-slate-600">{d.label}</span>
                        <span className="text-xs font-semibold text-slate-800">{d.value}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                            className={`h-1.5 rounded-full transition-all`}
                            style={{
                                width: `${(d.value / maxValue) * 100}%`,
                                backgroundColor: d.color || color
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

// ── Analytics Card Components ─────────────────────────────────────────────────

const MetricCard = ({ label, value, icon: Icon, subtitle, trend, trendValue, color }) => {
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
    const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-slate-400';

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500">{label}</p>
                    <p className="text-xl font-bold text-slate-800 mt-1">{value}</p>
                    {subtitle && <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>}
                </div>
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                    <Icon size={14} className="text-white" />
                </div>
            </div>
            {trend && (
                <div className="flex items-center gap-1.5 mt-3">
                    <TrendIcon size={12} className={trendColor} />
                    <span className={`text-xs font-semibold ${trendColor}`}>{trendValue}</span>
                    <span className="text-[10px] text-slate-400">vs last period</span>
                </div>
            )}
        </div>
    );
};

const AnalyticsCard = ({ title, children, icon: Icon, className = '' }) => (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
            {Icon && <Icon size={16} className="text-violet-500" />}
            <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        </div>
        {children}
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

const AdminAnalytics = () => {
    const [realTime, setRealTime] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);
    const [deviceAnalytics, setDeviceAnalytics] = useState(null);
    const [userAnalytics, setUserAnalytics] = useState(null);
    const [securityAnalytics, setSecurityAnalytics] = useState(null);
    const [performanceMetrics, setPerformanceMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30d');
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedMetric, setSelectedMetric] = useState(null);
    const [expandedCards, setExpandedCards] = useState({});

    const loadData = () => {
        setLoading(true);
        setTimeout(() => {
            setRealTime(AnalyticsService.getRealTimeStats());
            setHistoricalData(AnalyticsService.getHistoricalData(
                timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 180
            ));
            setDeviceAnalytics(AnalyticsService.getDeviceAnalytics());
            setUserAnalytics(AnalyticsService.getUserAnalytics());
            setSecurityAnalytics(AnalyticsService.getSecurityAnalytics());
            setPerformanceMetrics(AnalyticsService.getPerformanceMetrics());
            setLoading(false);
        }, 500);
    };

    useEffect(() => {
        loadData();
    }, [timeRange]);

    const toggleCard = (cardId) => {
        setExpandedCards(prev => ({
            ...prev,
            [cardId]: !prev[cardId]
        }));
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'devices', label: 'Devices', icon: Smartphone },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'performance', label: 'Performance', icon: Zap }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-400 border-t-transparent mx-auto" />
                    <p className="mt-4 text-sm text-slate-400">Loading analytics data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Analytics Dashboard</h1>
                    <p className="text-sm text-slate-400 mt-0.5">Real-time insights and performance metrics</p>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-3.5 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
                    >
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                        <option value="180d">Last 180 Days</option>
                    </select>
                    <button
                        onClick={loadData}
                        className="flex items-center gap-2 px-3.5 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        <RefreshCw size={14} />
                    </button>
                    <button className="flex items-center gap-2 px-3.5 py-2 text-sm text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors shadow-sm">
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1 bg-white rounded-2xl border border-slate-100 p-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                            activeTab === tab.id
                                ? 'bg-violet-600 text-white shadow-sm'
                                : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <>
                    {/* Real-time Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        <MetricCard
                            label="Online Devices"
                            value={realTime.onlineDevices}
                            icon={Smartphone}
                            subtitle={`${realTime.offlineDevices} offline`}
                            trend="up"
                            trendValue="+12%"
                            color="from-emerald-400 to-teal-500"
                        />
                        <MetricCard
                            label="Active Users"
                            value={realTime.activeSessions}
                            icon={UserCheck}
                            subtitle={`${realTime.totalUsers} total`}
                            trend="up"
                            trendValue="+8%"
                            color="from-sky-400 to-blue-500"
                        />
                        <MetricCard
                            label="MDM Coverage"
                            value={`${realTime.mdmCoverage}%`}
                            icon={Shield}
                            subtitle="Device management"
                            trend="up"
                            trendValue="+2.3%"
                            color="from-violet-400 to-purple-500"
                        />
                        <MetricCard
                            label="Uptime"
                            value={`${realTime.uptime}%`}
                            icon={Activity}
                            subtitle="System availability"
                            trend="up"
                            trendValue="+0.1%"
                            color="from-emerald-400 to-green-500"
                        />
                        <MetricCard
                            label="Avg Response"
                            value={`${realTime.avgResponseTime}ms`}
                            icon={Clock}
                            subtitle="API latency"
                            trend="down"
                            trendValue="-3ms"
                            color="from-amber-400 to-orange-500"
                        />
                        <MetricCard
                            label="Active Alerts"
                            value={realTime.alerts}
                            icon={AlertTriangle}
                            subtitle="Requires attention"
                            trend="down"
                            trendValue="-2"
                            color="from-rose-400 to-red-500"
                        />
                        <MetricCard
                            label="Revenue"
                            value="$28.4K"
                            icon={DollarSign}
                            subtitle="This month"
                            trend="up"
                            trendValue="+12.5%"
                            color="from-indigo-400 to-purple-500"
                        />
                    </div>

                    {/* Historical Trends */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AnalyticsCard title="User & Device Trends" icon={LineChart}>
                            <LineChart
                                data={historicalData.slice(-14)}
                                lines={[
                                    { key: 'users', color: '#8B5CF6' },
                                    { key: 'devices', color: '#3B82F6' },
                                    { key: 'activeUsers', color: '#10B981' }
                                ]}
                                height={180}
                            />
                            <div className="flex justify-center gap-4 mt-2 text-[10px] text-slate-400">
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                                    Users
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                                    Devices
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    Active
                                </span>
                            </div>
                        </AnalyticsCard>

                        <AnalyticsCard title="Compliance & Revenue" icon={TrendingUp}>
                            <LineChart
                                data={historicalData.slice(-14)}
                                lines={[
                                    { key: 'compliance', color: '#8B5CF6' },
                                    { key: 'revenue', color: '#10B981' }
                                ]}
                                height={180}
                            />
                            <div className="flex justify-center gap-4 mt-2 text-[10px] text-slate-400">
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                                    Compliance (%)
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    Revenue ($)
                                </span>
                            </div>
                        </AnalyticsCard>
                    </div>

                    {/* Device Distribution */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <AnalyticsCard title="By OS" icon={Server}>
                            <HorizontalBarChart
                                data={Object.entries(deviceAnalytics.byOS).map(([key, value]) => ({
                                    label: key,
                                    value,
                                    color: {
                                        iOS: '#3B82F6',
                                        Android: '#10B981',
                                        Windows: '#8B5CF6',
                                        macOS: '#F59E0B',
                                        Linux: '#EF4444'
                                    }[key] || '#8B5CF6'
                                }))}
                            />
                        </AnalyticsCard>

                        <AnalyticsCard title="By Device Type" icon={Smartphone}>
                            <HorizontalBarChart
                                data={Object.entries(deviceAnalytics.byType).map(([key, value]) => ({
                                    label: key,
                                    value,
                                    color: {
                                        Mobile: '#3B82F6',
                                        Tablet: '#10B981',
                                        Laptop: '#8B5CF6',
                                        Desktop: '#F59E0B',
                                        Wearable: '#EF4444'
                                    }[key] || '#8B5CF6'
                                }))}
                            />
                        </AnalyticsCard>

                        <AnalyticsCard title="Battery Health" icon={Zap}>
                            <HorizontalBarChart
                                data={Object.entries(deviceAnalytics.batteryHealth).map(([key, value]) => ({
                                    label: key.charAt(0).toUpperCase() + key.slice(1),
                                    value,
                                    color: {
                                        excellent: '#10B981',
                                        good: '#3B82F6',
                                        fair: '#F59E0B',
                                        poor: '#EF4444'
                                    }[key] || '#8B5CF6'
                                }))}
                            />
                        </AnalyticsCard>
                    </div>
                </>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnalyticsCard title="Users by Role" icon={Users}>
                        <HorizontalBarChart
                            data={Object.entries(userAnalytics.byRole).map(([key, value]) => ({
                                label: key,
                                value,
                                color: {
                                    Admin: '#EF4444',
                                    'Sub Admin': '#F59E0B',
                                    User: '#3B82F6'
                                }[key] || '#8B5CF6'
                            }))}
                        />
                    </AnalyticsCard>

                    <AnalyticsCard title="Users by Region" icon={Globe}>
                        <HorizontalBarChart
                            data={Object.entries(userAnalytics.byRegion).map(([key, value]) => ({
                                label: key,
                                value
                            }))}
                            color="#10B981"
                        />
                    </AnalyticsCard>

                    <AnalyticsCard title="Plan Distribution" icon={Package}>
                        <HorizontalBarChart
                            data={Object.entries(userAnalytics.byPlan).map(([key, value]) => ({
                                label: key,
                                value
                            }))}
                            color="#8B5CF6"
                        />
                    </AnalyticsCard>

                    <AnalyticsCard title="User Engagement" icon={Activity}>
                        <HorizontalBarChart
                            data={Object.entries(userAnalytics.engagement).map(([key, value]) => ({
                                label: key.charAt(0).toUpperCase() + key.slice(1),
                                value,
                                color: {
                                    daily: '#10B981',
                                    weekly: '#3B82F6',
                                    monthly: '#F59E0B',
                                    rarely: '#EF4444'
                                }[key] || '#8B5CF6'
                            }))}
                        />
                    </AnalyticsCard>

                    <AnalyticsCard title="Retention Rate" icon={TrendingUp} className="md:col-span-2">
                        <LineChart
                            data={Object.entries(userAnalytics.retention).map(([key, value]) => ({
                                period: key,
                                rate: value
                            }))}
                            lines={[{ key: 'rate', color: '#8B5CF6' }]}
                            height={150}
                        />
                        <div className="flex justify-center mt-2 text-[10px] text-slate-400">
                            Retention rate over time
                        </div>
                    </AnalyticsCard>
                </div>
            )}

            {/* Devices Tab */}
            {activeTab === 'devices' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnalyticsCard title="Device Manufacturers" icon={Server}>
                        <HorizontalBarChart
                            data={Object.entries(deviceAnalytics.byManufacturer).map(([key, value]) => ({
                                label: key,
                                value
                            }))}
                            color="#3B82F6"
                        />
                    </AnalyticsCard>

                    <AnalyticsCard title="Storage Usage" icon={Server}>
                        <HorizontalBarChart
                            data={Object.entries(deviceAnalytics.storageUsage).map(([key, value]) => ({
                                label: key === 'under50' ? '< 50%' : key === '50-75' ? '50-75%' : key === '75-90' ? '75-90%' : '> 90%',
                                value,
                                color: {
                                    under50: '#10B981',
                                    '50-75': '#3B82F6',
                                    '75-90': '#F59E0B',
                                    over90: '#EF4444'
                                }[key] || '#8B5CF6'
                            }))}
                        />
                    </AnalyticsCard>

                    <AnalyticsCard title="Device Health Status" icon={CheckCircle} className="md:col-span-2">
                        <div className="grid grid-cols-4 gap-4">
                            {Object.entries(performanceMetrics.deviceHealth).map(([key, value]) => (
                                <div key={key} className="text-center p-3 bg-slate-50 rounded-xl">
                                    <p className="text-2xl font-bold text-slate-800">{value}</p>
                                    <p className="text-[10px] text-slate-400 capitalize">{key}</p>
                                    <div className="w-full bg-slate-200 rounded-full h-1 mt-2">
                                        <div
                                            className={`h-1 rounded-full ${
                                                key === 'excellent' ? 'bg-emerald-500' :
                                                key === 'good' ? 'bg-blue-500' :
                                                key === 'fair' ? 'bg-amber-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${(value / 2156) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AnalyticsCard>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <MetricCard
                            label="MDM Enrollment"
                            value={`${securityAnalytics.mdmEnrollment}%`}
                            icon={Shield}
                            trend="up"
                            trendValue="+2.3%"
                            color="from-violet-400 to-purple-500"
                        />
                        <MetricCard
                            label="Encryption Rate"
                            value={`${securityAnalytics.encryptionRate}%`}
                            icon={Server}
                            trend="up"
                            trendValue="+1.8%"
                            color="from-sky-400 to-blue-500"
                        />
                        <MetricCard
                            label="Passcode Compliance"
                            value={`${securityAnalytics.passcodeCompliance}%`}
                            icon={LockIcon}
                            trend="up"
                            trendValue="+0.9%"
                            color="from-emerald-400 to-teal-500"
                        />
                        <MetricCard
                            label="OS Updates"
                            value={`${securityAnalytics.osUpdateCompliance}%`}
                            icon={Zap}
                            trend="down"
                            trendValue="-0.5%"
                            color="from-amber-400 to-orange-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnalyticsCard title="Security Alerts Distribution" icon={AlertTriangle}>
                            <HorizontalBarChart
                                data={Object.entries(securityAnalytics.securityAlerts).map(([key, value]) => ({
                                    label: key.charAt(0).toUpperCase() + key.slice(1),
                                    value,
                                    color: {
                                        critical: '#EF4444',
                                        high: '#F59E0B',
                                        medium: '#3B82F6',
                                        low: '#10B981'
                                    }[key] || '#8B5CF6'
                                }))}
                            />
                        </AnalyticsCard>

                        <AnalyticsCard title="Threats by Type" icon={AlertTriangle}>
                            <HorizontalBarChart
                                data={Object.entries(securityAnalytics.threatsByType).map(([key, value]) => ({
                                    label: key,
                                    value,
                                    color: {
                                        Malware: '#EF4444',
                                        Phishing: '#F59E0B',
                                        'Data Leak': '#8B5CF6',
                                        'Unauthorized Access': '#3B82F6',
                                        'Device Compromise': '#EC4899'
                                    }[key] || '#8B5CF6'
                                }))}
                            />
                        </AnalyticsCard>

                        <AnalyticsCard title="Security Status" icon={Shield} className="md:col-span-2">
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500" />
                                    <span className="text-sm text-slate-600">Critical: {securityAnalytics.securityAlerts.critical}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                                    <span className="text-sm text-slate-600">High: {securityAnalytics.securityAlerts.high}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span className="text-sm text-slate-600">Medium: {securityAnalytics.securityAlerts.medium}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-sm text-slate-600">Low: {securityAnalytics.securityAlerts.low}</span>
                                </div>
                                <div className="flex items-center gap-2 ml-auto">
                                    <span className="text-sm font-medium text-slate-700">Compromised:</span>
                                    <span className="text-sm font-bold text-red-600">{securityAnalytics.compromisedDevices} devices</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-slate-700">Jailbreak/Root:</span>
                                    <span className="text-sm font-bold text-amber-600">{securityAnalytics.jailbreakDetected} devices</span>
                                </div>
                            </div>
                        </AnalyticsCard>
                    </div>
                </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <MetricCard
                            label="CPU Usage"
                            value={`${performanceMetrics.systemPerformance.cpuUsage}%`}
                            icon={Server}
                            trend="down"
                            trendValue="-2.1%"
                            color="from-violet-400 to-purple-500"
                        />
                        <MetricCard
                            label="Memory Usage"
                            value={`${performanceMetrics.systemPerformance.memoryUsage}%`}
                            icon={Server}
                            trend="up"
                            trendValue="+0.8%"
                            color="from-sky-400 to-blue-500"
                        />
                        <MetricCard
                            label="Network Latency"
                            value={`${performanceMetrics.networkPerformance.latency}ms`}
                            icon={Activity}
                            trend="down"
                            trendValue="-3ms"
                            color="from-emerald-400 to-teal-500"
                        />
                        <MetricCard
                            label="App Response"
                            value={`${performanceMetrics.appPerformance.responseTime}ms`}
                            icon={Zap}
                            trend="down"
                            trendValue="-12ms"
                            color="from-amber-400 to-orange-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnalyticsCard title="System Performance" icon={Server}>
                            <div className="space-y-3">
                                {Object.entries(performanceMetrics.systemPerformance).map(([key, value]) => (
                                    <div key={key}>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <span className="font-semibold text-slate-800">{value}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-0.5">
                                            <div
                                                className={`h-1.5 rounded-full ${
                                                    value < 50 ? 'bg-emerald-500' :
                                                    value < 75 ? 'bg-amber-500' : 'bg-red-500'
                                                }`}
                                                style={{ width: `${value}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AnalyticsCard>

                        <AnalyticsCard title="Network Performance" icon={Activity}>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                    <span className="text-xs text-slate-600">Throughput</span>
                                    <span className="text-sm font-semibold text-slate-800">
                                        {performanceMetrics.networkPerformance.throughput} Mbps
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                    <span className="text-xs text-slate-600">Packet Loss</span>
                                    <span className="text-sm font-semibold text-slate-800">
                                        {performanceMetrics.networkPerformance.packetLoss}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                    <span className="text-xs text-slate-600">Jitter</span>
                                    <span className="text-sm font-semibold text-slate-800">
                                        {performanceMetrics.networkPerformance.jitter}ms
                                    </span>
                                </div>
                            </div>
                        </AnalyticsCard>

                        <AnalyticsCard title="App Performance" icon={Zap} className="md:col-span-2">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-3 bg-slate-50 rounded-xl">
                                    <p className="text-2xl font-bold text-slate-800">
                                        {performanceMetrics.appPerformance.avgLoadTime}s
                                    </p>
                                    <p className="text-[10px] text-slate-400">Avg Load Time</p>
                                </div>
                                <div className="text-center p-3 bg-slate-50 rounded-xl">
                                    <p className="text-2xl font-bold text-slate-800">
                                        {performanceMetrics.appPerformance.crashRate}%
                                    </p>
                                    <p className="text-[10px] text-slate-400">Crash Rate</p>
                                </div>
                                <div className="text-center p-3 bg-slate-50 rounded-xl">
                                    <p className="text-2xl font-bold text-slate-800">
                                        {performanceMetrics.appPerformance.responseTime}ms
                                    </p>
                                    <p className="text-[10px] text-slate-400">Avg Response</p>
                                </div>
                                <div className="text-center p-3 bg-slate-50 rounded-xl">
                                    <p className="text-2xl font-bold text-slate-800">
                                        {performanceMetrics.appPerformance.errorRate}%
                                    </p>
                                    <p className="text-[10px] text-slate-400">Error Rate</p>
                                </div>
                            </div>
                        </AnalyticsCard>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-4">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Last updated: {new Date().toLocaleString()}</span>
                    <span className="w-px h-4 bg-slate-200" />
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        System Online
                    </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Data source: Real-time Analytics</span>
                    <span>v2.4.1</span>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;

// Lock Icon component
const LockIcon = ({ size, className }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);
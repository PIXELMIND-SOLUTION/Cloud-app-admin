// components/AdminAnalytics.js - Dark Theme with Charts & Infographics
import React, { useState, useEffect, useMemo } from 'react';
import {
    TrendingUp, TrendingDown, Users, Smartphone, Shield,
    AlertTriangle, CheckCircle, Clock, Zap, Server,
    Download, Filter, Calendar, ChevronDown, ChevronUp,
    BarChart3, LineChart, PieChart, Activity, Globe,
    DollarSign, Percent, Package, UserCheck, UserX,
    ArrowUpRight, ArrowDownRight, Minus, RefreshCw,
    Eye, EyeOff, Maximize2, Minimize2, X, Circle, Target, Award, Battery, HardDrive, Cpu,
    Heart, Wifi, Database, Cloud
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

// ── Utility Functions ──────────────────────────────────────────────────────
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

const chartColors = {
    primary: '#8B5CF6',
    secondary: '#34D399',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    purple: '#A78BFA',
    pink: '#EC4899',
    cyan: '#06B6D4',
    orange: '#F97316',
    indigo: '#6366F1'
};

const gradientColors = {
    purple: ['rgba(139,92,246,0.8)', 'rgba(139,92,246,0.1)'],
    green: ['rgba(52,211,153,0.8)', 'rgba(52,211,153,0.1)'],
    blue: ['rgba(59,130,246,0.8)', 'rgba(59,130,246,0.1)'],
    orange: ['rgba(245,158,11,0.8)', 'rgba(245,158,11,0.1)'],
    red: ['rgba(239,68,68,0.8)', 'rgba(239,68,68,0.1)']
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: '#9c8fc0',
                font: { size: 11, family: 'Inter' },
                padding: 15,
                usePointStyle: true,
                pointStyle: 'circle'
            }
        }
    },
    scales: {
        x: {
            grid: { color: 'rgba(139,92,246,0.08)', drawBorder: false },
            ticks: { color: '#5a4f72', font: { size: 10 } }
        },
        y: {
            grid: { color: 'rgba(139,92,246,0.08)', drawBorder: false },
            ticks: { color: '#5a4f72', font: { size: 10 } }
        }
    }
};

// ── Analytics Service ──────────────────────────────────────────────────────
const AnalyticsService = {
    getRealTimeStats: () => ({
        onlineDevices: 1842,
        offlineDevices: 314,
        totalUsers: 1247,
        activeSessions: 823,
        mdmCoverage: 85.4,
        avgResponseTime: 124,
        uptime: 99.97,
        alerts: 23,
        revenue: 28400
    }),

    getHistoricalData: (days = 30) => {
        const data = [];
        const now = Date.now();
        let users = 1000, devices = 1800, revenue = 20000;

        for (let i = days; i >= 0; i--) {
            const date = new Date(now - i * 24 * 60 * 60 * 1000);
            users += Math.floor(Math.random() * 15) - 5;
            devices += Math.floor(Math.random() * 20) - 8;
            revenue += Math.floor(Math.random() * 500) - 200;

            data.push({
                date: date.toISOString().split('T')[0],
                users: Math.max(800, users),
                devices: Math.max(1500, devices),
                activeUsers: Math.floor(users * 0.6 + Math.random() * 50),
                compliance: Math.min(98, 75 + Math.floor(Math.random() * 15)),
                revenue: Math.max(15000, revenue),
                incidents: Math.floor(Math.random() * 5),
                newDevices: Math.floor(Math.random() * 20) + 5,
                churnRate: 2 + Math.random() * 3
            });
        }
        return data;
    },

    getDeviceAnalytics: () => ({
        byOS: { iOS: 842, Android: 634, Windows: 456, macOS: 178, Linux: 46 },
        byType: { Mobile: 842, Tablet: 456, Laptop: 678, Desktop: 120, Wearable: 60 },
        byManufacturer: { Apple: 1024, Samsung: 456, Dell: 234, HP: 189, Lenovo: 145, Google: 108 },
        batteryHealth: { Excellent: 634, Good: 845, Fair: 456, Poor: 221 },
        storageUsage: { 'Under 50%': 456, '50-75%': 789, '75-90%': 567, 'Over 90%': 344 }
    }),

    getUserAnalytics: () => ({
        byRole: { Admin: 45, 'Sub Admin': 156, User: 1046 },
        byRegion: { 'North America': 345, Europe: 289, 'Asia Pacific': 423, 'Latin America': 123, 'Middle East': 67 },
        byPlan: { Basic: 234, Professional: 456, Business: 189 },
        retention: { '30 days': 92, '60 days': 87, '90 days': 81, '180 days': 73, '365 days': 65 },
        engagement: { Daily: 823, Weekly: 289, Monthly: 112, Rarely: 23 }
    }),

    getSecurityAnalytics: () => ({
        mdmEnrollment: 85.4,
        encryptionRate: 72.6,
        passcodeCompliance: 79.9,
        osUpdateCompliance: 62.4,
        jailbreakDetected: 12,
        compromisedDevices: 8,
        securityAlerts: { Critical: 3, High: 8, Medium: 15, Low: 23 },
        threatsByType: { Malware: 5, Phishing: 12, 'Data Leak': 3, 'Unauthorized Access': 4, 'Device Compromise': 2 }
    }),

    getPerformanceMetrics: () => ({
        deviceHealth: { Excellent: 634, Good: 845, Fair: 456, Poor: 221 },
        networkPerformance: { latency: 124, throughput: 2345, packetLoss: 0.34, jitter: 12 },
        appPerformance: { avgLoadTime: 1.8, crashRate: 0.34, responseTime: 234, errorRate: 0.89 },
        systemPerformance: { cpuUsage: 45.6, memoryUsage: 62.3, diskUsage: 58.7, networkUsage: 34.2 }
    })
};

// ── Reusable Components ──────────────────────────────────────────────────────

const MetricCard = ({ label, value, icon: Icon, subtitle, trend, trendValue, color, onClick }) => {
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
    const trendColor = trend === 'up' ? '#34d399' : trend === 'down' ? '#f87171' : '#5a4f72';

    return (
        <div
            className="rounded-2xl p-4 transition-all cursor-pointer hover:scale-[1.02]"
            style={{
                background: 'rgba(20, 16, 36, 0.8)',
                border: '1px solid rgba(139,92,246,0.15)',
                backdropFilter: 'blur(12px)',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.35)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'}
            onClick={onClick}
        >
            <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate" style={{ color: '#5a4f72' }}>{label}</p>
                    <p className="text-xl font-bold mt-1 truncate" style={{ color: '#e2d9f3' }}>{value}</p>
                    {subtitle && <p className="text-[10px] mt-0.5 truncate" style={{ color: '#5a4f72' }}>{subtitle}</p>}
                </div>
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 ml-2`}
                    style={{ boxShadow: '0 0 10px rgba(124,58,237,0.3)' }}>
                    <Icon size={14} className="text-white" />
                </div>
            </div>
            {trend && (
                <div className="flex items-center gap-1.5 mt-3">
                    <TrendIcon size={12} style={{ color: trendColor }} />
                    <span className={`text-xs font-semibold`} style={{ color: trendColor }}>{trendValue}</span>
                    <span className="text-[10px]" style={{ color: '#5a4f72' }}>vs last period</span>
                </div>
            )}
        </div>
    );
};

const AnalyticsCard = ({ title, children, icon: Icon, className = '', action }) => (
    <Panel className={`hover:border-purple-500/30 transition-all ${className}`}>
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                {Icon && <Icon size={16} style={{ color: '#a78bfa' }} />}
                <h3 className="text-sm font-semibold" style={{ color: '#e2d9f3' }}>{title}</h3>
            </div>
            {action && (
                <button className="text-xs transition-colors" style={{ color: '#5a4f72' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
                    onMouseLeave={e => e.currentTarget.style.color = '#5a4f72'}>
                    {action}
                </button>
            )}
        </div>
        {children}
    </Panel>
);

// ── Chart Components ──────────────────────────────────────────────────────────

const LineChartComponent = ({ data, labels, title, color = chartColors.purple }) => {
    const chartData = {
        labels,
        datasets: [{
            label: title,
            data,
            borderColor: color,
            backgroundColor: color + '20',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: color,
            pointBorderColor: '#1a1430',
            pointBorderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 6
        }]
    };

    const options = {
        ...chartOptions,
        plugins: {
            ...chartOptions.plugins,
            legend: { display: false }
        }
    };

    return (
        <div className="w-full h-[300px]">
            <Line data={chartData} options={options} />
        </div>
    );
};

const BarChartComponent = ({ data, labels, title, color = chartColors.purple }) => {
    const chartData = {
        labels,
        datasets: [{
            label: title,
            data,
            backgroundColor: color + '60',
            borderColor: color,
            borderWidth: 2,
            borderRadius: 8,
            barPercentage: 0.7
        }]
    };

    return (
        <div className="w-full h-[250px]">
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

const DoughnutChartComponent = ({ data, labels, colors }) => {
    const chartData = {
        labels,
        datasets: [{
            data,
            backgroundColor: colors,
            borderColor: '#1a1430',
            borderWidth: 3,
            hoverOffset: 8
        }]
    };

    const options = {
        ...chartOptions,
        plugins: {
            ...chartOptions.plugins,
            legend: {
                ...chartOptions.plugins.legend,
                position: 'bottom',
                labels: {
                    ...chartOptions.plugins.legend.labels,
                    padding: 15
                }
            }
        },
        cutout: '65%'
    };

    return (
        <div className="w-full h-[280px]">
            <Doughnut data={chartData} options={options} />
        </div>
    );
};

const RadarChartComponent = ({ data, labels, colors = [chartColors.purple] }) => {
    const chartData = {
        labels,
        datasets: [{
            label: 'Performance Metrics',
            data,
            backgroundColor: colors[0] + '30',
            borderColor: colors[0],
            borderWidth: 2,
            pointBackgroundColor: colors[0],
            pointBorderColor: '#1a1430',
            pointBorderWidth: 2,
            pointRadius: 4
        }]
    };

    const options = {
        ...chartOptions,
        plugins: {
            ...chartOptions.plugins,
            legend: { display: false }
        },
        scales: {
            r: {
                angleLines: { color: 'rgba(139,92,246,0.1)' },
                grid: { color: 'rgba(139,92,246,0.1)' },
                pointLabels: { color: '#9c8fc0', font: { size: 10 } },
                ticks: { display: false },
                suggestedMin: 0,
                suggestedMax: 100
            }
        }
    };

    return (
        <div className="w-full h-[250px]">
            <Radar data={chartData} options={options} />
        </div>
    );
};

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

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'devices', label: 'Devices', icon: Smartphone },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'performance', label: 'Performance', icon: Zap }
    ];

    const loadData = () => {
        setLoading(true);
        setTimeout(() => {
            setRealTime(AnalyticsService.getRealTimeStats());
            const days = { '7d': 7, '30d': 30, '90d': 90, '180d': 180 }[timeRange] || 30;
            setHistoricalData(AnalyticsService.getHistoricalData(days));
            setDeviceAnalytics(AnalyticsService.getDeviceAnalytics());
            setUserAnalytics(AnalyticsService.getUserAnalytics());
            setSecurityAnalytics(AnalyticsService.getSecurityAnalytics());
            setPerformanceMetrics(AnalyticsService.getPerformanceMetrics());
            setLoading(false);
        }, 400);
    };

    useEffect(() => {
        loadData();
    }, [timeRange]);

    // Memoized chart data
    const chartData = useMemo(() => {
        if (!historicalData.length) return null;
        return {
            users: historicalData.map(d => d.users),
            devices: historicalData.map(d => d.devices),
            activeUsers: historicalData.map(d => d.activeUsers),
            revenue: historicalData.map(d => d.revenue),
            compliance: historicalData.map(d => d.compliance),
            dates: historicalData.map(d => d.date.slice(5))
        };
    }, [historicalData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-400 border-t-transparent mx-auto" />
                    <p className="mt-4 text-sm" style={{ color: '#5a4f72' }}>Loading analytics data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold" style={{ color: '#e2d9f3' }}>Analytics Dashboard</h1>
                    <p className="text-sm mt-0.5" style={{ color: '#5a4f72' }}>Real-time insights and performance metrics</p>
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
                        onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'}
                    >
                        <option value="7d" style={{ background: '#1a1430' }}>Last 7 Days</option>
                        <option value="30d" style={{ background: '#1a1430' }}>Last 30 Days</option>
                        <option value="90d" style={{ background: '#1a1430' }}>Last 90 Days</option>
                        <option value="180d" style={{ background: '#1a1430' }}>Last 180 Days</option>
                    </select>
                    <button
                        onClick={loadData}
                        className="p-2 rounded-xl transition-colors"
                        style={{ color: '#9c8fc0', border: '1px solid rgba(139,92,246,0.15)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; e.currentTarget.style.color = '#c4b5fd'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9c8fc0'; }}
                    >
                        <RefreshCw size={16} />
                    </button>
                    <button
                        className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-xl transition-all shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(124,58,237,0.4)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 10px rgba(124,58,237,0.2)'}>
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1 rounded-2xl p-1"
                style={{
                    background: 'rgba(20, 16, 36, 0.8)',
                    border: '1px solid rgba(139,92,246,0.15)',
                }}
            >
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all ${activeTab === tab.id ? 'text-white shadow-sm' : ''
                            }`}
                        style={activeTab === tab.id
                            ? { background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }
                            : { color: '#9c8fc0' }
                        }
                        onMouseEnter={e => { if (activeTab !== tab.id) { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; e.currentTarget.style.color = '#c4b5fd'; } }}
                        onMouseLeave={e => { if (activeTab !== tab.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9c8fc0'; } }}
                    >
                        <tab.icon size={16} />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && realTime && chartData && (
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
                            label="Response Time"
                            value={`${realTime.avgResponseTime}ms`}
                            icon={Clock}
                            subtitle="API latency"
                            trend="down"
                            trendValue="-3ms"
                            color="from-amber-400 to-orange-500"
                        />
                        <MetricCard
                            label="Alerts"
                            value={realTime.alerts}
                            icon={AlertTriangle}
                            subtitle="Requires attention"
                            trend="down"
                            trendValue="-2"
                            color="from-rose-400 to-red-500"
                        />
                        <MetricCard
                            label="Revenue"
                            value={`$${(realTime.revenue / 1000).toFixed(1)}K`}
                            icon={DollarSign}
                            subtitle="This month"
                            trend="up"
                            trendValue="+12.5%"
                            color="from-indigo-400 to-purple-500"
                        />
                    </div>

                    {/* Main Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <AnalyticsCard title="User Growth" icon={Users} action="View All">
                            <LineChartComponent
                                data={chartData.users}
                                labels={chartData.dates}
                                title="Users"
                                color={chartColors.purple}
                            />
                        </AnalyticsCard>
                        <AnalyticsCard title="Revenue Trend" icon={DollarSign} action="View All">
                            <LineChartComponent
                                data={chartData.revenue}
                                labels={chartData.dates}
                                title="Revenue"
                                color={chartColors.green}
                            />
                        </AnalyticsCard>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <AnalyticsCard title="Device Distribution by OS" icon={Smartphone}>
                            <DoughnutChartComponent
                                data={Object.values(deviceAnalytics.byOS)}
                                labels={Object.keys(deviceAnalytics.byOS)}
                                colors={[
                                    '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'
                                ]}
                            />
                        </AnalyticsCard>
                        <AnalyticsCard title="Compliance & Performance" icon={Target}>
                            <RadarChartComponent
                                data={[
                                    securityAnalytics.mdmEnrollment,
                                    securityAnalytics.encryptionRate,
                                    securityAnalytics.passcodeCompliance,
                                    securityAnalytics.osUpdateCompliance,
                                    performanceMetrics.networkPerformance.latency > 100 ? 100 - (performanceMetrics.networkPerformance.latency - 100) / 2 : 100,
                                    100 - performanceMetrics.appPerformance.crashRate * 10
                                ]}
                                labels={['MDM', 'Encryption', 'Passcode', 'OS Updates', 'Network', 'Stability']}
                                colors={[chartColors.purple]}
                            />
                        </AnalyticsCard>
                    </div>
                </>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && userAnalytics && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnalyticsCard title="User Distribution by Role" icon={Users}>
                        <DoughnutChartComponent
                            data={Object.values(userAnalytics.byRole)}
                            labels={Object.keys(userAnalytics.byRole)}
                            colors={['#EF4444', '#F59E0B', '#3B82F6']}
                        />
                    </AnalyticsCard>
                    <AnalyticsCard title="User Retention Rate" icon={Target}>
                        <BarChartComponent
                            data={Object.values(userAnalytics.retention)}
                            labels={Object.keys(userAnalytics.retention)}
                            title="Retention %"
                            color={chartColors.green}
                        />
                    </AnalyticsCard>
                    <AnalyticsCard title="User Engagement" icon={Activity}>
                        <DoughnutChartComponent
                            data={Object.values(userAnalytics.engagement)}
                            labels={Object.keys(userAnalytics.engagement)}
                            colors={['#10B981', '#3B82F6', '#F59E0B', '#EF4444']}
                        />
                    </AnalyticsCard>
                    <AnalyticsCard title="Plan Distribution" icon={Package}>
                        <DoughnutChartComponent
                            data={Object.values(userAnalytics.byPlan)}
                            labels={Object.keys(userAnalytics.byPlan)}
                            colors={['#8B5CF6', '#34D399', '#F59E0B']}
                        />
                    </AnalyticsCard>
                </div>
            )}

            {/* Devices Tab */}
            {activeTab === 'devices' && deviceAnalytics && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnalyticsCard title="Device Types" icon={Smartphone}>
                            <DoughnutChartComponent
                                data={Object.values(deviceAnalytics.byType)}
                                labels={Object.keys(deviceAnalytics.byType)}
                                colors={['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444']}
                            />
                        </AnalyticsCard>
                        <AnalyticsCard title="Battery Health" icon={Battery}>
                            <DoughnutChartComponent
                                data={Object.values(deviceAnalytics.batteryHealth)}
                                labels={Object.keys(deviceAnalytics.batteryHealth)}
                                colors={['#10B981', '#3B82F6', '#F59E0B', '#EF4444']}
                            />
                        </AnalyticsCard>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnalyticsCard title="Storage Usage" icon={HardDrive}>
                            <DoughnutChartComponent
                                data={Object.values(deviceAnalytics.storageUsage)}
                                labels={Object.keys(deviceAnalytics.storageUsage)}
                                colors={['#10B981', '#3B82F6', '#F59E0B', '#EF4444']}
                            />
                        </AnalyticsCard>
                        <AnalyticsCard title="Manufacturer Distribution" icon={Server}>
                            <DoughnutChartComponent
                                data={Object.values(deviceAnalytics.byManufacturer)}
                                labels={Object.keys(deviceAnalytics.byManufacturer)}
                                colors={['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899']}
                            />
                        </AnalyticsCard>
                    </div>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && securityAnalytics && (
                <div className="space-y-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnalyticsCard title="Security Alerts Distribution" icon={AlertTriangle}>
                            <DoughnutChartComponent
                                data={Object.values(securityAnalytics.securityAlerts)}
                                labels={Object.keys(securityAnalytics.securityAlerts)}
                                colors={['#EF4444', '#F59E0B', '#3B82F6', '#10B981']}
                            />
                        </AnalyticsCard>
                        <AnalyticsCard title="Threats by Type" icon={AlertTriangle}>
                            <DoughnutChartComponent
                                data={Object.values(securityAnalytics.threatsByType)}
                                labels={Object.keys(securityAnalytics.threatsByType)}
                                colors={['#EF4444', '#F59E0B', '#8B5CF6', '#3B82F6', '#EC4899']}
                            />
                        </AnalyticsCard>
                    </div>
                </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && performanceMetrics && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <MetricCard
                            label="CPU Usage"
                            value={`${performanceMetrics.systemPerformance.cpuUsage}%`}
                            icon={Cpu}
                            trend="down"
                            trendValue="-2.1%"
                            color="from-violet-400 to-purple-500"
                        />
                        <MetricCard
                            label="Memory Usage"
                            value={`${performanceMetrics.systemPerformance.memoryUsage}%`}
                            icon={Database}
                            trend="up"
                            trendValue="+0.8%"
                            color="from-sky-400 to-blue-500"
                        />
                        <MetricCard
                            label="Network Latency"
                            value={`${performanceMetrics.networkPerformance.latency}ms`}
                            icon={Wifi}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnalyticsCard title="System Performance" icon={Server}>
                            <RadarChartComponent
                                data={[
                                    100 - performanceMetrics.systemPerformance.cpuUsage,
                                    100 - performanceMetrics.systemPerformance.memoryUsage,
                                    100 - performanceMetrics.systemPerformance.diskUsage,
                                    100 - performanceMetrics.systemPerformance.networkUsage
                                ]}
                                labels={['CPU', 'Memory', 'Disk', 'Network']}
                                colors={[chartColors.purple]}
                            />
                        </AnalyticsCard>
                        <AnalyticsCard title="Device Health Status" icon={Heart}>
                            <DoughnutChartComponent
                                data={Object.values(performanceMetrics.deviceHealth)}
                                labels={Object.keys(performanceMetrics.deviceHealth)}
                                colors={['#10B981', '#3B82F6', '#F59E0B', '#EF4444']}
                            />
                        </AnalyticsCard>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-3"
                style={{
                    background: 'rgba(20, 16, 36, 0.8)',
                    border: '1px solid rgba(139,92,246,0.15)',
                }}
            >
                <div className="flex items-center gap-4 text-xs" style={{ color: '#5a4f72' }}>
                    <span>Last updated: {new Date().toLocaleString()}</span>
                    <span className="w-px h-4" style={{ background: 'rgba(139,92,246,0.15)' }} />
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        System Online
                    </span>
                    <span className="hidden sm:flex items-center gap-1">
                        <Cloud size={12} />
                        Real-time sync
                    </span>
                </div>
                <div className="flex items-center gap-4 text-xs" style={{ color: '#5a4f72' }}>
                    <span>Data source: Real-time Analytics</span>
                    <span className="w-px h-4" style={{ background: 'rgba(139,92,246,0.15)' }} />
                    <span>v2.4.1</span>
                </div>
            </div>
        </div>
    );
};

// ── Lock Icon Component ──────────────────────────────────────────────────────
const LockIcon = ({ size, className }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

export default AdminAnalytics;
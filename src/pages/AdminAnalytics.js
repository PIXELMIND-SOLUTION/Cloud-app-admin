// components/AdminAnalytics.js - Light Theme with Saffron Accents
import React, { useState, useEffect } from 'react';
import {
    TrendingUp, TrendingDown, Users, Smartphone, Shield,
    AlertTriangle, Clock, Zap, Server,
    Download, RefreshCw,
    BarChart3, Activity,
    DollarSign, Package, UserCheck, UserX,
    Minus, Target, Award, Battery, HardDrive, Cpu,
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

// ── Utility ──────────────────────────────────────────────────────────────
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

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: '#4a4a4a',
                font: { size: 11 },
                padding: 15,
                usePointStyle: true,
                pointStyle: 'circle'
            }
        }
    },
    scales: {
        x: {
            grid: { color: 'rgba(255,125,56,0.08)', drawBorder: false },
            ticks: { color: '#6b7280', font: { size: 10 } }
        },
        y: {
            grid: { color: 'rgba(255,125,56,0.08)', drawBorder: false },
            ticks: { color: '#6b7280', font: { size: 10 } }
        }
    }
};

// ── Basic Data Service ────────────────────────────────────────────────────
const getBasicData = () => {
    const users = JSON.parse(localStorage.getItem('planUsers') || '[]');
    const plans = JSON.parse(localStorage.getItem('plans') || '[]');
    
    const totalUsers = users.length || 1247;
    const activeUsers = users.filter(u => u.status === 'active').length || 823;
    const totalDevices = users.reduce((acc, u) => acc + (u.deviceCount || u.totalDevices || 0), 0) || 2156;
    
    return {
        totalUsers,
        activeUsers,
        totalDevices,
        totalPlans: plans.length || 24,
        activePlans: plans.filter(p => p.status === 'active').length || 18,
        onlineDevices: Math.floor(totalDevices * 0.72) || 1552,
        revenue: 28400,
        mdmCoverage: 85.4,
        uptime: 99.97
    };
};

const getChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
        users: [1200, 1250, 1300, 1280, 1350, 1400, 1450, 1500, 1550, 1600, 1650, 1700],
        revenue: [18000, 19000, 20000, 21000, 22000, 23000, 24000, 25000, 26000, 27000, 28000, 29000],
        devices: [1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600],
        dates: months
    };
};

// ── Metric Card ──────────────────────────────────────────────────────────
const MetricCard = ({ label, value, icon: Icon, trend, trendValue, color }) => {
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
    const trendColor = trend === 'up' ? '#FF7D38' : trend === 'down' ? '#ef4444' : '#6b7280';

    return (
        <div className="relative overflow-hidden rounded-2xl p-4 transition-all hover:scale-[1.02] hover:shadow-lg bg-white border border-orange-200 shadow-sm">

            {/* Decorative Background */}
            <div className="absolute -top-8 -left-8 w-20 h-20 rounded-full bg-orange-400/10" />
            <div className="absolute -top-4 -left-4 w-28 h-28 rounded-full border border-orange-300/20" />
            <div className="absolute -top-8 -left-8 w-36 h-36 rounded-full border border-orange-300/10" />

            <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-orange-400/10" />

            {/* Content */}
            <div className="relative z-10">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-500">
                            {label}
                        </p>

                        <p className="text-xl font-bold mt-1 text-gray-800">
                            {value}
                        </p>
                    </div>

                    <div
                        className={`w-8 h-8 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 ml-2 shadow-lg`}
                    >
                        <Icon size={14} className="text-white" />
                    </div>
                </div>

                {trend && (
                    <div className="flex items-center gap-1.5 mt-3">
                        <TrendIcon
                            size={12}
                            style={{ color: trendColor }}
                        />

                        <span
                            className="text-xs font-semibold"
                            style={{ color: trendColor }}
                        >
                            {trendValue}
                        </span>

                        <span className="text-[10px] text-gray-500">
                            vs last month
                        </span>
                    </div>
                )}
            </div>

        </div>
    );
};

// ── Chart Components ─────────────────────────────────────────────────────
const LineChartComponent = ({ data, labels, color = '#FF7D38' }) => {
    const chartData = {
        labels,
        datasets: [{
            label: 'Data',
            data,
            borderColor: color,
            backgroundColor: color + '20',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: color,
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 3
        }]
    };
    return <Line data={chartData} options={chartOptions} />;
};

const BarChartComponent = ({ data, labels, color = '#FF7D38' }) => {
    const chartData = {
        labels,
        datasets: [{
            label: 'Data',
            data,
            backgroundColor: color + '60',
            borderColor: color,
            borderWidth: 2,
            borderRadius: 8
        }]
    };
    return <Bar data={chartData} options={chartOptions} />;
};

const DoughnutChartComponent = ({ data, labels, colors }) => {
    const chartData = {
        labels,
        datasets: [{
            data,
            backgroundColor: colors,
            borderColor: '#ffffff',
            borderWidth: 3
        }]
    };
    return <Doughnut data={chartData} options={{ ...chartOptions, cutout: '65%' }} />;
};

const RadarChartComponent = ({ data, labels }) => {
    const chartData = {
        labels,
        datasets: [{
            data,
            backgroundColor: 'rgba(255,125,56,0.2)',
            borderColor: '#FF7D38',
            borderWidth: 2,
            pointBackgroundColor: '#FF7D38',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2
        }]
    };
    return <Radar data={chartData} options={{ ...chartOptions, scales: { r: { max: 100 } } }} />;
};

// ── Main Component ──────────────────────────────────────────────────────
const AdminAnalytics = () => {
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'devices', label: 'Devices', icon: Smartphone }
    ];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setStats(getBasicData());
            setChartData(getChartData());
            setLoading(false);
        }, 300);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-400 border-t-transparent mx-auto" />
                    <p className="mt-4 text-sm text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 bg-gray-50 min-h-screen p-4 rounded-2xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-orange-200 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Analytics Dashboard</h1>
                    <p className="text-sm mt-0.5 text-gray-500">Overview of users, devices, and system metrics</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { setLoading(true); setTimeout(() => { setStats(getBasicData()); setLoading(false); }, 300); }}
                        className="p-2 rounded-xl transition-colors bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-100"
                    >
                        <RefreshCw size={16} />
                    </button>
                    <button
                        className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-xl transition-all bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-orange-500/30 shadow-sm"
                    >
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1 rounded-2xl p-1 bg-white border border-orange-200 shadow-sm">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                            activeTab === tab.id 
                                ? 'text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-md' 
                                : 'text-gray-600 hover:bg-orange-50'
                        }`}
                    >
                        <tab.icon size={16} />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && stats && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <MetricCard
                            label="Total Users"
                            value={stats.totalUsers}
                            icon={Users}
                            trend="up"
                            trendValue="+12%"
                            color="from-amber-400 to-orange-500"
                        />
                        <MetricCard
                            label="Total Devices"
                            value={stats.totalDevices}
                            icon={Smartphone}
                            trend="up"
                            trendValue="+18%"
                            color="from-orange-400 to-amber-500"
                        />
                        <MetricCard
                            label="Active Users"
                            value={stats.activeUsers}
                            icon={UserCheck}
                            trend="up"
                            trendValue="+8%"
                            color="from-amber-400 to-yellow-500"
                        />
                        <MetricCard
                            label="Total Plans"
                            value={stats.totalPlans}
                            icon={Package}
                            trend="up"
                            trendValue="+4"
                            color="from-orange-400 to-amber-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Panel>
                            <h3 className="text-sm font-semibold mb-4 text-gray-800">User Growth</h3>
                            <div className="h-[300px]">
                                <LineChartComponent data={chartData.users} labels={chartData.dates} />
                            </div>
                        </Panel>
                        <Panel>
                            <h3 className="text-sm font-semibold mb-4 text-gray-800">Revenue Trend</h3>
                            <div className="h-[300px]">
                                <LineChartComponent data={chartData.revenue} labels={chartData.dates} color="#F59E0B" />
                            </div>
                        </Panel>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Panel>
                            <h3 className="text-sm font-semibold mb-4 text-gray-800">Device Distribution</h3>
                            <div className="h-[280px]">
                                <DoughnutChartComponent
                                    data={[35, 30, 20, 15]}
                                    labels={['Mobile', 'Laptop', 'Tablet', 'Desktop']}
                                    colors={['#FF7D38', '#F59E0B', '#34D399', '#3B82F6']}
                                />
                            </div>
                        </Panel>
                        <Panel>
                            <h3 className="text-sm font-semibold mb-4 text-gray-800">System Performance</h3>
                            <div className="h-[280px]">
                                <RadarChartComponent
                                    data={[85, 78, 92, 70, 88]}
                                    labels={['Uptime', 'MDM', 'Security', 'Performance', 'Compliance']}
                                />
                            </div>
                        </Panel>
                    </div>
                </>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Panel>
                        <h3 className="text-sm font-semibold mb-4 text-gray-800">User Roles</h3>
                        <div className="h-[280px]">
                            <DoughnutChartComponent
                                data={[15, 25, 60]}
                                labels={['Admin', 'Sub Admin', 'User']}
                                colors={['#FF7D38', '#F59E0B', '#34D399']}
                            />
                        </div>
                    </Panel>
                    <Panel>
                        <h3 className="text-sm font-semibold mb-4 text-gray-800">User Retention</h3>
                        <div className="h-[250px]">
                            <BarChartComponent
                                data={[92, 87, 81, 73, 65]}
                                labels={['30d', '60d', '90d', '180d', '365d']}
                            />
                        </div>
                    </Panel>
                    <Panel>
                        <h3 className="text-sm font-semibold mb-4 text-gray-800">Plan Distribution</h3>
                        <div className="h-[280px]">
                            <DoughnutChartComponent
                                data={[30, 45, 25]}
                                labels={['Basic', 'Professional', 'Business']}
                                colors={['#34D399', '#FF7D38', '#F59E0B']}
                            />
                        </div>
                    </Panel>
                    <Panel>
                        <h3 className="text-sm font-semibold mb-4 text-gray-800">User Engagement</h3>
                        <div className="h-[280px]">
                            <DoughnutChartComponent
                                data={[60, 25, 10, 5]}
                                labels={['Daily', 'Weekly', 'Monthly', 'Rarely']}
                                colors={['#FF7D38', '#F59E0B', '#34D399', '#94a3b8']}
                            />
                        </div>
                    </Panel>
                </div>
            )}

            {/* Devices Tab */}
            {activeTab === 'devices' && stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Panel>
                        <h3 className="text-sm font-semibold mb-4 text-gray-800">Device OS</h3>
                        <div className="h-[280px]">
                            <DoughnutChartComponent
                                data={[35, 28, 20, 12, 5]}
                                labels={['iOS', 'Android', 'Windows', 'macOS', 'Linux']}
                                colors={['#FF7D38', '#34D399', '#3B82F6', '#F59E0B', '#EF4444']}
                            />
                        </div>
                    </Panel>
                    <Panel>
                        <h3 className="text-sm font-semibold mb-4 text-gray-800">Battery Health</h3>
                        <div className="h-[280px]">
                            <DoughnutChartComponent
                                data={[40, 35, 15, 10]}
                                labels={['Excellent', 'Good', 'Fair', 'Poor']}
                                colors={['#34D399', '#FF7D38', '#F59E0B', '#EF4444']}
                            />
                        </div>
                    </Panel>
                    <Panel>
                        <h3 className="text-sm font-semibold mb-4 text-gray-800">Storage Usage</h3>
                        <div className="h-[280px]">
                            <DoughnutChartComponent
                                data={[25, 40, 25, 10]}
                                labels={['Under 50%', '50-75%', '75-90%', 'Over 90%']}
                                colors={['#34D399', '#FF7D38', '#F59E0B', '#EF4444']}
                            />
                        </div>
                    </Panel>
                    <Panel>
                        <h3 className="text-sm font-semibold mb-4 text-gray-800">Manufacturers</h3>
                        <div className="h-[280px]">
                            <DoughnutChartComponent
                                data={[30, 20, 15, 12, 10, 8, 5]}
                                labels={['Apple', 'Samsung', 'Dell', 'HP', 'Lenovo', 'Google', 'Other']}
                                colors={['#FF7D38', '#34D399', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6', '#94a3b8']}
                            />
                        </div>
                    </Panel>
                </div>
            )}

            {/* Footer */}
            <div className="rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-3 bg-white border border-orange-200 shadow-sm">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Last updated: {new Date().toLocaleString()}</span>
                    <span className="w-px h-4 bg-orange-200" />
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                        System Online
                    </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>v2.4.1</span>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
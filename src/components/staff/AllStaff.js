// pages/AllStaff.js - Staff Management with Actions & Permissions Display (Light Theme)
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, Search, Eye, Edit, Trash2, UserPlus,
    Mail, Phone, Shield, UserCog, UserCheck,
    ChevronLeft, ChevronRight,
    RefreshCw, Building, LayoutDashboard, BarChart2,
    LineChart, MailWarning, Settings, Download
} from 'lucide-react';

const Panel = ({ children, className = "" }) => (
    <div
        className={`rounded-2xl p-4 sm:p-5 transition-all bg-white ${className}`}
        style={{
            border: '1px solid rgba(255,125,56,0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}
    >
        {children}
    </div>
);

// ── Staff Service ──────────────────────────────────────────────────────────
const StaffService = {
    getAll: () => {
        const stored = localStorage.getItem('staff');
        if (stored) return JSON.parse(stored);
        const defaultStaff = [
            { 
                id: 1, name: "Raj Kumar", email: "raj.kumar@mdm.io", role: "Super Admin", 
                department: "IT", phone: "+91 9876543210", status: "active", 
                joined: "2024-01-15", avatar: "RK",
                permissions: [
                    { componentId: 'users', actions: ['view', 'edit', 'delete', 'export'] },
                    { componentId: 'plans', actions: ['view', 'edit', 'delete', 'export'] },
                    { componentId: 'notifications', actions: ['view', 'edit', 'delete', 'export'] },
                    { componentId: 'staff', actions: ['view', 'edit', 'delete', 'export'] },
                    { componentId: 'settings', actions: ['view', 'edit', 'delete', 'export'] },
                ]
            },
            { 
                id: 2, name: "Priya Sharma", email: "priya.sharma@mdm.io", role: "Staff Admin", 
                department: "Operations", phone: "+91 9876543211", status: "active", 
                joined: "2024-02-01", avatar: "PS",
                permissions: [
                    { componentId: 'users', actions: ['view', 'edit'] },
                    { componentId: 'plans', actions: ['view'] },
                ]
            },
            { 
                id: 3, name: "Amit Patel", email: "amit.patel@mdm.io", role: "Staff Admin", 
                department: "Support", phone: "+91 9876543212", status: "inactive", 
                joined: "2024-01-20", avatar: "AP",
                permissions: [{ componentId: 'users', actions: ['view'] }]
            },
            { 
                id: 4, name: "Sneha Reddy", email: "sneha.reddy@mdm.io", role: "Staff", 
                department: "Sales", phone: "+91 9876543213", status: "active", 
                joined: "2024-02-15", avatar: "SR",
                permissions: [{ componentId: 'users', actions: ['view'] }]
            },
            { 
                id: 5, name: "Vikram Singh", email: "vikram.singh@mdm.io", role: "Staff Admin", 
                department: "IT", phone: "+91 9876543214", status: "active", 
                joined: "2024-01-10", avatar: "VS",
                permissions: [
                    { componentId: 'users', actions: ['view', 'edit', 'export'] },
                    { componentId: 'users', actions: ['view'] },
                    { componentId: 'reports', actions: ['view', 'edit', 'export'] },
                ]
            },
        ];
        localStorage.setItem('staff', JSON.stringify(defaultStaff));
        return defaultStaff;
    },
    delete: (id) => {
        const staff = StaffService.getAll();
        const filtered = staff.filter(s => s.id !== id);
        localStorage.setItem('staff', JSON.stringify(filtered));
        return filtered;
    },
    update: (id, updates) => {
        const staff = StaffService.getAll();
        const index = staff.findIndex(s => s.id === id);
        if (index === -1) throw new Error('Staff not found');
        staff[index] = { ...staff[index], ...updates };
        localStorage.setItem('staff', JSON.stringify(staff));
        return staff[index];
    }
};

const ITEMS_PER_PAGE = 5;

export const AllStaff = () => {
    const navigate = useNavigate();
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    const loadStaff = () => {
        setLoading(true);
        setTimeout(() => {
            const data = StaffService.getAll();
            setStaff(data);
            setLoading(false);
        }, 300);
    };

    useEffect(() => { loadStaff(); }, []);

    const handleView = (id) => navigate(`/admin/staff/${id}`);
    const handleEdit = (id) => navigate(`/admin/staff/add/${id}`);
    const handleAdd = () => navigate('/admin/staff/add');

    const handleDelete = (id) => {
        if (!window.confirm('Are you sure you want to delete this staff member?')) return;
        const remaining = StaffService.delete(id);
        setStaff(remaining);
    };

    const handleToggleStatus = (id) => {
        const member = staff.find(s => s.id === id);
        if (!member) return;
        const newStatus = member.status === 'active' ? 'inactive' : 'active';
        const updated = StaffService.update(id, { status: newStatus });
        setStaff(prev => prev.map(s => s.id === updated.id ? updated : s));
    };

    const filtered = useMemo(() => {
        return staff.filter(s => {
            const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                s.email.toLowerCase().includes(search.toLowerCase()) ||
                s.department.toLowerCase().includes(search.toLowerCase());
            const matchRole = filterRole === 'All' || s.role === filterRole;
            const matchStatus = filterStatus === 'All' || s.status === filterStatus;
            return matchSearch && matchRole && matchStatus;
        });
    }, [staff, search, filterRole, filterStatus]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const roles = ['All', ...new Set(staff.map(s => s.role))];
    const statuses = ['All', 'active', 'inactive'];

    // ── Component Permission Display ─────────────────────────────────────
    const ComponentPermissionBadge = ({ permissions }) => {
        const componentMap = {
            dashboard: { label: 'Dashboard', color: '#FF7D38' },
            users: { label: 'Users', color: '#3b82f6' },
            plans: { label: 'Plans', color: '#34d399' },
            analytics: { label: 'Analytics', color: '#a78bfa' },
            reports: { label: 'Reports', color: '#f59e0b' },
            staff: { label: 'Staff', color: '#ec4899' },
            notifications: { label: 'Notif.', color: '#8b5cf6' },
            settings: { label: 'Settings', color: '#6366f1' }
        };

        const getActions = (actions) => {
            const icons = [];
            if (actions.includes('view')) icons.push('V');
            if (actions.includes('edit')) icons.push('E');
            if (actions.includes('delete')) icons.push('D');
            if (actions.includes('export')) icons.push('X');
            return icons.join('');
        };

        return (
            <div className="flex flex-wrap gap-1">
                {permissions.map((perm, idx) => {
                    const comp = componentMap[perm.componentId];
                    if (!comp) return null;
                    return (
                        <span key={idx} 
                            className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-orange-50 border border-orange-200"
                            style={{ color: comp.color }}
                            title={`${comp.label}: ${getActions(perm.actions)}`}
                        >
                            {comp.label} [{getActions(perm.actions)}]
                        </span>
                    );
                })}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-2xl">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-400 border-t-transparent mx-auto" />
                    <p className="mt-4 text-sm text-gray-500">Loading staff...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 bg-gray-50 min-h-screen p-4 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-orange-200 shadow-sm">
                <div>
                    <h1 className="text-lg sm:text-xl font-bold text-gray-800">Staff Management</h1>
                    <p className="text-xs sm:text-sm mt-0.5 text-gray-500">Manage staff members and their component permissions</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={loadStaff} className="p-2 rounded-xl transition-colors bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-100">
                        <RefreshCw size={16} />
                    </button>
                    <button onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-xl transition-all bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-orange-500/30 shadow-sm">
                        <UserPlus size={16} /> Add Staff
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {[
                    { label: 'Total Staff', value: staff.length, icon: Users, color: '#FF7D38' },
                    { label: 'Active', value: staff.filter(s => s.status === 'active').length, icon: UserCheck, color: '#34d399' },
                    { label: 'Inactive', value: staff.filter(s => s.status === 'inactive').length, icon: UserCog, color: '#94a3b8' },
                    { label: 'Super Admin', value: staff.filter(s => s.role === 'Super Admin').length, icon: Shield, color: '#a78bfa' },
                ].map(stat => (
                    <div key={stat.label} className="rounded-2xl p-3 sm:p-4 text-center bg-white border border-orange-200 shadow-sm">
                        <stat.icon size={16} className="mx-auto mb-1" style={{ color: stat.color }} />
                        <p className="text-lg sm:text-xl font-bold text-orange-500">{stat.value}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <Panel className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search staff..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all bg-white border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200" />
                    </div>
                    <select value={filterRole} onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1); }}
                        className="px-3.5 py-2.5 text-sm rounded-xl transition-all bg-white border border-orange-200 text-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-200">
                        {roles.map(r => <option key={r} value={r} className="bg-white">{r}</option>)}
                    </select>
                    <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                        className="px-3.5 py-2.5 text-sm rounded-xl transition-all bg-white border border-orange-200 text-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-200">
                        {statuses.map(s => <option key={s} value={s} className="bg-white">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                </div>
            </Panel>

            {/* Staff Table */}
            <Panel className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-orange-200 bg-orange-50">
                                <th className="text-left text-xs font-semibold px-5 py-3.5 text-gray-600">Staff</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5 text-gray-600">Role</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5 text-gray-600">Department</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5 text-gray-600">Permissions</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5 text-gray-600">Status</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5 text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-orange-100">
                            {paginated.map((member) => (
                                <tr key={member.id} className="hover:bg-orange-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md`}>
                                                {member.avatar}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">{member.name}</p>
                                                <p className="text-xs text-gray-500">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-50 text-orange-500 border border-orange-200">
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-600">{member.department}</td>
                                    <td className="px-4 py-4">
                                        <ComponentPermissionBadge permissions={member.permissions || []} />
                                    </td>
                                    <td className="px-4 py-4">
                                        <button onClick={() => handleToggleStatus(member.id)}
                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${member.status === 'active' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                                            {member.status}
                                        </button>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <button onClick={() => handleView(member.id)}
                                                className="p-1.5 rounded-lg transition-colors text-blue-500 hover:bg-blue-50"
                                                title="View Staff">
                                                <Eye size={16} />
                                            </button>
                                            <button onClick={() => handleEdit(member.id)}
                                                className="p-1.5 rounded-lg transition-colors text-orange-500 hover:bg-orange-50"
                                                title="Edit Staff">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(member.id)}
                                                className="p-1.5 rounded-lg transition-colors text-red-500 hover:bg-red-50"
                                                title="Delete Staff">
                                                <Trash2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    // Export action - you can implement export functionality here
                                                    alert(`Exporting data for ${member.name}`);
                                                }}
                                                className="p-1.5 rounded-lg transition-colors text-green-500 hover:bg-green-50"
                                                title="Export Data">
                                                <Download size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-5 py-3 border-t border-orange-200 flex flex-wrap items-center justify-between gap-2 bg-orange-50">
                    <p className="text-xs text-gray-600">
                        Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                    </p>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30 text-gray-400 hover:bg-orange-50">
                            <ChevronLeft size={15} />
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button key={i} onClick={() => setCurrentPage(i + 1)}
                                className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
                                style={currentPage === i + 1 ? { background: 'linear-gradient(135deg, #FF7D38, #FF6B1A)', color: '#fff' } : { color: '#4a4a4a' }}>
                                {i + 1}
                            </button>
                        ))}
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30 text-gray-400 hover:bg-orange-50">
                            <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            </Panel>
        </div>
    );
};

export default AllStaff;
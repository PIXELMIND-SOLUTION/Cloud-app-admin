// pages/ViewStaff.js - View Staff Details with Actions (Light Theme)
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, User, Mail, Phone, Shield,
    Building, UserCog, Calendar,
    Edit, Trash2, LayoutDashboard, Users, BarChart2,
    LineChart, MailWarning, Settings, Download,
    IdCard
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
        return [];
    },
    getById: (id) => {
        const staff = StaffService.getAll();
        return staff.find(s => s.id === parseInt(id));
    },
    delete: (id) => {
        const staff = StaffService.getAll();
        const filtered = staff.filter(s => s.id !== id);
        localStorage.setItem('staff', JSON.stringify(filtered));
        return filtered;
    }
};

// ── Component Map for Display ──────────────────────────────────────────────
const COMPONENT_MAP = {
    users: { label: 'Registered Users', icon: Users, color: '#3b82f6' },
    plans: { label: 'Plans', icon: BarChart2, color: '#34d399' },
    analytics: { label: 'Analytics', icon: LineChart, color: '#a78bfa' },
    reports: { label: 'Reports', icon: MailWarning, color: '#f59e0b' },
    staff: { label: 'Staff Management', icon: UserCog, color: '#ec4899' },
    notifications: { label: 'Notifications', icon: MailWarning, color: '#8b5cf6' },
    settings: { label: 'Settings', icon: Settings, color: '#6366f1' }
};

export const SingleStaff = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showPassword, setShowPassword] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");

    const handleShowPassword = () => {
        if (passwordInput === "0000") {
            setShowPassword(true);
        } else {
            alert("Incorrect security password");
            setShowPassword(false);
        }
    };

    useEffect(() => {
        const data = StaffService.getById(id);
        if (data) {
            setStaff(data);
        }
        setLoading(false);
    }, [id]);

    const handleEdit = () => navigate(`/admin/staff/add/${id}`);
    const handleBack = () => navigate('/admin/staff');

    const handleDelete = () => {
        if (!window.confirm('Are you sure you want to delete this staff member?')) return;
        StaffService.delete(id);
        navigate('/admin/staff');
    };

    const handleExport = () => {
        alert(`Exporting data for ${staff?.name}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-2xl">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-400 border-t-transparent mx-auto" />
                    <p className="mt-4 text-sm text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!staff) {
        return (
            <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-2xl">
                <div className="text-center">
                    <User size={48} className="mx-auto mb-3 opacity-30 text-gray-400" />
                    <h2 className="text-xl font-bold text-gray-800">Staff Not Found</h2>
                    <button onClick={handleBack}
                        className="mt-4 px-4 py-2 rounded-xl transition-all text-sm bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-100">
                        Back to Staff
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 bg-gray-50 min-h-screen p-4 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-orange-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={handleBack}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-100">
                        <ArrowLeft size={16} /> Back
                    </button>
                    <h1 className="text-lg sm:text-xl font-bold text-gray-800">Staff Details</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleEdit}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-100">
                        <Edit size={16} /> Edit
                    </button>
                    <button onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all bg-red-50 text-red-500 border border-red-200 hover:bg-red-100">
                        <Trash2 size={16} /> Delete
                    </button>
                    <button onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all bg-green-50 text-green-500 border border-green-200 hover:bg-green-100">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Profile Card */}
                <Panel className="lg:col-span-1">
                    <div className="text-center">
                        <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-md`}>
                            {staff.avatar}
                        </div>
                        <h2 className="text-xl font-bold mt-3 text-gray-800">{staff.name}</h2>
                        <p className="text-sm text-gray-500">{staff.role}</p>
                        <div className="mt-3 flex justify-center">
                            <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${staff.status === 'active' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${staff.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                                {staff.status}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-orange-200">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <IdCard size={16} className="text-gray-400" />
                                <span className="text-gray-700">Id: {staff.id}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Mail size={16} className="text-gray-400" />
                                <span className="text-gray-700">{staff.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone size={16} className="text-gray-400" />
                                <span className="text-gray-700">{staff.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Building size={16} className="text-gray-400" />
                                <span className="text-gray-700">{staff.department}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar size={16} className="text-gray-400" />
                                <span className="text-gray-700">Joined: {staff.joined}</span>
                            </div>
                        </div>
                    </div>
                </Panel>

                {/* Details Card */}
                <Panel className="lg:col-span-2">
                    <h3 className="text-sm font-semibold mb-4 text-gray-800">Staff Information</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
                            <p className="text-xs text-gray-500">Full Name</p>
                            <p className="text-sm font-semibold mt-0.5 text-gray-800">{staff.name}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-semibold mt-0.5 text-gray-800">{staff.email}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
                            <p className="text-xs text-gray-500">Role</p>
                            <p className="text-sm font-semibold mt-0.5 text-gray-800">{staff.role}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
                            <p className="text-xs text-gray-500">Department</p>
                            <p className="text-sm font-semibold mt-0.5 text-gray-800">{staff.department}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-sm font-semibold mt-0.5 text-gray-800">{staff.phone}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
                            <p className="text-xs text-gray-500">Joined</p>
                            <p className="text-sm font-semibold mt-0.5 text-gray-800">{staff.joined}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
                            <p className="text-xs text-gray-500 mb-2">Password</p>

                            <p className="text-sm font-semibold text-gray-800 mb-3">
                                {showPassword ? staff.password : "********"}
                            </p>

                            {!showPassword && (
                                <div className="flex gap-2">
                                    <input
                                        type="password"
                                        placeholder="Security Password"
                                        value={passwordInput}
                                        onChange={(e) => setPasswordInput(e.target.value)}
                                        className="flex-1 px-3 py-2 text-sm border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    />

                                    <button
                                        onClick={handleShowPassword}
                                        className="px-3 py-2 rounded-lg bg-orange-500 text-white text-sm hover:bg-orange-600"
                                    >
                                        Show
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Component Permissions */}
                    <div className="mt-4 pt-4 border-t border-orange-200">
                        <h4 className="text-sm font-semibold mb-3 text-gray-800">Component Permissions</h4>
                        <div className="space-y-2">
                            {staff.permissions && staff.permissions.map((perm, idx) => {
                                const comp = COMPONENT_MAP[perm.componentId];
                                if (!comp) return null;
                                const Icon = comp.icon;
                                const hasView = perm.actions.includes('view');
                                const hasEdit = perm.actions.includes('edit');
                                const hasDelete = perm.actions.includes('delete');
                                const hasExport = perm.actions.includes('export');

                                return (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-orange-50 border border-orange-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white">
                                                <Icon size={16} style={{ color: comp.color }} />
                                            </div>
                                            <span className="text-sm text-gray-800">{comp.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {hasView && <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-500 border border-blue-200">View</span>}
                                            {hasEdit && <span className="text-[10px] px-2 py-0.5 rounded bg-orange-50 text-orange-500 border border-orange-200">Edit</span>}
                                            {hasDelete && <span className="text-[10px] px-2 py-0.5 rounded bg-red-50 text-red-500 border border-red-200">Delete</span>}
                                            {hasExport && <span className="text-[10px] px-2 py-0.5 rounded bg-green-50 text-green-500 border border-green-200">Export</span>}
                                            {!hasView && !hasEdit && !hasDelete && !hasExport && (
                                                <span className="text-[10px] px-2 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-200">No Access</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {(!staff.permissions || staff.permissions.length === 0) && (
                                <div className="text-center py-4 text-gray-500">
                                    <p className="text-sm">No permissions assigned</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default SingleStaff;
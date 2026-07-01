// pages/ViewStaff.js - View Staff Details with Actions
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, User, Mail, Phone, Shield,
    Building, UserCog, Calendar,
    Edit, Trash2, LayoutDashboard, Users, BarChart2,
    LineChart, MailWarning, Settings
} from 'lucide-react';

const Panel = ({ children, className = "" }) => (
    <div
        className={`rounded-2xl p-4 sm:p-5 transition-all ${className}`}
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
    dashboard: { label: 'Dashboard', icon: LayoutDashboard, color: '#FF7D38' },
    users: { label: 'Registered Users', icon: Users, color: '#3b82f6' },
    plans: { label: 'Plans', icon: BarChart2, color: '#34d399' },
    analytics: { label: 'Analytics', icon: LineChart, color: '#a78bfa' },
    reports: { label: 'Reports', icon: MailWarning, color: '#f59e0b' },
    staff: { label: 'Staff Management', icon: UserCog, color: '#ec4899' },
    settings: { label: 'Settings', icon: Settings, color: '#6366f1' }
};

export const SingleStaff = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-400 border-t-transparent mx-auto" />
                    <p className="mt-4 text-sm" style={{ color: '#FF9A5F' }}>Loading...</p>
                </div>
            </div>
        );
    }

    if (!staff) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <User size={48} className="mx-auto mb-3 opacity-30" style={{ color: '#FF9A5F' }} />
                    <h2 className="text-xl font-bold" style={{ color: '#FF7D38' }}>Staff Not Found</h2>
                    <button onClick={handleBack}
                        className="mt-4 px-4 py-2 rounded-xl transition-all text-sm"
                        style={{ color: '#FF7D38', border: '1px solid rgba(255,125,56,0.2)' }}>
                        Back to Staff
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={handleBack}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm"
                        style={{ color: '#FF7D38', border: '1px solid rgba(255,125,56,0.2)' }}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    <h1 className="text-lg sm:text-xl font-bold" style={{ color: '#FF7D38' }}>Staff Details</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleEdit}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all"
                        style={{ color: '#FF7D38', border: '1px solid rgba(255,125,56,0.2)' }}>
                        <Edit size={16} /> Edit
                    </button>
                    <button onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all"
                        style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                        <Trash2 size={16} /> Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Profile Card */}
                <Panel className="lg:col-span-1">
                    <div className="text-center">
                        <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg`}>
                            {staff.avatar}
                        </div>
                        <h2 className="text-xl font-bold mt-3" style={{ color: '#FF7D38' }}>{staff.name}</h2>
                        <p className="text-sm" style={{ color: '#FF9A5F' }}>{staff.role}</p>
                        <div className="mt-3 flex justify-center">
                            <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full`}
                                style={staff.status === 'active' ? { background: 'rgba(52,211,153,0.12)', color: '#34d399' } : { background: 'rgba(100,116,139,0.08)', color: '#94a3b8' }}>
                                <span className={`w-1.5 h-1.5 rounded-full ${staff.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                                {staff.status}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,125,56,0.1)' }}>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail size={16} style={{ color: '#FF9A5F' }} />
                                <span style={{ color: '#FF7D38' }}>{staff.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone size={16} style={{ color: '#FF9A5F' }} />
                                <span style={{ color: '#FF7D38' }}>{staff.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Building size={16} style={{ color: '#FF9A5F' }} />
                                <span style={{ color: '#FF7D38' }}>{staff.department}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar size={16} style={{ color: '#FF9A5F' }} />
                                <span style={{ color: '#FF7D38' }}>Joined: {staff.joined}</span>
                            </div>
                        </div>
                    </div>
                </Panel>

                {/* Details Card */}
                <Panel className="lg:col-span-2">
                    <h3 className="text-sm font-semibold mb-4" style={{ color: '#FF7D38' }}>Staff Information</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(255,125,56,0.06)' }}>
                            <p className="text-xs" style={{ color: '#FF9A5F' }}>Full Name</p>
                            <p className="text-sm font-semibold mt-0.5" style={{ color: '#FF7D38' }}>{staff.name}</p>
                        </div>
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(255,125,56,0.06)' }}>
                            <p className="text-xs" style={{ color: '#FF9A5F' }}>Email</p>
                            <p className="text-sm font-semibold mt-0.5" style={{ color: '#FF7D38' }}>{staff.email}</p>
                        </div>
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(255,125,56,0.06)' }}>
                            <p className="text-xs" style={{ color: '#FF9A5F' }}>Role</p>
                            <p className="text-sm font-semibold mt-0.5" style={{ color: '#FF7D38' }}>{staff.role}</p>
                        </div>
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(255,125,56,0.06)' }}>
                            <p className="text-xs" style={{ color: '#FF9A5F' }}>Department</p>
                            <p className="text-sm font-semibold mt-0.5" style={{ color: '#FF7D38' }}>{staff.department}</p>
                        </div>
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(255,125,56,0.06)' }}>
                            <p className="text-xs" style={{ color: '#FF9A5F' }}>Phone</p>
                            <p className="text-sm font-semibold mt-0.5" style={{ color: '#FF7D38' }}>{staff.phone}</p>
                        </div>
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(255,125,56,0.06)' }}>
                            <p className="text-xs" style={{ color: '#FF9A5F' }}>Joined</p>
                            <p className="text-sm font-semibold mt-0.5" style={{ color: '#FF7D38' }}>{staff.joined}</p>
                        </div>
                    </div>

                    {/* Component Permissions */}
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,125,56,0.1)' }}>
                        <h4 className="text-sm font-semibold mb-3" style={{ color: '#FF7D38' }}>Component Permissions</h4>
                        <div className="space-y-2">
                            {staff.permissions && staff.permissions.map((perm, idx) => {
                                const comp = COMPONENT_MAP[perm.componentId];
                                if (!comp) return null;
                                const Icon = comp.icon;
                                const hasView = perm.actions.includes('view');
                                const hasEdit = perm.actions.includes('edit');
                                const hasDelete = perm.actions.includes('delete');
                                
                                return (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl" 
                                        style={{ background: 'rgba(255,125,56,0.06)', border: '1px solid rgba(255,125,56,0.08)' }}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,125,56,0.08)' }}>
                                                <Icon size={16} style={{ color: comp.color }} />
                                            </div>
                                            <span className="text-sm" style={{ color: '#FF7D38' }}>{comp.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {hasView && <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>View</span>}
                                            {hasEdit && <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(255,125,56,0.12)', color: '#FF7D38' }}>Edit</span>}
                                            {hasDelete && <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>Delete</span>}
                                            {!hasView && !hasEdit && !hasDelete && (
                                                <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(100,116,139,0.08)', color: '#94a3b8' }}>No Access</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {(!staff.permissions || staff.permissions.length === 0) && (
                                <div className="text-center py-4" style={{ color: '#FF9A5F' }}>
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
// pages/AddEditStaff.js - Add/Edit Staff with Component Permission Selection
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, Save, User, Mail, Phone, Shield,
    Building, UserCog, Check, X,
    Eye, EyeOff, Lock, Trash2,
    LayoutDashboard, Users, BarChart2, LineChart, MailWarning,
    UserCog as UserCogIcon, Settings, ChevronDown, ChevronUp
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

// ── Available Components with Permissions ──────────────────────────────────
const COMPONENTS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'users', label: 'Registered Users', icon: Users, path: '/admin/users' },
    { id: 'plans', label: 'Plans', icon: BarChart2, path: '/admin/plans' },
    { id: 'analytics', label: 'Analytics', icon: LineChart, path: '/admin/analytics' },
    { id: 'reports', label: 'Reports', icon: MailWarning, path: '/admin/reports' },
    { id: 'staff', label: 'Staff Management', icon: UserCogIcon, path: '/admin/staff' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
];

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
    create: (data) => {
        const staff = StaffService.getAll();
        const newStaff = {
            ...data,
            id: Date.now(),
            avatar: data.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
            joined: new Date().toISOString().split('T')[0]
        };
        staff.unshift(newStaff);
        localStorage.setItem('staff', JSON.stringify(staff));
        return newStaff;
    },
    update: (id, data) => {
        const staff = StaffService.getAll();
        const index = staff.findIndex(s => s.id === parseInt(id));
        if (index === -1) throw new Error('Staff not found');
        staff[index] = { ...staff[index], ...data };
        localStorage.setItem('staff', JSON.stringify(staff));
        return staff[index];
    },
    delete: (id) => {
        const staff = StaffService.getAll();
        const filtered = staff.filter(s => s.id !== parseInt(id));
        localStorage.setItem('staff', JSON.stringify(filtered));
        return filtered;
    }
};

// ── Permission Selector Component ──────────────────────────────────────
const PermissionSelector = ({ component, permissions, onToggle, onSelectAll, onClearAll }) => {
    const [expanded, setExpanded] = useState(true);
    const hasView = permissions.includes('view');
    const hasEdit = permissions.includes('edit');
    const hasDelete = permissions.includes('delete');
    const hasAll = hasView && hasEdit && hasDelete;
    const hasSome = hasView || hasEdit || hasDelete;

    return (
        <div className="rounded-xl overflow-hidden" style={{ 
            background: 'rgba(255,125,56,0.04)',
            border: '1px solid rgba(255,125,56,0.08)'
        }}>
            {/* Header */}
            <div 
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-orange-500/5 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,125,56,0.1)' }}>
                        <component.icon size={16} style={{ color: '#FF7D38' }} />
                    </div>
                    <div>
                        <span className="text-sm font-medium" style={{ color: '#FF7D38' }}>{component.label}</span>
                        <p className="text-[10px]" style={{ color: '#FF9A5F' }}>{component.path}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {hasAll && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>
                            Full Access
                        </span>
                    )}
                    {hasSome && !hasAll && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,125,56,0.12)', color: '#FF7D38' }}>
                            Partial
                        </span>
                    )}
                    {!hasSome && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(100,116,139,0.08)', color: '#94a3b8' }}>
                            No Access
                        </span>
                    )}
                    {expanded ? <ChevronUp size={16} style={{ color: '#FF9A5F' }} /> : <ChevronDown size={16} style={{ color: '#FF9A5F' }} />}
                </div>
            </div>

            {/* Body - Permissions */}
            {expanded && (
                <div className="p-3 pt-0 border-t" style={{ borderColor: 'rgba(255,125,56,0.06)' }}>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        <button
                            type="button"
                            onClick={() => onToggle(component.id, 'view')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all`}
                            style={{
                                background: hasView ? 'rgba(59,130,246,0.15)' : 'rgba(255,125,56,0.05)',
                                border: hasView ? '1px solid #3b82f6' : '1px solid rgba(255,125,56,0.1)',
                                color: hasView ? '#3b82f6' : '#FF9A5F'
                            }}
                        >
                            {hasView ? <Check size={12} /> : <X size={12} />}
                            View
                        </button>

                        <button
                            type="button"
                            onClick={() => onToggle(component.id, 'edit')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all`}
                            style={{
                                background: hasEdit ? 'rgba(255,125,56,0.15)' : 'rgba(255,125,56,0.05)',
                                border: hasEdit ? '1px solid #FF7D38' : '1px solid rgba(255,125,56,0.1)',
                                color: hasEdit ? '#FF7D38' : '#FF9A5F'
                            }}
                        >
                            {hasEdit ? <Check size={12} /> : <X size={12} />}
                            Edit
                        </button>

                        <button
                            type="button"
                            onClick={() => onToggle(component.id, 'delete')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all`}
                            style={{
                                background: hasDelete ? 'rgba(239,68,68,0.15)' : 'rgba(255,125,56,0.05)',
                                border: hasDelete ? '1px solid #ef4444' : '1px solid rgba(255,125,56,0.1)',
                                color: hasDelete ? '#ef4444' : '#FF9A5F'
                            }}
                        >
                            {hasDelete ? <Check size={12} /> : <X size={12} />}
                            Delete
                        </button>

                        <div className="flex-1" />

                        <button
                            type="button"
                            onClick={() => onSelectAll(component.id)}
                            className="text-[10px] px-2 py-1 rounded transition-colors hover:bg-orange-500/10"
                            style={{ color: '#FF7D38' }}
                        >
                            Select All
                        </button>
                        <button
                            type="button"
                            onClick={() => onClearAll(component.id)}
                            className="text-[10px] px-2 py-1 rounded transition-colors hover:bg-orange-500/10"
                            style={{ color: '#FF9A5F' }}
                        >
                            Clear All
                        </button>
                    </div>

                    <div className="mt-2 text-[10px]" style={{ color: '#FF9A5F' }}>
                        {hasAll && <span className="text-emerald-400">✓ Full access to {component.label}</span>}
                        {hasSome && !hasAll && (
                            <span>
                                Access: {hasView ? 'View' : ''}{hasEdit ? (hasView ? ', Edit' : 'Edit') : ''}{hasDelete ? (hasView || hasEdit ? ', Delete' : 'Delete') : ''}
                            </span>
                        )}
                        {!hasSome && <span>No access to {component.label}</span>}
                    </div>
                </div>
            )}
        </div>
    );
};

export const StaffForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'Staff',
        department: '',
        status: 'active',
        permissions: []
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isEdit) {
            const staff = StaffService.getById(id);
            if (staff) {
                setFormData({
                    name: staff.name || '',
                    email: staff.email || '',
                    phone: staff.phone || '',
                    role: staff.role || 'Staff',
                    department: staff.department || '',
                    status: staff.status || 'active',
                    permissions: staff.permissions || []
                });
            }
        }
    }, [id, isEdit]);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.department.trim()) newErrors.department = 'Department is required';
        if (!isEdit && !password) newErrors.password = 'Password is required for new staff';
        if (!isEdit && password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ── Permission Actions ──────────────────────────────────────────────
    const togglePermission = (componentId, action) => {
        setFormData(prev => {
            let permissions = [...prev.permissions];
            const existingIndex = permissions.findIndex(p => p.componentId === componentId);

            if (existingIndex === -1) {
                permissions.push({ componentId, actions: [action] });
            } else {
                const currentActions = permissions[existingIndex].actions;
                if (currentActions.includes(action)) {
                    currentActions.splice(currentActions.indexOf(action), 1);
                    if (currentActions.length === 0) {
                        permissions.splice(existingIndex, 1);
                    }
                } else {
                    currentActions.push(action);
                }
            }
            return { ...prev, permissions };
        });
    };

    const selectAllPermissions = (componentId) => {
        setFormData(prev => {
            let permissions = [...prev.permissions];
            const existingIndex = permissions.findIndex(p => p.componentId === componentId);
            const allActions = ['view', 'edit', 'delete'];
            
            if (existingIndex === -1) {
                permissions.push({ componentId, actions: allActions });
            } else {
                permissions[existingIndex].actions = allActions;
            }
            return { ...prev, permissions };
        });
    };

    const clearAllPermissions = (componentId) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.filter(p => p.componentId !== componentId)
        }));
    };

    const getComponentPermissions = (componentId) => {
        const found = formData.permissions.find(p => p.componentId === componentId);
        return found ? found.actions : [];
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setTimeout(() => {
            if (isEdit) {
                StaffService.update(id, formData);
            } else {
                StaffService.create({ ...formData, password });
            }
            setLoading(false);
            navigate('/admin/staff');
        }, 500);
    };

    const handleDelete = () => {
        if (!window.confirm('Are you sure you want to delete this staff member?')) return;
        StaffService.delete(id);
        navigate('/admin/staff');
    };

    const handleCancel = () => {
        navigate('/admin/staff');
    };

    const totalPermissions = formData.permissions.reduce((acc, p) => acc + p.actions.length, 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={handleCancel}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm"
                        style={{ color: '#FF7D38', border: '1px solid rgba(255,125,56,0.2)' }}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    <div>
                        <h1 className="text-lg sm:text-xl font-bold" style={{ color: '#FF7D38' }}>
                            {isEdit ? 'Edit Staff' : 'Add New Staff'}
                        </h1>
                        <p className="text-xs sm:text-sm mt-0.5" style={{ color: '#FF9A5F' }}>
                            {isEdit ? 'Update staff information and component permissions' : 'Create a new staff account with component permissions'}
                        </p>
                    </div>
                </div>
                {isEdit && (
                    <button onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all"
                        style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                        <Trash2 size={16} /> Delete Staff
                    </button>
                )}
            </div>

            <Panel className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#FF9A5F' }}>Full Name *</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#FF9A5F' }} />
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all"
                                    style={{ background: 'rgba(255,125,56,0.08)', border: errors.name ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,125,56,0.2)', color: '#FF7D38' }}
                                    placeholder="Enter full name" />
                            </div>
                            {errors.name && <p className="mt-1 text-xs" style={{ color: '#f87171' }}>{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#FF9A5F' }}>Email Address *</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#FF9A5F' }} />
                                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all"
                                    style={{ background: 'rgba(255,125,56,0.08)', border: errors.email ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,125,56,0.2)', color: '#FF7D38' }}
                                    placeholder="Enter email address" />
                            </div>
                            {errors.email && <p className="mt-1 text-xs" style={{ color: '#f87171' }}>{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#FF9A5F' }}>Phone Number *</label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#FF9A5F' }} />
                                <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all"
                                    style={{ background: 'rgba(255,125,56,0.08)', border: errors.phone ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,125,56,0.2)', color: '#FF7D38' }}
                                    placeholder="Enter phone number" />
                            </div>
                            {errors.phone && <p className="mt-1 text-xs" style={{ color: '#f87171' }}>{errors.phone}</p>}
                        </div>

                        {!isEdit && (
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: '#FF9A5F' }}>Password *</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#FF9A5F' }} />
                                    <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                                        className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl transition-all"
                                        style={{ background: 'rgba(255,125,56,0.08)', border: errors.password ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,125,56,0.2)', color: '#FF7D38' }}
                                        placeholder="Enter password" />
                                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#FF9A5F' }}>
                                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1 text-xs" style={{ color: '#f87171' }}>{errors.password}</p>}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#FF9A5F' }}>Role *</label>
                            <div className="relative">
                                <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#FF9A5F' }} />
                                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all appearance-none"
                                    style={{ background: 'rgba(255,125,56,0.08)', border: '1px solid rgba(255,125,56,0.2)', color: '#FF7D38' }}>
                                    <option value="Super Admin" style={{ background: '#02203C' }}>Super Admin</option>
                                    <option value="Staff Admin" style={{ background: '#02203C' }}>Staff Admin</option>
                                    <option value="Staff" style={{ background: '#02203C' }}>Staff</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#FF9A5F' }}>Department *</label>
                            <div className="relative">
                                <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#FF9A5F' }} />
                                <input type="text" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all"
                                    style={{ background: 'rgba(255,125,56,0.08)', border: errors.department ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,125,56,0.2)', color: '#FF7D38' }}
                                    placeholder="Enter department" />
                            </div>
                            {errors.department && <p className="mt-1 text-xs" style={{ color: '#f87171' }}>{errors.department}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#FF9A5F' }}>Status</label>
                            <div className="relative">
                                <UserCog size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#FF9A5F' }} />
                                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all appearance-none"
                                    style={{ background: 'rgba(255,125,56,0.08)', border: '1px solid rgba(255,125,56,0.2)', color: '#FF7D38' }}>
                                    <option value="active" style={{ background: '#02203C' }}>Active</option>
                                    <option value="inactive" style={{ background: '#02203C' }}>Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Component Permissions Section */}
                    <div className="pt-4 border-t" style={{ borderColor: 'rgba(255,125,56,0.1)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Shield size={18} style={{ color: '#FF7D38' }} />
                                <h3 className="text-sm font-semibold" style={{ color: '#FF7D38' }}>Component Permissions</h3>
                                <span className="text-xs" style={{ color: '#FF9A5F' }}>
                                    ({totalPermissions} permissions assigned)
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        COMPONENTS.forEach(comp => selectAllPermissions(comp.id));
                                    }}
                                    className="text-xs px-3 py-1 rounded-lg transition-colors"
                                    style={{ color: '#FF7D38', border: '1px solid rgba(255,125,56,0.2)' }}
                                >
                                    Select All
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, permissions: [] }));
                                    }}
                                    className="text-xs px-3 py-1 rounded-lg transition-colors"
                                    style={{ color: '#FF9A5F', border: '1px solid rgba(255,125,56,0.1)' }}
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {COMPONENTS.map(component => (
                                <PermissionSelector
                                    key={component.id}
                                    component={component}
                                    permissions={getComponentPermissions(component.id)}
                                    onToggle={togglePermission}
                                    onSelectAll={selectAllPermissions}
                                    onClearAll={clearAllPermissions}
                                />
                            ))}
                        </div>

                        <div className="mt-3 p-3 rounded-xl" style={{ background: 'rgba(255,125,56,0.06)', border: '1px solid rgba(255,125,56,0.1)' }}>
                            <p className="text-xs" style={{ color: '#FF9A5F' }}>
                                <span className="font-semibold" style={{ color: '#FF7D38' }}>Note:</span> 
                                Super Admin has all permissions by default. Staff Admin and Staff will only have access to components with granted permissions.
                                Select "View" for read-only access, "Edit" for modification access, and "Delete" for removal access.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'rgba(255,125,56,0.1)' }}>
                        <button type="button" onClick={handleCancel}
                            className="px-5 py-2.5 text-sm font-medium rounded-xl transition-colors" style={{ color: '#FF9A5F' }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all disabled:opacity-70"
                            style={{ background: 'linear-gradient(135deg, #FF7D38, #FF6B1A)', boxShadow: '0 0 15px rgba(255,125,56,0.3)' }}>
                            {loading ? 'Saving...' : <><Save size={16} /> {isEdit ? 'Update Staff' : 'Create Staff'}</>}
                        </button>
                    </div>
                </form>
            </Panel>
        </div>
    );
};

export default StaffForm;
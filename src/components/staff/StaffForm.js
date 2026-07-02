// pages/AddEditStaff.js - Add/Edit Staff with Component Permission Selection (Light Theme)
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, Save, User, Mail, Phone, Shield,
    Building, UserCog, Check, X,
    Eye, EyeOff, Lock, Trash2,
    LayoutDashboard, Users, BarChart2, LineChart, MailWarning,
    UserCog as UserCogIcon, Settings, ChevronDown, ChevronUp,
    Download
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

// ── Available Components with Permissions ──────────────────────────────────
const COMPONENTS = [
    { id: 'users', label: 'Registered Users', icon: Users, path: '/admin/users' },
    { id: 'plans', label: 'Plans', icon: BarChart2, path: '/admin/plans' },
    { id: 'analytics', label: 'Analytics', icon: LineChart, path: '/admin/analytics' },
    { id: 'reports', label: 'Reports', icon: MailWarning, path: '/admin/reports' },
    { id: 'notifications', label: 'Notifications', icon: MailWarning, path: '/admin/notifications' },
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

// ── Permission Checkbox Component ──────────────────────────────────────
const PermissionCheckbox = ({ label, checked, onChange, color }) => (
    <label className="flex items-center gap-2 cursor-pointer">
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="w-4 h-4 rounded border-orange-300 text-orange-500 focus:ring-orange-400 focus:ring-2 cursor-pointer"
        />
        <span className="text-xs font-medium" style={{ color: color || '#4a4a4a' }}>{label}</span>
    </label>
);

// ── Permission Selector Component ──────────────────────────────────────
const PermissionSelector = ({ component, permissions, onToggle, onSelectAll, onClearAll }) => {
    const [expanded, setExpanded] = useState(true);
    const hasView = permissions.includes('view');
    const hasEdit = permissions.includes('edit');
    const hasDelete = permissions.includes('delete');
    const hasExport = permissions.includes('export');
    const hasAll = hasView && hasEdit && hasDelete && hasExport;
    const hasSome = hasView || hasEdit || hasDelete || hasExport;

    return (
        <div className="rounded-xl overflow-hidden bg-white border border-orange-200">
            {/* Header */}
            <div 
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-orange-50 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-50">
                        <component.icon size={16} style={{ color: '#FF7D38' }} />
                    </div>
                    <div>
                        <span className="text-sm font-medium text-gray-800">{component.label}</span>
                        <p className="text-[10px] text-gray-500">{component.path}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {hasAll && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">
                            Full Access
                        </span>
                    )}
                    {hasSome && !hasAll && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-500 border border-orange-200">
                            Partial
                        </span>
                    )}
                    {!hasSome && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-200">
                            No Access
                        </span>
                    )}
                    {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
            </div>

            {/* Body - Permissions */}
            {expanded && (
                <div className="p-3 pt-0 border-t border-orange-100">
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                        <PermissionCheckbox
                            label="View"
                            checked={hasView}
                            onChange={() => onToggle(component.id, 'view')}
                            color="#3b82f6"
                        />
                        <PermissionCheckbox
                            label="Edit"
                            checked={hasEdit}
                            onChange={() => onToggle(component.id, 'edit')}
                            color="#FF7D38"
                        />
                        <PermissionCheckbox
                            label="Delete"
                            checked={hasDelete}
                            onChange={() => onToggle(component.id, 'delete')}
                            color="#ef4444"
                        />
                        <PermissionCheckbox
                            label="Export"
                            checked={hasExport}
                            onChange={() => onToggle(component.id, 'export')}
                            color="#10b981"
                        />

                        <div className="flex-1" />

                        <button
                            type="button"
                            onClick={() => onSelectAll(component.id)}
                            className="text-[10px] px-2 py-1 rounded transition-colors hover:bg-orange-50 text-orange-500"
                        >
                            Select All
                        </button>
                        <button
                            type="button"
                            onClick={() => onClearAll(component.id)}
                            className="text-[10px] px-2 py-1 rounded transition-colors hover:bg-gray-50 text-gray-500"
                        >
                            Clear All
                        </button>
                    </div>

                    <div className="mt-2 text-[10px] text-gray-500">
                        {hasAll && <span className="text-green-600">✓ Full access to {component.label}</span>}
                        {hasSome && !hasAll && (
                            <span>
                                Access: {hasView ? 'View' : ''}{hasEdit ? (hasView ? ', Edit' : 'Edit') : ''}{hasDelete ? (hasView || hasEdit ? ', Delete' : 'Delete') : ''}{hasExport ? (hasView || hasEdit || hasDelete ? ', Export' : 'Export') : ''}
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
            const allActions = ['view', 'edit', 'delete', 'export'];
            
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
        <div className="space-y-6 bg-gray-50 min-h-screen p-4 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-orange-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={handleCancel}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-100">
                        <ArrowLeft size={16} /> Back
                    </button>
                    <div>
                        <h1 className="text-lg sm:text-xl font-bold text-gray-800">
                            {isEdit ? 'Edit Staff' : 'Add New Staff'}
                        </h1>
                        <p className="text-xs sm:text-sm mt-0.5 text-gray-500">
                            {isEdit ? 'Update staff information and component permissions' : 'Create a new staff account with component permissions'}
                        </p>
                    </div>
                </div>
                {isEdit && (
                    <button onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all bg-red-50 text-red-500 border border-red-200 hover:bg-red-100">
                        <Trash2 size={16} /> Delete Staff
                    </button>
                )}
            </div>

            <Panel className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-600">Full Name *</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                                    placeholder="Enter full name" />
                            </div>
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-600">Email Address *</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                                    placeholder="Enter email address" />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-600">Phone Number *</label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                                    placeholder="Enter phone number" />
                            </div>
                            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                        </div>

                        {!isEdit && (
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-gray-600">Password *</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                                        className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                                        placeholder="Enter password" />
                                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500">
                                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-600">Role *</label>
                            <div className="relative">
                                <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all appearance-none bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200">
                                    <option value="Super Admin" className="bg-white">Super Admin</option>
                                    <option value="Staff Admin" className="bg-white">Staff Admin</option>
                                    <option value="Staff" className="bg-white">Staff</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-600">Department *</label>
                            <div className="relative">
                                <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                                    placeholder="Enter department" />
                            </div>
                            {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-600">Status</label>
                            <div className="relative">
                                <UserCog size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all appearance-none bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200">
                                    <option value="active" className="bg-white">Active</option>
                                    <option value="inactive" className="bg-white">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Component Permissions Section */}
                    <div className="pt-4 border-t border-orange-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Shield size={18} className="text-orange-500" />
                                <h3 className="text-sm font-semibold text-gray-800">Component Permissions</h3>
                                <span className="text-xs text-gray-500">
                                    ({totalPermissions} permissions assigned)
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        COMPONENTS.forEach(comp => selectAllPermissions(comp.id));
                                    }}
                                    className="text-xs px-3 py-1 rounded-lg transition-colors bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-100"
                                >
                                    Select All
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, permissions: [] }));
                                    }}
                                    className="text-xs px-3 py-1 rounded-lg transition-colors bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"
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

                        <div className="mt-3 p-3 rounded-xl bg-orange-50 border border-orange-200">
                            <p className="text-xs text-gray-600">
                                <span className="font-semibold text-orange-500">Note:</span> 
                                Super Admin has all permissions by default. Staff Admin and Staff will only have access to components with granted permissions.
                                Select "View" for read-only access, "Edit" for modification access, "Delete" for removal access, and "Export" for data export access.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-orange-200">
                        <button type="button" onClick={handleCancel}
                            className="px-5 py-2.5 text-sm font-medium rounded-xl transition-colors text-gray-600 hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all disabled:opacity-70 bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-orange-500/30 shadow-sm">
                            {loading ? 'Saving...' : <><Save size={16} /> {isEdit ? 'Update Staff' : 'Create Staff'}</>}
                        </button>
                    </div>
                </form>
            </Panel>
        </div>
    );
};

export default StaffForm;
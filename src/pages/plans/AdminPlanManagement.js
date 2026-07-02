// pages/AdminPlanManagement.js - Light Theme with Saffron Accents
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Edit, Trash2, Eye, X, Check, AlertCircle,
    Package, Save, Archive, RefreshCw, Search,
    Users, UserCheck, UserX, Calendar, Clock,
    MoreVertical, ChevronDown, ChevronUp
} from 'lucide-react';
import { canDelete, canEdit, canView } from '../../view/Permissions';

// ── Reusable Components ──────────────────────────────────────────────────────

const Panel = ({ children, className = "" }) => (
    <div
        className={`rounded-2xl p-4 sm:p-5 transition-all bg-white ${className}`}
        style={{
            border: '1px solid rgba(255,125,56,0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}
        onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(255,125,56,0.4)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,125,56,0.12)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,125,56,0.2)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
        }}
    >
        {children}
    </div>
);

const StatCard = ({ label, value, icon: Icon, grad }) => (
    <div className="relative overflow-hidden rounded-2xl p-4 flex items-center gap-3 transition-all hover:scale-105 bg-white border border-orange-200 shadow-sm hover:shadow-lg">

        {/* Decorative Background */}
        <div className="absolute -top-8 -left-8 w-20 h-20 rounded-full bg-orange-400/10" />
        <div className="absolute -top-4 -left-4 w-28 h-28 rounded-full border border-orange-300/20" />
        <div className="absolute -top-8 -left-8 w-36 h-36 rounded-full border border-orange-300/10" />
        <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-orange-400/10" />

        {/* Content */}
        <div
            className={`relative z-10 w-9 h-9 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center shrink-0 shadow-lg`}
        >
            <Icon size={15} className="text-white" />
        </div>

        <div className="relative z-10 min-w-0">
            <p className="text-[10px] font-medium truncate text-gray-500">
                {label}
            </p>
            <p className="text-lg sm:text-xl font-bold truncate text-orange-500">
                {value}
            </p>
        </div>

    </div>
);

const StatusBadge = ({ status }) => (
    <button
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${status === 'active' ? 'bg-orange-50 text-orange-500' : 'bg-gray-100 text-gray-500'}`}
    >
        <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-orange-500 animate-pulse' : 'bg-gray-400'}`} />
        {status}
    </button>
);

// ── Mock API Service ──────────────────────────────────────────────────────────

const PlanService = {
    getAll: () => {
        const stored = localStorage.getItem('plans');
        if (stored) return JSON.parse(stored);
        const defaultPlans = [
            {
                id: 1, name: "Basic", description: "Essential features for small teams",
                price: 29, discountType: "percentage", discountAmount: 0,
                features: ["Up to 10 users", "5GB storage", "Basic support", "Mobile app access"],
                status: "active", createdAt: "2024-01-15T10:00:00Z", updatedAt: "2024-01-15T10:00:00Z",
                subscriberCount: 45, activeUsers: 38, inactiveUsers: 7
            },
            {
                id: 2, name: "Professional", description: "Advanced features for growing businesses",
                price: 99, discountType: "percentage", discountAmount: 10,
                features: ["Up to 50 users", "50GB storage", "Priority support", "Mobile app access", "Advanced analytics", "API access"],
                status: "active", createdAt: "2024-01-15T10:00:00Z", updatedAt: "2024-02-01T14:30:00Z",
                subscriberCount: 128, activeUsers: 115, inactiveUsers: 13
            },
            {
                id: 3, name: "Business", description: "Full-featured solution for large organizations",
                price: 299, discountType: "fixed", discountAmount: 50,
                features: ["Unlimited users", "500GB storage", "24/7 dedicated support", "Mobile app access", "Advanced analytics", "API access", "Custom integrations", "SLA guarantee"],
                status: "inactive", createdAt: "2024-01-20T08:00:00Z", updatedAt: "2024-02-10T16:45:00Z",
                subscriberCount: 67, activeUsers: 0, inactiveUsers: 67
            }
        ];
        localStorage.setItem('plans', JSON.stringify(defaultPlans));
        return defaultPlans;
    },
    create: (plan) => {
        const plans = PlanService.getAll();
        const newPlan = {
            ...plan,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'active',
            subscriberCount: 0,
            activeUsers: 0,
            inactiveUsers: 0
        };
        plans.unshift(newPlan);
        localStorage.setItem('plans', JSON.stringify(plans));
        return newPlan;
    },
    update: (id, updates) => {
        const plans = PlanService.getAll();
        const index = plans.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Plan not found');
        plans[index] = { ...plans[index], ...updates, updatedAt: new Date().toISOString() };
        localStorage.setItem('plans', JSON.stringify(plans));
        return plans[index];
    },
    delete: (id) => {
        const plans = PlanService.getAll();
        const filtered = plans.filter(p => p.id !== id);
        localStorage.setItem('plans', JSON.stringify(filtered));
        return filtered;
    }
};

const generateMockUsers = () => {
    if (localStorage.getItem('planUsers')) return;
    const plans = PlanService.getAll();
    const users = [];
    const statuses = ['active', 'active', 'active', 'active', 'inactive'];
    const names = ['Raj Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh', 'Meera Joshi', 'Arjun Nair', 'Divya Menon', 'Kiran Bose', 'Anita Desai'];
    const companies = ['TechCorp', 'InnovateLabs', 'CloudSolutions', 'DataDrive', 'ApexSystems'];
    const roles = ['Admin', 'Manager', 'Developer', 'Designer', 'Analyst', 'Executive'];

    plans.forEach(plan => {
        const count = Math.floor(Math.random() * 50) + 10;
        for (let i = 0; i < count; i++) {
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            users.push({
                id: `user-${Date.now()}-${i}-${plan.id}`,
                planId: plan.id,
                name: names[Math.floor(Math.random() * names.length)],
                email: `user${i}@${companies[Math.floor(Math.random() * companies.length)].toLowerCase()}.com`,
                company: companies[Math.floor(Math.random() * companies.length)],
                role: roles[Math.floor(Math.random() * roles.length)],
                status: status,
                joinedDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
                lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                deviceCount: Math.floor(Math.random() * 5) + 1,
                avatar: `https://ui-avatars.com/api/?name=${names[Math.floor(Math.random() * names.length)].replace(' ', '+')}&background=random`
            });
        }
    });
    localStorage.setItem('planUsers', JSON.stringify(users));
};

// ── Plan Form Modal ───────────────────────────────────────────────────────────

const PlanFormModal = ({ isOpen, onClose, plan, onSave }) => {
    const [formData, setFormData] = useState({ name: '', description: '', price: 0, discountType: 'percentage', discountAmount: 0, features: [''] });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (plan) {
            setFormData({
                name: plan.name || '',
                description: plan.description || '',
                price: plan.price || 0,
                discountType: plan.discountType || 'percentage',
                discountAmount: plan.discountAmount || 0,
                features: plan.features?.length ? plan.features : ['']
            });
        } else {
            setFormData({ name: '', description: '', price: 0, discountType: 'percentage', discountAmount: 0, features: [''] });
        }
        setErrors({});
    }, [plan, isOpen]);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Plan name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
        if (formData.discountAmount < 0) newErrors.discountAmount = 'Discount cannot be negative';
        if (formData.discountType === 'percentage' && formData.discountAmount > 100) {
            newErrors.discountAmount = 'Percentage discount cannot exceed 100%';
        }
        if (!formData.features.some(f => f.trim())) newErrors.features = 'At least one feature is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onSave({ ...formData, features: formData.features.filter(f => f.trim()) });
        onClose();
    };

    const addFeature = () => setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
    const removeFeature = (index) => setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
    const updateFeature = (index, value) => setFormData(prev => ({ ...prev, features: prev.features.map((f, i) => i === index ? value : f) }));

    if (!isOpen) return null;

    const Field = ({ label, error, children }) => (
        <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-600">{label}</label>
            {children}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col bg-white border border-orange-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-orange-100">
                    <h2 className="text-lg font-bold text-gray-800">{plan ? 'Edit Plan' : 'Create New Plan'}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-orange-50 text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Field label="Plan Name *" error={errors.name}>
                            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200" placeholder="e.g., Professional Plan" />
                        </Field>

                        <Field label="Description *" error={errors.description}>
                            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                rows={3} className="w-full px-4 py-2.5 rounded-xl transition-all resize-none bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200" placeholder="Describe what this plan offers..." />
                        </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Field label="Price ($) *" error={errors.price}>
                                <input type="number" min="0" step="0.01" value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-4 py-2.5 rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200" />
                            </Field>
                            <Field label="Discount Type">
                                <select value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200">
                                    <option value="percentage" className="bg-white">Percentage (%)</option>
                                    <option value="fixed" className="bg-white">Fixed ($)</option>
                                </select>
                            </Field>
                            <Field label="Discount Amount" error={errors.discountAmount}>
                                <input type="number" min="0" step={formData.discountType === 'percentage' ? 1 : 0.01}
                                    value={formData.discountAmount} onChange={e => setFormData({ ...formData, discountAmount: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-4 py-2.5 rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200" />
                            </Field>
                        </div>

                        <Field label="Features *" error={errors.features}>
                            <div className="space-y-2">
                                {formData.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input type="text" value={feature} onChange={e => updateFeature(index, e.target.value)}
                                            className="flex-1 px-4 py-2.5 rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200" placeholder={`Feature ${index + 1}`} />
                                        <button type="button" onClick={() => removeFeature(index)} disabled={formData.features.length === 1}
                                            className="p-2 rounded-lg transition-colors hover:bg-red-50 disabled:opacity-30 text-red-500">
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={addFeature} className="flex items-center gap-1.5 text-sm font-medium transition-colors text-orange-500 hover:text-orange-600">
                                    <Plus size={16} /> Add Feature
                                </button>
                            </div>
                        </Field>
                    </form>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-orange-100 rounded-b-2xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-xl transition-colors text-gray-600 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all shadow-sm bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-orange-500/30">
                        <Save size={16} /> {plan ? 'Update Plan' : 'Create Plan'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── View Plan Modal ───────────────────────────────────────────────────────────

const ViewPlanModal = ({ isOpen, onClose, plan, onViewActiveUsers, onViewInactiveUsers }) => {
    if (!isOpen || !plan) return null;

    const getFinalPrice = () => {
        if (plan.discountAmount === 0) return plan.price;
        if (plan.discountType === 'percentage') return plan.price * (1 - plan.discountAmount / 100);
        return Math.max(0, plan.price - plan.discountAmount);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col bg-white border border-orange-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-orange-100">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.status === 'active' ? 'from-orange-500 to-amber-600' : 'from-gray-400 to-gray-500'} flex items-center justify-center`}>
                            <Package size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">{plan.name}</h2>
                            <p className="text-xs text-gray-500">Created {new Date(plan.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-orange-50 text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-xl p-4 bg-orange-50 border border-orange-200">
                            <p className="text-xs font-medium text-gray-500">Status</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`w-2 h-2 rounded-full ${plan.status === 'active' ? 'bg-orange-500 animate-pulse' : 'bg-gray-400'}`} />
                                <span className="text-sm font-semibold capitalize text-orange-500">{plan.status}</span>
                            </div>
                        </div>
                        <div className="rounded-xl p-4 bg-orange-50 border border-orange-200">
                            <p className="text-xs font-medium text-gray-500">Pricing</p>
                            <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                                <span className="text-2xl font-bold text-orange-500">${getFinalPrice().toFixed(2)}</span>
                                {plan.discountAmount > 0 && <span className="text-sm line-through text-gray-400">${plan.price}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl p-4 bg-orange-50 border border-orange-200">
                        <p className="text-xs font-medium mb-1 text-gray-500">Description</p>
                        <p className="text-sm text-gray-700">{plan.description}</p>
                    </div>

                    <div>
                        <p className="text-xs font-medium mb-3 text-gray-500">Features</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {plan.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 rounded-lg px-3 py-2 bg-orange-50">
                                    <Check size={14} className="text-orange-500" />
                                    <span className="text-sm text-gray-700">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl p-4 bg-orange-50 border border-orange-200">
                        <p className="text-xs font-medium mb-3 text-gray-500">Subscriber Statistics</p>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-orange-500">{plan.subscriberCount || 0}</p>
                                <p className="text-[10px] text-gray-500">Total</p>
                            </div>
                            <div className="text-center cursor-pointer rounded-lg p-2 transition-colors hover:bg-orange-100"
                                onClick={() => plan.activeUsers > 0 && onViewActiveUsers()}>
                                <p className={`text-2xl font-bold ${plan.activeUsers > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                                    {plan.activeUsers || 0}
                                </p>
                                <p className="text-[10px] flex items-center justify-center gap-1 text-gray-500">
                                    <UserCheck size={12} /> Active
                                </p>
                            </div>
                            <div className="text-center cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-100"
                                onClick={() => plan.inactiveUsers > 0 && onViewInactiveUsers()}>
                                <p className={`text-2xl font-bold ${plan.inactiveUsers > 0 ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {plan.inactiveUsers || 0}
                                </p>
                                <p className="text-[10px] flex items-center justify-center gap-1 text-gray-500">
                                    <UserX size={12} /> Inactive
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs rounded-xl p-4 bg-gray-50">
                        <div>
                            <span className="font-medium text-gray-500">Created</span>
                            <p className="text-gray-700">{new Date(plan.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500">Last Updated</span>
                            <p className="text-gray-700">{new Date(plan.updatedAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-orange-100 rounded-b-2xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-xl transition-colors text-gray-600 hover:bg-gray-50">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Plan Card (Mobile) ──────────────────────────────────────────────────────

const PlanCard = ({ plan, onView, onEdit, onDelete, onToggleStatus, onViewActive, onViewInactive }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <Panel className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.status === 'active' ? 'from-orange-500 to-amber-600' : 'from-gray-400 to-gray-500'} flex items-center justify-center shrink-0`}>
                        <Package size={16} className="text-white" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold truncate text-gray-800">{plan.name}</p>
                        <p className="text-xs truncate text-gray-500">{plan.description}</p>
                    </div>
                </div>
                <StatusBadge status={plan.status} />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl py-2 bg-orange-50">
                    <p className="text-sm font-bold text-orange-500">${plan.price}</p>
                    <p className="text-[10px] text-gray-500">Price</p>
                </div>
                <div className="rounded-xl py-2 bg-orange-50">
                    <p className="text-sm font-bold text-orange-500">{plan.features.length}</p>
                    <p className="text-[10px] text-gray-500">Features</p>
                </div>
                <div className="rounded-xl py-2 bg-orange-50">
                    <p className="text-sm font-bold text-orange-500">{plan.subscriberCount || 0}</p>
                    <p className="text-[10px] text-gray-500">Users</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => onViewActive(plan)} className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${plan.activeUsers > 0 ? 'hover:bg-orange-50' : 'opacity-50 cursor-not-allowed'}`}
                    style={plan.activeUsers > 0 ? { background: 'rgba(255,125,56,0.12)', color: '#FF7D38' } : { background: 'rgba(100,116,139,0.08)', color: '#94a3b8' }}>
                    <UserCheck size={12} /> {plan.activeUsers || 0} Active
                </button>
                <button onClick={() => onViewInactive(plan)} className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${plan.inactiveUsers > 0 ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}
                    style={plan.inactiveUsers > 0 ? { background: 'rgba(100,116,139,0.12)', color: '#64748b' } : { background: 'rgba(100,116,139,0.08)', color: '#94a3b8' }}>
                    <UserX size={12} /> {plan.inactiveUsers || 0} Inactive
                </button>
                <button onClick={() => setExpanded(!expanded)} className="ml-auto p-1 rounded-lg transition-colors text-gray-400 hover:text-orange-500">
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>

            {expanded && (
                <div className="pt-3 space-y-2 border-t border-orange-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Updated: {new Date(plan.updatedAt).toLocaleDateString()}</span>
                        <span>ID: {plan.id}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <button onClick={() => onView(plan)} className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition-colors text-orange-500 hover:bg-orange-50">
                            <Eye size={14} /> View
                        </button>
                        <button onClick={() => onEdit(plan)} className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition-colors text-orange-500 hover:bg-orange-50">
                            <Edit size={14} /> Edit
                        </button>
                        <button onClick={() => onToggleStatus(plan.id)} className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition-colors ${plan.status === 'active' ? 'text-amber-500 hover:bg-amber-50' : 'text-orange-500 hover:bg-orange-50'}`}>
                            {plan.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => onDelete(plan.id)} className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition-colors ml-auto text-red-500 hover:bg-red-50">
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                </div>
            )}
        </Panel>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────

const AdminPlanManagement = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [viewingPlan, setViewingPlan] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);

    // Check permissions for the 'plans' component
        const hasViewPermission = canView('plans');
        const hasEditPermission = canEdit('plans');
        const hasDeletePermission = canDelete('plans');
    

    const loadPlans = () => {
        setLoading(true);
        setTimeout(() => {
            generateMockUsers();
            const data = PlanService.getAll();
            const allUsers = JSON.parse(localStorage.getItem('planUsers') || '[]');
            const updatedData = data.map(plan => ({
                ...plan,
                activeUsers: allUsers.filter(u => u.planId === plan.id && u.status === 'active').length,
                inactiveUsers: allUsers.filter(u => u.planId === plan.id && u.status === 'inactive').length,
                subscriberCount: allUsers.filter(u => u.planId === plan.id).length
            }));
            setPlans(updatedData);
            setLoading(false);
        }, 300);
    };

    useEffect(() => { loadPlans(); }, []);

    const handleCreate = (data) => {
        const newPlan = PlanService.create(data);
        setPlans(prev => [{ ...newPlan, subscriberCount: 0, activeUsers: 0, inactiveUsers: 0 }, ...prev]);
    };

    const handleUpdate = (data) => {
        const updated = PlanService.update(selectedPlan.id, data);
        setPlans(prev => prev.map(p => p.id === updated.id ? updated : p));
        setSelectedPlan(null);
    };

    const handleDelete = (id) => {
        if (!window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) return;
        setPlans(PlanService.delete(id));
    };

    const handleToggleStatus = (id) => {
        const plan = plans.find(p => p.id === id);
        if (!plan) return;
        const newStatus = plan.status === 'active' ? 'inactive' : 'active';
        const updated = PlanService.update(id, { status: newStatus });
        setPlans(prev => prev.map(p => p.id === updated.id ? updated : p));
    };

    const handleViewActiveUsers = (plan) => navigate(`/admin/plans/${plan.id}/active-users`);
    const handleViewInactiveUsers = (plan) => navigate(`/admin/plans/${plan.id}/inactive-users`);

    const filtered = useMemo(() => {
        return plans.filter(plan => {
            const matchSearch = plan.name.toLowerCase().includes(search.toLowerCase()) ||
                plan.description.toLowerCase().includes(search.toLowerCase());
            const matchStatus = filterStatus === 'All' || plan.status === filterStatus;
            return matchSearch && matchStatus;
        });
    }, [plans, search, filterStatus]);

    const stats = useMemo(() => [
        { label: 'Total Plans', value: plans.length, icon: Package, grad: 'from-orange-500 to-amber-600' },
        { label: 'Active Plans', value: plans.filter(p => p.status === 'active').length, icon: Check, grad: 'from-amber-400 to-orange-500' },
        { label: 'Inactive Plans', value: plans.filter(p => p.status === 'inactive').length, icon: Archive, grad: 'from-gray-400 to-gray-500' },
        { label: 'Total Subscribers', value: plans.reduce((acc, p) => acc + (p.subscriberCount || 0), 0), icon: Users, grad: 'from-yellow-500 to-amber-600' },
    ], [plans]);

    return (
        <div className="space-y-4 sm:space-y-6 px-2 sm:px-0 bg-gray-50 min-h-screen p-4 rounded-2xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-orange-200 shadow-sm">
                <div>
                    <h1 className="text-lg sm:text-xl font-bold text-gray-800">Plan Management</h1>
                    <p className="text-xs sm:text-sm mt-0.5 text-gray-500">Create, manage, and customize subscription plans</p>
                </div>
                <button onClick={() => { setSelectedPlan(null); setIsFormOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-all shadow-sm bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-orange-500/30 shrink-0">
                    <Plus size={16} /> New Plan
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                {stats.map(s => <StatCard key={s.label} {...s} />)}
            </div>

            {/* Filters */}
            <Panel>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search plans..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200" />
                    </div>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3.5 py-2.5 text-sm rounded-xl transition-all bg-orange-50 border border-orange-200 text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200">
                        {['All', 'active', 'inactive'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={loadPlans} className="flex items-center justify-center gap-2 px-3.5 py-2.5 text-sm rounded-xl transition-colors bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-100">
                        <RefreshCw size={14} /> <span className="hidden sm:inline">Refresh</span>
                    </button>
                </div>
            </Panel>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {loading ? (
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-400 border-t-transparent mx-auto" />
                        <p className="text-sm mt-4 text-gray-500">Loading plans...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 rounded-2xl bg-white border border-orange-200">
                        <Package size={32} className="mx-auto mb-3 opacity-30 text-gray-400" />
                        <p className="text-sm text-gray-500">No plans match your filters</p>
                    </div>
                ) : filtered.map(plan => (
                    <PlanCard key={plan.id} plan={plan} onView={() => { setViewingPlan(plan); setIsViewOpen(true); }}
                        onEdit={() => { setSelectedPlan(plan); setIsFormOpen(true); }} onDelete={handleDelete}
                        onToggleStatus={handleToggleStatus} onViewActive={handleViewActiveUsers} onViewInactive={handleViewInactiveUsers} />
                ))}
            </div>

            {/* Desktop Table */}
            <Panel className="hidden md:block overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-orange-200 bg-orange-50">
                                <th className="text-left text-xs font-semibold px-5 py-3.5 text-gray-600">Plan</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5 text-gray-600">Price</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5 text-gray-600">Discount</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5 text-gray-600">Features</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5 text-gray-600">Users</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5 text-gray-600">Status</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5 text-gray-600">Updated</th>
                                <th className="text-xs font-semibold px-4 py-3.5 text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-orange-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-16">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-400 border-t-transparent" />
                                            <p className="text-sm text-gray-500">Loading plans...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-16">
                                        <div className="flex flex-col items-center gap-2">
                                            <Package size={32} className="opacity-30 text-gray-400" />
                                            <p className="text-sm text-gray-500">No plans match your filters</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.map(plan => (
                                <tr key={plan.id} className="hover:bg-orange-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${plan.status === 'active' ? 'from-orange-500 to-amber-600' : 'from-gray-400 to-gray-500'} flex items-center justify-center shrink-0`}>
                                                <Package size={14} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">{plan.name}</p>
                                                <p className="text-xs truncate max-w-[180px] text-gray-500">{plan.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm font-bold text-orange-500">${plan.price}</td>
                                    <td className="px-4 py-4">
                                        {plan.discountAmount > 0 ? (
                                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-50 text-orange-500 border border-orange-200">
                                                {plan.discountType === 'percentage' ? `${plan.discountAmount}%` : `$${plan.discountAmount}`}
                                            </span>
                                        ) : <span className="text-xs text-gray-400">—</span>}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-700">{plan.features.length}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <button onClick={() => handleViewActiveUsers(plan)}
                                                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${plan.activeUsers > 0 ? 'hover:bg-orange-50' : 'opacity-50 cursor-not-allowed'}`}
                                                style={plan.activeUsers > 0 ? { background: 'rgba(255,125,56,0.12)', color: '#FF7D38' } : { background: 'rgba(100,116,139,0.08)', color: '#94a3b8' }}>
                                                <UserCheck size={12} /> {plan.activeUsers || 0}
                                            </button>
                                            <button onClick={() => handleViewInactiveUsers(plan)}
                                                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${plan.inactiveUsers > 0 ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}
                                                style={plan.inactiveUsers > 0 ? { background: 'rgba(100,116,139,0.12)', color: '#64748b' } : { background: 'rgba(100,116,139,0.08)', color: '#94a3b8' }}>
                                                <UserX size={12} /> {plan.inactiveUsers || 0}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <button onClick={() => handleToggleStatus(plan.id)}
                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${plan.status === 'active' ? 'bg-orange-50 text-orange-500 border border-orange-200' : 'bg-gray-100 text-gray-500'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${plan.status === 'active' ? 'bg-orange-500 animate-pulse' : 'bg-gray-400'}`} />
                                            {plan.status}
                                        </button>
                                    </td>
                                    <td className="px-4 py-4 text-xs text-gray-500">{new Date(plan.updatedAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1.5">
                                            {hasViewPermission && (
                                                <button onClick={() => { setViewingPlan(plan); setIsViewOpen(true); }}
                                                    className="p-1.5 rounded-lg transition-colors text-gray-400 hover:text-orange-500 hover:bg-orange-50">
                                                    <Eye size={16} />
                                                </button>
                                            )}
                                            {hasEditPermission && (
                                                <button onClick={() => { setSelectedPlan(plan); setIsFormOpen(true); }}
                                                    className="p-1.5 rounded-lg transition-colors text-gray-400 hover:text-orange-500 hover:bg-orange-50">
                                                    <Edit size={16} />
                                                </button>
                                            )}
                                            {hasDeletePermission && (
                                                <button onClick={() => handleDelete(plan.id)}
                                                    className="p-1.5 rounded-lg transition-colors text-gray-400 hover:text-red-500 hover:bg-red-50">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-5 py-3 border-t border-orange-200 flex items-center justify-between bg-orange-50">
                    <p className="text-xs text-gray-500">Showing {filtered.length} of {plans.length} plans</p>
                </div>
            </Panel>

            {/* Modals */}
            <PlanFormModal isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setSelectedPlan(null); }}
                plan={selectedPlan} onSave={selectedPlan ? handleUpdate : handleCreate} />
            <ViewPlanModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} plan={viewingPlan}
                onViewActiveUsers={() => { setIsViewOpen(false); handleViewActiveUsers(viewingPlan); }}
                onViewInactiveUsers={() => { setIsViewOpen(false); handleViewInactiveUsers(viewingPlan); }} />
        </div>
    );
};

export default AdminPlanManagement;
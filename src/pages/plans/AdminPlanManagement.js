// pages/AdminPlanManagement.js - Optimized & Responsive with Saffron Theme
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Edit, Trash2, Eye, X, Check, AlertCircle,
    Package, Save, Archive, RefreshCw, Search,
    Users, UserCheck, UserX, Calendar, Clock,
    MoreVertical, ChevronDown, ChevronUp
} from 'lucide-react';

// ── Reusable Components ──────────────────────────────────────────────────────

const Panel = ({ children, className = "" }) => (
    <div
        className={`rounded-2xl p-4 sm:p-5 transition-all ${className}`}
        style={{
            background: 'linear-gradient(135deg, rgba(255,125,56,0.12), rgba(255,107,26,0.08))',
            border: '1px solid rgba(255,125,56,0.25)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(255,125,56,0.1)'
        }}
        onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(255,125,56,0.5)';
            e.currentTarget.style.boxShadow = '0 4px 30px rgba(255,125,56,0.2)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,125,56,0.25)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,125,56,0.1)';
        }}
    >
        {children}
    </div>
);

const StatCard = ({ label, value, icon: Icon, grad }) => (
    <div className="rounded-2xl p-4 flex items-center gap-3 transition-all hover:scale-105"
        style={{
            background: 'linear-gradient(135deg, rgba(255,125,56,0.12), rgba(255,107,26,0.08))',
            border: '1px solid rgba(255,125,56,0.25)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(255,125,56,0.1)'
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,125,56,0.5)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,125,56,0.25)'}
    >
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center shrink-0`}
            style={{ boxShadow: '0 0 15px rgba(255,125,56,0.3)' }}>
            <Icon size={15} className="text-white" />
        </div>
        <div className="min-w-0">
            <p className="text-[10px] font-medium truncate" style={{ color: '#FF9A5F' }}>{label}</p>
            <p className="text-lg sm:text-xl font-bold truncate" style={{ color: '#FF7D38' }}>{value}</p>
        </div>
    </div>
);

const StatusBadge = ({ status }) => (
    <button
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap`}
        style={status === 'active'
            ? { background: 'rgba(255,125,56,0.2)', color: '#FF7D38' }
            : { background: 'rgba(100,116,139,0.08)', color: '#94a3b8' }
        }
    >
        <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`} />
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
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#FF9A5F' }}>{label}</label>
            {children}
            {error && <p className="mt-1 text-xs" style={{ color: '#f87171' }}>{error}</p>}
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                style={{ background: 'rgba(2,32,60,0.95)', border: '1px solid rgba(255,125,56,0.3)' }}>
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(255,125,56,0.15)' }}>
                    <h2 className="text-lg font-bold" style={{ color: '#FF7D38' }}>{plan ? 'Edit Plan' : 'Create New Plan'}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-orange-500/10" style={{ color: '#FF9A5F' }}>
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Field label="Plan Name *" error={errors.name}>
                            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl transition-all" placeholder="e.g., Professional Plan"
                                style={{ background: 'rgba(255,125,56,0.08)', border: errors.name ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,125,56,0.2)', color: '#FF7D38' }} />
                        </Field>

                        <Field label="Description *" error={errors.description}>
                            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                rows={3} className="w-full px-4 py-2.5 rounded-xl transition-all resize-none" placeholder="Describe what this plan offers..."
                                style={{ background: 'rgba(255,125,56,0.08)', border: errors.description ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,125,56,0.2)', color: '#FF7D38' }} />
                        </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Field label="Price ($) *" error={errors.price}>
                                <input type="number" min="0" step="0.01" value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-4 py-2.5 rounded-xl transition-all"
                                    style={{ background: 'rgba(255,125,56,0.08)', border: errors.price ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,125,56,0.2)', color: '#FF7D38' }} />
                            </Field>
                            <Field label="Discount Type">
                                <select value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl transition-all"
                                    style={{ background: 'rgba(255,125,56,0.08)', border: '1px solid rgba(255,125,56,0.2)', color: '#FF7D38' }}>
                                    <option value="percentage" style={{ background: '#02203C' }}>Percentage (%)</option>
                                    <option value="fixed" style={{ background: '#02203C' }}>Fixed ($)</option>
                                </select>
                            </Field>
                            <Field label="Discount Amount" error={errors.discountAmount}>
                                <input type="number" min="0" step={formData.discountType === 'percentage' ? 1 : 0.01}
                                    value={formData.discountAmount} onChange={e => setFormData({ ...formData, discountAmount: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-4 py-2.5 rounded-xl transition-all"
                                    style={{ background: 'rgba(255,125,56,0.08)', border: errors.discountAmount ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,125,56,0.2)', color: '#FF7D38' }} />
                            </Field>
                        </div>

                        <Field label="Features *" error={errors.features}>
                            <div className="space-y-2">
                                {formData.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input type="text" value={feature} onChange={e => updateFeature(index, e.target.value)}
                                            className="flex-1 px-4 py-2.5 rounded-xl transition-all" placeholder={`Feature ${index + 1}`}
                                            style={{ background: 'rgba(255,125,56,0.08)', border: errors.features ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,125,56,0.2)', color: '#FF7D38' }} />
                                        <button type="button" onClick={() => removeFeature(index)} disabled={formData.features.length === 1}
                                            className="p-2 rounded-lg transition-colors hover:bg-red-500/10 disabled:opacity-30" style={{ color: '#f87171' }}>
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={addFeature} className="flex items-center gap-1.5 text-sm font-medium transition-colors" style={{ color: '#FF7D38' }}>
                                    <Plus size={16} /> Add Feature
                                </button>
                            </div>
                        </Field>
                    </form>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t rounded-b-2xl" style={{ borderColor: 'rgba(255,125,56,0.15)' }}>
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-xl transition-colors" style={{ color: '#FF9A5F' }}>
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all shadow-sm hover:shadow-orange-500/50"
                        style={{ background: 'linear-gradient(135deg, #FF7D38, #FF6B1A)', boxShadow: '0 0 15px rgba(255,125,56,0.3)' }}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                style={{ background: 'rgba(2,32,60,0.95)', border: '1px solid rgba(255,125,56,0.3)' }}>
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(255,125,56,0.15)' }}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.status === 'active' ? 'from-amber-400 to-orange-500' : 'from-slate-400 to-slate-500'} flex items-center justify-center`}>
                            <Package size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold" style={{ color: '#FF7D38' }}>{plan.name}</h2>
                            <p className="text-xs" style={{ color: '#FF9A5F' }}>Created {new Date(plan.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: '#FF9A5F' }}>
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-xl p-4" style={{ background: 'rgba(255,125,56,0.1)' }}>
                            <p className="text-xs font-medium" style={{ color: '#FF9A5F' }}>Status</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`w-2 h-2 rounded-full ${plan.status === 'active' ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`} />
                                <span className="text-sm font-semibold capitalize" style={{ color: '#FF7D38' }}>{plan.status}</span>
                            </div>
                        </div>
                        <div className="rounded-xl p-4" style={{ background: 'rgba(255,125,56,0.1)' }}>
                            <p className="text-xs font-medium" style={{ color: '#FF9A5F' }}>Pricing</p>
                            <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                                <span className="text-2xl font-bold" style={{ color: '#FF7D38' }}>${getFinalPrice().toFixed(2)}</span>
                                {plan.discountAmount > 0 && <span className="text-sm line-through" style={{ color: '#FF9A5F' }}>${plan.price}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl p-4" style={{ background: 'rgba(255,125,56,0.1)' }}>
                        <p className="text-xs font-medium mb-1" style={{ color: '#FF9A5F' }}>Description</p>
                        <p className="text-sm" style={{ color: '#FF7D38' }}>{plan.description}</p>
                    </div>

                    <div>
                        <p className="text-xs font-medium mb-3" style={{ color: '#FF9A5F' }}>Features</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {plan.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(255,125,56,0.08)' }}>
                                    <Check size={14} style={{ color: '#FF7D38' }} />
                                    <span className="text-sm" style={{ color: '#FF7D38' }}>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl p-4" style={{ background: 'rgba(255,125,56,0.1)', border: '1px solid rgba(255,125,56,0.15)' }}>
                        <p className="text-xs font-medium mb-3" style={{ color: '#FF9A5F' }}>Subscriber Statistics</p>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center">
                                <p className="text-2xl font-bold" style={{ color: '#FF7D38' }}>{plan.subscriberCount || 0}</p>
                                <p className="text-[10px]" style={{ color: '#FF9A5F' }}>Total</p>
                            </div>
                            <div className="text-center cursor-pointer rounded-lg p-2 transition-colors hover:bg-orange-500/10"
                                onClick={() => plan.activeUsers > 0 && onViewActiveUsers()}>
                                <p className={`text-2xl font-bold ${plan.activeUsers > 0 ? 'text-amber-400' : ''}`} style={{ color: plan.activeUsers > 0 ? '#FF7D38' : '#FF9A5F' }}>
                                    {plan.activeUsers || 0}
                                </p>
                                <p className="text-[10px] flex items-center justify-center gap-1" style={{ color: '#FF9A5F' }}>
                                    <UserCheck size={12} /> Active
                                </p>
                            </div>
                            <div className="text-center cursor-pointer rounded-lg p-2 transition-colors hover:bg-slate-400/10"
                                onClick={() => plan.inactiveUsers > 0 && onViewInactiveUsers()}>
                                <p className={`text-2xl font-bold ${plan.inactiveUsers > 0 ? 'text-slate-400' : ''}`} style={{ color: plan.inactiveUsers > 0 ? '#94a3b8' : '#FF9A5F' }}>
                                    {plan.inactiveUsers || 0}
                                </p>
                                <p className="text-[10px] flex items-center justify-center gap-1" style={{ color: '#FF9A5F' }}>
                                    <UserX size={12} /> Inactive
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs rounded-xl p-4" style={{ background: 'rgba(255,125,56,0.06)' }}>
                        <div>
                            <span className="font-medium" style={{ color: '#FF9A5F' }}>Created</span>
                            <p style={{ color: '#FF7D38' }}>{new Date(plan.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <span className="font-medium" style={{ color: '#FF9A5F' }}>Last Updated</span>
                            <p style={{ color: '#FF7D38' }}>{new Date(plan.updatedAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t rounded-b-2xl" style={{ borderColor: 'rgba(255,125,56,0.15)' }}>
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-xl transition-colors" style={{ color: '#FF9A5F' }}>
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
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.status === 'active' ? 'from-amber-400 to-orange-500' : 'from-slate-400 to-slate-500'} flex items-center justify-center shrink-0`}>
                        <Package size={16} className="text-white" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: '#FF7D38' }}>{plan.name}</p>
                        <p className="text-xs truncate" style={{ color: '#FF9A5F' }}>{plan.description}</p>
                    </div>
                </div>
                <StatusBadge status={plan.status} />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl py-2" style={{ background: 'rgba(255,125,56,0.08)' }}>
                    <p className="text-sm font-bold" style={{ color: '#FF7D38' }}>${plan.price}</p>
                    <p className="text-[10px]" style={{ color: '#FF9A5F' }}>Price</p>
                </div>
                <div className="rounded-xl py-2" style={{ background: 'rgba(255,125,56,0.08)' }}>
                    <p className="text-sm font-bold" style={{ color: '#FF7D38' }}>{plan.features.length}</p>
                    <p className="text-[10px]" style={{ color: '#FF9A5F' }}>Features</p>
                </div>
                <div className="rounded-xl py-2" style={{ background: 'rgba(255,125,56,0.08)' }}>
                    <p className="text-sm font-bold" style={{ color: '#FF7D38' }}>{plan.subscriberCount || 0}</p>
                    <p className="text-[10px]" style={{ color: '#FF9A5F' }}>Users</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => onViewActive(plan)} className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${plan.activeUsers > 0 ? 'hover:bg-orange-500/20' : 'opacity-50 cursor-not-allowed'}`}
                    style={plan.activeUsers > 0 ? { background: 'rgba(255,125,56,0.15)', color: '#FF7D38' } : { background: 'rgba(100,116,139,0.08)', color: '#FF9A5F' }}>
                    <UserCheck size={12} /> {plan.activeUsers || 0} Active
                </button>
                <button onClick={() => onViewInactive(plan)} className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${plan.inactiveUsers > 0 ? 'hover:bg-slate-400/20' : 'opacity-50 cursor-not-allowed'}`}
                    style={plan.inactiveUsers > 0 ? { background: 'rgba(100,116,139,0.12)', color: '#94a3b8' } : { background: 'rgba(100,116,139,0.08)', color: '#FF9A5F' }}>
                    <UserX size={12} /> {plan.inactiveUsers || 0} Inactive
                </button>
                <button onClick={() => setExpanded(!expanded)} className="ml-auto p-1 rounded-lg transition-colors" style={{ color: '#FF9A5F' }}>
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>

            {expanded && (
                <div className="pt-3 space-y-2" style={{ borderTop: '1px solid rgba(255,125,56,0.1)' }}>
                    <div className="flex items-center justify-between text-xs" style={{ color: '#FF9A5F' }}>
                        <span>Updated: {new Date(plan.updatedAt).toLocaleDateString()}</span>
                        <span>ID: {plan.id}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <button onClick={() => onView(plan)} className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition-colors" style={{ color: '#FF7D38' }}>
                            <Eye size={14} /> View
                        </button>
                        <button onClick={() => onEdit(plan)} className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition-colors" style={{ color: '#FF7D38' }}>
                            <Edit size={14} /> Edit
                        </button>
                        <button onClick={() => onToggleStatus(plan.id)} className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition-colors`}
                            style={{ color: plan.status === 'active' ? '#fcd34d' : '#FF7D38' }}>
                            {plan.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => onDelete(plan.id)} className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition-colors ml-auto" style={{ color: '#f87171' }}>
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
        { label: 'Inactive Plans', value: plans.filter(p => p.status === 'inactive').length, icon: Archive, grad: 'from-slate-400 to-slate-500' },
        { label: 'Total Subscribers', value: plans.reduce((acc, p) => acc + (p.subscriberCount || 0), 0), icon: Users, grad: 'from-yellow-500 to-amber-600' },
    ], [plans]);

    return (
        <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-lg sm:text-xl font-bold" style={{ color: '#FF7D38' }}>Plan Management</h1>
                    <p className="text-xs sm:text-sm mt-0.5" style={{ color: '#FF9A5F' }}>Create, manage, and customize subscription plans</p>
                </div>
                <button onClick={() => { setSelectedPlan(null); setIsFormOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-all shadow-sm hover:shadow-orange-500/50 shrink-0"
                    style={{ background: 'linear-gradient(135deg, #FF7D38, #FF6B1A)', boxShadow: '0 0 15px rgba(255,125,56,0.3)' }}>
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
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#FF9A5F' }} />
                        <input type="text" placeholder="Search plans..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all"
                            style={{ background: 'rgba(255,125,56,0.08)', border: '1px solid rgba(255,125,56,0.2)', color: '#FF7D38' }} />
                    </div>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3.5 py-2.5 text-sm rounded-xl transition-all"
                        style={{ background: 'rgba(255,125,56,0.08)', border: '1px solid rgba(255,125,56,0.2)', color: '#FF7D38' }}>
                        {['All', 'active', 'inactive'].map(s => <option key={s} value={s} style={{ background: '#02203C' }}>{s}</option>)}
                    </select>
                    <button onClick={loadPlans} className="flex items-center justify-center gap-2 px-3.5 py-2.5 text-sm rounded-xl transition-colors"
                        style={{ color: '#FF9A5F', border: '1px solid rgba(255,125,56,0.2)' }}>
                        <RefreshCw size={14} /> <span className="hidden sm:inline">Refresh</span>
                    </button>
                </div>
            </Panel>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {loading ? (
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-400 border-t-transparent mx-auto" />
                        <p className="text-sm mt-4" style={{ color: '#FF9A5F' }}>Loading plans...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 rounded-2xl" style={{ background: 'rgba(2,32,60,0.8)', border: '1px solid rgba(255,125,56,0.15)' }}>
                        <Package size={32} className="mx-auto mb-3 opacity-30" style={{ color: '#FF9A5F' }} />
                        <p className="text-sm" style={{ color: '#FF9A5F' }}>No plans match your filters</p>
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
                            <tr className="border-b" style={{ borderColor: 'rgba(255,125,56,0.1)' }}>
                                <th className="text-left text-xs font-semibold px-5 py-3.5" style={{ color: '#FF9A5F' }}>Plan</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5" style={{ color: '#FF9A5F' }}>Price</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5" style={{ color: '#FF9A5F' }}>Discount</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5" style={{ color: '#FF9A5F' }}>Features</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5" style={{ color: '#FF9A5F' }}>Users</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5" style={{ color: '#FF9A5F' }}>Status</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5" style={{ color: '#FF9A5F' }}>Updated</th>
                                <th className="text-xs font-semibold px-4 py-3.5" style={{ color: '#FF9A5F' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: 'rgba(255,125,56,0.06)' }}>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-16">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-400 border-t-transparent" />
                                            <p className="text-sm" style={{ color: '#FF9A5F' }}>Loading plans...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-16">
                                        <div className="flex flex-col items-center gap-2">
                                            <Package size={32} className="opacity-30" style={{ color: '#FF9A5F' }} />
                                            <p className="text-sm" style={{ color: '#FF9A5F' }}>No plans match your filters</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.map(plan => (
                                <tr key={plan.id} className="transition-colors" style={{ borderColor: 'rgba(255,125,56,0.06)' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,125,56,0.05)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${plan.status === 'active' ? 'from-amber-400 to-orange-500' : 'from-slate-400 to-slate-500'} flex items-center justify-center shrink-0`}>
                                                <Package size={14} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold" style={{ color: '#FF7D38' }}>{plan.name}</p>
                                                <p className="text-xs truncate max-w-[180px]" style={{ color: '#FF9A5F' }}>{plan.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm font-bold" style={{ color: '#FF7D38' }}>${plan.price}</td>
                                    <td className="px-4 py-4">
                                        {plan.discountAmount > 0 ? (
                                            <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: 'rgba(255,125,56,0.15)', color: '#FF7D38' }}>
                                                {plan.discountType === 'percentage' ? `${plan.discountAmount}%` : `$${plan.discountAmount}`}
                                            </span>
                                        ) : <span className="text-xs" style={{ color: '#FF9A5F' }}>—</span>}
                                    </td>
                                    <td className="px-4 py-4 text-sm" style={{ color: '#FF7D38' }}>{plan.features.length}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <button onClick={() => handleViewActiveUsers(plan)}
                                                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${plan.activeUsers > 0 ? 'hover:bg-orange-500/20' : 'opacity-50 cursor-not-allowed'}`}
                                                style={plan.activeUsers > 0 ? { background: 'rgba(255,125,56,0.15)', color: '#FF7D38' } : { background: 'rgba(100,116,139,0.08)', color: '#FF9A5F' }}>
                                                <UserCheck size={12} /> {plan.activeUsers || 0}
                                            </button>
                                            <button onClick={() => handleViewInactiveUsers(plan)}
                                                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${plan.inactiveUsers > 0 ? 'hover:bg-slate-400/20' : 'opacity-50 cursor-not-allowed'}`}
                                                style={plan.inactiveUsers > 0 ? { background: 'rgba(100,116,139,0.12)', color: '#94a3b8' } : { background: 'rgba(100,116,139,0.08)', color: '#FF9A5F' }}>
                                                <UserX size={12} /> {plan.inactiveUsers || 0}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <button onClick={() => handleToggleStatus(plan.id)}
                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors`}
                                            style={plan.status === 'active' ? { background: 'rgba(255,125,56,0.15)', color: '#FF7D38' } : { background: 'rgba(100,116,139,0.08)', color: '#94a3b8' }}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${plan.status === 'active' ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`} />
                                            {plan.status}
                                        </button>
                                    </td>
                                    <td className="px-4 py-4 text-xs" style={{ color: '#FF9A5F' }}>{new Date(plan.updatedAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <button onClick={() => { setViewingPlan(plan); setIsViewOpen(true); }}
                                                className="p-1.5 rounded-lg transition-colors" style={{ color: '#FF9A5F' }}>
                                                <Eye size={16} />
                                            </button>
                                            <button onClick={() => { setSelectedPlan(plan); setIsFormOpen(true); }}
                                                className="p-1.5 rounded-lg transition-colors" style={{ color: '#FF9A5F' }}>
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(plan.id)}
                                                className="p-1.5 rounded-lg transition-colors" style={{ color: '#FF9A5F' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: 'rgba(255,125,56,0.1)' }}>
                    <p className="text-xs" style={{ color: '#FF9A5F' }}>Showing {filtered.length} of {plans.length} plans</p>
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
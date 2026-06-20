// pages/AdminPlanManagement.js - Dark Theme
import React, { useState, useEffect } from 'react';
import {
    Plus, Edit, Trash2, Eye, X, Check, AlertCircle,
    Package, DollarSign, Percent, Tag, List, Save,
    Archive, RefreshCw, Search, Filter, ChevronDown,
    Users, Clock, Zap, Shield, Server, CreditCard,
    UserCheck, UserX, UserPlus, Calendar, Activity
} from 'lucide-react';
import ActivePlanUsers from './ActivePlanUsers';
import InactivePlanUsers from './InactivePlanUsers';

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

// ── Mock API Service ──────────────────────────────────────────────────────────
const PlanService = {
    getAll: () => {
        const stored = localStorage.getItem('plans');
        if (stored) return JSON.parse(stored);
        const defaultPlans = [
            {
                id: 1,
                name: "Basic",
                description: "Essential features for small teams",
                price: 29,
                discountType: "percentage",
                discountAmount: 0,
                features: [
                    "Up to 10 users",
                    "5GB storage",
                    "Basic support",
                    "Mobile app access"
                ],
                status: "active",
                createdAt: "2024-01-15T10:00:00Z",
                updatedAt: "2024-01-15T10:00:00Z",
                subscriberCount: 45,
                activeUsers: 38,
                inactiveUsers: 7
            },
            {
                id: 2,
                name: "Pro",
                description: "Advanced features for growing businesses",
                price: 99,
                discountType: "percentage",
                discountAmount: 10,
                features: [
                    "Up to 50 users",
                    "50GB storage",
                    "Priority support",
                    "Mobile app access",
                    "Advanced analytics",
                    "API access"
                ],
                status: "active",
                createdAt: "2024-01-15T10:00:00Z",
                updatedAt: "2024-02-01T14:30:00Z",
                subscriberCount: 128,
                activeUsers: 115,
                inactiveUsers: 13
            },
            {
                id: 3,
                name: "Enterprise",
                description: "Full-featured solution for large organizations",
                price: 299,
                discountType: "fixed",
                discountAmount: 50,
                features: [
                    "Unlimited users",
                    "500GB storage",
                    "24/7 dedicated support",
                    "Mobile app access",
                    "Advanced analytics",
                    "API access",
                    "Custom integrations",
                    "SLA guarantee"
                ],
                status: "inactive",
                createdAt: "2024-01-20T08:00:00Z",
                updatedAt: "2024-02-10T16:45:00Z",
                subscriberCount: 67,
                activeUsers: 0,
                inactiveUsers: 67
            },
            {
                id: 4,
                name: "Starter",
                description: "Perfect for individuals and freelancers",
                price: 9,
                discountType: "percentage",
                discountAmount: 0,
                features: [
                    "Up to 3 users",
                    "2GB storage",
                    "Email support",
                    "Basic features"
                ],
                status: "active",
                createdAt: "2024-02-01T09:00:00Z",
                updatedAt: "2024-02-01T09:00:00Z",
                subscriberCount: 234,
                activeUsers: 198,
                inactiveUsers: 36
            },
            {
                id: 5,
                name: "Business",
                description: "Comprehensive solution for mid-sized companies",
                price: 149,
                discountType: "fixed",
                discountAmount: 20,
                features: [
                    "Up to 100 users",
                    "200GB storage",
                    "Priority support",
                    "Mobile app access",
                    "Advanced analytics",
                    "API access",
                    "SSO integration"
                ],
                status: "inactive",
                createdAt: "2024-01-25T11:00:00Z",
                updatedAt: "2024-02-15T13:20:00Z",
                subscriberCount: 89,
                activeUsers: 0,
                inactiveUsers: 89
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
        plans[index] = {
            ...plans[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem('plans', JSON.stringify(plans));
        return plans[index];
    },
    delete: (id) => {
        const plans = PlanService.getAll();
        const filtered = plans.filter(p => p.id !== id);
        localStorage.setItem('plans', JSON.stringify(filtered));
        return filtered;
    },
    getActiveUsers: (planId) => {
        const users = JSON.parse(localStorage.getItem('planUsers') || '[]');
        return users.filter(u => u.planId === planId && u.status === 'active');
    },
    getInactiveUsers: (planId) => {
        const users = JSON.parse(localStorage.getItem('planUsers') || '[]');
        return users.filter(u => u.planId === planId && u.status === 'inactive');
    }
};

// ── Generate mock users for each plan ──────────────────────────────────────
const generateMockUsers = () => {
    if (localStorage.getItem('planUsers')) return;
    
    const plans = PlanService.getAll();
    const users = [];
    const statuses = ['active', 'active', 'active', 'active', 'inactive'];
    const names = [
        'Raj Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh',
        'Meera Joshi', 'Arjun Nair', 'Divya Menon', 'Kiran Bose', 'Anita Desai',
        'Rohan Gupta', 'Pooja Mehta', 'Suresh Iyer', 'Neha Kapoor', 'Manish Tiwari',
        'Sunita Rao', 'Deepak Verma', 'Kavya Nair', 'Rahul Khanna', 'Anjali Prasad'
    ];
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
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        discountType: 'percentage',
        discountAmount: 0,
        features: ['']
    });
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
            setFormData({
                name: '',
                description: '',
                price: 0,
                discountType: 'percentage',
                discountAmount: 0,
                features: ['']
            });
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
        if (!formData.features.some(f => f.trim())) {
            newErrors.features = 'At least one feature is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const cleanedData = {
            ...formData,
            features: formData.features.filter(f => f.trim())
        };
        onSave(cleanedData);
        onClose();
    };

    const addFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, '']
        }));
    };

    const removeFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const updateFeature = (index, value) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.map((f, i) => i === index ? value : f)
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
            <div 
                className="rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                style={{
                    background: 'rgba(20, 16, 36, 0.95)',
                    border: '1px solid rgba(139,92,246,0.2)',
                }}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(139,92,246,0.15)' }}>
                    <h2 className="text-lg font-bold" style={{ color: '#e2d9f3' }}>
                        {plan ? 'Edit Plan' : 'Create New Plan'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: '#5a4f72' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#c4b5fd'; e.currentTarget.style.background = 'rgba(139,92,246,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#5a4f72'; e.currentTarget.style.background = 'transparent'; }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#9c8fc0' }}>
                                Plan Name <span style={{ color: '#f87171' }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl transition-all"
                                style={{
                                    background: 'rgba(139,92,246,0.08)',
                                    border: errors.name ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(139,92,246,0.15)',
                                    color: '#e2d9f3'
                                }}
                                placeholder="e.g., Professional Plan"
                                onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
                                onBlur={e => e.currentTarget.style.borderColor = errors.name ? 'rgba(239,68,68,0.3)' : 'rgba(139,92,246,0.15)'}
                            />
                            {errors.name && <p className="mt-1 text-xs" style={{ color: '#f87171' }}>{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#9c8fc0' }}>
                                Description <span style={{ color: '#f87171' }}>*</span>
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-xl transition-all resize-none"
                                style={{
                                    background: 'rgba(139,92,246,0.08)',
                                    border: errors.description ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(139,92,246,0.15)',
                                    color: '#e2d9f3'
                                }}
                                placeholder="Describe what this plan offers..."
                                onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
                                onBlur={e => e.currentTarget.style.borderColor = errors.description ? 'rgba(239,68,68,0.3)' : 'rgba(139,92,246,0.15)'}
                            />
                            {errors.description && <p className="mt-1 text-xs" style={{ color: '#f87171' }}>{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: '#9c8fc0' }}>
                                    Price ($) <span style={{ color: '#f87171' }}>*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-4 py-2.5 rounded-xl transition-all"
                                    style={{
                                        background: 'rgba(139,92,246,0.08)',
                                        border: errors.price ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(139,92,246,0.15)',
                                        color: '#e2d9f3'
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
                                    onBlur={e => e.currentTarget.style.borderColor = errors.price ? 'rgba(239,68,68,0.3)' : 'rgba(139,92,246,0.15)'}
                                />
                                {errors.price && <p className="mt-1 text-xs" style={{ color: '#f87171' }}>{errors.price}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: '#9c8fc0' }}>
                                    Discount Type
                                </label>
                                <select
                                    value={formData.discountType}
                                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl transition-all"
                                    style={{
                                        background: 'rgba(139,92,246,0.08)',
                                        border: '1px solid rgba(139,92,246,0.15)',
                                        color: '#e2d9f3'
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
                                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'}
                                >
                                    <option value="percentage" style={{ background: '#1a1430', color: '#e2d9f3' }}>Percentage (%)</option>
                                    <option value="fixed" style={{ background: '#1a1430', color: '#e2d9f3' }}>Fixed ($)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: '#9c8fc0' }}>
                                    Discount Amount
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step={formData.discountType === 'percentage' ? 1 : 0.01}
                                    value={formData.discountAmount}
                                    onChange={(e) => setFormData({ ...formData, discountAmount: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-4 py-2.5 rounded-xl transition-all"
                                    style={{
                                        background: 'rgba(139,92,246,0.08)',
                                        border: errors.discountAmount ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(139,92,246,0.15)',
                                        color: '#e2d9f3'
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
                                    onBlur={e => e.currentTarget.style.borderColor = errors.discountAmount ? 'rgba(239,68,68,0.3)' : 'rgba(139,92,246,0.15)'}
                                />
                                {errors.discountAmount && <p className="mt-1 text-xs" style={{ color: '#f87171' }}>{errors.discountAmount}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: '#9c8fc0' }}>
                                Features <span style={{ color: '#f87171' }}>*</span>
                            </label>
                            <div className="space-y-2">
                                {formData.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => updateFeature(index, e.target.value)}
                                            className="flex-1 px-4 py-2.5 rounded-xl transition-all"
                                            style={{
                                                background: 'rgba(139,92,246,0.08)',
                                                border: errors.features ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(139,92,246,0.15)',
                                                color: '#e2d9f3'
                                            }}
                                            placeholder={`Feature ${index + 1}`}
                                            onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
                                            onBlur={e => e.currentTarget.style.borderColor = errors.features ? 'rgba(239,68,68,0.3)' : 'rgba(139,92,246,0.15)'}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="p-2 rounded-lg transition-colors"
                                            style={{ color: '#f87171' }}
                                            disabled={formData.features.length === 1}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                                {errors.features && <p className="mt-1 text-xs" style={{ color: '#f87171' }}>{errors.features}</p>}
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="flex items-center gap-1.5 text-sm font-medium transition-colors"
                                    style={{ color: '#a78bfa' }}
                                    onMouseEnter={e => { e.currentTarget.style.color = '#c4b5fd'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = '#a78bfa'; }}
                                >
                                    <Plus size={16} /> Add Feature
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t rounded-b-2xl" style={{ borderColor: 'rgba(139,92,246,0.15)' }}>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium rounded-xl transition-colors"
                        style={{ color: '#9c8fc0' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(124,58,237,0.4)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 10px rgba(124,58,237,0.2)'; }}
                    >
                        <Save size={16} />
                        {plan ? 'Update Plan' : 'Create Plan'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── View Plan Modal ───────────────────────────────────────────────────────────
const ViewPlanModal = ({ isOpen, onClose, plan, onViewActiveUsers, onViewInactiveUsers }) => {
    if (!isOpen || !plan) return null;

    const getDiscountDisplay = () => {
        if (plan.discountAmount === 0) return 'No discount';
        if (plan.discountType === 'percentage') return `${plan.discountAmount}% off`;
        return `$${plan.discountAmount} off`;
    };

    const getFinalPrice = () => {
        if (plan.discountAmount === 0) return plan.price;
        if (plan.discountType === 'percentage') {
            return plan.price * (1 - plan.discountAmount / 100);
        }
        return Math.max(0, plan.price - plan.discountAmount);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
            <div 
                className="rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                style={{
                    background: 'rgba(20, 16, 36, 0.95)',
                    border: '1px solid rgba(139,92,246,0.2)',
                }}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(139,92,246,0.15)' }}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.status === 'active' ? 'from-emerald-400 to-teal-500' : 'from-slate-400 to-slate-500'} flex items-center justify-center`}>
                            <Package size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold" style={{ color: '#e2d9f3' }}>{plan.name}</h2>
                            <p className="text-xs" style={{ color: '#5a4f72' }}>
                                Created {new Date(plan.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: '#5a4f72' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#c4b5fd'; e.currentTarget.style.background = 'rgba(139,92,246,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#5a4f72'; e.currentTarget.style.background = 'transparent'; }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-xl p-4" style={{ background: 'rgba(139,92,246,0.08)' }}>
                            <p className="text-xs font-medium" style={{ color: '#5a4f72' }}>Status</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`w-2 h-2 rounded-full ${plan.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                <span className="text-sm font-semibold capitalize" style={{ color: '#e2d9f3' }}>{plan.status}</span>
                            </div>
                        </div>
                        <div className="rounded-xl p-4" style={{ background: 'rgba(139,92,246,0.08)' }}>
                            <p className="text-xs font-medium" style={{ color: '#5a4f72' }}>Pricing</p>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-2xl font-bold" style={{ color: '#e2d9f3' }}>${getFinalPrice().toFixed(2)}</span>
                                {plan.discountAmount > 0 && (
                                    <span className="text-sm line-through" style={{ color: '#5a4f72' }}>${plan.price}</span>
                                )}
                                <span className="text-xs font-medium ml-auto" style={{ color: '#34d399' }}>{getDiscountDisplay()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl p-4" style={{ background: 'rgba(139,92,246,0.08)' }}>
                        <p className="text-xs font-medium mb-1" style={{ color: '#5a4f72' }}>Description</p>
                        <p className="text-sm" style={{ color: '#c4b5fd' }}>{plan.description}</p>
                    </div>

                    <div>
                        <p className="text-xs font-medium mb-3" style={{ color: '#5a4f72' }}>Features</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {plan.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(139,92,246,0.06)' }}>
                                    <Check size={14} style={{ color: '#34d399' }} />
                                    <span className="text-sm" style={{ color: '#c4b5fd' }}>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl p-4" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.1)' }}>
                        <p className="text-xs font-medium mb-3" style={{ color: '#5a4f72' }}>Subscriber Statistics</p>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center">
                                <p className="text-2xl font-bold" style={{ color: '#e2d9f3' }}>{plan.subscriberCount || 0}</p>
                                <p className="text-[10px]" style={{ color: '#5a4f72' }}>Total</p>
                            </div>
                            <div 
                                className="text-center cursor-pointer rounded-lg p-2 transition-colors"
                                onClick={() => plan.activeUsers > 0 && onViewActiveUsers()}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.08)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                            >
                                <p className={`text-2xl font-bold ${plan.activeUsers > 0 ? 'text-emerald-400' : ''}`} style={{ color: plan.activeUsers > 0 ? '#34d399' : '#5a4f72' }}>
                                    {plan.activeUsers || 0}
                                </p>
                                <p className="text-[10px] flex items-center justify-center gap-1" style={{ color: '#5a4f72' }}>
                                    <UserCheck size={12} /> Active
                                    {plan.activeUsers > 0 && <span className="text-[8px]" style={{ color: '#34d399' }}>↗</span>}
                                </p>
                            </div>
                            <div 
                                className="text-center cursor-pointer rounded-lg p-2 transition-colors"
                                onClick={() => plan.inactiveUsers > 0 && onViewInactiveUsers()}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(100,116,139,0.08)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                            >
                                <p className={`text-2xl font-bold ${plan.inactiveUsers > 0 ? '' : ''}`} style={{ color: plan.inactiveUsers > 0 ? '#94a3b8' : '#5a4f72' }}>
                                    {plan.inactiveUsers || 0}
                                </p>
                                <p className="text-[10px] flex items-center justify-center gap-1" style={{ color: '#5a4f72' }}>
                                    <UserX size={12} /> Inactive
                                    {plan.inactiveUsers > 0 && <span className="text-[8px]" style={{ color: '#94a3b8' }}>↗</span>}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs rounded-xl p-4" style={{ background: 'rgba(139,92,246,0.06)' }}>
                        <div>
                            <span className="font-medium" style={{ color: '#5a4f72' }}>Created</span>
                            <p style={{ color: '#9c8fc0' }}>{new Date(plan.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <span className="font-medium" style={{ color: '#5a4f72' }}>Last Updated</span>
                            <p style={{ color: '#9c8fc0' }}>{new Date(plan.updatedAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t rounded-b-2xl" style={{ borderColor: 'rgba(139,92,246,0.15)' }}>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium rounded-xl transition-colors"
                        style={{ color: '#9c8fc0' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const AdminPlanManagement = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [viewingPlan, setViewingPlan] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isActiveUsersOpen, setIsActiveUsersOpen] = useState(false);
    const [isInactiveUsersOpen, setIsInactiveUsersOpen] = useState(false);
    const [userListPlan, setUserListPlan] = useState(null);

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

    useEffect(() => {
        loadPlans();
    }, []);

    const handleCreate = (data) => {
        const newPlan = PlanService.create(data);
        setPlans(prev => [{
            ...newPlan,
            subscriberCount: 0,
            activeUsers: 0,
            inactiveUsers: 0
        }, ...prev]);
    };

    const handleUpdate = (data) => {
        const updated = PlanService.update(selectedPlan.id, data);
        setPlans(prev => prev.map(p => p.id === updated.id ? updated : p));
        setSelectedPlan(null);
    };

    const handleDelete = (id) => {
        if (!window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) return;
        const remaining = PlanService.delete(id);
        setPlans(remaining);
    };

    const handleToggleStatus = (id) => {
        const plan = plans.find(p => p.id === id);
        if (!plan) return;
        const newStatus = plan.status === 'active' ? 'inactive' : 'active';
        const updated = PlanService.update(id, { status: newStatus });
        setPlans(prev => prev.map(p => p.id === updated.id ? updated : p));
    };

    const handleEdit = (plan) => {
        setSelectedPlan(plan);
        setIsFormOpen(true);
    };

    const handleView = (plan) => {
        setViewingPlan(plan);
        setIsViewOpen(true);
    };

    const handleViewActiveUsers = (plan) => {
        setUserListPlan(plan);
        setIsActiveUsersOpen(true);
    };

    const handleViewInactiveUsers = (plan) => {
        setUserListPlan(plan);
        setIsInactiveUsersOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedPlan(null);
    };

    const handleFormSave = (data) => {
        if (selectedPlan) {
            handleUpdate(data);
        } else {
            handleCreate(data);
        }
    };

    const filtered = plans.filter(plan => {
        const matchSearch = plan.name.toLowerCase().includes(search.toLowerCase()) ||
            plan.description.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'All' || plan.status === filterStatus;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold" style={{ color: '#e2d9f3' }}>Plan Management</h1>
                    <p className="text-sm mt-0.5" style={{ color: '#5a4f72' }}>Create, manage, and customize subscription plans</p>
                </div>
                <button
                    onClick={() => {
                        setSelectedPlan(null);
                        setIsFormOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-colors shadow-sm shrink-0"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(124,58,237,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 10px rgba(124,58,237,0.2)'; }}
                >
                    <Plus size={16} /> New Plan
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    { label: 'Total Plans', value: plans.length, icon: Package, grad: 'from-violet-500 to-purple-600' },
                    { label: 'Active Plans', value: plans.filter(p => p.status === 'active').length, icon: Check, grad: 'from-emerald-500 to-teal-500' },
                    { label: 'Inactive Plans', value: plans.filter(p => p.status === 'inactive').length, icon: Archive, grad: 'from-slate-400 to-slate-500' },
                    { label: 'Total Subscribers', value: plans.reduce((acc, p) => acc + (p.subscriberCount || 0), 0), icon: Users, grad: 'from-amber-400 to-orange-500' },
                ].map(s => (
                    <div key={s.label} className="rounded-2xl p-4 flex items-center gap-3 transition-all"
                        style={{
                            background: 'rgba(20, 16, 36, 0.8)',
                            border: '1px solid rgba(139,92,246,0.15)',
                            backdropFilter: 'blur(12px)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.35)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'}
                    >
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.grad} flex items-center justify-center shrink-0`}
                            style={{ boxShadow: '0 0 10px rgba(124,58,237,0.3)' }}>
                            <s.icon size={15} className="text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-medium" style={{ color: '#5a4f72' }}>{s.label}</p>
                            <p className="text-xl font-bold" style={{ color: '#e2d9f3' }}>{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <Panel>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#5a4f72' }} />
                        <input
                            type="text"
                            placeholder="Search plans by name or description…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl transition-all"
                            style={{
                                background: 'rgba(139,92,246,0.08)',
                                border: '1px solid rgba(139,92,246,0.15)',
                                color: '#e2d9f3'
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
                            onBlur={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'}
                            placeholder="Search plans..."
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3.5 py-2.5 text-sm rounded-xl transition-all"
                        style={{
                            background: 'rgba(139,92,246,0.08)',
                            border: '1px solid rgba(139,92,246,0.15)',
                            color: '#e2d9f3'
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.15)'}
                    >
                        {['All', 'active', 'inactive'].map(s => <option key={s} value={s} style={{ background: '#1a1430', color: '#e2d9f3' }}>{s}</option>)}
                    </select>
                    <button
                        onClick={loadPlans}
                        className="flex items-center justify-center gap-2 px-3.5 py-2.5 text-sm rounded-xl transition-colors"
                        style={{ color: '#9c8fc0', border: '1px solid rgba(139,92,246,0.15)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; e.currentTarget.style.color = '#c4b5fd'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9c8fc0'; }}
                    >
                        <RefreshCw size={14} /> <span className="hidden sm:inline">Refresh</span>
                    </button>
                </div>
            </Panel>

            {/* Table */}
            <Panel className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b" style={{ borderColor: 'rgba(139,92,246,0.1)' }}>
                                <th className="text-left text-xs font-semibold px-5 py-3.5" style={{ color: '#5a4f72' }}>Plan</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5" style={{ color: '#5a4f72' }}>Price</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5" style={{ color: '#5a4f72' }}>Discount</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5" style={{ color: '#5a4f72' }}>Features</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5" style={{ color: '#5a4f72' }}>Users</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5" style={{ color: '#5a4f72' }}>Status</th>
                                <th className="text-left text-xs font-semibold px-4 py-3.5" style={{ color: '#5a4f72' }}>Updated</th>
                                <th className="text-xs font-semibold px-4 py-3.5" style={{ color: '#5a4f72' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: 'rgba(139,92,246,0.06)' }}>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-16">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet-400 border-t-transparent" />
                                            <p className="text-sm" style={{ color: '#5a4f72' }}>Loading plans...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-16">
                                        <div className="flex flex-col items-center gap-2">
                                            <Package size={32} className="opacity-30" style={{ color: '#5a4f72' }} />
                                            <p className="text-sm" style={{ color: '#5a4f72' }}>No plans match your filters</p>
                                            <button
                                                onClick={() => {
                                                    setSearch('');
                                                    setFilterStatus('All');
                                                }}
                                                className="text-xs font-medium transition-colors"
                                                style={{ color: '#a78bfa' }}
                                                onMouseEnter={e => { e.currentTarget.style.color = '#c4b5fd'; }}
                                                onMouseLeave={e => { e.currentTarget.style.color = '#a78bfa'; }}
                                            >
                                                Clear filters
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.map(plan => (
                                <tr key={plan.id} className="transition-colors" style={{ borderColor: 'rgba(139,92,246,0.06)' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.04)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${plan.status === 'active' ? 'from-emerald-400 to-teal-500' : 'from-slate-400 to-slate-500'} flex items-center justify-center`}>
                                                <Package size={14} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold" style={{ color: '#e2d9f3' }}>{plan.name}</p>
                                                <p className="text-xs truncate max-w-[180px]" style={{ color: '#5a4f72' }}>{plan.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="text-sm font-bold" style={{ color: '#e2d9f3' }}>${plan.price}</p>
                                    </td>
                                    <td className="px-4 py-4">
                                        {plan.discountAmount > 0 ? (
                                            <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>
                                                {plan.discountType === 'percentage' ? `${plan.discountAmount}%` : `$${plan.discountAmount}`}
                                            </span>
                                        ) : (
                                            <span className="text-xs" style={{ color: '#5a4f72' }}>—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-sm" style={{ color: '#9c8fc0' }}>{plan.features.length}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => handleViewActiveUsers(plan)}
                                                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${plan.activeUsers > 0 ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                                                style={plan.activeUsers > 0 ? { background: 'rgba(52,211,153,0.12)', color: '#34d399' } : { background: 'rgba(100,116,139,0.08)', color: '#5a4f72' }}
                                                onMouseEnter={e => { if (plan.activeUsers > 0) { e.currentTarget.style.background = 'rgba(52,211,153,0.2)'; } }}
                                                onMouseLeave={e => { if (plan.activeUsers > 0) { e.currentTarget.style.background = 'rgba(52,211,153,0.12)'; } }}
                                            >
                                                <UserCheck size={12} />
                                                {plan.activeUsers || 0}
                                            </button>
                                            <button
                                                onClick={() => handleViewInactiveUsers(plan)}
                                                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${plan.inactiveUsers > 0 ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                                                style={plan.inactiveUsers > 0 ? { background: 'rgba(100,116,139,0.12)', color: '#94a3b8' } : { background: 'rgba(100,116,139,0.08)', color: '#5a4f72' }}
                                                onMouseEnter={e => { if (plan.inactiveUsers > 0) { e.currentTarget.style.background = 'rgba(100,116,139,0.2)'; } }}
                                                onMouseLeave={e => { if (plan.inactiveUsers > 0) { e.currentTarget.style.background = 'rgba(100,116,139,0.12)'; } }}
                                            >
                                                <UserX size={12} />
                                                {plan.inactiveUsers || 0}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(plan.id)}
                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors`}
                                            style={plan.status === 'active'
                                                ? { background: 'rgba(52,211,153,0.12)', color: '#34d399' }
                                                : { background: 'rgba(100,116,139,0.08)', color: '#94a3b8' }
                                            }
                                            onMouseEnter={e => { e.currentTarget.style.background = plan.status === 'active' ? 'rgba(52,211,153,0.2)' : 'rgba(100,116,139,0.15)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = plan.status === 'active' ? 'rgba(52,211,153,0.12)' : 'rgba(100,116,139,0.08)'; }}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${plan.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                            {plan.status}
                                        </button>
                                    </td>
                                    <td className="px-4 py-4 text-xs" style={{ color: '#5a4f72' }}>
                                        {new Date(plan.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => handleView(plan)}
                                                className="p-1.5 rounded-lg transition-colors"
                                                style={{ color: '#5a4f72' }}
                                                onMouseEnter={e => { e.currentTarget.style.color = '#a78bfa'; e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.color = '#5a4f72'; e.currentTarget.style.background = 'transparent'; }}
                                                title="View"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(plan)}
                                                className="p-1.5 rounded-lg transition-colors"
                                                style={{ color: '#5a4f72' }}
                                                onMouseEnter={e => { e.currentTarget.style.color = '#60a5fa'; e.currentTarget.style.background = 'rgba(96,165,250,0.08)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.color = '#5a4f72'; e.currentTarget.style.background = 'transparent'; }}
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(plan.id)}
                                                className="p-1.5 rounded-lg transition-colors"
                                                style={{ color: '#5a4f72' }}
                                                onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.color = '#5a4f72'; e.currentTarget.style.background = 'transparent'; }}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: 'rgba(139,92,246,0.1)' }}>
                    <p className="text-xs" style={{ color: '#5a4f72' }}>
                        Showing {filtered.length} of {plans.length} plans
                    </p>
                </div>
            </Panel>

            {/* Modals */}
            <PlanFormModal
                isOpen={isFormOpen}
                onClose={handleFormClose}
                plan={selectedPlan}
                onSave={handleFormSave}
            />

            <ViewPlanModal
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                plan={viewingPlan}
                onViewActiveUsers={() => {
                    setIsViewOpen(false);
                    handleViewActiveUsers(viewingPlan);
                }}
                onViewInactiveUsers={() => {
                    setIsViewOpen(false);
                    handleViewInactiveUsers(viewingPlan);
                }}
            />

            {isActiveUsersOpen && userListPlan && (
                <ActivePlanUsers
                    plan={userListPlan}
                    onClose={() => {
                        setIsActiveUsersOpen(false);
                        setUserListPlan(null);
                    }}
                />
            )}

            {isInactiveUsersOpen && userListPlan && (
                <InactivePlanUsers
                    plan={userListPlan}
                    onClose={() => {
                        setIsInactiveUsersOpen(false);
                        setUserListPlan(null);
                    }}
                />
            )}
        </div>
    );
};

export default AdminPlanManagement;
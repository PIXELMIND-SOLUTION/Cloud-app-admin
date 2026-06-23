// components/Sidebar.js
import React, { useState } from 'react';
import {
    LayoutDashboard, Users, Settings, X, ChevronDown,
    LogOut, ChevronRight, BarChart2, MailWarning, LineChart, Cloud
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'

const NAV_ITEMS = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Registered Users", icon: Users, path: "/admin/users" },
    {
        label: "Plans",
        icon: BarChart2,
        path: "/admin/plans",
        children: [{ label: "All Plans", path: "/admin/plans" }]
    },
    { label: "Analytics", icon: LineChart, path: "/admin/analytics" },
    { label: "Reports", icon: MailWarning, path: "/admin/reports" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
];

export const Sidebar = ({ active, setActive, open, setOpen }) => {
    const [expanded, setExpanded] = useState({});
    const navigate = useNavigate();

    const toggle = (key) => setExpanded(p => ({ ...p, [key]: !p[key] }));

    const handleLogout = () => {
        sessionStorage.removeItem("adminAuth");
        navigate("/", { replace: true });
    };

    return (
        <>
            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-10 lg:hidden"
                    style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={`
                    fixed top-0 left-0 h-full z-30 w-64 flex flex-col
                    transition-transform duration-300
                    ${open ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0 lg:static lg:flex lg:h-screen lg:shrink-0
                `}
                style={{
                    background: 'rgba(10, 8, 20, 0.95)',
                    borderRight: '1px solid rgba(139,92,246,0.18)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                {/* Ambient orb inside sidebar */}
                <div
                    className="absolute pointer-events-none"
                    style={{
                        width: 200, height: 200,
                        background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
                        top: -40, left: -40, borderRadius: '50%',
                    }}
                />

                {/* Logo */}
                <div
                    className="flex items-center justify-between px-5 shrink-0"
                    style={{ height: 64, borderBottom: '1px solid rgba(139,92,246,0.15)' }}
                >
                    <div className="flex items-center gap-2.5">
                        <div
                            className="w-8 h-8 flex items-center justify-center rounded-xl"
                        >
                            <img src={logo} className='h-8 w-8 object-cover' />
                        </div>
                        <span className="font-bold text-lg tracking-tight" style={{ color: '#e2d9f3' }}>RV Cloud Admin</span>
                    </div>
                    <button
                        className="lg:hidden transition-colors"
                        style={{ color: '#7c6fa0' }}
                        onClick={() => setOpen(false)}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Profile */}
                <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(139,92,246,0.08)' }}>
                    <div
                        className="flex items-center gap-3 rounded-xl p-3"
                        style={{
                            background: 'rgba(139,92,246,0.1)',
                            border: '1px solid rgba(139,92,246,0.2)',
                        }}
                    >
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #6d28d9, #9333ea)' }}
                        >
                            <img src='/admin.png' className='w-9 h-9 object-cover' alt="admin" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color: '#e2d9f3' }}>Vijay N</p>
                            <p className="text-xs" style={{ color: '#7c6fa0' }}>Super Admin</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
                    {NAV_ITEMS.map(item => {
                        const isActive = active === item.path;
                        const hasChildren = item.children?.length;
                        const isExpanded = expanded[item.path];

                        return (
                            <div key={item.path}>
                                <button
                                    onClick={() => {
                                        if (hasChildren) {
                                            toggle(item.path);
                                        } else {
                                            setActive(item.path);
                                            navigate(item.path);
                                            setOpen(false);
                                        }
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative"
                                    style={
                                        isActive
                                            ? {
                                                background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.2))',
                                                color: '#e2d9f3',
                                                border: '1px solid rgba(139,92,246,0.35)',
                                            }
                                            : { color: '#7c6fa0', border: '1px solid transparent' }
                                    }
                                    onMouseEnter={e => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'rgba(139,92,246,0.1)';
                                            e.currentTarget.style.color = '#c4b5fd';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = '#7c6fa0';
                                        }
                                    }}
                                >
                                    {/* Active glow bar */}
                                    {isActive && (
                                        <span
                                            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r"
                                            style={{
                                                width: 3, height: 20,
                                                background: 'linear-gradient(180deg, #7c3aed, #a855f7)',
                                                boxShadow: '0 0 10px rgba(139,92,246,0.8)',
                                            }}
                                        />
                                    )}
                                    <item.icon
                                        size={16}
                                        style={{ color: isActive ? '#c4b5fd' : '#5a4f72', flexShrink: 0 }}
                                    />
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {hasChildren && (
                                        <ChevronDown
                                            size={13}
                                            className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                            style={{ color: isActive ? '#c4b5fd' : '#3d3358' }}
                                        />
                                    )}
                                </button>

                                {hasChildren && isExpanded && (
                                    <div
                                        className="ml-5 mt-0.5 space-y-0.5 pl-3"
                                        style={{ borderLeft: '1px solid rgba(139,92,246,0.15)' }}
                                    >
                                        {item.children.map((child) => (
                                            <button
                                                key={child.path}
                                                onClick={() => {
                                                    setActive(child.path);
                                                    navigate(child.path);
                                                    setOpen(false);
                                                }}
                                                className="w-full text-left text-xs px-2 py-2 rounded-lg transition-colors"
                                                style={
                                                    active === child.path
                                                        ? { color: '#a78bfa', fontWeight: 600, background: 'rgba(139,92,246,0.12)' }
                                                        : { color: '#5a4f72' }
                                                }
                                                onMouseEnter={e => {
                                                    if (active !== child.path) {
                                                        e.currentTarget.style.color = '#c4b5fd';
                                                        e.currentTarget.style.background = 'rgba(139,92,246,0.08)';
                                                    }
                                                }}
                                                onMouseLeave={e => {
                                                    if (active !== child.path) {
                                                        e.currentTarget.style.color = '#5a4f72';
                                                        e.currentTarget.style.background = 'transparent';
                                                    }
                                                }}
                                            >
                                                <ChevronRight size={10} className="inline mr-1 opacity-50" />
                                                {child.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="px-3 pb-4 shrink-0" style={{ borderTop: '1px solid rgba(139,92,246,0.1)' }}>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors mt-2"
                        style={{ color: '#5a4f72' }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
                            e.currentTarget.style.color = '#f87171';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#5a4f72';
                        }}
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
};
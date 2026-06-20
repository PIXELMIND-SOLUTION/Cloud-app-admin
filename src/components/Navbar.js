// components/Navbar.js
import React from 'react';
import { Menu, Bell, ChevronRight } from 'lucide-react';

const NAV_ITEMS = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Registered Users", path: "/admin/users" },
    { label: "Analytics", path: "/admin/analytics" },
    { label: "Reports", path: "/admin/reports" },
    { label: "All Plans", path: "/admin/plans" },
    { label: "Settings", path: "/admin/settings" },
];

export const Navbar = ({ setOpen, activePage }) => {
    const label = NAV_ITEMS.find(n => n.path === activePage)?.label ?? "Dashboard";

    return (
        <header
            className="flex items-center px-4 gap-4 shrink-0 sticky top-0 z-10"
            style={{
                height: 64,
                background: 'rgba(10, 8, 20, 0.9)',
                borderBottom: '1px solid rgba(139,92,246,0.18)',
                backdropFilter: 'blur(20px)',
            }}
        >
            {/* Mobile menu toggle */}
            <button
                className="lg:hidden p-1.5 rounded-lg transition-colors"
                style={{ color: '#7c6fa0' }}
                onClick={() => setOpen(true)}
                onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(139,92,246,0.12)';
                    e.currentTarget.style.color = '#c4b5fd';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#7c6fa0';
                }}
            >
                <Menu size={20} />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
                <span style={{ color: '#3d3358', fontSize: 13 }}>CloudApp</span>
                <ChevronRight size={12} style={{ color: '#2d2545' }} />
                <span
                    className="font-semibold"
                    style={{ color: '#c4b5fd', fontSize: 13 }}
                >
                    {label}
                </span>
            </div>

            <div className="flex-1" />

            {/* Actions */}
            <div className="flex items-center gap-2">
                {/* Notification bell */}
                <button
                    className="relative p-2 rounded-xl transition-all"
                    style={{
                        background: 'rgba(139,92,246,0.08)',
                        border: '1px solid rgba(139,92,246,0.18)',
                        color: '#7c6fa0',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(139,92,246,0.18)';
                        e.currentTarget.style.color = '#c4b5fd';
                        e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(139,92,246,0.08)';
                        e.currentTarget.style.color = '#7c6fa0';
                        e.currentTarget.style.borderColor = 'rgba(139,92,246,0.18)';
                    }}
                >
                    <Bell size={16} />
                    {/* Pulsing notification dot */}
                    <span
                        className="absolute rounded-full"
                        style={{
                            top: 6, right: 6,
                            width: 7, height: 7,
                            background: '#ef4444',
                            boxShadow: '0 0 8px rgba(239,68,68,0.8)',
                            animation: 'notifPulse 2s ease-in-out infinite',
                        }}
                    />
                </button>

                {/* Avatar */}
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold cursor-pointer overflow-hidden transition-all"
                    style={{
                        background: 'linear-gradient(135deg, #6d28d9, #9333ea)',
                        border: '1px solid rgba(139,92,246,0.4)',
                        boxShadow: '0 0 12px rgba(124,58,237,0.3)',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(124,58,237,0.5)';
                        e.currentTarget.style.borderColor = 'rgba(168,85,247,0.6)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.boxShadow = '0 0 12px rgba(124,58,237,0.3)';
                        e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)';
                    }}
                >
                    <img src='/admin.png' className='w-9 h-9 object-cover' alt="admin" />
                </div>
            </div>

            {/* Keyframe injected once via style tag */}
            <style>{`
                @keyframes notifPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.4); }
                }
            `}</style>
        </header>
    );
};
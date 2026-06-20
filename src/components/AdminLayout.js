// components/AdminLayout.js
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';

/* ─── Animated background canvas ─── */
const AnimatedBackground = () => (
    <>
        <style>{`
            @keyframes orbDrift {
                0%   { transform: translate(0px, 0px) scale(1); }
                33%  { transform: translate(20px, -15px) scale(1.06); }
                66%  { transform: translate(-12px, 18px) scale(0.97); }
                100% { transform: translate(0px, 0px) scale(1); }
            }
            @keyframes gridPulse {
                0%, 100% { opacity: 0.5; }
                50%       { opacity: 1; }
            }
            @keyframes particleFloat {
                0%   { opacity: 0; transform: translateY(0px) scale(0.5); }
                30%  { opacity: 0.8; }
                70%  { opacity: 0.8; }
                100% { opacity: 0; transform: translateY(-40px) scale(1.2); }
            }
            @keyframes ringExpand {
                0%   { transform: scale(0.6); opacity: 0.5; }
                100% { transform: scale(1.6); opacity: 0; }
            }
        `}</style>

        {/* Grid lines */}
        <div
            className="absolute inset-0 pointer-events-none"
            style={{
                backgroundImage: `
                    linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                animation: 'gridPulse 6s ease-in-out infinite',
            }}
        />

        {/* Ambient orbs */}
        {[
            { w: 500, h: 500, top: '-140px', left: '40px', delay: '0s', color: 'rgba(124,58,237,0.12)' },
            { w: 350, h: 350, bottom: '0px', left: '200px', delay: '-5s', color: 'rgba(168,85,247,0.1)' },
            { w: 280, h: 280, top: '30%', right: '5%', delay: '-10s', color: 'rgba(79,70,229,0.1)' },
            { w: 200, h: 200, bottom: '10%', right: '20%', delay: '-3s', color: 'rgba(139,92,246,0.08)' },
        ].map((orb, i) => (
            <div
                key={i}
                className="absolute pointer-events-none rounded-full"
                style={{
                    width: orb.w, height: orb.h,
                    top: orb.top, left: orb.left,
                    bottom: orb.bottom, right: orb.right,
                    background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
                    filter: 'blur(40px)',
                    animation: `orbDrift ${16 + i * 4}s ease-in-out infinite`,
                    animationDelay: orb.delay,
                }}
            />
        ))}

        {/* Floating particles */}
        {[
            { top: '15%', left: '32%', delay: '0s', duration: '5s' },
            { top: '40%', left: '58%', delay: '1.2s', duration: '6s' },
            { top: '65%', left: '22%', delay: '2.4s', duration: '4.5s' },
            { top: '78%', left: '72%', delay: '0.6s', duration: '7s' },
            { top: '22%', left: '82%', delay: '3.6s', duration: '5.5s' },
            { top: '52%', left: '46%', delay: '1.8s', duration: '6.5s' },
            { top: '88%', left: '38%', delay: '2.8s', duration: '4s' },
            { top: '10%', left: '64%', delay: '4s', duration: '5s' },
        ].map((p, i) => (
            <div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                    width: 3, height: 3,
                    top: p.top, left: p.left,
                    background: '#a78bfa',
                    animation: `particleFloat ${p.duration} ease-in-out infinite`,
                    animationDelay: p.delay,
                }}
            />
        ))}

        {/* Expanding rings */}
        {[
            { size: 240, top: '-80px', right: '120px', delay: '0s' },
            { size: 160, bottom: '40px', right: '240px', delay: '-3s' },
            { size: 120, top: '40%', left: '30%', delay: '-6s' },
        ].map((ring, i) => (
            <div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                    width: ring.size, height: ring.size,
                    top: ring.top, right: ring.right,
                    bottom: ring.bottom, left: ring.left,
                    border: '1px solid rgba(139,92,246,0.15)',
                    animation: `ringExpand 5s ease-out infinite`,
                    animationDelay: ring.delay,
                }}
            />
        ))}
    </>
);

/* ─── Layout ─── */
export const AdminLayout = () => {
    const [activePage, setActivePage] = useState('/admin/dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div
            className="flex h-screen overflow-hidden font-sans relative"
            style={{ background: '#0a0814' }}
        >
            {/* Animated background layer */}
            <AnimatedBackground />

            <Sidebar
                active={activePage}
                setActive={setActivePage}
                open={sidebarOpen}
                setOpen={setSidebarOpen}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                <Navbar setOpen={setSidebarOpen} activePage={activePage} />
                <main className="flex-1 overflow-y-auto">
                    <div className="p-5 max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
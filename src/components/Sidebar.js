// components/Sidebar.js
import React, { useState } from 'react';
import {
    LayoutDashboard, Cloud, Server, Database, Shield,
    Users, Settings, Bell, Search, Menu, X, ChevronDown,
    TrendingUp, TrendingDown, Globe, Cpu, HardDrive,
    Activity, LogOut, ChevronRight, BarChart2, Lock,
    Zap, Mail, AlertCircle,
    Grid,
    Smartphone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
    { label: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
    // {
    //     label: "Devices", icon: Smartphone, path: "devices",
    //     children: ["All Devices", "Enrolled", "Pending"],
    // },
    // { label: "Users", icon: Users, path: "users" },
    // {
    //     label: "Compliance", icon: Shield, path: "compliance",
    //     children: ["Policies", "Violations"],
    // },
    // {
    //     label: "App Management", icon: Grid, path: "apps",
    //     children: ["Deployed", "Catalog"],
    // },
    // {
    //     label: "Monitoring", icon: Activity, path: "monitoring",
    //     children: ["Metrics", "Alerts", "Logs"],
    // },
    { label: "Settings", icon: Settings, path: "settings" },
];

export const Sidebar = ({ active, setActive, open, setOpen }) => {
    const [expanded, setExpanded] = useState({});

    const toggle = (key) => setExpanded(p => ({ ...p, [key]: !p[key] }));

    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    }

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 bg-black/20 z-20 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={`
          fixed top-0 left-0 h-full z-30 w-64 bg-white border-r border-slate-100 shadow-sm
          flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:flex lg:h-screen lg:shrink-0
        `}
            >
                <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8  flex items-center justify-center shadow">
                            <img src='/logo.png' className='w-8 h-8 object-cover' />
                        </div>
                        <span className="font-bold text-slate-800 text-lg tracking-tight">CloudApp</span>
                    </div>
                    <button className="lg:hidden text-slate-400 hover:text-slate-600" onClick={() => setOpen(false)}>
                        <X size={18} />
                    </button>
                </div>

                <div className="px-4 py-4 border-b border-slate-50">
                    <div className="flex items-center gap-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            <img src='/admin.png' className='w-9 h-9 object-cover' />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">Vijay N</p>
                            <p className="text-xs text-slate-400">Super Admin</p>
                        </div>
                    </div>
                </div>

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
                                            setOpen(false);
                                        }
                                    }}
                                    className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${isActive
                                            ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-sm"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                                        }
                  `}
                                >
                                    <item.icon size={16} className={isActive ? "text-white" : "text-slate-400"} />
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {hasChildren && (
                                        <ChevronDown
                                            size={14}
                                            className={`transition-transform ${isExpanded ? "rotate-180" : ""} ${isActive ? "text-white/70" : "text-slate-300"}`}
                                        />
                                    )}
                                </button>

                                {hasChildren && isExpanded && (
                                    <div className="ml-5 mt-0.5 space-y-0.5 border-l border-slate-100 pl-3">
                                        {item.children.map(child => (
                                            <button
                                                key={child}
                                                onClick={() => { setActive(`${item.path}-${child}`); setOpen(false); }}
                                                className={`
                          w-full text-left text-xs px-2 py-2 rounded-lg transition-colors
                          ${active === `${item.path}-${child}`
                                                        ? "text-violet-600 font-semibold bg-violet-50"
                                                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                                    }
                        `}
                                            >
                                                <ChevronRight size={10} className="inline mr-1 opacity-50" />
                                                {child}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className="px-3 pb-4 shrink-0 space-y-0.5">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:bg-rose-50 hover:text-rose-500 transition-colors">
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
};
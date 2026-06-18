// components/Navbar.js
import React from 'react';
import { Menu, Search, ChevronRight, Mail, Bell } from 'lucide-react';

const NAV_ITEMS = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Settings", path: "/admin/settings" },
];

export const Navbar = ({ setOpen, activePage }) => {
    const label = NAV_ITEMS.find(n => n.path === activePage)?.label ?? "Dashboard";

    return (
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-4 gap-4 shrink-0 sticky top-0 z-10">
            <button
                className="lg:hidden text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                onClick={() => setOpen(true)}
            >
                <Menu size={20} />
            </button>

            <div className="flex items-center gap-1.5 text-sm">
                <span className="text-slate-400">CloudApp</span>
                <ChevronRight size={13} className="text-slate-300" />
                <span className="font-semibold text-slate-800">{label}</span>
            </div>

            <div className="flex-1" />

            {/* <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-56 focus-within:ring-2 ring-violet-200 transition-all">
                <Search size={14} className="text-slate-400 shrink-0" />
                <input
                    className="bg-transparent text-sm text-slate-600 placeholder:text-slate-400 outline-none w-full"
                    placeholder="Search anything…"
                />
            </div> */}

            <div className="flex items-center gap-1">

                <button className="relative p-2 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors">
                    <Bell size={17} />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
                </button>
                <div className="w-8 h-8 ml-1 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                    <img src='/admin.png' className='w-8 h-8 object-cover' />
                </div>
            </div>
        </header>
    );
};
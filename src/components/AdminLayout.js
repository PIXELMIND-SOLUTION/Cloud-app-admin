// components/AdminLayout.js
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';

export const AdminLayout = () => {
    const [activePage, setActivePage] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            <Sidebar
                active={activePage}
                setActive={setActivePage}
                open={sidebarOpen}
                setOpen={setSidebarOpen}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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
// components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, Settings, X, ChevronDown,
  LogOut, ChevronRight, BarChart2, MailWarning, LineChart,
  UserCog, UserPlus, Users as UsersIcon, Bell, Shield,
  Home, TrendingUp, FileText, Settings as SettingsIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Registered Admins", icon: Users, path: "/admin/users" },
  {
    label: "Plans",
    icon: BarChart2,
    path: "/admin/plans"
  },
  { label: "Analytics", icon: LineChart, path: "/admin/analytics" },
  { label: "Complaints", icon: MailWarning, path: "/admin/complaints" },
  {
    label: "Staff Management",
    icon: UserCog,
    path: "/admin/staff",
    children: [
      { label: "Add Staff", path: "/admin/staff/add", icon: UserPlus },
      { label: "All Staff", path: "/admin/staff", icon: UsersIcon },
    ]
  },
  { label: "Notifications", icon: Bell, path: "/admin/notifications" },
  { label: "Settings", icon: SettingsIcon, path: "/admin/settings" },
];

// ── Permission Helper ──────────────────────────────────────────────────────
const hasPermission = (permissions, componentId, action = null) => {
  if (!permissions) return false;
  const comp = permissions.find(p => p.componentId === componentId);
  if (!comp) return false;
  if (action) return comp.actions.includes(action);
  return true;
};

export const Sidebar = ({ active, setActive, open, setOpen }) => {
  const [expanded, setExpanded] = useState({});
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState('admin');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is Super Admin or Staff
    const adminAuth = sessionStorage.getItem('adminAuth');
    const subAdminAuth = sessionStorage.getItem('subAdminAuth');
    const staffData = sessionStorage.getItem('subAdminData');

    if (adminAuth === 'true') {
      setUserType('admin');
      setUserData({ name: 'Vijay N', role: 'Super Admin', permissions: [] });
    } else if (subAdminAuth === 'true' && staffData) {
      setUserType('staff');
      const data = JSON.parse(staffData);
      setUserData(data);
    }
  }, []);

  const toggle = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const handleLogout = () => {
    if (sessionStorage.getItem("adminAuth") === "true") {
      sessionStorage.removeItem("adminAuth");
      sessionStorage.removeItem("adminData");
      navigate("/", { replace: true });
    } else if (sessionStorage.getItem("subAdminAuth") === "true") {
      sessionStorage.removeItem("subAdminAuth");
      sessionStorage.removeItem("subAdminData");
      navigate("/staff-login", { replace: true });
    }
  };

  // ── Filter Navigation Items Based on Permissions ──────────────────────
  const getFilteredNavItems = () => {
    if (userType === 'admin') {
      return NAV_ITEMS; // Super Admin sees everything
    }

    // Staff user - filter based on permissions
    const permissions = userData?.permissions || [];

    // Dashboard is always shown to everyone (first item)
    return NAV_ITEMS.map(item => {
      // Always keep Dashboard visible
      if (item.path === '/admin/dashboard') {
        return item;
      }

      // Check if staff has permission for this component
      const hasView = hasPermission(permissions, item.path.replace('/admin/', ''));

      // If no permission, skip this item
      if (!hasView) {
        // Check if it's a parent with children that might have permissions
        if (item.children) {
          const filteredChildren = item.children.filter(child =>
            hasPermission(permissions, child.path.replace('/admin/', ''))
          );
          if (filteredChildren.length > 0) {
            return {
              ...item,
              children: filteredChildren
            };
          }
        }
        return null;
      }

      // If item has children, filter them too
      if (item.children) {
        return {
          ...item,
          children: item.children.filter(child =>
            hasPermission(permissions, child.path.replace('/admin/', ''))
          )
        };
      }
      return item;
    }).filter(item => item !== null);
  };

  const filteredNavItems = getFilteredNavItems();

  // ── Get user display info ──────────────────────────────────────────────
  const getUserInfo = () => {
    if (userType === 'admin') {
      return {
        name: 'Vijay N',
        role: 'Super Admin',
        avatar: '/admin.png',
        grad: 'from-orange-500 to-orange-600'
      };
    }
    return {
      name: userData?.name || 'Staff',
      role: userData?.role || 'Staff',
      avatar: userData?.avatar || '',
      grad: 'from-orange-500 to-orange-600'
    };
  };

  const userInfo = getUserInfo();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-10 lg:hidden bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-30 w-64 flex flex-col
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:flex lg:h-screen lg:shrink-0
          bg-white border-r border-orange-200/30 shadow-lg
        `}
      >
        {/* Decorative element */}
        <div className="absolute pointer-events-none w-48 h-48 -top-10 -left-10 rounded-full bg-orange-500/5" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 shrink-0 h-16 border-b border-orange-200/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center rounded-xl text-white font-bold">
              <img src='/logo.png' className='w-8 h-8 object-cover' alt="logo" />
            </div>
            <span className="font-bold text-lg tracking-tight text-orange-500">RVV Tech Admin</span>
          </div>
          <button
            className="lg:hidden transition-colors text-orange-500 hover:text-orange-600"
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* User profile */}
        <div className="px-4 py-3 border-b border-orange-200/20">
          <div className="flex items-center gap-3 rounded-xl p-3 bg-orange-50/80 border border-orange-200/30">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden bg-gradient-to-br ${userInfo.grad}`}>
              {userInfo.avatar && (
                userInfo.avatar.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-gray-900">{userInfo.name}</p>
              <p className="text-xs text-orange-500">{userInfo.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {filteredNavItems.map(item => {
            const isActive = active === item.path || (item.children && item.children.some(c => c.path === active));
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
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium 
                    transition-all relative
                    ${isActive
                      ? 'bg-orange-50 text-orange-500 border border-orange-300/50'
                      : 'text-gray-600 border border-transparent hover:bg-orange-50/50 hover:text-orange-500'
                    }
                  `}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r w-0.5 h-5 bg-gradient-to-b from-orange-500 to-orange-600 shadow-lg shadow-orange-500/50" />
                  )}
                  <item.icon size={16} className={isActive ? 'text-orange-500' : 'text-gray-400'} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {hasChildren && (
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""} ${isActive ? 'text-orange-500' : 'text-gray-400'}`}
                    />
                  )}
                </button>

                {hasChildren && isExpanded && (
                  <div className="ml-5 mt-0.5 space-y-0.5 pl-3 border-l border-orange-200/30">
                    {item.children.map((child) => (
                      <button
                        key={child.path}
                        onClick={() => {
                          setActive(child.path);
                          navigate(child.path);
                          setOpen(false);
                        }}
                        className={`
                          w-full flex items-center gap-2 text-left text-xs px-2 py-2 rounded-lg 
                          transition-colors
                          ${active === child.path
                            ? 'text-orange-500 font-semibold bg-orange-50/50'
                            : 'text-gray-500 hover:text-orange-500 hover:bg-orange-50/30'
                          }
                        `}
                      >
                        {child.icon && <child.icon size={12} />}
                        <ChevronRight size={10} className="opacity-50" />
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
        <div className="px-3 pb-4 shrink-0 border-t border-orange-200/20">
          <button
            onClick={handleLogout}
            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
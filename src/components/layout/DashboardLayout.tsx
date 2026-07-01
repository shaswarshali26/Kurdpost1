import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, Clock, Send, User, LogOut, Menu, X,
  Users, MapPin, TicketCheck, BarChart3, Building2, FileText, Upload, Shield,
  Package2, ChevronRight, Globe,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';

interface NavItem { to: string; label: string; icon: React.ReactNode; }

const navsByRole: Record<UserRole, NavItem[]> = {
  citizen: [
    { to: '/portal',         icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
    { to: '/portal/send',    icon: <Send size={17} />,            label: 'Send Shipment' },
    { to: '/portal/track',   icon: <Package size={17} />,         label: 'Track Shipment' },
    { to: '/portal/history', icon: <Clock size={17} />,           label: 'Shipment History' },
    { to: '/portal/profile', icon: <User size={17} />,            label: 'My Profile' },
  ],
  business: [
    { to: '/business',         icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
    { to: '/business/bulk',    icon: <Upload size={17} />,          label: 'Bulk Upload' },
    { to: '/business/reports', icon: <BarChart3 size={17} />,       label: 'Reports' },
    { to: '/business/company', icon: <Building2 size={17} />,       label: 'Company Profile' },
    { to: '/portal/track',     icon: <Package size={17} />,         label: 'Track Shipment' },
  ],
  government: [
    { to: '/government',           icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
    { to: '/government/document',  icon: <FileText size={17} />,        label: 'Document Shipment' },
    { to: '/portal/history',       icon: <Clock size={17} />,           label: 'Shipment History' },
    { to: '/portal/track',         icon: <Package size={17} />,         label: 'Track Shipment' },
    { to: '/portal/profile',       icon: <Shield size={17} />,          label: 'Agency Profile' },
  ],
  admin: [
    { to: '/admin',              icon: <LayoutDashboard size={17} />, label: 'Overview' },
    { to: '/admin/users',        icon: <Users size={17} />,           label: 'Manage Users' },
    { to: '/admin/shipments',    icon: <Package2 size={17} />,        label: 'Manage Shipments' },
    { to: '/admin/branches',     icon: <MapPin size={17} />,          label: 'Branches' },
    { to: '/admin/tickets',      icon: <TicketCheck size={17} />,     label: 'Support Tickets' },
    { to: '/admin/performance',  icon: <BarChart3 size={17} />,       label: 'Performance' },
  ],
};

const roleLabels: Record<UserRole, string> = {
  citizen:    'Citizen Portal',
  business:   'Business Portal',
  government: 'Government Portal',
  admin:      'Admin Panel',
};

const roleGradients: Record<UserRole, string> = {
  citizen:    'from-blue-800 to-blue-900',
  business:   'from-violet-800 to-purple-900',
  government: 'from-emerald-800 to-teal-900',
  admin:      'from-slate-800 to-slate-900',
};

const roleAccent: Record<UserRole, string> = {
  citizen:    'bg-blue-700 text-white',
  business:   'bg-violet-700 text-white',
  government: 'bg-emerald-700 text-white',
  admin:      'bg-slate-700 text-white',
};

const roleHover: Record<UserRole, string> = {
  citizen:    'hover:bg-blue-50 hover:text-blue-700',
  business:   'hover:bg-violet-50 hover:text-violet-700',
  government: 'hover:bg-emerald-50 hover:text-emerald-700',
  admin:      'hover:bg-slate-100 hover:text-slate-800',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  if (!user) { navigate('/login'); return null; }

  const navItems = navsByRole[user.role];
  const handleLogout = () => { logout(); navigate('/'); };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={`${mobile ? 'w-full' : 'w-64 shrink-0'} flex flex-col h-full bg-white border-r border-slate-200 shadow-sm`}>

      {/* Brand header with gradient */}
      <div className={`px-5 py-4 bg-gradient-to-br ${roleGradients[user.role]} flex items-center gap-3`}>
        <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
          <Package size={19} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-bold text-white text-sm block tracking-tight">Kurd Post</span>
          <span className="text-[9px] text-white/65 tracking-[0.15em] uppercase block">
            {roleLabels[user.role]}
          </span>
        </div>
        {mobile && (
          <button
            onClick={() => setSideOpen(false)}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* User card */}
      <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl ${roleAccent[user.role]} flex items-center justify-center text-xs font-bold shrink-0 shadow-sm`}
          >
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate leading-tight">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">Navigation</p>
        <ul className="space-y-0.5">
          {navItems.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={
                  item.to === '/portal' ||
                  item.to === '/admin' ||
                  item.to === '/business' ||
                  item.to === '/government'
                }
                onClick={() => setSideOpen(false)}
                className={({ isActive }) =>
                  `sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? `${roleAccent[user.role]} shadow-sm`
                      : `text-slate-600 ${roleHover[user.role]}`
                  }`
                }
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                <ChevronRight size={13} className="ml-auto opacity-40 shrink-0" />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-3 border-t border-slate-200 space-y-0.5 bg-slate-50/40">
        <Link
          to="/"
          className="sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
        >
          <Globe size={17} />
          <span>Public Site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="sidebar-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-all font-medium"
        >
          <LogOut size={17} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-[#f0f4ff] overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col h-full">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {sideOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSideOpen(false)}
          />
          <div className="relative w-72 flex flex-col shadow-2xl">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200 shadow-sm">
          <button
            onClick={() => setSideOpen(true)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Package size={16} className="text-blue-700" />
            <span className="font-bold text-slate-700 text-sm tracking-tight">
              Kurd Post — {roleLabels[user.role]}
            </span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 page-enter">
          {children}
        </main>
      </div>
    </div>
  );
}

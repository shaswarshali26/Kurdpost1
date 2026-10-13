import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, Package, LayoutDashboard, Truck, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/tracking', label: 'Track' },
  { to: '/branches', label: 'Branches' },
  { to: '/explorer', label: 'Explorer' },
  { to: '/architecture', label: 'Architecture' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Glassmorphism on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropOpen(false);
    setMobileOpen(false);
  };

  const dashboardPath =
    user?.role === 'admin'      ? '/admin' :
    user?.role === 'business'   ? '/business' :
    user?.role === 'government' ? '/government' :
    '/portal';

  const roleLabel: Record<string, string> = {
    citizen: 'Citizen',
    business: 'Business',
    government: 'Government',
    admin: 'Administrator',
  };

  const roleGradient: Record<string, string> = {
    citizen:    'from-blue-600 to-blue-700',
    business:   'from-violet-600 to-purple-700',
    government: 'from-emerald-600 to-teal-700',
    admin:      'from-slate-700 to-slate-900',
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-white shadow-panel border-b border-white/60'
          : 'bg-white border-b border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Package size={20} className="text-white" />
            </div>
            <div className="leading-tight">
              <span className="font-bold text-blue-800 text-[17px] tracking-tight block">Kurd Post</span>
              <span className="text-[9px] text-slate-400 tracking-[0.18em] uppercase block">Kurdistan Region</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 nav-link-animated ${
                    isActive
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Auth area */}
          <div className="hidden lg:flex items-center gap-2.5">
            {user ? (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen(v => !v)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                >
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${roleGradient[user.role] ?? 'from-blue-600 to-blue-700'} flex items-center justify-center text-white text-xs font-bold shadow-sm`}
                  >
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-semibold text-slate-800 block leading-tight">{user.firstName}</span>
                    <span className="text-[10px] text-slate-400 capitalize">{roleLabel[user.role]}</span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-panel py-1.5 z-50 dropdown-enter">
                    <div className="px-4 py-3 border-b border-slate-100 mb-1">
                      <p className="text-sm font-bold text-slate-800">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-slate-400 capitalize mt-0.5">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { navigate(dashboardPath); setDropOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <LayoutDashboard size={15} className="text-slate-400" /> Dashboard
                    </button>
                    <button
                      onClick={() => { navigate('/portal/profile'); setDropOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <User size={15} className="text-slate-400" /> My Profile
                    </button>
                    <button
                      onClick={() => { navigate('/tracking'); setDropOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <Truck size={15} className="text-slate-400" /> Track Shipment
                    </button>
                    <div className="border-t border-slate-100 mt-1.5 pt-1.5">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-blue-700 rounded-xl hover:bg-blue-50 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white rounded-xl transition-all duration-200 shadow-sm btn-shimmer"
                >
                  Register Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white pb-5 shadow-panel">
          <div className="max-w-7xl mx-auto px-4 pt-3 flex flex-col gap-1">
            {navLinks.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-700 bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="border-t border-slate-100 my-2" />
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl mb-1">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${roleGradient[user.role] ?? 'from-blue-600 to-blue-700'} flex items-center justify-center text-white text-xs font-bold`}>
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-slate-400 capitalize">{roleLabel[user.role]}</p>
                  </div>
                </div>
                <button
                  onClick={() => { navigate(dashboardPath); setMobileOpen(false); }}
                  className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 font-medium rounded-xl hover:bg-slate-50"
                >
                  <LayoutDashboard size={16} className="text-slate-400" /> Dashboard
                </button>
                <button
                  onClick={() => { navigate('/portal/profile'); setMobileOpen(false); }}
                  className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 font-medium rounded-xl hover:bg-slate-50"
                >
                  <Shield size={16} className="text-slate-400" /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 font-medium rounded-xl hover:bg-red-50"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3.5 text-sm font-semibold text-center bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-xl"
                >
                  Register Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

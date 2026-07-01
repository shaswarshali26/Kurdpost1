import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package, Eye, EyeOff, Lock, Mail, AlertCircle, Shield,
  Truck, Globe, ArrowRight, CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockUsers } from '../../data/mockData';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const DEMO_ACCOUNTS = [
  { email: 'ahmad@example.com',  password: 'password123', label: 'Citizen',    icon: '👤', color: 'border-blue-200 bg-blue-50 hover:border-blue-400 hover:bg-blue-100' },
  { email: 'soran@kurdshop.com', password: 'password123', label: 'Business',   icon: '🏢', color: 'border-violet-200 bg-violet-50 hover:border-violet-400 hover:bg-violet-100' },
  { email: 'dilan@gov.krd',      password: 'password123', label: 'Government', icon: '🛡️', color: 'border-emerald-200 bg-emerald-50 hover:border-emerald-400 hover:bg-emerald-100' },
  { email: 'admin@kurdpost.krd', password: 'admin123',    label: 'Admin',      icon: '⚙️', color: 'border-slate-200 bg-slate-50 hover:border-slate-400 hover:bg-slate-100' },
];

const brandFeatures = [
  { icon: <Shield size={16} />, text: 'Government-grade security' },
  { icon: <Truck size={16} />, text: 'Real-time shipment tracking' },
  { icon: <Globe size={16} />, text: 'Local & international delivery' },
  { icon: <CheckCircle2 size={16} />, text: '98% customer satisfaction' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.success) { setError(res.error || 'Login failed.'); return; }
    const roleRedirects: Record<string, string> = {
      citizen: '/portal', business: '/business', government: '/government', admin: '/admin',
    };
    const user = mockUsers.find(u => u.email === email);
    navigate(roleRedirects[user?.role || 'citizen']);
  };

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  return (
    <div className="min-h-screen flex">
      {/* ─── Left brand panel ────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] gradient-brand flex-col relative overflow-hidden">
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl" />

        {/* Floating decorative boxes */}
        <div className="absolute top-16 right-8 w-16 h-16 glass rounded-2xl float-1 flex items-center justify-center">
          <Package size={24} className="text-white/60" />
        </div>
        <div className="absolute bottom-24 left-8 w-12 h-12 glass rounded-xl float-2 flex items-center justify-center">
          <Truck size={18} className="text-white/60" />
        </div>

        {/* Content */}
        <div className="relative flex flex-col justify-center flex-1 px-10 xl:px-14 py-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center">
              <Package size={24} className="text-white" />
            </div>
            <div>
              <span className="font-black text-white text-xl tracking-tight block">Kurd Post</span>
              <span className="text-[10px] text-white/60 tracking-[0.18em] uppercase">Kurdistan Region</span>
            </div>
          </Link>

          <h2 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] mb-6 tracking-tight">
            Your trusted
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}
            >
              postal partner
            </span>
            <br />
            in Kurdistan
          </h2>

          <p className="text-blue-200 mb-10 leading-relaxed text-base">
            The official postal service of the Kurdistan Region. Delivering trust, transparency,
            and reliability since inception.
          </p>

          {/* Feature list */}
          <div className="space-y-3">
            {brandFeatures.map(f => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-amber-400 shrink-0">
                  {f.icon}
                </div>
                <span className="text-blue-100 text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats strip */}
        <div className="relative border-t border-white/10 px-10 xl:px-14 py-6 flex gap-8">
          {[{ n: '3.2M+', l: 'Deliveries' }, { n: '6', l: 'Branches' }, { n: '98%', l: 'Satisfaction' }].map(s => (
            <div key={s.l}>
              <p className="text-xl font-black text-white stat-value">{s.n}</p>
              <p className="text-blue-300 text-xs">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Right form panel ─────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-5 py-12 bg-[#f0f4ff]">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center shadow">
                <Package size={22} className="text-white" />
              </div>
              <div className="text-left">
                <span className="font-black text-blue-800 text-xl block">Kurd Post</span>
                <span className="text-[10px] text-slate-400 tracking-widest uppercase">Kurdistan Region</span>
              </div>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome back</h1>
            <p className="text-slate-500">Sign in to your Kurd Post account to continue</p>
          </div>

          {/* Demo accounts */}
          <div className="bg-white border border-blue-100 rounded-2xl p-4 mb-6 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              Quick Demo Login
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.email}
                  onClick={() => fillDemo(acc)}
                  className={`text-left px-3 py-2.5 border-2 rounded-xl transition-all duration-200 ${acc.color}`}
                >
                  <span className="flex items-center gap-1.5 mb-0.5">
                    <span>{acc.icon}</span>
                    <span className="text-xs font-bold text-slate-700">{acc.label}</span>
                  </span>
                  <span className="block text-[10px] text-slate-400 truncate">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-7">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  <AlertCircle size={16} className="shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                icon={<Mail size={15} />}
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  icon={<Lock size={15} />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-[38px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <Button type="submit" fullWidth loading={loading} size="lg" icon={<ArrowRight size={17} />}>
                Sign In to Kurd Post
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-700 font-bold hover:text-blue-800 transition-colors">
                Register free
              </Link>
            </p>
          </div>

          {/* Security note */}
          <p className="text-center text-xs text-slate-400 mt-5 flex items-center justify-center gap-1.5">
            <Lock size={11} />
            Secured by 256-bit encryption — Official Kurdish Post System
          </p>
        </div>
      </div>
    </div>
  );
}

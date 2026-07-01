import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package, AlertCircle, CheckCircle2, User, Building2, Shield,
  ArrowRight, ArrowLeft, Lock, Eye, EyeOff, Truck, Globe,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import type { UserRole } from '../../types';
import { validateEmail, validatePhone } from '../../utils';

type Step = 1 | 2;

const ROLE_OPTIONS: Array<{
  value: UserRole;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  desc: string;
  gradient: string;
  bg: string;
  border: string;
  activeBorder: string;
}> = [
  {
    value: 'citizen',
    label: 'Citizen',
    sublabel: 'Personal Account',
    icon: <User size={22} />,
    desc: 'Send & receive personal parcels and documents.',
    gradient: 'from-blue-600 to-blue-700',
    bg: 'bg-blue-50',
    border: 'border-slate-200',
    activeBorder: 'border-blue-500 bg-blue-50',
  },
  {
    value: 'business',
    label: 'Business',
    sublabel: 'Company Account',
    icon: <Building2 size={22} />,
    desc: 'Bulk shipments, invoicing, and dedicated dashboard.',
    gradient: 'from-violet-600 to-purple-700',
    bg: 'bg-violet-50',
    border: 'border-slate-200',
    activeBorder: 'border-violet-500 bg-violet-50',
  },
  {
    value: 'government',
    label: 'Government',
    sublabel: 'Institution Account',
    icon: <Shield size={22} />,
    desc: 'Official document delivery with full audit trail.',
    gradient: 'from-emerald-600 to-teal-700',
    bg: 'bg-emerald-50',
    border: 'border-slate-200',
    activeBorder: 'border-emerald-500 bg-emerald-50',
  },
];

const brandFeatures = [
  { icon: <Truck size={15} />, text: 'Express nationwide delivery' },
  { icon: <Shield size={15} />, text: 'Insured shipments available' },
  { icon: <Globe size={15} />, text: 'International coverage' },
  { icon: <CheckCircle2 size={15} />, text: 'Real-time tracking portal' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<UserRole>('citizen');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    city: '', password: '', confirmPassword: '',
    companyName: '', companyRegNo: '', department: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(er => ({ ...er, [field]: '' }));
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required.';
    if (!form.lastName.trim()) e.lastName = 'Last name is required.';
    if (!validateEmail(form.email)) e.email = 'Please enter a valid email address.';
    if (!validatePhone(form.phone)) e.phone = 'Please enter a valid phone number.';
    if (!form.city.trim()) e.city = 'City is required.';
    if (role === 'business' && !form.companyName.trim()) e.companyName = 'Company name is required.';
    if (role === 'government' && !form.department.trim()) e.department = 'Department is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validateStep1()) setStep(2); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true); setError('');
    const res = await register({
      role, firstName: form.firstName, lastName: form.lastName,
      email: form.email, phone: form.phone, city: form.city,
      password: form.password,
      companyName: form.companyName || undefined,
      companyRegNo: form.companyRegNo || undefined,
      department: form.department || undefined,
    });
    setLoading(false);
    if (!res.success) { setError(res.error || 'Registration failed.'); return; }
    const dest = role === 'business' ? '/business' : role === 'government' ? '/government' : '/portal';
    navigate(dest);
  };

  const passwordStrength = () => {
    if (form.password.length === 0) return 0;
    if (form.password.length < 6) return 1;
    if (form.password.length < 8) return 2;
    if (/[A-Z]/.test(form.password) && /[0-9]/.test(form.password)) return 4;
    return 3;
  };

  const strengthColors = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-500', 'bg-emerald-500'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strength = passwordStrength();

  return (
    <div className="min-h-screen flex">
      {/* ─── Left brand panel ────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[38%] gradient-brand flex-col relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-blue-400/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-48 h-48 bg-indigo-400/15 rounded-full blur-3xl" />

        {/* Floating icons */}
        <div className="absolute top-20 right-6 w-14 h-14 glass rounded-2xl float-1 flex items-center justify-center">
          <Package size={22} className="text-white/60" />
        </div>
        <div className="absolute bottom-32 left-6 w-11 h-11 glass rounded-xl float-2 flex items-center justify-center">
          <Globe size={17} className="text-white/60" />
        </div>

        <div className="relative flex flex-col justify-center flex-1 px-10 xl:px-14 py-12">
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
            Join the
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}
            >
              Kurdistan
            </span>
            <br />
            postal network
          </h2>

          <p className="text-blue-200 mb-10 leading-relaxed">
            Register in minutes and start shipping with the official postal authority of the Kurdistan Region.
          </p>

          <div className="space-y-3">
            {brandFeatures.map(f => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center text-amber-400 shrink-0">
                  {f.icon}
                </div>
                <span className="text-blue-100 text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative border-t border-white/10 px-10 xl:px-14 py-6 flex gap-8">
          {[{ n: '12K+', l: 'Users' }, { n: '6', l: 'Cities' }, { n: 'Free', l: 'Registration' }].map(s => (
            <div key={s.l}>
              <p className="text-xl font-black text-white stat-value">{s.n}</p>
              <p className="text-blue-300 text-xs">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Right form panel ─────────────────────────────────────────── */}
      <div className="flex-1 flex items-start justify-center px-5 py-10 bg-[#f0f4ff] overflow-y-auto">
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
          <div className="mb-6">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1.5">Create Account</h1>
            <p className="text-slate-500 text-sm">Register to start sending and tracking shipments</p>
          </div>

          {/* Step progress */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              {[1, 2].map(n => (
                <div key={n} className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shrink-0 ${
                      n < step
                        ? 'bg-emerald-500 text-white'
                        : n === step
                        ? 'bg-blue-700 text-white shadow-md'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {n < step ? <CheckCircle2 size={14} /> : n}
                  </div>
                  <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                    n < step ? 'bg-emerald-400' : n === step ? 'bg-blue-300' : 'bg-slate-200'
                  } ${n === 2 ? 'hidden' : ''}`} />
                </div>
              ))}
              <span className="text-xs text-slate-400 font-medium ml-1">Step {step} of 2</span>
            </div>
            <div className="flex gap-2 text-xs">
              <span className={`font-medium ${step === 1 ? 'text-blue-700' : 'text-slate-400'}`}>Account Details</span>
              <span className="text-slate-300">→</span>
              <span className={`font-medium ${step === 2 ? 'text-blue-700' : 'text-slate-400'}`}>Security</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-7">
            {step === 1 ? (
              <div className="space-y-5">
                {/* Role selector */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Account Type</p>
                  <div className="space-y-2">
                    {ROLE_OPTIONS.map(r => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setRole(r.value)}
                        className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border-2 text-left transition-all duration-200 ${
                          role === r.value ? r.activeBorder : `${r.border} hover:border-slate-300 bg-white`
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center text-white shrink-0 shadow-sm transition-transform duration-200 ${
                            role === r.value ? 'scale-110' : ''
                          }`}
                        >
                          {r.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 text-sm">{r.label}</p>
                          <p className="text-xs text-slate-400">{r.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          role === r.value ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                        }`}>
                          {role === r.value && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input label="First Name" value={form.firstName} onChange={set('firstName')} error={errors.firstName} required />
                  <Input label="Last Name" value={form.lastName} onChange={set('lastName')} error={errors.lastName} required />
                </div>
                <Input label="Email Address" type="email" value={form.email} onChange={set('email')} error={errors.email} required />
                <Input label="Phone Number" type="tel" placeholder="+964 750..." value={form.phone} onChange={set('phone')} error={errors.phone} required />
                <Select
                  label="City"
                  value={form.city}
                  onChange={set('city') as React.ChangeEventHandler<HTMLSelectElement>}
                  error={errors.city}
                  options={[
                    { value: '', label: 'Select your city' },
                    ...['Sulaymaniyah', 'Duhok', 'Halabja', 'Zakho', 'Koya', 'Ranya', 'Soran', 'Chamchamal', 'Other']
                      .map(c => ({ value: c, label: c })),
                  ]}
                  required
                />

                {role === 'business' && (
                  <>
                    <Input label="Company Name" value={form.companyName} onChange={set('companyName')} error={errors.companyName} required />
                    <Input label="Company Registration Number (optional)" value={form.companyRegNo} onChange={set('companyRegNo')} />
                  </>
                )}
                {role === 'government' && (
                  <Input label="Department / Institution Name" value={form.department} onChange={set('department')} error={errors.department} required />
                )}

                <Button fullWidth onClick={handleNext} size="lg" icon={<ArrowRight size={17} />}>
                  Continue to Security
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                    <AlertCircle size={16} className="shrink-0" /> {error}
                  </div>
                )}

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={set('password')}
                    error={errors.password}
                    required
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-[38px] text-slate-400 hover:text-slate-600 transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password strength */}
                {form.password.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            i <= strength ? strengthColors[strength] : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${
                      strength <= 2 ? 'text-amber-600' : strength === 3 ? 'text-blue-600' : 'text-emerald-600'
                    }`}>
                      Password strength: {strengthLabels[strength]}
                    </p>
                  </div>
                )}

                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={form.confirmPassword}
                    onChange={set('confirmPassword')}
                    error={errors.confirmPassword}
                    required
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3.5 top-[38px] text-slate-400 hover:text-slate-600 transition-colors">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Requirements checklist */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
                  {[
                    { check: form.password.length >= 8, label: 'At least 8 characters' },
                    { check: form.password === form.confirmPassword && form.confirmPassword.length > 0, label: 'Passwords match' },
                  ].map(req => (
                    <div key={req.label} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 size={13} className={req.check ? 'text-emerald-500' : 'text-slate-300'} />
                      <span className={req.check ? 'text-emerald-700 font-medium' : 'text-slate-400'}>{req.label}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  By registering, you agree to Kurd Post's Terms of Service and Privacy Policy.
                </p>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                    icon={<ArrowLeft size={16} />}
                  >
                    Back
                  </Button>
                  <Button type="submit" loading={loading} className="flex-2" icon={<Lock size={15} />}>
                    Create Account
                  </Button>
                </div>
              </form>
            )}

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-700 font-bold hover:text-blue-800 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

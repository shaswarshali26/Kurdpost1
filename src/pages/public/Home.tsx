import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package, Search, ArrowRight, Shield, Clock, Globe, MapPin,
  Star, Truck, FileText, Building2, CheckCircle2, Zap, Lock,
} from 'lucide-react';
import Button from '../../components/ui/Button';

// ─── Animated counter hook ───────────────────────────────────────────────────
function useCounter(target: number, duration = 1800, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const interval = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(interval); }
      else setCount(start);
    }, 16);
    return () => clearInterval(interval);
  }, [target, duration, trigger]);
  return count;
}

// ─── Stats bar with animated counters ───────────────────────────────────────
function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const delivered = useCounter(3200, 2000, visible);
  const branches  = useCounter(6, 800, visible);
  const cities    = useCounter(18, 1200, visible);
  const rating    = useCounter(98, 1600, visible);

  return (
    <div ref={ref} className="relative bg-blue-950/50 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { value: `${delivered.toLocaleString()}K+`, label: 'Shipments Delivered' },
          { value: branches.toString(),              label: 'Regional Branches' },
          { value: `${cities}+`,                     label: 'Cities Covered' },
          { value: `${rating}%`,                     label: 'Satisfaction Rate' },
        ].map(s => (
          <div key={s.label} className="text-center">
            <p className="text-3xl font-bold text-amber-400 stat-value tracking-tight">{s.value}</p>
            <p className="text-blue-300 text-xs mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Floating decoration ─────────────────────────────────────────────────────
function FloatingIcon({ className, icon, delay = '' }: { className: string; icon: React.ReactNode; delay?: string }) {
  return (
    <div
      className={`absolute ${className} w-14 h-14 rounded-2xl glass flex items-center justify-center text-white/60 ${delay}`}
      style={{ animation: `float1 ${6 + Math.random() * 4}s ease-in-out infinite` }}
    >
      {icon}
    </div>
  );
}

const features = [
  {
    icon: <Shield size={22} />,
    title: 'Secure & Auditable',
    desc: 'Every shipment carries a full audit trail with timestamped status history you can trust.',
    gradient: 'from-blue-600 to-blue-800',
  },
  {
    icon: <Clock size={22} />,
    title: 'Real-Time Tracking',
    desc: 'Monitor your parcel at every checkpoint — from acceptance to final delivery confirmation.',
    gradient: 'from-violet-600 to-purple-800',
  },
  {
    icon: <Globe size={22} />,
    title: 'Local & International',
    desc: 'Delivering within Kurdistan, across Iraq, and internationally with equal care.',
    gradient: 'from-emerald-600 to-teal-800',
  },
  {
    icon: <MapPin size={22} />,
    title: '6 Regional Branches',
    desc: 'Drop-off & pick-up in Sulaymaniyah, Duhok, Halabja, Zakho, Koya and more.',
    gradient: 'from-amber-500 to-orange-700',
  },
];

const services = [
  {
    icon: <Truck size={26} />,
    title: 'Standard Delivery',
    desc: '2–4 business days nationwide',
    badge: 'Most Popular',
    gradient: 'from-blue-600 to-blue-800',
    link: '/services',
  },
  {
    icon: <Zap size={26} />,
    title: 'Express Delivery',
    desc: 'Next business day guaranteed',
    badge: 'Fast',
    gradient: 'from-amber-500 to-orange-600',
    link: '/services',
  },
  {
    icon: <FileText size={26} />,
    title: 'Document Service',
    desc: 'Official & government documents',
    badge: 'Secure',
    gradient: 'from-emerald-600 to-teal-700',
    link: '/services',
  },
  {
    icon: <Building2 size={26} />,
    title: 'Business Bulk',
    desc: 'High-volume shipping for enterprises',
    badge: 'Business',
    gradient: 'from-violet-600 to-purple-800',
    link: '/services',
  },
  {
    icon: <Globe size={26} />,
    title: 'International',
    desc: 'Border crossings & worldwide shipping',
    badge: 'Global',
    gradient: 'from-red-500 to-rose-700',
    link: '/services',
  },
  {
    icon: <Shield size={26} />,
    title: 'Insured Shipping',
    desc: 'Full value protection & insurance',
    badge: 'Protected',
    gradient: 'from-slate-600 to-slate-800',
    link: '/services',
  },
];

const steps = [
  { n: '01', title: 'Create Account', desc: 'Register as citizen, business, or government entity in under 2 minutes.' },
  { n: '02', title: 'Submit Shipment', desc: 'Fill sender & receiver details, choose service type and packaging.' },
  { n: '03', title: 'Drop Off', desc: 'Take your parcel to the nearest Kurd Post branch or request pickup.' },
  { n: '04', title: 'Track & Receive', desc: 'Real-time updates at every checkpoint until delivery is confirmed.' },
];

const testimonials = [
  {
    name: 'Ahmad Hassan',
    role: 'Private Citizen',
    city: 'Sulaymaniyah',
    text: 'My documents arrived safely and on time. The real-time tracking gave me complete peace of mind throughout the entire process.',
    stars: 5,
    initial: 'A',
    gradient: 'from-blue-600 to-blue-700',
  },
  {
    name: 'KurdShop LLC',
    role: 'Business Customer',
    city: 'Sulaymaniyah',
    text: 'We ship hundreds of packages monthly through Kurd Post. The business portal has completely streamlined our logistics operations.',
    stars: 5,
    initial: 'K',
    gradient: 'from-violet-600 to-purple-700',
  },
  {
    name: 'Duhok Municipality',
    role: 'Government Entity',
    city: 'Duhok',
    text: 'Kurd Post is our trusted partner for official document delivery. The verification process is thorough, professional, and auditable.',
    stars: 5,
    initial: 'D',
    gradient: 'from-emerald-600 to-teal-700',
  },
];

export default function Home() {
  const [trackInput, setTrackInput] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackInput.trim()) navigate(`/tracking?q=${encodeURIComponent(trackInput.trim())}`);
  };

  return (
    <div>
      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative gradient-hero text-white overflow-hidden">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating decorative icons */}
        <FloatingIcon
          className="top-12 right-[10%] hidden lg:flex float-1"
          icon={<Package size={24} />}
        />
        <FloatingIcon
          className="top-36 right-[22%] hidden lg:flex float-2"
          icon={<Truck size={20} />}
        />
        <FloatingIcon
          className="top-20 right-[35%] hidden xl:flex float-3"
          icon={<Globe size={20} />}
        />
        <FloatingIcon
          className="bottom-20 right-[15%] hidden lg:flex float-1"
          icon={<Shield size={20} />}
        />

        {/* Glow blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm mb-8">
              <Shield size={13} className="text-amber-400" />
              <span className="text-white/90 font-medium">Official Kurdistan Region Postal Service</span>
              <CheckCircle2 size={13} className="text-emerald-400" />
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
              Delivering
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}
              >
                Trust
              </span>{' '}
              Across
              <br />
              Kurdistan
            </h1>

            <p className="text-lg text-blue-100 mb-10 leading-relaxed max-w-xl">
              The official postal institution of the Kurdistan Region of Iraq.
              Send, track, and receive with complete institutional confidence.
            </p>

            {/* Tracking form */}
            <form
              onSubmit={handleTrack}
              className="bg-white rounded-2xl p-2 flex gap-2 shadow-2xl max-w-lg border border-white/50"
            >
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={trackInput}
                  onChange={e => setTrackInput(e.target.value)}
                  placeholder="Enter tracking number — e.g. KP-2024-000001"
                  className="w-full pl-10 pr-4 py-3 text-slate-800 placeholder:text-slate-400 text-sm bg-transparent outline-none font-medium"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-200 shrink-0 btn-shimmer"
              >
                <Search size={15} /> Track
              </button>
            </form>

            {/* Sample tracking numbers */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-blue-300 text-xs">Try sample numbers:</span>
              {['KP-2024-000001', 'KP-2024-000004'].map(n => (
                <button
                  key={n}
                  onClick={() => setTrackInput(n)}
                  className="text-xs glass rounded-full px-3 py-1 text-white/80 hover:text-white hover:bg-white/20 transition-colors font-mono"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <StatsBar />
      </section>

      {/* ─── WHY KURD POST ─────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full mb-4 border border-blue-100">
            Why Choose Us
          </span>
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Built on{' '}
            <span className="text-gradient-brand">Institutional Trust</span>
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
            Reliability, transparency, and accountability form the foundation of every shipment we handle.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(f => (
            <div
              key={f.title}
              className="group relative bg-white rounded-2xl border border-slate-200 p-6 card-hover overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />

              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300`}
              >
                {f.icon}
              </div>
              <h3 className="font-bold text-slate-800 mb-2 tracking-tight">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── SERVICES ──────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
            <div>
              <span className="inline-block text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-4 py-1.5 rounded-full mb-3 border border-amber-100">
                Our Services
              </span>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                Comprehensive
                <br />
                <span className="text-gradient-brand">Postal Solutions</span>
              </h2>
            </div>
            <Link
              to="/services"
              className="flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-all duration-200 group"
            >
              View all services
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map(s => (
              <Link
                key={s.title}
                to={s.link}
                className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden card-hover"
              >
                {/* Top accent bar */}
                <div className={`h-1 bg-gradient-to-r ${s.gradient}`} />

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300`}
                    >
                      {s.icon}
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {s.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1.5 group-hover:text-blue-700 transition-colors tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">{s.desc}</p>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-600">
                    Learn more
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-1.5 rounded-full mb-4 border border-emerald-100">
            Simple Process
          </span>
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
            How It <span className="text-gradient-brand">Works</span>
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Transparent, accountable postal workflow designed for citizens, businesses, and government.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-[52px] left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200" />

          {steps.map((item, i) => (
            <div
              key={item.n}
              className="relative text-center bg-white rounded-2xl border border-slate-200 p-6 card-hover"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Step number circle */}
              <div className="relative z-10 w-14 h-14 bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md font-black text-lg">
                {item.n}
              </div>
              <h3 className="font-bold text-slate-800 mb-2 tracking-tight">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/register">
            <Button size="lg" icon={<ArrowRight size={18} />}>
              Get Started — Register Free
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-brand" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
        />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-amber-400 uppercase tracking-widest bg-white/10 px-4 py-1.5 rounded-full mb-4 border border-white/20">
              Testimonials
            </span>
            <h2 className="text-4xl font-black text-white tracking-tight">
              Trusted by Citizens,
              <br />
              <span className="text-amber-400">Businesses & Government</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="glass rounded-2xl p-6 flex flex-col">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array(t.stars).fill(0).map((_, i) => (
                    <Star key={i} size={15} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-blue-100 text-sm leading-relaxed flex-1 mb-6">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                  >
                    {t.initial}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{t.name}</p>
                    <p className="text-blue-300 text-xs">{t.role} · {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center bg-white rounded-3xl border border-blue-100 shadow-xl p-12 relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-blue-50 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-50 rounded-full" />

          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
              <Lock size={28} className="text-white" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
              Ready to Ship with
              <span className="text-gradient-brand"> Kurd Post?</span>
            </h2>
            <p className="text-slate-500 mb-8 max-w-xl mx-auto leading-relaxed">
              Join thousands of citizens, businesses, and government institutions who trust
              Kurd Post for every delivery across Kurdistan and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register">
                <Button size="lg" icon={<ArrowRight size={18} />}>Create Your Account</Button>
              </Link>
              <Link to="/tracking">
                <Button size="lg" variant="outline" icon={<Search size={18} />}>Track a Shipment</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

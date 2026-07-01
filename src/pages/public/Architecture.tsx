import { useState } from 'react';
import {
  Server, Shield, Database, Cpu, Zap, Globe, Lock, Layers,
  Package, Smartphone, Radio, BarChart2, CheckCircle2,
  Code2, GitBranch, Activity, Truck, Box,
} from 'lucide-react';

const PHASE1_SERVICES = [
  { icon: <Lock size={18} />, name: 'Auth Service', desc: 'Login, token management, session control', color: 'from-blue-500 to-blue-700' },
  { icon: <Shield size={18} />, name: 'KYC Service', desc: 'Identity verification & document validation', color: 'from-emerald-500 to-teal-700' },
  { icon: <Package size={18} />, name: 'Parcel Service', desc: 'Intake, tracking & status management', color: 'from-violet-500 to-purple-700' },
  { icon: <Activity size={18} />, name: 'Notification Service', desc: 'SMS, WhatsApp & push alerts', color: 'from-amber-500 to-orange-600' },
  { icon: <Database size={18} />, name: 'User Service', desc: 'Registration, profiles & KP-ID management', color: 'from-sky-500 to-cyan-700' },
  { icon: <BarChart2 size={18} />, name: 'Payment Service', desc: 'Transactions, invoicing & reconciliation', color: 'from-rose-500 to-pink-700' },
];

const PHASE1_APIS = [
  { method: 'POST', path: '/api/auth/login', desc: 'Authenticate user, return JWT' },
  { method: 'POST', path: '/api/users/register', desc: 'Create new user account' },
  { method: 'GET',  path: '/api/users/{id}', desc: 'Fetch user profile by ID' },
  { method: 'POST', path: '/api/kyc/verify', desc: 'Submit identity documents for KYC' },
  { method: 'POST', path: '/api/parcels/create', desc: 'Create new parcel entry' },
  { method: 'GET',  path: '/api/parcels/{tracking_id}', desc: 'Get parcel status by tracking ID' },
  { method: 'PUT',  path: '/api/parcels/update-status', desc: 'Update parcel lifecycle status' },
  { method: 'POST', path: '/api/notifications/send', desc: 'Dispatch SMS/WhatsApp notification' },
  { method: 'POST', path: '/api/payments/initiate', desc: 'Initiate payment transaction' },
];

const PHASE2_SERVICES = [
  { icon: <Box size={18} />, name: 'Smart Locker System', desc: 'IoT-enabled lockers with QR-based access & remote control API', color: 'from-indigo-500 to-indigo-700' },
  { icon: <Truck size={18} />, name: 'Courier Mobile App', desc: 'Task management, route optimization & barcode/QR scanning', color: 'from-emerald-500 to-green-700' },
  { icon: <Globe size={18} />, name: 'Logistics Integration', desc: '3rd-party logistics APIs, shipment tracking & transport scheduling', color: 'from-amber-500 to-yellow-600' },
  { icon: <Radio size={18} />, name: 'Real-Time Tracking', desc: 'GPS tracking, live status updates & ETA prediction', color: 'from-rose-500 to-red-700' },
  { icon: <Zap size={18} />, name: 'Event Bus', desc: 'Kafka / RabbitMQ for async event-driven communication', color: 'from-violet-500 to-purple-700' },
  { icon: <Layers size={18} />, name: 'Horizontal Scaling', desc: 'Load balancing, CDN for frontend & microservice replication', color: 'from-sky-500 to-blue-700' },
];

const PHASE2_APIS = [
  { method: 'POST', path: '/api/lockers/assign', desc: 'Assign locker slot to a parcel' },
  { method: 'POST', path: '/api/lockers/open', desc: 'Remotely open locker via API' },
  { method: 'GET',  path: '/api/lockers/status', desc: 'Get real-time locker occupancy' },
  { method: 'GET',  path: '/api/courier/tasks', desc: 'Fetch courier task list for the day' },
  { method: 'POST', path: '/api/courier/pickup', desc: 'Confirm parcel pickup by courier' },
  { method: 'POST', path: '/api/courier/deliver', desc: 'Mark parcel as delivered at location' },
  { method: 'POST', path: '/api/logistics/create-shipment', desc: 'Create shipment with 3rd-party logistics' },
  { method: 'GET',  path: '/api/logistics/status', desc: 'Query external logistics status' },
];

const EVENTS = [
  { name: 'Parcel Created', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { name: 'Parcel Shipped', color: 'bg-violet-100 text-violet-700 border-violet-200' },
  { name: 'Parcel Delivered', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { name: 'Locker Opened', color: 'bg-amber-100 text-amber-700 border-amber-200' },
];

const METHOD_COLORS: Record<string, string> = {
  GET:  'bg-emerald-100 text-emerald-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT:  'bg-amber-100 text-amber-700',
  DELETE: 'bg-red-100 text-red-700',
};

const DATA_MODELS = [
  {
    name: 'User',
    icon: <Shield size={15} />,
    color: 'border-blue-200 bg-blue-50',
    header: 'bg-blue-700',
    fields: [
      { field: 'id', type: 'UUID' },
      { field: 'name', type: 'string' },
      { field: 'phone', type: 'string' },
      { field: 'kp_id', type: 'string' },
      { field: 'kyc_status', type: 'enum' },
    ],
  },
  {
    name: 'Parcel',
    icon: <Package size={15} />,
    color: 'border-violet-200 bg-violet-50',
    header: 'bg-violet-700',
    fields: [
      { field: 'id', type: 'UUID' },
      { field: 'sender', type: 'User ref' },
      { field: 'receiver_kp_id', type: 'string' },
      { field: 'status', type: 'enum' },
      { field: 'location', type: 'GeoPoint' },
    ],
  },
  {
    name: 'Transaction',
    icon: <BarChart2 size={15} />,
    color: 'border-emerald-200 bg-emerald-50',
    header: 'bg-emerald-700',
    fields: [
      { field: 'id', type: 'UUID' },
      { field: 'user_id', type: 'User ref' },
      { field: 'amount', type: 'decimal' },
      { field: 'status', type: 'enum' },
    ],
  },
];

const SECURITY = [
  { icon: <Lock size={16} />, label: 'JWT / OAuth 2.0', desc: 'Stateless token-based API authentication', color: 'text-blue-600 bg-blue-50' },
  { icon: <Shield size={16} />, label: 'RBAC', desc: 'Role-Based Access Control per endpoint', color: 'text-violet-600 bg-violet-50' },
  { icon: <Cpu size={16} />, label: 'TLS + AES', desc: 'End-to-end encryption in transit and at rest', color: 'text-emerald-600 bg-emerald-50' },
  { icon: <Activity size={16} />, label: 'Audit Logging', desc: 'Immutable logs for every state change', color: 'text-amber-600 bg-amber-50' },
  { icon: <Radio size={16} />, label: 'Device Auth', desc: 'IoT locker device certificate authentication', color: 'text-rose-600 bg-rose-50' },
  { icon: <Zap size={16} />, label: 'Rate Limiting', desc: 'API throttling & fraud detection mechanisms', color: 'text-slate-600 bg-slate-50' },
];

export default function Architecture() {
  const [phase, setPhase] = useState<1 | 2>(1);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">

      {/* Header */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-10 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-blue-500/20 blur-3xl rounded-full" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-300 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-white/10 mb-5">
            <GitBranch size={12} /> Technical Architecture
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">
            KurdPost Digital Postal Platform
          </h1>
          <p className="text-blue-300 text-base max-w-2xl mx-auto">
            Full technical architecture across Phase 1 (Virtual Postal System) and Phase 2 (Smart Locker & Logistics Network).
          </p>
        </div>
      </div>

      {/* Phase tabs */}
      <div className="flex gap-3 p-1.5 bg-slate-100 rounded-2xl w-fit mx-auto">
        {([1, 2] as const).map(p => (
          <button
            key={p}
            onClick={() => setPhase(p)}
            className={`px-7 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
              phase === p
                ? 'bg-white shadow-md text-blue-700'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Phase {p} — {p === 1 ? 'Virtual Postal System' : 'Smart Locker & Logistics'}
          </button>
        ))}
      </div>

      {phase === 1 && (
        <div className="space-y-10">

          {/* Layered Architecture */}
          <section>
            <SectionTitle icon={<Layers size={18} />} title="Layered Architecture" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              {[
                { layer: 'Customer Layer', items: ['Web Portal', 'Mobile (iQiD Integration)'], icon: <Smartphone size={16} />, color: 'border-blue-200 bg-gradient-to-br from-blue-50 to-white' },
                { layer: 'Application Layer', items: ['User Management', 'KYC Service', 'Parcel Management', 'Notification Service', 'Payment Service'], icon: <Server size={16} />, color: 'border-violet-200 bg-gradient-to-br from-violet-50 to-white' },
                { layer: 'API Layer', items: ['REST APIs', 'Authentication Gateway (JWT/OAuth)'], icon: <Code2 size={16} />, color: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white' },
                { layer: 'Data Layer', items: ['User Database', 'Parcel Database', 'Logs & Audit DB'], icon: <Database size={16} />, color: 'border-amber-200 bg-gradient-to-br from-amber-50 to-white' },
                { layer: 'Infrastructure', items: ['Cloud / Hybrid Deployment'], icon: <Globe size={16} />, color: 'border-slate-200 bg-gradient-to-br from-slate-50 to-white' },
              ].map(l => (
                <div key={l.layer} className={`rounded-2xl border-2 ${l.color} p-5`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-slate-600">{l.icon}</span>
                    <h3 className="font-bold text-slate-800 text-sm">{l.layer}</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {l.items.map(i => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 size={11} className="text-slate-400 shrink-0" />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Microservices */}
          <section>
            <SectionTitle icon={<Server size={18} />} title="Microservices Breakdown" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              {PHASE1_SERVICES.map(s => (
                <ServiceCard key={s.name} {...s} />
              ))}
            </div>
          </section>

          {/* API Endpoints */}
          <section>
            <SectionTitle icon={<Code2 size={18} />} title="API Design — Sample Endpoints" />
            <ApiTable endpoints={PHASE1_APIS} />
          </section>

          {/* Data Models */}
          <section>
            <SectionTitle icon={<Database size={18} />} title="Data Models" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
              {DATA_MODELS.map(m => (
                <DataModelCard key={m.name} {...m} />
              ))}
            </div>
          </section>

          {/* Security */}
          <SecuritySection />
        </div>
      )}

      {phase === 2 && (
        <div className="space-y-10">

          {/* Extended Architecture diagram */}
          <section>
            <SectionTitle icon={<GitBranch size={18} />} title="Extended Architecture" />
            <div className="mt-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="px-6 py-3 bg-gradient-to-br from-blue-700 to-blue-900 text-white text-sm font-bold rounded-xl shadow-md">
                  Core Platform (Phase 1)
                </div>
                <div className="w-0.5 h-6 bg-slate-300" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Smart Locker System', 'Courier Mobile App', 'Logistics Integration', 'Real-Time Tracking'].map(n => (
                    <div key={n} className="text-center px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm">
                      {n}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 flex-wrap justify-center mt-1">
                  {EVENTS.map(e => (
                    <span key={e.name} className={`text-xs font-bold px-3 py-1 rounded-full border ${e.color}`}>
                      ⚡ {e.name}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1">Event Bus — Kafka / RabbitMQ</p>
              </div>
            </div>
          </section>

          {/* Phase 2 Services */}
          <section>
            <SectionTitle icon={<Cpu size={18} />} title="New Systems & Services" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              {PHASE2_SERVICES.map(s => (
                <ServiceCard key={s.name} {...s} />
              ))}
            </div>
          </section>

          {/* Phase 2 APIs */}
          <section>
            <SectionTitle icon={<Code2 size={18} />} title="API Design — Phase 2 Endpoints" />
            <ApiTable endpoints={PHASE2_APIS} />
          </section>

          {/* Scalability */}
          <section>
            <SectionTitle icon={<BarChart2 size={18} />} title="Scalability & Performance" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
              {[
                { icon: <Server size={20} />, label: 'Microservices', desc: 'Independent deployment per service', color: 'text-blue-600 bg-blue-50' },
                { icon: <Layers size={20} />, label: 'Horizontal Scaling', desc: 'Add nodes under load automatically', color: 'text-violet-600 bg-violet-50' },
                { icon: <Globe size={20} />, label: 'CDN Frontend', desc: 'Global edge distribution for web assets', color: 'text-emerald-600 bg-emerald-50' },
                { icon: <Activity size={20} />, label: 'Load Balancing', desc: 'Traffic distribution across instances', color: 'text-amber-600 bg-amber-50' },
              ].map(s => (
                <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                    {s.icon}
                  </div>
                  <p className="font-bold text-slate-800 text-sm">{s.label}</p>
                  <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Security Enhancements */}
          <SecuritySection phase2 />
        </div>
      )}

    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
        {icon}
      </div>
      <h2 className="text-lg font-black text-slate-800 tracking-tight">{title}</h2>
    </div>
  );
}

function ServiceCard({ icon, name, desc, color }: { icon: React.ReactNode; name: string; desc: string; color: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm card-hover flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="font-bold text-slate-800 text-sm">{name}</p>
        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ApiTable({ endpoints }: { endpoints: { method: string; path: string; desc: string }[] }) {
  return (
    <div className="mt-5 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="bg-slate-800 px-5 py-3 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-red-400" />
        <span className="w-3 h-3 rounded-full bg-amber-400" />
        <span className="w-3 h-3 rounded-full bg-emerald-400" />
        <span className="ml-2 text-xs text-slate-400 font-mono">REST API Endpoints</span>
      </div>
      <div className="divide-y divide-slate-50">
        {endpoints.map(e => (
          <div key={e.path} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors">
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg w-14 text-center shrink-0 ${METHOD_COLORS[e.method]}`}>
              {e.method}
            </span>
            <span className="font-mono text-sm text-slate-800 flex-1">{e.path}</span>
            <span className="text-xs text-slate-400 hidden sm:block text-right max-w-[260px]">{e.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DataModelCard({ name, icon, color, header, fields }: {
  name: string; icon: React.ReactNode; color: string; header: string;
  fields: { field: string; type: string }[];
}) {
  return (
    <div className={`border-2 rounded-2xl overflow-hidden ${color}`}>
      <div className={`${header} px-4 py-2.5 flex items-center gap-2`}>
        <span className="text-white/80">{icon}</span>
        <span className="text-white font-bold text-sm">{name}</span>
      </div>
      <div className="divide-y divide-white/60">
        {fields.map(f => (
          <div key={f.field} className="flex items-center justify-between px-4 py-2">
            <span className="font-mono text-xs text-slate-700">{f.field}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{f.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecuritySection({ phase2 = false }: { phase2?: boolean }) {
  const items = phase2 ? SECURITY : SECURITY.slice(0, 4);
  return (
    <section>
      <SectionTitle icon={<Shield size={18} />} title={phase2 ? 'Security Enhancements' : 'Security Architecture'} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {items.map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-start gap-3">
            <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center shrink-0`}>
              {s.icon}
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">{s.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

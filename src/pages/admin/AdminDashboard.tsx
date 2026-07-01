import {
  Package, Users, MapPin, TrendingUp, CheckCircle2, AlertTriangle,
  Truck, BarChart3, DollarSign, Clock,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import { mockShipments, mockUsers, mockBranches, mockDashboardStats } from '../../data/mockData';
import { StatCard } from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatDate } from '../../utils';

// ─── Chart data ───────────────────────────────────────────────────────────────
const barData = [
  { day: 'Mon', shipments: 38, delivered: 31 },
  { day: 'Tue', shipments: 52, delivered: 44 },
  { day: 'Wed', shipments: 45, delivered: 40 },
  { day: 'Thu', shipments: 60, delivered: 52 },
  { day: 'Fri', shipments: 55, delivered: 48 },
  { day: 'Sat', shipments: 27, delivered: 25 },
  { day: 'Sun', shipments: 18, delivered: 16 },
];

const revenueData = [
  { month: 'Nov', revenue: 62000 },
  { month: 'Dec', revenue: 71000 },
  { month: 'Jan', revenue: 58000 },
  { month: 'Feb', revenue: 75000 },
  { month: 'Mar', revenue: 80000 },
  { month: 'Apr', revenue: 84500 },
];

const PIE_COLORS = ['#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#94a3b8', '#3b82f6'];

// ─── Custom tooltip for charts ────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-panel px-3 py-2.5 text-xs">
      <p className="font-bold text-slate-700 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {typeof p.value === 'number' && p.value > 1000 ? `$${(p.value / 1000).toFixed(1)}K` : p.value}
        </p>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const recent = [...mockShipments].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
  const stats = mockDashboardStats;

  const statusCounts = [
    { name: 'Delivered',        value: mockShipments.filter(s => s.status === 'delivered').length,        key: 'delivered' },
    { name: 'In Transit',       value: mockShipments.filter(s => s.status === 'in_transit').length,       key: 'in_transit' },
    { name: 'Out for Delivery', value: mockShipments.filter(s => s.status === 'out_for_delivery').length, key: 'out_for_delivery' },
    { name: 'Delayed',          value: mockShipments.filter(s => s.status === 'delayed').length,          key: 'delayed' },
    { name: 'Returned',         value: mockShipments.filter(s => s.status === 'returned').length,         key: 'returned' },
    { name: 'Accepted',         value: mockShipments.filter(s => s.status === 'accepted').length,         key: 'accepted' },
  ];


  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Overview</h1>
          <p className="text-slate-500 text-sm mt-0.5">Kurd Post system dashboard — live statistics</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full pulse-dot" />
          <span className="text-xs font-bold text-emerald-700">System Operational</span>
        </div>
      </div>

      {/* KPI row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Shipments"
          value={stats.totalShipments.toLocaleString()}
          icon={<Package size={20} />}
          color="blue"
          sub="All time"
          trend={{ value: 12, label: 'this month' }}
        />
        <StatCard
          label="Delivered"
          value={stats.delivered.toLocaleString()}
          icon={<CheckCircle2 size={20} />}
          color="green"
          sub="Successfully"
          trend={{ value: 8, label: 'vs last month' }}
        />
        <StatCard
          label="In Transit"
          value={stats.inTransit.toLocaleString()}
          icon={<Truck size={20} />}
          color="purple"
          sub="Active now"
        />
        <StatCard
          label="Delayed"
          value={stats.delayed.toLocaleString()}
          icon={<AlertTriangle size={20} />}
          color="red"
          sub="Needs attention"
          trend={{ value: -5, label: 'improving' }}
        />
      </div>

      {/* KPI row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Registered Users"
          value={stats.totalUsers.toLocaleString()}
          icon={<Users size={20} />}
          color="amber"
          trend={{ value: 22, label: 'this month' }}
        />
        <StatCard
          label="Active Branches"
          value={mockBranches.filter(b => b.isActive).length}
          icon={<MapPin size={20} />}
          color="teal"
          sub={`${mockBranches.length} total`}
        />
        <StatCard
          label="Revenue This Month"
          value={`$${(stats.revenueThisMonth / 1000).toFixed(1)}K`}
          icon={<DollarSign size={20} />}
          color="gold"
          trend={{ value: 6, label: 'vs last month' }}
        />
        <StatCard
          label="Shipments Today"
          value={stats.shipmentsToday}
          icon={<BarChart3 size={20} />}
          color="blue"
          sub="Updated live"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Bar chart — Daily shipments */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800 tracking-tight">Shipments This Week</h3>
              <p className="text-xs text-slate-400 mt-0.5">Daily breakdown of shipments vs deliveries</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />Shipments</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />Delivered</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barGap={4} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.05)' }} />
              <Bar dataKey="shipments" name="Shipments" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="delivered" name="Delivered" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart — Status distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
          <div className="mb-5">
            <h3 className="font-bold text-slate-800 tracking-tight">Status Distribution</h3>
            <p className="text-xs text-slate-400 mt-0.5">Current shipment breakdown</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={statusCounts}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {statusCounts.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 11 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {statusCounts.slice(0, 4).map((s, i) => (
              <div key={s.key} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-slate-600">{s.name}</span>
                </div>
                <span className="font-bold text-slate-700">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue line chart + Users by role */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Revenue line chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center">
              <TrendingUp size={16} className="text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 tracking-tight">Revenue Trend</h3>
              <p className="text-xs text-slate-400">Last 6 months (USD)</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={42}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={{ fill: '#f59e0b', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#d97706' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status bars + User roles */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
              <Users size={16} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 tracking-tight">Users by Role</h3>
              <p className="text-xs text-slate-400">Account type distribution</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { role: 'citizen',    label: 'Citizens',    color: 'bg-blue-500',    bg: 'bg-blue-50', text: 'text-blue-700' },
              { role: 'business',   label: 'Businesses',  color: 'bg-violet-500',  bg: 'bg-violet-50', text: 'text-violet-700' },
              { role: 'government', label: 'Government',  color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
              { role: 'admin',      label: 'Admins',      color: 'bg-slate-600',   bg: 'bg-slate-50', text: 'text-slate-700' },
            ].map(r => {
              const count = mockUsers.filter(u => u.role === r.role).length;
              const pct = Math.round((count / mockUsers.length) * 100);
              return (
                <div key={r.role}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${r.color}`} />
                      <span className="text-sm text-slate-600 font-medium">{r.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">{count}</span>
                      <span className={`text-xs ${r.text} ${r.bg} px-2 py-0.5 rounded-full font-semibold`}>{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${r.color} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Branch status */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-700">Branch Status</h4>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-slate-600 font-medium">{mockBranches.filter(b => b.isActive).length} Active</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-red-400 rounded-full" />
                  <span className="text-slate-600 font-medium">{mockBranches.filter(b => !b.isActive).length} Inactive</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent shipments table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100">
          <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
            <Clock size={16} className="text-blue-600" />
          </div>
          <h3 className="font-bold text-slate-800 tracking-tight">Recent Shipments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Tracking #', 'From', 'To', 'Type', 'Date', 'Status'].map(h => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recent.map(s => (
                <tr key={s.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-xs text-blue-700">{s.trackingNumber}</td>
                  <td className="px-5 py-3.5 text-slate-700 text-xs font-medium">{s.sender.city}</td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">{s.receiver.city}, {s.receiver.country}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full capitalize">
                      {s.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{formatDate(s.createdAt)}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={s.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

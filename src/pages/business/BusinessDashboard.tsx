import { Link } from 'react-router-dom';
import { Upload, BarChart3, FileText, Package, TrendingUp, CheckCircle2, Truck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockShipments } from '../../data/mockData';
import { StatCard } from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import { formatDate } from '../../utils';

export default function BusinessDashboard() {
  const { user } = useAuth();
  const myShipments = mockShipments.filter(s => s.userId === user?.id);

  const stats = {
    total: myShipments.length,
    delivered: myShipments.filter(s => s.status === 'delivered').length,
    inTransit: myShipments.filter(s => ['in_transit', 'accepted'].includes(s.status)).length,
    delayed: myShipments.filter(s => s.status === 'delayed').length,
  };

  const totalValue = myShipments.reduce((sum, s) => sum + (s.value || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{user?.companyName || 'Business Dashboard'}</h1>
          <p className="text-slate-500 text-sm">Business Account · {user?.email}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/business/bulk"><Button variant="outline" icon={<Upload size={14} />}>Bulk Upload</Button></Link>
          <Link to="/portal/send"><Button icon={<Package size={14} />}>New Shipment</Button></Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Shipments" value={stats.total} icon={<Package size={22} />} color="blue" />
        <StatCard label="Delivered" value={stats.delivered} icon={<CheckCircle2 size={22} />} color="green" />
        <StatCard label="In Transit" value={stats.inTransit} icon={<Truck size={22} />} color="purple" />
        <StatCard label="Total Value (IQD)" value={totalValue.toLocaleString()} icon={<TrendingUp size={22} />} color="gold" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: '/business/bulk',    icon: <Upload size={20} />,   label: 'Bulk Upload',      desc: 'Upload multiple shipments via CSV', color: 'blue' },
          { to: '/business/reports', icon: <BarChart3 size={20} />, label: 'Delivery Reports',  desc: 'View invoices and performance', color: 'purple' },
          { to: '/business/company', icon: <FileText size={20} />, label: 'Company Profile',   desc: 'Update your business details', color: 'amber' },
        ].map(a => (
          <Link key={a.to} to={a.to}
            className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-card hover:shadow-panel hover:border-blue-200 transition-all group">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">{a.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 text-sm">{a.label}</p>
              <p className="text-xs text-slate-400">{a.desc}</p>
            </div>
            <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
          </Link>
        ))}
      </div>

      {/* Recent shipments */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-800">Recent Shipments</h2>
          <Link to="/portal/history" className="text-sm text-blue-600 font-medium flex items-center gap-1">View all <ArrowRight size={14} /></Link>
        </div>
        {myShipments.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Package size={36} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No shipments yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {[...myShipments].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6).map(s => (
              <div key={s.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50">
                <div>
                  <p className="font-mono font-semibold text-sm text-slate-800">{s.trackingNumber}</p>
                  <p className="text-xs text-slate-400">To: {s.receiver.name} · {s.receiver.city} · {formatDate(s.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  {s.value && <span className="text-xs text-slate-500">{s.value.toLocaleString()} IQD</span>}
                  <StatusBadge status={s.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delivery performance */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Delivery Performance</h3>
        <div className="space-y-3">
          {[
            { label: 'Delivery Rate', value: stats.total ? Math.round((stats.delivered / stats.total) * 100) : 0, color: 'bg-emerald-500' },
            { label: 'In-Transit Rate', value: stats.total ? Math.round((stats.inTransit / stats.total) * 100) : 0, color: 'bg-blue-500' },
            { label: 'Delay Rate', value: stats.total ? Math.round((stats.delayed / stats.total) * 100) : 0, color: 'bg-red-500' },
          ].map(m => (
            <div key={m.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">{m.label}</span>
                <span className="font-semibold text-slate-800">{m.value}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${m.color} rounded-full transition-all`} style={{ width: `${m.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

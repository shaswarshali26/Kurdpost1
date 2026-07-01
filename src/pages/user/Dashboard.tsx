import { Link } from 'react-router-dom';
import {
  Send, Package, Clock, CheckCircle2, AlertTriangle, ArrowRight,
  Truck, TrendingUp, Zap, History,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockShipments } from '../../data/mockData';
import { StatCard } from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatDate } from '../../utils';
import Button from '../../components/ui/Button';

export default function UserDashboard() {
  const { user } = useAuth();
  const myShipments = mockShipments.filter(s => s.userId === user?.id);

  const stats = {
    total: myShipments.length,
    delivered: myShipments.filter(s => s.status === 'delivered').length,
    inTransit: myShipments.filter(s => ['in_transit', 'out_for_delivery', 'accepted'].includes(s.status)).length,
    delayed: myShipments.filter(s => s.status === 'delayed').length,
  };

  const recent = [...myShipments]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">

      {/* Welcome banner */}
      <div className="relative bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl p-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
        />
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-blue-300 text-sm font-medium mb-1">{greeting},</p>
            <h1 className="text-2xl font-black text-white tracking-tight">{user?.firstName} {user?.lastName}</h1>
            <p className="text-blue-300 text-sm mt-1">
              {stats.inTransit > 0
                ? `You have ${stats.inTransit} active shipment${stats.inTransit !== 1 ? 's' : ''} in transit`
                : 'No active shipments — ready to send something?'}
            </p>
          </div>
          <Link to="/portal/send">
            <Button variant="gold" size="lg" icon={<Send size={17} />}>
              New Shipment
            </Button>
          </Link>
        </div>
      </div>

      {/* Unverified alert */}
      {!user?.isVerified && (
        <div className="flex items-start gap-3 bg-amber-50 border-2 border-amber-200 rounded-2xl px-5 py-4">
          <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-800 text-sm">Account verification pending</p>
            <p className="text-amber-700 text-xs mt-0.5">
              Visit any Kurd Post branch with your ID to complete verification and unlock all features.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Shipments"
          value={stats.total}
          icon={<Package size={20} />}
          color="blue"
          sub="All time"
        />
        <StatCard
          label="Delivered"
          value={stats.delivered}
          icon={<CheckCircle2 size={20} />}
          color="green"
          sub="Successfully"
        />
        <StatCard
          label="In Transit"
          value={stats.inTransit}
          icon={<Truck size={20} />}
          color="purple"
          sub="Active now"
        />
        <StatCard
          label="Delayed"
          value={stats.delayed}
          icon={<AlertTriangle size={20} />}
          color="red"
          sub="Needs attention"
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            to: '/portal/send',
            icon: <Send size={22} />,
            label: 'Send a Shipment',
            desc: 'Create a new shipment request',
            gradient: 'from-blue-600 to-blue-700',
            bg: 'bg-blue-50',
            color: 'text-blue-600',
          },
          {
            to: '/portal/track',
            icon: <Zap size={22} />,
            label: 'Track Shipment',
            desc: 'Real-time tracking lookup',
            gradient: 'from-violet-600 to-purple-700',
            bg: 'bg-violet-50',
            color: 'text-violet-600',
          },
          {
            to: '/portal/history',
            icon: <History size={22} />,
            label: 'Shipment History',
            desc: 'View all past shipments',
            gradient: 'from-amber-500 to-amber-600',
            bg: 'bg-amber-50',
            color: 'text-amber-600',
          },
        ].map(a => (
          <Link
            key={a.to}
            to={a.to}
            className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-card card-hover"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-200 shrink-0`}
            >
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 text-sm">{a.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{a.desc}</p>
            </div>
            <ArrowRight
              size={16}
              className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0"
            />
          </Link>
        ))}
      </div>

      {/* Recent shipments */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
              <Clock size={16} className="text-blue-600" />
            </div>
            <h2 className="font-bold text-slate-800 tracking-tight">Recent Shipments</h2>
          </div>
          <Link
            to="/portal/history"
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="opacity-40" />
            </div>
            <p className="text-sm font-medium text-slate-500">No shipments yet</p>
            <p className="text-xs text-slate-400 mt-1">
              <Link to="/portal/send" className="text-blue-600 hover:underline font-semibold">
                Send your first shipment
              </Link>
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {recent.map((s, i) => (
              <div
                key={s.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Type icon */}
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Package size={16} className="text-blue-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-mono font-bold text-sm text-slate-800 tracking-tight">
                    {s.trackingNumber}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    → {s.receiver.name} · {s.receiver.city} · {formatDate(s.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={s.status} size="sm" />
                  <Link
                    to={`/portal/track?q=${s.trackingNumber}`}
                    className="w-7 h-7 bg-slate-100 hover:bg-blue-100 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all"
                  >
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Performance mini-stat */}
      {stats.total > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
              <TrendingUp size={16} className="text-emerald-600" />
            </div>
            <h2 className="font-bold text-slate-800 text-sm">Your Delivery Performance</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">Delivery Success Rate</span>
                <span className="font-bold text-slate-800">
                  {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                  style={{ width: `${stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

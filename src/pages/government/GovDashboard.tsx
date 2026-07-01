import { Link } from 'react-router-dom';
import { FileText, Shield, Clock, CheckCircle2, Send, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockShipments } from '../../data/mockData';
import { StatCard } from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import { formatDate } from '../../utils';

export default function GovDashboard() {
  const { user } = useAuth();
  const myShipments = mockShipments.filter(s => s.userId === user?.id);
  const officialShipments = myShipments.filter(s => s.isOfficial);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{user?.department || 'Government Portal'}</h1>
          <p className="text-slate-500 text-sm">Official postal management — {user?.email}</p>
        </div>
        <Link to="/government/document"><Button icon={<FileText size={14} />}>New Document Shipment</Button></Link>
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-5 py-4">
        <Shield size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-800 text-sm">Secure Government Channel</p>
          <p className="text-blue-600 text-xs mt-0.5">All shipments through this portal are handled with government-grade security, full audit trail, and mandatory delivery confirmation.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Sent" value={myShipments.length} icon={<Send size={22} />} color="blue" />
        <StatCard label="Official Documents" value={officialShipments.length} icon={<FileText size={22} />} color="emerald" />
        <StatCard label="Delivered" value={myShipments.filter(s => s.status === 'delivered').length} icon={<CheckCircle2 size={22} />} color="green" />
        <StatCard label="Pending" value={myShipments.filter(s => ['accepted', 'in_transit'].includes(s.status)).length} icon={<Clock size={22} />} color="amber" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { to: '/government/document', icon: <FileText size={20} />, label: 'Document Shipment', desc: 'Send verified official documents' },
          { to: '/portal/track',        icon: <Shield size={20} />,   label: 'Track Shipment',    desc: 'Real-time status of active shipments' },
        ].map(a => (
          <Link key={a.to} to={a.to}
            className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-card hover:shadow-panel hover:border-emerald-200 transition-all group">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">{a.icon}</div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800 text-sm">{a.label}</p>
              <p className="text-xs text-slate-400">{a.desc}</p>
            </div>
            <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
          </Link>
        ))}
      </div>

      {/* Shipments table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Document Shipment Audit Log</h2>
          <Link to="/portal/history" className="text-sm text-blue-600 font-medium flex items-center gap-1">
            Full history <ArrowRight size={14} />
          </Link>
        </div>
        {myShipments.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <FileText size={36} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No shipments yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Tracking #', 'To', 'Date', 'Official', 'Verified', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myShipments.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-semibold text-blue-700 text-xs">{s.trackingNumber}</td>
                    <td className="px-4 py-3 text-slate-700">{s.receiver.name}<br /><span className="text-xs text-slate-400">{s.receiver.city}</span></td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(s.createdAt)}</td>
                    <td className="px-4 py-3">
                      {s.isOfficial ? <span className="text-xs text-emerald-600 font-medium">✓ Official</span> : <span className="text-xs text-slate-400">Standard</span>}
                    </td>
                    <td className="px-4 py-3">
                      {s.requiresVerification ? <CheckCircle2 size={14} className="text-emerald-500" /> : <span className="text-xs text-slate-400">N/A</span>}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

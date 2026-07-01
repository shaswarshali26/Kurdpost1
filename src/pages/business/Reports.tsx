import { Download, TrendingUp, Package, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockShipments } from '../../data/mockData';
import Card, { StatCard } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatDate } from '../../utils';

export default function Reports() {
  const { user } = useAuth();
  const shipments = mockShipments.filter(s => s.userId === user?.id);
  const totalValue = shipments.reduce((s, sh) => s + (sh.value || 0), 0);
  const delivered = shipments.filter(s => s.status === 'delivered');
  const delayed = shipments.filter(s => s.status === 'delayed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Delivery Reports</h1>
          <p className="text-slate-500 text-sm">Shipment performance and invoice summary</p>
        </div>
        <Button variant="outline" icon={<Download size={14} />}>Export Report (CSV)</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Shipments" value={shipments.length} icon={<Package size={22} />} color="blue" />
        <StatCard label="Successfully Delivered" value={delivered.length} icon={<CheckCircle2 size={22} />} color="green" />
        <StatCard label="Delayed" value={delayed.length} icon={<AlertTriangle size={22} />} color="red" />
        <StatCard label="Total Declared Value" value={`${totalValue.toLocaleString()} IQD`} icon={<TrendingUp size={22} />} color="gold" sub="All shipments" />
      </div>

      {/* Breakdown by type */}
      <Card>
        <h3 className="font-semibold text-slate-800 mb-4">Shipments by Type</h3>
        {['standard', 'express', 'document', 'fragile', 'bulk'].map(type => {
          const count = shipments.filter(s => s.type === type).length;
          const pct = shipments.length ? Math.round((count / shipments.length) * 100) : 0;
          return (
            <div key={type} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 capitalize">{type}</span>
                <span className="font-semibold text-slate-800">{count} ({pct}%)</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </Card>

      {/* Invoice table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Shipment Invoices</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Tracking #', 'Receiver', 'Date', 'Type', 'Weight', 'Value', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shipments.map(s => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-semibold text-blue-700 text-xs">{s.trackingNumber}</td>
                  <td className="px-4 py-3 text-slate-700">{s.receiver.name}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(s.createdAt)}</td>
                  <td className="px-4 py-3 text-slate-500 capitalize">{s.type}</td>
                  <td className="px-4 py-3 text-slate-500">{s.weight} kg</td>
                  <td className="px-4 py-3 text-slate-700">{s.value ? `${s.value.toLocaleString()} IQD` : '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {shipments.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">No shipments found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

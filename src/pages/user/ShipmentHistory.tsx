import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Package, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockShipments } from '../../data/mockData';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatDate } from '../../utils';
import type { ShipmentStatus } from '../../types';

const STATUS_FILTERS: { value: ShipmentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'delayed', label: 'Delayed' },
  { value: 'returned', label: 'Returned' },
];

export default function ShipmentHistory() {
  const { user } = useAuth();
  const myShipments = mockShipments.filter(s => s.userId === user?.id);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | 'all'>('all');

  const filtered = myShipments.filter(s => {
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || s.trackingNumber.toLowerCase().includes(q) || s.receiver.name.toLowerCase().includes(q) || s.receiver.city.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">Shipment History</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by tracking number, name, or city..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 outline-none bg-white" />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={14} className="text-slate-400" />
          {STATUS_FILTERS.map(f => (
            <button key={f.value} onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === f.value ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Package size={36} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No shipments found.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-6 px-6 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <div className="col-span-2">Tracking Number</div>
              <div>Receiver</div>
              <div>Date</div>
              <div>Status</div>
              <div className="text-right">Action</div>
            </div>
            <div className="divide-y divide-slate-100">
              {filtered.map(s => (
                <div key={s.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="md:grid md:grid-cols-6 md:items-center gap-4 flex flex-col gap-2">
                    <div className="md:col-span-2">
                      <p className="font-mono font-semibold text-sm text-slate-800">{s.trackingNumber}</p>
                      <p className="text-xs text-slate-400 capitalize">{s.type} · {s.scope}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-700">{s.receiver.name}</p>
                      <p className="text-xs text-slate-400">{s.receiver.city}, {s.receiver.country}</p>
                    </div>
                    <div className="text-sm text-slate-500">{formatDate(s.createdAt)}</div>
                    <div><StatusBadge status={s.status} size="sm" /></div>
                    <div className="md:text-right">
                      <Link to={`/portal/track?q=${s.trackingNumber}`}
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
                        Track <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <p className="text-xs text-slate-400 text-right">{filtered.length} shipment(s) shown</p>
    </div>
  );
}

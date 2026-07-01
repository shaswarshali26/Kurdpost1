import { useState } from 'react';
import { Search, Edit3, Eye } from 'lucide-react';
import { mockShipments } from '../../data/mockData';
import type { ShipmentStatus } from '../../types';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Select } from '../../components/ui/Input';
import { formatDate } from '../../utils';

const ALL_STATUSES: ShipmentStatus[] = ['accepted', 'in_transit', 'out_for_delivery', 'delivered', 'delayed', 'returned'];

export default function ManageShipments() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | 'all'>('all');
  const [editModal, setEditModal] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<ShipmentStatus>('accepted');
  const [statusNote, setStatusNote] = useState('');

  const shipments = mockShipments.filter(s => {
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || s.trackingNumber.toLowerCase().includes(q) || s.sender.name.toLowerCase().includes(q) || s.receiver.name.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const editingShipment = mockShipments.find(s => s.id === editModal);

  const handleUpdateStatus = () => {
    const s = mockShipments.find(sh => sh.id === editModal);
    if (!s) return;
    s.status = newStatus;
    s.updatedAt = new Date().toISOString();
    s.statusHistory.push({ status: newStatus, timestamp: new Date().toISOString(), location: 'Kurd Post HQ', note: statusNote || undefined, operator: 'Admin' });
    setEditModal(null);
    setStatusNote('');
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">Manage Shipments</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tracking number, sender, receiver..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 outline-none bg-white" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(['all', ...ALL_STATUSES] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                statusFilter === s ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
              }`}>
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Tracking #', 'From → To', 'Type', 'Official', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shipments.map(s => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-semibold text-xs text-blue-700 whitespace-nowrap">{s.trackingNumber}</td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-slate-700">{s.sender.city} → {s.receiver.city}</p>
                    <p className="text-xs text-slate-400">{s.sender.name}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 capitalize">{s.type}</td>
                  <td className="px-4 py-3">
                    {s.isOfficial ? <span className="text-xs text-emerald-600 font-semibold">✓ Gov</span> : <span className="text-xs text-slate-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{formatDate(s.createdAt)}</td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} size="sm" /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="text-xs" icon={<Eye size={12} />}>View</Button>
                      <Button size="sm" variant="outline" className="text-xs" icon={<Edit3 size={12} />}
                        onClick={() => { setEditModal(s.id); setNewStatus(s.status); }}>
                        Update
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {shipments.length === 0 && <div className="text-center py-12 text-slate-400 text-sm">No shipments found.</div>}
        </div>
      </div>

      {/* Update status modal */}
      <Modal open={!!editModal} onClose={() => setEditModal(null)} title={`Update Status — ${editingShipment?.trackingNumber}`}>
        <div className="space-y-4">
          {editingShipment && (
            <div className="bg-slate-50 rounded-xl p-4 text-sm space-y-2">
              <p><span className="text-slate-400">From:</span> <span className="font-medium">{editingShipment.sender.name} · {editingShipment.sender.city}</span></p>
              <p><span className="text-slate-400">To:</span> <span className="font-medium">{editingShipment.receiver.name} · {editingShipment.receiver.city}</span></p>
              <p><span className="text-slate-400">Current:</span> <StatusBadge status={editingShipment.status} size="sm" /></p>
            </div>
          )}
          <Select label="New Status" value={newStatus} onChange={e => setNewStatus(e.target.value as ShipmentStatus)}
            options={ALL_STATUSES.map(s => ({ value: s, label: s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) }))} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Note (optional)</label>
            <textarea value={statusNote} onChange={e => setStatusNote(e.target.value)} rows={3}
              placeholder="Add a note about this status change..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 outline-none resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setEditModal(null)} className="flex-1">Cancel</Button>
            <Button onClick={handleUpdateStatus} className="flex-1">Update Status</Button>
          </div>
        </div>
      </Modal>

      <p className="text-xs text-slate-400 text-right">{shipments.length} shipment(s) shown</p>
    </div>
  );
}

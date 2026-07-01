import { useState } from 'react';
import { CheckCircle2, MessageSquare } from 'lucide-react';
import { mockTickets } from '../../data/mockData';
import type { SupportTicket } from '../../types';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { formatDateTime } from '../../utils';

const STATUS_COLORS: Record<SupportTicket['status'], string> = {
  open: 'bg-red-50 text-red-700 border-red-200',
  in_progress: 'bg-amber-50 text-amber-700 border-amber-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  closed: 'bg-slate-100 text-slate-500 border-slate-200',
};

const PRIORITY_COLORS: Record<SupportTicket['priority'], string> = {
  high: 'text-red-600', medium: 'text-amber-600', low: 'text-slate-400',
};

export default function SupportTickets() {
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [filter, setFilter] = useState<SupportTicket['status'] | 'all'>('all');

  const filtered = mockTickets.filter(t => filter === 'all' || t.status === filter);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Support Tickets</h1>
        <div className="flex gap-1.5 flex-wrap">
          {(['all', 'open', 'in_progress', 'resolved', 'closed'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                filter === s ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
              }`}>
              {s === 'all' ? 'All' : s.replace('_', ' ')} ({s === 'all' ? mockTickets.length : mockTickets.filter(t => t.status === s).length})
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(ticket => (
          <div key={ticket.id} className="bg-white rounded-xl border border-slate-200 shadow-card p-5 hover:shadow-panel transition-shadow">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-xs font-semibold uppercase ${PRIORITY_COLORS[ticket.priority]}`}>
                    {ticket.priority} priority
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize ${STATUS_COLORS[ticket.status]}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                  {ticket.trackingNumber && (
                    <span className="text-xs text-blue-600 font-mono">{ticket.trackingNumber}</span>
                  )}
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{ticket.subject}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">{ticket.message}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span>{ticket.userName}</span>
                  <span>·</span>
                  <span>{formatDateTime(ticket.createdAt)}</span>
                </div>
              </div>
              <Button size="sm" variant="outline" icon={<MessageSquare size={12} />} onClick={() => setSelected(ticket)}>
                View
              </Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-slate-200">
            <CheckCircle2 size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No tickets in this category.</p>
          </div>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.subject || ''} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-slate-400">From:</span> <span className="font-medium text-slate-700">{selected.userName}</span></div>
              <div><span className="text-slate-400">Priority:</span> <span className={`font-medium capitalize ${PRIORITY_COLORS[selected.priority]}`}>{selected.priority}</span></div>
              <div><span className="text-slate-400">Status:</span> <span className={`font-medium px-2 py-0.5 rounded-full text-xs border ${STATUS_COLORS[selected.status]}`}>{selected.status.replace('_', ' ')}</span></div>
              <div><span className="text-slate-400">Created:</span> <span className="font-medium text-slate-700">{formatDateTime(selected.createdAt)}</span></div>
              {selected.trackingNumber && <div className="col-span-2"><span className="text-slate-400">Tracking #:</span> <span className="font-mono text-blue-600">{selected.trackingNumber}</span></div>}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-sm text-slate-700 leading-relaxed">{selected.message}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Admin Reply</p>
              <textarea rows={4} placeholder="Type your response to the user..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 outline-none resize-none" />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button size="sm">Send Reply</Button>
              <Button size="sm" variant="outline">Mark In Progress</Button>
              <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-300">Resolve</Button>
              <Button size="sm" variant="ghost" className="text-slate-400 ml-auto">Close Ticket</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

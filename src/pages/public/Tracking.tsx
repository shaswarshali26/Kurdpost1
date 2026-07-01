import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search, Package, CheckCircle2, Clock, AlertTriangle, RotateCcw,
  Truck, MapPin, ArrowRight, Shield, Globe,
} from 'lucide-react';
import { mockShipments } from '../../data/mockData';
import type { Shipment, ShipmentStatus } from '../../types';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatDateTime, formatDate, STATUS_CONFIG } from '../../utils';
import Button from '../../components/ui/Button';

const statusIcons: Record<ShipmentStatus, React.ReactNode> = {
  accepted:         <CheckCircle2 size={16} />,
  in_transit:       <Truck size={16} />,
  out_for_delivery: <MapPin size={16} />,
  delivered:        <CheckCircle2 size={16} />,
  delayed:          <AlertTriangle size={16} />,
  returned:         <RotateCcw size={16} />,
};

const statusGradients: Record<ShipmentStatus, string> = {
  accepted:         'from-blue-600 to-blue-700',
  in_transit:       'from-violet-600 to-purple-700',
  out_for_delivery: 'from-amber-500 to-orange-600',
  delivered:        'from-emerald-600 to-teal-700',
  delayed:          'from-red-500 to-rose-700',
  returned:         'from-slate-500 to-slate-700',
};

// ─── Timeline ────────────────────────────────────────────────────────────────
function TrackingTimeline({ shipment }: { shipment: Shipment }) {
  const total = shipment.statusHistory.length;

  return (
    <div className="mt-6">
      <h3 className="font-bold text-slate-700 mb-5 text-sm uppercase tracking-widest flex items-center gap-2">
        <Clock size={14} className="text-slate-400" />
        Status History
      </h3>

      <div className="space-y-0">
        {shipment.statusHistory.map((event, i) => {
          const isLast = i === total - 1;
          const isFirst = i === 0;
          const grad = statusGradients[event.status];

          return (
            <div key={i} className="relative flex gap-5 pb-0">
              {/* Vertical connector */}
              <div className="flex flex-col items-center">
                {/* Dot */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center z-10 shadow-sm shrink-0 transition-all duration-300 ${
                    isLast
                      ? `bg-gradient-to-br ${grad} text-white shadow-md`
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {statusIcons[event.status]}
                </div>
                {/* Line */}
                {!isLast && (
                  <div className={`w-0.5 flex-1 mt-1 mb-1 ${isFirst ? 'bg-blue-200' : 'bg-slate-200'}`}
                    style={{ minHeight: 32 }}
                  />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 pb-5 ${isLast ? 'pb-0' : ''}`}>
                <div className={`rounded-xl border p-4 ${
                  isLast
                    ? 'border-blue-100 bg-blue-50/50'
                    : 'border-slate-100 bg-slate-50/50'
                }`}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className={`font-bold text-sm ${isLast ? STATUS_CONFIG[event.status].color : 'text-slate-700'}`}>
                        {STATUS_CONFIG[event.status].label}
                      </p>
                      <p className="text-sm text-slate-600 mt-0.5 flex items-center gap-1.5">
                        <MapPin size={12} className="text-slate-400 shrink-0" />
                        {event.location}
                      </p>
                      {event.note && (
                        <p className="text-xs text-slate-500 mt-1.5 italic bg-white rounded-lg px-2.5 py-1.5 border border-slate-200 inline-block">
                          "{event.note}"
                        </p>
                      )}
                      {event.operator && (
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <Shield size={10} /> by {event.operator}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap shrink-0 bg-white border border-slate-200 rounded-lg px-2.5 py-1">
                      {formatDateTime(event.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Route map display ────────────────────────────────────────────────────────
function RouteDisplay({ shipment }: { shipment: Shipment }) {
  const cities = [
    ...new Set(shipment.statusHistory.map(e => {
      const parts = e.location.split(' ');
      return parts[0];
    })),
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-5 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-4">
        <Globe size={14} className="text-blue-400" />
        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Route Overview</span>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        <div className="flex items-center gap-1 flex-nowrap">
          {/* Origin */}
          <div className="shrink-0 text-center">
            <div className="w-10 h-10 bg-blue-600/30 border border-blue-500/40 rounded-xl flex items-center justify-center mx-auto mb-1.5">
              <Package size={16} className="text-blue-400" />
            </div>
            <p className="text-[10px] font-bold text-slate-300 whitespace-nowrap">{shipment.sender.city}</p>
            <p className="text-[9px] text-slate-500">Origin</p>
          </div>

          {/* Waypoints */}
          {cities.slice(1, -1).map((city, i) => (
            <div key={i} className="flex items-center gap-1 shrink-0">
              <div className="flex items-center gap-1">
                <div className="w-6 h-px bg-slate-600" />
                <ArrowRight size={12} className="text-slate-600" />
                <div className="w-6 h-px bg-slate-600" />
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-slate-700/40 border border-slate-600/40 rounded-lg flex items-center justify-center mx-auto mb-1">
                  <Truck size={13} className="text-slate-400" />
                </div>
                <p className="text-[9px] font-medium text-slate-400 whitespace-nowrap max-w-[60px] truncate">{city}</p>
              </div>
            </div>
          ))}

          {/* Destination */}
          <div className="flex items-center gap-1 shrink-0">
            <div className="flex items-center gap-1">
              <div className="w-6 h-px bg-slate-600" />
              <ArrowRight size={12} className="text-slate-600" />
              <div className="w-6 h-px bg-slate-600" />
            </div>
            <div className="text-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-1.5 ${
                shipment.status === 'delivered'
                  ? 'bg-emerald-600/30 border border-emerald-500/40'
                  : 'bg-slate-700/40 border border-slate-600/40'
              }`}>
                <MapPin size={16} className={shipment.status === 'delivered' ? 'text-emerald-400' : 'text-slate-400'} />
              </div>
              <p className="text-[10px] font-bold text-slate-300 whitespace-nowrap">{shipment.receiver.city}</p>
              <p className="text-[9px] text-slate-500">Destination</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shipment detail card ─────────────────────────────────────────────────────
function ShipmentDetails({ shipment }: { shipment: Shipment }) {
  const grad = statusGradients[shipment.status];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">

      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${grad} text-white px-6 py-5`}>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">
              Tracking Number
            </p>
            <p className="font-black text-2xl font-mono tracking-tight">{shipment.trackingNumber}</p>
          </div>
          <StatusBadge status={shipment.status} />
        </div>

        {/* Delivery info */}
        <div className="mt-4 flex flex-wrap gap-4">
          {shipment.estimatedDelivery && shipment.status !== 'delivered' && shipment.status !== 'returned' && (
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
              <Clock size={13} className="text-white/70" />
              <div>
                <p className="text-[9px] text-white/60 uppercase tracking-widest">Est. Delivery</p>
                <p className="text-sm font-bold text-white">{formatDate(shipment.estimatedDelivery)}</p>
              </div>
            </div>
          )}
          {shipment.actualDelivery && (
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
              <CheckCircle2 size={13} className="text-white/70" />
              <div>
                <p className="text-[9px] text-white/60 uppercase tracking-widest">Delivered</p>
                <p className="text-sm font-bold text-white">{formatDateTime(shipment.actualDelivery)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Route display */}
        <RouteDisplay shipment={shipment} />

        {/* Sender / Receiver */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin size={13} className="text-blue-600" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">From</p>
            </div>
            <p className="font-bold text-slate-800 text-sm">{shipment.sender.name}</p>
            <p className="text-sm text-slate-500 mt-0.5">{shipment.sender.city}, {shipment.sender.country}</p>
            <p className="text-xs text-slate-400 mt-0.5">{shipment.sender.phone}</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center">
                <MapPin size={13} className="text-emerald-600" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">To</p>
            </div>
            <p className="font-bold text-slate-800 text-sm">{shipment.receiver.name}</p>
            <p className="text-sm text-slate-500 mt-0.5">{shipment.receiver.city}, {shipment.receiver.country}</p>
            <p className="text-xs text-slate-400 mt-0.5">{shipment.receiver.phone}</p>
          </div>
        </div>

        {/* Details chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Type', value: shipment.type.charAt(0).toUpperCase() + shipment.type.slice(1) },
            { label: 'Scope', value: shipment.scope.charAt(0).toUpperCase() + shipment.scope.slice(1) },
            { label: 'Weight', value: `${shipment.weight} kg` },
            { label: 'Created', value: formatDate(shipment.createdAt) },
          ].map(d => (
            <div key={d.label} className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{d.label}</p>
              <p className="font-bold text-slate-700 text-sm mt-1">{d.value}</p>
            </div>
          ))}
        </div>

        {/* Official badge */}
        {shipment.isOfficial && (
          <div className="mt-4 flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <Shield size={15} className="text-amber-600 shrink-0" />
            <span className="text-sm text-amber-700 font-bold">Official Government Shipment — Verified & Audited</span>
          </div>
        )}

        {/* Timeline */}
        <TrackingTimeline shipment={shipment} />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TrackingPage() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [result, setResult] = useState<Shipment | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const doSearch = (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setResult(undefined);
    setTimeout(() => {
      const found = mockShipments.find(
        s => s.trackingNumber.toLowerCase() === q.trim().toLowerCase(),
      );
      setResult(found ?? null);
      setLoading(false);
    }, 700);
  };

  useEffect(() => {
    const q = params.get('q');
    if (q) { setQuery(q); doSearch(q); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({ q: query });
    doSearch(query);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
          <Package size={28} className="text-white" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
          Track Your <span className="text-gradient-brand">Shipment</span>
        </h1>
        <p className="text-slate-500 max-w-sm mx-auto">
          Enter your Kurd Post tracking number for real-time status updates across every checkpoint.
        </p>
      </div>

      {/* Search bar */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 shadow-card p-2 flex gap-2 mb-6"
      >
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. KP-2024-000001"
            className="w-full pl-10 pr-4 py-3.5 text-slate-800 placeholder:text-slate-400 text-sm bg-transparent outline-none font-medium"
          />
        </div>
        <Button type="submit" loading={loading} size="lg" icon={<Search size={16} />}>
          Track
        </Button>
      </form>

      {/* Sample numbers */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        <span className="text-sm text-slate-400 self-center">Try sample numbers:</span>
        {['KP-2024-000001', 'KP-2024-000003', 'KP-2024-000004', 'KP-2024-000007'].map(n => (
          <button
            key={n}
            onClick={() => { setQuery(n); setParams({ q: n }); doSearch(n); }}
            className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl px-3 py-1.5 font-mono font-semibold transition-all duration-200 hover:shadow-sm"
          >
            {n}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"
            style={{ borderWidth: 3 }}
          />
          <p className="text-slate-500 font-medium">Searching for your shipment...</p>
          <p className="text-slate-400 text-xs mt-1">Checking all branches and checkpoints</p>
        </div>
      )}

      {/* Not found */}
      {result === null && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-card">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <AlertTriangle size={28} className="text-amber-500" />
          </div>
          <h3 className="font-black text-slate-800 text-lg mb-2">Shipment Not Found</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            No shipment found for tracking number{' '}
            <strong className="font-mono text-slate-700">"{query}"</strong>.
            Please verify the number and try again.
          </p>
        </div>
      )}

      {/* Result */}
      {result && <ShipmentDetails shipment={result} />}
    </div>
  );
}

import { Crosshair, X } from 'lucide-react';
import type { LayerState } from '../useLayers';
import { fmtInt } from '../format';
import { clsx } from '../../../utils';

interface Props {
  items: LayerState[];
  shifted?: boolean;
  onZoomTo: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function Legend({ items, shifted, onZoomTo, onRemove }: Props) {
  if (!items.length) return null;
  return (
    <div className={clsx('xp-legend xp-glass xp-enter-up xp-scroll', shifted && 'is-shifted')} aria-label="Active layers legend">
      {items.map(l => (
        <div key={l.category.id} className="inline-flex items-center gap-1.5 pl-2.5 pr-1 h-8 rounded-xl text-[12px] font-medium whitespace-nowrap">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.category.color, boxShadow: `0 0 12px ${l.category.color}` }} />
          <span className="text-white/90">{l.category.label}</span>
          <span className="xp-mono text-white/50">
            {l.status === 'ready' ? fmtInt(l.count ?? 0) : l.status === 'error' ? 'error' : l.status === 'zoom' ? 'zoom in' : '…'}
          </span>
          <button type="button" onClick={() => onZoomTo(l.category.id)} disabled={l.status !== 'ready'} className="p-1 rounded-md text-white/45 hover:text-white hover:bg-white/10 disabled:opacity-30" aria-label={`Zoom to ${l.category.label}`}>
            <Crosshair size={11} />
          </button>
          <button type="button" onClick={() => onRemove(l.category.id)} className="p-1 rounded-md text-white/45 hover:text-white hover:bg-white/10" aria-label={`Remove ${l.category.label}`}>
            <X size={11} />
          </button>
        </div>
      ))}
    </div>
  );
}

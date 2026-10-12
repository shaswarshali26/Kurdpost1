import { useState, type CSSProperties } from 'react';
import { AlertTriangle, ChevronDown, Crosshair, Loader2 } from 'lucide-react';
import { CATEGORIES, GROUPS, type Category } from '../categories';
import type { LayerState } from '../useLayers';
import CategoryIcon from './CategoryIcon';
import { fmtInt, fmtMs } from '../format';
import { clsx } from '../../../utils';
import { Switch } from './ui';

interface Props {
  layers: Record<string, LayerState>;
  query: string;
  zoom: number;
  onToggle: (cat: Category) => void;
  onReload: (id: string) => void;
}

export default function LayerList({ layers, query, zoom, onToggle, onReload }: Props) {
  const q = query.trim().toLowerCase();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const groups = GROUPS.map(group => ({
    group,
    cats: CATEGORIES.filter(c =>
      c.group === group.id &&
      (!q || c.label.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q) || group.label.toLowerCase().includes(q)),
    ),
  })).filter(g => g.cats.length > 0);

  if (!groups.length) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-white/60">Nothing matches “{query}”.</p>
        <p className="text-xs text-white/35 mt-1">Try an OSM tag such as amenity=fuel, or a word like “school”.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {groups.map(({ group, cats }) => {
        const activeCount = cats.filter(c => layers[c.id]).length;
        const isCollapsed = !q && !!collapsed[group.id];
        return (
          <section key={group.id} className="xp-group">
            <button
              type="button"
              className="xp-group-head"
              aria-expanded={!isCollapsed}
              onClick={() => setCollapsed(s => ({ ...s, [group.id]: !s[group.id] }))}
            >
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-white/90">{group.label}</p>
                <p className="text-[11px] text-white/40 truncate">{group.blurb}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {activeCount > 0 && <span className="xp-pill-accent">{activeCount} on</span>}
                <ChevronDown size={14} className={clsx('text-white/40 transition-transform duration-300', isCollapsed && '-rotate-90')} />
              </div>
            </button>
            {!isCollapsed && (
              <div className="xp-group-body">
                {cats.map(cat => (
                  <LayerRow
                    key={cat.id}
                    cat={cat}
                    state={layers[cat.id]}
                    zoom={zoom}
                    onToggle={() => onToggle(cat)}
                    onReload={() => onReload(cat.id)}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

interface RowProps {
  cat: Category;
  state?: LayerState;
  zoom: number;
  onToggle: () => void;
  onReload: () => void;
}

function LayerRow({ cat, state, zoom, onToggle, onReload }: RowProps) {
  const on = !!state;
  const busy = state?.status === 'loading' || state?.status === 'queued';
  const rowStyle = on ? ({ '--row-color': cat.color } as CSSProperties) : undefined;

  return (
    <div className={clsx('xp-row', on && 'is-on')} style={rowStyle}>
      <button type="button" className="xp-row-main" onClick={onToggle} aria-pressed={on}>
        <span
          className="xp-row-icon"
          style={{
            color: cat.color,
            background: `${cat.color}1f`,
            boxShadow: on ? `0 0 0 1px ${cat.color}66, 0 0 22px ${cat.color}40` : undefined,
          }}
        >
          <CategoryIcon name={cat.icon} size={15} strokeWidth={2} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5 min-w-0">
            <span className="text-[13px] font-medium text-white/90 truncate">{cat.label}</span>
            {cat.heavy && (
              <span className="xp-tag" title={`Loaded for the visible area only, from zoom ${cat.minZoom}`}>
                in view · z{cat.minZoom}
              </span>
            )}
          </span>
          <span className="xp-mono block text-[10.5px] text-white/35 truncate">{cat.tag}</span>
        </span>
      </button>
      <div className="flex items-center gap-2 shrink-0">
        <RowStatus state={state} zoom={zoom} onReload={onReload} />
        <Switch on={on} color={cat.color} onChange={onToggle} label={`Toggle ${cat.label}`} />
      </div>
      {busy && <span className="xp-scan" style={{ background: cat.color }} />}
    </div>
  );
}

function RowStatus({ state, zoom, onReload }: { state?: LayerState; zoom: number; onReload: () => void }) {
  if (!state) return null;
  switch (state.status) {
    case 'queued':
      return <span className="xp-status text-white/40 xp-pulse">queued</span>;
    case 'loading':
      return (
        <span className="xp-status text-white/60">
          <Loader2 size={12} className="animate-spin" />
          <span className="max-w-[110px] truncate">{state.attempt ?? 'loading'}</span>
        </span>
      );
    case 'ready':
      return (
        <span
          className="xp-count xp-pop"
          title={state.meta ? `${fmtInt(state.count ?? 0)} features · ${state.meta.cached ? 'cached' : fmtMs(state.meta.ms)}` : undefined}
        >
          {fmtInt(state.count ?? 0)}
        </span>
      );
    case 'zoom': {
      const ready = zoom >= (state.category.minZoom ?? 10);
      return (
        <button
          type="button"
          onClick={onReload}
          title={state.error}
          className={clsx('xp-status', ready ? 'text-emerald-300 hover:text-emerald-200' : 'text-amber-300 hover:text-amber-200')}
        >
          <Crosshair size={12} />
          {ready ? 'load view' : `zoom ${state.category.minZoom}+`}
        </button>
      );
    }
    case 'error':
      return (
        <button type="button" onClick={onReload} title={state.error} className="xp-status text-rose-300 hover:text-rose-200">
          <AlertTriangle size={12} />
          retry
        </button>
      );
    default:
      return null;
  }
}

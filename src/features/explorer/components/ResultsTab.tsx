import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { LayerState } from '../useLayers';
import type { PickedFeature } from '../ExplorerMap';
import type { Feature } from '../overpass';
import { fmtInt, highlightTags } from '../format';
import CategoryIcon from './CategoryIcon';
import type { LngLat } from '../geo';

interface Props {
  layers: Record<string, LayerState>;
  order: string[];
  onPick: (picked: PickedFeature) => void;
}

const LIMIT = 300;

function anchorOf(f: Feature): LngLat {
  const g = f.geometry;
  if (g.type === 'Point') return g.coordinates;
  if (g.type === 'LineString') return g.coordinates[Math.floor(g.coordinates.length / 2)];
  const ring = g.coordinates[0];
  return ring[Math.floor(ring.length / 2)];
}

export default function ResultsTab({ layers, order, onPick }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const ready = order.filter(id => layers[id]?.status === 'ready');
  const fallback = ready[ready.length - 1];
  const currentId = selected && layers[selected]?.status === 'ready' ? selected : fallback;
  const current = currentId ? layers[currentId] : undefined;

  const rows = useMemo(() => {
    if (!current?.data) return [];
    const q = filter.trim().toLowerCase();
    const named: { name: string; feature: Feature }[] = [];
    const unnamed: { name: string; feature: Feature }[] = [];
    for (const feature of current.data.features) {
      const name = typeof feature.properties.display_name === 'string' ? feature.properties.display_name : '';
      if (q && !name.toLowerCase().includes(q)) continue;
      (name ? named : unnamed).push({ name: name || `${feature.properties.osm_type} ${feature.properties.osm_id}`, feature });
    }
    named.sort((a, b) => a.name.localeCompare(b.name));
    return named.concat(unnamed).slice(0, LIMIT);
  }, [current, filter]);

  if (ready.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 p-4 text-[12.5px] text-white/55">
        Once a layer has loaded, its features are listed here. Click any row to fly to it.
      </div>
    );
  }

  const namedCount = current?.data ? current.data.features.filter(f => typeof f.properties.display_name === 'string').length : 0;

  return (
    <div className="space-y-3">
      <select className="xp-select w-full" value={currentId ?? ''} onChange={e => setSelected(e.target.value)} aria-label="Choose a loaded layer">
        {ready.map(id => (
          <option key={id} value={id}>{layers[id].category.label} · {fmtInt(layers[id].count ?? 0)}</option>
        ))}
      </select>

      <label className="xp-search !h-9">
        <Search size={14} className="text-white/45 shrink-0" />
        <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter by name…" aria-label="Filter results" spellCheck={false} />
      </label>

      {current && (
        <p className="text-[11px] text-white/40">
          {fmtInt(namedCount)} of {fmtInt(current.count ?? 0)} have a name · showing up to {LIMIT}
        </p>
      )}

      <ul className="space-y-1">
        {rows.map(({ name, feature }) => {
          const tags = highlightTags(feature.properties, 2);
          return (
            <li key={`${feature.properties.osm_type}-${feature.properties.osm_id}-${feature.id ?? ''}`}>
              <button
                type="button"
                onClick={() => current && onPick({ categoryId: current.category.id, properties: feature.properties, lngLat: anchorOf(feature) })}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-white/[0.06] transition-colors"
              >
                {current && (
                  <span className="w-7 h-7 rounded-lg grid place-items-center shrink-0" style={{ color: current.category.color, background: `${current.category.color}1f` }}>
                    <CategoryIcon name={current.category.icon} size={13} />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] text-white/90 truncate">{name}</span>
                  {tags.length > 0 && (
                    <span className="xp-mono block text-[10px] text-white/35 truncate">
                      {tags.map(([k, v]) => `${k}=${v}`).join(' · ')}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

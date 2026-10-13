import { ArrowLeft, Maximize2, Orbit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BASEMAPS, GOVERNORATES, type Place } from '../geo';
import type { Projection } from '../ExplorerMap';
import CategoryIcon from './CategoryIcon';
import { fmtInt, fmtMs, fmtTimestamp } from '../format';
import { IconButton } from './ui';
import { clsx } from '../../../utils';

export interface HudStats {
  features: number;
  layersOn: number;
  lastMs?: number;
  lastCached?: boolean;
  endpoint?: string;
  timestamp?: string;
}

interface Props {
  basemapId: string;
  onBasemap: (id: string) => void;
  projection: Projection;
  onProjection: (p: Projection) => void;
  onReset: () => void;
  onJump: (place: Place) => void;
  stats: HudStats;
  zoom: number;
}

export default function Hud({ basemapId, onBasemap, projection, onProjection, onReset, onJump, stats, zoom }: Props) {
  const kri = GOVERNORATES.filter(p => p.kri);
  const federal = GOVERNORATES.filter(p => !p.kri);

  return (
    <>
      <div className="xp-hud xp-enter-right">
        <Link to="/" className="xp-chip" title="Back to Kurd Post">
          <ArrowLeft size={14} /> Kurd Post
        </Link>

        <select
          className="xp-select"
          value=""
          onChange={e => {
            const place = GOVERNORATES.find(p => p.id === e.target.value);
            if (place) onJump(place);
          }}
          aria-label="Jump to a governorate"
        >
          <option value="">Jump to…</option>
          <optgroup label="Kurdistan Region">
            {kri.map(p => <option key={p.id} value={p.id}>{p.name}{p.nameKu ? ` · ${p.nameKu}` : ''}</option>)}
          </optgroup>
          <optgroup label="Federal Iraq">
            {federal.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </optgroup>
        </select>

        <div className="xp-seg" role="radiogroup" aria-label="Basemap">
          {BASEMAPS.map(b => {
            return (
              <button
                key={b.id}
                type="button"
                role="radio"
                aria-checked={basemapId === b.id}
                title={`${b.label} · ${b.hint}`}
                onClick={() => onBasemap(b.id)}
                className={clsx('xp-seg-btn', basemapId === b.id && 'is-active')}
              >
                <CategoryIcon name={b.icon} size={13} />
                <span className="hidden xl:inline">{b.label}</span>
              </button>
            );
          })}
        </div>

        <IconButton
          active={projection === 'globe'}
          onClick={() => onProjection(projection === 'globe' ? 'mercator' : 'globe')}
          title={projection === 'globe' ? 'Switch to flat map (G)' : 'Switch to globe (G)'}
          aria-label="Toggle globe projection"
        >
          <Orbit size={16} />
        </IconButton>
        <IconButton onClick={onReset} title="Fit Iraq" aria-label="Reset view to Iraq">
          <Maximize2 size={16} />
        </IconButton>
      </div>

      <div className="xp-stats xp-glass xp-enter-right xp-delay-1">
        <Stat label="Features" value={fmtInt(stats.features)} />
        <Stat label="Layers" value={String(stats.layersOn)} />
        <Stat label="Last query" value={stats.lastMs === undefined ? '—' : stats.lastCached ? 'cache' : fmtMs(stats.lastMs)} hint={stats.endpoint} />
        <Stat label="Zoom" value={zoom.toFixed(1)} />
        <Stat label="OSM data" value={fmtTimestamp(stats.timestamp)?.replace(' UTC', '') ?? '—'} hint="UTC" />
      </div>
    </>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="xp-stat">
      <p className="xp-micro !text-[9px] !tracking-[0.18em]">{label}</p>
      <p className="xp-stat-value truncate" title={hint}>{value}</p>
    </div>
  );
}

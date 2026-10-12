import { Copy, Crosshair, ExternalLink, X } from 'lucide-react';
import type { Category } from '../categories';
import type { PickedFeature } from '../ExplorerMap';
import { displayName } from '../overpass';
import { fmtCoord, osmUrl } from '../format';
import CategoryIcon from './CategoryIcon';

interface Props {
  picked: PickedFeature;
  category?: Category;
  onClose: () => void;
  onFly: (picked: PickedFeature) => void;
}

const HIDDEN = new Set(['osm_id', 'osm_type', 'display_name']);

export default function FeatureDrawer({ picked, category, onClose, onFly }: Props) {
  const props = picked.properties;
  const name = displayName(props);
  const color = category?.color ?? '#60a5fa';
  const link = osmUrl(props.osm_type, props.osm_id);
  const tags = Object.entries(props)
    .filter(([k, v]) => !HIDDEN.has(k) && (typeof v === 'string' || typeof v === 'number'))
    .sort(([a], [b]) => (a.startsWith('name') === b.startsWith('name') ? a.localeCompare(b) : a.startsWith('name') ? -1 : 1));

  const altNames = ['name:ku', 'name:ar', 'name:en'].map(k => [k, props[k]] as const).filter(([, v]) => typeof v === 'string' && v && v !== name);

  const copyCoords = () => {
    navigator.clipboard?.writeText(fmtCoord(picked.lngLat[0], picked.lngLat[1])).catch(() => undefined);
  };

  return (
    <section className="xp-drawer xp-glass xp-enter-right" aria-label="Feature details">
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <header className="flex items-start gap-3 px-4 pt-4 pb-3">
        <span className="w-10 h-10 rounded-xl grid place-items-center shrink-0" style={{ color, background: `${color}22`, boxShadow: `0 0 24px ${color}44` }}>
          <CategoryIcon name={category?.icon ?? 'MapPin'} size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="xp-micro">{category?.label ?? 'Feature'}</p>
          <h2 className="text-[16px] font-bold text-white leading-tight mt-0.5 break-words">{name ?? `Unnamed ${String(props.osm_type ?? 'feature')}`}</h2>
          {altNames.length > 0 && (
            <p className="text-[12.5px] text-white/60 mt-1 leading-snug">{altNames.map(([, v]) => String(v)).join(' · ')}</p>
          )}
        </div>
        <button type="button" onClick={onClose} className="xp-iconbtn !w-8 !h-8" aria-label="Close details">
          <X size={14} />
        </button>
      </header>

      <div className="px-4 pb-3 flex flex-wrap items-center gap-1.5">
        <button type="button" onClick={() => onFly(picked)} className="xp-btn"><Crosshair size={13} /> Fly here</button>
        <button type="button" onClick={copyCoords} className="xp-btn xp-btn-ghost" title={fmtCoord(picked.lngLat[0], picked.lngLat[1])}>
          <Copy size={13} /> {fmtCoord(picked.lngLat[0], picked.lngLat[1])}
        </button>
        {link && (
          <a href={link} target="_blank" rel="noreferrer" className="xp-btn xp-btn-ghost"><ExternalLink size={13} /> OSM</a>
        )}
      </div>

      <div className="flex-1 overflow-y-auto xp-scroll px-4 pb-4">
        <p className="xp-micro mb-1">{tags.length} tags</p>
        <table className="xp-table">
          <tbody>
            {tags.map(([k, v]) => (
              <tr key={k}>
                <td>{k}</td>
                <td className="text-white/90">{renderValue(k, String(v))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function renderValue(key: string, value: string) {
  if (/^https?:\/\//i.test(value) || key === 'website' || key === 'contact:website') {
    const href = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    return <a href={href} target="_blank" rel="noreferrer" className="underline decoration-white/30 hover:text-white break-all">{value}</a>;
  }
  if (key === 'wikidata') {
    return <a href={`https://www.wikidata.org/wiki/${value}`} target="_blank" rel="noreferrer" className="underline decoration-white/30 hover:text-white">{value}</a>;
  }
  return value;
}

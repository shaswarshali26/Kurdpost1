import type { Category } from '../categories';
import type { HoverInfo } from '../ExplorerMap';
import { displayName } from '../overpass';
import { highlightTags } from '../format';
import CategoryIcon from './CategoryIcon';

interface Props {
  info: HoverInfo;
  category?: Category;
  viewportWidth: number;
  viewportHeight: number;
}

export default function HoverCard({ info, category, viewportWidth, viewportHeight }: Props) {
  const name = displayName(info.properties);
  const tags = highlightTags(info.properties, 3);
  const color = category?.color ?? '#60a5fa';
  const flipX = info.x > viewportWidth - 330;
  const flipY = info.y > viewportHeight - 180;

  return (
    <div
      className="xp-hover"
      style={{
        left: flipX ? undefined : info.x + 16,
        right: flipX ? viewportWidth - info.x + 16 : undefined,
        top: flipY ? undefined : info.y + 16,
        bottom: flipY ? viewportHeight - info.y + 16 : undefined,
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-md grid place-items-center shrink-0" style={{ color, background: `${color}22` }}>
          <CategoryIcon name={category?.icon ?? 'MapPin'} size={12} />
        </span>
        <div className="min-w-0">
          <p className="text-[12.5px] font-semibold text-white leading-tight truncate">{name ?? `Unnamed ${category?.label.toLowerCase() ?? 'feature'}`}</p>
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">{category?.label ?? 'Feature'}</p>
        </div>
      </div>
      {tags.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {tags.map(([k, v]) => (
            <li key={k} className="xp-mono text-[10.5px] text-white/60 truncate">
              <span className="text-white/35">{k}=</span>{v}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-[10px] text-white/35">Click for all tags</p>
    </div>
  );
}

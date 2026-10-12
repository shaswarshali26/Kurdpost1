import { useState } from 'react';
import { Check, Copy, ExternalLink, Info } from 'lucide-react';
import type { LayerState } from '../useLayers';
import { ENDPOINTS, overpassTurboUrl, type Scope } from '../overpass';
import { fmtBytes, fmtInt, fmtMs, fmtTimestamp } from '../format';
import { clsx } from '../../../utils';

interface Props {
  layers: Record<string, LayerState>;
  order: string[];
  endpoint: string;
  onEndpoint: (id: string) => void;
  scope: Scope;
}

export default function QueryTab({ layers, order, endpoint, onEndpoint, scope }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fallback = order[order.length - 1];
  const currentId = selected && layers[selected] ? selected : fallback;
  const current = currentId ? layers[currentId] : undefined;

  const copy = async () => {
    if (!current) return;
    try {
      await navigator.clipboard.writeText(current.query);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="space-y-4">
      <section className="space-y-2">
        <p className="xp-micro">Overpass QL</p>
        {order.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 p-4 text-[12.5px] text-white/55">
            Turn on a layer and its generated query appears here, ready to copy into overpass-turbo.
          </div>
        ) : (
          <>
            <select
              className="xp-select w-full"
              value={currentId ?? ''}
              onChange={e => setSelected(e.target.value)}
              aria-label="Choose a layer"
            >
              {order.map(id => (
                <option key={id} value={id}>{layers[id]?.category.label ?? id}</option>
              ))}
            </select>
            {current && (
              <>
                <pre className="xp-pre">{current.query}</pre>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={copy} className="xp-btn xp-btn-ghost">
                    {copied ? <Check size={13} className="text-emerald-300" /> : <Copy size={13} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <a href={overpassTurboUrl(current.query)} target="_blank" rel="noreferrer" className="xp-btn">
                    <ExternalLink size={13} /> Run in overpass-turbo
                  </a>
                </div>
                {current.meta && (
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-[12px]">
                    <Stat label="Features" value={fmtInt(current.count ?? 0)} />
                    <Stat label="Response" value={fmtBytes(current.meta.bytes)} />
                    <Stat label="Took" value={current.meta.cached ? 'cached' : fmtMs(current.meta.ms)} />
                    <Stat label="Served by" value={current.meta.endpoint} />
                    <Stat label="Scope" value={current.meta.scope === 'country' ? 'Iraq boundary' : 'Map view bbox'} />
                    <Stat label="OSM data as of" value={fmtTimestamp(current.meta.timestamp) ?? 'unknown'} />
                  </dl>
                )}
                {current.status === 'error' && (
                  <p className="text-[12px] text-rose-300 leading-snug">{current.error}</p>
                )}
              </>
            )}
          </>
        )}
      </section>

      <section className="space-y-2">
        <p className="xp-micro">Preferred endpoint</p>
        <div className="space-y-1">
          {ENDPOINTS.map(ep => (
            <button
              key={ep.id}
              type="button"
              onClick={() => onEndpoint(ep.id)}
              className={clsx(
                'w-full flex items-center justify-between px-3 h-10 rounded-xl border text-[12.5px] transition-colors',
                endpoint === ep.id ? 'border-blue-400/50 bg-blue-400/10 text-white' : 'border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.07]',
              )}
            >
              <span className="xp-mono">{ep.label}</span>
              {endpoint === ep.id && <span className="xp-pill-accent">first</span>}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-white/40 leading-snug">
          Others are tried automatically when the preferred one is busy or rate-limited. At most two queries run at once.
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-[11.5px] text-white/55 leading-relaxed">
        <p className="flex items-center gap-1.5 text-white/80 font-semibold mb-1"><Info size={13} /> How queries are built</p>
        <p>
          With scope <span className="xp-mono text-white/80">{scope === 'country' ? 'All Iraq' : 'In view'}</span>, point
          categories use <span className="xp-mono text-white/80">area["ISO3166-1"="IQ"]</span> or the map bounding box.
          Heavy categories (roads, buildings, land use) always use the bounding box and a minimum zoom, so they stay within the
          public servers' 180 s and 512 MiB limits. Results are cached for 30 minutes per query.
        </p>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] uppercase tracking-[0.16em] text-white/40">{label}</dt>
      <dd className="xp-mono text-white/90 truncate" title={value}>{value}</dd>
    </div>
  );
}

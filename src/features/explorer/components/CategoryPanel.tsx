import type { RefObject } from 'react';
import {
  ChevronDown, Code2, Crosshair, Layers, RefreshCw, Search, Sparkles, Table2, Trash2, X,
} from 'lucide-react';
import { CATEGORY_BY_ID, FEATURED_IDS, type Category } from '../categories';
import type { LayerState } from '../useLayers';
import type { Scope } from '../overpass';
import type { PickedFeature, RenderMode } from '../ExplorerMap';
import { fmtInt } from '../format';
import CategoryIcon from './CategoryIcon';
import { clsx } from '../../../utils';
import { Segmented } from './ui';
import LayerList from './LayerList';
import QueryTab from './QueryTab';
import ResultsTab from './ResultsTab';

export type PanelTab = 'layers' | 'query' | 'results';

interface Props {
  layers: Record<string, LayerState>;
  order: string[];
  zoom: number;
  search: string;
  onSearch: (value: string) => void;
  searchRef: RefObject<HTMLInputElement | null>;
  tab: PanelTab;
  onTab: (tab: PanelTab) => void;
  scope: Scope;
  onScope: (scope: Scope) => void;
  renderMode: RenderMode;
  onRenderMode: (mode: RenderMode) => void;
  endpoint: string;
  onEndpoint: (id: string) => void;
  onToggle: (cat: Category) => void;
  onRemove: (id: string) => void;
  onReload: (id: string) => void;
  onZoomTo: (id: string) => void;
  onClearAll: () => void;
  onReloadInView: () => void;
  onPick: (picked: PickedFeature) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export default function CategoryPanel(props: Props) {
  const {
    layers, order, zoom, search, onSearch, searchRef, tab, onTab, scope, onScope, renderMode, onRenderMode,
    endpoint, onEndpoint, onToggle, onRemove, onReload, onZoomTo, onClearAll, onReloadInView, onPick,
    collapsed, onToggleCollapsed,
  } = props;

  const active = order.map(id => layers[id]).filter((l): l is LayerState => !!l);
  const total = active.reduce((sum, l) => sum + (l.count ?? 0), 0);
  const hasViewportLayers = active.some(l => l.category.heavy) || scope === 'viewport';

  return (
    <aside className={clsx('xp-panel xp-glass xp-enter-left', collapsed && 'is-collapsed')} aria-label="Layer explorer">
      <header className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="xp-orb shrink-0">
          <span className="xp-orb-core"><Layers size={16} /></span>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-[17px] font-bold tracking-tight leading-tight text-white">Iraq Explorer</h1>
          <p className="xp-micro mt-0.5">Kurd Post · Geo Lab · Live OSM</p>
        </div>
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="xp-iconbtn lg:hidden"
          aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
        >
          <ChevronDown size={16} className={clsx('transition-transform', collapsed && 'rotate-180')} />
        </button>
      </header>

      <div className="xp-panel-body px-4 pb-3 space-y-3">
        <label className="xp-search">
          <Search size={15} className="text-white/45 shrink-0" />
          <input
            ref={searchRef}
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search 60 categories or OSM tags…"
            aria-label="Search categories"
            spellCheck={false}
          />
          {search ? (
            <button type="button" onClick={() => onSearch('')} aria-label="Clear search" className="text-white/40 hover:text-white">
              <X size={14} />
            </button>
          ) : (
            <kbd className="xp-kbd">/</kbd>
          )}
        </label>

        <nav className="xp-tabs" aria-label="Panel sections">
          <button type="button" className={clsx('xp-tab', tab === 'layers' && 'is-active')} onClick={() => onTab('layers')}>
            <Layers size={14} /> Layers
          </button>
          <button type="button" className={clsx('xp-tab', tab === 'query' && 'is-active')} onClick={() => onTab('query')}>
            <Code2 size={14} /> Query
          </button>
          <button type="button" className={clsx('xp-tab', tab === 'results' && 'is-active')} onClick={() => onTab('results')}>
            <Table2 size={14} /> Results
          </button>
        </nav>
      </div>

      <div className="xp-panel-scroll xp-scroll">
        {tab === 'layers' && (
          <div className="space-y-4">
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="xp-micro">Active layers · {fmtInt(total)} features</p>
                {active.length > 0 && (
                  <div className="flex items-center gap-1">
                    {hasViewportLayers && (
                      <button type="button" onClick={onReloadInView} className="xp-btn xp-btn-ghost !h-7 !px-2.5 !text-[11px]" title="Reload viewport layers for the current map view">
                        <RefreshCw size={11} /> Reload view
                      </button>
                    )}
                    <button type="button" onClick={onClearAll} className="xp-btn xp-btn-ghost !h-7 !px-2.5 !text-[11px]" title="Remove all layers">
                      <Trash2 size={11} /> Clear
                    </button>
                  </div>
                )}
              </div>

              {active.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 p-3.5">
                  <p className="text-[12.5px] text-white/60 flex items-center gap-1.5"><Sparkles size={13} className="text-amber-300" /> Try one of these to start</p>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {FEATURED_IDS.map(id => {
                      const cat = CATEGORY_BY_ID[id];
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => onToggle(cat)}
                          className="xp-chip !h-8 !px-2.5 !text-[12px]"
                          style={{ borderColor: `${cat.color}55` }}
                        >
                          <CategoryIcon name={cat.icon} size={13} style={{ color: cat.color }} /> {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {active.map(l => (
                    <div
                      key={l.category.id}
                      className="inline-flex items-center gap-1.5 pl-2.5 pr-1 h-8 rounded-xl border text-[12px] font-medium bg-white/5"
                      style={{ borderColor: `${l.category.color}66` }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ background: l.category.color, boxShadow: `0 0 10px ${l.category.color}` }} />
                      <span className="text-white/90">{l.category.label}</span>
                      {l.status === 'ready' && <span className="xp-mono text-white/50">{fmtInt(l.count ?? 0)}</span>}
                      {(l.status === 'loading' || l.status === 'queued') && <span className="xp-mono text-white/40 xp-pulse">…</span>}
                      <button type="button" onClick={() => onZoomTo(l.category.id)} className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10" aria-label={`Zoom to ${l.category.label}`} disabled={l.status !== 'ready'}>
                        <Crosshair size={12} />
                      </button>
                      <button type="button" onClick={() => onRemove(l.category.id)} className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10" aria-label={`Remove ${l.category.label}`}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <p className="xp-micro">Scope</p>
                <Segmented<Scope>
                  size="sm"
                  ariaLabel="Query scope"
                  value={scope}
                  onChange={onScope}
                  options={[
                    { value: 'country', label: 'All Iraq', title: 'Query inside the Iraq boundary' },
                    { value: 'viewport', label: 'In view', title: 'Query only the visible map area' },
                  ]}
                />
              </div>
              <div className="space-y-1.5">
                <p className="xp-micro">Render</p>
                <Segmented<RenderMode>
                  size="sm"
                  ariaLabel="Render mode"
                  value={renderMode}
                  onChange={onRenderMode}
                  options={[
                    { value: 'points', label: 'Glow', title: 'Glowing points' },
                    { value: 'heat', label: 'Heat', title: 'Density heat-map' },
                    { value: 'both', label: 'Both' },
                  ]}
                />
              </div>
            </section>

            <LayerList layers={layers} query={search} zoom={zoom} onToggle={onToggle} onReload={onReload} />
          </div>
        )}

        {tab === 'query' && (
          <QueryTab layers={layers} order={order} endpoint={endpoint} onEndpoint={onEndpoint} scope={scope} />
        )}

        {tab === 'results' && <ResultsTab layers={layers} order={order} onPick={onPick} />}
      </div>

      <footer className="xp-panel-body px-4 py-2.5 border-t border-white/10 text-[10.5px] text-white/40 leading-snug">
        Data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline decoration-white/30 hover:text-white">OpenStreetMap</a> contributors (ODbL), fetched live from the Overpass API. Coverage varies by area.
      </footer>
    </aside>
  );
}

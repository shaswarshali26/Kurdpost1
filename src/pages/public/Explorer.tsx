import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../../features/explorer/explorer.css';
import ExplorerMap, {
  type HoverInfo, type MapHandle, type MapLayer, type PickedFeature, type Projection, type RenderMode, type ViewState,
} from '../../features/explorer/ExplorerMap';
import { CATEGORY_BY_ID, DEFAULT_LAYER_ID } from '../../features/explorer/categories';
import { BASEMAP_BY_ID, INTRO_CENTER, INTRO_ZOOM, IRAQ_BOUNDS, type Place } from '../../features/explorer/geo';
import { boundsOf, type Scope } from '../../features/explorer/overpass';
import { useLayers, type LayerState, type ToastTone } from '../../features/explorer/useLayers';
import CategoryPanel, { type PanelTab } from '../../features/explorer/components/CategoryPanel';
import Hud from '../../features/explorer/components/Hud';
import FeatureDrawer from '../../features/explorer/components/FeatureDrawer';
import HoverCard from '../../features/explorer/components/HoverCard';
import IntroOverlay from '../../features/explorer/components/IntroOverlay';
import Legend from '../../features/explorer/components/Legend';
import Toasts, { type Toast } from '../../features/explorer/components/Toasts';

const INITIAL_VIEW: ViewState = {
  zoom: INTRO_ZOOM,
  bbox: [IRAQ_BOUNDS[0][1], IRAQ_BOUNDS[0][0], IRAQ_BOUNDS[1][1], IRAQ_BOUNDS[1][0]],
  center: INTRO_CENTER,
};

type IntroPhase = 'shown' | 'leaving' | 'gone';

function readViewport() {
  return { width: window.innerWidth, height: window.innerHeight };
}

export default function Explorer() {
  const mapRef = useRef<MapHandle>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const toastId = useRef(0);

  const [basemapId, setBasemapId] = useState('dark');
  const [projection, setProjection] = useState<Projection>('globe');
  const [renderMode, setRenderMode] = useState<RenderMode>('points');
  const [scope, setScope] = useState<Scope>('country');
  const [endpoint, setEndpoint] = useState('main');
  const [introPhase, setIntroPhase] = useState<IntroPhase>('shown');
  const [tab, setTab] = useState<PanelTab>('layers');
  const [search, setSearch] = useState('');
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const [selected, setSelected] = useState<PickedFeature | null>(null);
  const [view, setView] = useState<ViewState>(INITIAL_VIEW);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [viewport, setViewport] = useState(readViewport);

  const notify = useCallback((message: string, tone: ToastTone = 'info') => {
    toastId.current += 1;
    const id = toastId.current;
    setToasts(prev => [...prev.slice(-3), { id, message, tone }]);
    window.setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), tone === 'error' ? 7000 : 4500);
  }, []);

  const getView = useCallback(() => mapRef.current?.getView() ?? INITIAL_VIEW, []);

  const { layers, order, toggle, remove, reload, reloadInView, clearAll } = useLayers({ getView, scope, endpoint, notify });

  const mapLayers = useMemo<MapLayer[]>(
    () => order.flatMap(id => {
      const l = layers[id];
      return l && l.status === 'ready' && l.data ? [{ category: l.category, data: l.data }] : [];
    }),
    [order, layers],
  );

  const activeStates = useMemo(
    () => order.map(id => layers[id]).filter((l): l is LayerState => !!l),
    [order, layers],
  );

  const stats = useMemo(() => {
    const ready = activeStates.filter(l => l.status === 'ready');
    const last = ready.reduce<LayerState | undefined>((acc, l) => (!acc || (l.meta?.loadedAt ?? 0) > (acc.meta?.loadedAt ?? 0) ? l : acc), undefined);
    const stamped = ready.find(l => l.meta?.timestamp);
    return {
      features: ready.reduce((sum, l) => sum + (l.count ?? 0), 0),
      layersOn: activeStates.length,
      lastMs: last?.meta?.ms,
      lastCached: last?.meta?.cached,
      endpoint: last?.meta?.endpoint,
      timestamp: stamped?.meta?.timestamp,
    };
  }, [activeStates]);

  const enter = useCallback(() => {
    setIntroPhase(phase => (phase === 'shown' ? 'leaving' : phase));
    mapRef.current?.enter();
    if (!order.length) toggle(CATEGORY_BY_ID[DEFAULT_LAYER_ID]);
    window.setTimeout(() => setIntroPhase('gone'), 750);
  }, [order.length, toggle]);

  const zoomTo = useCallback((id: string) => {
    const l = layers[id];
    if (!l?.data) return;
    const b = boundsOf(l.data);
    if (b) mapRef.current?.fitBounds(b);
    else notify(`${l.category.label}: nothing to zoom to`, 'info');
  }, [layers, notify]);

  const jump = useCallback((place: Place) => {
    mapRef.current?.flyTo(place.center, place.zoom);
  }, []);

  const pickFromList = useCallback((picked: PickedFeature) => {
    setSelected(picked);
    mapRef.current?.flyTo(picked.lngLat, 15);
  }, []);

  const flyToPicked = useCallback((picked: PickedFeature) => {
    mapRef.current?.flyTo(picked.lngLat, Math.max(view.zoom, 14));
  }, [view.zoom]);

  // Window size for hover card placement and layout decisions.
  useEffect(() => {
    const onResize = () => setViewport(readViewport());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Keyboard shortcuts.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = !!target && (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA');
      if (e.key === 'Enter' && introPhase === 'shown') {
        e.preventDefault();
        enter();
        return;
      }
      if (e.key === 'Escape') {
        if (selected) setSelected(null);
        else if (typing) target?.blur();
        return;
      }
      if (typing) return;
      if (e.key === '/') {
        e.preventDefault();
        setPanelCollapsed(false);
        setTab('layers');
        searchRef.current?.focus();
      } else if (e.key.toLowerCase() === 'g') {
        setProjection(p => (p === 'globe' ? 'mercator' : 'globe'));
      } else if (e.key.toLowerCase() === 'r') {
        mapRef.current?.resetView();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enter, introPhase, selected]);

  useEffect(() => {
    const previous = document.title;
    document.title = 'Iraq Explorer · Kurd Post';
    return () => {
      document.title = previous;
    };
  }, []);

  const basemap = BASEMAP_BY_ID[basemapId] ?? BASEMAP_BY_ID.dark;
  const intro = introPhase === 'shown';

  return (
    <div className="xp-root fixed inset-0 overflow-hidden">
      <ExplorerMap
        ref={mapRef}
        basemap={basemap}
        projection={projection}
        renderMode={renderMode}
        layers={mapLayers}
        intro={intro}
        onHover={setHover}
        onSelect={setSelected}
        onView={setView}
      />
      <div className="xp-grain" />

      {introPhase !== 'gone' && <IntroOverlay leaving={introPhase === 'leaving'} onEnter={enter} />}

      <CategoryPanel
        layers={layers}
        order={order}
        zoom={view.zoom}
        search={search}
        onSearch={setSearch}
        searchRef={searchRef}
        tab={tab}
        onTab={setTab}
        scope={scope}
        onScope={setScope}
        renderMode={renderMode}
        onRenderMode={setRenderMode}
        endpoint={endpoint}
        onEndpoint={setEndpoint}
        onToggle={toggle}
        onRemove={remove}
        onReload={reload}
        onZoomTo={zoomTo}
        onClearAll={clearAll}
        onReloadInView={reloadInView}
        onPick={pickFromList}
        collapsed={panelCollapsed}
        onToggleCollapsed={() => setPanelCollapsed(c => !c)}
      />

      <Hud
        basemapId={basemapId}
        onBasemap={setBasemapId}
        projection={projection}
        onProjection={setProjection}
        onReset={() => mapRef.current?.resetView()}
        onJump={jump}
        stats={stats}
        zoom={view.zoom}
      />

      <Legend items={activeStates} shifted={!!selected} onZoomTo={zoomTo} onRemove={remove} />

      {selected && (
        <FeatureDrawer
          picked={selected}
          category={CATEGORY_BY_ID[selected.categoryId]}
          onClose={() => setSelected(null)}
          onFly={flyToPicked}
        />
      )}

      {hover && !intro && !selected && (
        <HoverCard info={hover} category={CATEGORY_BY_ID[hover.categoryId]} viewportWidth={viewport.width} viewportHeight={viewport.height} />
      )}

      <Toasts toasts={toasts} onDismiss={id => setToasts(prev => prev.filter(t => t.id !== id))} />
    </div>
  );
}

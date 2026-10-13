import { useEffect, useImperativeHandle, useRef, type Ref } from 'react';
import {
  AttributionControl,
  Map as MapLibreMap,
  NavigationControl,
  type GeoJSONSource,
  type MapMouseEvent,
} from 'maplibre-gl';
import './mapWorker';
import type { Category } from './categories';
import type { BBox, FeatureCollection } from './overpass';
import { INTRO_CENTER, INTRO_ZOOM, IRAQ_BOUNDS, type Basemap, type Bounds, type LngLat } from './geo';

export type Projection = 'globe' | 'mercator';
export type RenderMode = 'points' | 'heat' | 'both';

export interface MapLayer {
  category: Category;
  data: FeatureCollection;
}

export interface PickedFeature {
  categoryId: string;
  properties: Record<string, unknown>;
  lngLat: LngLat;
}

export interface HoverInfo extends PickedFeature {
  x: number;
  y: number;
}

export interface ViewState {
  zoom: number;
  bbox: BBox;
  center: LngLat;
}

export interface MapHandle {
  flyTo(center: LngLat, zoom: number): void;
  fitBounds(bounds: Bounds): void;
  resetView(): void;
  getView(): ViewState;
  enter(): void;
}

interface Props {
  ref: Ref<MapHandle>;
  basemap: Basemap;
  projection: Projection;
  renderMode: RenderMode;
  layers: MapLayer[];
  intro: boolean;
  onHover: (info: HoverInfo | null) => void;
  onSelect: (picked: PickedFeature | null) => void;
  onView: (view: ViewState) => void;
}

type Padding = { top: number; bottom: number; left: number; right: number };

const SUFFIXES = ['heat', 'glow', 'dot', 'line-glow', 'line', 'fill', 'outline-glow', 'outline'];
const INTERACTIVE = ['dot', 'line', 'fill', 'outline'];

const DEFAULT_VIEW: ViewState = {
  zoom: INTRO_ZOOM,
  bbox: [IRAQ_BOUNDS[0][1], IRAQ_BOUNDS[0][0], IRAQ_BOUNDS[1][1], IRAQ_BOUNDS[1][0]],
  center: INTRO_CENTER,
};

function rgba(hex: string, alpha: number): string {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/** Leaves room for the floating panels so fitted bounds stay visible. */
function fitPadding(): Padding {
  if (window.innerWidth >= 1024) return { top: 110, bottom: 110, left: 460, right: 150 };
  return { top: 90, bottom: Math.round(window.innerHeight * 0.5), left: 24, right: 24 };
}

function readView(map: MapLibreMap): ViewState {
  const b = map.getBounds();
  const c = map.getCenter();
  return {
    zoom: map.getZoom(),
    bbox: [b.getSouth(), b.getWest(), b.getNorth(), b.getEast()],
    center: [c.lng, c.lat],
  };
}

function addCategoryLayers(map: MapLibreMap, cat: Category): void {
  const source = `src:${cat.id}`;
  const color = cat.color;

  if (cat.kind === 'point') {
    map.addLayer({
      id: `${cat.id}:heat`, type: 'heatmap', source, maxzoom: 14,
      paint: {
        'heatmap-weight': 1,
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 3, 0.5, 12, 2.5],
        'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'],
          0, 'rgba(0,0,0,0)', 0.12, rgba(color, 0.22), 0.4, rgba(color, 0.55), 0.75, rgba(color, 0.9), 1, '#ffffff'],
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 3, 8, 8, 24, 13, 44],
        'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 8, 0.95, 12, 0.5, 14, 0],
      },
    });
    map.addLayer({
      id: `${cat.id}:glow`, type: 'circle', source,
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 5, 8, 10, 14, 20],
        'circle-color': color,
        'circle-blur': 1,
        'circle-opacity': ['interpolate', ['linear'], ['zoom'], 3, 0.22, 8, 0.35, 14, 0.45],
      },
    });
    map.addLayer({
      id: `${cat.id}:dot`, type: 'circle', source,
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 1.8, 8, 3.4, 14, 6.5],
        'circle-color': color,
        'circle-stroke-color': 'rgba(255,255,255,0.92)',
        'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 3, 0.3, 10, 1.1],
        'circle-opacity': 0.96,
      },
    });
    return;
  }

  if (cat.kind === 'line') {
    map.addLayer({
      id: `${cat.id}:line-glow`, type: 'line', source,
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': color,
        'line-width': ['interpolate', ['linear'], ['zoom'], 5, 3, 14, 11],
        'line-blur': 3,
        'line-opacity': 0.32,
      },
    });
    map.addLayer({
      id: `${cat.id}:line`, type: 'line', source,
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': color,
        'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.9, 14, 3],
        'line-opacity': 0.95,
      },
    });
    return;
  }

  map.addLayer({
    id: `${cat.id}:fill`, type: 'fill', source,
    filter: ['==', ['geometry-type'], 'Polygon'],
    paint: { 'fill-color': color, 'fill-opacity': 0.14 },
  });
  map.addLayer({
    id: `${cat.id}:outline-glow`, type: 'line', source,
    paint: { 'line-color': color, 'line-width': 7, 'line-blur': 4, 'line-opacity': 0.25 },
  });
  map.addLayer({
    id: `${cat.id}:outline`, type: 'line', source,
    paint: {
      'line-color': color,
      'line-width': ['interpolate', ['linear'], ['zoom'], 4, 1, 12, 2.4],
      'line-opacity': 0.9,
    },
  });
}

function applyRenderMode(map: MapLibreMap, cat: Category, mode: RenderMode): void {
  if (cat.kind !== 'point') return;
  const setVisible = (id: string, on: boolean) => {
    if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', on ? 'visible' : 'none');
  };
  setVisible(`${cat.id}:heat`, mode !== 'points');
  setVisible(`${cat.id}:glow`, mode !== 'heat');
  if (map.getLayer(`${cat.id}:dot`)) {
    map.setPaintProperty(
      `${cat.id}:dot`,
      'circle-opacity',
      mode === 'heat' ? ['interpolate', ['linear'], ['zoom'], 9, 0, 12, 0.96] : 0.96,
    );
  }
}

function removeCategoryLayers(map: MapLibreMap, id: string): void {
  for (const s of SUFFIXES) {
    const layerId = `${id}:${s}`;
    if (map.getLayer(layerId)) map.removeLayer(layerId);
  }
  if (map.getSource(`src:${id}`)) map.removeSource(`src:${id}`);
}

function syncLayers(
  map: MapLibreMap,
  managed: Set<string>,
  seen: Map<string, FeatureCollection>,
  layers: MapLayer[],
  mode: RenderMode,
): void {
  const desired = new Map(layers.map(l => [l.category.id, l]));
  for (const id of Array.from(managed)) {
    if (!desired.has(id)) {
      removeCategoryLayers(map, id);
      managed.delete(id);
      seen.delete(id);
    }
  }
  for (const [id, layer] of desired) {
    const sourceId = `src:${id}`;
    const source = map.getSource(sourceId) as GeoJSONSource | undefined;
    if (!source) {
      map.addSource(sourceId, { type: 'geojson', data: layer.data });
      addCategoryLayers(map, layer.category);
      managed.add(id);
      seen.set(id, layer.data);
    } else if (seen.get(id) !== layer.data) {
      source.setData(layer.data);
      seen.set(id, layer.data);
    }
    applyRenderMode(map, layer.category, mode);
  }
}

function applyProjection(map: MapLibreMap, projection: Projection): void {
  try {
    map.setProjection({ type: projection });
  } catch {
    /* projection unsupported by this style */
  }
}

function applySky(map: MapLibreMap): void {
  try {
    map.setSky({
      'sky-color': '#0b1026',
      'horizon-color': '#1e3a8a',
      'fog-color': '#06080f',
      'fog-ground-blend': 0.6,
      'horizon-fog-blend': 0.8,
      'sky-horizon-blend': 0.7,
      'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 6, 1, 9, 0],
    });
  } catch {
    /* sky unsupported */
  }
}

export default function ExplorerMap({
  ref, basemap, projection, renderMode, layers, intro, onHover, onSelect, onView,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const styleReady = useRef(false);
  const spinning = useRef(false);
  const managed = useRef(new Set<string>());
  const seen = useRef(new Map<string, FeatureCollection>());
  const appliedBasemap = useRef<string | null>(null);
  const latest = useRef({ basemap, projection, renderMode, layers, intro, onHover, onSelect, onView });

  useEffect(() => {
    latest.current = { basemap, projection, renderMode, layers, intro, onHover, onSelect, onView };
  });

  // Create the map once.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const managedSet = managed.current;
    const seenMap = seen.current;
    const initial = latest.current.basemap;
    const map = new MapLibreMap({
      container,
      style: initial.style,
      center: INTRO_CENTER,
      zoom: INTRO_ZOOM,
      attributionControl: false,
      maxZoom: 19,
      fadeDuration: 250,
    });
    appliedBasemap.current = initial.id;
    map.addControl(new NavigationControl({ visualizePitch: true }), 'bottom-right');
    map.addControl(new AttributionControl({ compact: true }), 'bottom-right');
    mapRef.current = map;

    const interactiveLayers = (): string[] => {
      const ids: string[] = [];
      managed.current.forEach(id => {
        for (const s of INTERACTIVE) {
          const layerId = `${id}:${s}`;
          if (map.getLayer(layerId)) ids.push(layerId);
        }
      });
      return ids;
    };

    const pick = (e: MapMouseEvent): PickedFeature | null => {
      const ids = interactiveLayers();
      if (!ids.length) return null;
      const feats = map.queryRenderedFeatures(e.point, { layers: ids });
      if (!feats.length) return null;
      const f = feats[0];
      return {
        categoryId: f.layer.id.split(':')[0],
        properties: (f.properties ?? {}) as Record<string, unknown>,
        lngLat: [e.lngLat.lng, e.lngLat.lat],
      };
    };

    map.on('style.load', () => {
      styleReady.current = true;
      managed.current.clear();
      seen.current.clear();
      applyProjection(map, latest.current.projection);
      applySky(map);
      syncLayers(map, managed.current, seen.current, latest.current.layers, latest.current.renderMode);
    });
    map.on('mousemove', e => {
      const p = pick(e);
      map.getCanvas().style.cursor = p ? 'pointer' : '';
      latest.current.onHover(p ? { ...p, x: e.point.x, y: e.point.y } : null);
    });
    map.on('mouseout', () => latest.current.onHover(null));
    map.on('click', e => latest.current.onSelect(pick(e)));
    map.on('moveend', () => {
      if (latest.current.intro) return;
      latest.current.onView(readView(map));
    });

    return () => {
      map.remove();
      mapRef.current = null;
      styleReady.current = false;
      managedSet.clear();
      seenMap.clear();
    };
  }, []);

  // Swap basemap style; data layers are re-added on style.load.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || appliedBasemap.current === basemap.id) return;
    appliedBasemap.current = basemap.id;
    styleReady.current = false;
    managed.current.clear();
    seen.current.clear();
    map.setStyle(basemap.style);
  }, [basemap]);

  useEffect(() => {
    const map = mapRef.current;
    if (map && styleReady.current) applyProjection(map, projection);
  }, [projection]);

  useEffect(() => {
    const map = mapRef.current;
    if (map && styleReady.current) {
      syncLayers(map, managed.current, seen.current, layers, renderMode);
    }
  }, [layers, renderMode]);

  // Slow globe rotation while the intro overlay is showing.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !intro) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    spinning.current = true;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      if (!spinning.current) return;
      const dt = Math.min(now - last, 50);
      last = now;
      const c = map.getCenter();
      map.jumpTo({ center: [c.lng + dt * 0.0045, c.lat] });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      spinning.current = false;
      cancelAnimationFrame(raf);
    };
  }, [intro]);

  useImperativeHandle(ref, () => ({
    flyTo: (center, zoom) => {
      mapRef.current?.flyTo({ center, zoom, duration: 2400, curve: 1.6, essential: true });
    },
    fitBounds: bounds => {
      mapRef.current?.fitBounds(bounds, { padding: fitPadding(), duration: 1800, maxZoom: 15, essential: true });
    },
    resetView: () => {
      mapRef.current?.fitBounds(IRAQ_BOUNDS, { padding: fitPadding(), duration: 1800, essential: true });
    },
    getView: () => {
      const map = mapRef.current;
      return map ? readView(map) : DEFAULT_VIEW;
    },
    enter: () => {
      spinning.current = false;
      mapRef.current?.fitBounds(IRAQ_BOUNDS, { padding: fitPadding(), duration: 3400, essential: true });
    },
  }), []);

  return <div ref={containerRef} className="xp-map" aria-label="Map of Iraq" />;
}

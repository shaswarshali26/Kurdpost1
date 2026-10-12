import { useCallback, useEffect, useRef, useState } from 'react';
import type { Category } from './categories';
import {
  buildQuery, OverpassError, runQuery, toGeoJSON,
  type BBox, type FeatureCollection, type Scope,
} from './overpass';

export type LayerStatus = 'queued' | 'loading' | 'ready' | 'error' | 'zoom';

export interface QueryMeta {
  ms: number;
  bytes: number;
  endpoint: string;
  cached: boolean;
  timestamp?: string;
  scope: Scope;
  loadedAt: number;
}

export interface LayerState {
  category: Category;
  status: LayerStatus;
  query: string;
  data?: FeatureCollection;
  count?: number;
  error?: string;
  attempt?: string;
  meta?: QueryMeta;
}

export interface LayerView {
  zoom: number;
  bbox: BBox;
}

export type ToastTone = 'info' | 'error' | 'success';

interface Options {
  getView: () => LayerView;
  scope: Scope;
  endpoint: string;
  notify: (message: string, tone?: ToastTone) => void;
}

/** Public Overpass instances allow only a couple of slots per client. */
const MAX_CONCURRENT = 2;
let inflight = 0;
const waiting: Array<() => void> = [];

function acquire(): Promise<void> {
  if (inflight < MAX_CONCURRENT) {
    inflight += 1;
    return Promise.resolve();
  }
  return new Promise(resolve => {
    waiting.push(() => {
      inflight += 1;
      resolve();
    });
  });
}

function release(): void {
  inflight = Math.max(0, inflight - 1);
  const next = waiting.shift();
  if (next) next();
}

export function useLayers({ getView, scope, endpoint, notify }: Options) {
  const [layers, setLayers] = useState<Record<string, LayerState>>({});
  const [order, setOrder] = useState<string[]>([]);
  const controllers = useRef(new Map<string, AbortController>());
  const layersRef = useRef(layers);
  const latest = useRef({ getView, scope, endpoint, notify });

  useEffect(() => {
    layersRef.current = layers;
    latest.current = { getView, scope, endpoint, notify };
  });

  const patch = useCallback((id: string, update: Partial<LayerState>) => {
    setLayers(prev => (prev[id] ? { ...prev, [id]: { ...prev[id], ...update } } : prev));
  }, []);

  const load = useCallback(async (cat: Category) => {
    const current = latest.current;
    const view = current.getView();
    const effectiveScope: Scope = cat.heavy ? 'viewport' : current.scope;
    const minZoom = cat.minZoom ?? 10;

    controllers.current.get(cat.id)?.abort();
    setOrder(prev => (prev.includes(cat.id) ? prev : [...prev, cat.id]));

    if (cat.heavy && view.zoom < minZoom) {
      setLayers(prev => ({
        ...prev,
        [cat.id]: {
          category: cat,
          status: 'zoom',
          query: buildQuery(cat, 'viewport', view.bbox),
          error: `Zoom in to level ${minZoom} or closer, then reload`,
        },
      }));
      return;
    }

    const query = buildQuery(cat, effectiveScope, view.bbox);
    const ctrl = new AbortController();
    controllers.current.set(cat.id, ctrl);
    setLayers(prev => ({ ...prev, [cat.id]: { category: cat, status: 'queued', query } }));

    await acquire();
    if (ctrl.signal.aborted) {
      release();
      return;
    }
    patch(cat.id, { status: 'loading' });

    try {
      const res = await runQuery(query, {
        signal: ctrl.signal,
        preferred: current.endpoint,
        onAttempt: (ep, n) => patch(cat.id, { attempt: n > 1 ? `${ep.label} · retry ${n}` : ep.label }),
      });
      const data = toGeoJSON(res.data.elements, cat.kind);
      patch(cat.id, {
        status: 'ready',
        data,
        count: data.features.length,
        attempt: undefined,
        error: undefined,
        meta: {
          ms: res.ms,
          bytes: res.bytes,
          endpoint: res.endpoint,
          cached: res.cached,
          timestamp: res.data.osm3s?.timestamp_osm_base,
          scope: effectiveScope,
          loadedAt: Date.now(),
        },
      });
      if (data.features.length === 0) {
        current.notify(`${cat.label}: nothing mapped in this area yet`, 'info');
      }
    } catch (err) {
      if (err instanceof OverpassError && err.kind === 'aborted') return;
      const message = err instanceof Error ? err.message : 'Unknown error';
      patch(cat.id, { status: 'error', error: message, attempt: undefined });
      current.notify(`${cat.label}: ${message}`, 'error');
    } finally {
      release();
      if (controllers.current.get(cat.id) === ctrl) controllers.current.delete(cat.id);
    }
  }, [patch]);

  const remove = useCallback((id: string) => {
    controllers.current.get(id)?.abort();
    controllers.current.delete(id);
    setLayers(prev => {
      if (!prev[id]) return prev;
      const next: Record<string, LayerState> = {};
      for (const key of Object.keys(prev)) if (key !== id) next[key] = prev[key];
      return next;
    });
    setOrder(prev => prev.filter(x => x !== id));
  }, []);

  const toggle = useCallback((cat: Category) => {
    if (layersRef.current[cat.id]) remove(cat.id);
    else void load(cat);
  }, [load, remove]);

  const reload = useCallback((id: string) => {
    const state = layersRef.current[id];
    if (state) void load(state.category);
  }, [load]);

  const reloadInView = useCallback(() => {
    const { scope: currentScope } = latest.current;
    for (const state of Object.values(layersRef.current)) {
      if (state.category.heavy || currentScope === 'viewport') void load(state.category);
    }
  }, [load]);

  const clearAll = useCallback(() => {
    controllers.current.forEach(c => c.abort());
    controllers.current.clear();
    setLayers({});
    setOrder([]);
  }, []);

  return { layers, order, load, remove, toggle, reload, reloadInView, clearAll };
}

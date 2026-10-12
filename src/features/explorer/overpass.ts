/**
 * Minimal Overpass API client: query builder, fetch with endpoint fallback,
 * in-memory + session caching, and a converter from Overpass JSON to GeoJSON.
 */
import type { Category, GeomKind } from './categories';

export type BBox = [south: number, west: number, north: number, east: number];
export type Scope = 'country' | 'viewport';

export interface OverpassEndpoint {
  id: string;
  label: string;
  url: string;
}

/** Public Overpass instances, tried in order (preferred one first). */
export const ENDPOINTS: OverpassEndpoint[] = [
  { id: 'main',   label: 'overpass-api.de',         url: 'https://overpass-api.de/api/interpreter' },
  { id: 'kumi',   label: 'overpass.kumi.systems',   url: 'https://overpass.kumi.systems/api/interpreter' },
  { id: 'coffee', label: 'overpass.private.coffee', url: 'https://overpass.private.coffee/api/interpreter' },
];

export interface LatLon { lat: number; lon: number }

export interface OverpassMember {
  type: 'node' | 'way' | 'relation';
  ref: number;
  role: string;
  lat?: number;
  lon?: number;
  geometry?: (LatLon | null)[];
}

export interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: LatLon;
  tags?: Record<string, string>;
  geometry?: (LatLon | null)[];
  members?: OverpassMember[];
}

export interface OverpassResponse {
  version?: number;
  generator?: string;
  osm3s?: { timestamp_osm_base?: string; copyright?: string };
  elements: OverpassElement[];
  remark?: string;
}

// ── GeoJSON (local, dependency-free types) ──────────────────────────────────
export type Position = [number, number];
export type Geometry =
  | { type: 'Point'; coordinates: Position }
  | { type: 'LineString'; coordinates: Position[] }
  | { type: 'Polygon'; coordinates: Position[][] }
  | { type: 'MultiLineString'; coordinates: Position[][] };

export type FeatureProperties = Record<string, string | number>;

export interface Feature {
  type: 'Feature';
  id?: number;
  geometry: Geometry;
  properties: FeatureProperties;
}

export interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
}

// ── Query builder ───────────────────────────────────────────────────────────
export function buildQuery(cat: Category, scope: Scope, bbox?: BBox): string {
  const types = cat.types ?? 'nwr';
  const out = cat.kind === 'point' ? 'center' : 'geom';
  if (scope === 'viewport' && bbox) {
    const [s, w, n, e] = bbox.map(v => Number(v.toFixed(5)));
    return [
      `[out:json][timeout:45][bbox:${s},${w},${n},${e}];`,
      `// ${cat.label} (${cat.tag}) inside the current map view`,
      `${types}${cat.filter};`,
      `out ${out} qt;`,
    ].join('\n');
  }
  return [
    '[out:json][timeout:90];',
    `// ${cat.label} (${cat.tag}) across all of Iraq`,
    'area["ISO3166-1"="IQ"]["admin_level"="2"]->.iraq;',
    `${types}${cat.filter}(area.iraq);`,
    `out ${out} qt;`,
  ].join('\n');
}

export function overpassTurboUrl(query: string): string {
  return `https://overpass-turbo.eu/?Q=${encodeURIComponent(query)}&R`;
}

// ── Errors ──────────────────────────────────────────────────────────────────
export type OverpassErrorKind = 'rate_limit' | 'timeout' | 'syntax' | 'network' | 'aborted' | 'server';

export class OverpassError extends Error {
  kind: OverpassErrorKind;
  endpoint?: string;
  constructor(message: string, kind: OverpassErrorKind, endpoint?: string) {
    super(message);
    this.name = 'OverpassError';
    this.kind = kind;
    this.endpoint = endpoint;
  }
}

function extractHtmlError(html: string): string | null {
  const m = /Error<\/strong>:\s*([^<]+)/i.exec(html);
  return m ? m[1].trim() : null;
}

function cleanRemark(remark: string): string {
  return remark.replace(/^runtime error:\s*/i, '').replace(/\s+/g, ' ').trim();
}

// ── Cache ───────────────────────────────────────────────────────────────────
interface CacheEntry { data: OverpassResponse; bytes: number; ts: number }

const TTL_MS = 30 * 60 * 1000;
const SESSION_MAX_BYTES = 1_500_000;
const memCache = new Map<string, CacheEntry>();

function hashQuery(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

function readSession(key: string): CacheEntry | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (!entry || typeof entry.ts !== 'number' || Date.now() - entry.ts > TTL_MS) {
      sessionStorage.removeItem(key);
      return null;
    }
    return entry;
  } catch {
    return null;
  }
}

function writeSession(key: string, entry: CacheEntry): void {
  if (entry.bytes > SESSION_MAX_BYTES) return;
  try {
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch {
    /* storage quota exceeded or unavailable: ignore */
  }
}

export function clearQueryCache(): void {
  memCache.clear();
  try {
    const keys: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith('kp.overpass.')) keys.push(k);
    }
    keys.forEach(k => sessionStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}

// ── Fetch ───────────────────────────────────────────────────────────────────
export interface QueryResult {
  data: OverpassResponse;
  endpoint: string;
  ms: number;
  bytes: number;
  cached: boolean;
}

export interface RunOptions {
  signal?: AbortSignal;
  /** Endpoint id to try first. */
  preferred?: string;
  onAttempt?: (endpoint: OverpassEndpoint, attempt: number) => void;
}

const RETRYABLE = new Set([502, 503, 504]);

export async function runQuery(query: string, opts: RunOptions = {}): Promise<QueryResult> {
  const key = 'kp.overpass.' + hashQuery(query);
  const hit = memCache.get(key) ?? readSession(key);
  if (hit && Date.now() - hit.ts <= TTL_MS) {
    memCache.set(key, hit);
    return { data: hit.data, endpoint: 'cache', ms: 0, bytes: hit.bytes, cached: true };
  }

  const order = [...ENDPOINTS].sort((a, b) =>
    a.id === opts.preferred ? -1 : b.id === opts.preferred ? 1 : 0,
  );

  let lastError: OverpassError | null = null;

  for (let i = 0; i < order.length; i++) {
    const ep = order[i];
    if (opts.signal?.aborted) throw new OverpassError('Cancelled', 'aborted');
    opts.onAttempt?.(ep, i + 1);
    const started = performance.now();

    try {
      const res = await fetch(ep.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'data=' + encodeURIComponent(query),
        signal: opts.signal,
      });

      if (res.status === 429) {
        lastError = new OverpassError(`${ep.label} is rate-limiting this connection`, 'rate_limit', ep.label);
        continue;
      }
      if (RETRYABLE.has(res.status)) {
        lastError = new OverpassError(`${ep.label} answered HTTP ${res.status}`, 'server', ep.label);
        continue;
      }
      if (res.status === 400) {
        const html = await res.text();
        throw new OverpassError(extractHtmlError(html) ?? 'Overpass rejected the query', 'syntax', ep.label);
      }
      if (!res.ok) {
        lastError = new OverpassError(`${ep.label} answered HTTP ${res.status}`, 'server', ep.label);
        continue;
      }

      const text = await res.text();
      let data: OverpassResponse;
      try {
        data = JSON.parse(text) as OverpassResponse;
      } catch {
        lastError = new OverpassError(`${ep.label} returned a non-JSON response`, 'server', ep.label);
        continue;
      }
      if (!Array.isArray(data.elements)) {
        lastError = new OverpassError(`${ep.label} returned an unexpected payload`, 'server', ep.label);
        continue;
      }
      if (data.remark && /runtime error/i.test(data.remark)) {
        const kind: OverpassErrorKind = /time|timeout|timed out/i.test(data.remark) ? 'timeout' : 'server';
        throw new OverpassError(cleanRemark(data.remark), kind, ep.label);
      }

      const bytes = text.length;
      const entry: CacheEntry = { data, bytes, ts: Date.now() };
      memCache.set(key, entry);
      writeSession(key, entry);
      return { data, endpoint: ep.label, ms: Math.round(performance.now() - started), bytes, cached: false };
    } catch (err) {
      if (err instanceof OverpassError) {
        if (err.kind === 'syntax' || err.kind === 'timeout') throw err;
        lastError = err;
        continue;
      }
      if (err instanceof Error && err.name === 'AbortError') {
        throw new OverpassError('Cancelled', 'aborted');
      }
      lastError = new OverpassError(`Could not reach ${ep.label}`, 'network', ep.label);
    }
  }

  throw lastError ?? new OverpassError('All Overpass endpoints failed', 'network');
}

// ── GeoJSON conversion ──────────────────────────────────────────────────────
const TYPE_INDEX = { node: 0, way: 1, relation: 2 } as const;

export function displayName(props: FeatureProperties | Record<string, unknown>): string | null {
  const keys = ['name', 'name:en', 'name:ku', 'name:ar', 'official_name', 'brand', 'operator', 'ref'];
  for (const k of keys) {
    const v = props[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return null;
}

function propsOf(el: OverpassElement): FeatureProperties {
  const props: FeatureProperties = { ...(el.tags ?? {}) };
  props.osm_type = el.type;
  props.osm_id = el.id;
  const name = displayName(props);
  if (name) props.display_name = name;
  return props;
}

function featureId(el: OverpassElement): number {
  return el.id * 4 + TYPE_INDEX[el.type];
}

function toPositions(geometry: (LatLon | null)[] | undefined): Position[] {
  if (!geometry) return [];
  const out: Position[] = [];
  for (const p of geometry) if (p) out.push([p.lon, p.lat]);
  return out;
}

function isClosed(coords: Position[]): boolean {
  if (coords.length < 4) return false;
  const a = coords[0];
  const b = coords[coords.length - 1];
  return a[0] === b[0] && a[1] === b[1];
}

function posKey(p: Position): string {
  return p[0] + ',' + p[1];
}

/**
 * Joins way segments end-to-end into closed rings (for multipolygon
 * relations such as governorate boundaries). Segments that cannot be closed
 * are returned as open lines.
 */
export function assembleRings(segments: Position[][]): { rings: Position[][]; open: Position[][] } {
  const rings: Position[][] = [];
  const open: Position[][] = [];
  const pool = segments.filter(s => s.length > 1).map(s => s.slice());

  while (pool.length) {
    const ring = pool.shift()!;
    let extended = true;
    while (extended && !isClosed(ring)) {
      extended = false;
      const tail = posKey(ring[ring.length - 1]);
      for (let i = 0; i < pool.length; i++) {
        const seg = pool[i];
        const head = posKey(seg[0]);
        const end = posKey(seg[seg.length - 1]);
        if (head === tail) {
          ring.push(...seg.slice(1));
        } else if (end === tail) {
          ring.push(...seg.slice(0, -1).reverse());
        } else {
          continue;
        }
        pool.splice(i, 1);
        extended = true;
        break;
      }
    }
    if (isClosed(ring)) rings.push(ring);
    else open.push(ring);
  }
  return { rings, open };
}

export function toGeoJSON(elements: OverpassElement[], kind: GeomKind): FeatureCollection {
  const features: Feature[] = [];

  for (const el of elements) {
    const properties = propsOf(el);
    const id = featureId(el);

    if (el.type === 'node') {
      if (typeof el.lat !== 'number' || typeof el.lon !== 'number') continue;
      features.push({ type: 'Feature', id, geometry: { type: 'Point', coordinates: [el.lon, el.lat] }, properties });
      continue;
    }

    if (kind === 'point') {
      if (el.center) {
        features.push({ type: 'Feature', id, geometry: { type: 'Point', coordinates: [el.center.lon, el.center.lat] }, properties });
      }
      continue;
    }

    if (el.type === 'way') {
      const coords = toPositions(el.geometry);
      if (coords.length < 2) {
        if (el.center) features.push({ type: 'Feature', id, geometry: { type: 'Point', coordinates: [el.center.lon, el.center.lat] }, properties });
        continue;
      }
      if (kind === 'polygon' && isClosed(coords)) {
        features.push({ type: 'Feature', id, geometry: { type: 'Polygon', coordinates: [coords] }, properties });
      } else {
        features.push({ type: 'Feature', id, geometry: { type: 'LineString', coordinates: coords }, properties });
      }
      continue;
    }

    if (el.type === 'relation' && el.members) {
      const outer: Position[][] = [];
      const other: Position[][] = [];
      for (const m of el.members) {
        if (m.type !== 'way') continue;
        const coords = toPositions(m.geometry);
        if (coords.length < 2) continue;
        if (kind === 'polygon' && (m.role === 'outer' || m.role === '')) outer.push(coords);
        else other.push(coords);
      }
      if (kind === 'polygon' && outer.length) {
        const { rings, open } = assembleRings(outer);
        rings.forEach((ring, i) => {
          features.push({ type: 'Feature', id: id + i * 1e12, geometry: { type: 'Polygon', coordinates: [ring] }, properties });
        });
        other.push(...open);
      }
      if (other.length) {
        features.push({ type: 'Feature', id: id + 5e12, geometry: { type: 'MultiLineString', coordinates: other }, properties });
      } else if (!outer.length && el.center) {
        features.push({ type: 'Feature', id, geometry: { type: 'Point', coordinates: [el.center.lon, el.center.lat] }, properties });
      }
    }
  }

  return { type: 'FeatureCollection', features };
}

/** Returns [[west, south], [east, north]] or null when the collection is empty. */
export function boundsOf(fc: FeatureCollection): [[number, number], [number, number]] | null {
  let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
  const visit = (p: Position) => {
    if (p[0] < w) w = p[0];
    if (p[0] > e) e = p[0];
    if (p[1] < s) s = p[1];
    if (p[1] > n) n = p[1];
  };
  for (const f of fc.features) {
    const g = f.geometry;
    if (g.type === 'Point') visit(g.coordinates);
    else if (g.type === 'LineString') g.coordinates.forEach(visit);
    else g.coordinates.forEach(ring => ring.forEach(visit));
  }
  if (!Number.isFinite(w)) return null;
  return [[w, s], [e, n]];
}

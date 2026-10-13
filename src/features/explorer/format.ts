export function fmtInt(n: number): string {
  return n.toLocaleString('en-US');
}

export function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function fmtMs(ms: number): string {
  return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(1)} s`;
}

export function fmtCoord(lng: number, lat: number): string {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

export function fmtTimestamp(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC';
}

/** Tags worth surfacing first in hover cards and the detail drawer. */
export const HIGHLIGHT_TAGS = [
  'amenity', 'healthcare', 'shop', 'tourism', 'historic', 'place', 'highway', 'railway', 'aeroway',
  'power', 'landuse', 'natural', 'waterway', 'boundary', 'admin_level', 'operator', 'brand',
  'addr:city', 'addr:street', 'phone', 'opening_hours', 'website', 'capacity', 'beds', 'religion',
  'denomination', 'population', 'ref', 'wikidata',
];

export function highlightTags(props: Record<string, unknown>, max = 4): [string, string][] {
  const out: [string, string][] = [];
  for (const key of HIGHLIGHT_TAGS) {
    const v = props[key];
    if (typeof v === 'string' && v && !key.startsWith('name')) out.push([key, v]);
    if (out.length >= max) break;
  }
  return out;
}

export function osmUrl(type: unknown, id: unknown): string | null {
  if (typeof type !== 'string' || (typeof id !== 'number' && typeof id !== 'string')) return null;
  return `https://www.openstreetmap.org/${type}/${id}`;
}

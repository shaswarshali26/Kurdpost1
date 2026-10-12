/**
 * Catalogue of OpenStreetMap feature categories that the explorer can load
 * from the Overpass API. Each category maps to a single Overpass QL tag
 * filter chain. Point-like categories are fetched nation-wide; "heavy"
 * categories (roads, buildings, land use) are fetched for the visible map
 * area only, and only above a minimum zoom, to stay inside the public
 * Overpass instances' time and memory limits.
 */

export type GeomKind = 'point' | 'line' | 'polygon';

export interface CategoryGroup {
  id: string;
  label: string;
  blurb: string;
}

export interface Category {
  id: string;
  group: string;
  label: string;
  /** The OSM tag(s) the category is built from, shown as a hint in the UI. */
  tag: string;
  icon: string;
  color: string;
  kind: GeomKind;
  /** Overpass QL tag filter chain, e.g. `["amenity"="hospital"]`. */
  filter: string;
  /** Element types to query. Defaults to nwr (nodes, ways and relations). */
  types?: 'nwr' | 'node' | 'way' | 'relation' | 'nw' | 'wr';
  /** Heavy categories are only queried inside the current viewport, above minZoom. */
  heavy?: boolean;
  minZoom?: number;
}

export const GROUPS: CategoryGroup[] = [
  { id: 'health',    label: 'Health',             blurb: 'Hospitals, clinics and pharmacies' },
  { id: 'education', label: 'Education',          blurb: 'Schools, universities, libraries' },
  { id: 'civic',     label: 'Public services',    blurb: 'Post, police, courts, government' },
  { id: 'transport', label: 'Transport',          blurb: 'Airports, stations, fuel, borders' },
  { id: 'roads',     label: 'Roads & rail',       blurb: 'Network lines, loaded in view' },
  { id: 'commerce',  label: 'Finance & commerce', blurb: 'Banks, markets, retail' },
  { id: 'culture',   label: 'Culture & religion', blurb: 'Worship, heritage, tourism' },
  { id: 'places',    label: 'Settlements',        blurb: 'Cities, towns and villages' },
  { id: 'energy',    label: 'Energy & water',     blurb: 'Power, oil, dams, rivers' },
  { id: 'land',      label: 'Land & buildings',   blurb: 'Dense polygons, loaded in view' },
  { id: 'admin',     label: 'Boundaries',         blurb: 'Administrative outlines' },
];

export const CATEGORIES: Category[] = [
  // ── Health ──────────────────────────────────────────────────────────────
  { id: 'hospital',   group: 'health', label: 'Hospitals',  tag: 'amenity=hospital',  icon: 'Hospital',    color: '#fb7185', kind: 'point', filter: '["amenity"="hospital"]' },
  { id: 'clinic',     group: 'health', label: 'Clinics',    tag: 'amenity=clinic',    icon: 'Stethoscope', color: '#f472b6', kind: 'point', filter: '["amenity"="clinic"]' },
  { id: 'doctors',    group: 'health', label: 'Doctors',    tag: 'amenity=doctors',   icon: 'HeartPulse',  color: '#e879f9', kind: 'point', filter: '["amenity"="doctors"]' },
  { id: 'pharmacy',   group: 'health', label: 'Pharmacies', tag: 'amenity=pharmacy',  icon: 'Pill',        color: '#c084fc', kind: 'point', filter: '["amenity"="pharmacy"]' },
  { id: 'dentist',    group: 'health', label: 'Dentists',   tag: 'amenity=dentist',   icon: 'Smile',       color: '#a78bfa', kind: 'point', filter: '["amenity"="dentist"]' },

  // ── Education ───────────────────────────────────────────────────────────
  { id: 'school',       group: 'education', label: 'Schools',       tag: 'amenity=school',       icon: 'School',        color: '#fbbf24', kind: 'point', filter: '["amenity"="school"]' },
  { id: 'university',   group: 'education', label: 'Universities',  tag: 'amenity=university',   icon: 'GraduationCap', color: '#f59e0b', kind: 'point', filter: '["amenity"="university"]' },
  { id: 'college',      group: 'education', label: 'Colleges',      tag: 'amenity=college',      icon: 'BookOpen',      color: '#fb923c', kind: 'point', filter: '["amenity"="college"]' },
  { id: 'kindergarten', group: 'education', label: 'Kindergartens', tag: 'amenity=kindergarten', icon: 'Baby',          color: '#fdba74', kind: 'point', filter: '["amenity"="kindergarten"]' },
  { id: 'library',      group: 'education', label: 'Libraries',     tag: 'amenity=library',      icon: 'Library',       color: '#fcd34d', kind: 'point', filter: '["amenity"="library"]' },

  // ── Public services ─────────────────────────────────────────────────────
  { id: 'post_office',  group: 'civic', label: 'Post offices',       tag: 'amenity=post_office',  icon: 'Mail',      color: '#60a5fa', kind: 'point', filter: '["amenity"="post_office"]' },
  { id: 'police',       group: 'civic', label: 'Police',             tag: 'amenity=police',       icon: 'Shield',    color: '#3b82f6', kind: 'point', filter: '["amenity"="police"]' },
  { id: 'fire_station', group: 'civic', label: 'Fire stations',      tag: 'amenity=fire_station', icon: 'Flame',     color: '#f87171', kind: 'point', filter: '["amenity"="fire_station"]' },
  { id: 'townhall',     group: 'civic', label: 'Town halls',         tag: 'amenity=townhall',     icon: 'Landmark',  color: '#93c5fd', kind: 'point', filter: '["amenity"="townhall"]' },
  { id: 'courthouse',   group: 'civic', label: 'Courthouses',        tag: 'amenity=courthouse',   icon: 'Scale',     color: '#818cf8', kind: 'point', filter: '["amenity"="courthouse"]' },
  { id: 'government',   group: 'civic', label: 'Government offices', tag: 'office=government',    icon: 'Building2', color: '#6366f1', kind: 'point', filter: '["office"="government"]' },
  { id: 'diplomatic',   group: 'civic', label: 'Embassies',          tag: 'office=diplomatic',    icon: 'Globe',     color: '#a5b4fc', kind: 'point', filter: '["office"="diplomatic"]' },

  // ── Transport ───────────────────────────────────────────────────────────
  { id: 'airport',      group: 'transport', label: 'Airports',         tag: 'aeroway=aerodrome',       icon: 'Plane',      color: '#22d3ee', kind: 'point', filter: '["aeroway"="aerodrome"]' },
  { id: 'fuel',         group: 'transport', label: 'Fuel stations',    tag: 'amenity=fuel',            icon: 'Fuel',       color: '#2dd4bf', kind: 'point', filter: '["amenity"="fuel"]' },
  { id: 'bus_station',  group: 'transport', label: 'Bus stations',     tag: 'amenity=bus_station',     icon: 'Bus',        color: '#5eead4', kind: 'point', filter: '["amenity"="bus_station"]' },
  { id: 'rail_station', group: 'transport', label: 'Railway stations', tag: 'railway=station',         icon: 'TrainFront', color: '#67e8f9', kind: 'point', filter: '["railway"="station"]' },
  { id: 'border',       group: 'transport', label: 'Border crossings', tag: 'barrier=border_control',  icon: 'Milestone',  color: '#a5f3fc', kind: 'point', filter: '["barrier"="border_control"]' },
  { id: 'parking',      group: 'transport', label: 'Parking',          tag: 'amenity=parking',         icon: 'Car',        color: '#99f6e4', kind: 'point', filter: '["amenity"="parking"]', heavy: true, minZoom: 11 },

  // ── Roads & rail ────────────────────────────────────────────────────────
  { id: 'motorway',    group: 'roads', label: 'Motorways & trunks', tag: 'highway=motorway|trunk',       icon: 'Route',      color: '#f97316', kind: 'line', filter: '["highway"~"^(motorway|trunk|motorway_link|trunk_link)$"]', types: 'way', heavy: true, minZoom: 7 },
  { id: 'primary',     group: 'roads', label: 'Primary roads',      tag: 'highway=primary',              icon: 'Waypoints',  color: '#fbbf24', kind: 'line', filter: '["highway"~"^(primary|primary_link)$"]',                 types: 'way', heavy: true, minZoom: 8 },
  { id: 'secondary',   group: 'roads', label: 'Secondary roads',    tag: 'highway=secondary',            icon: 'Waypoints',  color: '#fde68a', kind: 'line', filter: '["highway"~"^(secondary|secondary_link)$"]',             types: 'way', heavy: true, minZoom: 9 },
  { id: 'local_roads', group: 'roads', label: 'Local streets',      tag: 'highway=tertiary|residential', icon: 'Waypoints',  color: '#e2e8f0', kind: 'line', filter: '["highway"~"^(tertiary|residential|unclassified)$"]',    types: 'way', heavy: true, minZoom: 12 },
  { id: 'railway',     group: 'roads', label: 'Railways',           tag: 'railway=rail',                 icon: 'TrainTrack', color: '#c4b5fd', kind: 'line', filter: '["railway"="rail"]',                                     types: 'way' },

  // ── Finance & commerce ──────────────────────────────────────────────────
  { id: 'bank',        group: 'commerce', label: 'Banks',             tag: 'amenity=bank',             icon: 'Banknote',     color: '#34d399', kind: 'point', filter: '["amenity"="bank"]' },
  { id: 'atm',         group: 'commerce', label: 'ATMs',              tag: 'amenity=atm',              icon: 'CreditCard',   color: '#6ee7b7', kind: 'point', filter: '["amenity"="atm"]' },
  { id: 'exchange',    group: 'commerce', label: 'Currency exchange', tag: 'amenity=bureau_de_change', icon: 'Coins',        color: '#a7f3d0', kind: 'point', filter: '["amenity"="bureau_de_change"]' },
  { id: 'marketplace', group: 'commerce', label: 'Markets & bazaars', tag: 'amenity=marketplace',      icon: 'Store',        color: '#4ade80', kind: 'point', filter: '["amenity"="marketplace"]' },
  { id: 'supermarket', group: 'commerce', label: 'Supermarkets',      tag: 'shop=supermarket',         icon: 'ShoppingCart', color: '#86efac', kind: 'point', filter: '["shop"="supermarket"]' },
  { id: 'mall',        group: 'commerce', label: 'Malls',             tag: 'shop=mall',                icon: 'ShoppingBag',  color: '#bbf7d0', kind: 'point', filter: '["shop"="mall"]' },

  // ── Culture & religion ──────────────────────────────────────────────────
  { id: 'mosque',         group: 'culture', label: 'Mosques',                 tag: 'place_of_worship + religion=muslim',    icon: 'Moon',     color: '#2dd4bf', kind: 'point', filter: '["amenity"="place_of_worship"]["religion"="muslim"]' },
  { id: 'church',         group: 'culture', label: 'Churches',                tag: 'place_of_worship + religion=christian', icon: 'Church',   color: '#f0abfc', kind: 'point', filter: '["amenity"="place_of_worship"]["religion"="christian"]' },
  { id: 'worship_other',  group: 'culture', label: 'Other places of worship', tag: 'place_of_worship, other religions',     icon: 'Sparkles', color: '#d8b4fe', kind: 'point', filter: '["amenity"="place_of_worship"]["religion"!~"^(muslim|christian)$"]' },
  { id: 'museum',         group: 'culture', label: 'Museums',                 tag: 'tourism=museum',                        icon: 'Landmark', color: '#f9a8d4', kind: 'point', filter: '["tourism"="museum"]' },
  { id: 'archaeological', group: 'culture', label: 'Archaeological sites',    tag: 'historic=archaeological_site',          icon: 'Castle',   color: '#fda4af', kind: 'point', filter: '["historic"="archaeological_site"]' },
  { id: 'hotel',          group: 'culture', label: 'Hotels',                  tag: 'tourism=hotel',                         icon: 'Hotel',    color: '#fca5a5', kind: 'point', filter: '["tourism"="hotel"]' },
  { id: 'attraction',     group: 'culture', label: 'Attractions',             tag: 'tourism=attraction',                    icon: 'Camera',   color: '#fecdd3', kind: 'point', filter: '["tourism"="attraction"]' },

  // ── Settlements ─────────────────────────────────────────────────────────
  { id: 'city',          group: 'places', label: 'Cities',         tag: 'place=city',                icon: 'Building',   color: '#ffffff', kind: 'point', filter: '["place"="city"]',    types: 'node' },
  { id: 'town',          group: 'places', label: 'Towns',          tag: 'place=town',                icon: 'Home',       color: '#e2e8f0', kind: 'point', filter: '["place"="town"]',    types: 'node' },
  { id: 'village',       group: 'places', label: 'Villages',       tag: 'place=village',             icon: 'MapPin',     color: '#94a3b8', kind: 'point', filter: '["place"="village"]', types: 'node' },
  { id: 'neighbourhood', group: 'places', label: 'Neighbourhoods', tag: 'place=suburb|neighbourhood', icon: 'LayoutGrid', color: '#cbd5e1', kind: 'point', filter: '["place"~"^(suburb|neighbourhood|quarter)$"]', types: 'node', heavy: true, minZoom: 10 },

  // ── Energy & water ──────────────────────────────────────────────────────
  { id: 'power_plant', group: 'energy', label: 'Power plants',   tag: 'power=plant',              icon: 'Zap',      color: '#facc15', kind: 'point',   filter: '["power"="plant"]' },
  { id: 'substation',  group: 'energy', label: 'Substations',    tag: 'power=substation',         icon: 'Plug',     color: '#fde047', kind: 'point',   filter: '["power"="substation"]' },
  { id: 'power_line',  group: 'energy', label: 'Power lines',    tag: 'power=line',               icon: 'Cable',    color: '#fef08a', kind: 'line',    filter: '["power"="line"]', types: 'way', heavy: true, minZoom: 8 },
  { id: 'oil_well',    group: 'energy', label: 'Oil & gas wells', tag: 'man_made=petroleum_well', icon: 'Droplet',  color: '#a3e635', kind: 'point',   filter: '["man_made"="petroleum_well"]' },
  { id: 'refinery',    group: 'energy', label: 'Refineries',     tag: 'industrial=refinery',      icon: 'Factory',  color: '#bef264', kind: 'point',   filter: '["industrial"="refinery"]' },
  { id: 'dam',         group: 'energy', label: 'Dams',           tag: 'waterway=dam',             icon: 'Waves',    color: '#38bdf8', kind: 'point',   filter: '["waterway"="dam"]' },
  { id: 'water_tower', group: 'energy', label: 'Water towers',   tag: 'man_made=water_tower',     icon: 'Droplets', color: '#7dd3fc', kind: 'point',   filter: '["man_made"="water_tower"]' },
  { id: 'river',       group: 'energy', label: 'Rivers',         tag: 'waterway=river',           icon: 'Waves',    color: '#38bdf8', kind: 'line',    filter: '["waterway"="river"]', types: 'way', heavy: true, minZoom: 7 },
  { id: 'water',       group: 'energy', label: 'Lakes & water',  tag: 'natural=water',            icon: 'Waves',    color: '#0ea5e9', kind: 'polygon', filter: '["natural"="water"]', types: 'wr', heavy: true, minZoom: 9 },

  // ── Land & buildings ────────────────────────────────────────────────────
  { id: 'building',    group: 'land', label: 'Buildings',         tag: 'building=*',         icon: 'Building', color: '#f8fafc', kind: 'polygon', filter: '["building"]',              types: 'way', heavy: true, minZoom: 15 },
  { id: 'residential', group: 'land', label: 'Residential areas', tag: 'landuse=residential', icon: 'Home',     color: '#fb923c', kind: 'polygon', filter: '["landuse"="residential"]', types: 'wr',  heavy: true, minZoom: 11 },
  { id: 'industrial',  group: 'land', label: 'Industrial areas',  tag: 'landuse=industrial',  icon: 'Factory',  color: '#a78bfa', kind: 'polygon', filter: '["landuse"="industrial"]',  types: 'wr',  heavy: true, minZoom: 11 },
  { id: 'farmland',    group: 'land', label: 'Farmland',          tag: 'landuse=farmland',    icon: 'Wheat',    color: '#a3e635', kind: 'polygon', filter: '["landuse"="farmland"]',    types: 'wr',  heavy: true, minZoom: 11 },
  { id: 'park',        group: 'land', label: 'Parks',             tag: 'leisure=park',        icon: 'Trees',    color: '#4ade80', kind: 'polygon', filter: '["leisure"="park"]',        types: 'wr',  heavy: true, minZoom: 11 },

  // ── Boundaries ──────────────────────────────────────────────────────────
  { id: 'governorates', group: 'admin', label: 'Governorates', tag: 'admin_level=4', icon: 'Map',        color: '#fbbf24', kind: 'polygon', filter: '["boundary"="administrative"]["admin_level"="4"]', types: 'relation' },
  { id: 'districts',    group: 'admin', label: 'Districts',    tag: 'admin_level=6', icon: 'LayoutGrid', color: '#fcd34d', kind: 'polygon', filter: '["boundary"="administrative"]["admin_level"="6"]', types: 'relation', heavy: true, minZoom: 7 },
];

export const CATEGORY_BY_ID: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map(c => [c.id, c]),
);

/** Layers suggested to first-time visitors. */
export const FEATURED_IDS = ['hospital', 'post_office', 'school', 'fuel', 'governorates', 'airport'];

export const DEFAULT_LAYER_ID = 'hospital';

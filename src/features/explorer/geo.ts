import type { StyleSpecification } from 'maplibre-gl';

export type LngLat = [number, number];
export type Bounds = [LngLat, LngLat];

/** Approximate bounding box of Iraq: [[west, south], [east, north]]. */
export const IRAQ_BOUNDS: Bounds = [[38.79, 29.06], [48.58, 37.39]];
export const IRAQ_CENTER: LngLat = [43.9, 33.2];

/** Where the globe sits before the visitor enters the map. */
export const INTRO_CENTER: LngLat = [44, 22];
export const INTRO_ZOOM = 1.55;

export interface Place {
  id: string;
  name: string;
  nameKu?: string;
  nameAr?: string;
  center: LngLat;
  zoom: number;
  kri?: boolean;
}

/** Governorate capitals, used by the "jump to" control. Coordinates are approximate city centres. */
export const GOVERNORATES: Place[] = [
  { id: 'erbil',        name: 'Erbil',                 nameKu: 'هەولێر',  nameAr: 'أربيل',     center: [44.0092, 36.1911], zoom: 11.2, kri: true },
  { id: 'sulaymaniyah', name: 'Sulaymaniyah',          nameKu: 'سلێمانی', nameAr: 'السليمانية', center: [45.4329, 35.5570], zoom: 11.2, kri: true },
  { id: 'duhok',        name: 'Duhok',                 nameKu: 'دهۆک',    nameAr: 'دهوك',      center: [42.9873, 36.8617], zoom: 11.5, kri: true },
  { id: 'halabja',      name: 'Halabja',               nameKu: 'هەڵەبجە', nameAr: 'حلبجة',     center: [45.9861, 35.1778], zoom: 12,   kri: true },
  { id: 'baghdad',      name: 'Baghdad',               nameAr: 'بغداد',    center: [44.3661, 33.3152], zoom: 10.6 },
  { id: 'basra',        name: 'Basra',                 nameAr: 'البصرة',   center: [47.7804, 30.5085], zoom: 11 },
  { id: 'mosul',        name: 'Mosul · Nineveh',       nameAr: 'الموصل',   center: [43.1189, 36.3350], zoom: 11 },
  { id: 'kirkuk',       name: 'Kirkuk',                nameKu: 'کەرکووک', nameAr: 'كركوك',     center: [44.3922, 35.4681], zoom: 11.5 },
  { id: 'ramadi',       name: 'Ramadi · Anbar',        nameAr: 'الرمادي',  center: [43.2992, 33.4258], zoom: 11.5 },
  { id: 'tikrit',       name: 'Tikrit · Salah al-Din', nameAr: 'تكريت',    center: [43.6789, 34.6069], zoom: 12 },
  { id: 'baqubah',      name: 'Baqubah · Diyala',      nameAr: 'بعقوبة',   center: [44.6433, 33.7467], zoom: 12 },
  { id: 'hillah',       name: 'Hillah · Babil',        nameAr: 'الحلة',    center: [44.4340, 32.4790], zoom: 12 },
  { id: 'karbala',      name: 'Karbala',               nameAr: 'كربلاء',   center: [44.0249, 32.6160], zoom: 12 },
  { id: 'najaf',        name: 'Najaf',                 nameAr: 'النجف',    center: [44.3415, 32.0286], zoom: 11.8 },
  { id: 'kut',          name: 'Kut · Wasit',           nameAr: 'الكوت',    center: [45.8181, 32.5128], zoom: 12 },
  { id: 'diwaniyah',    name: 'Diwaniyah · Qadisiyyah', nameAr: 'الديوانية', center: [44.9247, 31.9929], zoom: 12 },
  { id: 'samawah',      name: 'Samawah · Muthanna',    nameAr: 'السماوة',  center: [45.2806, 31.3166], zoom: 12 },
  { id: 'nasiriyah',    name: 'Nasiriyah · Dhi Qar',   nameAr: 'الناصرية', center: [46.2590, 31.0530], zoom: 12 },
  { id: 'amarah',       name: 'Amarah · Maysan',       nameAr: 'العمارة',  center: [47.1440, 31.8356], zoom: 12 },
];

export interface Basemap {
  id: string;
  label: string;
  hint: string;
  icon: string;
  style: string | StyleSpecification;
  dark: boolean;
}

const satelliteStyle: StyleSpecification = {
  version: 8,
  name: 'Satellite',
  sources: {
    esri: {
      type: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      maxzoom: 18,
      attribution: 'Imagery © Esri, Maxar, Earthstar Geographics, and the GIS User Community',
    },
  },
  layers: [{ id: 'esri-imagery', type: 'raster', source: 'esri' }],
};

/** Free, key-less basemaps. Vector styles are hosted by CARTO and OpenFreeMap. */
export const BASEMAPS: Basemap[] = [
  { id: 'dark',      label: 'Dark',      hint: 'CARTO Dark Matter',   icon: 'Moon',      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json', dark: true },
  { id: 'light',     label: 'Light',     hint: 'CARTO Positron',      icon: 'Sun',       style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',    dark: false },
  { id: 'streets',   label: 'Streets',   hint: 'OpenFreeMap Liberty', icon: 'Route',     style: 'https://tiles.openfreemap.org/styles/liberty',                     dark: false },
  { id: 'satellite', label: 'Satellite', hint: 'Esri World Imagery',  icon: 'Satellite', style: satelliteStyle,                                                      dark: true },
];

export const BASEMAP_BY_ID: Record<string, Basemap> = Object.fromEntries(BASEMAPS.map(b => [b.id, b]));

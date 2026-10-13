/**
 * MapLibre resolves its web worker relative to its own module URL, which breaks once
 * the library is bundled. Point it at a copy that Vite bundles and serves as an asset.
 */
import { setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

setWorkerUrl(workerUrl);

/**
 * MapLibre loads its web worker from a URL relative to its own module, which breaks once
 * the library is bundled. The worker source is embedded as text and started from a blob URL,
 * so it works both in the Vite app and in the single-file build.
 */
import { setWorkerUrl } from 'maplibre-gl';
import workerSource from 'maplibre-gl/dist/maplibre-gl-worker.mjs?raw';

setWorkerUrl(URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' })));

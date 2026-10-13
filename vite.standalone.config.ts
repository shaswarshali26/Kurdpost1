import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Builds the explorer as one self-contained HTML file (standalone/dist/explorer.html).
export default defineConfig({
  root: 'standalone',
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: "../dist-standalone",
    emptyOutDir: true,
    assetsInlineLimit: () => true,
    chunkSizeWarningLimit: 4000,
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  build: {
    target: 'es2022',
    cssTarget: 'chrome110',
    sourcemap: false,
    // The Three.js sculpture is a lazily loaded, desktop-only chunk; its size is expected.
    chunkSizeWarningLimit: 650,
  },
});

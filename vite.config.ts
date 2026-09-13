import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * GitHub Pages serves this project from https://gulyamov0003.github.io/yakkachinar/, so every built
 * URL (scripts, styles, lazy chunks, public files) must start with /yakkachinar/. Without it the page
 * requests /assets/*.js from the domain root, gets 404s, and never starts.
 * Deploying to a domain root instead: build with BASE_PATH=/ .
 * The dev server stays at /; `vite preview` uses the production base, exactly like the live site.
 */
const PRODUCTION_BASE = process.env.BASE_PATH ?? '/yakkachinar/';

export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? PRODUCTION_BASE : '/',
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
}));

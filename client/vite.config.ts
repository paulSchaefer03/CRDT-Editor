import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',
  build: {
    outDir: '../dist',
    sourcemap: true,
    target: 'esnext',
    emptyOutDir: true
  },
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 4173,
  },
});
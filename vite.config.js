// Configuration d'urgence - JS pur sans TypeScript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      typescript: false,
      babel: false,
    }),
  ],
  
  server: {
    host: "::",
    port: 8080,
  },
  
  preview: {
    port: 4173,
    host: "::"
  },
  
  resolve: {
    alias: {
      "@": resolve(process.cwd(), "./src"),
    },
  },
  
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true,
    reportCompressedSize: false,
  },
  
  // Transformation pure esbuild - aucune validation TypeScript
  esbuild: {
    target: 'esnext',
    format: 'esm',
    jsx: 'automatic',
  },

  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      jsx: 'automatic',
    }
  },
});
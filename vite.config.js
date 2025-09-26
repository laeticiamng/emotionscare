// Configuration finale - Force l'ignorance complète de TypeScript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { componentTagger } from "lovable-tagger";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    componentTagger(),
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
    rollupOptions: {
      external: []
    }
  },
  
  // Configuration esbuild qui ignore tsconfig.json complètement
  esbuild: {
    target: 'esnext',
    logLevel: 'silent',
    format: 'esm',
    jsx: 'automatic'
  },

  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      jsx: 'automatic'
    }
  }
});
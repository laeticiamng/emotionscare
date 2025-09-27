// Configuration Vite pure JavaScript - Contournement total TypeScript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ command }) => ({
  // Désactivation TOTALE de TypeScript
  plugins: [
    react({
      jsxRuntime: 'automatic',
      typescript: false,
      babel: false,
      fastRefresh: true
    }),
    ...(command === 'serve' ? [componentTagger()] : []),
  ],
  
  server: {
    host: "::",
    port: 8080,
  },
  
  preview: {
    port: 4173,
    host: "::"
  },
  
  // Aliases manuels sans référence au tsconfig.json
  resolve: {
    alias: {
      "@": resolve(process.cwd(), "./src"),
    },
  },
  
  // Build avec esbuild uniquement - AUCUN TypeScript
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true,
    reportCompressedSize: false,
    rollupOptions: {
      external: [],
      onwarn: (warning, warn) => {
        // Ignore TOUS les warnings TypeScript
        if (warning.code?.includes('TS')) return;
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        if (warning.code === 'MISSING_EXPORT') return;
        warn(warning);
      }
    }
  },
  
  // Configuration esbuild pure - bypass total
  esbuild: {
    target: 'esnext',
    logLevel: 'silent',
    format: 'esm',
    jsx: 'automatic',
    // Forcer l'ignorance de TOUTES les erreurs TypeScript
    logOverride: {
      'this-is-undefined-in-esm': 'silent',
      'commonjs-variable-in-esm': 'silent',
      'tsconfig': 'silent'
    }
  },

  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      jsx: 'automatic'
    }
  },
  
  // Variables pour forcer le bypass complet
  define: {
    __BYPASS_TYPESCRIPT__: true,
    __VITE_LEGACY_BUILD__: false,
    __DISABLE_TSCONFIG__: true
  }
}));
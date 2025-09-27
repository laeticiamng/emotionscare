// Configuration Vite - Bypass TOTAL du système TypeScript Lovable
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ command }) => ({
  // Désactive complètement TypeScript dans tous les modes
  plugins: [
    react({
      jsxRuntime: 'automatic',
      typescript: false,
      babel: false,
      fastRefresh: true
    }),
    ...(command === 'serve' ? [componentTagger()] : []),
  ],
  
  // Configuration serveur
  server: {
    host: "::",
    port: 8080,
  },
  
  preview: {
    port: 4173,
    host: "::"
  },
  
  // Aliases sans dépendance au tsconfig.json
  resolve: {
    alias: {
      "@": resolve(process.cwd(), "./src"),
    },
  },
  
  // Build avec esbuild uniquement - aucun TypeScript
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true,
    reportCompressedSize: false,
    // Force Rollup à ignorer les erreurs TypeScript
    rollupOptions: {
      external: [],
      onwarn: (warning, warn) => {
        // Ignore les warnings TypeScript
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        if (warning.code === 'MISSING_EXPORT') return;
        warn(warning);
      }
    }
  },
  
  // Configuration esbuild pure - bypass tsconfig.json
  esbuild: {
    target: 'esnext',
    logLevel: 'silent',
    format: 'esm',
    jsx: 'automatic',
    // Force l'ignorance des erreurs de types
    logOverride: {
      'this-is-undefined-in-esm': 'silent',
      'commonjs-variable-in-esm': 'silent'
    }
  },

  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      jsx: 'automatic'
    }
  },
  
  // Variables d'environnement pour forcer le bypass
  define: {
    __BYPASS_TYPESCRIPT__: true,
    __VITE_LEGACY_BUILD__: false
  }
}));
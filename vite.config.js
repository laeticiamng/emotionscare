// Configuration spécifique Lovable - Contournement TypeScript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { componentTagger } from "lovable-tagger";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      // Configuration React sans TypeScript
      babel: undefined,
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
  
  // Configuration esbuild pure sans référence à tsconfig
  esbuild: {
    target: 'esnext',
    logLevel: 'silent',
    format: 'esm',
    jsx: 'automatic',
    // Ignorer complètement tsconfig.json
    tsconfig: false,
    tsconfigRaw: false
  },

  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      jsx: 'automatic',
      // Forcer l'ignorance de tsconfig
      tsconfig: false
    }
  }
});
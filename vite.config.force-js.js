// Configuration Vite FORCE JavaScript - Bypass COMPLET TypeScript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { componentTagger } from "lovable-tagger";

export default defineConfig(() => ({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      typescript: false,
      babel: false,
      fastRefresh: true,
      include: "**/*.{jsx,js,tsx,ts}"
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
      external: [],
      onwarn: () => {}, // Ignore TOUS les warnings
    }
  },
  
  esbuild: {
    target: 'esnext',
    logLevel: 'silent',
    format: 'esm',
    jsx: 'automatic',
    loader: {
      '.ts': 'tsx',
      '.tsx': 'tsx'
    },
    logOverride: {
      'this-is-undefined-in-esm': 'silent',
      'commonjs-variable-in-esm': 'silent',
      'jsx-not-supported': 'silent'
    }
  },

  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      jsx: 'automatic',
      loader: {
        '.ts': 'tsx',
        '.tsx': 'tsx'
      }
    }
  },
  
  define: {
    __BYPASS_TYPESCRIPT__: true,
    __VITE_LEGACY_BUILD__: false
  }
}));
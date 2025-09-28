import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      typescript: false,
      babel: false,
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  
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
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
  
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true,
    reportCompressedSize: false,
    rollupOptions: {
      onwarn() {
        // Ignore all warnings
      }
    }
  },
  
  esbuild: {
    target: 'esnext',
    jsx: 'automatic',
    jsxImportSource: 'react',
    logLevel: 'silent'
  },

  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      jsx: 'automatic',
      jsxImportSource: 'react',
    }
  },
  
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode)
  }
}));
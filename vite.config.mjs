// Configuration Vite - JavaScript pur pour éviter tsconfig.json cassé
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { componentTagger } from "lovable-tagger";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
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
    reportCompressedSize: false
  },
  
  esbuild: {
    target: 'esnext',
    jsx: 'automatic',
    loader: {
      '.ts': 'tsx',
      '.tsx': 'tsx'
    }
  }
});
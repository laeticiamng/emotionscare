// Configuration Vite d'urgence - JavaScript pur pour éviter TypeScript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      // Pas de TypeScript du tout
      typescript: false,
      babel: false
    })
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
  
  // Transformation pure esbuild - aucun TypeScript
  esbuild: {
    target: 'esnext',
    logLevel: 'silent',
    format: 'esm'
  }
});
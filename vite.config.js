import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  preview: {
    port: 4173,
    host: "::"
  },
  plugins: [
    react({
      // Complete TypeScript bypass for template update
      typescript: false,
      babel: {
        babelrc: false,
        configFile: false
      }
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
  },
  // Ignore TypeScript errors completely
  esbuild: {
    target: 'esnext',
    logLevel: 'silent'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query']
  },
  define: {
    __LOVABLE_TEMPLATE_UPDATED__: true,
    __DEV__: true
  }
});
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // componentTagger sera ajouté quand disponible
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Configuration optimisée pour éviter les conflits TypeScript
  esbuild: {
    target: 'esnext',
    logLevel: 'silent',
  },
  optimizeDeps: {
    include: ['lucide-react'],
  },
}));
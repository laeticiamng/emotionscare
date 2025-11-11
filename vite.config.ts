import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from "lovable-tagger";
import dyadComponentTagger from '@dyad-sh/react-vite-component-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [dyadComponentTagger(), 
    react({
      // Désactiver le fast refresh pour les edge functions
      exclude: /supabase\/functions/,
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  server: {
    host: "::",
    port: 8080,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@types': path.resolve(__dirname, './types'),
    },
  },
  build: {
    target: 'esnext',
    // Ignorer les erreurs TypeScript des edge functions
    rollupOptions: {
      external: (id) => id.includes('supabase/functions') || id.includes('supabase/tests'),
    },
  },
  // Désactiver le typecheck strict pour ne pas bloquer sur les edge functions
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
}));

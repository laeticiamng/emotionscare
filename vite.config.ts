import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@types': path.resolve(__dirname, './types'),
    },
  },
  esbuild: {
    // Désactiver la vérification TypeScript pour le build
    // Les edge functions Supabase ne doivent pas être vérifiées avec le frontend
    exclude: ['**/supabase/functions/**/*'],
  },
  optimizeDeps: {
    exclude: ['supabase'],
  },
  build: {
    rollupOptions: {
      external: ['supabase/functions'],
    },
  },
});

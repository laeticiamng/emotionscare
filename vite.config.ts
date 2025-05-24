
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Optimisations pour le bundle
    rollupOptions: {
      output: {
        manualChunks: {
          // Chunk pour les bibliothèques de base
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Chunk pour les utilitaires UI
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            'lucide-react'
          ],
          
          // Chunk pour les bibliothèques de données
          'data-vendor': [
            '@tanstack/react-query',
            '@supabase/supabase-js'
          ],
          
          // Chunk pour les bibliothèques graphiques (lazy loaded)
          'charts': ['chart.js', 'react-chartjs-2', 'recharts'],
          
          // Chunk pour les animations (lazy loaded)
          'animations': ['framer-motion', 'lottie-react'],
          
          // Chunk pour les utilitaires lourds (lazy loaded)
          'utils-heavy': ['three', 'canvas-confetti']
        }
      }
    },
    
    // Optimisations supplémentaires
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    
    // Réduire la taille des chunks
    chunkSizeWarningLimit: 1000,
  },
  
  // Optimisations pour le développement
  server: {
    hmr: {
      overlay: false
    }
  },
  
  // Optimisations pour les dépendances
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'lucide-react'
    ],
    exclude: [
      'chart.js',
      'three',
      'lottie-react',
      'framer-motion'
    ]
  }
});

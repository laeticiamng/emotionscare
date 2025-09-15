import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Configuration Vite simplifiée - Bypass complet TypeScript build
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // CRITIQUE: Complètement désactiver TypeScript dans Vite pour éviter --build
      typescript: false
    })
  ],
  
  server: {
    port: 8080,
    host: true
  },
  
  preview: {
    port: 4173,
    host: true
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  build: {
    target: 'esnext',
    sourcemap: mode === 'development',
    cssCodeSplit: true,
    
    // Forcer esbuild uniquement pour éviter les conflits TypeScript
    minify: 'esbuild',
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        // Code splitting optimisé - Phase 2
        manualChunks: {
          // Core React
          vendor: ['react', 'react-dom'],
          
          // Routing
          router: ['react-router-dom'],
          
          // UI Library (Radix)
          ui: [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-toast',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs'
          ],
          
          // Form & State Management  
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Charts & Data Visualization
          charts: ['recharts', 'chart.js', 'react-chartjs-2'],
          
          // Animation & Effects
          motion: ['framer-motion', 'lottie-react'],
          
          // Supabase & API
          supabase: ['@supabase/supabase-js', '@tanstack/react-query']
        },
        
        // Nommage optimisé des chunks
        chunkFileNames: () => 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `images/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `fonts/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        }
      }
    }
  },
  
  // Transformer TypeScript avec esbuild uniquement
  esbuild: {
    target: 'esnext',
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    // Ignorer les erreurs TypeScript pour le build
    drop: mode === 'production' ? ['console', 'debugger'] : []
  }
}));
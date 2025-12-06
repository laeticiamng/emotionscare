
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from "lovable-tagger";
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    
    // 🎯 Phase 2: Bundle analyzer (généré uniquement si ANALYZE=true)
    process.env.ANALYZE && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),
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
    
    rollupOptions: {
      output: {
        // 🚀 Code splitting optimisé
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
          supabase: ['@supabase/supabase-js', '@tanstack/react-query'],
          
          // AI & ML Libraries
          ai: ['openai', 'hume', '@huggingface/transformers']
        },
        
        // 📦 Nommage optimisé des chunks
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()
            : 'chunk';
          return `js/[name]-[hash].js`;
        },
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
    },
    
    // 🎯 Optimisations build
    minify: 'esbuild',
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov'],
      threshold: {
        global: {
          branches: 85,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    }
  }
}));

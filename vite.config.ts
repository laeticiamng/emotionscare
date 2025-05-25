
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  server: {
    host: "::",
    port: 8080
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.warn', 'console.info'] : [],
        passes: 2
      },
      mangle: {
        properties: {
          regex: /^_/
        }
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React (priorité haute)
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI Framework (chargement différé)
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            'lucide-react'
          ],
          
          // Data Management
          'data-vendor': [
            '@tanstack/react-query',
            '@supabase/supabase-js'
          ],
          
          // Charts (lazy load)
          'charts': ['chart.js', 'react-chartjs-2', 'recharts'],
          
          // Heavy features (lazy load)
          'heavy-features': ['three', 'canvas-confetti', 'lottie-react', 'framer-motion'],
          
          // Business modules (lazy load)
          'meditation': ['./src/components/meditation/GuidedSessionList'],
          'coach': ['./src/components/coach/EnhancedCoachAI', './src/components/coach/CoachChatInterface'],
          'music': ['./src/components/music/MusicPlayer']
        },
        // Optimisation des noms de fichiers
        entryFileNames: mode === 'production' ? 'assets/[name].[hash].js' : 'assets/[name].js',
        chunkFileNames: mode === 'production' ? 'assets/[name].[hash].js' : 'assets/[name].js',
        assetFileNames: mode === 'production' ? 'assets/[name].[hash].[ext]' : 'assets/[name].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: mode === 'development',
    cssCodeSplit: true,
    reportCompressedSize: mode === 'production',
    
    // Optimisations avancées pour la production
    ...(mode === 'production' && {
      assetsInlineLimit: 4096,
      cssMinify: true,
      manifest: true
    })
  },
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
      'framer-motion',
      'canvas-confetti'
    ]
  },
  
  // Configuration PWA
  ...(mode === 'production' && {
    define: {
      'process.env.NODE_ENV': '"production"',
      '__BUILD_TIME__': JSON.stringify(new Date().toISOString())
    }
  })
}));

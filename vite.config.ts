
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
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            'lucide-react'
          ],
          'data-vendor': [
            '@tanstack/react-query',
            '@supabase/supabase-js'
          ],
          'charts': ['chart.js', 'react-chartjs-2', 'recharts'],
          'animations': ['framer-motion', 'lottie-react'],
          'utils-heavy': ['three', 'canvas-confetti'],
          'meditation': ['./src/components/meditation/GuidedSessionList'],
          'coach': ['./src/components/coach/EnhancedCoachAI', './src/components/coach/CoachChatInterface']
        }
      }
    },
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.warn'] : [],
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: mode === 'development',
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
      'framer-motion'
    ]
  }
}));

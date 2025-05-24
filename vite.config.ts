import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
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
          'utils-heavy': ['three', 'canvas-confetti']
        }
      }
    },
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 1000,
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
});

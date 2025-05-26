
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // Optimize React refresh in development
      fastRefresh: mode === 'development',
      // Enable automatic JSX runtime
      jsxRuntime: 'automatic',
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  
  server: {
    host: "::",
    port: 8080,
    // Enable HTTP/2 in development
    https: false,
    // Optimize HMR
    hmr: {
      overlay: true,
    },
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  build: {
    target: 'esnext',
    minify: 'terser',
    // Optimize CSS
    cssMinify: true,
    // Enable source maps in development only
    sourcemap: mode === 'development',
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Critical React dependencies
          'react-core': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          
          // UI framework (load early)
          'ui-framework': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            'lucide-react'
          ],
          
          // Data layer
          'data-layer': [
            '@tanstack/react-query',
            '@supabase/supabase-js'
          ],
          
          // Charts (lazy load)
          'charts': ['chart.js', 'react-chartjs-2', 'recharts'],
          
          // Heavy features (lazy load)
          'heavy-features': ['three', 'canvas-confetti', 'framer-motion'],
          
          // Authentication
          'auth': [
            'firebase/app',
            'firebase/auth',
            'firebase/firestore',
            'firebase/storage'
          ],
          
          // Music features
          'music': ['hume'],
        },
        // Optimize asset naming
        chunkFileNames: mode === 'production' ? 'assets/js/[name].[hash].js' : 'assets/js/[name].js',
        entryFileNames: mode === 'production' ? 'assets/js/[name].[hash].js' : 'assets/js/[name].js',
        assetFileNames: mode === 'production' ? 'assets/[ext]/[name].[hash].[ext]' : 'assets/[ext]/[name].[ext]',
      },
      external: mode === 'development' ? [] : undefined,
    },
    
    // Advanced optimizations for production
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.warn', 'console.info'] : [],
        passes: 3, // Increased compression passes
        unsafe: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_symbols: true,
      },
      mangle: {
        properties: {
          regex: /^_/
        }
      },
      format: {
        comments: false,
      },
    },
    
    // Bundle size limits
    chunkSizeWarningLimit: 1000,
    
    // Asset optimization
    assetsInlineLimit: 4096,
    reportCompressedSize: mode === 'production',
    
    // PWA manifest
    manifest: mode === 'production',
  },
  
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
    ],
    exclude: [
      'chart.js',
      'three',
      'framer-motion',
      'canvas-confetti',
      '@react-three/fiber',
      '@react-three/drei',
    ],
    // Force optimize dependencies
    force: mode === 'development',
  },
  
  // Performance optimizations
  esbuild: {
    target: 'esnext',
    // Remove unused code
    treeShaking: true,
    // Optimize for size in production
    minifyIdentifiers: mode === 'production',
    minifySyntax: mode === 'production',
    minifyWhitespace: mode === 'production',
  },
  
  // CSS optimizations
  css: {
    devSourcemap: mode === 'development',
    preprocessorOptions: {
      scss: {
        // Optimize SCSS compilation
        outputStyle: mode === 'production' ? 'compressed' : 'expanded',
      },
    },
  },
  
  // Define global constants
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    '__BUILD_TIME__': JSON.stringify(new Date().toISOString()),
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
  
  // Experimental features
  experimental: {
    renderBuiltUrl: mode === 'production' ? undefined : undefined,
  },
}));

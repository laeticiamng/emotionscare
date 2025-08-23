import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { terser } from 'rollup-plugin-terser';

export default defineConfig({
  plugins: [
    react({
      // Optimisations React
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: [
          // Supprimer les console.log en production
          ...(process.env.NODE_ENV === 'production' ? [
            ['transform-remove-console', { exclude: ['error', 'warn'] }]
          ] : [])
        ]
      }
    })
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // Optimisations de build
  build: {
    // Taille des chunks optimisée
    chunkSizeWarningLimit: 1000,
    
    // Minification agressive
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        passes: 2 // Deux passes pour une meilleure compression
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    
    // Optimisation Rollup
    rollupOptions: {
      output: {
        // Code splitting optimisé
        manualChunks: {
          // Vendor chunks - séparés pour un meilleur cache
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-toast',
            '@radix-ui/react-tabs',
            '@radix-ui/react-progress'
          ],
          'chart-vendor': ['recharts', 'chart.js'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'utils-vendor': ['date-fns', 'clsx', 'tailwind-merge'],
          
          // Chunks fonctionnels
          'optimization': [
            './src/hooks/optimization/useOptimizedState',
            './src/hooks/optimization/useVirtualizedList',
            './src/hooks/optimization/useMemoryOptimization',
            './src/components/optimization/OptimizedImage',
            './src/contexts/PerformanceContext'
          ]
        },
        
        // Noms de fichiers avec hash pour le cache
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    // Source maps conditionnels
    sourcemap: process.env.NODE_ENV === 'development',
    
    // Optimisation CSS
    cssCodeSplit: true,
    
    // Répertoire de sortie propre
    outDir: 'dist',
    emptyOutDir: true
  },
  
  // Optimisations du serveur de développement
  server: {
    // Préchargement des modules
    preTransformRequests: true,
    
    // Cache optimisé
    fs: {
      strict: true,
      allow: ['..']
    }
  },
  
  // Optimisations des dépendances
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'recharts',
      'lucide-react'
    ],
    exclude: [
      // Exclure les modules qui causent des problèmes
      '@vite/client',
      '@vite/env'
    ]
  },
  
  // Configuration ESBuild pour la vitesse
  esbuild: {
    // Suppression des console.log
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    
    // Optimisation de la taille
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true
  },
  
  // Configuration des workers
  worker: {
    format: 'es'
  },
  
  // Headers de cache pour les assets
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  }
});
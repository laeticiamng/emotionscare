import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer en mode développement
    process.env.ANALYZE && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  
  // Optimisations de build
  build: {
    target: 'es2020',
    sourcemap: false, // Désactivé en production pour la sécurité
    
    rollupOptions: {
      output: {
        // Chunking intelligent pour optimiser le cache
        manualChunks: {
          // Vendors principaux
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          
          // UI Components
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
          ],
          
          // Utilitaires
          'utils-vendor': [
            'clsx',
            'tailwind-merge', 
            'class-variance-authority',
            'date-fns',
          ],
          
          // Analytics et monitoring
          'analytics-vendor': [
            '@sentry/react',
            '@vercel/analytics',
          ],
          
          // Animations et 3D
          'animation-vendor': [
            'framer-motion',
            '@react-three/fiber',
            '@react-three/drei',
          ],
        },
        
        // Noms de fichiers optimisés
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    
    // Optimisations supplémentaires
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Supprime tous les console.log
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.warn'], // Fonctions pures à supprimer
      },
    },
    
    // Limite de taille pour chunks
    chunkSizeWarningLimit: 1000,
  },
  
  // Optimisations des dépendances
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-toast',
      'framer-motion',
    ],
  },
  
  // Configuration serveur dev
  server: {
    port: 3000,
    host: true,
    open: false,
  },
  
  // Variables d'environnement
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  
  // Configuration CSS
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      css: {
        charset: false, // Évite les warnings @charset
      },
    },
  },
});
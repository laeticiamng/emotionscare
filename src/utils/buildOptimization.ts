/**
 * Optimisations de build pour la production
 */

import { logger } from '@/lib/logger';

// Configuration des chunks optimisés
export const CHUNK_OPTIMIZATION = {
  // Vendors critiques (chargés en priorité)
  'react-core': ['react', 'react-dom', 'react-router-dom'],
  
  // UI Libraries (chargés en différé)
  'ui-libs': [
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu', 
    '@radix-ui/react-tabs',
    'lucide-react'
  ],
  
  // Data management
  'data-libs': [
    '@tanstack/react-query',
    '@supabase/supabase-js'
  ],
  
  // Charts (lazy loaded)
  'charts': ['chart.js', 'react-chartjs-2', 'recharts'],
  
  // Heavy features (lazy loaded)
  'heavy-features': ['three', 'canvas-confetti', 'lottie-react'],
  
  // Business modules
  'meditation': ['./src/components/meditation/GuidedSessionList'],
  'coach': ['./src/components/coach/EnhancedCoachAI'],
  'music': ['./src/components/music/MusicPlayer']
};

/**
 * Préchargement intelligent des ressources critiques
 */
export function preloadCriticalResources(): void {
  // Précharger les fonts critiques
  // Fonts are loaded via CSS (rsms.me/inter), no local preload needed
  
  // Précharger les images critiques
  const criticalImages = [
    '/hero/hero-fallback.webp'
  ];
  
  criticalImages.forEach(image => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = image;
    link.as = 'image';
    document.head.appendChild(link);
  });
}

/**
 * Configuration PWA optimisée
 */
export const PWA_CONFIG = {
  name: 'EmotionsCare',
  short_name: 'EmotionsCare',
  description: 'Plateforme de bien-être émotionnel',
  theme_color: '#6366f1',
  background_color: '#ffffff',
  display: 'standalone',
  orientation: 'portrait-primary',
  scope: '/',
  start_url: '/',
  icons: [
    {
      src: '/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable'
    },
    {
      src: '/icon-512.png', 
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any'
    }
  ]
};

/**
 * Optimisation des performances réseau
 */
export function optimizeNetworkPerformance(): void {
  // Préconnexion aux domaines critiques
  const criticalDomains = [
    'https://yaincoxihiqdksxgrsrk.supabase.co',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  
  criticalDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

/**
 * Compression et minification avancée
 */
export const COMPRESSION_CONFIG = {
  // Configuration Terser pour la minification
  terser: {
    compress: {
      drop_console: true,
      drop_debugger: true,
      pure_funcs: ['console.log', 'console.warn', 'console.info'],
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
  
  // Configuration de compression Brotli/Gzip
  compression: {
    threshold: 1024,
    deleteOriginalAssets: false,
    algorithm: 'brotliCompress'
  }
};

/**
 * Initialise toutes les optimisations de build
 */
export function initBuildOptimizations(): void {
  if (import.meta.env.PROD) {
    preloadCriticalResources();
    optimizeNetworkPerformance();
    
    logger.info('⚡ Build optimizations initialized', undefined, 'SYSTEM');
  }
}

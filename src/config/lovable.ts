/**
 * Configuration Lovable - Version Latest
 * Centralise tous les paramètres spécifiques à Lovable
 */

export const LOVABLE_CONFIG = {
  // Version et compatibilité
  version: 'latest',
  supportedFeatures: [
    'componentTagger',
    'hotReload',
    'bundleOptimization',
    'typeScriptSupport',
    'tailwindIntegration',
  ],
  
  // Configuration serveur de développement
  server: {
    host: '::',
    port: 8080,
    hmr: true,
  },
  
  // Optimisations de build
  build: {
    chunking: 'intelligent',
    minification: 'terser',
    treeshaking: true,
    sourcemaps: false, // Sécurité production
  },
  
  // Plugins activés
  plugins: {
    react: true,
    componentTagger: true, // Nouvelle fonctionnalité
    bundleAnalyzer: false, // Sur demande seulement
  },
  
  // Performance
  performance: {
    optimizeDeps: true,
    preload: ['react', 'react-dom'],
    lazyLoading: true,
  },
  
  // Intégrations
  integrations: {
    supabase: true,
    tailwind: true,
    typescript: true,
    eslint: true,
    prettier: true,
  }
} as const;

export type LovableConfig = typeof LOVABLE_CONFIG;
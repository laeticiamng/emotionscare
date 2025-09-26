/**
 * Helpers spécifiques à la plateforme Lovable
 * Fonctions utilitaires pour optimiser l'expérience de développement
 */

import { LOVABLE_CONFIG } from '@/config/lovable';

/**
 * Vérifie si une fonctionnalité Lovable est supportée
 */
export function isFeatureSupported(feature: string): boolean {
  return LOVABLE_CONFIG.supportedFeatures.includes(feature as any);
}

/**
 * Obtient la configuration optimale pour le mode actuel
 */
export function getLovableMode(): 'development' | 'production' | 'preview' {
  if (import.meta.env.DEV) return 'development';
  if (import.meta.env.PROD) return 'production';
  return 'preview';
}

/**
 * Active les optimisations spécifiques à Lovable
 */
export function enableLovableOptimizations(): void {
  const mode = getLovableMode();
  
  if (mode === 'development') {
    // Optimisations développement
    if (isFeatureSupported('componentTagger')) {
      console.info('✅ Lovable Component Tagger activé');
    }
    
    if (isFeatureSupported('hotReload')) {
      console.info('✅ Lovable Hot Reload optimisé');
    }
  }
  
  if (mode === 'production') {
    // Optimisations production
    console.info('🚀 Lovable Production Mode activé');
  }
}

/**
 * Reporting de performance pour Lovable
 */
export function reportLovableMetrics(metrics: Record<string, number>): void {
  if (getLovableMode() === 'development') {
    console.group('📊 Lovable Metrics');
    Object.entries(metrics).forEach(([key, value]) => {
      console.log(`${key}: ${value}ms`);
    });
    console.groupEnd();
  }
}

/**
 * Configuration runtime optimisée pour Lovable
 */
export function getLovableRuntimeConfig() {
  return {
    mode: getLovableMode(),
    features: LOVABLE_CONFIG.supportedFeatures,
    server: LOVABLE_CONFIG.server,
    performance: {
      chunking: LOVABLE_CONFIG.build.chunking,
      lazyLoading: LOVABLE_CONFIG.performance.lazyLoading,
    }
  };
}
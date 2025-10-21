// @ts-nocheck

/**
 * Utilitaires d'audit pour la mise en production
 */

import { logger } from '@/lib/logger';

export interface ProductionAuditResult {
  isReady: boolean;
  critical: string[];
  warnings: string[];
  recommendations: string[];
  score: number;
}

export const runProductionAudit = (): ProductionAuditResult => {
  const critical: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Vérifications critiques
  if (!import.meta.env.VITE_SUPABASE_URL) {
    critical.push('VITE_SUPABASE_URL manquante');
    score -= 25;
  }

  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
    critical.push('VITE_SUPABASE_ANON_KEY manquante');
    score -= 25;
  }

  // Vérifications d'avertissement
  if (import.meta.env.DEV) {
    warnings.push('Application en mode développement');
    score -= 10;
  }

  // Recommandations
  recommendations.push('Activer HTTPS en production');
  recommendations.push('Configurer CSP (Content Security Policy)');
  recommendations.push('Activer la compression gzip');
  recommendations.push('Mettre en place un monitoring d\'erreurs');

  return {
    isReady: critical.length === 0,
    critical,
    warnings,
    recommendations,
    score: Math.max(0, score)
  };
};

export const logProductionAudit = () => {
  const audit = runProductionAudit();
  
  logger.info('🔍 AUDIT DE PRODUCTION', {
    score: audit.score,
    isReady: audit.isReady,
    critical: audit.critical,
    warnings: audit.warnings,
    recommendations: audit.recommendations
  }, 'SYSTEM');
  
  return audit;
};


/**
 * Utilitaires d'audit pour la mise en production
 */

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
  
  console.log('🔍 AUDIT DE PRODUCTION');
  console.log('======================');
  console.log(`Score: ${audit.score}/100`);
  console.log(`Prêt pour production: ${audit.isReady ? '✅' : '❌'}`);
  
  if (audit.critical.length > 0) {
    console.log('\n❌ PROBLÈMES CRITIQUES:');
    audit.critical.forEach(issue => console.log(`  - ${issue}`));
  }
  
  if (audit.warnings.length > 0) {
    console.log('\n⚠️ AVERTISSEMENTS:');
    audit.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  if (audit.recommendations.length > 0) {
    console.log('\n💡 RECOMMANDATIONS:');
    audit.recommendations.forEach(rec => console.log(`  - ${rec}`));
  }
  
  return audit;
};

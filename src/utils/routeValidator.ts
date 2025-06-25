
// Validateur de routes pour vérifier l'intégrité du système de navigation

import { UNIFIED_ROUTES, validateUniqueRoutes, TOTAL_ROUTES_COUNT } from './routeUtils';

interface RouteValidationResult {
  path: string;
  status: 'valid' | 'error' | 'warning';
  component?: string;
  message?: string;
}

export class RouteValidator {
  private results: RouteValidationResult[] = [];

  /**
   * Valide toutes les routes du système
   */
  async validateAllRoutes(): Promise<{
    summary: {
      total: number;
      valid: number;
      errors: number;
      warnings: number;
    };
    results: RouteValidationResult[];
  }> {
    console.log('🔍 Validation des 52 routes EmotionsCare...');
    
    this.results = [];
    
    // Vérification de l'unicité des routes
    if (!validateUniqueRoutes()) {
      this.results.push({
        path: 'SYSTEM',
        status: 'error',
        message: 'Doublons détectés dans les routes'
      });
    }

    // Validation de chaque route
    for (const [key, path] of Object.entries(UNIFIED_ROUTES)) {
      await this.validateRoute(key, path);
    }

    const summary = this.generateSummary();
    
    console.log(`✅ Validation terminée : ${summary.valid}/${summary.total} routes valides`);
    
    return {
      summary,
      results: this.results
    };
  }

  /**
   * Valide une route individuelle
   */
  private async validateRoute(key: string, path: string): Promise<void> {
    try {
      // Simulation de validation (en production, on ferait un fetch réel)
      const isValidPath = this.isValidPathFormat(path);
      
      if (!isValidPath) {
        this.results.push({
          path,
          status: 'error',
          message: `Format de chemin invalide pour ${key}`
        });
        return;
      }

      // Vérification que le composant existe (approximation)
      const hasComponent = this.checkComponentExists(key);
      
      if (!hasComponent) {
        this.results.push({
          path,
          status: 'warning',
          message: `Composant potentiellement manquant pour ${key}`
        });
        return;
      }

      this.results.push({
        path,
        status: 'valid',
        component: this.getComponentName(key)
      });

    } catch (error) {
      this.results.push({
        path,
        status: 'error',
        message: `Erreur de validation : ${error}`
      });
    }
  }

  /**
   * Vérifie le format du chemin
   */
  private isValidPathFormat(path: string): boolean {
    // Doit commencer par /
    if (!path.startsWith('/')) return false;
    
    // Pas de caractères spéciaux dangereux
    const dangerousChars = /[<>:"'|?*]/;
    if (dangerousChars.test(path)) return false;
    
    // Longueur raisonnable
    if (path.length > 100) return false;
    
    return true;
  }

  /**
   * Vérifie approximativement si le composant existe
   */
  private checkComponentExists(key: string): boolean {
    // Pour l'instant, on suppose que toutes les nouvelles pages créées par le backend existent
    const backendCreatedPages = [
      'ONBOARDING', 'B2B_LANDING', 'BOSS_LEVEL_GRIT', 'MOOD_MIXER', 'BOUNCE_BACK_BATTLE',
      'STORY_SYNTH_LAB', 'BREATHWORK', 'VR_GALACTIQUE', 'SCREEN_SILK_BREAK', 'FLASH_GLOW',
      'AMBITION_ARCADE', 'AR_FILTERS', 'BUBBLE_BEAT', 'INSTANT_GLOW', 'WEEKLY_BARS',
      'HEATMAP_VIBES', 'PREFERENCES', 'PROFILE_SETTINGS', 'ACTIVITY_HISTORY',
      'PRIVACY_TOGGLES', 'EXPORT_CSV', 'ACCOUNT_DELETE', 'NOTIFICATIONS', 'HELP_CENTER',
      'FEEDBACK', 'SECURITY', 'AUDIT', 'ACCESSIBILITY', 'HEALTH_CHECK_BADGE'
    ];
    
    // Les pages existantes avant le backend
    const existingPages = [
      'HOME', 'CHOOSE_MODE', 'B2B_SELECTION', 'B2C_LOGIN', 'B2C_REGISTER',
      'B2B_USER_LOGIN', 'B2B_USER_REGISTER', 'B2B_ADMIN_LOGIN',
      'B2C_DASHBOARD', 'B2B_USER_DASHBOARD', 'B2B_ADMIN_DASHBOARD',
      'SCAN', 'MUSIC', 'COACH', 'JOURNAL', 'VR', 'GAMIFICATION', 'SOCIAL_COCON',
      'TEAMS', 'REPORTS', 'EVENTS', 'OPTIMISATION', 'SETTINGS'
    ];
    
    return backendCreatedPages.includes(key) || existingPages.includes(key);
  }

  /**
   * Obtient le nom du composant pour une clé donnée
   */
  private getComponentName(key: string): string {
    const componentMapping: Record<string, string> = {
      'HOME': 'HomePage',
      'CHOOSE_MODE': 'ChooseModePage',
      'ONBOARDING': 'OnboardingFlowPage',
      'B2B_SELECTION': 'B2BSelectionPage',
      'B2B_LANDING': 'B2BLandingPage',
      // ... mappings pour toutes les pages
    };
    
    return componentMapping[key] || `${key}Page`;
  }

  /**
   * Génère le résumé de validation
   */
  private generateSummary() {
    const summary = {
      total: this.results.length,
      valid: this.results.filter(r => r.status === 'valid').length,
      errors: this.results.filter(r => r.status === 'error').length,
      warnings: this.results.filter(r => r.status === 'warning').length
    };

    return summary;
  }

  /**
   * Affiche un rapport détaillé
   */
  generateReport(): string {
    const summary = this.generateSummary();
    
    let report = `
# 📊 RAPPORT DE VALIDATION DES ROUTES - EmotionsCare

## Résumé
- **Total des routes** : ${summary.total}
- **Routes valides** : ${summary.valid} ✅
- **Erreurs** : ${summary.errors} ❌
- **Avertissements** : ${summary.warnings} ⚠️
- **Taux de réussite** : ${Math.round((summary.valid / summary.total) * 100)}%

## Détails par statut

### ✅ Routes valides (${summary.valid})
${this.results
  .filter(r => r.status === 'valid')
  .map(r => `- ${r.path}`)
  .join('\n')}

### ❌ Erreurs (${summary.errors})
${this.results
  .filter(r => r.status === 'error')
  .map(r => `- ${r.path} : ${r.message}`)
  .join('\n')}

### ⚠️ Avertissements (${summary.warnings})
${this.results
  .filter(r => r.status === 'warning')
  .map(r => `- ${r.path} : ${r.message}`)
  .join('\n')}

---
Généré le ${new Date().toLocaleString('fr-FR')}
`;

    return report;
  }
}

// Instance globale du validateur
export const routeValidator = new RouteValidator();

// Fonction utilitaire pour validation rapide
export const validateRoutes = async () => {
  const result = await routeValidator.validateAllRoutes();
  console.log(routeValidator.generateReport());
  return result;
};

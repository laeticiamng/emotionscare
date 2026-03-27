// @ts-nocheck
/**
 * Validation avancée des routes pour RouterV2
 * TICKET: FE/BE-Router-Cleanup-01 - Validation 100%
 */

import { RouteMeta } from './schema';

// Types de validation
export type ValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
};

export type RouteValidationRule = {
  name: string;
  validate: (route: RouteMeta) => ValidationResult;
  level: 'error' | 'warning';
};

// Règles de validation
export const routeValidationRules: RouteValidationRule[] = [
  {
    name: 'unique-paths',
    level: 'error',
    validate: (route: RouteMeta) => {
      // Vérification de l'unicité des chemins (à implémenter avec le registre complet)
      return { isValid: true, errors: [], warnings: [] };
    }
  },
  {
    name: 'valid-components',
    level: 'error',
    validate: (route: RouteMeta) => {
      const errors: string[] = [];
      
      if (!route.component) {
        errors.push(`Route ${route.path}: Composant manquant`);
      } else if (!route.component.endsWith('Page')) {
        errors.push(`Route ${route.path}: Le composant devrait se terminer par 'Page'`);
      }
      
      return {
        isValid: errors.length === 0,
        errors,
        warnings: []
      };
    }
  },
  {
    name: 'authentication-consistency',
    level: 'error',
    validate: (route: RouteMeta) => {
      const errors: string[] = [];
      
      // Si requireAuth est true, il faut un rôle ou des rôles autorisés
      if (route.requireAuth && !route.role && !route.allowedRoles?.length) {
        errors.push(`Route ${route.path}: requireAuth=true mais aucun rôle défini`);
      }
      
      // Vérification de cohérence des rôles
      if (route.role && route.allowedRoles?.includes(route.role)) {
        errors.push(`Route ${route.path}: Rôle exclusif défini mais inclus dans allowedRoles`);
      }
      
      return {
        isValid: errors.length === 0,
        errors,
        warnings: []
      };
    }
  },
  {
    name: 'path-format',
    level: 'error',
    validate: (route: RouteMeta) => {
      const errors: string[] = [];
      const warnings: string[] = [];
      
      const isCatchAll = route.path === '*' || route.path === '/*';

      // Le chemin doit commencer par /
      if (!isCatchAll && !route.path.startsWith('/')) {
        errors.push(`Route ${route.name}: Le chemin doit commencer par '/'`);
      }

      // Pas de double slashes
      if (!isCatchAll && route.path.includes('//')) {
        errors.push(`Route ${route.name}: Double slashes détectés dans le chemin`);
      }
      
      // Convention de nommage
      if (route.path.includes('_')) {
        warnings.push(`Route ${route.name}: Utiliser des tirets plutôt que des underscores`);
      }
      
      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    }
  },
  {
    name: 'deprecated-routes',
    level: 'warning',
    validate: (route: RouteMeta) => {
      const warnings: string[] = [];
      
      if (route.deprecated) {
        warnings.push(`Route ${route.path}: Marquée comme dépréciée - prévoir la migration`);
      }
      
      return {
        isValid: true,
        errors: [],
        warnings
      };
    }
  },
  {
    name: 'security-patterns',
    level: 'warning',
    validate: (route: RouteMeta) => {
      const warnings: string[] = [];
      
      // Routes admin sans protection
      if (route.path.includes('/admin') && !route.requireAuth) {
        warnings.push(`Route ${route.path}: Route admin sans authentification requise`);
      }
      
      // Routes sensibles sans guard
      const sensitivePatterns = ['/settings', '/profile', '/admin', '/payment'];
      const isSensitive = sensitivePatterns.some(pattern => route.path.includes(pattern));
      
      if (isSensitive && !route.guard) {
        warnings.push(`Route ${route.path}: Route sensible sans guard de sécurité`);
      }
      
      return {
        isValid: true,
        errors: [],
        warnings
      };
    }
  }
];

// Validateur principal
export class RouteValidator {
  private static instance: RouteValidator;
  
  static getInstance(): RouteValidator {
    if (!RouteValidator.instance) {
      RouteValidator.instance = new RouteValidator();
    }
    return RouteValidator.instance;
  }

  // Valider une route individuelle
  validateRoute(route: RouteMeta): ValidationResult {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    for (const rule of routeValidationRules) {
      const result = rule.validate(route);
      allErrors.push(...result.errors);
      allWarnings.push(...result.warnings);
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings
    };
  }

  // Valider un registre complet de routes
  validateRegistry(routes: RouteMeta[]): ValidationResult {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    // Validation individuelle
    routes.forEach(route => {
      const result = this.validateRoute(route);
      allErrors.push(...result.errors);
      allWarnings.push(...result.warnings);
    });

    // Validations globales
    const globalResult = this.validateGlobalConstraints(routes);
    allErrors.push(...globalResult.errors);
    allWarnings.push(...globalResult.warnings);

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings
    };
  }

  // Validations globales sur l'ensemble des routes
  private validateGlobalConstraints(routes: RouteMeta[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Vérifier l'unicité des chemins
    const paths = routes.map(r => r.path);
    const duplicates = paths.filter((path, index) => paths.indexOf(path) !== index);
    
    if (duplicates.length > 0) {
      errors.push(`Chemins dupliqués détectés: ${duplicates.join(', ')}`);
    }

    // Vérifier l'unicité des noms
    const names = routes.map(r => r.name);
    const duplicateNames = names.filter((name, index) => names.indexOf(name) !== index);
    
    if (duplicateNames.length > 0) {
      errors.push(`Noms de routes dupliqués: ${duplicateNames.join(', ')}`);
    }

    // Vérifier les alias
    const aliases = routes.flatMap(r => r.aliases || []);
    const duplicateAliases = aliases.filter((alias, index) => aliases.indexOf(alias) !== index);
    
    if (duplicateAliases.length > 0) {
      warnings.push(`Alias dupliqués détectés: ${duplicateAliases.join(', ')}`);
    }

    // Vérifier la présence de routes essentielles
    const essentialRoutes = ['/', '/login', '/404'];
    const missingEssential = essentialRoutes.filter(
      essential => !paths.includes(essential)
    );
    
    if (missingEssential.length > 0) {
      errors.push(`Routes essentielles manquantes: ${missingEssential.join(', ')}`);
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  // Générer un rapport de validation
  generateValidationReport(routes: RouteMeta[]): string {
    const result = this.validateRegistry(routes);
    
    let report = `
## Rapport de Validation des Routes
Total routes: ${routes.length}
**Total routes:** ${routes.length}
**Status:** ${result.isValid ? '✅ Valide' : '❌ Erreurs détectées'}

`;

    if (result.errors.length > 0) {
      report += `
### ❌ Erreurs (${result.errors.length})
${result.errors.map(error => `- ${error}`).join('\n')}

`;
    }

    if (result.warnings.length > 0) {
      report += `
### ⚠️ Avertissements (${result.warnings.length})
${result.warnings.map(warning => `- ${warning}`).join('\n')}

`;
    }

    if (result.isValid && result.warnings.length === 0) {
      report += '✨ **Aucun problème détecté - Configuration parfaite!**\n';
    }

    return report;
  }
}

// Export des utilitaires
export const validator = RouteValidator.getInstance();

// Hook pour la validation en temps réel
export function useRouteValidation(routes: RouteMeta[]) {
  const validationResult = validator.validateRegistry(routes);
  
  return {
    isValid: validationResult.isValid,
    errors: validationResult.errors,
    warnings: validationResult.warnings,
    report: validator.generateValidationReport(routes)
  };
}
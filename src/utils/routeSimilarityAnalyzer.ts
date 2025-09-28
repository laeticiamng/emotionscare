/**
 * Analyseur de similarités et redondances dans les routes
 */

import { ROUTER_V2_MANIFEST } from '@/routerV2/manifest';

export interface SimilarityGroup {
  category: string;
  routes: string[];
  description: string;
  severity: 'info' | 'warning' | 'error';
}

export interface RouteAnalysis {
  functionalDuplicates: SimilarityGroup[];
  semanticSimilarities: SimilarityGroup[];
  potentialRedundancies: SimilarityGroup[];
  summary: {
    totalIssues: number;
    highPriority: number;
    recommendations: string[];
  };
}

/**
 * Extrait le nom de base d'une route (sans préfixes)
 */
function getRouteBaseName(route: string): string {
  return route.split('/').pop() || route;
}

/**
 * Extrait le contexte d'une route (b2c, b2b/user, b2b/admin)
 */
function getRouteContext(route: string): string {
  if (route.startsWith('/b2c/')) return 'b2c';
  if (route.startsWith('/b2b/user/')) return 'b2b_user';
  if (route.startsWith('/b2b/admin/')) return 'b2b_admin';
  return 'public';
}

/**
 * Groupe les routes par fonctionnalité
 */
function groupByFunctionality(): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  
  ROUTER_V2_MANIFEST.forEach(route => {
    const baseName = getRouteBaseName(route);
    if (!groups.has(baseName)) {
      groups.set(baseName, []);
    }
    groups.get(baseName)!.push(route);
  });
  
  return groups;
}

/**
 * Détecte les similarités sémantiques
 */
function findSemanticSimilarities(): SimilarityGroup[] {
  const similarities: SimilarityGroup[] = [];
  
  // Groupes sémantiquement similaires
  const semanticGroups = [
    {
      names: ['preferences', 'settings'],
      description: 'Configuration et préférences utilisateur',
      severity: 'warning' as const
    },
    {
      names: ['cocon', 'social-cocon'],
      description: 'Espaces sociaux et communautaires',
      severity: 'info' as const
    },
    {
      names: ['coach', 'coach-chat'],
      description: 'Fonctionnalités de coaching',
      severity: 'info' as const
    }
  ];
  
  semanticGroups.forEach(group => {
    const matchingRoutes = ROUTER_V2_MANIFEST.filter(route =>
      group.names.some(name => route.includes(name))
    );
    
    if (matchingRoutes.length > 1) {
      similarities.push({
        category: group.names.join(' / '),
        routes: matchingRoutes,
        description: group.description,
        severity: group.severity
      });
    }
  });
  
  return similarities;
}

/**
 * Détecte les doublons fonctionnels
 */
function findFunctionalDuplicates(): SimilarityGroup[] {
  const duplicates: SimilarityGroup[] = [];
  const groups = groupByFunctionality();
  
  groups.forEach((routes, functionality) => {
    if (routes.length > 1) {
      // Exclure les routes publiques des doublons
      const protectedRoutes = routes.filter(route => 
        !['/', '/choose-mode', '/b2b/selection'].includes(route)
      );
      
      if (protectedRoutes.length > 1) {
        const contexts = protectedRoutes.map(getRouteContext);
        const uniqueContexts = new Set(contexts);
        
        duplicates.push({
          category: functionality,
          routes: protectedRoutes,
          description: `Même fonctionnalité "${functionality}" dans ${uniqueContexts.size} contextes différents`,
          severity: uniqueContexts.size > 2 ? 'warning' : 'info'
        });
      }
    }
  });
  
  return duplicates;
}

/**
 * Détecte les redondances potentielles
 */
function findPotentialRedundancies(): SimilarityGroup[] {
  const redundancies: SimilarityGroup[] = [];
  
  // Routes avec objectifs potentiellement redondants
  const redundantPairs = [
    {
      pattern1: 'preferences',
      pattern2: 'settings',
      description: 'Préférences vs Paramètres - objectifs similaires'
    },
    {
      pattern1: 'cocon',
      pattern2: 'social-cocon',
      description: 'Cocon simple vs Social - possibilité de fusion'
    }
  ];
  
  redundantPairs.forEach(pair => {
    const routes1 = ROUTER_V2_MANIFEST.filter(route => route.includes(pair.pattern1));
    const routes2 = ROUTER_V2_MANIFEST.filter(route => route.includes(pair.pattern2));
    
    if (routes1.length > 0 && routes2.length > 0) {
      redundancies.push({
        category: `${pair.pattern1} / ${pair.pattern2}`,
        routes: [...routes1, ...routes2],
        description: pair.description,
        severity: 'warning'
      });
    }
  });
  
  return redundancies;
}

/**
 * Analyse complète des similarités de routes
 */
export function analyzeRouteSimilarities(): RouteAnalysis {
  const functionalDuplicates = findFunctionalDuplicates();
  const semanticSimilarities = findSemanticSimilarities();
  const potentialRedundancies = findPotentialRedundancies();
  
  const highPriority = [
    ...functionalDuplicates.filter(d => d.severity === 'error'),
    ...semanticSimilarities.filter(s => s.severity === 'error'),
    ...potentialRedundancies.filter(r => r.severity === 'error')
  ].length;
  
  const totalIssues = functionalDuplicates.length + semanticSimilarities.length + potentialRedundancies.length;
  
  const recommendations = [];
  
  if (potentialRedundancies.some(r => r.category.includes('preferences / settings'))) {
    recommendations.push('Considérer la fusion de "preferences" et "settings" en une seule page de configuration');
  }
  
  if (semanticSimilarities.some(s => s.category.includes('cocon'))) {
    recommendations.push('Évaluer si "cocon" et "social-cocon" peuvent être combinés');
  }
  
  if (functionalDuplicates.length > 5) {
    recommendations.push('Architecture multi-contexte justifiée pour les différents rôles utilisateur');
  }
  
  return {
    functionalDuplicates,
    semanticSimilarities,
    potentialRedundancies,
    summary: {
      totalIssues,
      highPriority,
      recommendations
    }
  };
}

// Exécuter l'analyse au chargement
const analysis = analyzeRouteSimilarities();
console.log('🔍 Analyse des similarités de routes:', analysis.summary);

export default analysis;
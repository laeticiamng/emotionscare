/**
 * Utilitaire pour valider l'unicité des routes
 */

import { ROUTE_MANIFEST } from '@/router/buildUnifiedRoutes';

export function findDuplicateRoutes(): string[] {
  const routeCounts = new Map<string, number>();
  const duplicates: string[] = [];

  // Compter les occurrences de chaque route
  ROUTE_MANIFEST.forEach(route => {
    const count = routeCounts.get(route) || 0;
    routeCounts.set(route, count + 1);
  });

  // Identifier les doublons
  routeCounts.forEach((count, route) => {
    if (count > 1) {
      duplicates.push(route);
    }
  });

  return duplicates;
}

export function validateRoutesUniqueness(): { 
  valid: boolean; 
  duplicates: string[]; 
  totalRoutes: number;
} {
  const duplicates = findDuplicateRoutes();
  
  return {
    valid: duplicates.length === 0,
    duplicates,
    totalRoutes: ROUTE_MANIFEST.length
  };
}

// Exécuter la validation au chargement
const validation = validateRoutesUniqueness();

if (!validation.valid) {
  console.error(`🚨 ROUTES DOUBLONNÉES DÉTECTÉES:`, validation.duplicates);
} else {
  console.log(`✅ Validation des routes: ${validation.totalRoutes} routes uniques`);
}

export default validation;
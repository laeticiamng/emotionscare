
/**
 * Utilitaire pour détecter et prévenir les doublons de composants
 */

export interface DuplicateCheckResult {
  hasDuplicates: boolean;
  duplicates: Array<{
    name: string;
    locations: string[];
  }>;
  suggestions: string[];
}

/**
 * Vérifie la présence de doublons dans les noms de composants
 */
export function checkForDuplicates(componentPaths: string[]): DuplicateCheckResult {
  const componentNames = new Map<string, string[]>();
  
  componentPaths.forEach(path => {
    const name = path.split('/').pop()?.replace(/\.(tsx?|jsx?)$/, '') || '';
    if (componentNames.has(name)) {
      componentNames.get(name)!.push(path);
    } else {
      componentNames.set(name, [path]);
    }
  });
  
  const duplicates = Array.from(componentNames.entries())
    .filter(([_, paths]) => paths.length > 1)
    .map(([name, locations]) => ({ name, locations }));
  
  const suggestions = duplicates.map(dup => 
    `Renommer ${dup.name} dans: ${dup.locations.join(', ')}`
  );
  
  return {
    hasDuplicates: duplicates.length > 0,
    duplicates,
    suggestions
  };
}

/**
 * Valide l'unicité des routes
 */
export function validateUniqueRoutes(routes: Record<string, string>): boolean {
  const routeValues = Object.values(routes);
  const uniqueRoutes = new Set(routeValues);
  
  if (routeValues.length !== uniqueRoutes.size) {
    console.error('❌ Doublons de routes détectés!');
    return false;
  }
  
  return true;
}

/**
 * Suggestions pour éviter les doublons futurs
 */
export const DUPLICATE_PREVENTION_GUIDELINES = {
  naming: {
    components: 'Utiliser des noms descriptifs et uniques (ex: UserDashboard, AdminDashboard)',
    files: 'Préfixer par le module (ex: auth/LoginForm, dashboard/UserStats)',
    routes: 'Utiliser des chemins hiérarchiques clairs (/b2c/dashboard, /b2b/admin/dashboard)'
  },
  structure: {
    pages: 'Organiser par rôle/module dans src/pages/',
    components: 'Grouper par fonctionnalité dans src/components/',
    utils: 'Un seul fichier utilitaire par concept'
  }
};

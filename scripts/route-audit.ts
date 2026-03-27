// @ts-nocheck
#!/usr/bin/env node

/**
 * Route Audit Script - RouterV2
 * TICKET: FE/BE-Router-Cleanup-01
 * 
 * Détecte les doublons, pages orphelines et problèmes de routing
 */

import { globby } from 'globby';
import path from 'path';
import fs from 'fs';
import { ROUTES_REGISTRY } from '../src/routerV2/registry.js';
import { ROUTE_ALIASES } from '../src/routerV2/aliases.js';

interface AuditResult {
  success: boolean;
  routesCount: number;
  pagesCount: number;
  duplicates: string[];
  orphanedPages: string[];
  missingComponents: string[];
  validationErrors: string[];
}

async function scanPagesDirectory(pagesDir: string): Promise<string[]> {
  const pageFiles = await globby([
    `${pagesDir}/**/*.tsx`,
    `${pagesDir}/**/*.ts`,
    `${pagesDir}/**/*.jsx`,
    `${pagesDir}/**/*.js`,
  ]);
  
  return pageFiles.map(file => path.relative(process.cwd(), file));
}

function validateRoutesRegistry(): string[] {
  const errors: string[] = [];
  const seenPaths = new Set<string>();
  const seenNames = new Set<string>();

  for (const route of ROUTES_REGISTRY) {
    // Validation des champs requis
    if (!route.name) errors.push(`Route sans nom: ${JSON.stringify(route)}`);
    if (!route.path) errors.push(`Route sans chemin: ${route.name}`);
    if (!route.component) errors.push(`Route sans composant: ${route.name}`);

    // Doublons de noms
    if (seenNames.has(route.name)) {
      errors.push(`Nom de route dupliqué: ${route.name}`);
    }
    seenNames.add(route.name);

    // Doublons de chemins
    if (seenPaths.has(route.path)) {
      errors.push(`Chemin de route dupliqué: ${route.path}`);
    }
    seenPaths.add(route.path);

    // Vérification des alias
    if (route.aliases) {
      for (const alias of route.aliases) {
        if (seenPaths.has(alias)) {
          errors.push(`Alias en conflit: ${alias} (route: ${route.name})`);
        }
        seenPaths.add(alias);
      }
    }

    // Validation des segments et rôles
    const validSegments = ['public', 'consumer', 'employee', 'manager'];
    if (!validSegments.includes(route.segment)) {
      errors.push(`Segment invalide '${route.segment}' pour route: ${route.name}`);
    }

    if (route.role) {
      const validRoles = ['consumer', 'employee', 'manager'];
      if (!validRoles.includes(route.role)) {
        errors.push(`Rôle invalide '${route.role}' pour route: ${route.name}`);
      }
    }
  }

  return errors;
}

function detectDuplicatePaths(): string[] {
  const pathCounts = new Map<string, number>();
  const duplicates: string[] = [];

  // Compter les chemins dans les routes principales
  for (const route of ROUTES_REGISTRY) {
    pathCounts.set(route.path, (pathCounts.get(route.path) || 0) + 1);
    
    if (route.aliases) {
      for (const alias of route.aliases) {
        pathCounts.set(alias, (pathCounts.get(alias) || 0) + 1);
      }
    }
  }

  // Compter les chemins dans les alias
  if (Array.isArray(ROUTE_ALIASES)) {
    for (const alias of ROUTE_ALIASES) {
      pathCounts.set(alias.from, (pathCounts.get(alias.from) || 0) + 1);
    }
  } else if (ROUTE_ALIASES && typeof ROUTE_ALIASES === 'object') {
    Object.entries(ROUTE_ALIASES).forEach(([from, to]) => {
      pathCounts.set(from, (pathCounts.get(from) || 0) + 1);
    });
  }

  // Identifier les doublons
  for (const [path, count] of pathCounts.entries()) {
    if (count > 1) {
      duplicates.push(path);
    }
  }

  return duplicates;
}

async function findOrphanedPages(pageFiles: string[]): Promise<string[]> {
  const referencedComponents = new Set<string>();
  
  // Collecter tous les composants référencés
  for (const route of ROUTES_REGISTRY) {
    referencedComponents.add(`src/pages/${route.component}.tsx`);
    referencedComponents.add(`src/pages/${route.component}.ts`);
    // Variantes possibles
    referencedComponents.add(`src/pages/${route.component}/index.tsx`);
    referencedComponents.add(`src/pages/${route.component}/index.ts`);
  }

  // Trouver les pages non référencées
  const orphans = pageFiles.filter(file => {
    // Ignorer les fichiers dans deprecated/
    if (file.includes('/deprecated/') || file.includes('\\deprecated\\')) {
      return false;
    }
    
    // Ignorer les fichiers de test
    if (file.includes('.test.') || file.includes('.spec.')) {
      return false;
    }

    // Vérifier si le fichier est référencé
    return !referencedComponents.has(file);
  });

  return orphans;
}

async function findMissingComponents(): Promise<string[]> {
  const missing: string[] = [];
  
  for (const route of ROUTES_REGISTRY) {
    const possiblePaths = [
      `src/pages/${route.component}.tsx`,
      `src/pages/${route.component}.ts`,
      `src/pages/${route.component}/index.tsx`,
      `src/pages/${route.component}/index.ts`,
    ];
    
    const exists = possiblePaths.some(p => fs.existsSync(p));
    if (!exists) {
      missing.push(`${route.name}: ${route.component} (cherché: ${possiblePaths[0]})`);
    }
  }

  return missing;
}

async function auditRoutes(): Promise<AuditResult> {
  console.log('🔍 AUDIT ROUTERV2 - Vérification complète');
  console.log('==========================================\n');

  try {
    // Scan des fichiers de pages
    const pageFiles = await scanPagesDirectory('src/pages');
    
    // Validations
    const validationErrors = validateRoutesRegistry();
    const duplicates = detectDuplicatePaths();
    const orphanedPages = await findOrphanedPages(pageFiles);
    const missingComponents = await findMissingComponents();

    const result: AuditResult = {
      success: validationErrors.length === 0 && duplicates.length === 0 && missingComponents.length === 0,
      routesCount: ROUTES_REGISTRY.length,
      pagesCount: pageFiles.length,
      duplicates,
      orphanedPages,
      missingComponents,
      validationErrors,
    };

    return result;
  } catch (error) {
    console.error('❌ Erreur lors de l\'audit:', error);
    return {
      success: false,
      routesCount: 0,
      pagesCount: 0,
      duplicates: [],
      orphanedPages: [],
      missingComponents: [],
      validationErrors: [`Erreur système: ${error}`],
    };
  }
}

async function main() {
  const result = await auditRoutes();

  // Affichage des résultats
  console.log(`📊 Résumé de l'audit:`);
  console.log(`   Routes configurées: ${result.routesCount}`);
  console.log(`   Pages trouvées: ${result.pagesCount}`);
  console.log(`   Alias configurés: ${Array.isArray(ROUTE_ALIASES) ? ROUTE_ALIASES.length : Object.keys(ROUTE_ALIASES || {}).length}`);
  console.log('');

  // Erreurs critiques (bloquantes)
  if (result.validationErrors.length > 0) {
    console.log('❌ ERREURS CRITIQUES (bloquantes):');
    result.validationErrors.forEach(error => console.log(`   • ${error}`));
    console.log('');
  }

  if (result.duplicates.length > 0) {
    console.log('❌ DOUBLONS DE CHEMINS (bloquants):');
    result.duplicates.forEach(dup => console.log(`   • ${dup}`));
    console.log('');
  }

  if (result.missingComponents.length > 0) {
    console.log('❌ COMPOSANTS MANQUANTS (bloquants):');
    result.missingComponents.forEach(missing => console.log(`   • ${missing}`));
    console.log('');
  }

  // Avertissements (non bloquants)
  if (result.orphanedPages.length > 0) {
    console.log('⚠️  PAGES ORPHELINES (non bloquant):');
    result.orphanedPages.forEach(orphan => console.log(`   • ${orphan}`));
    console.log('   → À déplacer dans src/deprecated/ ou supprimer');
    console.log('');
  }

  // Résultat final
  if (result.success) {
    console.log('✅ AUDIT RÉUSSI - RouterV2 est prêt !');
    process.exit(0);
  } else {
    console.log('💥 AUDIT ÉCHOUÉ - Corrigez les erreurs critiques avant de continuer');
    process.exit(1);
  }
}

// Exécution si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Erreur fatale:', error);
    process.exit(1);
  });
}

export { auditRoutes, type AuditResult };
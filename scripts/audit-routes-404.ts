// @ts-nocheck
#!/usr/bin/env tsx
/**
 * Script d'audit des routes 404 et pages non fonctionnelles
 * Vérifie l'intégrité du RouterV2
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface RouteIssue {
  routeName: string;
  path: string;
  component: string;
  issue: string;
  severity: 'critical' | 'warning' | 'info';
}

// Lire le registry
const registryPath = join(process.cwd(), 'src/routerV2/registry.ts');
const routerPath = join(process.cwd(), 'src/routerV2/router.tsx');
const pagesDir = join(process.cwd(), 'src/pages');

const registryContent = readFileSync(registryPath, 'utf-8');
const routerContent = readFileSync(routerPath, 'utf-8');

const issues: RouteIssue[] = [];

// Extraire les routes du registry
const routeRegex = /\{[^}]*name:\s*['"]([^'"]+)['"],[^}]*path:\s*['"]([^'"]+)['"],[^}]*component:\s*['"]([^'"]+)['"]/gs;
let match;
const routes: Array<{ name: string; path: string; component: string }> = [];

while ((match = routeRegex.exec(registryContent)) !== null) {
  routes.push({
    name: match[1],
    path: match[2],
    component: match[3],
  });
}

// Extraire le componentMap du router
const componentMapMatch = routerContent.match(/const componentMap[^{]*\{([^}]+(?:\}[^}]*)*)\}/s);
const componentMapContent = componentMapMatch ? componentMapMatch[1] : '';
const mappedComponents = new Set<string>();

// Extraire tous les composants mappés
const componentMappings = componentMapContent.matchAll(/(\w+):\s*(\w+)/g);
for (const mapping of componentMappings) {
  mappedComponents.add(mapping[1]); // Le nom de la clé dans le map
}

// Extraire les lazy imports
const lazyImports = new Set<string>();
const lazyRegex = /const\s+(\w+)\s*=\s*lazy\([^)]+\)/g;
while ((match = lazyRegex.exec(routerContent)) !== null) {
  lazyImports.add(match[1]);
}

console.log('🔍 AUDIT DES ROUTES - RouterV2\n');
console.log('═'.repeat(60));
console.log(`📊 Routes trouvées: ${routes.length}`);
console.log(`🗺️  Composants mappés: ${mappedComponents.size}`);
console.log(`📦 Lazy imports: ${lazyImports.size}`);
console.log('═'.repeat(60));
console.log();

// Vérifier chaque route
for (const route of routes) {
  // 1. Vérifier que le composant est dans le componentMap
  if (!mappedComponents.has(route.component)) {
    issues.push({
      routeName: route.name,
      path: route.path,
      component: route.component,
      issue: `Composant "${route.component}" manquant dans componentMap`,
      severity: 'critical',
    });
  }

  // 2. Vérifier que le composant a un lazy import
  if (!lazyImports.has(route.component)) {
    // Exceptions pour les composants spéciaux
    const isSpecialComponent = [
      'RedirectToScan',
      'RedirectToJournal',
      'RedirectToSocialCocon',
      'RedirectToEntreprise',
      'RedirectToMusic',
    ].includes(route.component);

    if (!isSpecialComponent) {
      issues.push({
        routeName: route.name,
        path: route.path,
        component: route.component,
        issue: `Composant "${route.component}" n'a pas de lazy import`,
        severity: 'warning',
      });
    }
  }

  // 3. Vérifier que le fichier de page existe (approximatif)
  const possiblePaths = [
    join(pagesDir, `${route.component}.tsx`),
    join(pagesDir, route.component, 'index.tsx'),
    join(pagesDir, route.component.replace(/Page$/, '') + '.tsx'),
  ];

  const fileExists = possiblePaths.some(p => existsSync(p));
  
  if (!fileExists && !mappedComponents.has(route.component)) {
    issues.push({
      routeName: route.name,
      path: route.path,
      component: route.component,
      issue: `Fichier de page introuvable pour "${route.component}"`,
      severity: 'critical',
    });
  }
}

// Afficher les résultats par sévérité
const critical = issues.filter(i => i.severity === 'critical');
const warnings = issues.filter(i => i.severity === 'warning');

console.log('🚨 PROBLÈMES CRITIQUES (404 attendus)\n');
if (critical.length === 0) {
  console.log('✅ Aucun problème critique détecté!\n');
} else {
  critical.forEach((issue, idx) => {
    console.log(`${idx + 1}. Route: ${issue.path}`);
    console.log(`   Nom: ${issue.routeName}`);
    console.log(`   Composant: ${issue.component}`);
    console.log(`   ❌ ${issue.issue}`);
    console.log();
  });
}

console.log('═'.repeat(60));
console.log('⚠️  AVERTISSEMENTS\n');
if (warnings.length === 0) {
  console.log('✅ Aucun avertissement!\n');
} else {
  warnings.forEach((issue, idx) => {
    console.log(`${idx + 1}. Route: ${issue.path}`);
    console.log(`   Composant: ${issue.component}`);
    console.log(`   ⚠️  ${issue.issue}`);
    console.log();
  });
}

console.log('═'.repeat(60));
console.log('\n📈 RÉSUMÉ:\n');
console.log(`Total routes analysées: ${routes.length}`);
console.log(`🚨 Problèmes critiques: ${critical.length}`);
console.log(`⚠️  Avertissements: ${warnings.length}`);
console.log(`✅ Routes OK: ${routes.length - critical.length - warnings.length}`);
console.log();

if (critical.length > 0) {
  console.log('🔧 ACTIONS RECOMMANDÉES:');
  console.log('1. Créer les pages manquantes');
  console.log('2. Ajouter les lazy imports dans router.tsx');
  console.log('3. Mapper les composants dans componentMap');
  console.log();
  process.exit(1);
} else {
  console.log('🎉 Tous les tests sont passés! RouterV2 est opérationnel.\n');
  process.exit(0);
}

// @ts-nocheck
#!/usr/bin/env tsx
/**
 * Vérification exhaustive route par route
 * Vérifie chaque chemin et sa page correspondante 1 à 1
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';

interface RouteCheck {
  name: string;
  path: string;
  component: string;
  segment: string;
  fileFound: boolean;
  filePath: string | null;
  lineCount: number;
  hasPageRoot: boolean;
  hasTitle: boolean;
  hasContent: boolean;
  isStub: boolean;
  status: 'ok' | 'warning' | 'error';
  issues: string[];
}

const pagesDir = join(process.cwd(), 'src/pages');
const registryPath = join(process.cwd(), 'src/routerV2/registry.ts');

console.log('🔍 VÉRIFICATION EXHAUSTIVE - ROUTES & PAGES 1 À 1');
console.log('═'.repeat(100));
console.log();

// Lire le registry
const registryContent = readFileSync(registryPath, 'utf-8');

// Parser le registry ligne par ligne pour extraire toutes les routes
const lines = registryContent.split('\n');
const routes: RouteCheck[] = [];

let currentRoute: Partial<RouteCheck> = {};
let inRouteBlock = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  // Détection début d'une route
  if (line === '{' && i > 0 && !inRouteBlock) {
    inRouteBlock = true;
    currentRoute = {};
    continue;
  }
  
  // Détection fin d'une route
  if (line === '},' && inRouteBlock) {
    if (currentRoute.name && currentRoute.path && currentRoute.component) {
      routes.push(currentRoute as RouteCheck);
    }
    inRouteBlock = false;
    currentRoute = {};
    continue;
  }
  
  if (inRouteBlock) {
    // Extraire name
    const nameMatch = line.match(/name:\s*['"]([^'"]+)['"]/);
    if (nameMatch) currentRoute.name = nameMatch[1];
    
    // Extraire path
    const pathMatch = line.match(/path:\s*['"]([^'"]+)['"]/);
    if (pathMatch) currentRoute.path = pathMatch[1];
    
    // Extraire component
    const componentMatch = line.match(/component:\s*['"]([^'"]+)['"]/);
    if (componentMatch) currentRoute.component = componentMatch[1];
    
    // Extraire segment
    const segmentMatch = line.match(/segment:\s*['"]([^'"]+)['"]/);
    if (segmentMatch) currentRoute.segment = segmentMatch[1];
  }
}

console.log(`📊 Total routes trouvées: ${routes.length}\n`);
console.log('═'.repeat(100));
console.log();

// Fonction pour trouver un fichier de page
function findPageFile(component: string): string | null {
  const possiblePaths = [
    join(pagesDir, `${component}.tsx`),
    join(pagesDir, `${component}.ts`),
    join(pagesDir, component, 'index.tsx'),
    join(pagesDir, component, 'page.tsx'),
    join(pagesDir, component.toLowerCase(), 'index.tsx'),
    join(pagesDir, component.replace(/Page$/, ''), 'index.tsx'),
    join(pagesDir, component.replace(/Page$/, '') + '.tsx'),
  ];

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  // Recherche récursive dans les sous-dossiers
  const searchInDir = (dir: string, depth = 0): string | null => {
    if (depth > 3) return null;
    
    try {
      const files = readdirSync(dir);
      
      for (const file of files) {
        const fullPath = join(dir, file);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          const found = searchInDir(fullPath, depth + 1);
          if (found) return found;
        } else if (file === `${component}.tsx` || file === `${component}.ts`) {
          return fullPath;
        }
      }
    } catch (e) {
      // Ignorer erreurs de lecture
    }
    
    return null;
  };

  return searchInDir(pagesDir);
}

// Analyser chaque route
let errorCount = 0;
let warningCount = 0;
let okCount = 0;

for (const route of routes) {
  const filePath = findPageFile(route.component);
  route.filePath = filePath;
  route.fileFound = filePath !== null;
  route.issues = [];
  
  if (!filePath) {
    route.status = 'error';
    route.lineCount = 0;
    route.hasPageRoot = false;
    route.hasTitle = false;
    route.hasContent = false;
    route.isStub = false;
    route.issues.push('❌ FICHIER INTROUVABLE');
    errorCount++;
  } else {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      route.lineCount = lines.length;
      route.hasPageRoot = /data-testid=["']page-root["']/.test(content);
      route.hasTitle = /<h1|<title|document\.title/.test(content);
      route.hasContent = lines.length > 50 && /<div|<section|<main|<Card/.test(content);
      route.isStub = /TODO|Coming soon|Placeholder|En construction|STUB|PLACEHOLDER/.test(content);
      
      // Déterminer le statut
      if (!route.hasPageRoot) route.issues.push('⚠️ Manque data-testid="page-root"');
      if (!route.hasTitle) route.issues.push('⚠️ Manque titre');
      if (!route.hasContent) route.issues.push('⚠️ Contenu insuffisant');
      if (route.isStub) route.issues.push('🚧 Stub/Placeholder détecté');
      if (route.lineCount < 50) route.issues.push(`📏 Trop court (${route.lineCount} lignes)`);
      
      if (route.issues.length === 0) {
        route.status = 'ok';
        okCount++;
      } else if (route.issues.length > 2 || route.lineCount < 30) {
        route.status = 'warning';
        warningCount++;
      } else {
        route.status = 'ok';
        okCount++;
      }
    } catch (e) {
      route.status = 'error';
      route.lineCount = 0;
      route.hasPageRoot = false;
      route.hasTitle = false;
      route.hasContent = false;
      route.isStub = false;
      route.issues.push('❌ Erreur lecture fichier');
      errorCount++;
    }
  }
}

// Afficher les résultats groupés par statut
console.log('❌ PAGES AVEC ERREURS (Fichier introuvable ou illisible)\n');
const errors = routes.filter(r => r.status === 'error');
if (errors.length === 0) {
  console.log('✅ Aucune erreur!\n');
} else {
  errors.forEach((route, idx) => {
    console.log(`${idx + 1}. ${route.path}`);
    console.log(`   Composant: ${route.component}`);
    console.log(`   Segment: ${route.segment || 'N/A'}`);
    route.issues.forEach(issue => console.log(`   ${issue}`));
    console.log();
  });
}

console.log('═'.repeat(100));
console.log();
console.log('⚠️  PAGES AVEC AVERTISSEMENTS (Contenu à améliorer)\n');
const warnings = routes.filter(r => r.status === 'warning');
if (warnings.length === 0) {
  console.log('✅ Aucun avertissement!\n');
} else {
  warnings.forEach((route, idx) => {
    console.log(`${idx + 1}. ${route.path}`);
    console.log(`   Composant: ${route.component}`);
    console.log(`   Fichier: ${route.filePath ? basename(route.filePath) : 'N/A'}`);
    console.log(`   Lignes: ${route.lineCount}`);
    console.log(`   Segment: ${route.segment || 'N/A'}`);
    route.issues.forEach(issue => console.log(`   ${issue}`));
    console.log();
  });
}

console.log('═'.repeat(100));
console.log();
console.log('✅ PAGES COMPLÈTES ET FONCTIONNELLES\n');
const ok = routes.filter(r => r.status === 'ok');
console.log(`${ok.length} pages sont en bon état (${Math.round((ok.length / routes.length) * 100)}%)\n`);

// Afficher un échantillon des pages OK
if (ok.length > 0) {
  console.log('Échantillon des pages complètes:');
  ok.slice(0, 15).forEach((route, idx) => {
    console.log(`  ${idx + 1}. ${route.path.padEnd(40)} (${route.component}, ${route.lineCount} lignes)`);
  });
  if (ok.length > 15) {
    console.log(`  ... et ${ok.length - 15} autres pages complètes`);
  }
  console.log();
}

console.log('═'.repeat(100));
console.log();
console.log('📊 RÉSUMÉ FINAL\n');
console.log(`Total routes:           ${routes.length}`);
console.log(`✅ Pages OK:            ${okCount} (${Math.round((okCount / routes.length) * 100)}%)`);
console.log(`⚠️  Pages à améliorer:   ${warningCount} (${Math.round((warningCount / routes.length) * 100)}%)`);
console.log(`❌ Pages en erreur:     ${errorCount} (${Math.round((errorCount / routes.length) * 100)}%)`);
console.log();

// Statistiques par segment
console.log('📈 STATISTIQUES PAR SEGMENT:\n');
const segments = [...new Set(routes.map(r => r.segment || 'N/A'))];
segments.forEach(segment => {
  const segmentRoutes = routes.filter(r => (r.segment || 'N/A') === segment);
  const segmentOk = segmentRoutes.filter(r => r.status === 'ok').length;
  const segmentWarning = segmentRoutes.filter(r => r.status === 'warning').length;
  const segmentError = segmentRoutes.filter(r => r.status === 'error').length;
  
  console.log(`${segment.padEnd(15)} - Total: ${segmentRoutes.length.toString().padStart(3)}`);
  console.log(`                  OK: ${segmentOk.toString().padStart(3)} | ⚠️ : ${segmentWarning.toString().padStart(3)} | ❌: ${segmentError.toString().padStart(3)}`);
  console.log();
});

// Générer un rapport JSON
const report = {
  date: new Date().toISOString(),
  totalRoutes: routes.length,
  ok: okCount,
  warnings: warningCount,
  errors: errorCount,
  routes: routes.map(r => ({
    name: r.name,
    path: r.path,
    component: r.component,
    segment: r.segment,
    status: r.status,
    fileFound: r.fileFound,
    lineCount: r.lineCount,
    issues: r.issues,
  })),
};

const reportPath = join(process.cwd(), 'scripts/routes/VERIFICATION_REPORT.json');
require('fs').writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`📄 Rapport détaillé sauvegardé: ${reportPath}\n`);

console.log('═'.repeat(100));
console.log();

// Recommandations
if (errorCount > 0) {
  console.log('🚨 ACTIONS URGENTES:\n');
  console.log(`1. Créer ou corriger les ${errorCount} pages en erreur`);
  console.log('2. Vérifier les chemins de fichiers dans le componentMap');
  console.log('3. S\'assurer que tous les composants sont exportés\n');
}

if (warningCount > 0) {
  console.log('📝 ACTIONS RECOMMANDÉES:\n');
  console.log(`1. Enrichir les ${warningCount} pages avec avertissements`);
  console.log('2. Ajouter data-testid="page-root" partout');
  console.log('3. Compléter les stubs et placeholders');
  console.log('4. Viser minimum 80 lignes par page\n');
}

console.log('✨ PROCHAINES ÉTAPES:\n');
console.log('• Consulter le rapport JSON pour détails complets');
console.log('• Prioriser corrections par segment (public, consumer, etc.)');
console.log('• Utiliser pages exemplaires comme templates');
console.log('• Ajouter tests E2E pour pages critiques\n');

// Code de sortie
if (errorCount > 0) {
  console.log('❌ ÉCHEC: Pages critiques manquantes');
  process.exit(1);
} else if (warningCount > routes.length * 0.3) {
  console.log('⚠️  ATTENTION: Plus de 30% des pages nécessitent amélioration');
  process.exit(0);
} else {
  console.log('✅ SUCCÈS: Toutes les pages principales sont présentes!');
  process.exit(0);
}

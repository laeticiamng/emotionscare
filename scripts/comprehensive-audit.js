const fs = require('fs');
const path = require('path');

console.log('=== AUDIT COMPLET EMOTIONSCARE - ANALYSE GITHUB + LOCAL ===\n');

// 1. Lire le registry pour tous les composants déclarés
const registryPath = path.join(__dirname, '../src/routerV2/registry.ts');
const registryContent = fs.readFileSync(registryPath, 'utf8');

// Extraire TOUS les composants déclarés
const componentMatches = registryContent.match(/component: '([^']+)'/g) || [];
const declaredComponents = componentMatches
  .map(match => match.replace(/component: '|'/g, ''))
  .filter((comp, index, arr) => arr.indexOf(comp) === index)
  .sort();

console.log(`📊 COMPOSANTS DÉCLARÉS DANS REGISTRY: ${declaredComponents.length}`);

// 2. Scanner TOUS les fichiers dans src/pages (récursif)
function scanAllPages(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanAllPages(fullPath, files);
    } else if (item.endsWith('.tsx') && !item.includes('.test.') && !item.includes('.stories.')) {
      const componentName = path.basename(item, '.tsx');
      if (componentName.match(/^[A-Z][a-zA-Z0-9]*$/)) {
        const relativePath = path.relative(path.join(__dirname, '../src'), fullPath);
        files.push({
          name: componentName,
          path: relativePath,
          directory: path.dirname(relativePath),
          fullPath: fullPath
        });
      }
    }
  }
  
  return files;
}

const pagesDir = path.join(__dirname, '../src/pages');
const existingFiles = scanAllPages(pagesDir);
const existingComponents = existingFiles.map(f => f.name);

console.log(`📁 COMPOSANTS EXISTANTS: ${existingComponents.length}`);

// 3. Lire le router.ts pour voir les mappings
const routerPath = path.join(__dirname, '../src/routerV2/router.ts');
const routerContent = fs.readFileSync(routerPath, 'utf8');

// Extraire les imports lazy
const lazyImportMatches = routerContent.match(/const ([A-Z][a-zA-Z0-9]*) = lazy\(/g) || [];
const lazyImported = lazyImportMatches
  .map(match => match.replace(/const |lazy\(| = /g, '').trim())
  .sort();

console.log(`🗺️ COMPOSANTS LAZY IMPORTED: ${lazyImported.length}`);

// Extraire le componentMap
const componentMapStart = routerContent.indexOf('const componentMap = {');
const componentMapEnd = routerContent.indexOf('};', componentMapStart);
const componentMapContent = routerContent.substring(componentMapStart, componentMapEnd + 2);
const mappedComponents = [];

// Parser le componentMap de façon plus robuste
const mapLines = componentMapContent.split('\n');
for (const line of mapLines) {
  const match = line.trim().match(/^([A-Z][a-zA-Z0-9]*): .+/);
  if (match) {
    mappedComponents.push(match[1]);
  }
}

console.log(`🎯 COMPOSANTS MAPPÉS: ${mappedComponents.length}`);

// 4. Analyse des écarts
const analysis = {
  // Composants déclarés mais fichiers manquants
  missingFiles: declaredComponents.filter(comp => !existingComponents.includes(comp)),
  
  // Composants existants mais non déclarés dans registry
  undeclared: existingComponents.filter(comp => !declaredComponents.includes(comp)),
  
  // Composants déclarés mais non mappés dans router
  unmapped: declaredComponents.filter(comp => !mappedComponents.includes(comp)),
  
  // Composants mappés mais fichiers manquants
  mappedMissing: mappedComponents.filter(comp => !existingComponents.includes(comp)),
  
  // Composants avec imports lazy mais pas mappés
  lazyNotMapped: lazyImported.filter(comp => !mappedComponents.includes(comp)),
  
  // Doublons potentiels
  duplicates: []
};

// Détecter les doublons
const componentGroups = {};
existingComponents.forEach(comp => {
  const normalized = comp.replace(/^B2C|^B2B|Page$/g, '').toLowerCase();
  if (!componentGroups[normalized]) componentGroups[normalized] = [];
  componentGroups[normalized].push(comp);
});

Object.entries(componentGroups).forEach(([base, comps]) => {
  if (comps.length > 1) {
    analysis.duplicates.push({ base, components: comps });
  }
});

// 5. Analyse spécifique par catégories
const categoryAnalysis = {
  auth: declaredComponents.filter(c => c.toLowerCase().includes('login') || c.toLowerCase().includes('signup')),
  dashboards: declaredComponents.filter(c => c.toLowerCase().includes('dashboard')),
  settings: declaredComponents.filter(c => c.toLowerCase().includes('settings') || c.toLowerCase().includes('profile')),
  b2c: declaredComponents.filter(c => c.startsWith('B2C')),
  b2b: declaredComponents.filter(c => c.startsWith('B2B')),
  legal: declaredComponents.filter(c => c.toLowerCase().includes('legal')),
  errors: declaredComponents.filter(c => c.toLowerCase().includes('error') || c.toLowerCase().includes('unauthorized')),
  vr: declaredComponents.filter(c => c.toLowerCase().includes('vr')),
  music: declaredComponents.filter(c => c.toLowerCase().includes('music')),
  coach: declaredComponents.filter(c => c.toLowerCase().includes('coach'))
};

// 6. Affichage des résultats
console.log(`\n🎯 ANALYSE DÉTAILLÉE:`);
console.log(`✅ Composants fonctionnels: ${declaredComponents.length - analysis.missingFiles.length}/${declaredComponents.length}`);
console.log(`❌ Fichiers manquants: ${analysis.missingFiles.length}`);
console.log(`🔄 Non déclarés: ${analysis.undeclared.length}`);
console.log(`🗺️ Non mappés: ${analysis.unmapped.length}`);
console.log(`⚠️ Mappés mais fichiers manquants: ${analysis.mappedMissing.length}`);
console.log(`🔍 Doublons détectés: ${analysis.duplicates.length}`);

console.log(`\n❌ COMPOSANTS CRITIQUES MANQUANTS (${analysis.missingFiles.length}):`);
analysis.missingFiles.forEach((comp, i) => {
  console.log(`${i + 1}. ${comp}`);
});

if (analysis.mappedMissing.length > 0) {
  console.log(`\n⚠️ MAPPÉS MAIS FICHIERS MANQUANTS (CRITIQUE):`);
  analysis.mappedMissing.forEach((comp, i) => {
    console.log(`${i + 1}. ${comp}`);
  });
}

if (analysis.unmapped.length > 0) {
  console.log(`\n🗺️ DÉCLARÉS MAIS NON MAPPÉS (${analysis.unmapped.length}):`);
  analysis.unmapped.slice(0, 10).forEach((comp, i) => {
    console.log(`${i + 1}. ${comp}`);
  });
  if (analysis.unmapped.length > 10) {
    console.log(`... et ${analysis.unmapped.length - 10} autres`);
  }
}

if (analysis.duplicates.length > 0) {
  console.log(`\n🔍 DOUBLONS À FUSIONNER:`);
  analysis.duplicates.forEach((dup, i) => {
    console.log(`${i + 1}. ${dup.base}: ${dup.components.join(', ')}`);
  });
}

console.log(`\n📋 ANALYSE PAR CATÉGORIES:`);
Object.entries(categoryAnalysis).forEach(([category, components]) => {
  const missing = components.filter(c => analysis.missingFiles.includes(c));
  console.log(`${category.toUpperCase()}: ${components.length - missing.length}/${components.length} (${missing.length} manquants)`);
});

// 7. Priorisation des créations
const priorities = {
  critical: analysis.missingFiles.filter(c => 
    c.includes('Dashboard') || 
    c.includes('Login') || 
    c.includes('Error') ||
    c.includes('Page') && (c.includes('B2C') || c.includes('B2B'))
  ),
  important: analysis.missingFiles.filter(c => 
    c.includes('Settings') ||
    c.includes('Profile') ||
    c.includes('Legal') ||
    c.includes('VR') ||
    c.includes('Coach')
  ),
  nice: analysis.missingFiles.filter(c => 
    !c.includes('Dashboard') && 
    !c.includes('Login') && 
    !c.includes('Error') &&
    !c.includes('Settings') &&
    !c.includes('Profile')
  )
};

console.log(`\n📊 PRIORITÉS DE CRÉATION:`);
console.log(`🔴 CRITIQUES: ${priorities.critical.length}`);
console.log(`🟡 IMPORTANTES: ${priorities.important.length}`);
console.log(`🟢 OPTIONNELLES: ${priorities.nice.length}`);

// 8. Générer le rapport final
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    declared: declaredComponents.length,
    existing: existingComponents.length,
    mapped: mappedComponents.length,
    lazyImported: lazyImported.length,
    missingFiles: analysis.missingFiles.length,
    undeclared: analysis.undeclared.length,
    unmapped: analysis.unmapped.length,
    mappedMissing: analysis.mappedMissing.length,
    duplicates: analysis.duplicates.length,
    coverage: Math.round(((declaredComponents.length - analysis.missingFiles.length) / declaredComponents.length) * 100)
  },
  analysis: analysis,
  categories: categoryAnalysis,
  priorities: priorities,
  existingFiles: existingFiles,
  recommendations: [
    `Créer ${analysis.missingFiles.length} composants manquants`,
    `Mapper ${analysis.unmapped.length} composants non mappés`,
    `Résoudre ${analysis.mappedMissing.length} composants mappés mais fichiers manquants`,
    `Fusionner ${analysis.duplicates.length} groupes de doublons`
  ]
};

// Sauvegarder
const reportPath = path.join(__dirname, '../comprehensive-audit-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(`\n📄 RAPPORT COMPLET: comprehensive-audit-report.json`);

// Recommandations finales
console.log(`\n🚀 RECOMMANDATIONS PRIORITAIRES:`);
if (analysis.mappedMissing.length > 0) {
  console.log(`1. 🔥 URGENT: Créer les ${analysis.mappedMissing.length} composants mappés mais manquants`);
}
if (priorities.critical.length > 0) {
  console.log(`2. 🔴 Créer les ${priorities.critical.length} composants critiques`);
}
if (analysis.unmapped.length > 0) {
  console.log(`3. 🗺️ Mapper les ${analysis.unmapped.length} composants non mappés`);
}
if (analysis.duplicates.length > 0) {
  console.log(`4. 🔍 Fusionner les ${analysis.duplicates.length} doublons détectés`);
}

console.log(`\n✨ ROUTERV2 COVERAGE: ${report.summary.coverage}%`);
if (report.summary.coverage >= 95) {
  console.log('🎉 EXCELLENT - RouterV2 presque complet!');
} else if (report.summary.coverage >= 85) {
  console.log('👍 BON - RouterV2 largement fonctionnel');
} else if (report.summary.coverage >= 70) {
  console.log('⚠️ MOYEN - RouterV2 partiellement fonctionnel');
} else {
  console.log('🚨 CRITIQUE - RouterV2 nécessite du travail');
}
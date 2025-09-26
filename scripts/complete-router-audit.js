const fs = require('fs');
const path = require('path');

console.log('=== AUDIT COMPLET ROUTERV2 - EMOTIONSCARE ===\n');

// Lire le registry pour extraire tous les composants déclarés
const registryPath = path.join(__dirname, '../src/routerV2/registry.ts');
const registryContent = fs.readFileSync(registryPath, 'utf8');

// Extraire les composants avec regex plus précise
const componentMatches = registryContent.match(/component: '([^']+)'/g) || [];
const declaredComponents = componentMatches
  .map(match => match.replace(/component: '|'/g, ''))
  .filter((comp, index, arr) => arr.indexOf(comp) === index) // Déduplication
  .sort();

console.log(`📊 COMPOSANTS DÉCLARÉS DANS REGISTRY: ${declaredComponents.length}`);

// Scanner récursivement src/pages pour trouver tous les fichiers
function scanPagesDirectory(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanPagesDirectory(fullPath, files);
    } else if (item.endsWith('.tsx') && !item.includes('.test.') && !item.includes('.stories.')) {
      // Extraire le nom du composant du fichier
      const componentName = path.basename(item, '.tsx');
      if (componentName.match(/^[A-Z][a-zA-Z0-9]*$/)) { // PascalCase seulement
        files.push({
          name: componentName,
          path: path.relative(path.join(__dirname, '../src'), fullPath),
          fullPath: fullPath
        });
      }
    }
  }
  
  return files;
}

const pagesDir = path.join(__dirname, '../src/pages');
const existingFiles = scanPagesDirectory(pagesDir);
const existingComponents = existingFiles.map(f => f.name).sort();

console.log(`📁 COMPOSANTS EXISTANTS DANS src/pages: ${existingComponents.length}`);

// Analyse détaillée
const analysis = {
  declared: declaredComponents,
  existing: existingComponents,
  missing: declaredComponents.filter(comp => !existingComponents.includes(comp)),
  orphaned: existingComponents.filter(comp => !declaredComponents.includes(comp)),
  matched: declaredComponents.filter(comp => existingComponents.includes(comp))
};

console.log(`\n🎯 RÉSULTATS ANALYSE:`);
console.log(`✅ Composants trouvés: ${analysis.matched.length}/${declaredComponents.length} (${Math.round(analysis.matched.length/declaredComponents.length*100)}%)`);
console.log(`❌ Composants manquants: ${analysis.missing.length}`);
console.log(`🔄 Composants orphelins: ${analysis.orphaned.length}`);

console.log(`\n❌ COMPOSANTS MANQUANTS CRITIQUES:`);
analysis.missing.forEach((comp, index) => {
  console.log(`${index + 1}. ${comp}`);
});

console.log(`\n🔄 COMPOSANTS ORPHELINS (non déclarés dans registry):`);
analysis.orphaned.slice(0, 10).forEach((comp, index) => {
  console.log(`${index + 1}. ${comp}`);
});
if (analysis.orphaned.length > 10) {
  console.log(`... et ${analysis.orphaned.length - 10} autres`);
}

// Analyser les doublons potentiels
const potentialDuplicates = [];
const componentGroups = {};

analysis.existing.forEach(comp => {
  const baseName = comp.replace(/^B2C|^B2B|Page$/, '').toLowerCase();
  if (!componentGroups[baseName]) {
    componentGroups[baseName] = [];
  }
  componentGroups[baseName].push(comp);
});

Object.entries(componentGroups).forEach(([base, comps]) => {
  if (comps.length > 1) {
    potentialDuplicates.push({ base, components: comps });
  }
});

console.log(`\n🔍 DOUBLONS POTENTIELS DÉTECTÉS:`);
potentialDuplicates.forEach((dup, index) => {
  console.log(`${index + 1}. ${dup.base}: ${dup.components.join(', ')}`);
});

// Catégoriser les composants manquants par priorité
const criticalMissing = analysis.missing.filter(comp => 
  comp.includes('Dashboard') || 
  comp.includes('Login') || 
  comp.includes('Error') || 
  comp.includes('Landing') ||
  comp.includes('Gateway') ||
  comp.includes('Redirect')
);

const functionalMissing = analysis.missing.filter(comp => 
  !criticalMissing.includes(comp) && (
    comp.includes('Page') ||
    comp.includes('B2C') ||
    comp.includes('B2B')
  )
);

const utilityMissing = analysis.missing.filter(comp => 
  !criticalMissing.includes(comp) && 
  !functionalMissing.includes(comp)
);

console.log(`\n📋 PRIORITÉS DE CRÉATION:`);
console.log(`🔴 CRITIQUES (${criticalMissing.length}): ${criticalMissing.join(', ')}`);
console.log(`🟡 FONCTIONNELS (${functionalMissing.length}): ${functionalMissing.slice(0, 5).join(', ')}${functionalMissing.length > 5 ? '...' : ''}`);
console.log(`🟢 UTILITAIRES (${utilityMissing.length}): ${utilityMissing.slice(0, 5).join(', ')}${utilityMissing.length > 5 ? '...' : ''}`);

// Sauvegarder le rapport
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    declared: declaredComponents.length,
    existing: existingComponents.length,
    missing: analysis.missing.length,
    orphaned: analysis.orphaned.length,
    coverage: Math.round(analysis.matched.length/declaredComponents.length*100)
  },
  missing: analysis.missing,
  orphaned: analysis.orphaned,
  duplicates: potentialDuplicates,
  priorities: {
    critical: criticalMissing,
    functional: functionalMissing,
    utility: utilityMissing
  }
};

fs.writeFileSync(
  path.join(__dirname, '../router-audit-complete.json'),
  JSON.stringify(report, null, 2)
);

console.log(`\n📄 Rapport complet sauvegardé: router-audit-complete.json`);
console.log(`\n🚀 PRÊT POUR LA CRÉATION DES COMPOSANTS MANQUANTS!`);
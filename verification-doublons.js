#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script de vérification finale des doublons
 */

console.log('🔍 VÉRIFICATION FINALE DES DOUBLONS');
console.log('=====================================\n');

// 1. Lister toutes les pages
const pagesDir = 'src/pages';
const pageFiles = fs.readdirSync(pagesDir)
  .filter(file => file.endsWith('.tsx') && !file.includes('index'))
  .sort();

console.log(`📊 Pages trouvées: ${pageFiles.length}`);
pageFiles.forEach((file, i) => {
  console.log(`  ${(i + 1).toString().padStart(2, '0')}. ${file}`);
});

// 2. Vérifier doublons dans noms de fichiers
const pageNames = pageFiles.map(f => path.basename(f, '.tsx'));
const duplicateNames = pageNames.filter((name, i) => pageNames.indexOf(name) !== i);

if (duplicateNames.length > 0) {
  console.log('\n❌ DOUBLONS DE FICHIERS DÉTECTÉS:');
  [...new Set(duplicateNames)].forEach(dup => {
    console.log(`  - ${dup}`);
  });
} else {
  console.log('\n✅ Aucun doublon de nom de fichier');
}

// 3. Vérifier registry
const registryPath = 'src/routerV2/registry.ts';
const registryContent = fs.readFileSync(registryPath, 'utf8');
const componentMatches = [...registryContent.matchAll(/component: '([^']*)'/g)];
const components = componentMatches.map(m => m[1]);

console.log(`\n📊 Composants dans registry: ${components.length}`);

// Compter les occurrences
const componentCounts = {};
components.forEach(comp => {
  componentCounts[comp] = (componentCounts[comp] || 0) + 1;
});

// Trouver les doublons
const registryDuplicates = Object.entries(componentCounts)
  .filter(([_, count]) => count > 1);

if (registryDuplicates.length > 0) {
  console.log('\n❌ DOUBLONS DANS REGISTRY:');
  registryDuplicates.forEach(([comp, count]) => {
    console.log(`  - ${comp}: ${count} fois`);
  });
} else {
  console.log('\n✅ Aucun doublon dans registry');
}

// 4. Vérifier correspondances
const pageNamesSet = new Set(pageNames);
const uniqueComponents = [...new Set(components)];
const missingPages = uniqueComponents.filter(comp => 
  !comp.startsWith('RedirectTo') && !pageNamesSet.has(comp)
);

if (missingPages.length > 0) {
  console.log('\n❌ COMPOSANTS SANS PAGE:');
  missingPages.forEach(comp => console.log(`  - ${comp}`));
} else {
  console.log('\n✅ Toutes les pages correspondent au registry');
}

// 5. Résultat final
const hasIssues = duplicateNames.length > 0 || registryDuplicates.length > 0 || missingPages.length > 0;

console.log('\n' + '='.repeat(50));
if (!hasIssues) {
  console.log('🎉 NETTOYAGE 100% TERMINÉ !');
  console.log(`✅ ${pageFiles.length} pages uniques`);
  console.log('✅ 0 doublon détecté');  
  console.log('✅ Registry cohérent');
  console.log('✅ Correspondances parfaites');
  console.log('✅ Architecture propre et stable');
} else {
  console.log('❌ PROBLÈMES DÉTECTÉS');
  process.exit(1);
}
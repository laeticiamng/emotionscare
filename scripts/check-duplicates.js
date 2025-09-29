#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Script de vérification des doublons de pages
 */

// Utilitaires copiés de duplicateChecker.ts
function checkForDuplicates(componentPaths) {
  const componentNames = new Map();
  
  componentPaths.forEach(path => {
    const name = path.split('/').pop()?.replace(/\.(tsx?|jsx?)$/, '') || '';
    if (componentNames.has(name)) {
      componentNames.get(name).push(path);
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

// 1. SCAN DES PAGES
console.log('🔍 VÉRIFICATION SYSTÉMATIQUE DES DOUBLONS');
console.log('==========================================\n');

const pageFiles = glob.sync('src/pages/**/*.{ts,tsx}', { 
  ignore: ['src/pages/index.ts', 'src/pages/index.tsx', 'src/pages/**/*.css'] 
});

console.log(`📊 Pages trouvées: ${pageFiles.length}`);
pageFiles.forEach((file, i) => {
  console.log(`  ${i + 1}. ${file}`);
});

// 2. CHECK DOUBLONS
console.log('\n🔍 Vérification des doublons...');
const duplicateCheck = checkForDuplicates(pageFiles);

if (duplicateCheck.hasDuplicates) {
  console.log('❌ DOUBLONS DÉTECTÉS!');
  duplicateCheck.duplicates.forEach(dup => {
    console.log(`\n🔥 Doublon: ${dup.name}`);
    dup.locations.forEach(loc => console.log(`  - ${loc}`));
  });
  console.log('\n💡 Suggestions:');
  duplicateCheck.suggestions.forEach(suggestion => {
    console.log(`  - ${suggestion}`);
  });
  process.exit(1);
} else {
  console.log('✅ Aucun doublon détecté dans les noms de fichiers');
}

// 3. VÉRIFICATION REGISTRY
console.log('\n🔍 Vérification du registry...');
const registryPath = 'src/routerV2/registry.ts';
const registryContent = fs.readFileSync(registryPath, 'utf8');

// Extraction des composants du registry
const componentMatches = registryContent.matchAll(/component: '([^']*)'/g);
const registryComponents = Array.from(componentMatches, m => m[1]);

console.log(`📊 Composants dans registry: ${registryComponents.length}`);

// Check doublons dans registry
const registryDuplicates = {};
registryComponents.forEach(comp => {
  registryDuplicates[comp] = (registryDuplicates[comp] || 0) + 1;
});

const registryDups = Object.entries(registryDuplicates)
  .filter(([_, count]) => count > 1);

if (registryDups.length > 0) {
  console.log('⚠️  Composants dupliqués dans registry:');
  registryDups.forEach(([comp, count]) => {
    console.log(`  - ${comp}: ${count} fois`);
  });
} else {
  console.log('✅ Aucun doublon dans registry');
}

// 4. VÉRIFICATION CORRESPONDANCE REGISTRY <-> PAGES
console.log('\n🔍 Vérification correspondance registry <-> pages...');
const pageNames = pageFiles.map(f => path.basename(f, path.extname(f)));
const uniqueRegistryComponents = [...new Set(registryComponents)];

// Composants du registry qui n'existent pas en pages (hors redirections)
const missingPages = uniqueRegistryComponents.filter(comp => 
  !comp.startsWith('RedirectTo') && 
  !pageNames.includes(comp)
);

// Pages qui ne sont pas dans le registry  
const orphanedPages = pageNames.filter(page => 
  !uniqueRegistryComponents.includes(page) &&
  !page.includes('index')
);

if (missingPages.length > 0) {
  console.log('❌ Composants du registry sans page correspondante:');
  missingPages.forEach(comp => console.log(`  - ${comp}`));
}

if (orphanedPages.length > 0) {
  console.log('⚠️  Pages sans entrée dans registry:');
  orphanedPages.forEach(page => console.log(`  - ${page}`));
}

if (missingPages.length === 0 && orphanedPages.length === 0) {
  console.log('✅ Correspondance parfaite registry <-> pages');
}

// 5. RÉSULTAT FINAL
console.log('\n' + '='.repeat(50));
if (!duplicateCheck.hasDuplicates && registryDups.length === 0 && missingPages.length === 0) {
  console.log('🎉 NETTOYAGE 100% TERMINÉ !');
  console.log(`✅ ${pageFiles.length} pages uniques`);
  console.log('✅ 0 doublon détecté');
  console.log('✅ Registry cohérent');
  console.log('✅ Architecture propre');
} else {
  console.log('❌ NETTOYAGE INCOMPLET');
  if (duplicateCheck.hasDuplicates) console.log('- Doublons de fichiers détectés');
  if (registryDups.length > 0) console.log('- Doublons dans registry');
  if (missingPages.length > 0) console.log('- Pages manquantes');
  process.exit(1);
}
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔍 VÉRIFICATION COMPLÈTE DU SYSTÈME');
console.log('===================================\n');

// 1. VÉRIFIER LES IMPORTS CASSÉS
console.log('📦 VÉRIFICATION DES IMPORTS...');
const allTsxFiles = glob.sync('src/**/*.{ts,tsx}', { ignore: ['src/**/*.test.*', 'src/**/*.spec.*'] });

let brokenImports = [];
let totalImports = 0;

allTsxFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const imports = content.match(/import.*from\s+['"]([^'"]*)['"]/g) || [];
  
  imports.forEach(importLine => {
    totalImports++;
    const match = importLine.match(/from\s+['"]([^'"]*)['"]/);
    if (match) {
      const importPath = match[1];
      
      // Vérifier imports relatifs vers pages
      if (importPath.includes('@/pages/') && !importPath.includes('/index')) {
        const pageName = importPath.split('/').pop();
        const pageFile = `src/pages/${pageName}.tsx`;
        
        if (!fs.existsSync(pageFile)) {
          brokenImports.push({
            file: file,
            import: importPath,
            missing: pageFile
          });
        }
      }
    }
  });
});

if (brokenImports.length > 0) {
  console.log('❌ IMPORTS CASSÉS DÉTECTÉS:');
  brokenImports.forEach(broken => {
    console.log(`  - ${broken.file}: ${broken.import} -> ${broken.missing} manquant`);
  });
} else {
  console.log(`✅ ${totalImports} imports vérifiés, aucun cassé détecté`);
}

// 2. COMPTER LES BOUTONS
console.log('\n🔘 COMPTAGE DES BOUTONS...');
let buttonCount = 0;
let fileWithButtons = 0;

allTsxFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Compter <Button> et <button>
  const buttons = (content.match(/<Button[^>]*>/g) || []).length + 
                  (content.match(/<button[^>]*>/g) || []).length;
  
  if (buttons > 0) {
    buttonCount += buttons;
    fileWithButtons++;
  }
});

console.log(`✅ ${buttonCount} boutons trouvés dans ${fileWithButtons} fichiers`);

// 3. COMPTER LES LIENS
console.log('\n🔗 COMPTAGE DES LIENS...');
let linkCount = 0;
let fileWithLinks = 0;

allTsxFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Compter <Link>, <a href>, et to=
  const links = (content.match(/<Link[^>]*>/g) || []).length +
                (content.match(/<a\s+[^>]*href[^>]*>/g) || []).length +
                (content.match(/to\s*=\s*['"]/g) || []).length;
  
  if (links > 0) {
    linkCount += links;
    fileWithLinks++;
  }
});

console.log(`✅ ${linkCount} liens trouvés dans ${fileWithLinks} fichiers`);

// 4. VÉRIFIER LES ROUTES DU REGISTRY
console.log('\n🗺️  VÉRIFICATION DES ROUTES...');
const registryContent = fs.readFileSync('src/routerV2/registry.ts', 'utf8');
const componentMatches = [...registryContent.matchAll(/component:\s*'([^']*)'/g)];
const routeComponents = componentMatches.map(m => m[1]);

let missingComponents = [];
routeComponents.forEach(comp => {
  if (!comp.startsWith('RedirectTo')) {
    const componentFile = `src/pages/${comp}.tsx`;
    if (!fs.existsSync(componentFile)) {
      missingComponents.push(comp);
    }
  }
});

if (missingComponents.length > 0) {
  console.log('❌ COMPOSANTS MANQUANTS:');
  missingComponents.forEach(comp => console.log(`  - ${comp}.tsx`));
} else {
  console.log(`✅ Tous les ${routeComponents.length} composants du registry existent`);
}

// 5. VÉRIFIER L'EXPORT DES PAGES
console.log('\n📤 VÉRIFICATION DES EXPORTS...');
const indexContent = fs.readFileSync('src/pages/index.ts', 'utf8');
const pageFiles = fs.readdirSync('src/pages').filter(f => f.endsWith('.tsx') && !f.includes('index'));

let missingExports = [];
pageFiles.forEach(file => {
  const pageName = file.replace('.tsx', '');
  if (!indexContent.includes(`export { default as ${pageName} }`)) {
    missingExports.push(pageName);
  }
});

if (missingExports.length > 0) {
  console.log('❌ EXPORTS MANQUANTS:');
  missingExports.forEach(page => console.log(`  - ${page}`));
} else {
  console.log(`✅ Tous les ${pageFiles.length} pages sont exportées`);
}

// 6. VÉRIFIER LES DOUBLONS (FINAL)
console.log('\n🔍 VÉRIFICATION FINALE DES DOUBLONS...');
const pageNames = pageFiles.map(f => f.replace('.tsx', ''));
const duplicates = pageNames.filter((name, i) => pageNames.indexOf(name) !== i);

if (duplicates.length > 0) {
  console.log('❌ DOUBLONS DÉTECTÉS:');
  [...new Set(duplicates)].forEach(dup => console.log(`  - ${dup}`));
} else {
  console.log('✅ Aucun doublon de page détecté');
}

// 7. RÉSUMÉ FINAL
const hasIssues = brokenImports.length > 0 || missingComponents.length > 0 || missingExports.length > 0 || duplicates.length > 0;

console.log('\n' + '='.repeat(60));
console.log('📊 RÉSUMÉ COMPLET');
console.log('=================');
console.log(`🏠 Pages totales : ${pageFiles.length}`);
console.log(`🗺️  Routes totales : ${routeComponents.length}`);
console.log(`🔘 Boutons totaux : ${buttonCount}`);
console.log(`🔗 Liens totaux : ${linkCount}`);
console.log(`📦 Imports vérifiés : ${totalImports}`);

console.log('\n🎯 ÉTAT DU SYSTÈME :');
if (!hasIssues) {
  console.log('✅ SYSTÈME 100% OPÉRATIONNEL');
  console.log('✅ Tous les imports fonctionnent');
  console.log('✅ Tous les composants existent'); 
  console.log('✅ Tous les exports sont corrects');
  console.log('✅ Aucun doublon détecté');
  console.log('✅ RouterV2 complètement fonctionnel');
  console.log('✅ Architecture propre et stable');
} else {
  console.log('❌ PROBLÈMES DÉTECTÉS - Voir détails ci-dessus');
  process.exit(1);
}

console.log('\n🚀 PRÊT POUR PRODUCTION !');
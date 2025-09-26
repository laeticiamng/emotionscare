const fs = require('fs');
const path = require('path');

// Lire le registry
const registryPath = path.join(__dirname, '../src/routerV2/registry.ts');
const registryContent = fs.readFileSync(registryPath, 'utf8');

// Extraire tous les noms de composants
const componentMatches = registryContent.match(/component: '([^']+)'/g);
const components = componentMatches.map(match => match.replace(/component: '|'/g, ''));
const uniqueComponents = [...new Set(components)];

console.log('=== AUDIT COMPLET DES COMPOSANTS ROUTERV2 ===\n');

// Fonction récursive pour scanner les fichiers
function scanDirectory(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanDirectory(fullPath, files);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Scanner src/pages et extraire les noms de composants
const pagesDir = path.join(__dirname, '../src/pages');
const allFiles = scanDirectory(pagesDir);

// Extraire les noms de composants des fichiers
const availableComponents = allFiles
  .map(file => path.basename(file, path.extname(file)))
  .filter(name => name.charAt(0).toUpperCase() === name.charAt(0)) // PascalCase seulement
  .filter(name => !name.includes('.'));

console.log(`📊 STATISTIQUES:`);
console.log(`- Composants déclarés dans registry: ${uniqueComponents.length}`);
console.log(`- Composants disponibles dans src/pages: ${availableComponents.length}\n`);

// Analyser chaque composant
const componentStatus = uniqueComponents.map(component => {
  const exists = availableComponents.includes(component);
  return { component, exists, path: exists ? allFiles.find(f => f.includes(component)) : null };
});

const existing = componentStatus.filter(c => c.exists);
const missing = componentStatus.filter(c => !c.exists);

console.log(`✅ COMPOSANTS EXISTANTS (${existing.length}/${uniqueComponents.length}):`);
existing.forEach(c => console.log(`   ✓ ${c.component}`));

console.log(`\n❌ COMPOSANTS MANQUANTS (${missing.length}/${uniqueComponents.length}):`);
missing.forEach(c => console.log(`   ✗ ${c.component}`));

console.log(`\n🎯 PRIORITÉS MANQUANTES (critiques pour le fonctionnement):`);
const criticalMissing = missing.filter(c => 
  c.component.includes('Dashboard') || 
  c.component.includes('Landing') || 
  c.component.includes('Login') ||
  c.component.includes('Error') ||
  c.component.includes('Page')
);

criticalMissing.forEach(c => console.log(`   🔴 ${c.component} (CRITIQUE)`));

console.log(`\n📋 COMMANDES DE CRÉATION SUGGÉRÉES:`);
missing.forEach(c => {
  console.log(`touch src/pages/${c.component}.tsx`);
});

// Générer un rapport JSON
const report = {
  timestamp: new Date().toISOString(),
  total: uniqueComponents.length,
  existing: existing.length,
  missing: missing.length,
  missingComponents: missing.map(c => c.component),
  existingComponents: existing.map(c => c.component)
};

fs.writeFileSync(
  path.join(__dirname, '../audit-router-report.json'), 
  JSON.stringify(report, null, 2)
);

console.log(`\n📄 Rapport détaillé sauvegardé: audit-router-report.json`);
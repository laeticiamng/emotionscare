const fs = require('fs');
const path = require('path');

// Lire la registry
const registryPath = path.join(__dirname, '../src/routerV2/registry.ts');
const registryContent = fs.readFileSync(registryPath, 'utf8');

// Extraire tous les noms de composants
const componentMatches = registryContent.match(/component: '([^']+)'/g);
const components = componentMatches.map(match => match.replace(/component: '|'/g, ''));
const uniqueComponents = [...new Set(components)];

// Vérifier quels composants existent
const pagesDir = path.join(__dirname, '../src/pages');
const existingFiles = fs.readdirSync(pagesDir, { recursive: true });

const componentStatus = uniqueComponents.map(component => {
  const exists = existingFiles.some(file => 
    file.endsWith('.tsx') && file.includes(component)
  );
  return { component, exists };
});

console.log('=== ANALYSE DES COMPOSANTS ROUTERV2 ===\n');
console.log(`Total composants déclarés: ${uniqueComponents.length}`);

const existing = componentStatus.filter(c => c.exists);
const missing = componentStatus.filter(c => !c.exists);

console.log(`Composants existants: ${existing.length}`);
console.log(`Composants manquants: ${missing.length}\n`);

console.log('COMPOSANTS MANQUANTS:');
missing.forEach(c => console.log(`❌ ${c.component}`));

console.log('\nCOMPOSANTS EXISTANTS:');
existing.forEach(c => console.log(`✅ ${c.component}`));
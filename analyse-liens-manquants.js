#!/usr/bin/env node

const fs = require('fs');
const glob = require('glob');

console.log('🔍 ANALYSE DES LIENS MANQUANTS');
console.log('================================\n');

// 1. Extraire tous les liens du code
const allFiles = glob.sync('src/**/*.{ts,tsx}', { ignore: ['src/**/*.test.*', 'src/**/*.spec.*'] });
const allLinks = new Set();

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Extraire les liens navigate('/...')
  const navigateMatches = content.match(/navigate\(['"][^'"]*['"]/g) || [];
  navigateMatches.forEach(match => {
    const path = match.match(/navigate\(['"]([^'"]*)['"]/)[1];
    if (path.startsWith('/')) allLinks.add(path);
  });
  
  // Extraire les liens to="/..."
  const toMatches = content.match(/to\s*=\s*['"][^'"]*['"]/g) || [];
  toMatches.forEach(match => {
    const path = match.match(/to\s*=\s*['"]([^'"]*)['"]/)[1];
    if (path.startsWith('/')) allLinks.add(path);
  });
  
  // Extraire les liens href="/..."
  const hrefMatches = content.match(/href\s*=\s*['"][^'"]*['"]/g) || [];
  hrefMatches.forEach(match => {
    const path = match.match(/href\s*=\s*['"]([^'"]*)['"]/)[1];
    if (path.startsWith('/')) allLinks.add(path);
  });
});

console.log(`📊 Total des liens uniques trouvés : ${allLinks.size}`);

// 2. Lire les routes du registry
const registryContent = fs.readFileSync('src/routerV2/registry.ts', 'utf8');
const registryRoutes = new Set();

// Extraire les paths du registry
const pathMatches = registryContent.match(/path:\s*['"][^'"]*['"]/g) || [];
pathMatches.forEach(match => {
  const path = match.match(/path:\s*['"]([^'"]*)['"]/)[1];
  registryRoutes.add(path);
});

// 3. Identifier les liens manquants
const missingRoutes = [];
const existingRoutes = [];
const dynamicRoutes = [];

Array.from(allLinks).sort().forEach(link => {
  // Ignorer les liens avec des paramètres ou des ancres
  const cleanLink = link.split('?')[0].split('#')[0];
  
  if (registryRoutes.has(cleanLink) || registryRoutes.has('*')) {
    existingRoutes.push(link);
  } else if (cleanLink.includes(':') || cleanLink.includes('*')) {
    dynamicRoutes.push(link);
  } else {
    missingRoutes.push(cleanLink);
  }
});

console.log(`\n✅ Routes existantes : ${existingRoutes.length}`);
console.log(`🔗 Routes dynamiques : ${dynamicRoutes.length}`);
console.log(`❌ Routes manquantes : ${missingRoutes.length}`);

if (missingRoutes.length > 0) {
  console.log('\n🚨 ROUTES MANQUANTES À CRÉER :');
  const uniqueMissing = [...new Set(missingRoutes)].sort();
  uniqueMissing.forEach((route, i) => {
    console.log(`  ${(i + 1).toString().padStart(2, '0')}. ${route}`);
  });
}

// 4. Analyser les Routes.* helpers
const helpersContent = fs.readFileSync('src/routerV2/helpers.ts', 'utf8');
const helperRoutes = new Set();

// Extraire les routes des helpers
const helperMatches = helpersContent.match(/:\s*\(\)\s*=>\s*['"][^'"]*['"]/g) || [];
helperMatches.forEach(match => {
  const path = match.match(/=>\s*['"]([^'"]*)['"]/)[1];
  helperRoutes.add(path);
});

console.log(`\n📋 Routes définies dans helpers.ts : ${helperRoutes.size}`);

// Comparer helpers vs registry
const helpersMissing = [];
Array.from(helperRoutes).forEach(route => {
  if (!registryRoutes.has(route)) {
    helpersMissing.push(route);
  }
});

if (helpersMissing.length > 0) {
  console.log('\n⚠️  HELPERS SANS ROUTE REGISTRY :');
  helpersMissing.sort().forEach((route, i) => {
    console.log(`  ${(i + 1).toString().padStart(2, '0')}. ${route}`);
  });
}

console.log('\n' + '='.repeat(50));
console.log('📋 RÉSUMÉ DES ACTIONS NÉCESSAIRES :');
console.log(`• ${uniqueMissing?.length || 0} pages à créer`);
console.log(`• ${helpersMissing?.length || 0} routes à ajouter au registry`);
console.log('• Vérifier la cohérence helpers ↔ registry');
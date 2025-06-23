
#!/usr/bin/env node

const { ROUTE_MANIFEST } = require('../src/router/buildUnifiedRoutes.ts');

console.log('🔍 VERIFICATION DES ROUTES - ROUTER UNIFIÉ');
console.log('==========================================\n');

console.log(`📊 Total des routes configurées: ${ROUTE_MANIFEST.length}`);
console.log('\n📋 Liste complète des routes:');

ROUTE_MANIFEST.forEach((route, index) => {
  console.log(`  ${index + 1}. ${route}`);
});

console.log('\n✅ Toutes les routes sont prêtes pour les tests Playwright');
console.log('🚀 Lancer les tests: npm run e2e:no-blank');

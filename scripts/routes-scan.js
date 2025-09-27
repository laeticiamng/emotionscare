
#!/usr/bin/env node

/**
 * Script de scan des routes - Vérification du manifeste vs pages existantes
 * Usage: node scripts/routes-scan.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ROUTES:SCAN - Vérification du manifeste officiel...\n');

// Import du manifeste
const manifestPath = path.join(__dirname, '../src/routesManifest.ts');
if (!fs.existsSync(manifestPath)) {
  console.error('❌ ERREUR: routesManifest.ts non trouvé');
  process.exit(1);
}

// Lecture du manifeste (simple parsing pour ce script)
const manifestContent = fs.readFileSync(manifestPath, 'utf8');
const routeMatches = manifestContent.match(/['"](\/[^'"]*)['"]/g);
const manifestRoutes = routeMatches 
  ? routeMatches.map(r => r.replace(/['"]/g, ''))
  : [];

console.log(`📋 Manifeste: ${manifestRoutes.length} routes définies`);

// Scan des pages existantes
const pagesDir = path.join(__dirname, '../src/pages');
const existingPages = [];

if (fs.existsSync(pagesDir)) {
  const files = fs.readdirSync(pagesDir);
  files.forEach(file => {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      existingPages.push(file.replace(/\.(tsx?|jsx?)$/, ''));
    }
  });
}

console.log(`📁 Pages existantes: ${existingPages.length} fichiers\n`);

// Analyse des manquantes
const missingPages = [];
const routeToPageMap = {
  '/': 'HomePage',
  '/choose-mode': 'ChooseModePage',
  '/scan': 'ScanPage',
  '/music': 'MusicPage',
  '/b2c/dashboard': 'B2CDashboardPage',
  '/b2b/admin/dashboard': 'B2BAdminDashboardPage',
  // Mapping pour les autres routes...
};

manifestRoutes.forEach(route => {
  const expectedPage = routeToPageMap[route] || 
    route.split('/').filter(p => p).map(p => 
      p.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
    ).join('') + 'Page';
  
  if (!existingPages.includes(expectedPage.replace('Page', ''))) {
    missingPages.push({ route, expectedPage });
  }
});

// Génération automatique des stubs manquants
if (missingPages.length > 0) {
  console.log(`🏗️  Génération de ${missingPages.length} stubs manquants...\n`);
  
  missingPages.forEach(({ route, expectedPage }) => {
    const stubContent = `import React from 'react';

interface ${expectedPage}Props {}

const ${expectedPage}: React.FC<${expectedPage}Props> = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            ${route === '/' ? 'Accueil EmotionsCare' : 
              route.split('/').pop()?.split('-').map(w => 
                w.charAt(0).toUpperCase() + w.slice(1)
              ).join(' ') || 'Page'}
          </h1>
          <p className="text-gray-600">
            Cette page est en cours de développement. Fonctionnalités à venir.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
              <div className="text-center text-purple-600">
                ✨ Fonctionnalités premium à venir
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ${expectedPage};
`;

    const filePath = path.join(pagesDir, `${expectedPage}.tsx`);
    fs.writeFileSync(filePath, stubContent);
    console.log(`  ✅ Créé: ${expectedPage}.tsx`);
  });
}

// Rapport final
console.log('\n📊 RAPPORT ROUTES:SCAN');
console.log('=====================');
console.log(`✅ Routes manifeste: ${manifestRoutes.length}/52`);
console.log(`✅ Pages existantes: ${existingPages.length + missingPages.length}`);
console.log(`🏗️  Stubs créés: ${missingPages.length}`);

const orphanPages = existingPages.filter(page => 
  !manifestRoutes.some(route => {
    const expectedPage = routeToPageMap[route] || 
      route.split('/').filter(p => p).map(p => 
        p.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
      ).join('') + 'Page';
    return expectedPage.includes(page);
  })
);

if (orphanPages.length > 0) {
  console.log(`⚠️  Pages orphelines: ${orphanPages.length}`);
  orphanPages.forEach(page => console.log(`    - ${page}`));
}

const success = missingPages.length === 0 && orphanPages.length === 0;
console.log(`\n${success ? '🟢' : '🟡'} Status: ${success ? 'PASSED' : 'WARNINGS'}`);

if (!success) {
  console.log('\n💡 Actions recommandées:');
  if (missingPages.length > 0) {
    console.log(`  - ${missingPages.length} stubs ont été générés automatiquement`);
  }
  if (orphanPages.length > 0) {
    console.log(`  - Vérifier ${orphanPages.length} pages orphelines`);
  }
}

process.exit(success ? 0 : 1);

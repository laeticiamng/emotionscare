
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 AUDIT COMPLET - APPLICATION EMOTIONSCARE');
console.log('=============================================\n');

// Fonction utilitaire pour scanner les fichiers
function scanDirectory(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  const files = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        files.push(...scanDirectory(fullPath, extensions));
      } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`⚠️ Erreur lors du scan de ${dir}: ${error.message}`);
  }
  return files;
}

// 1. AUDIT DES ROUTES
console.log('📍 1. AUDIT DES ROUTES');
console.log('=====================');

const routeFiles = [
  'src/utils/routeUtils.ts',
  'src/router/buildUnifiedRoutes.tsx',
  'src/router/index.tsx'
];

let routesScore = 100;
const routeIssues = [];

routeFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    console.log(`✅ ${file} - Présent`);
    
    // Vérifier la présence de UNIFIED_ROUTES
    if (file.includes('routeUtils') && content.includes('UNIFIED_ROUTES')) {
      console.log('  ✅ UNIFIED_ROUTES défini');
    }
    
    // Vérifier la fonction de validation
    if (file.includes('routeUtils') && content.includes('validateUniqueRoutes')) {
      console.log('  ✅ Validation d\'unicité présente');
    }
  } else {
    console.log(`❌ ${file} - Manquant`);
    routeIssues.push(`Fichier manquant: ${file}`);
    routesScore -= 20;
  }
});

console.log(`Score Routes: ${routesScore}/100\n`);

// 2. AUDIT DES PAGES
console.log('📄 2. AUDIT DES PAGES');
console.log('====================');

const pageDirectories = [
  'src/pages',
  'src/components/dashboard',
  'src/components/auth'
];

let pagesFound = 0;
let pagesScore = 100;

pageDirectories.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = scanDirectory(dir);
    const pageFiles = files.filter(f => 
      f.includes('Page.tsx') || 
      f.includes('Dashboard.tsx') || 
      f.includes('Login') || 
      f.includes('Register')
    );
    pagesFound += pageFiles.length;
    console.log(`✅ ${dir} - ${pageFiles.length} pages trouvées`);
  } else {
    console.log(`⚠️ ${dir} - Répertoire non trouvé`);
    pagesScore -= 10;
  }
});

console.log(`Pages totales trouvées: ${pagesFound}`);
console.log(`Score Pages: ${pagesScore}/100\n`);

// 3. AUDIT DES COMPOSANTS
console.log('🧩 3. AUDIT DES COMPOSANTS');
console.log('==========================');

const componentFiles = scanDirectory('src/components');
const criticalComponents = [
  'UnifiedNavigation',
  'ProtectedRoute',
  'ErrorBoundary',
  'ThemeProvider',
  'AuthFlow'
];

let componentsScore = 100;
const componentIssues = [];

console.log(`Composants totaux: ${componentFiles.length}`);

criticalComponents.forEach(component => {
  const found = componentFiles.some(file => file.includes(component));
  if (found) {
    console.log(`✅ ${component} - Présent`);
  } else {
    console.log(`❌ ${component} - Manquant`);
    componentIssues.push(`Composant critique manquant: ${component}`);
    componentsScore -= 15;
  }
});

console.log(`Score Composants: ${componentsScore}/100\n`);

// 4. AUDIT DES DOUBLONS
console.log('🔍 4. AUDIT DES DOUBLONS');
console.log('========================');

const allFiles = scanDirectory('src');
const fileNames = new Map();
let duplicatesFound = 0;

allFiles.forEach(file => {
  const name = path.basename(file, path.extname(file));
  if (fileNames.has(name)) {
    fileNames.get(name).push(file);
  } else {
    fileNames.set(name, [file]);
  }
});

const duplicates = Array.from(fileNames.entries())
  .filter(([_, paths]) => paths.length > 1);

duplicatesFound = duplicates.length;

if (duplicatesFound === 0) {
  console.log('✅ Aucun doublon détecté');
} else {
  console.log(`❌ ${duplicatesFound} doublons détectés:`);
  duplicates.forEach(([name, paths]) => {
    console.log(`  - ${name}: ${paths.join(', ')}`);
  });
}

const duplicatesScore = duplicatesFound === 0 ? 100 : Math.max(0, 100 - (duplicatesFound * 10));
console.log(`Score Doublons: ${duplicatesScore}/100\n`);

// 5. AUDIT DE LA CONFIGURATION
console.log('⚙️ 5. AUDIT DE LA CONFIGURATION');
console.log('================================');

const configFiles = [
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'tailwind.config.js'
];

let configScore = 100;

configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - Présent`);
  } else {
    console.log(`❌ ${file} - Manquant`);
    configScore -= 25;
  }
});

console.log(`Score Configuration: ${configScore}/100\n`);

// 6. AUDIT DE SÉCURITÉ
console.log('🛡️ 6. AUDIT DE SÉCURITÉ');
console.log('=======================');

const securityFiles = [
  'src/lib/security',
  'src/utils/productionSecurity.ts',
  'src/components/security'
];

let securityScore = 100;

securityFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - Présent`);
  } else {
    console.log(`⚠️ ${file} - Non trouvé`);
    securityScore -= 15;
  }
});

// Vérifier les variables d'environnement
const envExample = fs.existsSync('.env.example');
console.log(`${envExample ? '✅' : '❌'} .env.example - ${envExample ? 'Présent' : 'Manquant'}`);

console.log(`Score Sécurité: ${securityScore}/100\n`);

// 7. CALCUL DU SCORE GLOBAL
console.log('📊 RÉSUMÉ DE L\'AUDIT');
console.log('====================');

const globalScore = Math.round(
  (routesScore + pagesScore + componentsScore + duplicatesScore + configScore + securityScore) / 6
);

console.log(`📍 Routes: ${routesScore}/100`);
console.log(`📄 Pages: ${pagesScore}/100`);
console.log(`🧩 Composants: ${componentsScore}/100`);
console.log(`🔍 Doublons: ${duplicatesScore}/100`);
console.log(`⚙️ Configuration: ${configScore}/100`);
console.log(`🛡️ Sécurité: ${securityScore}/100`);
console.log(`\n🎯 SCORE GLOBAL: ${globalScore}/100`);

// Recommandations
console.log(`\n💡 RECOMMANDATIONS`);
console.log(`==================`);

if (routeIssues.length > 0) {
  console.log('Routes:');
  routeIssues.forEach(issue => console.log(`  - ${issue}`));
}

if (componentIssues.length > 0) {
  console.log('Composants:');
  componentIssues.forEach(issue => console.log(`  - ${issue}`));
}

if (duplicatesFound > 0) {
  console.log('Doublons:');
  console.log('  - Nettoyer les fichiers dupliqués');
  console.log('  - Vérifier les imports');
}

if (globalScore >= 90) {
  console.log('\n🚀 APPLICATION PRÊTE POUR LA PRODUCTION');
} else if (globalScore >= 80) {
  console.log('\n⚠️ QUELQUES AMÉLIORATIONS NÉCESSAIRES');
} else {
  console.log('\n❌ CORRECTIONS IMPORTANTES REQUISES');
}

// Sauvegarde du rapport
const auditReport = {
  timestamp: new Date().toISOString(),
  globalScore,
  details: {
    routes: { score: routesScore, issues: routeIssues },
    pages: { score: pagesScore, count: pagesFound },
    components: { score: componentsScore, issues: componentIssues },
    duplicates: { score: duplicatesScore, count: duplicatesFound },
    configuration: { score: configScore },
    security: { score: securityScore }
  },
  recommendations: [
    ...routeIssues,
    ...componentIssues,
    ...(duplicatesFound > 0 ? ['Nettoyer les doublons'] : [])
  ]
};

fs.writeFileSync('audit-report-complete.json', JSON.stringify(auditReport, null, 2));
console.log('\n📄 Rapport sauvegardé dans audit-report-complete.json');

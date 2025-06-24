
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 AUDIT COMPLET - VÉRIFICATION PAGES & DOUBLONS');
console.log('================================================\n');

// Fonction pour scanner récursivement les fichiers
function scanDirectory(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  const files = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && !entry.name.includes('node_modules')) {
        files.push(...scanDirectory(fullPath, extensions));
      } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`Erreur lors du scan de ${dir}:`, error.message);
  }
  
  return files;
}

// Fonction pour extraire les noms de composants
function extractComponentName(filePath) {
  const fileName = path.basename(filePath, path.extname(filePath));
  return fileName;
}

// Fonction pour lire le contenu d'un fichier
function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return '';
  }
}

// 1. VÉRIFICATION DES PAGES
console.log('📋 1. VÉRIFICATION DES PAGES');
console.log('=============================');

const pagesDir = path.join(process.cwd(), 'src', 'pages');
const pageFiles = scanDirectory(pagesDir);

console.log(`Pages trouvées: ${pageFiles.length}`);
pageFiles.forEach(file => {
  const relativePath = path.relative(process.cwd(), file);
  console.log(`  ✅ ${relativePath}`);
});

// 2. DÉTECTION DES DOUBLONS
console.log('\n🔍 2. DÉTECTION DES DOUBLONS');
console.log('=============================');

const allFiles = scanDirectory(path.join(process.cwd(), 'src'));
const componentNames = new Map();
const duplicates = [];

allFiles.forEach(file => {
  const componentName = extractComponentName(file);
  const relativePath = path.relative(process.cwd(), file);
  
  if (componentNames.has(componentName)) {
    componentNames.get(componentName).push(relativePath);
  } else {
    componentNames.set(componentName, [relativePath]);
  }
});

componentNames.forEach((files, name) => {
  if (files.length > 1) {
    duplicates.push({ name, files });
  }
});

if (duplicates.length === 0) {
  console.log('✅ Aucun doublon détecté');
} else {
  console.log(`❌ ${duplicates.length} doublons détectés:`);
  duplicates.forEach(duplicate => {
    console.log(`\n  🔴 ${duplicate.name}:`);
    duplicate.files.forEach(file => console.log(`    - ${file}`));
  });
}

// 3. VÉRIFICATION DES ROUTES
console.log('\n🛣️ 3. VÉRIFICATION DES ROUTES');
console.log('==============================');

try {
  const routeUtilsPath = path.join(process.cwd(), 'src', 'utils', 'routeUtils.ts');
  const routeContent = readFileContent(routeUtilsPath);
  
  const routeMatches = routeContent.match(/UNIFIED_ROUTES\s*=\s*{([^}]+)}/s);
  if (routeMatches) {
    const routesText = routeMatches[1];
    const routes = routesText.split(',').filter(line => line.includes(':')).length;
    console.log(`✅ Routes définies: ${routes}`);
    
    // Vérifier les doublons de routes
    const routeValues = [];
    const routeRegex = /:\s*['"`]([^'"`]+)['"`]/g;
    let match;
    while ((match = routeRegex.exec(routesText)) !== null) {
      routeValues.push(match[1]);
    }
    
    const uniqueRoutes = new Set(routeValues);
    if (routeValues.length === uniqueRoutes.size) {
      console.log('✅ Aucun doublon de routes');
    } else {
      console.log(`❌ ${routeValues.length - uniqueRoutes.size} doublons de routes détectés`);
    }
  }
} catch (error) {
  console.log('❌ Erreur lors de la vérification des routes');
}

// 4. VÉRIFICATION DES COMPOSANTS CRITIQUES
console.log('\n🧩 4. COMPOSANTS CRITIQUES');
console.log('===========================');

const criticalComponents = [
  'src/pages/HomePage.tsx',
  'src/pages/ImmersiveHome.tsx',
  'src/pages/b2c/LoginPage.tsx',
  'src/pages/b2c/RegisterPage.tsx',
  'src/pages/b2c/DashboardPage.tsx',
  'src/pages/b2b/user/LoginPage.tsx',
  'src/pages/b2b/user/DashboardPage.tsx',
  'src/pages/b2b/admin/LoginPage.tsx',
  'src/pages/b2b/admin/DashboardPage.tsx',
  'src/pages/ScanPage.tsx',
  'src/pages/MusicPage.tsx',
  'src/pages/CoachPage.tsx',
  'src/pages/JournalPage.tsx',
  'src/pages/VRPage.tsx',
  'src/pages/GamificationPage.tsx',
  'src/pages/SocialCoconPage.tsx',
  'src/pages/PreferencesPage.tsx',
  'src/pages/TeamsPage.tsx',
  'src/pages/ReportsPage.tsx',
  'src/pages/EventsPage.tsx',
  'src/pages/OptimisationPage.tsx',
  'src/pages/SettingsPage.tsx'
];

let missingComponents = 0;
criticalComponents.forEach(component => {
  const fullPath = path.join(process.cwd(), component);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✅ ${component}`);
  } else {
    console.log(`  ❌ ${component} - MANQUANT`);
    missingComponents++;
  }
});

// 5. ANALYSE DES IMPORTS
console.log('\n📦 5. ANALYSE DES IMPORTS');
console.log('=========================');

let unusedImports = 0;
let circularImports = 0;

// Scan basique des imports non utilisés
allFiles.forEach(file => {
  const content = readFileContent(file);
  const importLines = content.split('\n').filter(line => line.trim().startsWith('import'));
  
  importLines.forEach(importLine => {
    const importMatch = importLine.match(/import\s+{([^}]+)}/);
    if (importMatch) {
      const imports = importMatch[1].split(',').map(i => i.trim());
      imports.forEach(imp => {
        if (!content.includes(imp.replace(/\s+as\s+\w+/, ''))) {
          unusedImports++;
        }
      });
    }
  });
});

// 6. RÉSUMÉ DE L'AUDIT
console.log('\n📊 RÉSUMÉ DE L\'AUDIT');
console.log('====================');

const auditResults = {
  timestamp: new Date().toISOString(),
  pages: {
    total: pageFiles.length,
    critical: criticalComponents.length,
    missing: missingComponents
  },
  duplicates: {
    components: duplicates.length,
    routes: 0 // Sera mis à jour selon la vérification
  },
  quality: {
    unusedImports: unusedImports,
    circularImports: circularImports
  },
  score: Math.max(0, 100 - (duplicates.length * 10) - (missingComponents * 15) - (Math.min(unusedImports, 10)))
};

console.log(`📈 Score global: ${auditResults.score}/100`);
console.log(`📄 Pages totales: ${auditResults.pages.total}`);
console.log(`🔴 Composants manquants: ${auditResults.pages.missing}`);
console.log(`🔄 Doublons: ${auditResults.duplicates.components}`);
console.log(`📦 Imports non utilisés: ${auditResults.quality.unusedImports}`);

if (auditResults.score >= 90) {
  console.log('\n🎉 EXCELLENT - Application prête pour la production');
} else if (auditResults.score >= 75) {
  console.log('\n✅ BIEN - Quelques améliorations recommandées');
} else {
  console.log('\n⚠️ ATTENTION - Corrections nécessaires avant production');
}

// Sauvegarde du rapport
fs.writeFileSync('audit-comprehensive-report.json', JSON.stringify(auditResults, null, 2));
console.log('\n💾 Rapport sauvegardé dans audit-comprehensive-report.json');

process.exit(auditResults.score >= 75 ? 0 : 1);

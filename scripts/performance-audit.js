#!/usr/bin/env node

/**
 * Script d'audit de performance - Phase 2
 * Analyse les métriques de performance et génère un rapport
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Phase 2: Audit de Performance Avancé\n');

let report = {
  timestamp: new Date().toISOString(),
  bundle: {},
  performance: {},
  recommendations: []
};

// 1. Analyse du bundle
console.log('📦 1. Analyse du bundle...');
try {
  if (fs.existsSync('dist')) {
    const distStats = execSync('du -sh dist/', { encoding: 'utf8' });
    const jsFiles = fs.readdirSync('dist/js', { withFileTypes: true })
      .filter(dirent => dirent.isFile() && dirent.name.endsWith('.js'))
      .map(dirent => {
        const filePath = path.join('dist/js', dirent.name);
        const stats = fs.statSync(filePath);
        return {
          name: dirent.name,
          size: Math.round(stats.size / 1024) + ' KB'
        };
      });

    report.bundle = {
      totalSize: distStats.trim(),
      jsFiles: jsFiles,
      chunksCount: jsFiles.length
    };

    console.log(`   ✅ Taille totale: ${distStats.trim()}`);
    console.log(`   ✅ Chunks JS: ${jsFiles.length} fichiers`);
  } else {
    console.log('   ⚠️ Dossier dist/ non trouvé - exécuter npm run build');
  }
} catch (error) {
  console.log('   ❌ Erreur analyse bundle:', error.message);
}

// 2. Vérification des optimisations images
console.log('\n🖼️ 2. Audit des images...');
const imageOptimizations = {
  webpFound: false,
  avifFound: false,
  lazyLoading: false,
  totalImages: 0
};

try {
  // Chercher des images WebP/AVIF dans public/
  const checkDir = (dir) => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir, { withFileTypes: true });
    files.forEach(file => {
      if (file.isDirectory()) {
        checkDir(path.join(dir, file.name));
      } else if (file.isFile()) {
        const ext = path.extname(file.name).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'].includes(ext)) {
          imageOptimizations.totalImages++;
          if (ext === '.webp') imageOptimizations.webpFound = true;
          if (ext === '.avif') imageOptimizations.avifFound = true;
        }
      }
    });
  };

  checkDir('public');
  checkDir('src/assets');

  report.performance.images = imageOptimizations;

  console.log(`   ✅ Images détectées: ${imageOptimizations.totalImages}`);
  console.log(`   ${imageOptimizations.webpFound ? '✅' : '⚠️'} WebP: ${imageOptimizations.webpFound ? 'Détecté' : 'Non détecté'}`);
  console.log(`   ${imageOptimizations.avifFound ? '✅' : '⚠️'} AVIF: ${imageOptimizations.avifFound ? 'Détecté' : 'Non détecté'}`);
} catch (error) {
  console.log('   ❌ Erreur analyse images:', error.message);
}

// 3. Analyse du code splitting
console.log('\n⚡ 3. Code splitting...');
try {
  const viteConfigContent = fs.readFileSync('vite.config.ts', 'utf8');
  const hasManualChunks = viteConfigContent.includes('manualChunks');
  const hasDynamicImports = viteConfigContent.includes('import(') || 
                           fs.existsSync('src') && execSync('grep -r "import(" src/', { encoding: 'utf8', stdio: 'pipe' }).length > 0;

  report.performance.codeSplitting = {
    manualChunks: hasManualChunks,
    dynamicImports: hasDynamicImports
  };

  console.log(`   ${hasManualChunks ? '✅' : '⚠️'} Manual chunks: ${hasManualChunks ? 'Configuré' : 'Non configuré'}`);
  console.log(`   ${hasDynamicImports ? '✅' : '⚠️'} Dynamic imports: ${hasDynamicImports ? 'Détectés' : 'Non détectés'}`);
} catch (error) {
  console.log('   ❌ Erreur analyse code splitting:', error.message);
}

// 4. Tests E2E configurés
console.log('\n🎭 4. Tests End-to-End...');
const e2eConfigured = fs.existsSync('playwright.config.ts') && fs.existsSync('tests/e2e');
const e2eTests = e2eConfigured ? fs.readdirSync('tests/e2e').filter(f => f.endsWith('.spec.ts')).length : 0;

report.performance.e2e = {
  configured: e2eConfigured,
  testsCount: e2eTests
};

console.log(`   ${e2eConfigured ? '✅' : '⚠️'} Configuration: ${e2eConfigured ? 'Présente' : 'Manquante'}`);
console.log(`   ${e2eTests > 0 ? '✅' : '⚠️'} Tests: ${e2eTests} fichiers`);

// 5. CI/CD Pipeline
console.log('\n🔄 5. CI/CD Pipeline...');
const ciConfigured = fs.existsSync('.github/workflows');
let workflowCount = 0;
if (ciConfigured) {
  workflowCount = fs.readdirSync('.github/workflows').filter(f => f.endsWith('.yml') || f.endsWith('.yaml')).length;
}

report.performance.cicd = {
  configured: ciConfigured,
  workflowCount: workflowCount
};

console.log(`   ${ciConfigured ? '✅' : '⚠️'} GitHub Actions: ${ciConfigured ? 'Configuré' : 'Non configuré'}`);
console.log(`   ${workflowCount > 0 ? '✅' : '⚠️'} Workflows: ${workflowCount} fichiers`);

// 6. Génération des recommandations
console.log('\n💡 Recommandations:');
const recommendations = [];

if (!imageOptimizations.webpFound && imageOptimizations.totalImages > 0) {
  recommendations.push('Activer la conversion WebP automatique des images');
}

if (!report.performance.codeSplitting?.manualChunks) {
  recommendations.push('Configurer le code splitting manuel dans vite.config.ts');
}

if (!e2eConfigured) {
  recommendations.push('Configurer les tests end-to-end avec Playwright');
}

if (!ciConfigured) {
  recommendations.push('Mettre en place un pipeline CI/CD avec GitHub Actions');
}

if (report.bundle.chunksCount > 10) {
  recommendations.push('Optimiser le nombre de chunks (actuellement ' + report.bundle.chunksCount + ')');
}

report.recommendations = recommendations;

recommendations.forEach((rec, index) => {
  console.log(`   ${index + 1}. ${rec}`);
});

if (recommendations.length === 0) {
  console.log('   🎉 Toutes les optimisations sont en place !');
}

// 7. Sauvegarde du rapport
console.log('\n📊 Génération du rapport...');
const reportPath = 'reports/performance-audit.json';
if (!fs.existsSync('reports')) {
  fs.mkdirSync('reports', { recursive: true });
}

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

// Calcul du score
const totalChecks = 6;
let passedChecks = 0;

if (report.bundle.totalSize) passedChecks++;
if (imageOptimizations.webpFound || imageOptimizations.totalImages === 0) passedChecks++;
if (report.performance.codeSplitting?.manualChunks) passedChecks++;
if (e2eConfigured) passedChecks++;
if (ciConfigured) passedChecks++;
if (report.bundle.chunksCount <= 10) passedChecks++;

const score = Math.round((passedChecks / totalChecks) * 100);

console.log('='.repeat(60));
console.log('📈 RÉSULTATS AUDIT DE PERFORMANCE');
console.log('='.repeat(60));
console.log(`🎯 Score global: ${score}/100`);
console.log(`✅ Vérifications réussies: ${passedChecks}/${totalChecks}`);
console.log(`📋 Recommandations: ${recommendations.length}`);
console.log(`📄 Rapport détaillé: ${reportPath}`);

if (score >= 90) {
  console.log('\n🏆 EXCELLENT ! Performance optimale');
} else if (score >= 75) {
  console.log('\n👍 BON ! Quelques optimisations possibles');
} else if (score >= 60) {
  console.log('\n⚠️ MOYEN ! Optimisations importantes recommandées');
} else {
  console.log('\n🚨 CRITIQUE ! Nombreuses optimisations nécessaires');
}

console.log('\n🚀 Prochaines étapes:');
if (score < 100) {
  console.log('   • Implémenter les recommandations listées');
  console.log('   • Relancer l\'audit après optimisations');
}
console.log('   • Tester les performances en conditions réelles');
console.log('   • Surveiller les métriques en production');

process.exit(score >= 75 ? 0 : 1);
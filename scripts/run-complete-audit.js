
#!/usr/bin/env node

/**
 * Script principal pour lancer l'audit complet
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Démarrage de l\'audit complet EmotionsCare...\n');
console.log('=' .repeat(60));
console.log('📋 AUDIT COMPLET - BACKEND vs FRONTEND');
console.log('=' .repeat(60));

// S'assurer que le dossier reports existe
const reportsDir = './reports';
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

try {
  // 1. Audit d'accessibilité
  console.log('\n1️⃣ AUDIT D\'ACCESSIBILITÉ FRONTEND');
  console.log('-'.repeat(40));
  execSync('node scripts/audit-accessibility.js', { stdio: 'inherit' });

  // 2. Audit Backend-Frontend Gap
  console.log('\n2️⃣ AUDIT BACKEND-FRONTEND GAP');
  console.log('-'.repeat(40));
  execSync('node scripts/audit-backend-frontend-gap.js', { stdio: 'inherit' });

  // 3. Audit des routes
  console.log('\n3️⃣ AUDIT ACCESSIBILITÉ DES ROUTES');
  console.log('-'.repeat(40));
  execSync('node scripts/audit-routes-accessibility.js', { stdio: 'inherit' });

  // 4. Générer un rapport consolidé
  console.log('\n4️⃣ GÉNÉRATION DU RAPPORT CONSOLIDÉ');
  console.log('-'.repeat(40));
  
  const consolidatedReport = {
    timestamp: new Date().toISOString(),
    audits: {}
  };

  // Charger tous les rapports JSON
  const reportDirs = [
    './reports/accessibility',
    './reports/backend-frontend-gap', 
    './reports/routes-accessibility'
  ];

  reportDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
      files.forEach(file => {
        const reportName = path.basename(file, '.json');
        try {
          const reportContent = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
          consolidatedReport.audits[reportName] = reportContent;
        } catch (error) {
          console.warn(`⚠️ Erreur lors du chargement de ${file}: ${error.message}`);
        }
      });
    }
  });

  // Sauvegarder le rapport consolidé
  fs.writeFileSync(
    path.join(reportsDir, 'complete-audit-report.json'),
    JSON.stringify(consolidatedReport, null, 2)
  );

  // Générer un résumé exécutif
  const executiveSummary = generateExecutiveSummary(consolidatedReport);
  fs.writeFileSync(
    path.join(reportsDir, 'EXECUTIVE_SUMMARY.md'),
    executiveSummary
  );

  console.log('\n' + '='.repeat(60));
  console.log('✅ AUDIT COMPLET TERMINÉ AVEC SUCCÈS');
  console.log('='.repeat(60));
  console.log(`📁 Rapports disponibles dans: ${reportsDir}/`);
  console.log('📊 Rapports générés:');
  console.log('   - complete-audit-report.json (données complètes)');
  console.log('   - EXECUTIVE_SUMMARY.md (résumé exécutif)');
  console.log('   - accessibility/ (audit accessibilité)');
  console.log('   - backend-frontend-gap/ (audit gap backend)');
  console.log('   - routes-accessibility/ (audit routes)');
  
} catch (error) {
  console.error('\n❌ Erreur lors de l\'audit:', error.message);
  process.exit(1);
}

function generateExecutiveSummary(report) {
  const accessibilityData = report.audits['accessibility-audit'] || {};
  const backendGapData = report.audits['backend-frontend-gap'] || {};
  const routesData = report.audits['routes-accessibility'] || {};

  return `
# 📊 RÉSUMÉ EXÉCUTIF - AUDIT EMOTIONICARE

*Généré le ${new Date().toLocaleString('fr-FR')}*

## 🎯 Vue d'ensemble

Cet audit complet identifie tous les éléments backend non accessibles côté utilisateur, les pages sans navigation, et les gaps entre le backend et le frontend.

## 📈 Métriques Clés

### 🎨 Frontend - Accessibilité
- **Composants orphelins**: ${accessibilityData.orphanedComponents?.length || 0}
- **Pages inutilisées**: ${accessibilityData.unusedPages?.length || 0}
- **Routes sans navigation**: ${accessibilityData.missingNavigation?.length || 0}

### 🔌 Backend - Gap Frontend
- **Fonctions Edge inutilisées**: ${backendGapData.unusedEdgeFunctions?.length || 0}
- **Services non connectés**: ${backendGapData.unusedBackendServices?.length || 0}
- **Scripts orphelins**: ${backendGapData.deadEndpoints?.length || 0}

### 🛣️ Routes - Accessibilité
- **Routes totales**: ${routesData.summary?.totalRoutes || 0}
- **Routes inaccessibles**: ${routesData.summary?.inaccessibleRoutes || 0}
- **Pages orphelines**: ${routesData.summary?.orphanedPages || 0}

## 🚨 Points Critiques

${generateCriticalPoints(accessibilityData, backendGapData, routesData)}

## 🔧 Actions Prioritaires

1. **Nettoyage immédiat**
   - Supprimer les composants et pages orphelins
   - Connecter les fonctions Edge importantes au frontend
   - Ajouter navigation pour les routes critiques

2. **Optimisation backend**
   - Évaluer l'utilité des fonctions Edge non utilisées
   - Documenter ou supprimer les services déconnectés
   - Nettoyer les scripts orphelins

3. **Amélioration UX**
   - Ajouter liens de navigation manquants
   - Simplifier l'architecture des routes
   - Améliorer la découvrabilité des fonctionnalités

## 📁 Rapports Détaillés

- **Accessibilité**: \`reports/accessibility/accessibility-audit.md\`
- **Backend Gap**: \`reports/backend-frontend-gap/backend-frontend-gap.md\`
- **Routes**: \`reports/routes-accessibility/routes-accessibility.md\`
- **Données JSON**: \`reports/complete-audit-report.json\`

---

*Pour plus de détails, consultez les rapports individuels dans le dossier reports/*
`;
}

function generateCriticalPoints(accessibility, backendGap, routes) {
  const points = [];
  
  if (accessibility.orphanedComponents?.length > 3) {
    points.push(`❗ **${accessibility.orphanedComponents.length} composants orphelins** - Potentiel code mort`);
  }
  
  if (backendGap.unusedEdgeFunctions?.length > 0) {
    points.push(`❗ **${backendGap.unusedEdgeFunctions.length} fonctions Edge inutilisées** - Ressources backend gaspillées`);
  }
  
  if (routes.summary?.inaccessibleRoutes > 2) {
    points.push(`❗ **${routes.summary.inaccessibleRoutes} routes inaccessibles** - Fonctionnalités cachées aux utilisateurs`);
  }
  
  if (accessibility.unusedPages?.length > 0) {
    points.push(`⚠️ **${accessibility.unusedPages.length} pages non utilisées** - Code potentiellement obsolète`);
  }
  
  return points.length > 0 ? points.join('\n') : '✅ Aucun point critique majeur détecté';
}

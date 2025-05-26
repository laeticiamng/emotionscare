
#!/usr/bin/env node

/**
 * Script principal pour exécuter tous les audits
 */

const { runAudit } = require('./audit-accessibility');
const { runBackendAudit } = require('./audit-backend-frontend-gap');
const { runRoutesAudit } = require('./audit-routes-accessibility');
const fs = require('fs');

console.log('🔍 AUDIT COMPLET - Démarrage...\n');

async function runCompleteAudit() {
  const startTime = Date.now();
  const results = {
    timestamp: new Date().toISOString(),
    audits: {},
    summary: {},
    recommendations: []
  };
  
  try {
    // Audit 1: Accessibilité des pages et composants
    console.log('1️⃣ Audit d\'accessibilité...');
    results.audits.accessibility = await runAudit();
    
    console.log('\n2️⃣ Audit Backend-Frontend Gap...');
    results.audits.backendGap = await runBackendAudit();
    
    console.log('\n3️⃣ Audit des routes...');
    results.audits.routes = await runRoutesAudit();
    
    // Générer le résumé global
    results.summary = {
      totalIssues: 
        (results.audits.accessibility?.analysis?.orphanedPages?.length || 0) +
        (results.audits.accessibility?.analysis?.unreachableRoutes?.length || 0) +
        (results.audits.accessibility?.analysis?.brokenLinks?.length || 0) +
        (results.audits.backendGap?.gaps?.unusedBackendServices?.length || 0) +
        (results.audits.backendGap?.gaps?.missingBackendEndpoints?.length || 0) +
        (results.audits.routes?.analysis?.inaccessibleRoutes?.length || 0) +
        (results.audits.routes?.analysis?.orphanedProtectedRoutes?.length || 0),
      
      criticalIssues: [
        ...(results.audits.routes?.analysis?.unprotectedSensitiveRoutes || []),
        ...(results.audits.routes?.analysis?.deadEndRedirects || []),
        ...(results.audits.backendGap?.gaps?.untestedServices || [])
      ],
      
      categories: {
        accessibility: {
          orphanedPages: results.audits.accessibility?.analysis?.orphanedPages?.length || 0,
          unreachableRoutes: results.audits.accessibility?.analysis?.unreachableRoutes?.length || 0,
          brokenLinks: results.audits.accessibility?.analysis?.brokenLinks?.length || 0
        },
        backend: {
          unusedServices: results.audits.backendGap?.gaps?.unusedBackendServices?.length || 0,
          missingEndpoints: results.audits.backendGap?.gaps?.missingBackendEndpoints?.length || 0,
          unusedTables: results.audits.backendGap?.gaps?.unusedTables?.length || 0
        },
        security: {
          unprotectedRoutes: results.audits.routes?.analysis?.unprotectedSensitiveRoutes?.length || 0,
          untestedServices: results.audits.backendGap?.gaps?.untestedServices?.length || 0
        }
      }
    };
    
    // Générer les recommandations
    results.recommendations = generateRecommendations(results);
    
    // Sauvegarder le rapport complet
    if (!fs.existsSync('reports')) {
      fs.mkdirSync('reports');
    }
    
    fs.writeFileSync(
      'reports/complete-audit-report.json',
      JSON.stringify(results, null, 2)
    );
    
    // Générer un rapport markdown lisible
    generateMarkdownReport(results);
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n🎉 AUDIT COMPLET TERMINÉ');
    console.log(`⏱️ Durée: ${duration}s`);
    console.log(`📊 Issues totales trouvées: ${results.summary.totalIssues}`);
    console.log(`🚨 Issues critiques: ${results.summary.criticalIssues.length}`);
    console.log('\n📄 Rapports générés:');
    console.log('  - reports/complete-audit-report.json');
    console.log('  - reports/audit-summary.md');
    console.log('  - reports/accessibility-audit.json');
    console.log('  - reports/backend-frontend-gap.json');
    console.log('  - reports/routes-accessibility.json');
    
  } catch (error) {
    console.error('❌ Erreur durant l\'audit:', error);
    throw error;
  }
}

function generateRecommendations(results) {
  const recommendations = [];
  
  // Recommandations de sécurité
  if (results.summary.categories.security.unprotectedRoutes > 0) {
    recommendations.push({
      priority: 'CRITICAL',
      category: 'Security',
      title: 'Routes sensibles non protégées',
      description: 'Des routes admin/dashboard ne sont pas protégées par ProtectedRoute',
      action: 'Ajouter ProtectedRoute avec les rôles appropriés'
    });
  }
  
  // Recommandations d'accessibilité
  if (results.summary.categories.accessibility.orphanedPages > 0) {
    recommendations.push({
      priority: 'HIGH',
      category: 'Accessibility',
      title: 'Pages orphelines détectées',
      description: 'Des pages existent mais ne sont accessibles via aucun lien',
      action: 'Ajouter des liens de navigation ou supprimer les pages inutiles'
    });
  }
  
  // Recommandations backend
  if (results.summary.categories.backend.unusedServices > 0) {
    recommendations.push({
      priority: 'MEDIUM',
      category: 'Backend',
      title: 'Services backend inutilisés',
      description: 'Des services backend ne sont pas utilisés par le frontend',
      action: 'Connecter au frontend ou supprimer si obsolètes'
    });
  }
  
  return recommendations;
}

function generateMarkdownReport(results) {
  const markdown = `# Rapport d'Audit Complet - EmotionsCare

**Date:** ${new Date(results.timestamp).toLocaleString('fr-FR')}

## 📊 Résumé Exécutif

- **Issues totales:** ${results.summary.totalIssues}
- **Issues critiques:** ${results.summary.criticalIssues.length}

### Répartition par Catégorie

#### 🔗 Accessibilité
- Pages orphelines: ${results.summary.categories.accessibility.orphanedPages}
- Routes inaccessibles: ${results.summary.categories.accessibility.unreachableRoutes}
- Liens cassés: ${results.summary.categories.accessibility.brokenLinks}

#### 🔧 Backend
- Services inutilisés: ${results.summary.categories.backend.unusedServices}
- Endpoints manquants: ${results.summary.categories.backend.missingEndpoints}
- Tables non utilisées: ${results.summary.categories.backend.unusedTables}

#### 🔒 Sécurité
- Routes non protégées: ${results.summary.categories.security.unprotectedRoutes}
- Services non testés: ${results.summary.categories.security.untestedServices}

## 🚨 Recommandations Prioritaires

${results.recommendations.map(rec => `
### ${rec.priority} - ${rec.title}
**Catégorie:** ${rec.category}
**Description:** ${rec.description}
**Action:** ${rec.action}
`).join('\n')}

## 📁 Rapports Détaillés

- \`accessibility-audit.json\` - Analyse complète de l'accessibilité
- \`backend-frontend-gap.json\` - Gap entre backend et frontend
- \`routes-accessibility.json\` - Analyse des routes et navigation
- \`complete-audit-report.json\` - Rapport complet au format JSON

---
*Audit généré automatiquement par le système d'audit EmotionsCare*
`;

  fs.writeFileSync('reports/audit-summary.md', markdown);
}

if (require.main === module) {
  runCompleteAudit().catch(console.error);
}

module.exports = { runCompleteAudit };

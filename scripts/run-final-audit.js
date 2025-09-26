const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 AUDIT FINAL ROUTERV2 - EXECUTION...\n');

try {
  // Exécuter le script d'audit final
  execSync('node scripts/final-router-audit.js', { stdio: 'inherit' });
  
  // Lire le rapport généré
  const reportPath = path.join(__dirname, '../final-router-audit-report.json');
  
  if (fs.existsSync(reportPath)) {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    
    console.log('\n📊 RÉSUMÉ FINAL:');
    console.log(`✅ Coverage: ${report.summary.coverage}%`);
    console.log(`📄 Composants déclarés: ${report.summary.declared}`);
    console.log(`📁 Composants existants: ${report.summary.existing}`);
    console.log(`🗺️ Composants mappés: ${report.summary.mapped}`);
    console.log(`❌ Composants manquants: ${report.summary.missing}`);
    console.log(`🔄 Composants orphelins: ${report.summary.orphaned}`);
    console.log(`⚠️ Mappés mais fichiers manquants: ${report.summary.mappedButMissing}`);
    console.log(`🔍 Doublons détectés: ${report.summary.duplicates}`);
    
    if (report.summary.coverage >= 90) {
      console.log('\n🎉 ROUTERV2 PRÊT POUR PRODUCTION!');
    } else if (report.summary.coverage >= 75) {
      console.log('\n⚡ ROUTERV2 FONCTIONNEL - Quelques optimisations restantes');
    } else {
      console.log('\n⚠️ ROUTERV2 PARTIELLEMENT FONCTIONNEL - Travail supplémentaire requis');
    }
    
    // Afficher les actions prioritaires
    if (report.summary.missing > 0) {
      console.log(`\n🎯 ACTION PRIORITAIRE: Créer ${report.summary.missing} composants manquants`);
    }
    
    if (report.summary.mappedButMissing > 0) {
      console.log(`🎯 ACTION CRITIQUE: Résoudre ${report.summary.mappedButMissing} composants mappés mais fichiers manquants`);
    }
    
  } else {
    console.log('⚠️ Rapport d\'audit non trouvé');
  }
  
} catch (error) {
  console.error('❌ Erreur lors de l\'audit:', error.message);
}
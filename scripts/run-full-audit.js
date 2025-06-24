
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 LANCEMENT DE L\'AUDIT COMPLET');
console.log('================================\n');

try {
  // 1. Nettoyage des doublons d'abord
  console.log('Phase 1: Nettoyage des doublons...');
  execSync('node scripts/remove-duplicates.js', { stdio: 'inherit' });
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // 2. Audit complet après nettoyage
  console.log('Phase 2: Audit complet...');
  execSync('node scripts/comprehensive-audit.js', { stdio: 'inherit' });
  
  console.log('\n✅ AUDIT TERMINÉ AVEC SUCCÈS');
  
} catch (error) {
  console.log('\n❌ ERREUR LORS DE L\'AUDIT:', error.message);
  process.exit(1);
}

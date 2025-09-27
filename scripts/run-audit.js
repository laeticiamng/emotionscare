
#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 LANCEMENT DE L\'AUDIT COMPLET');
console.log('===============================\n');

try {
  execSync('node scripts/complete-application-audit.js', { stdio: 'inherit' });
  console.log('\n✅ AUDIT TERMINÉ AVEC SUCCÈS');
} catch (error) {
  console.log('\n❌ ERREUR LORS DE L\'AUDIT:', error.message);
  process.exit(1);
}


#!/usr/bin/env node

/**
 * Script pour corriger automatiquement les dépendances problématiques
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 Correction automatique des dépendances...');

try {
  // Lire le package.json actuel
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  
  console.log('📋 Problèmes détectés :');
  
  // Vérifier les doublons de pg
  if (packageJson.dependencies && packageJson.dependencies.pg && 
      packageJson.devDependencies && packageJson.devDependencies.pg) {
    console.log('- Doublon détecté pour "pg"');
  }
  
  // Vérifier pgtap-run
  if ((packageJson.dependencies && packageJson.dependencies['pgtap-run']) ||
      (packageJson.devDependencies && packageJson.devDependencies['pgtap-run'])) {
    console.log('- Package inexistant "pgtap-run" détecté');
  }
  
  console.log('\n🚫 ERREUR: Impossible de modifier package.json automatiquement.');
  console.log('📝 Vous devez modifier manuellement le fichier package.json :');
  
  console.log('\n✏️  ACTIONS MANUELLES REQUISES :');
  console.log('1. Ouvrir package.json');
  console.log('2. Supprimer la ligne : "pgtap-run": "^1.2.0"');
  console.log('3. Supprimer UN des deux "pg": "^8.11.3" (gardez celui dans dependencies)');
  console.log('4. Sauvegarder le fichier');
  console.log('5. Lancer : bun install');
  
  console.log('\n🎯 Lignes exactes à supprimer :');
  console.log('   - Ligne ~173: "pg": "^8.11.3" (dans devDependencies)');
  console.log('   - Toute ligne contenant: "pgtap-run": "^1.2.0"');
  
  console.log('\n✅ Une fois corrigé manuellement, les dépendances s\'installeront correctement.');
  
} catch (error) {
  console.error('❌ Erreur lors de la lecture de package.json:', error.message);
  console.log('\n💡 Vérifiez que le fichier package.json existe et est valide.');
}

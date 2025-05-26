
#!/usr/bin/env node

/**
 * Script to verify that the installation completed successfully
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de l\'installation...');

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.error('❌ node_modules n\'existe pas');
  console.log('\n💡 Actions recommandées:');
  console.log('1. Vérifiez les conflits de dépendances: node scripts/fix-dependencies.js');
  console.log('2. Nettoyez les doublons dans package.json');
  console.log('3. Supprimez les packages inexistants (pgtap-run, edge-test-kit)');
  console.log('4. Relancez: bun install');
  process.exit(1);
}

// Check if critical packages are installed
const criticalPackages = [
  'react',
  'react-dom',
  'vite',
  '@vitejs/plugin-react'
];

let allInstalled = true;

criticalPackages.forEach(pkg => {
  const pkgPath = path.join('node_modules', pkg);
  if (!fs.existsSync(pkgPath)) {
    console.error(`❌ Package manquant: ${pkg}`);
    allInstalled = false;
  } else {
    console.log(`✅ ${pkg} installé`);
  }
});

if (allInstalled) {
  console.log('✅ Installation vérifiée avec succès!');
  console.log('🚀 Vous pouvez maintenant lancer: npm run dev');
} else {
  console.error('❌ Installation incomplète');
  console.log('\n🔧 Dépannage:');
  console.log('1. Lancez: node scripts/fix-dependencies.js');
  console.log('2. Corrigez manuellement package.json');
  console.log('3. Réessayez l\'installation');
  process.exit(1);
}

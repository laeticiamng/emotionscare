
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
  process.exit(1);
}

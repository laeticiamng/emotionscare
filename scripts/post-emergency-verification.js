
#!/usr/bin/env node

/**
 * Vérification post-installation d'urgence
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification post-installation...');

// Vérifier les packages critiques
const criticalPackages = [
  'react',
  'react-dom',
  'vite',
  '@vitejs/plugin-react',
  '@types/react',
  '@types/react-dom',
  'typescript',
  'tailwindcss'
];

const packageJsonPath = './package.json';
const nodeModulesPath = './node_modules';

if (!fs.existsSync(nodeModulesPath)) {
  console.error('❌ node_modules n\'existe pas encore');
  console.log('💡 Lancez: node scripts/emergency-fix-install.js');
  process.exit(1);
}

let allCriticalInstalled = true;
let installedCount = 0;

criticalPackages.forEach(pkg => {
  const pkgPath = path.join(nodeModulesPath, pkg);
  if (fs.existsSync(pkgPath)) {
    console.log(`✅ ${pkg}`);
    installedCount++;
  } else {
    console.log(`❌ ${pkg} manquant`);
    allCriticalInstalled = false;
  }
});

console.log(`\n📊 Résultat: ${installedCount}/${criticalPackages.length} packages critiques installés`);

if (allCriticalInstalled) {
  console.log('🎉 Installation critique réussie !');
  console.log('🚀 Vous pouvez maintenant lancer: npm run dev');
} else {
  console.log('⚠️ Installation partielle');
  console.log('💡 Essayez: npm install --legacy-peer-deps');
}

// Vérifier la présence de problèmes résiduels
if (fs.existsSync(packageJsonPath)) {
  const packageContent = fs.readFileSync(packageJsonPath, 'utf8');
  
  if (packageContent.includes('pgtap-run')) {
    console.log('\n⚠️ PROBLÈME RÉSIDUEL: pgtap-run toujours présent dans package.json');
    console.log('   Supprimez manuellement la ligne: "pgtap-run": "^1.2.0"');
  }
  
  const pgMatches = packageContent.match(/"pg":/g);
  if (pgMatches && pgMatches.length > 1) {
    console.log('\n⚠️ PROBLÈME RÉSIDUEL: duplicata pg dans package.json');
    console.log('   Gardez seulement pg dans dependencies, supprimez celui dans devDependencies');
  }
}

console.log('\n✅ Vérification terminée');

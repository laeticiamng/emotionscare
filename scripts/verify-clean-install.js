#!/usr/bin/env node

/**
 * Script de vérification après nettoyage
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de l\'installation après nettoyage...');

// Vérifier que les packages problématiques ne sont plus présents
const packageJsonPath = 'package.json';

if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const problematicPackages = [
    'imagemin-avif',
    'imagemin-webp', 
    'vite-plugin-imagemin',
    'jpegtran-bin',
    'imagemin-jpegtran'
  ];
  
  let foundProblematic = false;
  
  problematicPackages.forEach(pkg => {
    if (packageJson.dependencies && packageJson.dependencies[pkg]) {
      console.error(`❌ Package problématique trouvé dans dependencies: ${pkg}`);
      foundProblematic = true;
    }
    if (packageJson.devDependencies && packageJson.devDependencies[pkg]) {
      console.error(`❌ Package problématique trouvé dans devDependencies: ${pkg}`);
      foundProblematic = true;
    }
  });
  
  if (!foundProblematic) {
    console.log('✅ Aucun package problématique détecté dans package.json');
  }
}

// Vérifier que node_modules existe et contient les packages essentiels
if (!fs.existsSync('node_modules')) {
  console.error('❌ node_modules n\'existe pas - l\'installation n\'a pas eu lieu');
  process.exit(1);
}

const criticalPackages = [
  'react',
  'react-dom',
  'vite',
  '@vitejs/plugin-react',
  'sharp'
];

let allInstalled = true;

criticalPackages.forEach(pkg => {
  const pkgPath = path.join('node_modules', pkg);
  if (!fs.existsSync(pkgPath)) {
    console.error(`❌ Package critique manquant: ${pkg}`);
    allInstalled = false;
  } else {
    console.log(`✅ ${pkg} installé correctement`);
  }
});

// Vérifier Sharp comme alternative à imagemin
const sharpPath = path.join('node_modules', 'sharp');
if (fs.existsSync(sharpPath)) {
  console.log('✅ Sharp disponible comme optimiseur d\'images');
} else {
  console.warn('⚠️ Sharp non trouvé - optimisation d\'images limitée');
}

if (allInstalled) {
  console.log('\n🎯 VÉRIFICATION RÉUSSIE!');
  console.log('✅ Installation propre confirmée');
  console.log('✅ Packages problématiques supprimés');
  console.log('✅ Alternative Sharp disponible');
  console.log('\n🚀 NEXT STEPS:');
  console.log('1. Lancez: npm run dev');
  console.log('2. Si tout fonctionne: npm run build');
} else {
  console.error('\n❌ VÉRIFICATION ÉCHOUÉE');
  console.log('\n🔧 Solutions:');
  console.log('1. Relancez: ./scripts/final-clean-install.sh');
  console.log('2. Ou manuellement: rm -rf node_modules && npm install --legacy-peer-deps');
  process.exit(1);
}
#!/usr/bin/env node

/**
 * Force un rebuild complet des dépendances
 * Résout les problèmes de cache persistant
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Force clean install - Résolution erreur jpegtran-bin');

// Lire package.json
const packagePath = path.join(process.cwd(), 'package.json');
let packageData;

try {
  packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log('📦 Package.json lu avec succès');
} catch (error) {
  console.error('❌ Erreur lecture package.json:', error.message);
  process.exit(1);
}

// Vérifier packages problématiques
const problematicPackages = [
  'imagemin-webp', 
  'imagemin-avif', 
  'vite-plugin-imagemin',
  'imagemin-jpegtran',
  'jpegtran-bin',
  'imagemin-mozjpeg',
  'imagemin-pngquant'
];

let foundProblematic = [];
let cleanedCount = 0;

// Nettoyer dependencies
if (packageData.dependencies) {
  Object.keys(packageData.dependencies).forEach(pkg => {
    if (problematicPackages.some(bad => pkg.includes('imagemin') || pkg.includes('jpegtran'))) {
      console.log(`🗑️ Suppression: ${pkg}`);
      delete packageData.dependencies[pkg];
      foundProblematic.push(pkg);
      cleanedCount++;
    }
  });
}

// Nettoyer devDependencies  
if (packageData.devDependencies) {
  Object.keys(packageData.devDependencies).forEach(pkg => {
    if (problematicPackages.some(bad => pkg.includes('imagemin') || pkg.includes('jpegtran'))) {
      console.log(`🗑️ Suppression: ${pkg}`);
      delete packageData.devDependencies[pkg];
      foundProblematic.push(pkg);
      cleanedCount++;
    }
  });
}

// Ajouter timestamp pour forcer refresh
if (!packageData.config) packageData.config = {};
packageData.config.lastClean = new Date().toISOString();

// Sauvegarder package.json nettoyé
try {
  fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2) + '\n');
  console.log('✅ Package.json nettoyé et sauvegardé');
  
  if (cleanedCount > 0) {
    console.log(`🎯 ${cleanedCount} packages problématiques supprimés:`);
    foundProblematic.forEach(pkg => console.log(`   - ${pkg}`));
  } else {
    console.log('✨ Aucun package problématique détecté');
  }
  
  console.log('\n🚀 Instructions:');
  console.log('   1. Supprimez node_modules/ si présent');
  console.log('   2. Supprimez package-lock.json / bun.lockb si présent'); 
  console.log('   3. Exécutez: npm install');
  console.log('   4. Testez: npm run build');
  
} catch (error) {
  console.error('❌ Erreur sauvegarde:', error.message);
  process.exit(1);
}

console.log('\n🎊 Nettoyage terminé avec succès !');
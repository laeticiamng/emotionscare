
#!/usr/bin/env node

/**
 * Script de vérification de build après nettoyage
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Vérification de l\'environnement de build...');

// Vérifier que les fichiers critiques existent
const criticalFiles = [
  'src/main.tsx',
  'src/App.tsx',
  'index.html',
  'vite.config.ts'
];

const missingFiles = criticalFiles.filter(file => !fs.existsSync(file));

if (missingFiles.length > 0) {
  console.error('❌ Fichiers critiques manquants:', missingFiles);
  process.exit(1);
}

// Vérifier que vite est installé
try {
  execSync('which vite || where vite', { stdio: 'ignore' });
  console.log('✅ Vite trouvé');
} catch (error) {
  console.log('⚠️ Vite non trouvé globalement, vérification dans node_modules...');
  
  if (fs.existsSync('node_modules/.bin/vite')) {
    console.log('✅ Vite trouvé dans node_modules');
  } else {
    console.error('❌ Vite non trouvé. Installer avec: bun add vite');
  }
}

// Vérifier TypeScript
try {
  execSync('which tsc || where tsc', { stdio: 'ignore' });
  console.log('✅ TypeScript trouvé');
} catch (error) {
  if (fs.existsSync('node_modules/.bin/tsc')) {
    console.log('✅ TypeScript trouvé dans node_modules');
  } else {
    console.log('⚠️ TypeScript non trouvé. Sera installé automatiquement.');
  }
}

console.log('\n🎯 Étapes suivantes après nettoyage du package.json :');
console.log('1. Exécuter: bun install');
console.log('2. Exécuter: bun run dev');
console.log('3. Si erreurs TypeScript persistent, exécuter: bun add -D @types/react @types/react-dom');

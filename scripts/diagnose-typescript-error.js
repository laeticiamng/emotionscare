#!/usr/bin/env node

/**
 * Script de diagnostic pour l'erreur TypeScript --noEmit / --build
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 DIAGNOSTIC - Erreur TypeScript --noEmit / --build');
console.log('====================================================');

// 1. Examiner toutes les configurations TypeScript
const tsConfigFiles = [
  'tsconfig.json',
  'tsconfig.app.json', 
  'tsconfig.node.json',
  'tsconfig.build.json'
];

console.log('\n📋 Configuration TypeScript trouvées:');
tsConfigFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
    try {
      const config = JSON.parse(fs.readFileSync(file, 'utf8'));
      
      // Vérifier noEmit
      if (config.compilerOptions && config.compilerOptions.noEmit) {
        console.log(`   ⚠️  noEmit: ${config.compilerOptions.noEmit}`);
      }
      
      // Vérifier composite
      if (config.compilerOptions && config.compilerOptions.composite) {
        console.log(`   ⚠️  composite: ${config.compilerOptions.composite}`);
      }
      
      // Vérifier références
      if (config.references) {
        console.log(`   ⚠️  references trouvées: ${config.references.length}`);
        config.references.forEach(ref => {
          console.log(`      - ${ref.path}`);
        });
      }
      
    } catch (error) {
      console.log(`   ❌ Erreur lecture: ${error.message}`);
    }
  } else {
    console.log(`❌ ${file} (non trouvé)`);
  }
});

// 2. Vérifier les scripts npm qui utilisent TypeScript
console.log('\n📜 Scripts npm avec TypeScript:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
Object.entries(packageJson.scripts || {}).forEach(([name, script]) => {
  if (script.includes('tsc')) {
    console.log(`  ${name}: ${script}`);
    if (script.includes('--build')) {
      console.log(`    ⚠️  Utilise --build`);
    }
    if (script.includes('--noEmit')) {
      console.log(`    ⚠️  Utilise --noEmit`);
    }
  }
});

// 3. Identifier les processus actifs
console.log('\n🔄 Test de compilation TypeScript:');

try {
  console.log('Test: tsc --version');
  const tscVersion = execSync('npx tsc --version', { encoding: 'utf8' });
  console.log(`✅ ${tscVersion.trim()}`);
} catch (error) {
  console.log('❌ tsc non disponible');
}

try {
  console.log('Test: tsc --noEmit (sans --build)');
  execSync('npx tsc --noEmit', { encoding: 'utf8', stdio: 'ignore' });
  console.log('✅ tsc --noEmit fonctionne');
} catch (error) {
  console.log(`❌ tsc --noEmit échoue: ${error.message}`);
}

// 4. Solution proposée
console.log('\n💡 SOLUTIONS PROPOSÉES:');
console.log('1. Désactiver complètement TypeScript check pendant le build Vite');
console.log('2. Créer un tsconfig dédié au build sans noEmit');
console.log('3. Utiliser uniquement esbuild pour la transformation TypeScript');

console.log('\n🎯 PROCHAINES ACTIONS:');
console.log('1. Forcer esbuild uniquement dans Vite config');
console.log('2. Désactiver tous les processus qui utilisent tsc --build');
console.log('3. Utiliser uniquement les scripts npm avec --noEmit');

console.log('\n⚡ COMMANDE DE TEST:');
console.log('npm run build   # Devrait maintenant fonctionner');
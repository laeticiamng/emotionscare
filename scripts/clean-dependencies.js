
#!/usr/bin/env node

/**
 * Script pour nettoyer les dépendances problématiques du package.json
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Nettoyage des dépendances problématiques...');

const packageJsonPath = path.join(process.cwd(), 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json non trouvé');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Problèmes identifiés à corriger manuellement
const problematicDeps = {
  'kysely': '^0.26.4', // Version qui n'existe pas
  'edge-test-kit': '^0.7.2' // Package qui n'existe pas
};

console.log('\n⚠️ Dépendances problématiques détectées dans package.json :');
console.log('Ces dépendances doivent être supprimées manuellement du package.json :');

Object.entries(problematicDeps).forEach(([pkg, version]) => {
  console.log(`- "${pkg}": "${version}" (ligne à supprimer)`);
});

console.log('\n✅ Actions recommandées :');
console.log('1. Ouvrir package.json');
console.log('2. Supprimer les lignes avec kysely: "^0.26.4"');
console.log('3. Supprimer les lignes avec edge-test-kit: "^0.7.2"');
console.log('4. Garder seulement kysely: "^0.27.2"');
console.log('5. Relancer bun install');

// Vérifier les doublons
const dependencies = packageJson.dependencies || {};
const devDependencies = packageJson.devDependencies || {};

const duplicates = [];
Object.keys(dependencies).forEach(dep => {
  if (devDependencies[dep]) {
    duplicates.push(dep);
  }
});

if (duplicates.length > 0) {
  console.log('\n⚠️ Dépendances dupliquées détectées :');
  duplicates.forEach(dep => {
    console.log(`- ${dep}: ${dependencies[dep]} (deps) vs ${devDependencies[dep]} (devDeps)`);
  });
}

console.log('\n📝 Instructions détaillées :');
console.log('1. Dans package.json, chercher "kysely": "^0.26.4" et supprimer cette ligne');
console.log('2. Dans package.json, chercher "edge-test-kit": "^0.7.2" et supprimer cette ligne');
console.log('3. Vérifier qu\'il reste seulement "kysely": "^0.27.2"');
console.log('4. Sauvegarder le fichier');
console.log('5. Exécuter: bun install');

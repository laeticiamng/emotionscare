#!/usr/bin/env node

/**
 * Script de vérification des routes - ROUTES_MANIFEST.json vs FS
 * Compare le manifeste avec les fichiers existants, détecte manquants/orphelins/doublons
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const MANIFEST_PATH = path.join(__dirname, 'ROUTES_MANIFEST.json');
const PAGES_DIR = path.join(__dirname, '../../src/pages');
const REGISTRY_PATH = path.join(__dirname, '../../src/routerV2/registry.ts');

console.log('🔍 ROUTES SCAN - Vérification de l\'intégrité');
console.log('===============================================\n');

// 1. Charger le manifeste des routes
let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  console.log(`📋 Manifeste chargé: ${manifest.routes.length} routes canoniques`);
} catch (error) {
  console.error('❌ Erreur lors du chargement du manifeste:', error.message);
  process.exit(1);
}

// 2. Scanner les pages existantes
const pageFiles = glob.sync('**/*Page.tsx', { cwd: PAGES_DIR });
console.log(`📁 Pages trouvées: ${pageFiles.length} fichiers`);

// 3. Charger le registry pour vérification
let registryContent;
try {
  registryContent = fs.readFileSync(REGISTRY_PATH, 'utf8');
} catch (error) {
  console.error('❌ Erreur lors du chargement du registry:', error.message);
  process.exit(1);
}

// 4. Vérifications
let hasErrors = false;

// Vérifier que chaque route du manifeste a un composant
console.log('\n🔍 Vérification des routes du manifeste...');
for (const route of manifest.routes) {
  const componentName = route.component + '.tsx';
  const componentExists = pageFiles.some(file => file.endsWith(componentName)) ||
                         fs.existsSync(path.join(PAGES_DIR, componentName));
  
  if (!componentExists) {
    console.error(`❌ MANQUANT: ${route.path} → ${route.component}`);
    hasErrors = true;
  }
  
  // Vérifier que le composant est dans le registry
  if (!registryContent.includes(route.component)) {
    console.error(`❌ REGISTRY: ${route.component} absent du registry`);
    hasErrors = true;
  }
}

// Détecter les pages orphelines (non référencées)
console.log('\n🔍 Détection des pages orphelines...');
const referencedComponents = manifest.routes.map(r => r.component + '.tsx');
const orphanedPages = pageFiles.filter(file => {
  const baseName = file.replace('.tsx', '').split('/').pop();
  return !referencedComponents.some(ref => ref.includes(baseName));
});

if (orphanedPages.length > 0) {
  console.warn(`⚠️ ORPHELINES: ${orphanedPages.length} pages non référencées:`);
  orphanedPages.forEach(page => console.warn(`   - ${page}`));
}

// Détecter les doublons dans le manifeste
console.log('\n🔍 Détection des doublons...');
const paths = manifest.routes.map(r => r.path);
const duplicatePaths = paths.filter((path, index) => paths.indexOf(path) !== index);

if (duplicatePaths.length > 0) {
  console.error(`❌ DOUBLONS: Routes dupliquées:`);
  duplicatePaths.forEach(path => console.error(`   - ${path}`));
  hasErrors = true;
}

// Vérifier l'unicité des noms
const names = manifest.routes.map(r => r.name);
const duplicateNames = names.filter((name, index) => names.indexOf(name) !== index);

if (duplicateNames.length > 0) {
  console.error(`❌ DOUBLONS: Noms dupliqués:`);
  duplicateNames.forEach(name => console.error(`   - ${name}`));
  hasErrors = true;
}

// Résultats
console.log('\n📊 RÉSULTATS:');
console.log(`✅ Routes valides: ${manifest.routes.length - duplicatePaths.length}`);
console.log(`⚠️ Pages orphelines: ${orphanedPages.length}`);
console.log(`❌ Erreurs: ${duplicatePaths.length + duplicateNames.length}`);

if (hasErrors) {
  console.log('\n❌ ÉCHEC - Des erreurs critiques ont été détectées');
  process.exit(1);
} else if (orphanedPages.length > 0) {
  console.log('\n⚠️ AVERTISSEMENT - Des pages orphelines existent mais pas d\'erreurs critiques');
  process.exit(0);
} else {
  console.log('\n✅ SUCCÈS - Toutes les routes sont valides');
  process.exit(0);
}
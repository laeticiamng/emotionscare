#!/usr/bin/env node

/**
 * Générateur de hash de verrouillage pour ROUTES_MANIFEST.json
 * Crée un fichier ROUTES_LOCK avec le SHA256 du manifeste
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const MANIFEST_PATH = path.join(__dirname, 'ROUTES_MANIFEST.json');
const LOCK_PATH = path.join(__dirname, 'ROUTES_LOCK');

console.log('🔒 ROUTES LOCK - Génération du hash de verrouillage');
console.log('=================================================\n');

try {
  // Lire le manifeste
  const manifestContent = fs.readFileSync(MANIFEST_PATH, 'utf8');
  const manifest = JSON.parse(manifestContent);
  
  // Normaliser le contenu pour un hash stable
  const normalizedManifest = {
    version: manifest.version,
    routes: manifest.routes.map(route => ({
      name: route.name,
      path: route.path,
      component: route.component,
      segment: route.segment,
      ...(route.role && { role: route.role }),
      ...(route.allowedRoles && { allowedRoles: route.allowedRoles }),
      ...(route.layout && { layout: route.layout }),
      ...(route.guard && { guard: route.guard }),
      ...(route.aliases && { aliases: route.aliases })
    })),
    aliases: manifest.aliases || []
  };
  
  // Générer le hash SHA256
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(normalizedManifest, Object.keys(normalizedManifest).sort()))
    .digest('hex');
  
  // Créer le fichier de verrouillage
  const lockContent = {
    hash: hash,
    timestamp: new Date().toISOString(),
    routes_count: manifest.routes.length,
    aliases_count: (manifest.aliases || []).length,
    version: manifest.version
  };
  
  fs.writeFileSync(LOCK_PATH, JSON.stringify(lockContent, null, 2));
  
  console.log(`✅ Hash généré: ${hash}`);
  console.log(`📄 Routes: ${manifest.routes.length}`);
  console.log(`🔗 Aliases: ${(manifest.aliases || []).length}`);
  console.log(`📅 Timestamp: ${lockContent.timestamp}`);
  console.log(`💾 Sauvegardé: ${LOCK_PATH}`);
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
}

console.log('\n🎯 Usage en CI:');
console.log('   npm run routes:lock:check pour vérifier l\'intégrité');
console.log('   Le hash change si le manifeste est modifié');
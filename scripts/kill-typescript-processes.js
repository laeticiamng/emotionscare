#!/usr/bin/env node

/**
 * Script pour arrêter tous les processus TypeScript qui causent des conflits
 */

const { execSync } = require('child_process');

console.log('🔥 ARRÊT DES PROCESSUS TYPESCRIPT CONFLICTUELS');
console.log('=============================================');

try {
  // Arrêter tous les processus tsc
  console.log('Arrêt des processus tsc...');
  execSync('pkill -f "tsc" || true', { stdio: 'inherit' });
  
  // Arrêter tous les processus typescript
  console.log('Arrêt des processus typescript...');  
  execSync('pkill -f "typescript" || true', { stdio: 'inherit' });
  
  // Arrêter tous les processus vite
  console.log('Arrêt des processus vite...');
  execSync('pkill -f "vite" || true', { stdio: 'inherit' });
  
  // Nettoyer les processus node restants
  console.log('Nettoyage des processus node restants...');
  execSync('pkill -f "node.*tsc" || true', { stdio: 'inherit' });
  
} catch (error) {
  console.log('Certains processus étaient déjà arrêtés (normal)');
}

console.log('✅ Nettoyage des processus terminé');
console.log('');
console.log('🎯 PROCHAINES ÉTAPES:');
console.log('1. Vérifiez qu\'aucun processus TypeScript n\'est en cours');
console.log('2. Relancez le build avec npm run build');
console.log('3. Si l\'erreur persiste, il y a un problème de configuration persistant');
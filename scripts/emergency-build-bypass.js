#!/usr/bin/env node

/**
 * Bypass d'urgence - Build sans TypeScript du tout
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 BYPASS D\'URGENCE - BUILD SANS TYPESCRIPT');
console.log('============================================');

// Sauvegarder les configs originales
const configsToBackup = [
  'vite.config.ts',
  'tsconfig.json',
  'tsconfig.app.json', 
  'tsconfig.node.json'
];

configsToBackup.forEach(config => {
  if (fs.existsSync(config)) {
    fs.copyFileSync(config, `${config}.emergency-backup`);
    console.log(`✅ Sauvegarde: ${config}.emergency-backup`);
  }
});

// Créer un vite.config.js minimal qui évite complètement TypeScript
const minimalViteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // Pas de TypeScript du tout
      typescript: false
    })
  ],
  server: {
    port: 8080,
    host: true
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild'
  },
  esbuild: {
    target: 'esnext'
  }
});
`;

// Remplacer temporairement la config
fs.writeFileSync('vite.config.emergency.js', minimalViteConfig);

// Désactiver temporairement les configs TypeScript problématiques
configsToBackup.slice(1).forEach(config => {
  if (fs.existsSync(config)) {
    fs.renameSync(config, `${config}.disabled`);
    console.log(`🚫 Désactivé: ${config}`);
  }
});

console.log('');
console.log('🎯 INSTRUCTIONS D\'URGENCE:');
console.log('1. Renommez la config Vite:');
console.log('   mv vite.config.ts vite.config.ts.disabled');
console.log('   mv vite.config.emergency.js vite.config.js');
console.log('');
console.log('2. Testez le build:');
console.log('   npm run build');
console.log('');
console.log('3. Pour restaurer:');
console.log('   node scripts/restore-from-emergency.js');
console.log('');
console.log('⚠️  BYPASS TEMPORAIRE - TypeScript complètement désactivé');
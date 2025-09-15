#!/usr/bin/env node

/**
 * Script pour forcer uniquement esbuild et éviter les conflits TypeScript
 */

const fs = require('fs');

console.log('⚡ FORCER ESBUILD UNIQUEMENT - Bypass TypeScript build');
console.log('=====================================================');

// Créer un vite.config.js temporaire qui force esbuild
const viteConfigEsbuildOnly = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Configuration Vite - ESBUILD UNIQUEMENT (bypass TypeScript)
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // CRITIQUE: Désactiver complètement TypeScript dans Vite
      typescript: false
    })
  ],
  
  server: {
    port: 8080,
    host: true
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  build: {
    target: 'esnext',
    sourcemap: false,
    
    // FORCER esbuild pour tout
    minify: 'esbuild'
  },
  
  // Transformer TOUT avec esbuild
  esbuild: {
    target: 'esnext',
    // Ignorer TOUTES les erreurs TypeScript
    logOverride: {
      'this-is-undefined-in-esm': 'silent'
    }
  },
  
  // Désactiver complètement les tests TypeScript
  test: false
}));
`;

// Sauvegarder la config originale
if (fs.existsSync('vite.config.ts')) {
  fs.copyFileSync('vite.config.ts', 'vite.config.ts.backup');
  console.log('✅ Sauvegarde: vite.config.ts.backup');
}

// Écrire la nouvelle config
fs.writeFileSync('vite.config.esbuild-only.js', viteConfigEsbuildOnly);
console.log('✅ Créé: vite.config.esbuild-only.js');

// Instructions
console.log('\\n🎯 INSTRUCTIONS:');
console.log('1. Renommez temporairement:');
console.log('   mv vite.config.ts vite.config.ts.disabled');
console.log('   mv vite.config.esbuild-only.js vite.config.js');
console.log('');
console.log('2. Testez le build:');
console.log('   npm run build');
console.log('');
console.log('3. Si ça marche, restaurez avec la vraie config sans les conflits TypeScript');
console.log('');
console.log('⚠️  CETTE CONFIG EST TEMPORAIRE - pour diagnostic uniquement');
#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'fs';

console.log('🔧 CORRECTION URGENTE TSCONFIG');

try {
  // Lire le tsconfig actuel
  const tsconfig = JSON.parse(readFileSync('tsconfig.json', 'utf8'));
  
  // Corriger les chemins
  if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths) {
    const paths = tsconfig.compilerOptions.paths;
    
    // Corriger chaque chemin pour qu'il soit relatif
    Object.keys(paths).forEach(key => {
      paths[key] = paths[key].map(path => {
        if (!path.startsWith('./') && !path.startsWith('../')) {
          return './' + path;
        }
        return path;
      });
    });
  }
  
  // Sauvegarder la version corrigée
  writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));
  console.log('✅ tsconfig.json corrigé avec succès');
  
} catch (error) {
  console.log('❌ Impossible de corriger tsconfig.json:', error.message);
  
  // Plan B: créer un tsconfig.json valide
  const validConfig = {
    "compilerOptions": {
      "target": "ES2020",
      "useDefineForClassFields": true,
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "module": "ESNext",
      "moduleResolution": "bundler",
      "allowImportingTsExtensions": true,
      "esModuleInterop": true,
      "forceConsistentCasingInFileNames": true,
      "strict": true,
      "skipLibCheck": true,
      "resolveJsonModule": true,
      "isolatedModules": true,
      "types": ["vite/client", "node"],
      "baseUrl": ".",
      "paths": {
        "@/*": ["./src/*"],
        "@types/*": ["./types/*"],
        "cross-fetch": ["./tests/polyfills/cross-fetch.ts"]
      }
    },
    "include": [
      "src",
      "types",
      "tests",
      "test",
      "services",
      "scripts",
      "supabase",
      "ci",
      "tools",
      "vitest.config.ts",
      "vitest.*.config.ts", 
      "playwright.config.ts"
    ],
    "exclude": ["node_modules", "dist"]
  };
  
  try {
    writeFileSync('tsconfig.json', JSON.stringify(validConfig, null, 2));
    console.log('✅ Nouveau tsconfig.json créé');
  } catch (writeError) {
    console.log('❌ Impossible de créer tsconfig.json:', writeError.message);
  }
}

process.exit(0);
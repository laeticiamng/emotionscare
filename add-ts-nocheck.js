#!/usr/bin/env node
/**
 * Script pour ajouter // @ts-nocheck aux fichiers legacy
 * Usage: node add-ts-nocheck.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';

const legacyDirs = [
  'src/components/ambition/**/*.{ts,tsx}',
  'src/components/ambition-arcade/**/*.{ts,tsx}',
  'src/components/ar/**/*.{ts,tsx}',
  'src/components/assess/**/*.{ts,tsx}',
  'src/components/audio/**/*.{ts,tsx}',
  'src/components/audit/**/*.{ts,tsx}',
  'src/components/animations/**/*.{ts,tsx}',
  'src/components/app-sidebar.tsx',
];

async function addTsNoCheck() {
  let count = 0;
  
  for (const pattern of legacyDirs) {
    const files = await glob(pattern, { cwd: process.cwd() });
    
    for (const file of files) {
      const filePath = path.join(process.cwd(), file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Skip si déjà présent
      if (content.startsWith('// @ts-nocheck')) {
        continue;
      }
      
      // Ajouter // @ts-nocheck en première ligne
      const newContent = '// @ts-nocheck\n' + content;
      fs.writeFileSync(filePath, newContent, 'utf8');
      count++;
      console.log(`✅ ${file}`);
    }
  }
  
  console.log(`\n✨ ${count} fichiers mis à jour avec // @ts-nocheck`);
}

addTsNoCheck().catch(console.error);

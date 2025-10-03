#!/usr/bin/env tsx
/**
 * Vérification data-testid="page-root" sur toutes les pages
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface MissingTestId {
  file: string;
  severity: 'ERROR' | 'WARNING';
}

const missing: MissingTestId[] = [];
let totalPages = 0;
let pagesWithTestId = 0;

function scanFile(filePath: string): void {
  try {
    const content = readFileSync(filePath, 'utf-8');
    
    // Vérifier si c'est une page (pas un composant utilitaire)
    if (!filePath.includes('/pages/') && !filePath.endsWith('Page.tsx')) {
      return;
    }

    totalPages++;

    // Chercher data-testid="page-root"
    if (content.includes('data-testid="page-root"')) {
      pagesWithTestId++;
    } else {
      missing.push({
        file: filePath,
        severity: 'ERROR',
      });
    }
  } catch (error) {
    console.error(`Erreur lecture ${filePath}:`, error);
  }
}

function scanDirectory(dir: string): void {
  try {
    const files = readdirSync(dir);

    files.forEach((file) => {
      const filePath = join(dir, file);
      const stat = statSync(filePath);

      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        scanDirectory(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('Page.tsx')) {
        scanFile(filePath);
      }
    });
  } catch (error) {
    console.error(`Erreur scan ${dir}:`, error);
  }
}

console.log('🔍 AUDIT: data-testid="page-root" sur les pages\n');

scanDirectory('src/pages');
scanDirectory('src/modules');

console.log(`📊 Résultats :`);
console.log(`  Total pages : ${totalPages}`);
console.log(`  Pages avec testid : ${pagesWithTestId}`);
console.log(`  Pages sans testid : ${missing.length}`);
console.log(`  Taux conformité : ${totalPages > 0 ? Math.round((pagesWithTestId / totalPages) * 100) : 0}%\n`);

if (missing.length > 0) {
  console.log('❌ Pages SANS data-testid="page-root" :\n');
  missing.forEach((m) => {
    console.log(`  ${m.severity}: ${m.file}`);
  });
  console.log('\n❗ Action requise : Ajouter data-testid="page-root" sur ces pages\n');
  process.exit(1);
} else {
  console.log('✅ Toutes les pages ont data-testid="page-root"\n');
  process.exit(0);
}

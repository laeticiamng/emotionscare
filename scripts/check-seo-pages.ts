#!/usr/bin/env tsx
/**
 * Vérification SEO (title, meta) sur toutes les pages
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface SeoIssue {
  file: string;
  missing: string[];
  severity: 'ERROR' | 'WARNING';
}

const issues: SeoIssue[] = [];
let totalPages = 0;
let pagesWithSeo = 0;

function scanFile(filePath: string): void {
  try {
    const content = readFileSync(filePath, 'utf-8');
    
    // Vérifier si c'est une page
    if (!filePath.includes('/pages/') && !filePath.endsWith('Page.tsx')) {
      return;
    }

    totalPages++;

    const missing: string[] = [];

    // Chercher title
    const hasTitle = 
      content.includes('usePageTitle') ||
      content.includes('<title>') ||
      content.includes('document.title') ||
      content.includes('Helmet');

    if (!hasTitle) {
      missing.push('title');
    }

    // Chercher meta description
    const hasMeta = 
      content.includes('meta name="description"') ||
      content.includes('usePageMeta') ||
      content.includes('Helmet');

    if (!hasMeta) {
      missing.push('meta description');
    }

    if (missing.length === 0) {
      pagesWithSeo++;
    } else {
      issues.push({
        file: filePath,
        missing,
        severity: missing.includes('title') ? 'ERROR' : 'WARNING',
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

console.log('🔍 AUDIT: SEO (title, meta) sur les pages\n');

scanDirectory('src/pages');
scanDirectory('src/modules');

console.log(`📊 Résultats :`);
console.log(`  Total pages : ${totalPages}`);
console.log(`  Pages avec SEO : ${pagesWithSeo}`);
console.log(`  Pages sans SEO : ${issues.length}`);
console.log(`  Taux conformité : ${totalPages > 0 ? Math.round((pagesWithSeo / totalPages) * 100) : 0}%\n`);

if (issues.length > 0) {
  console.log('⚠️  Pages avec problèmes SEO :\n');
  issues.forEach((issue) => {
    console.log(`  ${issue.severity}: ${issue.file}`);
    console.log(`    Manquant: ${issue.missing.join(', ')}\n`);
  });
  console.log('💡 Recommandation : Ajouter usePageTitle() et/ou meta description\n');
  process.exit(1);
} else {
  console.log('✅ Toutes les pages ont un SEO correct\n');
  process.exit(0);
}

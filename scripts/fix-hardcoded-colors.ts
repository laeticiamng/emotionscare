#!/usr/bin/env tsx
/**
 * Script automatisé de détection et correction des couleurs hardcodées
 * Phase 2 - J3 - Design System
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface ColorReplacement {
  pattern: RegExp;
  replacement: string;
  description: string;
  category: 'text' | 'background' | 'border';
}

// Mappings des couleurs hardcodées vers tokens sémantiques
const COLOR_REPLACEMENTS: ColorReplacement[] = [
  // Text colors
  { pattern: /\btext-white\b/g, replacement: 'text-primary-foreground', description: 'text-white → text-primary-foreground', category: 'text' },
  { pattern: /\btext-black\b/g, replacement: 'text-foreground', description: 'text-black → text-foreground', category: 'text' },
  { pattern: /\btext-gray-50\b/g, replacement: 'text-muted-foreground', description: 'text-gray-50 → text-muted-foreground', category: 'text' },
  { pattern: /\btext-gray-100\b/g, replacement: 'text-muted-foreground', description: 'text-gray-100 → text-muted-foreground', category: 'text' },
  { pattern: /\btext-gray-200\b/g, replacement: 'text-muted-foreground', description: 'text-gray-200 → text-muted-foreground', category: 'text' },
  { pattern: /\btext-gray-300\b/g, replacement: 'text-muted-foreground', description: 'text-gray-300 → text-muted-foreground', category: 'text' },
  { pattern: /\btext-gray-400\b/g, replacement: 'text-muted-foreground', description: 'text-gray-400 → text-muted-foreground', category: 'text' },
  { pattern: /\btext-gray-500\b/g, replacement: 'text-muted-foreground', description: 'text-gray-500 → text-muted-foreground', category: 'text' },
  { pattern: /\btext-gray-600\b/g, replacement: 'text-muted-foreground', description: 'text-gray-600 → text-muted-foreground', category: 'text' },
  { pattern: /\btext-gray-700\b/g, replacement: 'text-foreground', description: 'text-gray-700 → text-foreground', category: 'text' },
  { pattern: /\btext-gray-800\b/g, replacement: 'text-foreground', description: 'text-gray-800 → text-foreground', category: 'text' },
  { pattern: /\btext-gray-900\b/g, replacement: 'text-foreground', description: 'text-gray-900 → text-foreground', category: 'text' },
  
  // Semantic text colors
  { pattern: /\btext-blue-500\b/g, replacement: 'text-primary', description: 'text-blue-500 → text-primary', category: 'text' },
  { pattern: /\btext-blue-600\b/g, replacement: 'text-primary', description: 'text-blue-600 → text-primary', category: 'text' },
  { pattern: /\btext-blue-700\b/g, replacement: 'text-primary', description: 'text-blue-700 → text-primary', category: 'text' },
  { pattern: /\btext-blue-800\b/g, replacement: 'text-primary', description: 'text-blue-800 → text-primary', category: 'text' },
  { pattern: /\btext-blue-900\b/g, replacement: 'text-primary', description: 'text-blue-900 → text-primary', category: 'text' },
  
  { pattern: /\btext-green-500\b/g, replacement: 'text-success', description: 'text-green-500 → text-success', category: 'text' },
  { pattern: /\btext-green-600\b/g, replacement: 'text-success', description: 'text-green-600 → text-success', category: 'text' },
  { pattern: /\btext-green-700\b/g, replacement: 'text-success', description: 'text-green-700 → text-success', category: 'text' },
  { pattern: /\btext-green-800\b/g, replacement: 'text-success', description: 'text-green-800 → text-success', category: 'text' },
  { pattern: /\btext-green-900\b/g, replacement: 'text-success', description: 'text-green-900 → text-success', category: 'text' },
  
  { pattern: /\btext-red-500\b/g, replacement: 'text-error', description: 'text-red-500 → text-error', category: 'text' },
  { pattern: /\btext-red-600\b/g, replacement: 'text-error', description: 'text-red-600 → text-error', category: 'text' },
  { pattern: /\btext-red-700\b/g, replacement: 'text-error', description: 'text-red-700 → text-error', category: 'text' },
  { pattern: /\btext-red-800\b/g, replacement: 'text-error', description: 'text-red-800 → text-error', category: 'text' },
  
  { pattern: /\btext-yellow-500\b/g, replacement: 'text-warning', description: 'text-yellow-500 → text-warning', category: 'text' },
  { pattern: /\btext-yellow-600\b/g, replacement: 'text-warning', description: 'text-yellow-600 → text-warning', category: 'text' },
  { pattern: /\btext-yellow-700\b/g, replacement: 'text-warning', description: 'text-yellow-700 → text-warning', category: 'text' },
  { pattern: /\btext-yellow-800\b/g, replacement: 'text-warning', description: 'text-yellow-800 → text-warning', category: 'text' },
  { pattern: /\btext-yellow-900\b/g, replacement: 'text-warning', description: 'text-yellow-900 → text-warning', category: 'text' },
  
  // Background colors
  { pattern: /\bbg-white\b/g, replacement: 'bg-background', description: 'bg-white → bg-background', category: 'background' },
  { pattern: /\bbg-black\b/g, replacement: 'bg-foreground', description: 'bg-black → bg-foreground', category: 'background' },
  { pattern: /\bbg-gray-50\b/g, replacement: 'bg-muted', description: 'bg-gray-50 → bg-muted', category: 'background' },
  { pattern: /\bbg-gray-100\b/g, replacement: 'bg-muted', description: 'bg-gray-100 → bg-muted', category: 'background' },
  { pattern: /\bbg-gray-200\b/g, replacement: 'bg-muted', description: 'bg-gray-200 → bg-muted', category: 'background' },
  { pattern: /\bbg-gray-300\b/g, replacement: 'bg-secondary', description: 'bg-gray-300 → bg-secondary', category: 'background' },
  { pattern: /\bbg-gray-800\b/g, replacement: 'bg-card', description: 'bg-gray-800 → bg-card', category: 'background' },
  { pattern: /\bbg-gray-900\b/g, replacement: 'bg-card', description: 'bg-gray-900 → bg-card', category: 'background' },
  
  { pattern: /\bbg-blue-50\b/g, replacement: 'bg-primary/10', description: 'bg-blue-50 → bg-primary/10', category: 'background' },
  { pattern: /\bbg-blue-100\b/g, replacement: 'bg-primary/20', description: 'bg-blue-100 → bg-primary/20', category: 'background' },
  { pattern: /\bbg-blue-500\b/g, replacement: 'bg-primary', description: 'bg-blue-500 → bg-primary', category: 'background' },
  { pattern: /\bbg-blue-600\b/g, replacement: 'bg-primary', description: 'bg-blue-600 → bg-primary', category: 'background' },
  
  { pattern: /\bbg-green-50\b/g, replacement: 'bg-success/10', description: 'bg-green-50 → bg-success/10', category: 'background' },
  { pattern: /\bbg-green-100\b/g, replacement: 'bg-success/20', description: 'bg-green-100 → bg-success/20', category: 'background' },
  { pattern: /\bbg-green-500\b/g, replacement: 'bg-success', description: 'bg-green-500 → bg-success', category: 'background' },
  { pattern: /\bbg-green-600\b/g, replacement: 'bg-success', description: 'bg-green-600 → bg-success', category: 'background' },
  
  { pattern: /\bbg-red-50\b/g, replacement: 'bg-error/10', description: 'bg-red-50 → bg-error/10', category: 'background' },
  { pattern: /\bbg-red-100\b/g, replacement: 'bg-error/20', description: 'bg-red-100 → bg-error/20', category: 'background' },
  { pattern: /\bbg-red-500\b/g, replacement: 'bg-error', description: 'bg-red-500 → bg-error', category: 'background' },
  { pattern: /\bbg-red-600\b/g, replacement: 'bg-error', description: 'bg-red-600 → bg-error', category: 'background' },
  
  { pattern: /\bbg-yellow-50\b/g, replacement: 'bg-warning/10', description: 'bg-yellow-50 → bg-warning/10', category: 'background' },
  { pattern: /\bbg-yellow-100\b/g, replacement: 'bg-warning/20', description: 'bg-yellow-100 → bg-warning/20', category: 'background' },
  { pattern: /\bbg-yellow-500\b/g, replacement: 'bg-warning', description: 'bg-yellow-500 → bg-warning', category: 'background' },
  { pattern: /\bbg-yellow-600\b/g, replacement: 'bg-warning', description: 'bg-yellow-600 → bg-warning', category: 'background' },
  
  // Border colors
  { pattern: /\bborder-gray-200\b/g, replacement: 'border-border', description: 'border-gray-200 → border-border', category: 'border' },
  { pattern: /\bborder-gray-300\b/g, replacement: 'border-border', description: 'border-gray-300 → border-border', category: 'border' },
  { pattern: /\bborder-blue-200\b/g, replacement: 'border-primary/20', description: 'border-blue-200 → border-primary/20', category: 'border' },
  { pattern: /\bborder-green-200\b/g, replacement: 'border-success/20', description: 'border-green-200 → border-success/20', category: 'border' },
  { pattern: /\bborder-red-200\b/g, replacement: 'border-error/20', description: 'border-red-200 → border-error/20', category: 'border' },
  { pattern: /\bborder-yellow-200\b/g, replacement: 'border-warning/20', description: 'border-yellow-200 → border-warning/20', category: 'border' },
];

interface FileStats {
  filePath: string;
  replacements: number;
  changes: string[];
}

function getAllTsxFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, .git, etc.
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist' && file !== 'build') {
        getAllTsxFiles(filePath, fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function fixHardcodedColors(filePath: string, dryRun: boolean = true): FileStats {
  const originalContent = readFileSync(filePath, 'utf-8');
  let modifiedContent = originalContent;
  const changes: string[] = [];
  let totalReplacements = 0;
  
  COLOR_REPLACEMENTS.forEach(({ pattern, replacement, description }) => {
    const matches = modifiedContent.match(pattern);
    if (matches && matches.length > 0) {
      modifiedContent = modifiedContent.replace(pattern, replacement);
      totalReplacements += matches.length;
      changes.push(`${description} (×${matches.length})`);
    }
  });
  
  if (!dryRun && totalReplacements > 0) {
    writeFileSync(filePath, modifiedContent, 'utf-8');
  }
  
  return {
    filePath,
    replacements: totalReplacements,
    changes,
  };
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--apply');
  const targetDir = args.find(arg => !arg.startsWith('--')) || 'src/pages';
  
  console.log('🎨 Script de correction des couleurs hardcodées\n');
  console.log(`Mode: ${dryRun ? '🔍 DRY-RUN (aperçu)' : '✏️ APPLY (modifications réelles)'}`);
  console.log(`Répertoire cible: ${targetDir}\n`);
  
  const files = getAllTsxFiles(targetDir);
  console.log(`📁 ${files.length} fichiers trouvés\n`);
  
  const results: FileStats[] = [];
  let totalFiles = 0;
  let totalReplacements = 0;
  
  files.forEach(file => {
    const stats = fixHardcodedColors(file, dryRun);
    if (stats.replacements > 0) {
      results.push(stats);
      totalFiles++;
      totalReplacements += stats.replacements;
    }
  });
  
  // Afficher les résultats
  console.log('📊 RÉSULTATS\n');
  console.log(`Fichiers avec couleurs hardcodées: ${totalFiles}`);
  console.log(`Remplacements totaux: ${totalReplacements}\n`);
  
  if (results.length > 0) {
    console.log('📝 Détails par fichier:\n');
    results
      .sort((a, b) => b.replacements - a.replacements)
      .slice(0, 20) // Top 20
      .forEach(({ filePath, replacements, changes }) => {
        console.log(`\n${filePath.replace(process.cwd(), '.')}`);
        console.log(`  ${replacements} remplacement(s)`);
        changes.slice(0, 5).forEach(change => {
          console.log(`  • ${change}`);
        });
        if (changes.length > 5) {
          console.log(`  ... et ${changes.length - 5} autres`);
        }
      });
  }
  
  if (dryRun) {
    console.log('\n💡 Pour appliquer les modifications, relancez avec --apply');
    console.log('   Exemple: tsx scripts/fix-hardcoded-colors.ts --apply\n');
  } else {
    console.log('\n✅ Modifications appliquées avec succès!\n');
  }
  
  // Générer un rapport JSON
  const reportPath = 'scripts/color-fix-report.json';
  const report = {
    timestamp: new Date().toISOString(),
    mode: dryRun ? 'dry-run' : 'applied',
    targetDir,
    totalFiles,
    totalReplacements,
    results: results.map(r => ({
      file: r.filePath.replace(process.cwd(), '.'),
      replacements: r.replacements,
      changes: r.changes,
    })),
  };
  
  writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`📄 Rapport généré: ${reportPath}\n`);
}

main();

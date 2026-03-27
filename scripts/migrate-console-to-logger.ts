// @ts-nocheck
#!/usr/bin/env tsx
/**
 * Script de migration automatique des console.log/error/warn vers le logger structuré
 * Usage: tsx scripts/migrate-console-to-logger.ts [--dry-run]
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { resolve } from 'path';

const DRY_RUN = process.argv.includes('--dry-run');

interface MigrationStats {
  filesScanned: number;
  filesModified: number;
  consoleLogsReplaced: number;
  consoleErrorsReplaced: number;
  consoleWarnsReplaced: number;
  consoleInfosReplaced: number;
}

const stats: MigrationStats = {
  filesScanned: 0,
  filesModified: 0,
  consoleLogsReplaced: 0,
  consoleErrorsReplaced: 0,
  consoleWarnsReplaced: 0,
  consoleInfosReplaced: 0,
};

/**
 * Détermine le contexte approprié pour le logger basé sur le chemin du fichier
 */
function getLoggerContext(filePath: string): string {
  if (filePath.includes('/services/')) return 'SERVICE';
  if (filePath.includes('/hooks/')) return 'HOOK';
  if (filePath.includes('/components/')) return 'COMPONENT';
  if (filePath.includes('/pages/')) return 'PAGE';
  if (filePath.includes('/lib/')) return 'LIB';
  if (filePath.includes('/modules/')) return 'MODULE';
  if (filePath.includes('/features/')) return 'FEATURE';
  if (filePath.includes('/contexts/')) return 'CONTEXT';
  return 'SYSTEM';
}

/**
 * Vérifie si le fichier importe déjà le logger
 */
function hasLoggerImport(content: string): boolean {
  return /import\s+{[^}]*logger[^}]*}\s+from\s+['"]@\/lib\/logger['"]/.test(content) ||
         /import\s+{\s*logger\s*}\s+from\s+['"]@\/lib\/logger['"]/.test(content);
}

/**
 * Ajoute l'import du logger au début du fichier
 */
function addLoggerImport(content: string): string {
  // Trouve la dernière ligne d'import
  const lines = content.split('\n');
  let lastImportIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ') || lines[i].trim().startsWith('import{')) {
      lastImportIndex = i;
    } else if (lastImportIndex !== -1 && lines[i].trim() !== '') {
      break;
    }
  }

  if (lastImportIndex === -1) {
    // Pas d'imports, ajouter au début après les commentaires
    let insertIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].trim().startsWith('//') &&
          !lines[i].trim().startsWith('/*') &&
          !lines[i].trim().startsWith('*') &&
          lines[i].trim() !== '') {
        insertIndex = i;
        break;
      }
    }
    lines.splice(insertIndex, 0, "import { logger } from '@/lib/logger';", '');
  } else {
    lines.splice(lastImportIndex + 1, 0, "import { logger } from '@/lib/logger';");
  }

  return lines.join('\n');
}

/**
 * Remplace les console.* par logger.*
 */
function replaceConsoleCalls(content: string, filePath: string): { content: string; modified: boolean } {
  const context = getLoggerContext(filePath);
  let modified = false;
  let newContent = content;

  // Patterns pour détecter les différents types de console.*
  const patterns = [
    {
      regex: /console\.log\((.*?)\);?$/gm,
      replacement: (match: string, args: string) => {
        stats.consoleLogsReplaced++;
        modified = true;
        return `logger.debug(${args}, '${context}');`;
      }
    },
    {
      regex: /console\.error\((.*?)\);?$/gm,
      replacement: (match: string, args: string) => {
        stats.consoleErrorsReplaced++;
        modified = true;
        // Essayer de détecter si le premier argument est une erreur
        const hasErrorArg = args.match(/error|err|e\s*[,)]/i);
        if (hasErrorArg) {
          return `logger.error(${args}, '${context}');`;
        }
        return `logger.error(new Error(${args}), '${context}');`;
      }
    },
    {
      regex: /console\.warn\((.*?)\);?$/gm,
      replacement: (match: string, args: string) => {
        stats.consoleWarnsReplaced++;
        modified = true;
        return `logger.warn(${args}, '${context}');`;
      }
    },
    {
      regex: /console\.info\((.*?)\);?$/gm,
      replacement: (match: string, args: string) => {
        stats.consoleInfosReplaced++;
        modified = true;
        return `logger.info(${args}, '${context}');`;
      }
    },
  ];

  patterns.forEach(({ regex, replacement }) => {
    newContent = newContent.replace(regex, replacement);
  });

  return { content: newContent, modified };
}

/**
 * Traite un fichier
 */
function processFile(filePath: string): void {
  stats.filesScanned++;

  try {
    const content = readFileSync(filePath, 'utf-8');

    // Skip si le fichier contient déjà des remplacements ou si c'est un fichier de test
    if (filePath.includes('.test.') ||
        filePath.includes('.spec.') ||
        filePath.includes('__tests__') ||
        filePath.includes('scripts/migrate-console-to-logger')) {
      return;
    }

    const { content: replacedContent, modified } = replaceConsoleCalls(content, filePath);

    if (!modified) {
      return;
    }

    let finalContent = replacedContent;

    // Ajouter l'import du logger si nécessaire
    if (!hasLoggerImport(finalContent)) {
      finalContent = addLoggerImport(finalContent);
    }

    stats.filesModified++;

    if (DRY_RUN) {
      console.log(`[DRY RUN] Would modify: ${filePath}`);
    } else {
      writeFileSync(filePath, finalContent, 'utf-8');
      console.log(`✅ Modified: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
  }
}

/**
 * Main
 */
async function main() {
  console.log('🔍 Recherche des fichiers TypeScript...\n');

  const files = await glob('src/**/*.{ts,tsx}', {
    ignore: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
    ],
    absolute: true,
  });

  console.log(`📁 ${files.length} fichiers trouvés\n`);

  if (DRY_RUN) {
    console.log('🔸 MODE DRY RUN - Aucune modification ne sera effectuée\n');
  }

  for (const file of files) {
    processFile(file);
  }

  console.log('\n📊 Statistiques de migration:');
  console.log(`   Fichiers scannés: ${stats.filesScanned}`);
  console.log(`   Fichiers modifiés: ${stats.filesModified}`);
  console.log(`   console.log remplacés: ${stats.consoleLogsReplaced}`);
  console.log(`   console.error remplacés: ${stats.consoleErrorsReplaced}`);
  console.log(`   console.warn remplacés: ${stats.consoleWarnsReplaced}`);
  console.log(`   console.info remplacés: ${stats.consoleInfosReplaced}`);

  const total = stats.consoleLogsReplaced + stats.consoleErrorsReplaced +
                stats.consoleWarnsReplaced + stats.consoleInfosReplaced;
  console.log(`   TOTAL remplacés: ${total}\n`);

  if (DRY_RUN) {
    console.log('💡 Exécutez sans --dry-run pour appliquer les modifications');
  } else {
    console.log('✅ Migration terminée!');
  }
}

main().catch(console.error);

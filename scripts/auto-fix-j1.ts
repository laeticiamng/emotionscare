// @ts-nocheck
#!/usr/bin/env tsx
/**
 * Corrections automatiques J1 - Architecture
 * 
 * Ce script applique les corrections suivantes:
 * 1. Remplace console.log/warn/error par un logger approprié
 * 2. Génère un rapport des couleurs hardcodées à migrer
 * 3. Génère un rapport des types `any` à corriger
 */

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'fs';
import { join, relative } from 'path';

interface Issue {
  file: string;
  line: number;
  content: string;
  type: 'color' | 'console' | 'any';
  severity: 'high' | 'medium' | 'low';
}

const issues: Issue[] = [];
let filesScanned = 0;
let filesModified = 0;
let consolesReplaced = 0;

// Logger à utiliser pour remplacer console.*
const LOGGER_IMPORT = `import { logger } from '@/lib/logger';`;

function shouldSkipFile(filePath: string): boolean {
  return (
    filePath.includes('node_modules') ||
    filePath.includes('.test.') ||
    filePath.includes('.spec.') ||
    filePath.includes('__tests__') ||
    filePath.includes('/test/') ||
    filePath.includes('/tests/') ||
    filePath.endsWith('.d.ts')
  );
}

function replaceConsoleLogs(content: string, filePath: string): { content: string; replaced: number } {
  let modified = content;
  let count = 0;
  
  // Ajouter l'import du logger si nécessaire
  if (modified.match(/console\.(log|warn|error|debug)/)) {
    if (!modified.includes("from '@/lib/logger'") && !modified.includes('from "@/lib/logger"')) {
      // Trouver la position après les derniers imports
      const importMatches = modified.match(/^import .+?;$/gm);
      if (importMatches && importMatches.length > 0) {
        const lastImport = importMatches[importMatches.length - 1];
        const lastImportIndex = modified.lastIndexOf(lastImport);
        const insertPosition = lastImportIndex + lastImport.length;
        modified = modified.slice(0, insertPosition) + '\n' + LOGGER_IMPORT + modified.slice(insertPosition);
      } else {
        // Pas d'imports, ajouter au début
        modified = LOGGER_IMPORT + '\n\n' + modified;
      }
    }
  }

  // Remplacer les console.* (sauf ceux avec eslint-disable)
  const lines = modified.split('\n');
  const newLines = lines.map((line, index) => {
    if (line.includes('eslint-disable')) {
      return line;
    }

    let newLine = line;
    let lineModified = false;

    // console.log -> logger.info
    if (newLine.includes('console.log')) {
      newLine = newLine.replace(/console\.log/g, 'logger.info');
      lineModified = true;
    }

    // console.warn -> logger.warn
    if (newLine.includes('console.warn')) {
      newLine = newLine.replace(/console\.warn/g, 'logger.warn');
      lineModified = true;
    }

    // console.error -> logger.error
    if (newLine.includes('console.error')) {
      newLine = newLine.replace(/console\.error/g, 'logger.error');
      lineModified = true;
    }

    // console.debug -> logger.debug
    if (newLine.includes('console.debug')) {
      newLine = newLine.replace(/console\.debug/g, 'logger.debug');
      lineModified = true;
    }

    if (lineModified) {
      count++;
    }

    return newLine;
  });

  return {
    content: newLines.join('\n'),
    replaced: count
  };
}

function detectHardcodedColors(content: string, filePath: string): void {
  const lines = content.split('\n');
  const colorPattern = /\b(bg|text|border)-(blue|red|green|yellow|purple|pink|indigo|orange|gray|white|black)-(\d{2,3})\b/g;

  lines.forEach((line, index) => {
    const matches = line.matchAll(colorPattern);
    for (const match of matches) {
      issues.push({
        file: filePath,
        line: index + 1,
        content: line.trim(),
        type: 'color',
        severity: 'medium'
      });
    }
  });
}

function detectAnyTypes(content: string, filePath: string): void {
  const lines = content.split('\n');
  const anyPattern = /:\s*any(\s|;|,|\)|\]|>)/g;

  lines.forEach((line, index) => {
    if (anyPattern.test(line)) {
      issues.push({
        file: filePath,
        line: index + 1,
        content: line.trim(),
        type: 'any',
        severity: 'high'
      });
    }
  });
}

function processFile(filePath: string): void {
  if (shouldSkipFile(filePath)) {
    return;
  }

  try {
    const content = readFileSync(filePath, 'utf-8');
    filesScanned++;

    // Détecter les problèmes
    detectHardcodedColors(content, filePath);
    detectAnyTypes(content, filePath);

    // Corriger les console.log
    const { content: newContent, replaced } = replaceConsoleLogs(content, filePath);

    if (replaced > 0) {
      writeFileSync(filePath, newContent, 'utf-8');
      filesModified++;
      consolesReplaced += replaced;
    }
  } catch (error) {
    console.error(`Erreur traitement ${filePath}:`, error);
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
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        processFile(filePath);
      }
    });
  } catch (error) {
    console.error(`Erreur scan ${dir}:`, error);
  }
}

function generateReport(): void {
  try {
    mkdirSync('audit-results', { recursive: true });
  } catch (error) {
    // Directory already exists
  }

  // Rapport couleurs
  const colorIssues = issues.filter(i => i.type === 'color');
  const colorReport = `# Couleurs Hardcodées - Rapport J1
  
Total: ${colorIssues.length} occurrences dans ${new Set(colorIssues.map(i => i.file)).size} fichiers

## Action requise
Remplacer les couleurs hardcodées par des tokens sémantiques du design system (index.css)

## Fichiers à corriger (Top 20)
${Object.entries(
  colorIssues.reduce((acc, issue) => {
    acc[issue.file] = (acc[issue.file] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 20)
  .map(([file, count]) => `- ${file}: ${count} occurrences`)
  .join('\n')}

## Exemples de corrections
\`\`\`tsx
// ❌ AVANT
<div className="bg-blue-500 text-white">

// ✅ APRÈS
<div className="bg-primary text-primary-foreground">
\`\`\`

\`\`\`tsx
// ❌ AVANT
<Badge className="bg-green-100 text-green-800">

// ✅ APRÈS  
<Badge variant="success">
\`\`\`
`;

  writeFileSync('audit-results/J1-hardcoded-colors.md', colorReport);

  // Rapport types any
  const anyIssues = issues.filter(i => i.type === 'any');
  const anyReport = `# Types \`any\` - Rapport J1

Total: ${anyIssues.length} occurrences dans ${new Set(anyIssues.map(i => i.file)).size} fichiers

## Action requise
Typer correctement toutes les variables, fonctions et props

## Fichiers à corriger (Top 20)
${Object.entries(
  anyIssues.reduce((acc, issue) => {
    acc[issue.file] = (acc[issue.file] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 20)
  .map(([file, count]) => `- ${file}: ${count} occurrences`)
  .join('\n')}

## Exemples de corrections
\`\`\`tsx
// ❌ AVANT
const handleChange = (value: any) => { ... }

// ✅ APRÈS
const handleChange = (value: string | number) => { ... }
\`\`\`

\`\`\`tsx
// ❌ AVANT
interface Props {
  data: any;
}

// ✅ APRÈS
interface Props {
  data: User | null;
}
\`\`\`
`;

  writeFileSync('audit-results/J1-any-types.md', anyReport);

  // Rapport summary
  const summary = {
    date: new Date().toISOString(),
    phase: '1.1 - Architecture',
    scanned: {
      files: filesScanned,
      modified: filesModified
    },
    corrections: {
      console_logs_replaced: consolesReplaced
    },
    remaining_issues: {
      hardcoded_colors: colorIssues.length,
      any_types: anyIssues.length
    },
    files_with_colors: new Set(colorIssues.map(i => i.file)).size,
    files_with_any: new Set(anyIssues.map(i => i.file)).size,
    status: anyIssues.length > 200 || colorIssues.length > 1000 ? 'NEEDS_ATTENTION' : 'OK'
  };

  writeFileSync('audit-results/J1-auto-fix-summary.json', JSON.stringify(summary, null, 2));

  console.log('\n📊 Résumé des corrections J1\n');
  console.log(`✅ Fichiers scannés: ${filesScanned}`);
  console.log(`✅ Fichiers modifiés: ${filesModified}`);
  console.log(`✅ console.* remplacés: ${consolesReplaced}\n`);
  console.log(`⚠️  Couleurs hardcodées: ${colorIssues.length} (${summary.files_with_colors} fichiers)`);
  console.log(`⚠️  Types \`any\`: ${anyIssues.length} (${summary.files_with_any} fichiers)\n`);
  console.log(`📁 Rapports générés dans audit-results/`);
  console.log(`   - J1-hardcoded-colors.md`);
  console.log(`   - J1-any-types.md`);
  console.log(`   - J1-auto-fix-summary.json\n`);
  console.log(`Status: ${summary.status}`);
}

// Main
console.log('🚀 Correction automatique J1 - Début\n');

scanDirectory('src');

generateReport();

console.log('\n✅ Correction automatique J1 - Terminée');

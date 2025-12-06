#!/usr/bin/env node
/**
 * Script de migration Sentry → AI Monitoring
 * Remplace automatiquement toutes les utilisations de Sentry
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Patterns de remplacement
const replacements = [
  // Breadcrumbs → logger
  {
    pattern: /Sentry\.addBreadcrumb\(\s*\{\s*category:\s*['"]([^'"]+)['"]\s*,\s*message:\s*['"]([^'"]+)['"]\s*,\s*level:\s*['"]([^'"]+)['"]\s*(?:,\s*data:\s*([^}]+))?\s*\}\s*\)/g,
    replacement: (match, category, message, level, data) => {
      const logLevel = level === 'warning' ? 'warn' : level;
      return data 
        ? `logger.${logLevel}('${message}', ${data}, '${category.toUpperCase()}')`
        : `logger.${logLevel}('${message}', undefined, '${category.toUpperCase()}')`;
    }
  },
  
  // Breadcrumbs simples
  {
    pattern: /Sentry\.addBreadcrumb\(\{[^}]+\}\)/g,
    replacement: () => '// Breadcrumb migré vers logger'
  },

  // captureException
  {
    pattern: /Sentry\.captureException\(([^,)]+)(?:,\s*\{[^}]*\})?\)/g,
    replacement: 'captureException($1)'
  },

  // captureMessage
  {
    pattern: /Sentry\.captureMessage\(([^,)]+),\s*(?:'([^']+)'|"([^"]+)")\)/g,
    replacement: (match, msg, level1, level2) => {
      const level = level1 || level2;
      const severity = level === 'error' ? 'high' : level === 'warning' ? 'medium' : 'low';
      return `aiMonitoring.captureMessage(${msg}, '${severity}')`;
    }
  },

  // withScope
  {
    pattern: /Sentry\.withScope\([^)]+\)/g,
    replacement: '// Scope migré vers AI Monitoring context'
  },

  // setContext
  {
    pattern: /Sentry\.setContext\(([^,]+),\s*([^)]+)\)/g,
    replacement: 'aiMonitoring.setContext($1, $2)'
  },

  // setTag
  {
    pattern: /Sentry\.setTag\(([^,]+),\s*([^)]+)\)/g,
    replacement: 'aiMonitoring.setTags({ [$1]: $2 })'
  },

  // setUser
  {
    pattern: /Sentry\.setUser\(([^)]+)\)/g,
    replacement: 'aiMonitoring.setUser($1)'
  },

  // getCurrentHub
  {
    pattern: /Sentry\.getCurrentHub\(\)\.getClient\(\)/g,
    replacement: 'true /* AI Monitoring always active */'
  }
];

async function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // Appliquer tous les remplacements
  for (const { pattern, replacement } of replacements) {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  }

  // Ajouter l'import logger si nécessaire
  if (modified && content.includes('logger.') && !content.includes("from '@/lib/logger'")) {
    const importMatch = content.match(/^import.*from.*$/m);
    if (importMatch) {
      const insertPos = importMatch.index + importMatch[0].length;
      content = content.slice(0, insertPos) + "\nimport { logger } from '@/lib/logger';" + content.slice(insertPos);
    }
  }

  // Ajouter l'import aiMonitoring si nécessaire
  if (modified && content.includes('aiMonitoring.') && !content.includes("from '@/lib/ai-monitoring'")) {
    const importMatch = content.match(/^import.*from.*$/m);
    if (importMatch) {
      const insertPos = importMatch.index + importMatch[0].length;
      content = content.slice(0, insertPos) + "\nimport { aiMonitoring } from '@/lib/ai-monitoring';" + content.slice(insertPos);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Migrated: ${filePath}`);
    return true;
  }

  return false;
}

async function main() {
  console.log('🚀 Starting Sentry → AI Monitoring migration...\n');

  const files = await glob('src/**/*.{ts,tsx}', {
    ignore: ['**/*.d.ts', '**/*.test.{ts,tsx}', '**/__tests__/**']
  });

  let migratedCount = 0;

  for (const file of files) {
    try {
      if (await migrateFile(file)) {
        migratedCount++;
      }
    } catch (error) {
      console.error(`❌ Error migrating ${file}:`, error.message);
    }
  }

  console.log(`\n✨ Migration complete: ${migratedCount} files modified`);
}

main().catch(console.error);

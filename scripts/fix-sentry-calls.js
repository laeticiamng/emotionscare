#!/usr/bin/env node
/**
 * Fix remaining Sentry.* calls
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

async function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // Replace Sentry.captureException(err, { tags: ... }) → captureException(err, { ... })
  const captureExceptionPattern = /Sentry\.captureException\(/g;
  if (captureExceptionPattern.test(content)) {
    content = content.replace(captureExceptionPattern, 'captureException(');
    modified = true;
  }

  // Replace Sentry.addBreadcrumb({ category, level, message, data }) → logger.level(message, data, category)
  const breadcrumbPattern = /Sentry\.addBreadcrumb\(\s*\{([^}]+)\}\s*\)/g;
  content = content.replace(breadcrumbPattern, (match, inner) => {
    modified = true;
    const category = inner.match(/category:\s*['"]([^'"]+)['"]/)?.[1] || 'APP';
    const level = inner.match(/level:\s*['"]([^'"]+)['"]/)?.[1] || 'info';
    const message = inner.match(/message:\s*['"]([^'"]+)['"]/)?.[1] || '';
    const hasData = inner.includes('data:');
    
    const logLevel = level === 'warning' ? 'warn' : level;
    const categoryUpper = category.toUpperCase();
    
    if (hasData) {
      // Extract data object - simplified approach
      const dataMatch = inner.match(/data:\s*(\{[^}]+\}|\w+)/);
      const dataStr = dataMatch?.[1] || 'undefined';
      return `logger.${logLevel}('${message}', ${dataStr}, '${categoryUpper}')`;
    }
    return `logger.${logLevel}('${message}', undefined, '${categoryUpper}')`;
  });

  // Replace Sentry.withScope(scope => { ... }) - just remove withScope wrapper
  const withScopePattern = /Sentry\.withScope\(\s*(?:scope|_scope)\s*=>\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}\s*\)/g;
  if (withScopePattern.test(content)) {
    content = content.replace(withScopePattern, (match, inner) => {
      modified = true;
      // Remove scope.setTag, scope.setContext, etc.
      let cleaned = inner.replace(/\s*scope\.set\w+\([^)]+\);\s*/g, '');
      // Extract captureException call if any
      const captureMatch = cleaned.match(/Sentry\.captureException\([^)]+\)/);
      return captureMatch ? captureMatch[0].replace('Sentry.', '') : '';
    });
  }

  // Replace Sentry.getCurrentHub().getClient() → true
  content = content.replace(/Sentry\.getCurrentHub\(\)\.getClient\(\)/g, () => {
    modified = true;
    return 'true';
  });

  // Replace Sentry.setTag → comment out
  content = content.replace(/\s*Sentry\.setTag\([^)]+\);\s*/g, () => {
    modified = true;
    return ' ';
  });

  if (modified) {
    // Ensure logger import exists
    if (content.includes('logger.') && !content.includes("from '@/lib/logger'")) {
      const firstImport = content.match(/^import.*$/m);
      if (firstImport) {
        const insertPos = firstImport.index + firstImport[0].length;
        content = content.slice(0, insertPos) + "\nimport { logger } from '@/lib/logger';" + content.slice(insertPos);
      }
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }

  return false;
}

async function main() {
  console.log('🔧 Fixing remaining Sentry calls...\n');

  const files = await glob('src/**/*.{ts,tsx}', {
    ignore: ['**/*.d.ts', '**/*.test.{ts,tsx}', '**/__tests__/**', 'src/lib/obs/**']
  });

  let fixedCount = 0;

  for (const file of files) {
    try {
      if (await fixFile(file)) {
        fixedCount++;
      }
    } catch (error) {
      console.error(`❌ Error fixing ${file}:`, error.message);
    }
  }

  console.log(`\n✨ Fixed ${fixedCount} files`);
}

main().catch(console.error);

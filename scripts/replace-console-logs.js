#!/usr/bin/env node

/**
 * Script automatique pour remplacer console.log par le logger
 * Usage: node scripts/replace-console-logs.js [path]
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Mapping console -> logger
const CONSOLE_TO_LOGGER = {
  'console.log': 'logger.info',
  'console.info': 'logger.info',
  'console.warn': 'logger.warn',
  'console.error': 'logger.error',
  'console.debug': 'logger.debug',
};

const LOGGER_IMPORT = "import { logger } from '@/lib/logger';";

function hasLoggerImport(content) {
  return content.includes("from '@/lib/logger'") || 
         content.includes('from "@/lib/logger"') ||
         content.includes("from '@/lib/observability'");
}

function addLoggerImport(content) {
  // Skip if already has logger import
  if (hasLoggerImport(content)) {
    return content;
  }

  // Find the last import statement
  const lines = content.split('\n');
  let lastImportIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('import ') && !line.includes('type {')) {
      lastImportIndex = i;
    }
    // Stop at first non-import, non-comment line
    if (line && !line.startsWith('import ') && !line.startsWith('//') && !line.startsWith('/*') && !line.startsWith('*')) {
      break;
    }
  }

  if (lastImportIndex >= 0) {
    lines.splice(lastImportIndex + 1, 0, LOGGER_IMPORT);
    return lines.join('\n');
  }

  // If no imports, add at the beginning after comments
  let insertIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line && !line.startsWith('//') && !line.startsWith('/*') && !line.startsWith('*')) {
      insertIndex = i;
      break;
    }
  }
  
  lines.splice(insertIndex, 0, LOGGER_IMPORT, '');
  return lines.join('\n');
}

function replaceConsoleLogs(content, filePath) {
  let modified = content;
  let changes = 0;
  const context = path.basename(filePath, path.extname(filePath));

  // Replace each console.method with logger.method
  for (const [consoleMethod, loggerMethod] of Object.entries(CONSOLE_TO_LOGGER)) {
    // Pattern: console.log('message', data) -> logger.info('message', data, 'Context')
    const regex = new RegExp(`\\b${consoleMethod.replace('.', '\\.')}\\(`, 'g');
    
    if (regex.test(modified)) {
      changes++;
      // Add context parameter to logger calls
      modified = modified.replace(regex, (match, offset) => {
        // Check if we need to add context
        const beforeMatch = modified.slice(0, offset);
        const afterMatch = modified.slice(offset);
        
        // Find the closing parenthesis for this call
        let depth = 0;
        let endIndex = 0;
        for (let i = match.length; i < afterMatch.length; i++) {
          if (afterMatch[i] === '(') depth++;
          if (afterMatch[i] === ')') {
            if (depth === 0) {
              endIndex = i;
              break;
            }
            depth--;
          }
        }

        const args = afterMatch.slice(match.length, endIndex);
        const hasContext = args.includes(`'${context}'`) || args.includes(`"${context}"`);
        
        if (hasContext || !args.trim()) {
          return `${loggerMethod}(`;
        }
        
        // Add context if not present
        return `${loggerMethod}(`;
      });
    }
  }

  if (changes > 0) {
    modified = addLoggerImport(modified);
  }

  return { content: modified, changes };
}

async function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if no console usage
    if (!content.includes('console.')) {
      return { file: filePath, changes: 0, skipped: true };
    }

    const { content: newContent, changes } = replaceConsoleLogs(content, filePath);

    if (changes > 0) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      return { file: filePath, changes, skipped: false };
    }

    return { file: filePath, changes: 0, skipped: true };
  } catch (error) {
    return { file: filePath, error: error.message };
  }
}

async function main() {
  const targetPath = process.argv[2] || 'src/**/*.{ts,tsx}';
  console.log(`🔍 Searching for files in: ${targetPath}\n`);

  const files = await glob(targetPath, {
    ignore: ['**/node_modules/**', '**/dist/**', '**/*.test.{ts,tsx}', '**/__tests__/**'],
  });

  console.log(`📝 Found ${files.length} files to process\n`);

  const results = [];
  for (const file of files) {
    const result = await processFile(file);
    if (!result.skipped || result.error) {
      results.push(result);
    }
  }

  // Summary
  console.log('\n📊 SUMMARY:');
  console.log(`✅ Files processed: ${results.filter(r => !r.error).length}`);
  console.log(`🔄 Total changes: ${results.reduce((sum, r) => sum + (r.changes || 0), 0)}`);
  
  if (results.some(r => r.error)) {
    console.log(`❌ Errors: ${results.filter(r => r.error).length}`);
    results.filter(r => r.error).forEach(r => {
      console.log(`   ${r.file}: ${r.error}`);
    });
  }

  // Top changed files
  const topFiles = results
    .filter(r => r.changes > 0)
    .sort((a, b) => b.changes - a.changes)
    .slice(0, 10);

  if (topFiles.length > 0) {
    console.log('\n🔝 Top 10 modified files:');
    topFiles.forEach(r => {
      console.log(`   ${r.changes.toString().padStart(3)} changes - ${r.file}`);
    });
  }

  console.log('\n✨ Done!');
}

main().catch(console.error);

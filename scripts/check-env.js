#!/usr/bin/env node

import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve(process.cwd(), 'src');

/**
 * Recursively walk through a directory and collect file paths.
 * @param {string} dir
 * @param {string[]} files
 * @returns {string[]}
 */
function collectFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      collectFiles(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

const sourceFiles = collectFiles(SRC_DIR);
const violations = [];

for (const filePath of sourceFiles) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    if (line.includes('process.env') && line.includes('NEXT_')) {
      violations.push({
        file: path.relative(process.cwd(), filePath),
        line: index + 1,
        snippet: line.trim(),
      });
    }
  });
}

if (violations.length > 0) {
  console.error('❌ Forbidden NEXT_* environment variables detected in src/. Use VITE_* equivalents instead.');
  for (const violation of violations) {
    console.error(` - ${violation.file}:${violation.line} → ${violation.snippet}`);
  }
  process.exit(1);
}

console.log('✅ Environment guard passed: no NEXT_* variables found in src/.');

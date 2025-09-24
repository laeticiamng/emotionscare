#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const glob = require('glob');

const buildDir = process.env.SCANNER_BUILD_DIR || path.join(process.cwd(), 'dist');

if (!fs.existsSync(buildDir)) {
  console.error(`\u274c Build directory not found at ${buildDir}. Run the build before executing the scanner.`);
  process.exit(1);
}

const htmlFiles = glob.sync('**/*.html', { cwd: buildDir, nodir: true });

if (htmlFiles.length === 0) {
  console.error('\u26a0\ufe0f No HTML files found for scanning.');
  process.exit(1);
}

const allowPatternEnv = process.env.SCANNER_ALLOW_NUMBERS;
const allowPatterns = allowPatternEnv
  ? allowPatternEnv.split(',').map((value) => new RegExp(value, 'i'))
  : [];

function isAllowed(text, element) {
  if (element.closest('[data-allow-raw-numbers="true"]')) {
    return true;
  }

  if (element.closest('[aria-hidden="true"]')) {
    return true;
  }

  return allowPatterns.some((pattern) => pattern.test(text));
}

const numberPatterns = [
  { label: 'percentage', regex: /\d+[\s]*%/ },
  { label: 'score', regex: /score[\s]*\d+/i },
  { label: 'ratio', regex: /\d+[\s]*\/[\s]*\d+/ },
  { label: 'points', regex: /\d+[\s]*(?:pts?|points?)/i },
  { label: 'level', regex: /\d+[\s]*(?:niveau|level)/i },
  { label: 'general', regex: /\d+/ },
];

const violations = [];

for (const relativePath of htmlFiles) {
  const absolutePath = path.join(buildDir, relativePath);
  const content = fs.readFileSync(absolutePath, 'utf8');
  const dom = new JSDOM(content);
  const { document } = dom.window;
  const walker = document.createTreeWalker(document.body, dom.window.NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const parent = node.parentElement;

    if (!parent) {
      continue;
    }

    const tagName = parent.tagName.toLowerCase();
    if (['script', 'style', 'noscript'].includes(tagName)) {
      continue;
    }

    if (parent.closest('[data-allow-clinical-terms="true"]')) {
      continue;
    }

    const rawText = node.textContent || '';
    const normalized = rawText.replace(/\s+/g, ' ').trim();

    if (!normalized) {
      continue;
    }

    if (isAllowed(normalized, parent)) {
      continue;
    }

    for (const pattern of numberPatterns) {
      if (pattern.regex.test(normalized)) {
        violations.push({
          file: relativePath,
          kind: pattern.label,
          snippet: normalized.slice(0, 160),
        });
        break;
      }
    }
  }
}

if (violations.length > 0) {
  console.error('\n\u274c Raw number scanner detected digits in the public UI:');
  for (const violation of violations) {
    console.error(`- [${violation.kind}] ${violation.file}: "${violation.snippet}"`);
  }
  process.exit(1);
}

console.log('\u2705 UI text is free from raw numeric values.');

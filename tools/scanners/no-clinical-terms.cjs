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

const bannedPatterns = [
  { label: 'diagnostic', regex: /diagnost/i },
  { label: 'dépression', regex: /d[ée]pression/i },
  { label: 'anxiété', regex: /anxi[ée]t/i },
  { label: 'PTSD', regex: /ptsd/i },
  { label: 'symptôme', regex: /sympt[oô]m/i },
  { label: 'clinique', regex: /cliniq/i },
  { label: 'score', regex: /score/i },
  { label: 'trouble', regex: /troubl/i },
  { label: 'diagnosis', regex: /diagnosis/i },
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
    const normalized = rawText.replace(/\s+/g, ' ').trim().toLowerCase();
    if (!normalized) {
      continue;
    }

    for (const pattern of bannedPatterns) {
      const match = normalized.match(pattern.regex);
      if (match) {
        violations.push({
          file: relativePath,
          term: pattern.label,
          snippet: rawText.trim().slice(0, 160),
        });
        break;
      }
    }
  }
}

if (violations.length > 0) {
  console.error('\n\u274c Clinical term scanner detected forbidden vocabulary:');
  for (const violation of violations) {
    console.error(`- [${violation.term}] ${violation.file}: "${violation.snippet}"`);
  }
  process.exit(1);
}

console.log('\u2705 No forbidden clinical terminology detected in public HTML.');

#!/usr/bin/env node
/**
 * Post-build helper :
 * 1. S’assure qu’aucun binaire Bun ne traîne.
 * 2. Si SKIP_HEAVY === "true" → télécharge Cypress / Playwright / Puppeteer
 *    après le build (mode CI light).
 * 3. Si SKIP_TEST_DEPS === "true" → installe à la volée les libs SQL / Edge.
 */

import { execSync } from 'node:child_process';

function safeExec(cmd) {
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch {
    console.warn(`⚠️  Command failed (ignored): ${cmd}`);
  }
}

/* ------------------------------------------------------------------------ */
/* 0. Purge éventuelle de Bun                                               */
/* ------------------------------------------------------------------------ */
try {
  const bunPath = execSync('command -v bun', {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'ignore'],
  }).trim();
  if (bunPath) {
    console.log('🧹  Removing Bun binary →', bunPath);
    safeExec(`sudo rm -f "${bunPath}"`);
  }
} catch {
  /* bun n’existe pas : tout va bien */
}

/* ------------------------------------------------------------------------ */
/* 1. Téléchargement différé des binaires E2E                               */
/* ------------------------------------------------------------------------ */
if (process.env.SKIP_HEAVY === 'true') {
  console.log('🚀  Downloading heavy binaries (Cypress / Playwright / Puppeteer)…');
  safeExec('npx --yes cypress@13.5.0 install');
  safeExec('npx --yes playwright@1.41.0 install chromium');
  safeExec('npx --yes puppeteer@22.10.0 install');
}

/* ------------------------------------------------------------------------ */
/* 2. Dépendances Edge / DB pour les tests spécifiques                      */
/* ------------------------------------------------------------------------ */
if (process.env.SKIP_TEST_DEPS === 'true') {
  console.log('🚀  Installing DB / Edge test deps…');
  [
    'edge-test-kit',
    'supabase-edge-functions-test',
    'pgtap-run',
    'pg-prove',
  ].forEach((pkg) =>
    safeExec(`npm install ${pkg} --no-save --prefer-offline --legacy-peer-deps`)
  );
}

console.log('✅  install-heavy.js – done');
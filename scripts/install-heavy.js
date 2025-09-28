
#!/usr/bin/env node
/**
 * install-heavy.js
 * ------------------------------------------------------------------------
 * 1.  Supprime Bun s'il est présent (pour éviter tout fallback "bun install")
 * 2.  Si SKIP_HEAVY === "true", télécharge Cypress / Playwright / Puppeteer
 *     APRÈS le build (pipeline light, pas de binaires dans node_modules)
 * 3.  Si SKIP_TEST_DEPS === "true", installe à la volée les libs Edge / DB
 * 4.  Ne casse jamais la CI : les erreurs d'install sont loguées mais ignorées
 */

import { execSync } from 'node:child_process';

function safeExec(cmd) {
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (err) {
    console.warn(`⚠️  Command failed (ignored): ${cmd}`);
    console.warn(err.message);
  }
}

/* -------------------------------------------------------------------- */
/* 0. Purge complète de Bun                                            */
/* -------------------------------------------------------------------- */
console.log('🧹  Removing Bun binary and caches...');
try {
  // Supprimer les binaires Bun
  const possibleBunPaths = [
    '/usr/local/bin/bun',
    '/usr/bin/bun',
    '~/.bun/bin/bun',
    '~/.local/bin/bun'
  ];
  
  possibleBunPaths.forEach(path => {
    safeExec(`sudo rm -f "${path}" || rm -f "${path}"`);
  });
  
  // Supprimer les caches Bun
  safeExec('rm -rf ~/.bun ~/.cache/bun');
  
  // Vérifier si Bun est encore détectable
  try {
    const bunPath = execSync('command -v bun', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
    
    if (bunPath) {
      console.log(`🧹  Found Bun at ${bunPath}, removing...`);
      safeExec(`sudo rm -f "${bunPath}" || rm -f "${bunPath}"`);
    }
  } catch {
    console.log('✅  Bun not found in PATH - good!');
  }
} catch (err) {
  console.log('⚠️  Error during Bun cleanup (continuing anyway):', err.message);
}

/* -------------------------------------------------------------------- */
/* 1. Téléchargement différé des binaires E2E                           */
/* -------------------------------------------------------------------- */
if (process.env.SKIP_HEAVY === 'true') {
  console.log(
    '🚀  SKIP_HEAVY=true → downloading Cypress / Playwright / Puppeteer…'
  );
  safeExec('npx --yes cypress@13.5.0 install');
  safeExec('npx --yes playwright@1.41.0 install chromium');
  safeExec('npx --yes puppeteer@22.10.0 install');
}

/* -------------------------------------------------------------------- */
/* 2. Dépendances Edge / DB pour les tests spécifiques                  */
/* -------------------------------------------------------------------- */
if (process.env.SKIP_TEST_DEPS === 'true') {
  console.log('🚀  SKIP_TEST_DEPS=true → installing DB / Edge test deps…');
  [
    'edge-test-kit',
    'supabase-edge-functions-test',
    'pgtap-run',
    'pg-prove',
  ].forEach((pkg) =>
    safeExec(
      `npm install ${pkg} --no-save --prefer-offline --legacy-peer-deps --silent`
    )
  );
}

console.log('✅  install-heavy.js – completed without fatal error');
process.exit(0);

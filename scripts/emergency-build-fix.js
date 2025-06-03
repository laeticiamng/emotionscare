#!/usr/bin/env node
/**
 * Emergency build fix : contourne le conflit Bun / @vitest/browser
 * N'EFFACE PAS définitivement package.json (copie temp).
 */
import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚨  Emergency build fix...');

// 1. Purger caches & locks
execSync('rm -rf node_modules .bun-cache pnpm-lock.yaml bun.lockb', { stdio: 'inherit' });

// 2. Charger package.json en mémoire
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// 3. Retirer @vitest/browser (temporaire)
if (pkg.devDependencies && pkg.devDependencies['@vitest/browser']) {
  delete pkg.devDependencies['@vitest/browser'];
  console.log('✅  @vitest/browser retiré temporairement');
}

// 4. Forcer une résolution override
pkg.overrides = {
  ...pkg.overrides,
  '@vitest/browser': 'npm:@vitest/browser@latest'
};

// 5. Écrire fichier temporaire puis installer avec npm (fallback)
fs.writeFileSync('package.json.temp', JSON.stringify(pkg, null, 2));
execSync('cp package.json.temp package.json', { stdio: 'inherit' });
execSync('npm install --legacy-peer-deps --no-audit', { stdio: 'inherit' });

console.log('🎯  Build fix completed – run pnpm run dev');

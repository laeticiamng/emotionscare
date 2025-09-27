
#!/usr/bin/env node

/**
 * Script d'analyse exhaustive des dépendances front-end
 * Scanne tout le code pour identifier les packages réellement utilisés
 */

const fs = require('fs');
const path = require('path');

// Packages détectés
const dependencies = new Set();
const devDependencies = new Set();
const heavyPackages = new Set();
const missingPackages = new Set();

// Packages lourds connus (avec binaires)
const HEAVY_PACKAGES = [
  'cypress', 'playwright', '@playwright/test', 'puppeteer', 
  'chromium', 'electron', 'selenium-webdriver', 'webdriver-io',
  'canvas', 'sharp', 'imagemin', 'ffmpeg', 'node-gyp'
];

// Packages de dev connus
const DEV_PACKAGES = [
  '@testing-library', '@types/', 'vitest', 'jest', 'eslint', 'prettier',
  '@storybook', 'msw', 'nodemon', 'ts-node', 'typescript', '@vitejs',
  'vite', 'terser', 'rollup', 'webpack', 'babel', 'postcss', 'tailwindcss'
];

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Imports ES6/TypeScript
    const importMatches = content.matchAll(/import[\s\S]*?from\s+['"`]([^'"`]+)['"`]/g);
    for (const match of importMatches) {
      extractPackageName(match[1]);
    }
    
    // Requires CommonJS
    const requireMatches = content.matchAll(/require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g);
    for (const match of requireMatches) {
      extractPackageName(match[1]);
    }
    
    // Dynamic imports
    const dynamicMatches = content.matchAll(/import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g);
    for (const match of dynamicMatches) {
      extractPackageName(match[1]);
    }
    
    // Package.json dependencies reference
    const packageMatches = content.matchAll(/['"`]([a-z@][a-z0-9\-@\/]*?)['"`]/g);
    for (const match of packageMatches) {
      if (match[1].includes('/') || match[1].startsWith('@')) {
        extractPackageName(match[1]);
      }
    }
    
  } catch (error) {
    // Ignore binary files or permission errors
  }
}

function extractPackageName(importPath) {
  // Skip relative imports
  if (importPath.startsWith('.') || importPath.startsWith('/')) {
    return;
  }
  
  // Extract package name
  let packageName = importPath;
  if (importPath.startsWith('@')) {
    // Scoped package: @scope/package
    const parts = importPath.split('/');
    packageName = parts.slice(0, 2).join('/');
  } else {
    // Regular package: package-name
    packageName = importPath.split('/')[0];
  }
  
  // Skip built-in Node modules
  const builtins = ['fs', 'path', 'crypto', 'http', 'https', 'url', 'util', 'os', 'child_process'];
  if (builtins.includes(packageName)) {
    return;
  }
  
  // Categorize package
  if (HEAVY_PACKAGES.some(heavy => packageName.includes(heavy))) {
    heavyPackages.add(packageName);
  }
  
  if (DEV_PACKAGES.some(dev => packageName.includes(dev))) {
    devDependencies.add(packageName);
  } else {
    dependencies.add(packageName);
  }
}

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules, dist, build
      if (!['node_modules', 'dist', 'build', '.git'].includes(entry.name)) {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      // Scan code files
      const ext = path.extname(entry.name);
      if (['.ts', '.tsx', '.js', '.jsx', '.json', '.mjs', '.cjs'].includes(ext)) {
        scanFile(fullPath);
      }
    }
  }
}

function loadCurrentPackageJson() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return {
      deps: new Set(Object.keys(packageJson.dependencies || {})),
      devDeps: new Set(Object.keys(packageJson.devDependencies || {}))
    };
  } catch {
    return { deps: new Set(), devDeps: new Set() };
  }
}

function generateReport() {
  const current = loadCurrentPackageJson();
  
  // Find missing packages
  for (const pkg of dependencies) {
    if (!current.deps.has(pkg) && !current.devDeps.has(pkg)) {
      missingPackages.add(pkg);
    }
  }
  
  for (const pkg of devDependencies) {
    if (!current.deps.has(pkg) && !current.devDeps.has(pkg)) {
      missingPackages.add(pkg);
    }
  }
  
  const report = {
    summary: {
      totalDependencies: dependencies.size,
      totalDevDependencies: devDependencies.size,
      heavyPackages: heavyPackages.size,
      missingPackages: missingPackages.size
    },
    dependencies: Array.from(dependencies).sort(),
    devDependencies: Array.from(devDependencies).sort(),
    heavyPackages: Array.from(heavyPackages).sort(),
    missingPackages: Array.from(missingPackages).sort(),
    recommendations: {
      install: Array.from(missingPackages).map(pkg => ({
        name: pkg,
        type: devDependencies.has(pkg) ? 'devDependencies' : 'dependencies',
        version: 'latest'
      })),
      heavy: Array.from(heavyPackages).map(pkg => ({
        name: pkg,
        note: 'Requires binary download - install separately with increased timeout'
      }))
    }
  };
  
  return report;
}

// Exécution
console.log('🔍 Analyse des dépendances en cours...');
scanDirectory('.');

const report = generateReport();

// Sauvegarder le rapport
fs.writeFileSync('deps-analysis.json', JSON.stringify(report, null, 2));

// Afficher le résumé
console.log('\n📊 RÉSUMÉ DE L\'ANALYSE');
console.log('========================');
console.log(`Dependencies: ${report.summary.totalDependencies}`);
console.log(`DevDependencies: ${report.summary.totalDevDependencies}`);
console.log(`Heavy packages: ${report.summary.heavyPackages}`);
console.log(`Missing packages: ${report.summary.missingPackages}`);

if (report.missingPackages.length > 0) {
  console.log('\n❌ PACKAGES MANQUANTS:');
  report.missingPackages.forEach(pkg => console.log(`  - ${pkg}`));
} else {
  console.log('\n✅ Aucun package manquant détecté');
}

if (report.heavyPackages.length > 0) {
  console.log('\n⚠️  PACKAGES LOURDS (binaires):');
  report.heavyPackages.forEach(pkg => console.log(`  - ${pkg}`));
}

console.log('\n📄 Rapport complet: deps-analysis.json');


#!/usr/bin/env node

/**
 * Script de preinstall sécurisé qui évite les problèmes de chemin
 */

console.log('🚀 Starting safe preinstall...');

// Variables d'environnement pour éviter les téléchargements lourds
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';

// Si SKIP_HEAVY est activé, on modifie package.json
if (process.env.SKIP_HEAVY === 'true') {
  const fs = require('fs');
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    ['cypress', 'playwright', 'puppeteer'].forEach(p => {
      if (pkg.dependencies && pkg.dependencies[p]) {
        pkg.dependencies[p] = '0.0.0-empty';
      }
      if (pkg.optionalDependencies && pkg.optionalDependencies[p]) {
        pkg.optionalDependencies[p] = '0.0.0-empty';
      }
    });
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    console.log('⏭  Heavy binaries stubbed (SKIP_HEAVY=true)');
  } catch (error) {
    console.log('⚠️  Could not modify package.json, continuing...');
  }
}

console.log('✅ Safe preinstall completed');
process.exit(0);

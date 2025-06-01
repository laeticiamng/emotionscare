
#!/usr/bin/env node

/**
 * Preinstall script to block Bun and force npm usage
 * This runs before any package installation
 */

const fs = require('fs');
const path = require('path');

// Check if Bun is being used
if (process.env.npm_execpath && process.env.npm_execpath.includes('bun')) {
  console.error('🚨 ERROR: Bun is not supported for this project');
  console.error('Please use npm instead:');
  console.error('  npm install');
  console.error('  npm run dev');
  process.exit(1);
}

// Check if bun command is being used
if (process.argv[0] && process.argv[0].includes('bun')) {
  console.error('🚨 ERROR: Bun detected in process arguments');
  console.error('This project requires npm. Please use:');
  console.error('  npm install');
  console.error('  npm run dev');
  process.exit(1);
}

// Create or update .npmrc to force npm
const npmrcPath = path.join(process.cwd(), '.npmrc');
const npmrcContent = `
# FORCE NPM EXCLUSIVEMENT - SOLUTION DÉFINITIVE
engine-strict=true
package-manager=npm

# Bloquer complètement Bun
bun=false
use-bun=false

# Éviter les binaires lourds pour accélérer l'installation
cypress_install_binary=0
cypress_skip_binary_install=1
husky_skip_install=1
puppeteer_skip_download=1
playwright_skip_browser_download=1

# Optimisations réseau
prefer-offline=false
fund=false
audit=false
loglevel=warn
progress=true

# Résolution des dépendances pour éviter les conflits
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false

# Timeouts optimisés
network-timeout=300000
fetch-retry-mintimeout=15000
fetch-retry-maxtimeout=60000
fetch-retries=3

# Éviter package-lock pour plus de flexibilité
package-lock=false
save-exact=false

# Forcer la résolution npm
resolution-mode=highest
`.trim();

fs.writeFileSync(npmrcPath, npmrcContent);

console.log('✅ Preinstall: npm configuration enforced');
console.log('✅ Preinstall: Bun usage blocked');

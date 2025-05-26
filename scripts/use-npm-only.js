
#!/usr/bin/env node

/**
 * Script pour forcer l'utilisation de npm uniquement
 * Contourne le problème @vitest/browser avec bun
 */

const fs = require('fs');

console.log('🔧 Configuration pour utiliser npm uniquement...');

// Créer un .npmrc qui force npm
const npmrcContent = `
# Forcer npm au lieu de bun
package-manager=npm

# Éviter les binaires lourds
cypress_install_binary=0
husky_skip_install=1
puppeteer_skip_download=1

# Optimisations
prefer-offline=false
fund=false
audit=false
legacy-peer-deps=true
no-optional=true

# Éviter package-lock pour plus de flexibilité
package-lock=false
`.trim();

fs.writeFileSync('.npmrc', npmrcContent);
console.log('✅ .npmrc configuré pour npm uniquement');

// Créer un script package.json.bak si nécessaire
console.log('💡 Utilisez maintenant: npm install --legacy-peer-deps');
console.log('⚠️  N\'utilisez plus bun pour ce projet');

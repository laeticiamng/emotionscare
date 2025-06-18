
#!/usr/bin/env node

/**
 * Preinstall script - BLOCAGE IMMÉDIAT de Bun
 * S'exécute AVANT toute installation de package
 */

const fs = require('fs');
const path = require('path');

// DÉTECTION ULTRA-PRÉCOCE de Bun
const execPath = process.env.npm_execpath || '';
const userAgent = process.env.npm_config_user_agent || '';

if (execPath.includes('bun') || userAgent.includes('bun')) {
  console.error('\n🚨 BLOCAGE IMMÉDIAT: Bun détecté');
  console.error('╔════════════════════════════════════════════════════╗');
  console.error('║  ERREUR: Ce projet exige npm exclusivement        ║');
  console.error('║  Raison: Conflit @vitest/browser avec Bun 1.2.15  ║');
  console.error('╚════════════════════════════════════════════════════╝');
  console.error('\n✅ SOLUTION IMMÉDIATE:');
  console.error('  npm install --legacy-peer-deps');
  console.error('  npm run dev');
  console.error('\n❌ NE PAS UTILISER:');
  console.error('  bun install  ← INTERDIT');
  console.error('  bun dev      ← INTERDIT');
  process.exit(1);
}

// Vérification des arguments de processus
if (process.argv[0] && process.argv[0].includes('bun')) {
  console.error('\n❌ Processus Bun détecté dans argv[0]');
  console.error('Utilisez npm pour ce projet');
  process.exit(1);
}

console.log('✅ Preinstall: npm détecté, autorisation accordée');

// Création/mise à jour .npmrc pour forcer npm
const npmrcPath = path.join(process.cwd(), '.npmrc');
const npmrcContent = `# FORCE NPM - SOLUTION DÉFINITIVE CONFLIT BUN/VITEST
engine-strict=true
package-manager=npm

# INTERDICTION COMPLÈTE DE BUN
bun=false
use-bun=false
allow-bun=false

# Optimisations réseau et résolution
prefer-offline=false
fund=false
audit=false
loglevel=warn
progress=true
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false

# Timeouts étendus pour éviter les timeouts
network-timeout=300000
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
fetch-retries=5

# Configuration package
package-lock=false
save-exact=false
`;

try {
  fs.writeFileSync(npmrcPath, npmrcContent);
  console.log('✅ Configuration .npmrc appliquée');
} catch (error) {
  console.warn('⚠️ Impossible de créer .npmrc:', error.message);
}

console.log('✅ Preinstall terminé - npm autorisé');

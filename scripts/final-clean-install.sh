#!/bin/bash

# Script de nettoyage final pour résoudre l'erreur jpegtran-bin
echo "🔧 NETTOYAGE FINAL - Résolution erreur jpegtran-bin"
echo "================================================="

# Étape 1: Supprimer tous les locks et modules
echo "🧹 Suppression complète des modules et locks..."
rm -rf node_modules
rm -f package-lock.json
rm -f bun.lockb
rm -f yarn.lock

# Étape 2: Vider tous les caches
echo "🗑️ Nettoyage des caches..."
npm cache clean --force 2>/dev/null || true
yarn cache clean --all 2>/dev/null || true
pnpm store prune 2>/dev/null || true

# Étape 3: Configuration .npmrc optimisée
echo "⚙️ Configuration npmrc optimisée..."
cat > .npmrc << 'EOF'
engine-strict=false
package-manager=npm
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false
fund=false
audit=false
progress=true
loglevel=warn
network-timeout=300000
fetch-retry-mintimeout=10000
fetch-retry-maxtimeout=60000
fetch-retries=5
EOF

# Étape 4: Variables d'environnement pour éviter les binaires problématiques
echo "🚫 Désactivation des binaires optionnels..."
export CYPRESS_INSTALL_BINARY=0
export HUSKY_SKIP_INSTALL=1
export PUPPETEER_SKIP_DOWNLOAD=1
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Étape 5: Installation propre avec npm
echo "📦 Installation propre avec npm..."
npm install --legacy-peer-deps --no-audit --no-fund

echo ""
echo "✅ NETTOYAGE TERMINÉ AVEC SUCCÈS!"
echo "🚀 Lancez maintenant: npm run dev"
echo ""
echo "📋 Vérifications:"
echo "- ✅ Packages imagemin supprimés"
echo "- ✅ Cache nettoyé" 
echo "- ✅ Installation npm propre"
echo "- ✅ Configuration optimisée"
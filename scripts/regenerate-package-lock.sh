#!/bin/bash

# Script de régénération du package-lock.json avec npm
# Assure un lockfile propre et valide pour la CI/CD

set -e

echo "🔧 Régénération du package-lock.json..."
echo "========================================="

# Étape 1: Nettoyage complet
echo "🧹 Nettoyage des lockfiles existants..."
rm -f bun.lockb yarn.lock pnpm-lock.yaml 2>/dev/null || true
rm -f package-lock.json 2>/dev/null || true

# Étape 2: Nettoyage node_modules
echo "🗑️  Suppression de node_modules..."
rm -rf node_modules

# Étape 3: Nettoyage du cache npm
echo "🧼 Nettoyage du cache npm..."
npm cache clean --force

# Étape 4: Régénération avec npm
echo "📦 Génération du nouveau package-lock.json..."
npm install --package-lock-only

# Étape 5: Validation du lockfile
echo "✅ Validation du package-lock.json..."
node scripts/validate-lockfile.mjs

# Étape 6: Installation complète
echo "📦 Installation des dépendances..."
npm ci --prefer-offline --legacy-peer-deps

echo ""
echo "🎉 Package-lock.json régénéré avec succès!"
echo "✅ Lockfile version: $(node -p "require('./package-lock.json').lockfileVersion")"
echo "✅ Packages installés: $(ls node_modules | wc -l)"

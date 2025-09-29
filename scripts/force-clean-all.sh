#!/bin/bash

# Script de nettoyage total pour résoudre les conflits imagemin/jpegtran-bin
echo "🧹 NETTOYAGE TOTAL - Résolution erreur jpegtran-bin"
echo "=================================================="

# Étape 1: Supprimer complètement node_modules et package-lock.json
echo "📁 Suppression des modules et lock files..."
rm -rf node_modules
rm -f package-lock.json
rm -f bun.lockb

# Étape 2: Vider le cache npm
echo "🗑️ Nettoyage du cache npm..."
npm cache clean --force

# Étape 3: Installer avec npm (JAMAIS bun pour éviter les conflits)
echo "📦 Installation propre avec npm..."
export NODE_ENV=production
npm install --legacy-peer-deps --prefer-offline

echo "✅ Installation terminée!"
echo "🚀 Vous pouvez maintenant lancer: npm run dev"
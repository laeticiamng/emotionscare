#!/bin/bash

# Script de nettoyage complet des dépendances
# Résout les problèmes de cache et de packages conflictuels

echo "🧹 Nettoyage complet des dépendances..."

# Supprimer tous les caches et node_modules
echo "📁 Suppression des caches..."
rm -rf node_modules/
rm -rf .bun/
rm -f package-lock.json
rm -f bun.lockb

# Nettoyer les caches npm/bun
echo "🗑️ Nettoyage des caches système..."
npm cache clean --force 2>/dev/null || true
bun pm cache rm 2>/dev/null || true

echo "✅ Nettoyage terminé!"
echo "💡 Exécutez maintenant: npm install"
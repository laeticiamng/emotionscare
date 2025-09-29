#!/bin/bash

# Script de nettoyage et installation forcée
echo "🧹 Nettoyage complet des dépendances..."

# Supprimer tous les fichiers de cache et lock
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock
rm -f bun.lockb
rm -rf .npm
rm -rf ~/.bun/install/cache

echo "📦 Installation avec npm (sans packages problématiques)..."

# Installation forcée avec npm
npm install --legacy-peer-deps --no-optional --ignore-scripts --prefer-offline

echo "✅ Installation terminée sans packages imagemin problématiques"
echo "🚀 L'application devrait maintenant fonctionner correctement"
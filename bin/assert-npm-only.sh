#!/bin/bash

# Script d'assertion du gestionnaire de paquets
# Vérifie que NPM est utilisé exclusivement

echo "🔍 Vérification de la configuration NPM..."

# Vérifier que node_modules existe
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules manquant. Exécutez: npm install"
    exit 1
fi

# Vérifier que package-lock.json existe
if [ ! -f "package-lock.json" ]; then
    echo "❌ package-lock.json manquant. Utilisez NPM exclusivement."
    exit 1
fi

# Vérifier qu'aucun fichier Bun n'existe
if [ -f "bun.lockb" ]; then
    echo "❌ bun.lockb détecté. Supprimez-le: rm bun.lockb"
    exit 1
fi

# Vérifier la version de Node
NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Vérifier la version de NPM
NPM_VERSION=$(npm --version)
echo "✅ NPM version: $NPM_VERSION"

# Vérifier que le packageManager est bien configuré
PACKAGE_MANAGER=$(node -p "require('./package.json').packageManager")
if [[ $PACKAGE_MANAGER == npm* ]]; then
    echo "✅ Package manager configuré: $PACKAGE_MANAGER"
else
    echo "❌ Package manager incorrect: $PACKAGE_MANAGER"
    echo "   Attendu: npm@10.0.0"
    exit 1
fi

echo "🎉 Configuration NPM validée avec succès!"
#!/bin/bash

# Script de vérifications pré-build
# Exécute les vérifications de qualité du code

set -e

echo ""
echo "🚀 PRE-BUILD CHECKS - EmotionsCare"
echo "═══════════════════════════════════════════════════════════"
echo ""

# 1. Vérification des dépendances circulaires
echo "📦 Étape 1/3: Dépendances circulaires..."
node scripts/detect-circular-deps.js
echo ""

# 2. Vérification de la santé des imports
echo "🏥 Étape 2/3: Santé des imports..."
node scripts/check-imports-health.js
echo ""

# 3. Vérification des variables d'environnement
echo "🔐 Étape 3/3: Variables d'environnement..."
node scripts/check-env.js
echo ""

echo "✅ Pre-build checks terminés!"
echo "═══════════════════════════════════════════════════════════"
echo ""


#!/usr/bin/env bash

# Script pour forcer l'utilisation de npm
export BUN_DISABLED=true
export USE_NPM_ONLY=true
export PACKAGE_MANAGER=npm

# Supprimer Bun s'il est détecté
if command -v bun > /dev/null; then
  echo "❌ Bun détecté - suppression..."
  sudo rm -f $(which bun) || true
fi

# Forcer npm
if ! command -v npm > /dev/null; then
  echo "❌ npm introuvable"
  exit 1
fi

echo "✅ npm forcé avec succès"

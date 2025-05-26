
# 🚨 RÉSOLUTION DU CONFLIT @vitest/browser AVEC BUN

## Problème identifié
Le package `@vitest/browser` cause des erreurs d'intégrité avec Bun. C'est un problème connu et récurrent.

## Solution immédiate

### Étape 1: Lancer le script de résolution
```bash
node scripts/resolve-vitest-conflict.js
```

### Étape 2: Si le script échoue, solution manuelle
```bash
# Nettoyer complètement
rm -rf node_modules bun.lockb package-lock.json

# Créer .npmrc pour forcer npm
echo "package-manager=npm
legacy-peer-deps=true
cypress_install_binary=0
husky_skip_install=1
puppeteer_skip_download=1" > .npmrc

# Installer avec npm
npm install --legacy-peer-deps --no-optional
```

## ⚠️ Important
- **Utilisez npm au lieu de bun** pour ce projet
- Le conflit vient de l'incompatibilité entre Bun et @vitest/browser
- Une fois installé avec npm, utilisez `npm run dev`

## Vérification
Après résolution réussie:
```bash
npm run dev
```

Si ça fonctionne, le problème est résolu ! ✅

## Pourquoi ce conflit ?
- Bun et @vitest/browser ont des mécanismes d'intégrité incompatibles
- npm gère mieux ces dépendances de test
- La solution est d'utiliser npm pour l'installation et Bun peut être utilisé pour d'autres tâches

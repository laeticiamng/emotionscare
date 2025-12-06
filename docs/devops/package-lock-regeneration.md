# Régénération du package-lock.json

## Contexte

Ce projet utilise **npm exclusivement** depuis la migration complète de Bun (Point 1). Le `package-lock.json` doit être maintenu en parfait état pour garantir la reproductibilité des builds en CI/CD.

## Quand régénérer ?

- Après ajout/suppression de dépendances
- Si le lockfile est corrompu ou manquant
- Si des conflits de versions apparaissent
- Après merge de branches avec conflits sur package-lock.json

## Procédure automatique

```bash
# Script complet de régénération
bash scripts/regenerate-package-lock.sh
```

## Procédure manuelle

```bash
# 1. Nettoyer tous les lockfiles
rm -f bun.lockb yarn.lock pnpm-lock.yaml package-lock.json

# 2. Nettoyer node_modules et cache
rm -rf node_modules
npm cache clean --force

# 3. Régénérer le lockfile
npm install --package-lock-only

# 4. Valider le lockfile
node scripts/validate-lockfile.mjs

# 5. Installer les dépendances
npm ci --prefer-offline --legacy-peer-deps
```

## Validation du lockfile

Le script `scripts/validate-lockfile.mjs` vérifie :
- Structure JSON valide
- Présence de `lockfileVersion`, `name`, `packages`
- Version du lockfile (recommandé : v2 ou v3)

## CI/CD

Les workflows GitHub Actions utilisent automatiquement :
```yaml
- run: npm ci --prefer-offline --legacy-peer-deps
```

Cette commande garantit une installation déterministe basée sur le `package-lock.json`.

## Troubleshooting

### Erreur "lockfileVersion < 2"
```bash
# Mettre à jour npm puis régénérer
npm install -g npm@latest
bash scripts/regenerate-package-lock.sh
```

### Erreur "ERESOLVE unable to resolve dependency tree"
```bash
# Utiliser --legacy-peer-deps
npm install --legacy-peer-deps
```

### Présence de bun.lockb
```bash
# Le supprimer immédiatement
rm bun.lockb
bash scripts/regenerate-package-lock.sh
```

## Vérification finale

```bash
# Assertion NPM-only
bash bin/assert-npm-only.sh

# Doit afficher :
# ✅ Node.js version: v20.x.x
# ✅ NPM version: 10.x.x
# ✅ Package manager configuré: npm@10.0.0
# 🎉 Configuration NPM validée avec succès!
```

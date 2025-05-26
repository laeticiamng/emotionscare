
# 🚨 INSTRUCTIONS DE RÉPARATION MANUELLE - PACKAGE.JSON

## Problèmes identifiés dans package.json:

### 1. Package inexistant: `pgtap-run`
**Action**: Supprimer la ligne suivante dans `devDependencies`:
```json
"pgtap-run": "^1.2.0",
```

### 2. Duplicata de `pg`
**Action**: Supprimer SEULEMENT la ligne dans `devDependencies`:
```json
"pg": "^8.11.3"
```
**Garder** la version dans `dependencies`.

### 3. Script utilisant pgtap-run
**Action**: Modifier le script dans `scripts`:
```json
"test:sql": "echo 'pgtap-run non disponible - tests SQL désactivés'"
```

## 🛠️ Comment procéder:

1. **Ouvrir** `package.json`
2. **Aller** à la section `devDependencies` (vers ligne 170-180)
3. **Supprimer** la ligne: `"pgtap-run": "^1.2.0",`
4. **Supprimer** la ligne: `"pg": "^8.11.3"` (SEULEMENT dans devDependencies)
5. **Sauvegarder** le fichier
6. **Lancer**: `npm install` ou `bun install`

## 🔧 Alternative automatique:

Si vous ne voulez pas modifier manuellement:
```bash
node scripts/emergency-fix-install.js
```

Ce script contourne les problèmes et installe les packages avec npm.

## ✅ Vérification:

Après la réparation:
```bash
node scripts/post-emergency-verification.js
```

## 📞 Support:

Si ces instructions ne fonctionnent pas, copiez/collez cette erreur dans votre ticket de support avec la mention "PACKAGE.JSON DUPLICATE/MISSING".

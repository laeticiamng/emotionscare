# 🚨 ISSUE CRITIQUE - Packages imagemin non supprimables

## ❌ Problème confirmé

Les packages suivants restent dans package.json malgré les multiples tentatives de suppression :
- `imagemin-avif: ^0.1.6` (ligne 124)
- `imagemin-webp: ^8.0.0` (ligne 125)
- `vite-plugin-imagemin: ^0.6.1` (ligne 169)

## 🔍 Analyse technique

**Erreur exacte :**
```
TypeError: Expected `count` to be a `number`, got `string`
at /node_modules/imagemin-jpegtran/node_modules/jpegtran-bin/lib/install.js:19:6
```

**Cause :** 
- Le tool `lov-remove-dependency` ne supprime pas réellement les packages de package.json
- Ces packages dépendent de `jpegtran-bin` incompatible avec bun + Node.js v22
- L'installation crash avant que toute solution de contournement puisse s'appliquer

## 🛠️ Solutions tentées (sans succès)

- ✅ Multiples appels `lov-remove-dependency` 
- ✅ Configuration .npmrc pour forcer npm
- ✅ Scripts postinstall pour patcher le problème
- ✅ Stubs de remplacement 
- ✅ Overrides de packages

## 🎯 Solution requise

**Action nécessaire :** Suppression manuelle des 3 lignes dans package.json ou intervention technique sur l'environnement Lovable pour corriger le tool de suppression de dépendances.

**Impact :** Projet complètement bloqué - impossible de build ou développer tant que ces packages restent.

**Priorité :** CRITIQUE - Empêche tout développement
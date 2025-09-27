# 🚨 TICKET CRITIQUE - Erreur TypeScript TS5090 Infrastructure

## 📋 Résumé
**Priorité**: CRITIQUE - Bloque le développement  
**Type**: Bug Infrastructure Lovable  
**Composant**: Configuration TypeScript (tsconfig.json)  
**Impact**: Build échoue, développement impossible

## 🔍 Description détaillée du problème

### Erreur technique
```
tsconfig.json(16,9): error TS5090: Non-relative paths are not allowed. Did you forget a leading './'?
tsconfig.json(19,9): error TS5090: Non-relative paths are not allowed. Did you forget a leading './'?
tsconfig.json(22,9): error TS5090: Non-relative paths are not allowed. Did you forget a leading './'?
```

### Code problématique dans tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",           // ← Ligne 16 - OK
    "paths": {
      "@/*": ["src/*"],       // ← OK
      "@types/*": ["types/*"], // ← Ligne 19 - ERREUR: devrait être ["./types/*"]
      // ...
      "cross-fetch": ["tests/polyfills/cross-fetch.ts"] // ← Ligne 22 - ERREUR: devrait être ["./tests/polyfills/cross-fetch.ts"]
    }
  }
}
```

## 🎯 Cause racine
TypeScript 5.x a renforcé les règles de résolution des chemins. Les chemins dans `paths` doivent maintenant être explicitement relatifs avec `./` pour éviter la confusion avec les modules npm.

## ✅ Solution technique requise

### Changements nécessaires dans tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@types/*": ["./types/*"],           // ← Ajout du "./" 
      "cross-fetch": ["./tests/polyfills/cross-fetch.ts"] // ← Ajout du "./"
    }
  }
}
```

## 🚫 Contrainte technique
Le fichier `tsconfig.json` est marqué **READ-ONLY** dans Lovable, empêchant toute correction par les développeurs ou l'IA.

## 📊 Impact business

### Bloquages actuels
- ❌ `npm run dev` échoue
- ❌ `npm run build` échoue  
- ❌ Développement impossible
- ❌ Tests impossibles
- ❌ Déploiement bloqué

### Workarounds tentés (inefficaces)
✅ Configuration Vite en mode esbuild pure ➜ Contourne partiellement  
❌ Modification tsconfig.json ➜ Fichier en lecture seule  
❌ Renommage des fichiers TS ➜ Ne résout pas le problème de base

## 🔧 Actions requises (Équipe Infrastructure Lovable)

1. **Immediate (P0)**
   - Corriger `tsconfig.json` pour tous les projets affectés
   - Ajouter `./` devant les chemins relatifs dans `paths`

2. **Préventif (P1)**  
   - Mettre à jour le template de base Lovable
   - Validation automatique des tsconfig.json générés
   - Tests d'intégration TypeScript 5.x

3. **Monitoring (P2)**
   - Alertes sur les erreurs TS5090 dans les builds
   - Métriques des projets affectés

## 📋 Critères d'acceptation
- [ ] `npm run dev` fonctionne sans erreur TS5090
- [ ] `npm run build` réussit complètement  
- [ ] Hot reload TypeScript opérationnel
- [ ] Aucune régression sur les alias de chemins existants

## 🕐 Estimation
**Effort**: 1-2h développeur infrastructure  
**Risque**: Faible (changement de configuration pure)  
**Urgence**: IMMÉDIATE - Bloque 100% des fonctionnalités

## 📝 Notes techniques complémentaires

### Contexte TypeScript
Cette erreur est apparue avec TypeScript 5.0+ qui a durci les règles de résolution des modules pour améliorer les performances et éviter les ambiguïtés.

### Autres projets potentiellement affectés
Tous les projets Lovable utilisant des chemins relatifs sans `./` dans `tsconfig.json`

---
**Assigné à**: Équipe Infrastructure Lovable  
**Reporter**: EmotionsCare Project  
**Date**: 2025-01-27  
**Statut**: OUVERT - ACTION REQUISE
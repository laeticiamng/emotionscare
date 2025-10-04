# 🧪 Plan d'Exécution Tests RouterV2 - Fractionné

## 📋 Vue d'ensemble

**Objectif** : Exécuter tous les tests unitaires RouterV2 de manière fractionnée pour validation complète.

**Couverture cible** : 
- ✅ 100% Guards
- ✅ 100% Registry 
- ✅ 100% Aliases

---

## 🎯 Mission 1 : Tests Guards (4 fichiers)

### Commandes d'exécution

```bash
# Test AuthGuard individuel
npm test src/routerV2/__tests__/AuthGuard.test.tsx

# Test RoleGuard individuel  
npm test src/routerV2/__tests__/RoleGuard.test.tsx

# Test ModeGuard individuel
npm test src/routerV2/__tests__/ModeGuard.test.tsx

# Test RouteGuard individuel
npm test src/routerV2/__tests__/RouteGuard.test.tsx

# Tous les guards ensemble
npm test src/routerV2/__tests__/*Guard.test.tsx
```

### Validation attendue
- ✅ AuthGuard : redirection non-auth, accès auth
- ✅ RoleGuard : vérification rôles, blocage accès
- ✅ ModeGuard : synchronisation segment/mode
- ✅ RouteGuard : orchestration complète guards

---

## 🎯 Mission 2 : Tests Registry

### Commandes d'exécution

```bash
# Test registry complet
npm test src/routerV2/__tests__/registry.test.ts

# Test avec couverture
npm test src/routerV2/__tests__/registry.test.ts -- --coverage
```

### Validation attendue (13 suites)
1. ✅ Registry Structure (3 tests)
2. ✅ Route Schema Validation (9 tests)
3. ✅ Path Uniqueness (4 tests)
4. ✅ Path Format Validation (6 tests)
5. ✅ Role and Segment Consistency (4 tests)
6. ✅ Component References (3 tests)
7. ✅ Guard Configuration (3 tests)
8. ✅ Layout Configuration (3 tests)
9. ✅ Deprecated Routes (2 tests)
10. ✅ Specific Route Categories (5 tests)
11. ✅ Alias Configuration (3 tests)
12. ✅ Registry Statistics (1 test)

**Total** : ~46 tests registry

---

## 🎯 Mission 3 : Tests Aliases

### Commandes d'exécution

```bash
# Test aliases (TypeScript)
npm test src/routerV2/__tests__/aliases.test.ts

# Test avec détails
npm test src/routerV2/__tests__/aliases.test.ts -- --reporter=verbose
```

### Validation attendue
- ✅ Redirections legacy → canonical
- ✅ Mapping vers routes existantes
- ✅ Helpers exposés valides
- ✅ Pas de cycles de redirection
- ✅ Préservation query params

---

## 🚀 Exécution Complète Fractionnée

### Séquence recommandée

```bash
# Étape 1 : Guards (rapide, ~2-3s)
echo "=== MISSION 1 : GUARDS ==="
npm test src/routerV2/__tests__/*Guard.test.tsx

# Étape 2 : Registry (moyen, ~3-5s)
echo "=== MISSION 2 : REGISTRY ==="
npm test src/routerV2/__tests__/registry.test.ts

# Étape 3 : Aliases (rapide, ~1-2s)
echo "=== MISSION 3 : ALIASES ==="
npm test src/routerV2/__tests__/aliases.test.ts

# Étape 4 : Tests intégration (si présents)
echo "=== MISSION 4 : INTEGRATION ==="
npm test src/routerV2/__tests__/guards.test.tsx
```

### Script automatisé

```bash
# Créer un script npm dans package.json
"scripts": {
  "test:router:guards": "vitest run src/routerV2/__tests__/*Guard.test.tsx",
  "test:router:registry": "vitest run src/routerV2/__tests__/registry.test.ts",
  "test:router:aliases": "vitest run src/routerV2/__tests__/aliases.test.ts",
  "test:router:all": "npm run test:router:guards && npm run test:router:registry && npm run test:router:aliases",
  "test:router:coverage": "vitest run src/routerV2/__tests__ --coverage"
}
```

---

## 📊 Critères de Succès

### Par mission

| Mission | Fichiers | Tests | Durée | Status |
|---------|----------|-------|-------|--------|
| Guards  | 4        | ~40   | 3s    | ⏳     |
| Registry| 1        | ~46   | 5s    | ⏳     |
| Aliases | 1        | ~10   | 2s    | ⏳     |
| **Total** | **6** | **~96** | **10s** | ⏳ |

### Validation globale

- [ ] 0 tests échoués
- [ ] 0 warnings critiques
- [ ] Couverture ≥ 90% lignes
- [ ] Couverture ≥ 85% branches
- [ ] Temps total < 15s

---

## 🔍 Debugging en cas d'échec

### Si tests guards échouent
```bash
# Vérifier mocks
npm test src/routerV2/__tests__/AuthGuard.test.tsx -- --reporter=verbose

# Vérifier contextes
grep -r "useAuth" src/routerV2/__tests__/
```

### Si tests registry échouent
```bash
# Voir détails échecs
npm test src/routerV2/__tests__/registry.test.ts -- --reporter=verbose

# Vérifier registry
cat src/routerV2/registry.ts | grep "path:"
```

### Si tests aliases échouent
```bash
# Voir redirections
npm test src/routerV2/__tests__/aliases.test.ts -- --reporter=verbose

# Vérifier alias map
cat src/routerV2/aliases.tsx | grep "ROUTE_ALIASES"
```

---

## 📝 Rapport Final

Après exécution complète, générer rapport :

```bash
# Rapport HTML avec couverture
npm test src/routerV2/__tests__ -- --coverage --reporter=html

# Ouvrir rapport
open coverage/index.html
```

### Format attendu

```
Test Files  6 passed (6)
     Tests  96 passed (96)
  Duration  10.23s

Coverage:
  Lines     92.5% (453/490)
  Branches  88.3% (187/212)
  Functions 91.2% (123/135)
```

---

## ✅ Checklist Validation

- [ ] Tous les guards testés individuellement
- [ ] Registry validé (structure, doublons, cohérence)
- [ ] Aliases validés (redirections, cycles, params)
- [ ] Aucun test flaky
- [ ] Couverture > seuils
- [ ] Documentation mise à jour

---

**Date création** : 2025-10-04  
**Dernière MAJ** : 2025-10-04  
**Responsable** : AI Assistant (Lovable)

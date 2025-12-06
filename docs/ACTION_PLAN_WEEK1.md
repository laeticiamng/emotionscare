# 🎯 Plan d'Action - Semaine 1 (Sprint Critique)

**Période**: 02-09 Janvier 2025  
**Objectif**: Résoudre les 4 problèmes P0 critiques  
**Équipe**: 1-2 dev seniors

---

## 📅 Planning Détaillé

### Jour 1-2 : TypeScript Critique

#### Fichiers à corriger (priorité P0)

1. **src/contexts/AuthContext.tsx**
```typescript
// Retirer @ts-nocheck
// Typer correctement User, Session, AuthContextType
// Créer interfaces strictes
```

2. **src/contexts/SimpleAuth.tsx**
```typescript
// Unifier avec AuthContext ou supprimer
// Typer SimpleAuthContextType
```

3. **src/contexts/UserModeContext.tsx**
```typescript
// Typer Role, UserMode, UserModeContextValue
// Corriger les any
```

4. **src/routerV2/router.tsx**
```typescript
// Retirer @ts-nocheck
// Typer componentMap avec Record<string, LazyExoticComponent>
// Typer RouteMeta correctement
```

5. **src/routerV2/registry.ts**
```typescript
// Retirer @ts-nocheck
// Assurer que RouteMeta est bien typé
```

**Checklist Jour 1-2**:
- [ ] Retirer @ts-nocheck des 5 fichiers
- [ ] Corriger toutes les erreurs TypeScript
- [ ] Tester que l'app compile sans erreurs
- [ ] Vérifier que les tests passent
- [ ] Commit: `fix(types): remove @ts-nocheck from critical auth/router files`

---

### Jour 3 : Logger Centralisé

#### 1. Créer le logger
```bash
# Créer src/lib/logger.ts
```

```typescript
import * as Sentry from '@sentry/react';

const IS_DEV = import.meta.env.DEV;
const IS_TEST = import.meta.env.MODE === 'test';

// Ne jamais logger en tests
const shouldLog = IS_DEV && !IS_TEST;

export const logger = {
  info: (message: string, data?: Record<string, unknown>) => {
    if (shouldLog) {
      console.log(`ℹ️ ${message}`, data);
    }
  },

  error: (message: string, error: Error, data?: Record<string, unknown>) => {
    if (shouldLog) {
      console.error(`❌ ${message}`, error, data);
    }
    
    // Toujours envoyer à Sentry en prod
    if (!IS_DEV) {
      Sentry.captureException(error, {
        extra: { message, ...data }
      });
    }
  },

  warn: (message: string, data?: Record<string, unknown>) => {
    if (shouldLog) {
      console.warn(`⚠️ ${message}`, data);
    }
  },

  debug: (message: string, data?: Record<string, unknown>) => {
    if (shouldLog && localStorage.getItem('debug') === 'true') {
      console.debug(`🔍 ${message}`, data);
    }
  }
};
```

#### 2. Remplacer dans les fichiers critiques

**Priorité 1 - Auth**:
- [ ] `src/contexts/AuthContext.tsx`
- [ ] `src/contexts/SimpleAuth.tsx`

**Priorité 2 - Router**:
- [ ] `src/routerV2/router.tsx`
- [ ] `src/routerV2/guards.tsx`

**Priorité 3 - Coach**:
- [ ] `src/modules/coach/CoachView.tsx`
- [ ] `src/pages/B2CAICoachPage.tsx`

**Checklist Jour 3**:
- [ ] Créer logger.ts
- [ ] Remplacer console.* dans 10 fichiers critiques
- [ ] Vérifier que rien n'est cassé
- [ ] Commit: `feat(logger): add centralized logger and replace console.*`

---

### Jour 4 : Feature Flags Unifiés

#### 1. Analyser les 2 systèmes

**Système A**: `src/core/flags.ts` (57 flags)
```typescript
FF_JOURNAL, FF_NYVEE, FF_DASHBOARD, FF_COACH, FF_MUSIC...
```

**Système B**: `src/config/featureFlags.ts` (6 flags)
```typescript
FF_B2C_PORTAL, FF_MUSIC_THERAPY, FF_VR, FF_COACHING_AI...
```

#### 2. Décision Architecture

**Option Recommandée**: Garder `src/config/featureFlags.ts` + remote config

```typescript
// src/config/featureFlags.ts (NEW)
export type FeatureFlagKey = 
  // Auth & Access
  | 'FF_B2C_PORTAL'
  | 'FF_B2B_ANALYTICS'
  
  // Modules Core
  | 'FF_COACH'
  | 'FF_JOURNAL'
  | 'FF_MUSIC'
  | 'FF_VR'
  | 'FF_SCAN'
  
  // Modules Premium
  | 'FF_PREMIUM_SUNO'
  | 'FF_COMMUNITY'
  | 'FF_SOCIAL_COCON'
  
  // Assessment
  | 'FF_ASSESS_WHO5'
  | 'FF_ASSESS_STAI6'
  // ... tous les assessments
  
  // Features expérimentales
  | 'FF_NYVEE'
  | 'FF_ORCH_AURAS';

export interface FeatureFlags {
  [key: FeatureFlagKey]: boolean;
}

// Default values
export const DEFAULT_FLAGS: FeatureFlags = {
  // Tout à true par défaut sauf features expérimentales
  FF_COACH: true,
  FF_JOURNAL: true,
  // ...
  FF_NYVEE: false, // Expérimental
};

// Remote config loader
export async function loadRemoteFlags(): Promise<Partial<FeatureFlags>> {
  try {
    const response = await fetch('/api/feature-flags');
    return await response.json();
  } catch {
    return {};
  }
}
```

#### 3. Migration Steps

1. **Créer le nouveau système**
   - [ ] Fusionner les 57 + 6 flags
   - [ ] Créer types stricts
   - [ ] Setup remote config

2. **Migrer les consumers**
   - [ ] Remplacer `useFlags()` de core/flags
   - [ ] Utiliser `useFeatureFlags()` partout
   - [ ] Supprimer ancien système

3. **Tests**
   - [ ] Tester chaque flag
   - [ ] Vérifier que tous les modules fonctionnent

**Checklist Jour 4**:
- [ ] Créer nouveau système unifié
- [ ] Migrer 20 usages prioritaires
- [ ] Tests unitaires pour flags
- [ ] Commit: `refactor(flags): unify feature flags system`

---

### Jour 5 : ConsentGate & Tests

#### 1. Fix ConsentGate (DÉJÀ FAIT ✅)

```typescript
// src/features/clinical-optin/ConsentGate.tsx
if (consent.status === 'unknown' || consent.loading) {
  return <>{children}</>; // ✅ Ne plus bloquer
}
```

#### 2. Fixer les tests cassés

**Tests à vérifier**:
- [ ] `e2e/noBlank.spec.ts` - Vérifier les 52 routes
- [ ] `src/modules/coach/__tests__/*` - Tests Coach
- [ ] `src/features/clinical-optin/__tests__/*` - Tests Consent

**Ajouter tests manquants**:
```typescript
// tests/unit/feature-flags.test.ts
describe('Feature Flags', () => {
  it('should return default flags when no remote config', () => {
    const flags = getFeatureFlags();
    expect(flags.FF_COACH).toBe(true);
  });

  it('should merge remote flags with defaults', async () => {
    const flags = await loadFeatureFlagsWithRemote();
    expect(flags).toBeDefined();
  });
});
```

**Checklist Jour 5**:
- [ ] Vérifier ConsentGate fix
- [ ] Fixer tous les tests cassés
- [ ] Ajouter tests pour feature flags
- [ ] Commit: `test: fix broken tests and add feature flags tests`

---

## 📊 Métriques de Succès

### Avant Sprint 1
- ❌ 2964 fichiers @ts-nocheck
- ❌ 1855 console.*
- ❌ 2 systèmes feature flags
- ❌ Tests cassés

### Après Sprint 1 (Objectif)
- ✅ 5 fichiers critiques sans @ts-nocheck (-2959)
- ✅ 100 console.* remplacés par logger (-1755)
- ✅ 1 seul système feature flags unifié
- ✅ 100% tests passent

---

## 🚀 Commandes Utiles

### Vérifier progression TypeScript
```bash
# Compter les @ts-nocheck restants
grep -r "@ts-nocheck" src/ | wc -l

# Compiler sans erreurs
npm run typecheck
```

### Vérifier progression Logger
```bash
# Compter les console.* restants
grep -r "console\." src/ | wc -l

# Linter les logs
npm run lint
```

### Tester
```bash
# Tests unitaires
npm run test

# Tests e2e
npm run e2e

# Type check
npm run typecheck
```

---

## 📝 Commits Standards

```bash
# TypeScript
git commit -m "fix(types): remove @ts-nocheck from AuthContext"

# Logger
git commit -m "feat(logger): replace console.* with centralized logger"

# Feature Flags
git commit -m "refactor(flags): unify feature flags system"

# Tests
git commit -m "test: fix ConsentGate and add feature flags tests"
```

---

## 🆘 Problèmes Potentiels

### Si TypeScript casse tout
1. Commenter temporairement les erreurs
2. Corriger une par une
3. Ne JAMAIS remettre @ts-nocheck

### Si les tests cassent
1. Identifier le test cassé
2. Fixer ou skip temporairement
3. Créer issue pour fix ultérieur

### Si feature flags cassent des modules
1. Rollback la migration
2. Tester module par module
3. Déployer progressivement

---

## ✅ Validation Finale

Avant de merger la semaine 1:

- [ ] Tous les tests passent
- [ ] TypeCheck passe sans erreurs
- [ ] Build production réussit
- [ ] Aucune régression fonctionnelle
- [ ] Code review approuvé
- [ ] Documentation mise à jour

---

*Plan généré le 02/01/2025 - EmotionsCare Sprint Critique*

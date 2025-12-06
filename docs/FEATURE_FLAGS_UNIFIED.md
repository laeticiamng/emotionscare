# Feature Flags - Système Unifié ✅

## État actuel

Le système de feature flags a été **unifié** dans `src/core/flags.ts`.

### Changements effectués

1. ✅ **Fusion des deux systèmes** :
   - `src/core/flags.ts` → Système principal (conservé et étendu)
   - `src/config/featureFlags.ts` → Alias de compatibilité (DEPRECATED)

2. ✅ **Nouveaux flags ajoutés** :
   - `FF_B2C_PORTAL`, `FF_MUSIC_THERAPY`, `FF_COACHING_AI`, `FF_IMMERSIVE_SESSIONS`
   - `FF_B2B_ANALYTICS` (unifié avec `FF_B2B_RH`)

3. ✅ **Type safety amélioré** :
   ```typescript
   export type FeatureFlagKey = keyof FeatureFlags;
   ```

4. ✅ **Gestion par rôle unifiée** :
   ```typescript
   const ROLE_FEATURE_FLAGS = {
     consumer: { /* flags B2C */ },
     employee: { /* flags B2B employee */ },
     manager: { /* flags B2B RH */ },
     admin: { /* tous les flags */ }
   };
   ```

## Utilisation

### Hook principal
```typescript
import { useFlags } from '@/core/flags';

function MyComponent() {
  const { flags, has } = useFlags();
  
  if (has('FF_COACH')) {
    return <CoachModule />;
  }
}
```

### Hook avec rôles
```typescript
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

function MyComponent() {
  const { flags, isEnabled } = useFeatureFlags();
  
  if (isEnabled('FF_B2B_ANALYTICS')) {
    return <AnalyticsDashboard />;
  }
}
```

### Fonction utilitaire
```typescript
import { isFeatureEnabled, getFeatureFlagsForRole } from '@/core/flags';

const managerFlags = getFeatureFlagsForRole('manager');
const canViewAnalytics = isFeatureEnabled(managerFlags, 'FF_B2B_ANALYTICS');
```

## Liste des flags

### Core Features
- `FF_JOURNAL` - Journal émotionnel
- `FF_COACH` - Coach IA
- `FF_MUSIC` - Thérapie musicale
- `FF_VR` - Réalité virtuelle
- `FF_SCAN` - Scan émotionnel
- `FF_DASHBOARD` - Dashboard principal

### B2C Features
- `FF_B2C_PORTAL` - Portail B2C
- `FF_MUSIC_THERAPY` - Musicothérapie avancée
- `FF_COACHING_AI` - Coaching IA avancé
- `FF_IMMERSIVE_SESSIONS` - Sessions immersives

### B2B Features
- `FF_MANAGER_DASH` - Dashboard manager
- `FF_B2B_RH` - Fonctions RH
- `FF_B2B_HEATMAP` - Heatmap émotionnelle
- `FF_B2B_ANALYTICS` - Analytics B2B
- `FF_B2B_AGGREGATES` - Agrégations de données

### Orchestration
- `FF_ORCH_COMMUNITY` - Communauté orchestrée
- `FF_ORCH_AMBITION` - Module Ambition
- `FF_ORCH_GRIT` - Module Grit
- `FF_ORCH_BUBBLE` - Module Bubble Beat
- `FF_ORCH_MIXER` - Module Mood Mixer
- `FF_ORCH_STORY` - Module Story Synth

### Clinical Assessments
- `FF_ASSESS_WHO5` - WHO-5 Well-being Index
- `FF_ASSESS_STAI6` - STAI-6 Anxiety
- `FF_ASSESS_PANAS` - PANAS Mood
- `FF_ASSESS_PSS10` - PSS-10 Stress
- `FF_ASSESS_SAM` - Self-Assessment Manikin
- ... (40+ autres assessments)

## Migration

### Ancien code (DEPRECATED)
```typescript
// ❌ Ne plus utiliser
import { useFeatureFlags } from '@/config/featureFlags';
```

### Nouveau code
```typescript
// ✅ À utiliser
import { useFlags } from '@/core/flags';
// ou
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
```

## Fichiers modifiés

1. ✅ `src/core/flags.ts` - Système unifié complet
2. ✅ `src/config/featureFlags.ts` - Alias de compatibilité
3. ✅ `src/hooks/useFeatureFlags.ts` - Hook mis à jour
4. ✅ `src/lib/logger/index.ts` - Logger sans `@ts-nocheck`

## Avantages

- ✅ **Type safety** : Tous les flags sont typés strictement
- ✅ **Single source of truth** : Un seul endroit pour tous les flags
- ✅ **Role-based access** : Flags adaptés par rôle automatiquement
- ✅ **Compatibilité** : L'ancien système reste compatible
- ✅ **Logging** : Intégration avec le système de logger unifié

## Prochaines étapes

1. Migrer progressivement le code utilisant `@/config/featureFlags`
2. Supprimer `src/config/featureFlags.ts` après migration complète
3. Ajouter des tests unitaires pour les flags par rôle
4. Documenter les flags manquants

---
**Date** : 2025-01-02  
**Status** : ✅ Unifié et opérationnel  
**Impact** : Résolution du conflit de feature flags dans l'audit

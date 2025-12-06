# 🔍 AUDIT MODULE MUSIQUE - /app/music

## ❌ PROBLÈMES IDENTIFIÉS

### 1. **Mauvais composant chargé**
- **Registry** (`src/routerV2/registry.ts` ligne 201) : demande `B2CMusicEnhanced`
- **Router** (`src/routerV2/router.tsx` ligne 206) : mappe vers `B2CAdaptiveMusicPage`
- **Import** (ligne 53) : charge `@/modules/adaptive-music/AdaptiveMusicPage`

**Résultat :** Le composant chargé n'est PAS celui attendu !

### 2. **Composant AdaptiveMusicPage - Trop complexe**
`src/modules/adaptive-music/AdaptiveMusicPage.tsx` :
- ❌ Dépend de 5+ hooks custom qui peuvent échouer :
  - `useCurrentMood()` - peut ne pas avoir de données
  - `useAdaptivePlayback()` - état initial vide
  - `useMusicFavorites()` - peut ne pas être initialisé
  - `useAssessment("POMS")` - assessment complexe
  - `useQuery` pour charger playlist - peut échouer

- ❌ Vérifie `FF_MUSIC` mais affiche seulement un message si désactivé
- ❌ Si `playlistQuery` échoue ou est en loading, peut afficher un écran vide
- ❌ Dépend de services externes (`requestMoodPlaylist`)

### 3. **Composant B2CMusicEnhanced - NON utilisé mais disponible**
`src/pages/B2CMusicEnhanced.tsx` :
- ✅ Composant simple avec vinyles
- ✅ Utilise localStorage pour persistance
- ✅ Player audio intégré
- ✅ Pas de dépendances externes complexes
- ✅ Fonctionne en standalone
- ❌ **MAIS il n'est PAS importé dans le router !**

### 4. **Variables CSS - Fixées**
- ✅ Variables sidebar ajoutées dans `index.css`
- ✅ `bg-background text-foreground` ajouté au main
- ❌ Mais ça ne suffit pas si le composant ne render rien

### 5. **Feature Flag**
- ✅ `FF_MUSIC` activé par défaut dans `flags.ts` (ligne 67)
- ✅ Bien ajouté à l'interface FeatureFlags

## 🎯 SOLUTION IMMÉDIATE

Utiliser `B2CMusicEnhanced` au lieu de `AdaptiveMusicPage` car :
1. Plus simple et autonome
2. Pas de dépendances externes complexes
3. Affichage garanti avec les vinyles
4. UI complète et testée

## 📋 CHANGEMENTS NÉCESSAIRES

### A. Router (`src/routerV2/router.tsx`)
```typescript
// AVANT (ligne 53) :
const B2CAdaptiveMusicPage = lazy(() => import('@/modules/adaptive-music/AdaptiveMusicPage')...);

// APRÈS :
const B2CMusicEnhanced = lazy(() => import('@/pages/B2CMusicEnhanced'));
```

### B. ComponentMap (ligne 206)
```typescript
// AVANT :
B2CMusicEnhanced: B2CAdaptiveMusicPage,

// APRÈS :
B2CMusicEnhanced: B2CMusicEnhanced,
```

## ⚠️ HOOKS MANQUANTS POUR AdaptiveMusicPage

Si on garde AdaptiveMusicPage, il faut vérifier :
- `useCurrentMood` - retourne des valeurs par défaut
- `useAdaptivePlayback` - initialisé correctement
- `useMusicFavorites` - gère l'état vide
- `useAssessment` - ne bloque pas le render

## 📊 DÉPENDANCES

### AdaptiveMusicPage utilise :
```typescript
import { useQuery } from "@tanstack/react-query";
import { useFlags } from "@/core/flags";
import { useAssessment } from "@/hooks/useAssessment";
import useCurrentMood from "@/hooks/useCurrentMood";
import useMusicFavorites from "@/hooks/useMusicFavorites";
import { useAdaptivePlayback } from "@/hooks/music/useAdaptivePlayback";
import { requestMoodPlaylist } from "@/services/moodPlaylist.service";
```

### B2CMusicEnhanced utilise :
```typescript
import { useToast } from '@/hooks/use-toast';
import { useClinicalHints } from '@/hooks/useClinicalHints';
import { getOptimizedUniverse } from '@/data/universes/config';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';
```

**Verdict :** B2CMusicEnhanced = beaucoup plus léger et autonome

## ✅ PROCHAINES ÉTAPES

1. Remplacer l'import dans le router
2. Tester /app/music
3. Si besoin, vérifier les hooks manquants
4. Documenter le choix du composant

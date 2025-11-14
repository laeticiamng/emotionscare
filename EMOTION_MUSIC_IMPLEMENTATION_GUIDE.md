# 🎵 Guide d'Implémentation - Améliorations Emotion-Music

> **Date**: 2025-11-14
> **Version**: 1.0
> **Statut**: Prêt pour implémentation

Ce guide explique comment implémenter les améliorations apportées au module emotion-music.

---

## 📦 NOUVEAUX FICHIERS AJOUTÉS

### 1. Validateurs Zod
**Fichier**: `src/validators/music.ts`

#### Utilisation

```typescript
import {
  MusicGenerationInputSchema,
  validateInput,
  sanitizeText
} from '@/validators/music';

// Valider un input de génération
const result = validateInput(MusicGenerationInputSchema, userInput);

if (result.success) {
  // Utiliser result.data (typé et validé)
  await generateMusic(result.data);
} else {
  // Afficher result.errors à l'utilisateur
  console.error(result.errors);
}
```

#### Intégration dans les services

```typescript
// Dans enhanced-music-service.ts
import { MusicGenerationInputSchema, validateInput } from '@/validators/music';

async generateMusicWithTracking(request: unknown) {
  // Valider l'input
  const validation = validateInput(MusicGenerationInputSchema, request);

  if (!validation.success) {
    throw new Error(`Invalid input: ${validation.errors.join(', ')}`);
  }

  // Utiliser validation.data (sûr et typé)
  const validRequest = validation.data;
  // ... suite du code
}
```

---

### 2. Service de Quotas
**Fichier**: `src/services/music/quota-service.ts`

#### Utilisation

```typescript
import { quotaService } from '@/services/music/quota-service';

// Vérifier le quota avant génération
async function handleMusicGeneration(userId: string, duration: number) {
  // 1. Vérifier quota de base
  const quota = await quotaService.checkQuota(userId);

  if (!quota.canGenerate) {
    toast.error(quota.reason || 'Quota épuisé');
    return;
  }

  // 2. Vérifier la durée
  const durationCheck = await quotaService.canGenerateWithDuration(userId, duration);

  if (!durationCheck.canGenerate) {
    toast.error(durationCheck.reason || 'Durée trop longue pour votre tier');
    return;
  }

  // 3. Vérifier générations concurrentes
  const concurrentCheck = await quotaService.checkConcurrentGenerations(userId);

  if (!concurrentCheck.canGenerate) {
    toast.error(concurrentCheck.reason || 'Trop de générations en cours');
    return;
  }

  // 4. Incrémenter avant génération
  const incremented = await quotaService.incrementUsage(userId);

  if (!incremented) {
    toast.error('Impossible d\'incrémenter le quota');
    return;
  }

  try {
    // Générer la musique
    await generateMusic(...);
  } catch (error) {
    // En cas d'erreur, décrémenter le quota
    await quotaService.decrementUsage(userId);
    throw error;
  }
}
```

#### Hook React pour quotas

```typescript
// src/hooks/music/useUserQuota.ts
import { useQuery } from '@tanstack/react-query';
import { quotaService } from '@/services/music/quota-service';
import { supabase } from '@/integrations/supabase/client';

export function useUserQuota() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    }
  });

  return useQuery({
    queryKey: ['music-quota', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return quotaService.getUsageStats(user.id);
    },
    enabled: !!user?.id,
    refetchInterval: 30000 // Rafraîchir toutes les 30s
  });
}
```

---

### 3. Migration Base de Données
**Fichier**: `supabase/migrations/20251114_music_enhancements.sql`

#### Déploiement

```bash
# 1. Appliquer la migration localement (dev)
npx supabase migration up

# 2. Vérifier les tables créées
npx supabase db diff

# 3. Pousser vers production
npx supabase db push
```

#### Vérification post-migration

```sql
-- Vérifier que toutes les tables existent
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE '%music%'
ORDER BY table_name;

-- Vérifier les RLS policies
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename LIKE '%music%';

-- Vérifier les index
SELECT indexname, tablename, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename LIKE '%music%';
```

---

### 4. Utilitaires Accessibilité
**Fichier**: `src/utils/music-a11y.ts`

#### Utilisation dans les composants

```typescript
import {
  announceTrackChange,
  announcePlaybackState,
  setupMusicKeyboardNavigation,
  getPlayerAriaAttributes,
  getPlayButtonAriaAttributes
} from '@/utils/music-a11y';

export function MusicPlayer({ track, isPlaying, onPlayPause }) {
  const playerRef = useRef<HTMLDivElement>(null);

  // Annoncer les changements
  useEffect(() => {
    if (track) {
      announceTrackChange(track);
    }
  }, [track?.id]);

  useEffect(() => {
    announcePlaybackState(isPlaying, track);
  }, [isPlaying]);

  // Setup keyboard navigation
  useEffect(() => {
    if (!playerRef.current) return;

    const cleanup = setupMusicKeyboardNavigation(playerRef.current, {
      onPlayPause,
      onNext: handleNext,
      onPrev: handlePrev,
      onVolumeUp: () => setVolume(v => Math.min(1, v + 0.1)),
      onVolumeDown: () => setVolume(v => Math.max(0, v - 0.1))
    });

    return cleanup;
  }, [onPlayPause, handleNext, handlePrev]);

  return (
    <div
      ref={playerRef}
      {...getPlayerAriaAttributes(isPlaying, track)}
    >
      <button
        {...getPlayButtonAriaAttributes(isPlaying)}
        onClick={onPlayPause}
      >
        {isPlaying ? <Pause /> : <Play />}
      </button>
    </div>
  );
}
```

#### Exemple avec liste de tracks

```typescript
import {
  setupRovingTabindex,
  getTrackListAriaAttributes,
  getTrackItemAriaAttributes
} from '@/utils/music-a11y';

export function TrackList({ tracks, currentTrack, onTrackSelect }) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current) return;

    const cleanup = setupRovingTabindex(listRef.current, '[role="listitem"]');
    return cleanup;
  }, [tracks]);

  return (
    <div
      ref={listRef}
      {...getTrackListAriaAttributes(tracks.length)}
    >
      {tracks.map((track, index) => (
        <div
          key={track.id}
          {...getTrackItemAriaAttributes(
            track,
            index,
            currentTrack?.id === track.id
          )}
          onClick={() => onTrackSelect(track)}
        >
          {track.title}
        </div>
      ))}
    </div>
  );
}
```

---

### 5. Tests Unitaires
**Fichier**: `src/services/music/__tests__/quota-service.test.ts`

#### Exécuter les tests

```bash
# Tous les tests
npm run test

# Tests music seulement
npm run test src/services/music

# Tests avec coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

#### Ajouter d'autres tests

```typescript
// src/services/music/__tests__/enhanced-music-service.test.ts
import { describe, it, expect, vi } from 'vitest';
import { enhancedMusicService } from '../enhanced-music-service';

describe('EnhancedMusicService', () => {
  describe('createPlaylist', () => {
    it('should create playlist successfully', async () => {
      // Test implementation
    });
  });
});
```

---

## 🔄 MIGRATION ÉTAPE PAR ÉTAPE

### Phase 1: Validation (Semaine 1)

#### Étape 1.1: Intégrer validateurs dans les services

```typescript
// Dans enhanced-music-service.ts
import { MusicGenerationInputSchema, validateInput } from '@/validators/music';

async generateMusicWithTracking(request: unknown) {
  const validation = validateInput(MusicGenerationInputSchema, request);

  if (!validation.success) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  // Continue avec validation.data
}
```

#### Étape 1.2: Intégrer validateurs dans les composants

```typescript
// Dans EmotionalMusicGenerator.tsx
import { MusicGenerationInputSchema, validateInput } from '@/validators/music';

const handleGenerate = async () => {
  const input = {
    title: titleInput,
    style: styleInput,
    prompt: promptInput,
    // ...
  };

  const validation = validateInput(MusicGenerationInputSchema, input);

  if (!validation.success) {
    toast.error(validation.errors[0]);
    return;
  }

  // Generate avec validation.data
};
```

### Phase 2: Quotas (Semaine 1-2)

#### Étape 2.1: Appliquer migration

```bash
npx supabase db push
```

#### Étape 2.2: Créer le hook

```typescript
// src/hooks/music/useUserQuota.ts (voir exemple ci-dessus)
```

#### Étape 2.3: Intégrer dans le générateur

```typescript
// Dans B2CMusicEnhanced.tsx
import { useUserQuota } from '@/hooks/music/useUserQuota';

export function B2CMusicEnhanced() {
  const { data: quotaStats, refetch: refetchQuota } = useUserQuota();

  const handleGenerate = async () => {
    const quota = quotaStats?.status;

    if (!quota?.canGenerate) {
      toast.error(`Quota épuisé. Renouvellement le ${new Date(quota.resetDate).toLocaleDateString()}`);
      return;
    }

    // ... génération
  };

  return (
    <div>
      <QuotaIndicator
        used={quotaStats?.quota?.generationsUsed || 0}
        limit={quotaStats?.quota?.generationsLimit || 10}
        resetDate={quotaStats?.quota?.resetDate}
      />
    </div>
  );
}
```

### Phase 3: Accessibilité (Semaine 2)

#### Étape 3.1: Initialiser live regions

```typescript
// Dans App.tsx ou layout principal
import { createAriaLiveRegion, ensureFocusVisible } from '@/utils/music-a11y';

useEffect(() => {
  createAriaLiveRegion();
  ensureFocusVisible();
}, []);
```

#### Étape 3.2: Mettre à jour UnifiedMusicPlayer

```typescript
// Dans UnifiedMusicPlayer.tsx
import {
  announceTrackChange,
  announcePlaybackState,
  setupMusicKeyboardNavigation,
  getPlayerAriaAttributes,
  getPlayButtonAriaAttributes,
  getVolumeSliderAriaAttributes
} from '@/utils/music-a11y';

export function UnifiedMusicPlayer() {
  // ... existing code

  // Announcements
  useEffect(() => {
    if (currentTrack) {
      announceTrackChange(currentTrack);
    }
  }, [currentTrack?.id]);

  useEffect(() => {
    announcePlaybackState(isPlaying, currentTrack);
  }, [isPlaying]);

  // Keyboard navigation
  useEffect(() => {
    if (!playerRef.current) return;

    return setupMusicKeyboardNavigation(playerRef.current, {
      onPlayPause: togglePlay,
      onNext: playNext,
      onPrev: playPrev,
      onVolumeUp: () => setVolume(v => Math.min(1, v + 0.1)),
      onVolumeDown: () => setVolume(v => Math.max(0, v - 0.1)),
      onMute: toggleMute,
      onToggleFavorite: toggleFavorite
    });
  }, [/* deps */]);

  return (
    <div {...getPlayerAriaAttributes(isPlaying, currentTrack)}>
      <button
        {...getPlayButtonAriaAttributes(isPlaying)}
        onClick={togglePlay}
      >
        {isPlaying ? <Pause /> : <Play />}
      </button>

      <input
        type="range"
        {...getVolumeSliderAriaAttributes(volume)}
        value={volume}
        onChange={handleVolumeChange}
      />
    </div>
  );
}
```

### Phase 4: Tests (Semaine 3-4)

#### Étape 4.1: Setup test environment

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/user-event
```

#### Étape 4.2: Créer tests pour chaque service

Suivre le modèle de `quota-service.test.ts`

#### Étape 4.3: Ajouter coverage gate en CI

```yaml
# .github/workflows/test.yml
- name: Run tests with coverage
  run: npm run test:coverage

- name: Check coverage
  run: |
    COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
    if (( $(echo "$COVERAGE < 80" | bc -l) )); then
      echo "Coverage $COVERAGE% is below 80%"
      exit 1
    fi
```

---

## 🎯 CHECKLIST D'IMPLÉMENTATION

### Validation & Sécurité
- [ ] Intégrer validateurs Zod dans tous les services
- [ ] Ajouter sanitization sur tous les inputs utilisateur
- [ ] Tester validation avec inputs malicieux
- [ ] Documenter schémas de validation

### Quotas
- [ ] Appliquer migration Supabase
- [ ] Créer hook useUserQuota
- [ ] Intégrer dans générateur de musique
- [ ] Créer composant QuotaIndicator
- [ ] Tester upgrade premium
- [ ] Tester reset automatique

### Accessibilité
- [ ] Initialiser live regions
- [ ] Ajouter announcements dans player
- [ ] Setup keyboard navigation
- [ ] Ajouter roving tabindex sur listes
- [ ] Tester avec lecteur d'écran
- [ ] Tester navigation clavier complète
- [ ] Audit Lighthouse A11y (score 100)

### Tests
- [ ] Tests quota-service (✅ fait)
- [ ] Tests enhanced-music-service
- [ ] Tests orchestration
- [ ] Tests error-handler
- [ ] Tests cache-service
- [ ] Coverage > 80%
- [ ] CI/CD avec tests automatiques

### Performance
- [ ] Analyser bundle size
- [ ] Code splitting routes music
- [ ] Lazy load composants lourds
- [ ] Memoization players
- [ ] Virtual scrolling playlists
- [ ] Service Worker pour offline

### Documentation
- [ ] Documenter nouveaux services
- [ ] Créer guide utilisateur quotas
- [ ] Documenter raccourcis clavier
- [ ] Créer guide accessibilité
- [ ] Mettre à jour README principal

---

## 📝 NOTES IMPORTANTES

### Dépendances à installer

```bash
# Validation
npm install zod

# Tests (déjà installé normalement)
npm install -D vitest @vitest/ui

# Accessibilité (optionnel)
npm install @reach/auto-id
```

### Variables d'environnement

Aucune nouvelle variable requise. Les validateurs et quotas utilisent l'infra existante.

### Breakpoints possibles

Si un problème survient, voici les points de rollback safe:
1. **Après validation**: Les validateurs sont additifs, pas de breaking change
2. **Après quotas**: Les tables sont nouvelles, pas d'impact sur l'existant
3. **Après a11y**: Les utils sont opt-in, pas d'impact si non utilisés

---

## 🚀 DÉPLOIEMENT

### Local

```bash
# 1. Installer dépendances
npm install

# 2. Appliquer migrations
npx supabase db push

# 3. Run tests
npm run test

# 4. Build
npm run build

# 5. Run dev
npm run dev
```

### Production

```bash
# 1. Merge PR vers main
# 2. Les migrations Supabase seront appliquées automatiquement
# 3. Le build Vite sera déployé automatiquement (Vercel/Netlify)
```

---

**Dernière mise à jour**: 2025-11-14
**Auteur**: Claude (Analyse & Implémentation)
**Contact**: Voir README principal

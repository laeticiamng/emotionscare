# 🎵 AUDIT COMPLET `/app/music` - EmotionsCare

**Date:** 30 octobre 2025  
**Module:** Musicothérapie (`/app/music`)  
**Version:** 2.1.0

---

## 📊 RÉSUMÉ EXÉCUTIF

### ✅ Points Forts
- Architecture modulaire bien structurée (Context + Hooks + Services)
- Player audio unifié avec gestion d'état centralisée
- Intégration avec edge functions pour recommandations adaptatives
- RLS policies correctement configurées
- Tests unitaires présents pour les hooks principaux

### ⚠️ Points d'Attention
- **CRITIQUE** : Hook `useMusic` simple ré-export (pas d'implémentation)
- Couverture de tests insuffisante (< 90% requis)
- Accessibilité (a11y) partielle - ARIA manquant sur certains contrôles
- TypeScript `@ts-nocheck` utilisé (non conforme strict mode)
- Edge function utilise URLs mockées (pas de vrais fichiers audio)
- Duplication de types entre `MusicContext.tsx` et `types/music.ts`

### 🎯 Score Global
**6.5/10** - Fonctionnel mais nécessite refactoring pour conformité production

---

## 🏗️ ARCHITECTURE FRONT-END

### Composants Principaux

```
src/pages/B2CMusicEnhanced.tsx (398 lignes)
├─ src/components/music/UnifiedMusicPlayer.tsx (217 lignes)
├─ src/contexts/MusicContext.tsx (739 lignes) ⚠️ TROP GROS
├─ src/hooks/useMusic.ts (2 lignes) ⚠️ SIMPLE RÉ-EXPORT
├─ src/types/music.ts (83 lignes)
└─ src/lib/musicService.ts (75 lignes)
```

### ⚠️ PROBLÈME #1 : Hook `useMusic` simpliste

**Fichier:** `src/hooks/useMusic.ts`  
**État:** Simple ré-export sans validation  
**Impact:** MEDIUM - Pas de protection contre utilisation hors provider

**Actuel:**
```tsx
// src/hooks/useMusic.ts
export { useMusic } from '@/contexts/music';
```

**Recommandation:** Implémenter correctement le hook avec validation :

```tsx
import { useContext } from 'react';
import { MusicContext } from '@/contexts/music';
import type { MusicContextType } from '@/contexts/music';

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
```

---

### ⚠️ PROBLÈME #2 : MusicContext trop volumineux (739 lignes)

**Violation:** Règle "Un fichier ne doit pas dépasser 500 lignes"

**Recommandation:** Découper en modules :

```
src/contexts/music/
├─ MusicContext.tsx (Provider + Context only ~150 lignes)
├─ useMusicPlayback.ts (play, pause, seek, etc.)
├─ useMusicGeneration.ts (generateMusicForEmotion, checkStatus)
├─ useMusicPlaylist.ts (setPlaylist, addToPlaylist, etc.)
├─ useMusicTherapeutic.ts (enableTherapeuticMode, adaptVolume)
├─ types.ts (MusicState, MusicAction, etc.)
└─ index.ts (barrel export)
```

---

### ⚠️ PROBLÈME #3 : TypeScript @ts-nocheck

**Fichiers concernés:**
- `src/pages/B2CMusicEnhanced.tsx` (ligne 1)
- `src/components/music/UnifiedMusicPlayer.tsx` (ligne 1)
- `src/lib/musicService.ts` (ligne 1)

**Règle violée:** `"strict": true` dans `tsconfig.json`

**Action requise:** Supprimer `@ts-nocheck` et typer correctement toutes les variables.

---

### ⚠️ PROBLÈME #4 : Accessibilité (a11y) insuffisante

**Niveau requis:** WCAG 2.1 AA  
**Niveau actuel:** Partiel

**Manques identifiés dans `B2CMusicEnhanced.tsx`:**

```tsx
// ❌ INCORRECT - Ligne 286-292
<Card
  className="..."
  onClick={() => startTrack(track)}
>
  {/* Pas de role, aria-label, ni gestion clavier */}
</Card>

// ✅ CORRECT
<Card
  role="button"
  tabIndex={0}
  aria-label={`Lancer ${track.title} de ${track.artist}`}
  onClick={() => startTrack(track)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      startTrack(track);
    }
  }}
  className="..."
>
```

**Manques dans `UnifiedMusicPlayer.tsx`:**
- Slider de progression sans `aria-label` (ligne 141)
- Boutons sans texte alternatif explicite
- Pas de live region pour annoncer les changements de piste

**Correctifs requis:**

```tsx
// UnifiedMusicPlayer.tsx
<Slider
  aria-label="Progression de la piste"
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={progress}
  aria-valuetext={`${formatTime(currentTime)} sur ${formatTime(duration)}`}
  value={[progress]}
  onValueChange={handleSeek}
/>

<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
  {isPlaying ? `Lecture en cours : ${currentTrack?.title}` : 'Lecture en pause'}
</div>
```

---

### ⚠️ PROBLÈME #5 : URLs audio mockées

**Fichier:** `src/pages/B2CMusicEnhanced.tsx` lignes 51-94

```tsx
// ❌ URLs externes non fiables
url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
```

**Impact:** 
- Aucune garantie de disponibilité
- Pas de contrôle sur le contenu
- Performance dépendante d'un tiers
- Pas de fallback

**Solution recommandée:**
1. Héberger les fichiers audio sur Supabase Storage
2. Utiliser des URLs signées pour la sécurité
3. Implémenter un système de cache/CDN

```tsx
// Exemple avec Supabase Storage
const { data } = await supabase.storage
  .from('music-tracks')
  .createSignedUrl('track-1.mp3', 3600);

const track: VinylTrack = {
  url: data.signedUrl,
  audioUrl: data.signedUrl,
  // ...
};
```

---

## 🗄️ ARCHITECTURE BACK-END

### Edge Function `adaptive-music`

**Fichier:** `supabase/functions/adaptive-music/index.ts`

#### ✅ Points positifs
- Authentification JWT vérifiée (lignes 64-73)
- CORS correctement configuré
- Routes RESTful claires
- Gestion d'erreurs appropriée

#### ⚠️ Problèmes

##### 1. Bibliothèque musicale hardcodée (lignes 22-46)

```typescript
const MUSIC_LIBRARY: MusicTrack[] = [
  { id: '1', title: 'Océan Paisible', ..., url: '/music/ocean.mp3' },
  // ... 12 tracks hardcodés
];
```

**Problème:** Impossible de mettre à jour sans redéploiement.

**Solution:** Stocker dans la base de données `music_library` table :

```sql
CREATE TABLE public.music_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  url TEXT NOT NULL,
  emotion_tags TEXT[],
  bpm INTEGER,
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  duration INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.music_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Music library readable by authenticated users"
ON public.music_library FOR SELECT
TO authenticated USING (is_active = true);

CREATE INDEX idx_music_library_emotions ON public.music_library USING GIN(emotion_tags);
CREATE INDEX idx_music_library_energy ON public.music_library(energy_level);
```

##### 2. Logique de recommandation simpliste (lignes 84-112)

```typescript
let recommendations = MUSIC_LIBRARY.filter(track => 
  track.emotion_tags.includes(emotion.toLowerCase())
);
```

**Amélioration suggérée:** Algorithme de scoring plus sophistiqué :

```typescript
interface TrackScore {
  track: MusicTrack;
  score: number;
  reasons: string[];
}

const scoreTrack = (
  track: MusicTrack, 
  emotion: string, 
  userHistory: ListeningSession[]
): TrackScore => {
  let score = 0;
  const reasons: string[] = [];

  // Correspondance émotionnelle directe (+5)
  if (track.emotion_tags.includes(emotion)) {
    score += 5;
    reasons.push('Correspondance émotionnelle');
  }

  // Historique utilisateur (+3 si track écoutée complètement)
  const completedListens = userHistory.filter(
    s => s.track_id === track.id && s.completed
  ).length;
  if (completedListens > 0) {
    score += Math.min(3, completedListens);
    reasons.push(`Écoutée ${completedListens} fois`);
  }

  // Amélioration émotionnelle post-écoute (+4)
  const emotionalImprovement = userHistory.filter(
    s => s.track_id === track.id && 
    s.emotion_before === emotion &&
    s.emotion_after !== emotion
  ).length;
  if (emotionalImprovement > 0) {
    score += 4;
    reasons.push('Amélioration émotionnelle prouvée');
  }

  // Niveau d'énergie adapté (+2)
  const targetEnergy = emotionToEnergyLevel(emotion);
  const energyDiff = Math.abs(track.energy_level - targetEnergy);
  if (energyDiff <= 2) {
    score += 2 - energyDiff;
    reasons.push('Niveau d\'énergie optimal');
  }

  return { track, score, reasons };
};
```

##### 3. Statistiques d'écoute calculées en temps réel (lignes 185-232)

**Performance:** O(n) sur potentiellement des milliers d'enregistrements.

**Solution:** Materialized view + refresh programmé :

```sql
CREATE MATERIALIZED VIEW music_stats_summary AS
SELECT 
  user_id,
  COUNT(*) as total_sessions,
  SUM(duration_seconds) / 60 as total_minutes,
  jsonb_object_agg(
    emotion_before, 
    emotion_count
  ) FILTER (WHERE emotion_before IS NOT NULL) as emotion_distribution,
  AVG(
    CASE 
      WHEN emotion_after IS NOT NULL AND emotion_before IS NOT NULL
      THEN emotion_score(emotion_after) - emotion_score(emotion_before)
      ELSE NULL
    END
  ) as avg_emotional_improvement
FROM music_listening_sessions
GROUP BY user_id;

CREATE UNIQUE INDEX ON music_stats_summary(user_id);

-- Fonction helper pour scorer les émotions
CREATE OR REPLACE FUNCTION emotion_score(emotion TEXT) RETURNS INTEGER AS $$
BEGIN
  RETURN CASE 
    WHEN emotion IN ('joie', 'calme', 'sérénité') THEN 8
    WHEN emotion IN ('neutre', 'focus') THEN 5
    WHEN emotion IN ('tristesse', 'stress', 'anxiété') THEN 2
    ELSE 5
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Refresh automatique toutes les heures
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'refresh-music-stats',
  '0 * * * *',
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY music_stats_summary$$
);
```

---

### 🗄️ Base de Données

#### Tables existantes

**1. `music_playlists`** (Migration `20250829134947`)

```sql
✅ Structure correcte
✅ RLS activé
✅ Policies appropriées (user + public)
✅ Index sur user_id, mood
⚠️  Champ `tracks` en JSONB (pas de contraintes FK)
```

**Recommandation:** Créer table de liaison pour normalisation :

```sql
CREATE TABLE public.music_playlist_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES music_playlists(id) ON DELETE CASCADE,
  track_id UUID REFERENCES music_library(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  added_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(playlist_id, position)
);

CREATE INDEX idx_playlist_tracks_playlist ON music_playlist_tracks(playlist_id);
CREATE INDEX idx_playlist_tracks_track ON music_playlist_tracks(track_id);
```

**2. `music_listening_sessions`** (Référencée mais schema incomplet)

**Action:** Vérifier/créer avec schema complet :

```sql
CREATE TABLE IF NOT EXISTS public.music_listening_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  track_id UUID REFERENCES music_library(id) ON DELETE SET NULL,
  playlist_id UUID REFERENCES music_playlists(id) ON DELETE SET NULL,
  duration_seconds INTEGER NOT NULL CHECK (duration_seconds >= 0),
  emotion_before TEXT,
  emotion_after TEXT,
  completed BOOLEAN DEFAULT false,
  skip_reason TEXT,
  skip_at_seconds INTEGER,
  volume_level NUMERIC(3,2) CHECK (volume_level >= 0 AND volume_level <= 1),
  therapeutic_mode BOOLEAN DEFAULT false,
  device_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.music_listening_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own sessions" ON public.music_listening_sessions
FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_music_sessions_user ON music_listening_sessions(user_id);
CREATE INDEX idx_music_sessions_date ON music_listening_sessions(created_at);
CREATE INDEX idx_music_sessions_emotion ON music_listening_sessions(emotion_before, emotion_after);
```

---

## 🧪 TESTS

### État actuel

```
Tests trouvés:
✅ src/contexts/__tests__/MusicContext.test.tsx (146 lignes)
✅ src/hooks/__tests__/useMusic.test.tsx (37 lignes)
✅ src/hooks/__tests__/useMusicRecommendation.test.tsx (174 lignes)
❌ Pas de tests pour B2CMusicEnhanced.tsx
❌ Pas de tests pour UnifiedMusicPlayer.tsx
❌ Pas de tests e2e complets pour le flux music
```

### ⚠️ PROBLÈME #6 : Couverture insuffisante

**Cible projet:** ≥ 90% lignes, 85% branches  
**Estimation actuelle:** ~30-40%

**Tests manquants critiques:**

#### 1. B2CMusicEnhanced.test.tsx

```tsx
// src/pages/__tests__/B2CMusicEnhanced.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe } from '@axe-core/playwright';
import B2CMusicEnhanced from '../B2CMusicEnhanced';
import { MusicProvider } from '@/contexts/music';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MusicProvider>
      {ui}
    </MusicProvider>
  );
};

describe('B2CMusicEnhanced', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render vinyl collection', () => {
    renderWithProviders(<B2CMusicEnhanced />);
    expect(screen.getByText('Vinyles en Apesanteur')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(4); // 4 vinyl cards
  });

  it('should play track on vinyl click', async () => {
    renderWithProviders(<B2CMusicEnhanced />);
    
    const vinyl = screen.getByText('Sérénité Fluide');
    fireEvent.click(vinyl.closest('div[role="button"]'));

    await waitFor(() => {
      expect(screen.getByText('Vinyle en rotation ♪')).toBeInTheDocument();
    });
  });

  it('should toggle favorite', () => {
    renderWithProviders(<B2CMusicEnhanced />);
    
    const favoriteButton = screen.getAllByText('Ajouter')[0];
    fireEvent.click(favoriteButton);

    expect(screen.getByText('Favori')).toBeInTheDocument();
    expect(localStorage.getItem('music:favorites')).toContain('vinyl-1');
  });

  it('should resume last played track', () => {
    localStorage.setItem('music:lastPlayed', 'vinyl-2');
    
    renderWithProviders(<B2CMusicEnhanced />);
    
    expect(screen.getByText('Reprendre la session')).toBeInTheDocument();
  });

  it('should handle MusicContext unavailable gracefully', () => {
    // Render without MusicProvider
    render(<B2CMusicEnhanced />);
    
    expect(screen.getByText('Service musical indisponible')).toBeInTheDocument();
  });

  it('should meet WCAG 2.1 AA standards', async () => {
    const { container } = renderWithProviders(<B2CMusicEnhanced />);
    const results = await axe(container);
    
    expect(results.violations).toHaveLength(0);
  });

  it('should support keyboard navigation', () => {
    renderWithProviders(<B2CMusicEnhanced />);
    
    const firstVinyl = screen.getByLabelText(/Lancer Sérénité Fluide/i);
    firstVinyl.focus();
    
    expect(document.activeElement).toBe(firstVinyl);
    
    fireEvent.keyDown(firstVinyl, { key: 'Enter' });
    // Vérifie que la lecture démarre
  });
});
```

#### 2. UnifiedMusicPlayer.test.tsx

```tsx
// src/components/music/__tests__/UnifiedMusicPlayer.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UnifiedMusicPlayer } from '../UnifiedMusicPlayer';
import { MusicProvider } from '@/contexts/music';

const mockTrack = {
  id: 'test-1',
  title: 'Test Track',
  artist: 'Test Artist',
  url: 'http://test.mp3',
  audioUrl: 'http://test.mp3',
  duration: 180,
  mood: 'Test Mood',
};

describe('UnifiedMusicPlayer', () => {
  it('should display track info', () => {
    render(
      <MusicProvider>
        <UnifiedMusicPlayer />
      </MusicProvider>
    );
    
    // Inject track via context...
    expect(screen.getByText('Test Track')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('should control playback', () => {
    const { getByLabelText } = render(
      <MusicProvider>
        <UnifiedMusicPlayer />
      </MusicProvider>
    );
    
    const playButton = getByLabelText(/lecture|play/i);
    fireEvent.click(playButton);
    
    // Vérifier que l'état change
    expect(getByLabelText(/pause/i)).toBeInTheDocument();
  });

  it('should seek on slider change', () => {
    // ...
  });

  it('should adjust volume', () => {
    // ...
  });

  it('should show empty state when no track', () => {
    render(
      <MusicProvider>
        <UnifiedMusicPlayer />
      </MusicProvider>
    );
    
    expect(screen.getByText('Sélectionnez un vinyle pour commencer')).toBeInTheDocument();
  });

  it('should render compact mode', () => {
    render(
      <MusicProvider>
        <UnifiedMusicPlayer compact />
      </MusicProvider>
    );
    
    // Vérifier layout compact
  });
});
```

#### 3. Edge function tests

```typescript
// supabase/functions/adaptive-music/index.test.ts
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

describe('adaptive-music edge function', () => {
  let authToken: string;

  beforeAll(async () => {
    // Setup test user
    const { data } = await supabase.auth.signInWithPassword({
      email: 'test@emotionscare.com',
      password: 'test-password',
    });
    authToken = data.session!.access_token;
  });

  it('should return recommendations for emotion', async () => {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/adaptive-music/recommendations?emotion=joie&intensity=7`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    
    expect(data.recommendations).toBeInstanceOf(Array);
    expect(data.recommendations.length).toBeGreaterThan(0);
    expect(data.recommendations[0]).toHaveProperty('id');
    expect(data.recommendations[0]).toHaveProperty('emotion_tags');
  });

  it('should require authentication', async () => {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/adaptive-music/recommendations`,
    );

    expect(response.status).toBe(401);
  });

  // ... autres tests
});
```

---

## 🔐 SÉCURITÉ

### Supabase Linter Results

**8 issues détectés** (dont 2 ERROR, 6 WARN)

#### ✅ `/app/music` module : RLS conforme

```sql
-- music_playlists (CORRECT)
ALTER TABLE public.music_playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own playlists"
ON public.music_playlists FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public playlists are viewable by everyone"
ON public.music_playlists FOR SELECT USING (is_public = true);
```

**Issues NON liés à `/app/music` (autres modules) :**
- Errors 1-2 : Security Definer Views
- Warnings 3-6 : Function search_path
- Warning 7 : Extension in public
- Warning 8 : Postgres version

**✅ Pas de vulnérabilités critiques identifiées dans le module music.**

---

## ⚡ PERFORMANCE

### Optimisations appliquées

✅ `useOptimizedAnimation` pour reduced motion  
✅ Audio crossfade support  
✅ localStorage pour favoris et lastPlayed  
✅ React lazy imports (standard)

### ⚠️ Problèmes potentiels

1. **Playlist entière chargée en mémoire** (ligne 176 B2CMusicEnhanced)
   - Pas de pagination/virtualisation si >100 tracks
   
2. **Pas de debounce sur slider seek** (ligne 69 UnifiedMusicPlayer)
   ```tsx
   // ❌ ACTUEL
   onValueChange={handleSeek}
   
   // ✅ RECOMMANDÉ
   import { useDebouncedCallback } from 'use-debounce';
   
   const debouncedSeek = useDebouncedCallback(handleSeek, 100);
   onValueChange={debouncedSeek}
   ```

3. **Pas de service worker pour audio caching**
   - Opportunité d'offline-first avec Workbox
   - Réduirait bande passante et améliorerait UX

4. **Calculs stats en temps réel dans edge function**
   - Devrait utiliser materialized view (cf. section back-end)

---

## 📋 PLAN D'ACTION PRIORITAIRE

### 🔴 CRITIQUE (À faire immédiatement)

1. **Améliorer `useMusic` hook** ✅ SIMPLE
   - Ajouter validation provider
   - Temps estimé : 10 min

2. **Supprimer `@ts-nocheck`** 🔴 OBLIGATOIRE
   - Activer TypeScript strict
   - Corriger toutes les erreurs de typage
   - Temps estimé : 2h

3. **Améliorer accessibilité** ⚠️ LÉGAL (WCAG)
   - Ajouter ARIA labels
   - Implémenter navigation clavier
   - Live regions pour status updates
   - Temps estimé : 4h

### 🟡 IMPORTANT (Cette semaine)

4. **Refactorer MusicContext** 🏗️
   - Découper en modules < 500 lignes
   - Séparer concerns (playback, generation, playlist)
   - Temps estimé : 1 jour

5. **Créer tests manquants** 🧪
   - B2CMusicEnhanced.test.tsx
   - UnifiedMusicPlayer.test.tsx
   - Edge function tests
   - Atteindre 90% couverture
   - Temps estimé : 1.5 jours

6. **Remplacer URLs mockées** 🎵
   - Upload fichiers sur Supabase Storage
   - Générer signed URLs
   - Fallback sur erreur
   - Temps estimé : 3h

### 🟢 MOYEN TERME (Ce sprint)

7. **Créer table `music_library`** 🗄️
   - Migration SQL
   - Seed avec données initiales
   - Modifier edge function pour query DB
   - Temps estimé : 4h

8. **Améliorer algorithme recommandations** 🧠
   - Intégrer historique utilisateur
   - Scoring sophistiqué
   - A/B testing framework
   - Temps estimé : 2 jours

9. **Optimiser performance** ⚡
   - Materialized views pour stats
   - Audio caching strategy
   - Debounce slider interactions
   - Temps estimé : 1 jour

### 🔵 NICE-TO-HAVE (Backlog)

10. **Service Worker audio caching**
11. **Analytics dashboard musicothérapie**
12. **Export playlists vers Spotify/Apple Music**
13. **Génération musicale IA (Suno intégration complète)**

---

## 📊 MÉTRIQUES CIBLES

| Métrique | Actuel | Cible | Status | Effort |
|----------|--------|-------|--------|--------|
| Couverture tests | ~35% | ≥90% | 🔴 | 1.5j |
| TypeScript strict | Non | Oui | 🔴 | 2h |
| WCAG 2.1 | Partiel | AA | 🟡 | 4h |
| Taille fichiers | 739L | <500L | 🔴 | 1j |
| RLS policies | ✅ | ✅ | ✅ | - |
| Edge functions | Fonctionnel | Optimisé | 🟡 | 1j |
| Performance LCP | Non mesuré | <2.5s | ❓ | 0.5j |

**Total effort estimé :** 5-7 jours développeur

---

## 🎯 CONCLUSION

Le module `/app/music` est **fonctionnel** et présente une **architecture solide** mais nécessite un **refactoring significatif** pour être conforme aux standards EmotionsCare.

### Priorités absolues (Bloqueurs production) :

1. ✅ **Corriger TypeScript strict** (2h) - Conformité code
2. ⚠️ **Améliorer a11y** (4h) - Obligation légale WCAG
3. 🧪 **Augmenter couverture tests** (1.5j) - Qualité/régression

### Quick wins (Impact élevé, effort faible) :

- Améliorer `useMusic` hook (10 min)
- Ajouter debounce slider (15 min)
- Remplacer URLs mockées (3h)

### Long terme (Amélioration continue) :

- Refactoring MusicContext modulaire
- Algorithme recommandations ML
- Service Worker caching

**Estimation globale :** 5-7 jours pour atteindre niveau production conforme.

---

**Auditeur:** Lovable AI  
**Date:** 30/10/2025  
**Validation requise:** Tech Lead + QA + Product Owner

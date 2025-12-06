# 🎣 Guide d'Intégration des Hooks React Query

## 📚 Hooks Disponibles

### Dashboard
```typescript
import { useDashboard } from '@/hooks/useDashboard';

const MyComponent = () => {
  const { 
    stats, 
    moduleActivities, 
    recommendations,
    achievements,
    badges,
    weeklySummary,
    isLoading 
  } = useDashboard(userId);

  // stats.totalSessions, stats.wellnessScore, etc.
};
```

### Nyvee (Cocoon)
```typescript
import { useNyvee } from '@/hooks/useNyvee';

const NyveeComponent = () => {
  const {
    history,
    createSession,
    updateCozyLevel,
    completeSession,
    isLoading
  } = useNyvee(userId);

  const handleStart = async () => {
    createSession({ cozyLevel: 50, moodBefore: 3 });
  };
};
```

### Story Synth
```typescript
import { useStorySynth } from '@/hooks/useStorySynth';

const StorySynthComponent = () => {
  const {
    history,
    createSession,
    recordChoice,
    completeSession
  } = useStorySynth(userId);
};
```

### Mood Mixer
```typescript
import { useMoodMixer } from '@/hooks/useMoodMixer';

const MoodMixerComponent = () => {
  const {
    history,
    stats,
    createSession,
    addActivity,
    completeSession
  } = useMoodMixer(userId);

  // stats.averageSatisfaction, stats.mostUsedActivities
};
```

### Bubble Beat
```typescript
import { useBubbleBeat } from '@/hooks/useBubbleBeat';

const BubbleBeatComponent = () => {
  const {
    history,
    bestScore,
    stats,
    createSession,
    updateScore,
    completeSession
  } = useBubbleBeat(userId);

  // stats.totalBubblesPopped, stats.averageAccuracy
};
```

### AR Filters
```typescript
import { useARFilters } from '@/hooks/useARFilters';

const ARFiltersComponent = () => {
  const {
    history,
    stats,
    createSession,
    incrementPhotosTaken,
    completeSession
  } = useARFilters(userId);

  // stats.favoriteFilter, stats.totalPhotosTaken
};
```

## 🔄 Invalidation des Queries

Les hooks gèrent automatiquement l'invalidation des queries:
- Après `createSession` → invalide l'historique
- Après `completeSession` → invalide l'historique + les stats
- Après toute mutation → rafraîchissement automatique des données

## 💡 Exemple Complet

```typescript
import { useNyvee } from '@/hooks/useNyvee';
import { useAuth } from '@/hooks/useAuth';

const NyveePage = () => {
  const { user } = useAuth();
  const {
    history,
    createSession,
    updateCozyLevel,
    completeSession,
    isLoading,
    isCreating
  } = useNyvee(user?.id || '');

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);

  const handleStart = async () => {
    const session = await createSession({ 
      cozyLevel: 50, 
      moodBefore: 3 
    });
    setCurrentSessionId(session.id);
    setStartTime(Date.now());
  };

  const handleCozyChange = (level: number) => {
    if (currentSessionId) {
      updateCozyLevel({ sessionId: currentSessionId, cozyLevel: level });
    }
  };

  const handleComplete = async (moodAfter: number) => {
    if (currentSessionId) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      await completeSession({ 
        sessionId: currentSessionId, 
        duration,
        moodAfter 
      });
      setCurrentSessionId(null);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1>Nyvee Cocoon</h1>
      {currentSessionId ? (
        <ActiveSession 
          onCozyChange={handleCozyChange}
          onComplete={handleComplete}
        />
      ) : (
        <Button onClick={handleStart} disabled={isCreating}>
          Démarrer une session
        </Button>
      )}
      <History sessions={history} />
    </div>
  );
};
```

## 🎯 Avantages

✅ **Cache automatique** - Pas de requêtes inutiles  
✅ **Rafraîchissement intelligent** - Invalidation précise  
✅ **États de chargement** - UX fluide  
✅ **Gestion d'erreurs** - Toasts automatiques  
✅ **TypeScript** - Type-safe à 100%  
✅ **Performance** - Optimistic updates possibles

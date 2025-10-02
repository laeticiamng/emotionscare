# Guide d'Intégration Backend pour les Modules

## Vue d'ensemble

Tous les modules EmotionsCare sont maintenant connectés au backend Supabase via le hook `useModuleProgress`. Ce hook gère automatiquement :
- 📊 La progression de l'utilisateur
- 🎯 Les points et niveaux
- 🔥 Les séries (streaks)
- 🏆 Les achievements
- 📝 Les sessions individuelles

## Tables Supabase

### `module_progress`
Stocke la progression globale de l'utilisateur dans chaque module :
- `module_name`: Nom unique du module (ex: 'flash-glow', 'breath-journey')
- `progress_data`: JSONB flexible pour stocker n'importe quelle donnée spécifique
- `total_points`: Points accumulés
- `level`: Niveau actuel (calculé automatiquement)
- `streak`: Série actuelle
- `completed_count`: Nombre d'éléments complétés
- `last_activity_at`: Dernière activité

### `module_sessions`
Enregistre chaque session individuelle :
- `module_name`: Nom du module
- `session_data`: Données spécifiques de la session
- `duration_seconds`: Durée
- `score`: Score obtenu
- `completed`: Session terminée ou non

### `user_achievements`
Stocke les achievements débloqués :
- `module_name`: Module concerné
- `achievement_type`: Type unique (ex: 'first_5', 'master')
- `achievement_data`: Détails de l'achievement

## Utilisation du Hook

### 1. Import et Initialisation

```typescript
import { useModuleProgress } from '@/hooks/useModuleProgress';

export default function MyModulePage() {
  const {
    progress,              // Progression actuelle
    sessions,              // Historique des sessions
    achievements,          // Achievements débloqués
    isLoading,            // État de chargement
    currentSession,       // ID de la session en cours
    updateProgress,       // Mettre à jour la progression
    updateProgressData,   // Mettre à jour progress_data
    startSession,         // Démarrer une session
    endSession,          // Terminer une session
    unlockAchievement,   // Débloquer un achievement
    addPoints,           // Ajouter des points
    incrementStreak,     // Incrémenter la série
    resetStreak,         // Réinitialiser la série
    incrementCompleted,  // Incrémenter le compteur
    reload              // Recharger depuis le backend
  } = useModuleProgress('mon-module-unique');
  
  // Utiliser les valeurs du backend ou des defaults
  const totalPoints = progress?.total_points || 0;
  const streak = progress?.streak || 0;
  const level = progress?.level || 1;
  
  // Récupérer des données custom depuis progress_data
  const myCustomData = progress?.progress_data?.myCustomData || [];
}
```

### 2. Démarrer une Session

```typescript
const handleStart = async () => {
  const sessionId = await startSession({
    mode: 'normal',
    difficulty: 3,
    // toute donnée custom
  });
  setSessionId(sessionId);
  setSessionStartTime(Date.now());
};
```

### 3. Terminer une Session

```typescript
const handleComplete = async () => {
  if (sessionId) {
    const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
    await endSession(sessionId, score, duration, true);
  }
};
```

### 4. Sauvegarder la Progression

```typescript
// Ajouter des points (calcule automatiquement le niveau)
await addPoints(50);

// Incrémenter le compteur de complétions
await incrementCompleted();

// Incrémenter la série
await incrementStreak();

// Réinitialiser la série
await resetStreak();

// Sauvegarder des données custom
await updateProgressData({
  completedLevels: [...completedLevels, newLevel],
  bestScore: Math.max(bestScore, currentScore),
  unlockedItems: [...unlockedItems, newItem]
});
```

### 5. Débloquer des Achievements

```typescript
// Vérifier et débloquer un achievement
if (totalCompleted === 10) {
  await unlockAchievement('first_10', {
    title: 'Première Série de 10!',
    description: 'Tu as complété 10 challenges',
    emoji: '🎯',
    points: 100
  });
}

// Achievement automatique avec toast
if (streak >= 7) {
  await unlockAchievement('week_streak', {
    title: 'Une Semaine de Flamme!',
    emoji: '🔥'
  });
}
```

### 6. Charger les Données au Démarrage

```typescript
// Le hook charge automatiquement au mount
// Mais vous pouvez synchroniser avec les états locaux :
useEffect(() => {
  if (progress?.progress_data) {
    // Restaurer l'état depuis le backend
    setCurrentLevel(progress.progress_data.currentLevel || 1);
    setUnlockedItems(progress.progress_data.unlockedItems || []);
  }
}, [progress]);
```

## Patterns d'Intégration par Type de Module

### Module de Défis/Challenges (Flash Glow, Boss Grit)

```typescript
const completeChallenge = async (challengeId: string, points: number) => {
  // 1. Mettre à jour les données custom
  const newCompleted = [...completedChallenges, challengeId];
  await updateProgressData({
    completed: newCompleted,
    currentIndex: currentIndex + 1
  });
  
  // 2. Ajouter les points
  await addPoints(points);
  
  // 3. Gérer la série
  await incrementStreak();
  await incrementCompleted();
  
  // 4. Vérifier achievements
  if (newCompleted.length === 10) {
    await unlockAchievement('master', { title: 'Maître!' });
  }
  
  // 5. Terminer la session
  if (sessionId) {
    const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
    await endSession(sessionId, points, duration, true);
  }
};
```

### Module de Collection (Avatar, Mood Mixer)

```typescript
const saveItem = async (item: any) => {
  // 1. Récupérer la collection existante
  const collection = progress?.progress_data?.collection || [];
  
  // 2. Ajouter le nouvel item
  const newCollection = [...collection, {
    ...item,
    timestamp: Date.now()
  }];
  
  // 3. Sauvegarder
  await updateProgressData({
    collection: newCollection
  });
  
  // 4. Ajouter des points
  await addPoints(25);
  
  // 5. Achievement
  if (newCollection.length >= 10) {
    await unlockAchievement('collector', {
      title: 'Collectionneur Passionné',
      emoji: '🎨'
    });
  }
};
```

### Module de Parcours/Journey (Breath, VR Galaxy)

```typescript
const completeStage = async (stageId: string, stageData: any) => {
  // 1. Mettre à jour les stages complétés
  const completedStages = progress?.progress_data?.completedStages || [];
  const newCompleted = [...completedStages, {
    stageId,
    completedAt: new Date().toISOString(),
    ...stageData
  }];
  
  await updateProgressData({
    completedStages: newCompleted,
    currentStage: stageId
  });
  
  // 2. Points et progression
  await addPoints(stageData.points || 50);
  await incrementCompleted();
  
  // 3. Achievements par milestone
  const totalCompleted = newCompleted.length;
  if (totalCompleted === Math.floor(totalStages / 2)) {
    await unlockAchievement('halfway', {
      title: 'À mi-parcours!',
      emoji: '🎯'
    });
  }
};
```

### Module Social (Lantern, Collab Flame)

```typescript
const shareLantern = async (message: string, emotion: string) => {
  // 1. Récupérer les lanternes partagées
  const shared = progress?.progress_data?.sharedLanterns || [];
  
  // 2. Ajouter la nouvelle lanterne
  const newLantern = {
    id: Date.now().toString(),
    message,
    emotion,
    reactions: 0,
    timestamp: new Date().toISOString()
  };
  
  await updateProgressData({
    sharedLanterns: [...shared, newLantern]
  });
  
  // 3. Points pour le partage
  await addPoints(10);
  
  // 4. Série de partages
  const lastShare = shared[shared.length - 1];
  const isConsecutiveDay = lastShare && 
    isWithin24Hours(new Date(lastShare.timestamp), new Date());
  
  if (isConsecutiveDay) {
    await incrementStreak();
  } else {
    await resetStreak();
  }
};
```

## Récupération des Statistiques Globales

Pour afficher les stats globales de l'utilisateur :

```typescript
import { useUserOverallStats } from '@/hooks/useModuleProgress';

function Dashboard() {
  const { stats, isLoading } = useUserOverallStats();
  
  return (
    <div>
      <h2>Statistiques Globales</h2>
      <p>Points totaux: {stats?.total_points}</p>
      <p>Modules actifs: {stats?.total_modules}</p>
      <p>Sessions: {stats?.total_sessions}</p>
      <p>Achievements: {stats?.total_achievements}</p>
      <p>Meilleure série: {stats?.best_streak}</p>
    </div>
  );
}
```

## Migration des Modules Existants

Pour migrer un module existant :

1. **Ajouter le hook** en haut du composant
2. **Remplacer les useState** par les valeurs du backend
3. **Ajouter await** à toutes les actions de mise à jour
4. **Implémenter startSession/endSession** pour le tracking
5. **Définir les achievements** et les conditions de déblocage

## Best Practices

✅ **DO:**
- Toujours utiliser `updateProgressData` pour les données custom
- Créer des achievements significatifs (milestones)
- Gérer les sessions avec start/end pour le tracking précis
- Utiliser `reload()` si besoin de rafraîchir manuellement

❌ **DON'T:**
- Ne pas stocker de données sensibles dans progress_data
- Ne pas oublier d'ajouter `await` aux appels backend
- Ne pas créer trop d'achievements (max 10-15 par module)
- Ne pas dupliquer les données entre progress_data et les colonnes dédiées

## Exemple Complet : Intégration Breath Journey

```typescript
// src/pages/modules/breath/BreathJourneyPage.tsx
import { useModuleProgress } from '@/hooks/useModuleProgress';

export default function BreathJourneyPage() {
  const {
    progress,
    addPoints,
    incrementCompleted,
    incrementStreak,
    updateProgressData,
    unlockAchievement,
    startSession,
    endSession
  } = useModuleProgress('breath-journey');
  
  // États du backend
  const unlockedTechniques = progress?.progress_data?.unlockedTechniques || [];
  const totalPoints = progress?.total_points || 0;
  const level = progress?.level || 1;
  
  const completeBreathSession = async (techniqueId: string, duration: number, quality: number) => {
    // Session tracking
    const sessionId = currentSession;
    if (sessionId) {
      await endSession(sessionId, quality * 10, duration, true);
    }
    
    // Progress update
    await updateProgressData({
      unlockedTechniques: [...unlockedTechniques, techniqueId],
      lastTechnique: techniqueId
    });
    
    // Points & completion
    await addPoints(quality * 10);
    await incrementCompleted();
    await incrementStreak();
    
    // Achievements
    if (unlockedTechniques.length + 1 === 3) {
      await unlockAchievement('breath_explorer', {
        title: 'Explorateur du Souffle',
        emoji: '🧘'
      });
    }
  };
  
  return (
    // ... UI component
  );
}
```

## Notes Techniques

- **RLS activé** : Chaque utilisateur ne voit que ses propres données
- **Optimistic updates** : Mettez à jour l'UI immédiatement, puis le backend
- **Error handling** : Le hook affiche automatiquement des toasts d'erreur
- **Performance** : Utilisez `progress_data` pour des données flexibles plutôt que de créer de nouvelles colonnes

## Support

Pour toute question sur l'intégration backend, consultez :
- `/src/hooks/useModuleProgress.ts` - Le hook principal
- Les politiques RLS dans Supabase Dashboard
- La table `module_progress` pour la structure des données

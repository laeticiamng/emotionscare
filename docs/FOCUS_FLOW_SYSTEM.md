# 🧠 Focus Flow - Système de concentration profonde

## Vue d'ensemble

Le Focus Flow est un système de sessions de concentration profonde basé sur la méthode Pomodoro, avec génération automatique de playlists musicales adaptées et progression tempo scientifiquement optimisée.

## Architecture

### Tables Supabase

#### `focus_sessions`
Stocke les sessions de concentration avec configuration et statistiques.

```sql
- id: UUID (PK)
- user_id: UUID (FK → auth.users)
- mode: TEXT ('work', 'study', 'meditation')
- duration_minutes: INTEGER (défaut: 120)
- pomodoro_duration: INTEGER (défaut: 25)
- break_duration: INTEGER (défaut: 5)
- start_tempo: INTEGER (défaut: 80)
- peak_tempo: INTEGER (défaut: 100)
- end_tempo: INTEGER (défaut: 70)
- tracks_generated: INTEGER
- pomodoros_completed: INTEGER
- started_at: TIMESTAMPTZ
- completed_at: TIMESTAMPTZ
```

#### `focus_session_tracks`
Gère les tracks générés pour chaque session avec progression tempo.

```sql
- id: UUID (PK)
- session_id: UUID (FK → focus_sessions)
- track_title: TEXT
- track_url: TEXT
- suno_task_id: TEXT
- sequence_order: INTEGER
- target_tempo: INTEGER
- phase: TEXT ('warmup', 'peak', 'sustain', 'cooldown')
- pomodoro_index: INTEGER
- duration_seconds: INTEGER (défaut: 240)
- emotion: TEXT
- generation_status: TEXT (défaut: 'pending')
```

## Modes de concentration

### 🧠 Work
**Objectif**: Productivité et concentration maximale
- **Émotion**: focused
- **Tempo initial**: 80 BPM
- **Tempo peak**: 110 BPM
- **Tempo final**: 75 BPM
- **Use case**: Développement, écriture, tâches complexes

### 📚 Study
**Objectif**: Apprentissage et mémorisation
- **Émotion**: calm
- **Tempo initial**: 70 BPM
- **Tempo peak**: 90 BPM
- **Tempo final**: 65 BPM
- **Use case**: Révisions, lecture, apprentissage de concepts

### ✨ Meditation
**Objectif**: Apaisement et réduction du stress
- **Émotion**: healing
- **Tempo initial**: 60 BPM
- **Tempo peak**: 70 BPM
- **Tempo final**: 55 BPM
- **Use case**: Méditation, relaxation profonde, récupération

## Progression tempo scientifique

Le système calcule automatiquement une courbe de tempo optimale basée sur des recherches en neurosciences :

### Phases

1. **Warmup (0-20%)** 🔵
   - Augmentation progressive du tempo
   - Prépare le cerveau à la concentration
   - Activation douce des systèmes cognitifs

2. **Peak (20-40%)** 🟢
   - Tempo optimal maintenu
   - Performance cognitive maximale
   - Zone de flow

3. **Sustain (40-70%)** 🟡
   - Maintien du tempo peak
   - Consolidation de la concentration
   - Endurance cognitive

4. **Cooldown (70-100%)** 🟣
   - Diminution progressive du tempo
   - Transition douce vers le repos
   - Prévention de la fatigue mentale

### Formule de calcul

```typescript
// Pour chaque pomodoro
const progress = pomodoroIndex / (totalPomodoros - 1);

if (progress < 0.2) {
  // Warmup
  tempo = start_tempo + (peak_tempo - start_tempo) * (progress / 0.2);
} else if (progress < 0.7) {
  // Peak & Sustain
  tempo = peak_tempo;
} else {
  // Cooldown
  const cooldownProgress = (progress - 0.7) / 0.3;
  tempo = peak_tempo - (peak_tempo - end_tempo) * cooldownProgress;
}
```

## Méthode Pomodoro intégrée

### Cycle standard
- **Pomodoro**: 25 minutes de concentration
- **Pause courte**: 5 minutes
- **Répétition**: jusqu'à complétion de la session

### Notifications
- ⏰ Fin de pomodoro → Démarrage automatique de la pause
- ☕ Fin de pause → Option de reprise immédiate
- 🎉 Fin de session → Statistiques complètes

### Flexibilité
- Configuration personnalisable des durées
- Pause manuelle possible à tout moment
- Reprise anticipée disponible pendant les pauses

## Génération musicale intelligente

### Workflow

1. **Initialisation**
   ```typescript
   startFocusSession(mode, durationMinutes, pomodoroDuration)
   ```

2. **Calcul playlist**
   - Nombre total de pomodoros
   - Progression tempo pour chaque segment
   - Assignment des phases (warmup/peak/sustain/cooldown)

3. **Génération asynchrone**
   - Premier track généré immédiatement
   - Tracks suivants générés en arrière-plan
   - Polling pour vérifier le statut

4. **Transition automatique**
   - Changement de track à chaque nouveau pomodoro
   - Crossfade entre les tracks
   - Adaptation tempo en temps réel

## Interface utilisateur

### Configuration initiale
```tsx
<FocusFlowPlayer />
```

Affiche :
- Sélection du mode (work/study/meditation)
- Choix de la durée (60/90/120/150 min)
- Description de chaque mode
- Bouton de démarrage

### Session active

**Informations affichées**:
- ⏱️ Timer principal (temps restant total)
- 🍅 Timer Pomodoro (temps restant du cycle actuel)
- 📊 Progression visuelle (barres de progression)
- 🎵 Track actuel avec phase et tempo
- 📈 Statistiques en temps réel

**Contrôles**:
- ▶️ Play / ⏸️ Pause
- ⏹️ Stop
- ☕ Reprendre après pause (pendant les breaks)

**Visualisation playlist**:
- Liste complète des tracks
- Indication de la phase (couleur)
- Statut de génération
- Track actuel mis en évidence

## Hooks personnalisés

### `useFocusFlow()`

```typescript
const {
  // État
  currentSession,
  tracks,
  currentTrack,
  currentTrackIndex,
  isGenerating,
  isPlaying,
  isPaused,
  isBreak,
  timeRemaining,
  pomodoroTimeRemaining,
  
  // Actions
  startFocusSession,
  play,
  pause,
  resume,
  stop,
  resumeFromBreak,
  
  // Config
  FOCUS_MODE_CONFIG
} = useFocusFlow();
```

## Intégration

### Page B2CMusicEnhanced

```tsx
import { FocusFlowPlayer } from '@/components/music/FocusFlowPlayer';

// Dans le JSX
<div className="max-w-4xl mx-auto">
  <FocusFlowPlayer />
</div>
```

## Avantages scientifiques

### Pour la concentration
- **Tempo progressif**: suit le cycle naturel d'attention
- **Pauses régulières**: prévient la fatigue cognitive
- **Musique adaptée**: réduit les distractions auditives

### Pour la productivité
- **Structure temporelle**: combat la procrastination
- **Gamification**: motivation par les pomodoros complétés
- **Flow state**: tempo optimal pour l'état de flow

### Pour le bien-être
- **Réduction stress**: tempo descendant en fin de session
- **Prévention burnout**: pauses forcées régulières
- **Adaptation personnelle**: 3 modes selon les besoins

## Statistiques trackées

Pour chaque session :
- ✅ Nombre de pomodoros complétés
- 🎵 Nombre de tracks générés
- ⏱️ Durée totale effective
- 📊 Taux de complétion
- 🎯 Historique des sessions par mode

## Évolutions futures possibles

1. **Analytics avancées**
   - Graphiques de productivité par mode
   - Corrélation tempo / performance
   - Recommandations personnalisées

2. **Intégration calendrier**
   - Synchronisation avec Google Calendar
   - Blocage automatique de créneaux
   - Suggestions basées sur l'agenda

3. **Mode collaboratif**
   - Sessions de groupe
   - Synchronisation entre utilisateurs
   - Challenges d'équipe

4. **Biofeedback**
   - Adaptation tempo selon rythme cardiaque
   - Détection fatigue cognitive
   - Ajustement dynamique des pauses

## Support et feedback

Pour toute question ou suggestion d'amélioration du Focus Flow, contactez l'équipe via le support EmotionsCare.

---

**Version**: 1.0.0  
**Dernière mise à jour**: 2025-11-13

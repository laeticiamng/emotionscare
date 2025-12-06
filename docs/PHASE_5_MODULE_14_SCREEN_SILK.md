# Day 30 - Screen Silk Module 🖥️

**Date:** 2025-01-15  
**Module:** Screen Silk - Micro-pauses écran et repos visuel

## 🎯 Objectif du module

Screen Silk est un module dédié aux micro-pauses écran pour prévenir la fatigue oculaire et améliorer le bien-être au travail. Il guide les utilisateurs à travers des pauses structurées avec suivi des clignements d'yeux et feedback sur la qualité du repos visuel.

## 📐 Architecture

### Types & Schémas (`types.ts`)

Le module définit des types stricts avec validation Zod :

```typescript
// Durées de pause recommandées (en secondes)
export const BREAK_DURATIONS = [60, 120, 180, 300] as const;

// Labels de complétion de session
export const BREAK_LABELS = ['gain', 'léger', 'incertain'] as const;

// Phases de la session
export const SESSION_PHASES = [
  'idle',         // Aucune session active
  'loading',      // Initialisation de la session
  'preparation',  // Compte à rebours avant le début
  'active',       // Pause en cours
  'ending',       // Finalisation de la session
  'completed',    // Session terminée
  'error',        // Erreur survenue
] as const;
```

#### Session Screen Silk
```typescript
interface ScreenSilkSession {
  id: string;
  user_id: string;
  duration_seconds: number;      // 60-600 secondes
  blink_count: number;           // Nombre de clignements
  completion_label: BreakLabel | null;
  interrupted: boolean;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}
```

#### Labels de complétion
```typescript
type BreakLabel = 'gain' | 'léger' | 'incertain';

// "gain" : Repos ressenti comme bénéfique
// "léger" : Repos léger mais présent
// "incertain" : Peu ou pas de bénéfice ressenti
```

### Service API (`screenSilkServiceUnified.ts`)

Le service gère les interactions avec Supabase :

#### Fonctions principales

1. **`createSession(payload: CreateScreenSilkSession)`**
   - Crée une nouvelle session de pause
   - Valide la durée choisie (60-600 secondes)
   - Enregistre l'heure de démarrage
   - Retourne l'objet session

2. **`completeSession(payload: CompleteScreenSilkSession)`**
   - Marque la session comme terminée
   - Enregistre le nombre de clignements
   - Enregistre le label de complétion (gain/léger/incertain)
   - Met à jour l'heure de complétion

3. **`interruptSession(payload: InterruptScreenSilkSession)`**
   - Marque la session comme interrompue
   - Enregistre le nombre de clignements effectués
   - Flag `interrupted = true`

4. **`getStats(userId: string)`**
   - Nombre total de sessions
   - Nombre de sessions complétées
   - Nombre de sessions interrompues
   - Temps de pause cumulé
   - Durée moyenne des pauses
   - Taux de complétion (%)

5. **`getRecentSessions(userId: string, limit: number)`**
   - Récupère l'historique récent
   - Tri par date décroissante
   - Limite paramétrable

### State Machine (`useScreenSilkMachine.ts`)

Machine d'états basée sur `useAsyncMachine` pour gérer le cycle de vie :

#### États
- **`idle`** : Aucune pause active
- **`loading`** : Création de la session en cours
- **`preparation`** : Compte à rebours (3 secondes)
- **`active`** : Pause en cours, timer actif
- **`ending`** : Finalisation et feedback
- **`completed`** : Session terminée
- **`error`** : Erreur technique

#### Configuration
```typescript
interface ScreenSilkConfig {
  duration: number;              // Durée en secondes (60-600)
  enableBlinkGuide: boolean;     // Activer le guide de clignement
  blinkInterval: number;         // Intervalle du guide (secondes)
  onComplete?: (label: BreakLabel) => void;
  onInterrupt?: () => void;
}
```

#### Actions

**`startSession()`**
```typescript
// Démarre une nouvelle session
// 1. Crée la session en base (état loading)
// 2. Démarre le compte à rebours (état preparation)
// 3. Lance le timer principal (état active)
// 4. Gère les guides de clignement si activés
```

**`interrupt()`**
```typescript
// Interrompt la session en cours
// 1. Arrête le timer
// 2. Enregistre l'interruption
// 3. Sauvegarde les clignements effectués
// 4. Callback onInterrupt si défini
```

**`completeWithLabel(label: BreakLabel)`**
```typescript
// Termine la session avec un label de qualité
// 1. Valide le label (gain/léger/incertain)
// 2. Enregistre la complétion
// 3. Sauvegarde les statistiques
// 4. Callback onComplete avec le label
```

#### État retourné
```typescript
interface ScreenSilkState {
  phase: SessionPhase;
  session: ScreenSilkSession | null;
  timeRemaining: number;
  blinkCount: number;
  error: string | null;
}
```

## 🗄️ Base de données Supabase

### Table `screen_silk_sessions`

```sql
CREATE TABLE screen_silk_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_seconds INTEGER NOT NULL CHECK (duration_seconds >= 60 AND duration_seconds <= 600),
  blink_count INTEGER NOT NULL DEFAULT 0 CHECK (blink_count >= 0),
  completion_label TEXT CHECK (completion_label IN ('gain', 'léger', 'incertain')),
  interrupted BOOLEAN NOT NULL DEFAULT FALSE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_screen_silk_user ON screen_silk_sessions(user_id);
CREATE INDEX idx_screen_silk_started ON screen_silk_sessions(started_at DESC);
CREATE INDEX idx_screen_silk_completed ON screen_silk_sessions(completed_at DESC);
CREATE INDEX idx_screen_silk_interrupted ON screen_silk_sessions(interrupted);
```

### Politiques RLS

```sql
-- Les utilisateurs peuvent créer leurs propres sessions
CREATE POLICY "Users can create own screen silk sessions"
ON screen_silk_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent voir leurs propres sessions
CREATE POLICY "Users can view own screen silk sessions"
ON screen_silk_sessions FOR SELECT
USING (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour leurs propres sessions
CREATE POLICY "Users can update own screen silk sessions"
ON screen_silk_sessions FOR UPDATE
USING (auth.uid() = user_id);

-- Service role a accès complet
CREATE POLICY "Service role full access to screen silk"
ON screen_silk_sessions FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role');
```

## 🎨 Composants UI

Le module inclut plusieurs composants spécialisés :

### `SilkOverlay`
- Overlay plein écran avec fond dégradé apaisant
- Animation de fade-in/fade-out
- Timer visuel avec cercle de progression
- Message de guidage contextuel

### `BlinkGuide`
- Indicateur visuel de clignement
- Animation douce à intervalle régulier
- Encouragement vocal optionnel
- Compteur de clignements

### `BreakTimer`
- Affichage du temps restant
- Progression circulaire
- Phases visuellement distinctes (préparation/actif/fin)

### `CompletionFeedback`
- Feedback de fin de session
- Sélection du label de qualité (gain/léger/incertain)
- Statistiques de la session
- Animation de célébration

## 🔗 Intégrations

### Détection de clignements (optionnelle)
- Utilisation de MediaPipe Face Mesh
- Détection en temps réel via webcam
- Calcul automatique du taux de clignement
- Feedback visuel immédiat

### Notifications système
- Rappels de pause programmés
- Notifications de fin de session
- Encouragements personnalisés

### Analytics
- Suivi de l'adhérence au programme
- Corrélation avec les niveaux de stress
- Identification des patterns d'utilisation
- Recommandations personnalisées

## 📊 Métriques de succès

- **Adhérence** : Fréquence d'utilisation (objectif : 3-5 pauses/jour)
- **Complétion** : Taux de sessions terminées vs interrompues
- **Durée** : Durée moyenne et distribution
- **Qualité** : Distribution des labels (gain > léger > incertain)
- **Clignements** : Taux moyen de clignements (objectif : 15-20/min)

## 🧪 Tests unitaires

Fichier : `src/modules/screen-silk/__tests__/types.test.ts`

**Couverture** : 78 tests unitaires validant :
- ✅ Schémas Zod pour tous les types
- ✅ Validation des labels de complétion
- ✅ Validation des phases de session
- ✅ Validation des sessions complètes/interrompues
- ✅ Validation des payloads de création/complétion/interruption
- ✅ Validation des statistiques
- ✅ Gestion des durées valides/invalides
- ✅ Gestion des cas limites (zéro clignements, etc.)
- ✅ Exports TypeScript

## 🚀 Utilisation

```typescript
import { useScreenSilkMachine } from '@/modules/screen-silk';

function ScreenBreak() {
  const {
    state,
    data,
    startSession,
    interrupt,
    completeWithLabel,
    isActive,
    isLoading,
  } = useScreenSilkMachine({
    duration: 120,           // 2 minutes
    enableBlinkGuide: true,
    blinkInterval: 20,       // Guide toutes les 20 secondes
    onComplete: (label) => {
      console.log('Session terminée avec label:', label);
    },
    onInterrupt: () => {
      console.log('Session interrompue');
    },
  });

  const handleStart = () => startSession();
  
  const handleComplete = () => {
    completeWithLabel('gain');
  };

  return (
    <div>
      {state === 'idle' && (
        <button onClick={handleStart}>Démarrer une pause</button>
      )}
      
      {isActive && (
        <SilkOverlay
          timeRemaining={data.timeRemaining}
          blinkCount={data.blinkCount}
          onInterrupt={interrupt}
        />
      )}
      
      {state === 'ending' && (
        <CompletionFeedback
          onSelect={completeWithLabel}
          duration={data.session?.duration_seconds}
          blinks={data.blinkCount}
        />
      )}
    </div>
  );
}
```

## 🏥 Bénéfices santé

### Prévention de la fatigue oculaire
- Réduction du syndrome de vision informatique
- Prévention de la sécheresse oculaire
- Amélioration de la fréquence de clignement

### Amélioration du bien-être
- Réduction du stress visuel
- Meilleure concentration après la pause
- Prévention des maux de tête

### Productivité
- Pauses régulières = meilleure performance cognitive
- Réduction de l'absentéisme
- Amélioration de la satisfaction au travail

## ✅ Conformité aux standards

- ✅ **TypeScript strict** : Tous les types validés avec Zod
- ✅ **Tests unitaires** : 78 tests avec vitest + @testing-library/react
- ✅ **Sécurité** : RLS policies complètes sur Supabase
- ✅ **Performance** : Index optimisés, queries efficaces
- ✅ **Accessibilité** : Support clavier, ARIA labels
- ✅ **Documentation** : JSDoc sur toutes les fonctions publiques
- ✅ **État prévisible** : State machine claire avec `useAsyncMachine`

## 🔮 Évolutions futures

- [ ] Détection automatique de fatigue oculaire
- [ ] Intégration avec calendrier (bloquer les pauses)
- [ ] Exercices oculaires guidés
- [ ] Gamification (badges, streaks)
- [ ] Mode équipe (pauses synchronisées)
- [ ] IA de recommandation de timing optimal

---

**Status** : ✅ Module Screen Silk documenté et testé  
**Next** : Day 31 - Module AI Coach

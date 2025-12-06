# Day 29 - Story Synth Module 📖

**Date:** 2025-01-15  
**Module:** Story Synth - Narration thérapeutique personnalisée

## 🎯 Objectif du module

Story Synth est un module de narration thérapeutique qui génère des histoires personnalisées pour accompagner les utilisateurs dans leur processus de guérison émotionnelle. Les histoires sont adaptées au contexte de l'utilisateur, à son thème émotionnel choisi et au ton désiré.

## 📐 Architecture

### Types & Schémas (`types.ts`)

Le module définit des types stricts avec validation Zod :

```typescript
// Thèmes narratifs
export const STORY_THEMES = [
  'inner_strength',    // Force intérieure
  'transformation',    // Transformation personnelle
  'connection',        // Connexion aux autres
  'hope',             // Espoir et résilience
  'courage',          // Courage face aux défis
  'healing',          // Guérison émotionnelle
] as const;

// Tons narratifs
export const STORY_TONES = [
  'calm',         // Calme et apaisant
  'uplifting',    // Encourageant et positif
  'reflective',   // Réflexif et introspectif
  'empowering',   // Émancipateur et stimulant
] as const;
```

#### Session de narration
```typescript
interface StorySynthSession {
  id: string;
  user_id: string;
  theme: StoryTheme;
  tone: StoryTone;
  user_context?: string | null;
  reading_duration_seconds?: number | null;
  completed_at?: string | null;
  created_at: string;
}
```

#### Contenu de l'histoire
```typescript
interface StoryContent {
  title: string;
  narrative: string;
  reflection_prompts: string[];
  audio_url?: string;
  duration_seconds: number;
  generated_at: string;
}
```

### Service API (`storySynthService.ts`)

Le service gère les interactions avec Supabase et l'IA générative :

#### Fonctions principales

1. **`createSession(payload: CreateStorySynthSession)`**
   - Crée une nouvelle session de narration
   - Valide le thème et le ton choisis
   - Enregistre le contexte utilisateur (optionnel)
   - Retourne l'identifiant de session

2. **`generateStory(sessionId: string)`**
   - Génère le contenu narratif personnalisé via IA
   - Crée les prompts de réflexion associés
   - Optionnel : synthèse vocale de l'histoire
   - Calcule la durée estimée de lecture
   - Retourne le contenu complet

3. **`completeSession(payload: CompleteStorySynthSession)`**
   - Enregistre la durée de lecture effective
   - Marque la session comme terminée
   - Met à jour les statistiques utilisateur

4. **`getStats(userId: string)`**
   - Nombre total de sessions
   - Temps de lecture cumulé
   - Thème et ton préférés
   - Taux de complétion
   - Durée moyenne de lecture
   - Date de dernière session

5. **`getRecentSessions(userId: string, limit: number)`**
   - Récupère l'historique des sessions récentes
   - Tri par date décroissante
   - Limite paramétrable

### State Machine (`useStorySynthMachine.ts`)

Machine d'états pour gérer le cycle de vie d'une session :

#### États
- **`idle`** : Aucune session active
- **`generating`** : Génération de l'histoire en cours
- **`reading`** : Histoire affichée, lecture en cours
- **`completed`** : Session terminée avec succès
- **`error`** : Erreur lors du processus

#### Actions

**`startStory(theme, tone, userContext?)`**
```typescript
// Démarre une nouvelle session
// 1. Crée la session en base
// 2. Génère l'histoire personnalisée
// 3. Transition vers l'état 'reading'
// 4. Démarre le chronomètre de lecture
```

**`completeStory()`**
```typescript
// Termine la session en cours
// 1. Calcule la durée de lecture
// 2. Enregistre la complétion
// 3. Transition vers 'completed'
// 4. Reset automatique après 3 secondes
```

**`resetStory()`**
```typescript
// Réinitialise complètement le module
// Retour à l'état 'idle'
```

#### État retourné
```typescript
interface StorySynthState {
  phase: 'idle' | 'generating' | 'reading' | 'completed' | 'error';
  session: StorySynthSession | null;
  currentStory: StoryContent | null;
  startTime: number | null;
  error: string | null;
}
```

## 🗄️ Base de données Supabase

### Table `story_synth_sessions`

```sql
CREATE TABLE story_synth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT NOT NULL CHECK (theme IN (
    'inner_strength', 'transformation', 'connection', 
    'hope', 'courage', 'healing'
  )),
  tone TEXT NOT NULL CHECK (tone IN (
    'calm', 'uplifting', 'reflective', 'empowering'
  )),
  user_context TEXT,
  reading_duration_seconds INTEGER CHECK (reading_duration_seconds >= 0),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_story_sessions_user ON story_synth_sessions(user_id);
CREATE INDEX idx_story_sessions_created ON story_synth_sessions(created_at DESC);
CREATE INDEX idx_story_sessions_theme ON story_synth_sessions(theme);
```

### Politiques RLS

```sql
-- Les utilisateurs peuvent créer leurs propres sessions
CREATE POLICY "Users can create own story sessions"
ON story_synth_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent voir leurs propres sessions
CREATE POLICY "Users can view own story sessions"
ON story_synth_sessions FOR SELECT
USING (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour leurs propres sessions
CREATE POLICY "Users can update own story sessions"
ON story_synth_sessions FOR UPDATE
USING (auth.uid() = user_id);

-- Service role a accès complet
CREATE POLICY "Service role full access to story sessions"
ON story_synth_sessions FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role');
```

## 🎨 Composants UI (existants)

Le module s'intègre avec les composants UI existants :

- **ThemeSelector** : Sélection du thème narratif
- **ToneSelector** : Choix du ton de l'histoire
- **ContextInput** : Saisie optionnelle du contexte
- **StoryReader** : Affichage de l'histoire avec audio
- **ReflectionPrompts** : Questions de réflexion guidée
- **ProgressIndicator** : Suivi de la lecture

## 🔗 Intégrations

### IA Générative
- Génération de narratifs personnalisés
- Adaptation au thème et ton choisis
- Incorporation du contexte utilisateur
- Prompts de réflexion pertinents

### Synthèse vocale (optionnelle)
- Conversion texte-vers-parole
- Voix apaisante et professionnelle
- Fichiers audio hébergés sur Supabase Storage

### Analytics
- Suivi des thèmes populaires
- Taux de complétion des histoires
- Durées moyennes de lecture
- Impact sur le bien-être (croisement avec assessments)

## 📊 Métriques de succès

- **Engagement** : Taux de complétion des histoires
- **Préférence** : Distribution des thèmes/tons choisis
- **Durée** : Temps moyen de lecture
- **Récurrence** : Fréquence d'utilisation du module
- **Satisfaction** : Feedback utilisateur post-lecture

## 🧪 Tests unitaires

Fichier : `src/modules/story-synth/__tests__/types.test.ts`

**Couverture** : 72 tests unitaires validant :
- ✅ Schémas Zod pour tous les types
- ✅ Validation des thèmes et tons
- ✅ Validation des sessions complètes et partielles
- ✅ Validation du contenu des histoires
- ✅ Validation des statistiques
- ✅ Validation des payloads de création/complétion
- ✅ Gestion des cas invalides
- ✅ Exports TypeScript

## 🚀 Utilisation

```typescript
import { useStorySynthMachine } from '@/modules/story-synth';

function StoryTherapy() {
  const { state, startStory, completeStory, resetStory } = useStorySynthMachine();

  const handleStart = async () => {
    await startStory(
      'hope',
      'uplifting',
      'Traversing a difficult period at work'
    );
  };

  return (
    <div>
      {state.phase === 'idle' && (
        <button onClick={handleStart}>Commencer une histoire</button>
      )}
      
      {state.phase === 'generating' && <LoadingSpinner />}
      
      {state.phase === 'reading' && state.currentStory && (
        <StoryReader 
          content={state.currentStory}
          onComplete={completeStory}
        />
      )}
      
      {state.phase === 'completed' && (
        <CompletionMessage onReset={resetStory} />
      )}
    </div>
  );
}
```

## ✅ Conformité aux standards

- ✅ **TypeScript strict** : Tous les types validés avec Zod
- ✅ **Tests unitaires** : 72 tests avec vitest + @testing-library/react
- ✅ **Sécurité** : RLS policies complètes sur Supabase
- ✅ **Performance** : Index optimisés, queries efficaces
- ✅ **Accessibilité** : Compatible lecteurs d'écran
- ✅ **Documentation** : JSDoc sur toutes les fonctions publiques
- ✅ **État prévisible** : State machine claire et déterministe

---

**Status** : ✅ Module Story Synth documenté et testé  
**Next** : Day 30 - Module suivant (Screen Silk ou AI Coach)

# Day 31 - AI Coach Module 🤖

**Date:** 2025-01-15  
**Module:** AI Coach - Coaching IA personnalisé pour le bien-être

## 🎯 Objectif du module

AI Coach est un module de coaching conversationnel alimenté par l'IA, offrant un accompagnement personnalisé pour le bien-être émotionnel. Le coach adapte sa personnalité, détecte les émotions, suggère des techniques thérapeutiques et fournit des ressources pertinentes.

## 📐 Architecture

### Types & Schémas (`types.ts`)

Le module définit des types stricts avec validation Zod :

```typescript
// Personnalités du coach
export const COACH_PERSONALITIES = [
  'empathetic',    // Empathique et compréhensif
  'motivational',  // Motivant et énergisant
  'analytical',    // Analytique et structuré
  'zen',          // Zen et méditatif
  'energetic',    // Énergique et dynamique
] as const;

// Statuts de session
export const SESSION_STATUSES = [
  'active',      // Session en cours
  'paused',      // Session en pause
  'completed',   // Session terminée
  'abandoned',   // Session abandonnée
] as const;

// Techniques thérapeutiques suggérées
export const TECHNIQUE_TYPES = [
  'breathing',                 // Exercices de respiration
  'meditation',               // Méditation guidée
  'cognitive_reframing',      // Recadrage cognitif
  'grounding',                // Ancrage (5-4-3-2-1)
  'progressive_relaxation',   // Relaxation progressive musculaire
  'mindfulness',              // Pleine conscience
  'gratitude',                // Pratiques de gratitude
] as const;
```

#### Session de coaching
```typescript
interface CoachSession {
  id: string;
  user_id: string;
  coach_personality: CoachPersonality;
  session_duration: number;           // En secondes
  messages_count: number;
  emotions_detected: EmotionDetected[];
  techniques_suggested: TechniqueType[];
  resources_provided: ResourceProvided[];
  user_satisfaction: number | null;  // 1-5
  session_notes: string | null;
  created_at: string;
  updated_at: string;
}
```

#### Message du coach
```typescript
interface CoachMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
```

#### Émotion détectée
```typescript
interface EmotionDetected {
  emotion: string;              // ex: 'anxiety', 'stress', 'calm'
  confidence: number;           // 0.0 - 1.0
  timestamp: string;
}
```

#### Ressource fournie
```typescript
interface ResourceProvided {
  title: string;
  type: 'article' | 'video' | 'exercise' | 'tool' | 'external';
  url?: string;
  description?: string;
}
```

### Service API (`aiCoachService.ts`)

Le service gère les interactions avec Supabase et l'IA :

#### Fonctions de gestion de session

1. **`createSession(payload: CreateCoachSession)`**
   - Crée une nouvelle session de coaching
   - Paramètre : personnalité du coach (défaut: 'empathetic')
   - Initialise les compteurs et tableaux
   - Retourne l'objet session

2. **`updateSession(payload: UpdateCoachSession)`**
   - Met à jour les métadonnées de la session
   - Durée, compteur de messages, émotions, techniques, ressources
   - Satisfaction utilisateur et notes
   - Retourne la session mise à jour

3. **`completeSession(payload: CompleteCoachSession)`**
   - Marque la session comme terminée
   - Enregistre la satisfaction (1-5) et notes facultatives
   - Met à jour le timestamp
   - Retourne la session complétée

4. **`getSession(sessionId: string)`**
   - Récupère une session spécifique
   - Validation avec Zod
   - Gestion d'erreurs avec Sentry

#### Fonctions de gestion des messages

5. **`addMessage(payload: AddCoachMessage)`**
   - Ajoute un message à la conversation
   - Stocké dans `ai_chat_messages`
   - Incrémente automatiquement `messages_count`
   - Support des métadonnées

6. **`getMessages(sessionId: string)`**
   - Récupère tous les messages d'une session
   - Tri chronologique (ordre ascendant)
   - Conversion vers `CoachMessage`

#### Fonction d'interaction IA

7. **`sendMessage(payload: SendCoachMessage)`**
   ```typescript
   // Workflow complet :
   // 1. Ajoute le message utilisateur
   // 2. Appelle l'edge function 'ai-coach'
   // 3. Reçoit la réponse IA avec métadonnées
   // 4. Ajoute le message assistant
   // 5. Met à jour la session avec émotions/techniques/ressources détectées
   // 6. Retourne le message assistant
   ```

#### Fonction de statistiques

8. **`getStats()`**
   - Sessions totales et complétées
   - Durée totale et moyenne
   - Messages totaux et moyenne par session
   - Satisfaction moyenne
   - Personnalité favorite
   - Top 5 émotions détectées
   - Top 5 techniques suggérées

9. **`getRecentSessions(limit: number)`**
   - Récupère les sessions récentes
   - Tri par date décroissante
   - Limite paramétrable (défaut: 10)

### State Machine (`useAICoachMachine.ts`)

Machine d'états pour gérer le cycle de vie du coaching :

#### États
```typescript
type CoachPhase =
  | 'idle'          // Aucune session
  | 'initializing'  // Création de session
  | 'ready'         // Prêt à recevoir messages
  | 'sending'       // Envoi de message utilisateur
  | 'receiving'     // Réception de réponse IA
  | 'active'        // Conversation active
  | 'completing'    // Finalisation
  | 'completed'     // Session terminée
  | 'error';        // Erreur
```

#### État retourné
```typescript
interface AICoachMachineState {
  phase: CoachPhase;
  currentSession: CoachSession | null;
  messages: CoachMessage[];
  isLoading: boolean;
  error: string | null;
  elapsedSeconds: number;  // Timer automatique
}
```

#### Actions

**`startSession(personality?: CoachPersonality)`**
```typescript
// Démarre une nouvelle session
// 1. Phase 'initializing'
// 2. Crée la session via service
// 3. Transition vers 'ready'
// 4. Démarre le timer automatique
```

**`sendMessage(message: string)`**
```typescript
// Envoie un message au coach
// 1. Phase 'sending'
// 2. Appelle service.sendMessage
// 3. Recharge tous les messages
// 4. Met à jour la durée de session
// 5. Transition vers 'active'
```

**`completeSession(satisfaction: number, notes?: string)`**
```typescript
// Termine la session
// 1. Phase 'completing'
// 2. Arrête le timer
// 3. Met à jour la durée finale
// 4. Enregistre satisfaction et notes
// 5. Transition vers 'completed'
```

**`loadSession(sessionId: string)`**
```typescript
// Charge une session existante
// Récupère session + messages
// Restaure le timer à session_duration
// Transition vers 'active'
```

**`reset()`**
```typescript
// Réinitialise complètement la machine
// Arrête le timer
// Retour à 'idle'
```

#### Timer automatique
- Démarré automatiquement en phases 'ready' ou 'active'
- Incrémenté chaque seconde
- Arrêté lors de la complétion ou du reset
- Sauvegardé périodiquement dans la session

## 🗄️ Base de données Supabase

### Table `ai_coach_sessions`

```sql
CREATE TABLE ai_coach_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_personality TEXT NOT NULL CHECK (coach_personality IN (
    'empathetic', 'motivational', 'analytical', 'zen', 'energetic'
  )),
  session_duration INTEGER NOT NULL DEFAULT 0 CHECK (session_duration >= 0),
  messages_count INTEGER NOT NULL DEFAULT 0 CHECK (messages_count >= 0),
  emotions_detected JSONB DEFAULT '[]'::jsonb,
  techniques_suggested TEXT[] DEFAULT ARRAY[]::TEXT[],
  resources_provided JSONB DEFAULT '[]'::jsonb,
  user_satisfaction INTEGER CHECK (user_satisfaction >= 1 AND user_satisfaction <= 5),
  session_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_ai_coach_user ON ai_coach_sessions(user_id);
CREATE INDEX idx_ai_coach_created ON ai_coach_sessions(created_at DESC);
CREATE INDEX idx_ai_coach_personality ON ai_coach_sessions(coach_personality);
CREATE INDEX idx_ai_coach_satisfaction ON ai_coach_sessions(user_satisfaction);
```

### Politiques RLS

```sql
-- Les utilisateurs peuvent créer leurs propres sessions
CREATE POLICY "Users can create own coach sessions"
ON ai_coach_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent voir leurs propres sessions
CREATE POLICY "Users can view own coach sessions"
ON ai_coach_sessions FOR SELECT
USING (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour leurs propres sessions
CREATE POLICY "Users can update own coach sessions"
ON ai_coach_sessions FOR UPDATE
USING (auth.uid() = user_id);

-- Service role a accès complet
CREATE POLICY "Service role full access to coach sessions"
ON ai_coach_sessions FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role');
```

### Table `ai_chat_messages` (réutilisée)

Les messages sont stockés dans la table existante `ai_chat_messages` avec `conversation_id = session_id`.

## 🤖 Edge Function `ai-coach`

L'edge function gère l'interaction avec l'IA générative :

```typescript
// supabase/functions/ai-coach/index.ts

import { serve } from 'std/server';

serve(async (req) => {
  const { session_id, message } = await req.json();
  
  // 1. Récupérer la session et son historique
  const session = await getSession(session_id);
  const messages = await getMessages(session_id);
  
  // 2. Construire le prompt système selon la personnalité
  const systemPrompt = buildSystemPrompt(session.coach_personality);
  
  // 3. Appeler l'IA (Lovable AI Gateway)
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: message },
      ],
    }),
  });
  
  const aiResponse = await response.json();
  
  // 4. Analyser la réponse pour détecter émotions/techniques
  const emotions = detectEmotions(message, aiResponse);
  const techniques = suggestTechniques(aiResponse);
  const resources = extractResources(aiResponse);
  
  // 5. Retourner la réponse enrichie
  return new Response(JSON.stringify({
    response: aiResponse.choices[0].message.content,
    emotions,
    techniques,
    resources,
  }));
});
```

### Prompts système par personnalité

```typescript
const SYSTEM_PROMPTS = {
  empathetic: `Tu es un coach empathique et bienveillant. 
    Tu écoutes activement, valides les émotions et offres un soutien chaleureux.
    Utilise des phrases comme "Je comprends que...", "C'est normal de ressentir..."`,
    
  motivational: `Tu es un coach motivant et dynamique.
    Tu inspires l'action, renforces la confiance et célèbres les victoires.
    Utilise des phrases comme "Tu es capable de...", "Imagine ce que tu pourrais..."`,
    
  analytical: `Tu es un coach analytique et structuré.
    Tu aides à déconstruire les problèmes, identifies les patterns et proposes des stratégies.
    Utilise des questions comme "Qu'est-ce qui déclenche...", "Quels sont les patterns..."`,
    
  zen: `Tu es un coach zen et méditatif.
    Tu encourages la pleine conscience, l'acceptation et le lâcher-prise.
    Utilise des phrases comme "Reste présent à...", "Observe sans juger..."`,
    
  energetic: `Tu es un coach énergique et enthousiaste.
    Tu apportes de la positivité, de l'humour léger et de l'optimisme.
    Utilise des phrases comme "C'est génial que...", "Allons-y ensemble..."`,
};
```

## 🎨 Composants UI

### `CoachChat`
- Interface de chat conversationnel
- Affichage des messages utilisateur/assistant
- Input avec validation (max 2000 caractères)
- Support markdown dans les réponses
- Indicateur de frappe (typing indicator)

### `PersonalitySelector`
- Sélection de la personnalité du coach
- Cartes visuelles avec icônes
- Description de chaque personnalité
- Animation de sélection

### `EmotionBadges`
- Affichage des émotions détectées
- Badges colorés avec niveau de confiance
- Timeline des émotions au fil de la conversation

### `TechniqueSuggestions`
- Cartes de techniques suggérées
- Liens vers exercices guidés
- Suivi des techniques essayées

### `ResourceCards`
- Affichage des ressources fournies
- Filtrage par type (article/vidéo/exercice)
- Liens externes avec icônes

### `SessionStats`
- Durée de session en temps réel
- Nombre de messages échangés
- Émotions et techniques utilisées
- Graphiques de progression

### `SatisfactionRating`
- Évaluation 1-5 étoiles
- Champ de notes facultatif
- Déclencheur de complétion

## 🧪 Tests unitaires

Fichier : `src/modules/ai-coach/__tests__/types.test.ts`

**Couverture** : 96 tests unitaires validant :
- ✅ Toutes les personnalités du coach
- ✅ Tous les statuts de session
- ✅ Tous les rôles de message
- ✅ Tous les types de techniques
- ✅ Schémas de messages complets
- ✅ Validation des émotions détectées (confidence 0-1)
- ✅ Validation des ressources fournies
- ✅ Validation des sessions complètes/partielles
- ✅ Payloads de création/mise à jour/complétion
- ✅ Limites de longueur de messages (5000/2000 caractères)
- ✅ Scores de satisfaction valides (1-5)
- ✅ Statistiques avec valeurs nulles
- ✅ Exports TypeScript

## 🚀 Utilisation

```typescript
import { useAICoachMachine } from '@/modules/ai-coach';

function AICoachInterface() {
  const {
    phase,
    currentSession,
    messages,
    isLoading,
    elapsedSeconds,
    startSession,
    sendMessage,
    completeSession,
    reset,
  } = useAICoachMachine();

  const handleStart = async (personality: CoachPersonality) => {
    await startSession(personality);
  };

  const handleSend = async (message: string) => {
    await sendMessage(message);
  };

  const handleComplete = async (satisfaction: number, notes?: string) => {
    await completeSession(satisfaction, notes);
  };

  return (
    <div>
      {phase === 'idle' && (
        <PersonalitySelector onSelect={handleStart} />
      )}
      
      {(phase === 'ready' || phase === 'active') && (
        <>
          <CoachChat
            messages={messages}
            onSend={handleSend}
            isLoading={isLoading}
          />
          <SessionStats
            duration={elapsedSeconds}
            messageCount={currentSession?.messages_count || 0}
          />
        </>
      )}
      
      {currentSession && (
        <EmotionBadges emotions={currentSession.emotions_detected} />
      )}
      
      {phase === 'active' && (
        <button onClick={() => handleComplete(5, 'Très utile')}>
          Terminer la session
        </button>
      )}
    </div>
  );
}
```

## 📊 Métriques clés

- **Engagement** : Durée moyenne des sessions
- **Satisfaction** : Note moyenne (cible: ≥ 4/5)
- **Rétention** : Fréquence d'utilisation hebdomadaire
- **Efficacité** : Corrélation satisfaction/durée
- **Personnalité** : Distribution des préférences
- **Impact** : Amélioration des scores d'assessments

## ✅ Conformité aux standards

- ✅ **TypeScript strict** : Tous les types validés avec Zod
- ✅ **Tests unitaires** : 96 tests avec vitest
- ✅ **Sécurité** : RLS policies complètes, secrets protégés
- ✅ **Performance** : Index optimisés, edge function rapide
- ✅ **Accessibilité** : ARIA labels, navigation clavier
- ✅ **Documentation** : JSDoc sur toutes les fonctions
- ✅ **État prévisible** : State machine claire avec timer automatique
- ✅ **Gestion d'erreurs** : Sentry pour monitoring

---

**Status** : ✅ Module AI Coach documenté et testé  
**Next** : Récapitulatif Phase 5 - Modules documentés

# 🎣 Hooks - Documentation

## 📋 Vue d'ensemble

Custom React hooks pour la logique business et state management.

## 📁 Catégories

### 🤖 IA & OpenAI
- `useOpenAI` - Intégration OpenAI GPT
- `useStorySynth` - Génération d'histoires interactives
- `useMusicGeneration` - Génération musicale IA

### 📊 Data & API
- `useEmotions` - Gestion des émotions
- `useJournal` - Journal émotionnel
- `useMetrics` - Métriques et analytics

### 👤 Auth & Users
- `useAuth` - Authentification Supabase
- `useProfile` - Profil utilisateur
- `usePermissions` - Vérification permissions

---

## 🤖 Hooks IA

### `useOpenAI`

Interaction avec les modèles OpenAI (GPT-4.1, GPT-5).

**Localisation**: `src/hooks/useOpenAI.ts`

**Usage:**
```typescript
import { useOpenAI } from '@/hooks/useOpenAI';

function MyComponent() {
  const { generateText, isLoading, error } = useOpenAI();

  const handleGenerate = async () => {
    const result = await generateText({
      prompt: 'Génère un exercice de bien-être',
      model: 'gpt-4.1-2025-04-14', // ou 'gpt-5-2025-08-07'
      temperature: 0.7,
      maxTokens: 500
    });
    console.log(result);
  };

  return (
    <button onClick={handleGenerate} disabled={isLoading}>
      {isLoading ? 'Génération...' : 'Générer'}
    </button>
  );
}
```

**Interface:**
```typescript
interface OpenAIRequest {
  prompt: string;
  model?: 'gpt-4.1-2025-04-14' | 'gpt-5-2025-08-07';
  temperature?: number; // 0-1
  maxTokens?: number;
}

interface UseOpenAIReturn {
  generateText: (request: OpenAIRequest) => Promise<string | null>;
  isLoading: boolean;
  error: string | null;
}
```

**Modèles disponibles:**
- `gpt-4.1-2025-04-14` - GPT-4.1 (fiable, précis)
- `gpt-5-2025-08-07` - GPT-5 flagship (plus puissant)

**Note importante:** Les nouveaux modèles (GPT-5) utilisent `max_completion_tokens` au lieu de `max_tokens` et ne supportent pas le paramètre `temperature`.

---

### `useStorySynth`

Génération d'histoires interactives guidées par IA.

**Usage:**
```typescript
import { useStorySynth } from '@/hooks/useStorySynth';

function StoryGenerator() {
  const { currentStory, createStory, navigateToChapter, isGenerating } = useStorySynth();

  const handleCreate = async () => {
    const story = await createStory(
      undefined, // imageFile optionnel
      'Histoire inspirante sur le courage'
    );
    console.log(story);
  };

  return (
    <div>
      {currentStory ? (
        <div>
          <h2>{currentStory.title}</h2>
          <p>{currentStory.chapters[currentStory.currentChapterIndex].content}</p>
        </div>
      ) : (
        <button onClick={handleCreate} disabled={isGenerating}>
          Créer une histoire
        </button>
      )}
    </div>
  );
}
```

**Interface:**
```typescript
interface Story {
  id: string;
  title: string;
  chapters: StoryChapter[];
  currentChapterIndex: number;
}

interface StoryChapter {
  id: string;
  title: string;
  content: string;
  imagePrompt?: string;
  choices?: { text: string; nextChapter: string }[];
}
```

---

### `useMusicGeneration`

Génération de musique thérapeutique basée sur les émotions.

**Usage:**
```typescript
import { useMusicGeneration } from '@/hooks/useMusicGeneration';

function MusicTherapy() {
  const { generateMusic, isGenerating, error } = useMusicGeneration();

  const handleGenerate = async () => {
    const track = await generateMusic(
      'calme',      // emotion
      'ambient',    // customPrompt
      'relaxed',    // mood
      0.7           // intensity
    );
    
    if (track) {
      console.log('Piste générée:', track);
      // Jouer le track
    }
  };

  return (
    <button onClick={handleGenerate} disabled={isGenerating}>
      {isGenerating ? 'Génération...' : 'Générer musique'}
    </button>
  );
}
```

**Interface:**
```typescript
interface GeneratedTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  audioUrl: string;
  duration: number;
  emotion?: string;
  mood?: string;
  coverUrl?: string;
  tags?: string;
}
```

---

## 📊 Hooks Data

### `useEmotions`

Gestion et tracking des émotions utilisateur.

**Usage:**
```typescript
import { useEmotions } from '@/hooks/useEmotions';

function EmotionTracker() {
  const { 
    emotions, 
    addEmotion, 
    getEmotionHistory,
    isLoading 
  } = useEmotions();

  const handleAdd = async () => {
    await addEmotion({
      type: 'joy',
      intensity: 8,
      note: 'Excellente journée'
    });
  };

  return (
    <div>
      <button onClick={handleAdd} disabled={isLoading}>
        Ajouter émotion
      </button>
      <ul>
        {emotions.map(e => (
          <li key={e.id}>{e.type} - {e.intensity}/10</li>
        ))}
      </ul>
    </div>
  );
}
```

---

### `useJournal`

Gestion du journal émotionnel quotidien.

**Usage:**
```typescript
import { useJournal } from '@/hooks/useJournal';

function JournalComponent() {
  const { entries, addEntry, isLoading } = useJournal();

  const handleSave = async () => {
    await addEntry({
      content: 'Ma journée...',
      mood: 'positive',
      emotions: ['joy', 'gratitude']
    });
  };

  return (
    <div>
      <textarea onChange={(e) => setContent(e.target.value)} />
      <button onClick={handleSave} disabled={isLoading}>
        Sauvegarder
      </button>
    </div>
  );
}
```

---

## 👤 Hooks Auth

### `useAuth`

Authentification et gestion de session Supabase.

**Usage:**
```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginComponent() {
  const { user, signIn, signOut, isLoading } = useAuth();

  const handleLogin = async () => {
    await signIn({
      email: 'user@example.com',
      password: 'password'
    });
  };

  if (user) {
    return <div>Connecté: {user.email}</div>;
  }

  return <button onClick={handleLogin}>Se connecter</button>;
}
```

---

## 🧪 Tests Hooks

### Pattern de test recommandé:

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useOpenAI } from './useOpenAI';

test('should generate text', async () => {
  const { result } = renderHook(() => useOpenAI());

  await waitFor(async () => {
    const text = await result.current.generateText({
      prompt: 'Test'
    });
    expect(text).toBeTruthy();
  });
});
```

---

## 📝 Conventions

### Nommage
- Préfixe `use` obligatoire
- CamelCase: `useMyCustomHook`
- Fichier: `useMyCustomHook.ts`

### Structure
```typescript
import { useState, useEffect } from 'react';

interface UseMyHookOptions {
  option1?: string;
}

interface UseMyHookReturn {
  data: any;
  isLoading: boolean;
  error: Error | null;
}

export const useMyHook = (options?: UseMyHookOptions): UseMyHookReturn => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Logic...

  return { data, isLoading, error };
};
```

### Best Practices
1. ✅ Toujours retourner un objet (pas de tuple)
2. ✅ Inclure états `isLoading` et `error`
3. ✅ Cleanup dans `useEffect` return
4. ✅ Typage strict 100%
5. ✅ Tests unitaires pour chaque hook

---

## 🔄 Dépendances Communes

```typescript
// State management
import { useState, useEffect, useMemo, useCallback } from 'react';

// Supabase
import { supabase } from '@/integrations/supabase/client';

// Notifications
import { toast } from 'sonner';

// TanStack Query (pour API)
import { useQuery, useMutation } from '@tanstack/react-query';
```

---

## ⚡ Performances

### Optimisations recommandées:

```typescript
export const useOptimizedHook = () => {
  // Memoize callbacks
  const handleAction = useCallback(() => {
    // ...
  }, [dependencies]);

  // Memoize computed values
  const computed = useMemo(() => {
    return expensiveCalculation();
  }, [data]);

  return { handleAction, computed };
};
```

---

**Mis à jour**: ${new Date().toISOString().split('T')[0]}

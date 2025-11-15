# Zustand Patterns - Guide de standardisation

Guide officiel pour la gestion d'état avec Zustand dans EmotionsCare.

## 📋 Vue d'ensemble

**Décision architecturale** : Zustand est le state manager officiel de la plateforme.

**Avant** (3 patterns en compétition):
- ❌ Zustand (usage inconsistant)
- ❌ Context API (pour petits états locaux)
- ❌ Patterns Redux/Recoil (legacy)

**Après** (pattern unifié):
- ✅ Zustand uniquement
- ✅ Patterns standardisés
- ✅ Documentation complète

## 🎯 Patterns standardisés

### 1. Store de base

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface MyState {
  // State
  count: number;
  name: string;
}

interface MyActions {
  // Actions
  increment: () => void;
  setName: (name: string) => void;
  reset: () => void;
}

type MyStore = MyState & MyActions;

const initialState: MyState = {
  count: 0,
  name: '',
};

export const useMyStore = create<MyStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        increment: () => set((state) => ({ count: state.count + 1 }), false, 'increment'),
        setName: (name) => set({ name }, false, 'setName'),
        reset: () => set(initialState, false, 'reset'),
      }),
      {
        name: 'emotionscare-my-store',
        partialize: (state) => ({
          // Only persist what's needed
          count: state.count,
        }),
      }
    ),
    { name: 'MyStore' }
  )
);
```

### 2. Sélecteurs

```typescript
// GOOD: Utiliser des sélecteurs pour optimiser les re-renders
export const selectCount = (state: MyStore) => state.count;
export const selectIsPositive = (state: MyStore) => state.count > 0;

// Usage dans composants
function MyComponent() {
  const count = useMyStore(selectCount);
  const isPositive = useMyStore(selectIsPositive);

  // Ne re-render que si count ou isPositive change
}

// BAD: Ne pas utiliser le store entier
function MyComponent() {
  const store = useMyStore(); // Re-render à chaque changement du store!
  return <div>{store.count}</div>;
}
```

### 3. Actions asynchrones

```typescript
interface MyStore {
  data: any[];
  isLoading: boolean;
  error: string | null;

  fetchData: () => Promise<void>;
}

export const useMyStore = create<MyStore>()((set) => ({
  data: [],
  isLoading: false,
  error: null,

  fetchData: async () => {
    set({ isLoading: true, error: null }, false, 'fetchData:start');

    try {
      const response = await fetch('/api/data');
      const data = await response.json();

      set({ data, isLoading: false }, false, 'fetchData:success');
    } catch (error) {
      set(
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          isLoading: false,
        },
        false,
        'fetchData:error'
      );
    }
  },
}));
```

### 4. Middleware devtools

```typescript
// TOUJOURS nommer les actions pour le debugging
set({ count: 1 }, false, 'increment'); // ✅ GOOD
set({ count: 1 }); // ❌ BAD - pas de nom

// Utiliser le 3ème paramètre pour tracer les actions
set(
  (state) => ({ count: state.count + 1 }),
  false, // replace = false (merge avec état existant)
  'increment' // nom de l'action pour devtools
);
```

### 5. Persist (localStorage)

```typescript
export const useMyStore = create<MyStore>()(
  persist(
    (set) => ({
      // ...state and actions
    }),
    {
      name: 'emotionscare-my-store', // Clé localStorage
      partialize: (state) => ({
        // IMPORTANT: Ne persister que ce qui est nécessaire
        userId: state.userId,
        preferences: state.preferences,
        // Ne PAS persister: isLoading, error, cache temporaire
      }),
    }
  )
);
```

### 6. Typage strict

```typescript
// ✅ GOOD: Séparer State et Actions
interface MyState {
  count: number;
}

interface MyActions {
  increment: () => void;
}

type MyStore = MyState & MyActions;

// ❌ BAD: Tout mélanger
interface MyStore {
  count: number;
  increment: () => void;
}
```

### 7. Reset pattern

```typescript
// TOUJOURS fournir une méthode reset
const initialState: MyState = {
  count: 0,
  name: '',
};

export const useMyStore = create<MyStore>()((set) => ({
  ...initialState,

  // ...actions

  reset: () => set(initialState, false, 'reset'),
}));
```

## 📦 Stores partagés créés

### 1. sessions.store.ts

Store global pour toutes les sessions (musique, respiration, etc.)

```typescript
import { useSessionsStore } from '@/store/sessions.store';

const {
  activeSession,
  startSession,
  completeSession,
  recentSessions,
} = useSessionsStore();

// Démarrer une session
startSession({
  id: 'session-123',
  userId: 'user-456',
  type: 'music',
  subtype: 'therapeutic',
});

// Compléter
completeSession({ effectiveness: 0.85 });
```

**Features:**
- Gestion session active
- Historique des 10 dernières sessions
- Pause/Resume
- Persistance des récentes sessions

### 2. progression.store.ts

Système unifié de progression cross-module

```typescript
import { useProgressionStore } from '@/store/progression.store';

const {
  progression,
  recordSession,
  achievements,
  unlockAchievement,
  activeChallenges,
} = useProgressionStore();

// Enregistrer une session
recordSession('music-unified', 'Musique Thérapeutique', 600);

// Système de points automatique
// Système de niveau automatique
// Achievements auto-unlocked
// Streaks trackés
```

**Features:**
- Niveau global (1-∞)
- Points et système de progression
- Streaks (actuel et record)
- 16 achievements prédéfinis
- Challenges daily/weekly/monthly
- Progression par module

**Achievements inclus:**
- Exploration : Premier Pas, Mélomane, Respirateur, Explorateur Complet
- Consistency : Bon Début (3j), Semaine (7j), Mois (30j), Centurion (100j)
- Duration : 1h, 10h, 100h
- Mastery : 10, 50, 100, 500 sessions
- Social : Partage

## 🎯 Migration depuis Context API

**Avant (Context API):**

```typescript
// ❌ Context + Provider
const MyContext = createContext();

function MyProvider({ children }) {
  const [state, setState] = useState({});
  return <MyContext.Provider value={{ state, setState }}>{children}</MyContext.Provider>;
}

function MyComponent() {
  const { state } = useContext(MyContext);
}
```

**Après (Zustand):**

```typescript
// ✅ Zustand
const useMyStore = create((set) => ({
  state: {},
  setState: (newState) => set({ state: newState }),
}));

function MyComponent() {
  const state = useMyStore((s) => s.state);
}
```

**Avantages:**
- Pas de Provider wrapper
- Meilleure performance (pas de re-render inutiles)
- DevTools built-in
- Persistance facile
- Moins de boilerplate

## 🔄 Migration depuis Redux patterns

**Avant (Redux-like):**

```typescript
// ❌ Actions, reducers, dispatch
const reducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
  }
};

dispatch({ type: 'INCREMENT' });
```

**Après (Zustand):**

```typescript
// ✅ Actions directes
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

increment(); // Direct, pas de dispatch
```

## ✅ Checklist pour nouveaux stores

- [ ] Interface séparée State + Actions
- [ ] Type combiné (MyStore = MyState & MyActions)
- [ ] initialState constant
- [ ] Middleware devtools avec name
- [ ] Middleware persist avec partialize
- [ ] Noms d'actions pour devtools (3ème param)
- [ ] Méthode reset()
- [ ] Sélecteurs exportés
- [ ] Typage strict (pas de any)
- [ ] Documentation des usages

## 📚 Exemples réels

### Exemple 1: Store de session musique

```typescript
import { useSessionsStore, useProgressionStore } from '@/store';
import { useMusicUnified } from '@/modules/music-unified';

function MusicPage() {
  const { startSession: startGlobalSession } = useSessionsStore();
  const { recordSession: recordProgression } = useProgressionStore();
  const { createSession, completeSession } = useMusicUnified(userId);

  const handleStart = async () => {
    // 1. Session module-specific
    const musicSession = await createSession('therapeutic', config);

    // 2. Session globale (store partagé)
    startGlobalSession({
      id: musicSession.id,
      userId,
      type: 'music',
      subtype: 'therapeutic',
    });
  };

  const handleComplete = async (completion) => {
    // 1. Compléter session module
    await completeSession(completion);

    // 2. Enregistrer dans progression (achievements, points)
    recordProgression('music-unified', 'Musique Thérapeutique', completion.durationSeconds);
  };
}
```

### Exemple 2: Store de progression avec achievements

```typescript
import { useProgressionStore } from '@/store/progression.store';
import { selectUnlockedAchievements, selectCurrentStreak } from '@/store/progression.store';

function ProfilePage() {
  const progression = useProgressionStore(selectProgression);
  const unlockedAchievements = useProgressionStore(selectUnlockedAchievements);
  const currentStreak = useProgressionStore(selectCurrentStreak);

  return (
    <div>
      <h1>Niveau {progression?.globalLevel}</h1>
      <p>{progression?.totalPoints} points</p>
      <p>Série actuelle: {currentStreak} jours 🔥</p>

      <h2>Achievements ({unlockedAchievements.length})</h2>
      {unlockedAchievements.map((achievement) => (
        <div key={achievement.id}>
          {achievement.icon} {achievement.name} - {achievement.points} pts
        </div>
      ))}
    </div>
  );
}
```

## 🚀 Performance

### Optimiser les re-renders

```typescript
// ❌ BAD: Re-render à chaque changement du store
function MyComponent() {
  const store = useMyStore();
  return <div>{store.count}</div>;
}

// ✅ GOOD: Re-render seulement si count change
function MyComponent() {
  const count = useMyStore((s) => s.count);
  return <div>{count}</div>;
}

// ✅ BETTER: Utiliser les sélecteurs
import { selectCount } from '@/store/my.store';

function MyComponent() {
  const count = useMyStore(selectCount);
  return <div>{count}</div>;
}
```

### Shallow equality

```typescript
import { shallow } from 'zustand/shallow';

// Pour sélectionner plusieurs valeurs
const { count, name } = useMyStore(
  (s) => ({ count: s.count, name: s.name }),
  shallow
);
```

## 📖 Ressources

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Zustand DevTools](https://github.com/pmndrs/zustand#devtools)
- [Persist Middleware](https://github.com/pmndrs/zustand#persist-middleware)

## 🎓 Formation

**Pour les nouveaux développeurs:**

1. Lire ce guide
2. Étudier `sessions.store.ts` (exemple simple)
3. Étudier `progression.store.ts` (exemple complexe)
4. Créer un store de test
5. Review avec l'équipe

**Règle d'or:** Un seul pattern, partout, tout le temps.

---

**Date:** Janvier 2025
**Version:** 1.0
**Auteur:** EmotionsCare Team

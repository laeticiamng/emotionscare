# 🗄️ Gestion d'état – Conventions Zustand

Objectif : un socle prévisible sans immer, compatible SSR et edge, tout en limitant les rerenders.
Les stores existants (Glow, Breath, VR Safety, ScreenSilk, Flags, etc.) respectent les principes ci-dessous.

## 1. Création des stores (sans immer)
- Utiliser **Zustand vanilla** : `import { create } from 'zustand';`.
- La fonction utilitaire `createImmutableStore` (`src/store/utils/createImmutableStore.ts`) fournit un `set` immuable :
  - `set(partial)` fusionne via `Object.assign` (pas de mutation in-place).
  - `set(fn)` reçoit l'état courant → retourner un partiel.
- Exemple minimal :
```ts
import { create } from 'zustand';
import { createImmutableStore } from '@/store/utils/createImmutableStore';

type ExampleState = {
  value: number;
  increment: () => void;
};

const baseStore = create<ExampleState>()(
  createImmutableStore((set) => ({
    value: 0,
    increment: () => set(state => ({ value: state.value + 1 })),
  })),
);
```
> 🚫 Pas d'immer, pas de `set(state => state.foo++)`.

## 2. Sélecteurs & performances
- Pour éviter les rerenders, exposer **des sélecteurs dédiés** via `createSelectors` (`src/store/utils/createSelectors.ts`).
- Pattern :
```ts
const useGlowStoreBase = create<GlowState>()(createImmutableStore(...));
export const useGlowStore = createSelectors(useGlowStoreBase);

// Utilisation : composant = useGlowStore.use.phase();
```
- Avantages : les composants consomment un selector par clé (`useGlowStore.use.phase()`), ce qui garantit la comparaison par référence de Zustand.
- Pour les sélecteurs composés, préférer `useStore(store, selector, shallow)` ou créer un hook dérivé (`useGlowProgress`).

## 3. Persistance contrôlée
- Utiliser `persist` exporté par `createImmutableStore` (wrapper maison) :
```ts
const useScreenSilkStore = create<ScreenSilkState>()(
  persist((set, get) => ({ ... }), {
    name: 'screen-silk-v1',
    partialize: state => ({ completedSessions: state.completedSessions }),
    version: 1,
    migrate: (persisted, version) => ({ ...persisted }),
  }),
);
```
- Points de vigilance :
  - **Aucune fonction** ne doit être sérialisée (la helper filtre automatiquement).
  - Toujours versionner (`version`) et prévoir une migration simple.
  - `storage` optionnel si besoin (`() => sessionStorage`).

## 4. Pattern « selector lecture + mutation explicite »
- Lecture : `const phase = useGlowStore.use.phase();` (read-only, pas d'actions attachées).
- Mutation : récupérer les actions directement via `useGlowStore(state => state.actions.someAction)` **ou** exposer un hook métier.
- Exemple complet (`src/store/glow.store.ts`) :
```ts
const useGlowStoreBase = create<GlowStore>()(
  createImmutableStore((set, get) => ({
    phase: 'idle',
    actions: {
      start() {
        set({ phase: 'warmup', startedAt: Date.now() });
      },
      complete() {
        const { startedAt } = get();
        set({ phase: 'complete', durationMs: Date.now() - (startedAt ?? Date.now()) });
      },
    },
  })),
);

export const useGlowStore = createSelectors(useGlowStoreBase);

// Dans un composant :
const phase = useGlowStore.use.phase();
const startGlow = useGlowStore(state => state.actions.start);
```
- Ce découplage rend les composants faciles à tester et limite les rerenders à la clé ciblée.

## 5. Souscriptions sans rerender
- Pour side-effects (analytics, timers), utiliser `store.subscribe(selector, listener, options)` directement sur la base :
```ts
useEffect(() => {
  const unsub = useGlowStoreBase.subscribe(
    state => state.phase,
    phase => phase === 'complete' && sendMetric(),
  );
  return () => unsub();
}, []);
```
- `subscribeWithSelector` n'est pas nécessaire : Zustand natif suffit avec nos helpers.

## 6. Tests & lint
- Chaque store doit avoir des tests unitaires ciblant :
  - transitions critiques (actions start/stop/reset),
  - hydratation persist (si `persist` activé),
  - selectors dérivés.
- Le lint interdit `node:*` côté client → toute logique cryptographique doit passer par `src/lib/hash.ts` ou Edge.

> _Réutilisez ce guide lors de la création de nouveaux stores (ex. nouveaux modules, flags). Gardez les actions pures, pas d'effets side dans les setters, et mettez à jour ce doc si un nouveau helper est introduit._

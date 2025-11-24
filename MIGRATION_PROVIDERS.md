# 🔄 Guide de Migration - Providers Optimisés

## 📊 Vue d'ensemble

**Objectif**: Réduire la hiérarchie des providers de 15 à 8 niveaux
**Impact**: Performance améliorée, maintenance simplifiée
**Effort estimé**: 2-3 jours

---

## 🔴 Changements Critiques

### Architecture AVANT (15 niveaux)

```tsx
<HelmetProvider>                   // 1
  <RootErrorBoundary>              // 2
    <QueryClientProvider>          // 3
      <ErrorProvider>              // 4 ❌ À SUPPRIMER
        <AuthProvider>             // 5
          <UserModeProvider>       // 6 ❌ À FUSIONNER
            <I18nBootstrap>        // 7
              <MoodProvider>       // 8 ❌ → Zustand
                <MusicProvider>    // 9 ❌ → Zustand
                  <UnifiedProvider> // 10 ❌ VIDE
                    <ConsentProvider> // 11
                      <AccessibilityProvider> // 12
                        <ThemeProvider> // 13
                          <TooltipProvider> // 14 ❌ → Local
                            <NotificationProvider> // 15 ❌ → Simplifier
                              {children}
```

### Architecture APRÈS (8 niveaux)

```tsx
<HelmetProvider>                   // 1 ✅
  <RootErrorBoundary>              // 2 ✅ (intègre ErrorProvider)
    <QueryClientProvider>          // 3 ✅
      <AuthProvider>               // 4 ✅ (intègre UserModeProvider)
        <I18nProvider>             // 5 ✅
          <ConsentProvider>        // 6 ✅
            <AccessibilityProvider> // 7 ✅
              <ThemeProvider>      // 8 ✅
                {children}
                <Toaster />        // Suffit pour notifications
```

---

## 🔧 Actions de Migration

### 1. MoodProvider → Zustand Store ✅ (Déjà existe)

**Statut**: Le store existe déjà (`src/store/mood.store.ts`)

**Migration des composants**:

```tsx
// ❌ AVANT (via Context)
import { useMood } from '@/contexts/MoodContext';

const MyComponent = () => {
  const { mood, setMood } = useMood();
  return <div>Current mood: {mood}</div>;
};

// ✅ APRÈS (via Zustand)
import { useMoodStore } from '@/store/mood.store';

const MyComponent = () => {
  const mood = useMoodStore(state => state.mood);
  const setMood = useMoodStore(state => state.setMood);
  return <div>Current mood: {mood}</div>;
};
```

**Fichiers à migrer**:
```bash
# Trouver tous les usages
grep -r "useMood()" src/
grep -r "MoodContext" src/
```

---

### 2. MusicProvider → Zustand Store ✅ (Déjà existe)

**Statut**: Le store existe déjà (`src/store/music.store.ts`)

**Migration des composants**:

```tsx
// ❌ AVANT (via Context - 24KB!)
import { useMusic } from '@/contexts/music/MusicContext';

const PlayerComponent = () => {
  const { currentTrack, play, pause, isPlaying } = useMusic();
  return (
    <div>
      <span>{currentTrack?.title}</span>
      <button onClick={isPlaying ? pause : play}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

// ✅ APRÈS (via Zustand)
import { useMusicStore } from '@/store/music.store';

const PlayerComponent = () => {
  const { currentTrack, isPlaying, play, pause } = useMusicStore(
    state => ({
      currentTrack: state.currentTrack,
      isPlaying: state.isPlaying,
      play: state.play,
      pause: state.pause,
    })
  );

  return (
    <div>
      <span>{currentTrack?.title}</span>
      <button onClick={isPlaying ? pause : play}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};
```

**Avantages**:
- ✅ Performance (re-renders optimisés)
- ✅ Pas de prop drilling
- ✅ DevTools Zustand
- ✅ Persistence automatique

**Fichiers à migrer**:
```bash
grep -r "useMusic()" src/
grep -r "MusicContext" src/
grep -r "MusicProvider" src/
```

---

### 3. UserModeProvider → Fusionner avec AuthProvider

**Raison**: UserMode est étroitement lié à Auth (consumer/manager/admin)

**Migration AuthProvider**:

```tsx
// src/contexts/AuthContext.tsx

interface AuthContextType {
  user: User | null;
  session: Session | null;
  // ✅ AJOUT: mode utilisateur
  userMode: 'consumer' | 'manager' | 'admin' | null;
  setUserMode: (mode: 'consumer' | 'manager' | 'admin') => void;
  // ... autres méthodes
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userMode, setUserMode] = useState<UserMode>(null);

  // Détecter le mode automatiquement depuis user.role
  useEffect(() => {
    if (user?.role) {
      setUserMode(user.role as UserMode);
    }
  }, [user]);

  const value = {
    user,
    session,
    userMode,
    setUserMode,
    // ...
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

**Migration des composants**:

```tsx
// ❌ AVANT
import { useUserMode } from '@/contexts/UserModeContext';
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { user } = useAuth();
  const { mode } = useUserMode();
  return <div>{user?.name} - Mode: {mode}</div>;
};

// ✅ APRÈS
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { user, userMode } = useAuth();
  return <div>{user?.name} - Mode: {userMode}</div>;
};
```

---

### 4. UnifiedProvider → Supprimer (Vide)

**Statut**: Actuellement mocké avec fonctions no-op

**Fichier**: `src/core/UnifiedStateManager.tsx`

```tsx
// ❌ Code actuel (inutile)
export const useUnifiedStore = () => {
  return {
    user: null,              // Jamais mis à jour
    isAuthenticated: false,  // Jamais mis à jour
    setUser: () => {},       // No-op
    playTrack: () => {},     // No-op
  };
};
```

**Action**:
```bash
# 1. Supprimer le provider des imports
# 2. Supprimer le fichier UnifiedStateManager.tsx
# 3. Grep pour vérifier aucun usage
grep -r "UnifiedProvider" src/
grep -r "useUnifiedStore" src/
```

---

### 5. TooltipProvider → Décentraliser

**Raison**: Pas besoin d'un provider global, utiliser localement

**Migration**:

```tsx
// ❌ AVANT (global dans RootProvider)
<TooltipProvider>
  {/* Toute l'app */}
</TooltipProvider>

// ✅ APRÈS (local au composant)
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const MyComponent = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>Tooltip content</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
```

**Avantages**:
- ✅ Pas de re-render global
- ✅ Configuration par composant
- ✅ Lazy loading

---

### 6. ErrorProvider → Fusionner avec RootErrorBoundary

**Migration RootErrorBoundary**:

```tsx
// src/components/error/RootErrorBoundary.tsx

class RootErrorBoundary extends React.Component {
  state = {
    hasError: false,
    error: null,
    errorStack: [],  // ✅ AJOUT: historique erreurs
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log vers Sentry
    console.error('Error caught:', error, errorInfo);

    // ✅ AJOUT: Stocker dans l'historique
    this.setState(prev => ({
      errorStack: [...prev.errorStack, { error, errorInfo, timestamp: Date.now() }]
    }));
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

**Supprimer**: `src/contexts/ErrorContext.tsx` (plus nécessaire)

---

### 7. NotificationProvider → Simplifier avec Toaster

**Raison**: `sonner` (Toaster) suffit pour les notifications

```tsx
// ❌ AVANT (custom NotificationProvider)
import { useNotifications } from '@/contexts/NotificationContext';

const MyComponent = () => {
  const { showNotification } = useNotifications();

  const handleClick = () => {
    showNotification({
      type: 'success',
      message: 'Action réussie!',
    });
  };
};

// ✅ APRÈS (Toaster direct)
import { toast } from 'sonner';

const MyComponent = () => {
  const handleClick = () => {
    toast.success('Action réussie!');
  };
};
```

**API Toaster (sonner)**:
```tsx
toast.success('Success message');
toast.error('Error message');
toast.info('Info message');
toast.warning('Warning message');
toast.promise(promise, {
  loading: 'Loading...',
  success: 'Done!',
  error: 'Failed!',
});
```

---

## 📋 Checklist de Migration

### Phase 1: Préparation (1 jour)

- [x] Créer `RootProvider.optimized.tsx`
- [x] Documenter changements (ce fichier)
- [ ] Identifier tous les fichiers utilisant les providers supprimés
- [ ] Créer migration scripts (find & replace)

### Phase 2: Migration State (1 jour)

- [ ] Migrer tous `useMood()` → `useMoodStore()`
- [ ] Migrer tous `useMusic()` → `useMusicStore()`
- [ ] Fusionner `UserModeProvider` dans `AuthProvider`
- [ ] Tests de régression state management

### Phase 3: Nettoyage Providers (1/2 jour)

- [ ] Supprimer `UnifiedProvider` et `UnifiedStateManager.tsx`
- [ ] Supprimer `ErrorProvider` (fusionné)
- [ ] Supprimer `NotificationProvider` (remplacé)
- [ ] Décentraliser `TooltipProvider`

### Phase 4: Activation (1/2 jour)

- [ ] Renommer `RootProvider.optimized.tsx` → `RootProvider.tsx`
- [ ] Mettre à jour imports dans `main.tsx`
- [ ] Tests e2e complets
- [ ] Monitoring performance (avant/après)

---

## 📊 Gains Attendus

### Performance

**Avant**:
- 15 providers = 15 contexts React
- Chaque context peut déclencher re-render
- Overhead mémoire: ~500KB contexts

**Après**:
- 8 providers = 8 contexts React
- 47% moins de providers
- Overhead mémoire: ~250KB contexts
- **Gain estimé**: 15-20% amélioration FCP (First Contentful Paint)

### Maintenabilité

- ✅ Moins de "magic" invisible
- ✅ Debugging plus simple (moins de niveaux)
- ✅ Tests simplifiés (8 mocks vs 15)
- ✅ Architecture plus claire

### Developer Experience

- ✅ Onboarding plus rapide
- ✅ Moins de confusion "quel provider utiliser?"
- ✅ DevTools Zustand (meilleur que Context)

---

## 🧪 Tests de Régression

### Tests critiques à exécuter

```bash
# 1. Tests unitaires
npm run test

# 2. Tests e2e
npm run e2e

# 3. Tests spécifiques providers
npm run test -- --grep "Provider"
npm run test -- --grep "Context"

# 4. Performance audit
npm run build
npm run perf:lighthouse
```

### Scénarios à tester manuellement

- [ ] Login/Logout (AuthProvider)
- [ ] Changement de thème (ThemeProvider)
- [ ] Lecture musique (MusicStore)
- [ ] Sélection mood (MoodStore)
- [ ] Notifications (Toaster)
- [ ] Tooltips (décentralisés)
- [ ] Error boundaries (crash recovery)
- [ ] i18n (changement langue)
- [ ] Accessibilité (prefers-reduced-motion, etc.)

---

## ⚠️ Risques et Mitigation

### Risque 1: Breaking Changes

**Risque**: Components cassés après migration
**Mitigation**:
- Migration progressive
- Feature flag `USE_OPTIMIZED_PROVIDERS`
- Rollback plan

### Risque 2: State Sync Issues

**Risque**: MusicStore/MoodStore désynchronisés
**Mitigation**:
- Tests exhaustifs
- Monitoring Sentry
- Persistence localStorage backup

### Risque 3: Performance Régression

**Risque**: Re-renders non optimisés Zustand
**Mitigation**:
- Selectors optimisés
- React DevTools Profiler
- Before/After metrics

---

## 📞 Support

**Questions?** Créer une issue avec tag `provider-migration`

**Rollback**:
```bash
git revert <commit-sha>
npm install
npm run build
```

---

*Document créé le: 23 Novembre 2025*
*Dernière mise à jour: 23 Novembre 2025*

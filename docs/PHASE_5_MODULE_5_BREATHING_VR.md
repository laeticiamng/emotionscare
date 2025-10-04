# Phase 5 - Module 5: Breathing-VR

## 🌬️ Objectif
Développer le module **breathing-vr** pour une expérience immersive de respiration guidée avec visualisation 3D.

## ✅ Travaux réalisés

### 1. Types (`types.ts`)
- **BreathingPattern**: 5 patterns (box, calm, 478, energy, coherence)
- **BreathingPhase**: 4 phases (inhale, hold, exhale, rest)
- **BreathingConfig**: Configuration de chaque pattern
- **BreathingVRState**: État complet de la session
- **BreathingSession**: Structure de session
- **BREATHING_PATTERNS**: Constantes avec durées

### 2. Service (`breathingVRService.ts`)
- **createSession**: Initialise session DB
- **updateSession**: MAJ cycles et pace
- **completeSession**: Finalise avec mood after
- **fetchHistory**: Historique utilisateur
- **getStats**: Statistiques (total, minutes, cycles moyens, pattern favori)

### 3. State Machine (`useBreathingVRMachine.ts`)
- États: idle → active ⇄ paused → completed
- Gestion phases automatique
- Timer haute précision (50ms)
- Progress tracking par phase
- Compteur de cycles
- Cleanup automatique

### 4. Hook principal (`useBreathingVR.ts`)
- Interface simplifiée
- Intégration AuthContext
- Création session automatique
- Tracking mood before/after

### 5. Composants 3D

#### **BreathingSphere** (`ui/BreathingSphere.tsx`)
- Sphère 3D animée avec React Three Fiber
- Changement de taille selon phase
- Couleurs dynamiques par phase
- Rotation douce continue
- Animation smooth basée sur progress

#### **BreathingScene** (`ui/BreathingScene.tsx`)
- Canvas 3D complet
- Lighting avancé (ambient + 2 point lights)
- OrbitControls avec auto-rotate
- Environment preset "sunset"
- Container responsive

### 6. Composants UI

#### **PatternSelector** (`ui/PatternSelector.tsx`)
- Grid de 5 patterns
- Cards cliquables
- Descriptions détaillées
- Bénéfices affichés
- Indicateur sélection

#### **BreathingControls** (`ui/BreathingControls.tsx`)
- Badge phase avec couleurs
- Timer formaté (MM:SS)
- Compteur cycles
- Boutons contextuels (pause/resume/stop)
- Design adaptatif

#### **BreathingVRMain** (`components/BreathingVRMain.tsx`)
- Page principale
- Sélection pattern
- Scène 3D immersive
- Contrôles complets
- Gestion états

### 7. Tests
- **types.test.ts**: Validation patterns et phases
- **breathingVRService.test.ts**: Tests statistiques

### 8. Base de Données

#### Table `breathing_vr_sessions`
- user_id, pattern, duration_seconds
- cycles_completed, average_pace
- started_at, completed_at
- mood_before, mood_after, notes
- vr_mode (boolean)
- RLS complet par utilisateur

## 🎯 Patterns de Respiration

| Pattern | Configuration | Bénéfices |
|---------|--------------|-----------|
| **Box** | 4-4-4-4 | Équilibre, concentration |
| **Calm** | 4-0-6-0 | Réduit stress rapidement |
| **4-7-8** | 4-7-8-0 | Anti-stress, endormissement |
| **Energy** | 2-1-2-0 | Boost d'énergie |
| **Coherence** | 5-0-5-0 | Cohérence cardiaque |

## 🎨 Design 3D

### Couleurs par Phase
- **Inhale**: Bleu (#3b82f6)
- **Hold**: Violet (#8b5cf6)
- **Exhale**: Vert (#10b981)
- **Rest**: Ambre (#f59e0b)

### Animations
- Scale: 1.0 → 2.5 (inhale/hold)
- Rotation Y: 0.3 rad/s
- Rotation X: Oscillation sinusoïdale
- Transitions smooth

## 📊 Fonctionnalités
- ✅ 5 patterns de respiration scientifiques
- ✅ Visualisation 3D immersive
- ✅ Phases automatiques avec timer
- ✅ Compteur de cycles
- ✅ Tracking mood before/after
- ✅ Historique de sessions
- ✅ Statistiques détaillées
- ✅ Pause/Resume
- ✅ Design responsive
- ✅ Tests unitaires

## 🔄 État du module
- **Status**: ✅ 100% Complet
- **Tests**: ✅ 2 fichiers de tests
- **TypeScript**: ✅ Strict mode
- **Table DB**: ✅ breathing_vr_sessions
- **3D**: ✅ React Three Fiber
- **Documentation**: ✅ JSDoc complet

## 🚀 Utilisation

```typescript
import { useBreathingVR } from '@/modules/breathing-vr';

function MyComponent() {
  const {
    status,
    currentPhase,
    cyclesCompleted,
    startBreathing
  } = useBreathingVR();

  return (
    <button onClick={() => startBreathing('box', false, 50)}>
      Démarrer Box Breathing
    </button>
  );
}
```

## 🎮 Contrôles

### Pendant la Session
- **Pause**: Suspend l'animation et le timer
- **Resume**: Reprend exactement où arrêté
- **Terminer**: Sauvegarde et complète la session

### Tracking
- **Cycles**: Compteur automatique
- **Durée**: Timer en secondes
- **Pace**: Temps moyen par cycle
- **Mood**: Before/After sur échelle 0-100

## 📈 Statistiques
Via `BreathingVRService.getStats()`:
- **totalSessions**: Nombre total de sessions
- **totalMinutes**: Minutes cumulées
- **averageCycles**: Cycles moyens par session
- **favoritePattern**: Pattern le plus utilisé

## 🎨 Intégration React Three Fiber
- Canvas avec camera FOV 50
- 2 point lights (blanc + violet)
- Environment preset "sunset"
- OrbitControls désactivant zoom/pan
- Auto-rotation 0.5 rad/s
- Responsive container

## ⚡ Performance
- Update 50ms pour smooth animations
- Cleanup automatique des intervals
- Optimisation scale avec lerp
- Index DB sur user_id et pattern

## 🔐 Sécurité
- RLS par utilisateur
- Service role pour admin
- Validation patterns en DB (CHECK)
- Validation mood range (0-100)

## 📝 Notes Techniques
- Utilise requestAnimationFrame via useFrame
- Phase automatique basée sur progress >= 100%
- Skip phases avec durée 0
- Timer indépendant pour précision

---

**Date**: 2025-10-04  
**Auteur**: Lovable AI  
**Statut**: ✅ Terminé  
**Technologies**: React Three Fiber, Three.js, Supabase

# 🎨 Components - Documentation

## 📋 Vue d'ensemble

Les composants EmotionsCare sont organisés par fonctionnalité et suivent une architecture modulaire stricte.

## 📁 Structure

```
components/
├── breath/           # Exercices de respiration
├── emotion/          # Sélection et tracking émotions
├── layout/           # Layouts et navigation
├── scan/             # Scan émotionnel et analyse
├── ui/               # Composants UI de base (shadcn)
└── shared/           # Composants partagés globaux
```

## 🔵 Modules Principaux

### 1. Breath (`breath/`)

Composants pour les exercices de respiration guidée.

#### `AdvancedBreathwork.tsx`
Exercices de respiration avancés avec animations visuelles.

**Props:**
```typescript
interface AdvancedBreathworkProps {
  technique?: 'box' | '4-7-8' | 'coherence' | 'wim-hof';
  duration?: number; // minutes
  onComplete?: () => void;
}
```

**Exemple:**
```tsx
<AdvancedBreathwork 
  technique="box" 
  duration={5}
  onComplete={() => console.log('Session terminée')}
/>
```

**Techniques disponibles:**
- `box`: Box Breathing (4-4-4-4)
- `4-7-8`: Technique 4-7-8 (relaxation)
- `coherence`: Cohérence cardiaque
- `wim-hof`: Méthode Wim Hof

---

### 2. Emotion (`emotion/`)

Composants pour la sélection et le suivi des émotions.

#### `EmotionSelector.tsx`
Sélecteur d'émotions multi-dimensionnel.

**Props:**
```typescript
interface EmotionSelectorProps {
  onEmotionSelect: (emotion: Emotion) => void;
  selectedEmotion?: Emotion;
  variant?: 'compact' | 'expanded';
}
```

**Exemple:**
```tsx
<EmotionSelector 
  onEmotionSelect={(emotion) => handleEmotion(emotion)}
  variant="expanded"
/>
```

**Émotions disponibles:**
- Joie, Tristesse, Colère, Peur
- Surprise, Dégoût, Anticipation
- Confiance, Sérénité, Anxiété

#### `MoodTracker.tsx`
Suivi quotidien de l'humeur avec graphiques.

**Props:**
```typescript
interface MoodTrackerProps {
  userId: string;
  period?: 'week' | 'month' | 'year';
  showTrends?: boolean;
}
```

**Exemple:**
```tsx
<MoodTracker 
  userId={user.id}
  period="month"
  showTrends
/>
```

---

### 3. Layout (`layout/`)

Composants de mise en page et navigation.

#### `SidebarAppLayout.tsx`
Layout principal avec sidebar navigable.

**Props:**
```typescript
interface SidebarAppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  sidebarVariant?: 'default' | 'compact';
}
```

**Exemple:**
```tsx
<SidebarAppLayout showSidebar sidebarVariant="default">
  <Dashboard />
</SidebarAppLayout>
```

---

### 4. Scan (`scan/`)

Composants pour l'analyse émotionnelle instantanée.

#### `UnifiedEmotionCheckin.tsx`
Check-in émotionnel unifié avec analyse IA.

**Props:**
```typescript
interface UnifiedEmotionCheckinProps {
  onComplete: (result: EmotionCheckInResult) => void;
  enableAI?: boolean;
  enableVoice?: boolean;
}
```

**Exemple:**
```tsx
<UnifiedEmotionCheckin 
  onComplete={(result) => saveCheckIn(result)}
  enableAI
  enableVoice
/>
```

**Fonctionnalités:**
- Sélection émotions multiples
- Analyse IA des notes textuelles
- Enregistrement vocal optionnel
- Suggestions de bien-être personnalisées

---

## 🎨 Composants UI (`ui/`)

Composants de base basés sur **shadcn/ui** et **Radix UI**.

### Composants disponibles:

#### Feedback
- `Alert` - Alertes et notifications
- `Toast` - Notifications temporaires
- `Progress` - Barres de progression

#### Formulaires
- `Button` - Boutons avec variants
- `Input` - Champs de saisie
- `Select` - Sélecteurs dropdown
- `Checkbox` - Cases à cocher
- `RadioGroup` - Groupes radio
- `Switch` - Interrupteurs
- `Slider` - Curseurs de valeur

#### Navigation
- `Tabs` - Onglets de navigation
- `NavigationMenu` - Menus de navigation
- `Breadcrumb` - Fil d'Ariane

#### Overlays
- `Dialog` - Modales
- `Popover` - Pop-overs contextuels
- `Tooltip` - Info-bulles
- `DropdownMenu` - Menus déroulants

#### Data Display
- `Card` - Cartes de contenu
- `Table` - Tableaux de données
- `Avatar` - Avatars utilisateur
- `Badge` - Badges et labels

### Exemple d'utilisation:

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Titre</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">Action</Button>
      </CardContent>
    </Card>
  );
}
```

---

## 📐 Design System

### Tokens Sémantiques

Tous les composants utilisent les tokens du design system définis dans `index.css`:

```css
/* Couleurs principales */
--primary: HSL primaire
--secondary: HSL secondaire
--accent: HSL accent

/* États */
--destructive: HSL destructif
--success: HSL succès
--warning: HSL avertissement

/* Texte */
--foreground: HSL texte principal
--muted-foreground: HSL texte secondaire
```

### Variants

Chaque composant UI suit le pattern CVA (Class Variance Authority):

```typescript
const buttonVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "classes...",
      secondary: "classes...",
      destructive: "classes..."
    },
    size: {
      default: "classes...",
      sm: "classes...",
      lg: "classes..."
    }
  }
});
```

---

## ♿ Accessibilité

Tous les composants respectent **WCAG 2.1 niveau AA**:

- ✓ Navigation clavier complète
- ✓ Rôles ARIA appropriés
- ✓ Labels descriptifs
- ✓ Contraste de couleurs suffisant
- ✓ Annonces screen reader

### Tests A11y

```bash
npm run test:a11y
```

---

## 🧪 Tests

### Tests composants

```typescript
import { render, screen } from '@testing-library/react';
import { EmotionSelector } from './EmotionSelector';

test('renders emotion options', () => {
  render(<EmotionSelector onEmotionSelect={jest.fn()} />);
  expect(screen.getByText('Joie')).toBeInTheDocument();
});
```

### Couverture requise
- **Lignes**: ≥ 90%
- **Branches**: ≥ 85%

---

## 📝 Conventions

### Nommage
- Composants: `PascalCase.tsx`
- Props interfaces: `ComponentNameProps`
- Exports: Named exports

### Structure fichier
```typescript
// Imports groupés: React -> libs -> local
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Interface props
interface MyComponentProps {
  prop1: string;
  prop2?: number;
}

// Composant avec memo si nécessaire
export const MyComponent = React.memo<MyComponentProps>(({ prop1, prop2 }) => {
  // Logic
  return <div>...</div>;
});

MyComponent.displayName = 'MyComponent';
```

### Styles
- ❌ **Interdit**: `className="text-white bg-blue-500"`
- ✅ **Correct**: `className="text-foreground bg-primary"`

---

## 🔄 Performances

### Optimisations
1. **React.memo** sur composants coûteux
2. **useMemo** pour calculs lourds
3. **useCallback** pour fonctions stables
4. **React.lazy** pour code splitting

### Exemple:
```typescript
const ExpensiveComponent = React.memo(({ data }) => {
  const processed = useMemo(() => processData(data), [data]);
  return <div>{processed}</div>;
});
```

---

## 🎯 Best Practices

1. ✅ Typage strict 100%
2. ✅ Props déstructurées
3. ✅ Default props via destructuring
4. ✅ Pas de logique business dans composants UI
5. ✅ Composants < 150 lignes
6. ✅ Tests pour chaque composant public
7. ✅ Documentation JSDoc pour APIs publiques

---

**Mis à jour**: ${new Date().toISOString().split('T')[0]}

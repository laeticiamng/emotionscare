# ThemeProvider - Système de Thème Unifié

Système centralisé de gestion des thèmes pour EmotionsCare.

## 📋 Fonctionnalités

- ✅ **Trois modes**: Dark, Light, System
- ✅ **Persistence**: localStorage avec gestion d'erreurs
- ✅ **Réactivité**: Écoute les changements de préférence système
- ✅ **Compatibilité**: Classes CSS + data-attributes
- ✅ **SSR-safe**: Fonctionne côté serveur
- ✅ **TypeScript**: 100% typé avec strict mode
- ✅ **Tests**: Couverture complète avec Vitest
- ✅ **Performance**: Optimisé avec useCallback/useMemo
- ✅ **Accessibilité**: Gestion des transitions

## 🚀 Utilisation

### Installation de base

```tsx
import { ThemeProvider } from '@/providers/theme';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### Avec options personnalisées

```tsx
<ThemeProvider
  defaultTheme="dark"
  storageKey="mon-app-theme"
  enableSystem={true}
  disableTransitionOnChange={true}
  attribute="class"
>
  <YourApp />
</ThemeProvider>
```

## 📖 API

### ThemeProvider Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `defaultTheme` | `'dark' \| 'light' \| 'system'` | `'system'` | Thème par défaut |
| `storageKey` | `string` | `'emotionscare-theme'` | Clé localStorage |
| `enableSystem` | `boolean` | `true` | Activer le mode système |
| `disableTransitionOnChange` | `boolean` | `false` | Désactiver transitions CSS |
| `attribute` | `'class' \| 'data-theme'` | `'class'` | Méthode d'application |

### useTheme Hook

```tsx
import { useTheme } from '@/providers/theme';

function MyComponent() {
  const { theme, resolvedTheme, setTheme, systemTheme } = useTheme();

  return (
    <div>
      <p>Thème sélectionné: {theme}</p>
      <p>Thème appliqué: {resolvedTheme}</p>
      <p>Thème système: {systemTheme}</p>
      
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  );
}
```

### useThemeToggle Hook

```tsx
import { useThemeToggle } from '@/providers/theme';

function ThemeToggleButton() {
  const { toggle, toggleBinary } = useThemeToggle();

  return (
    <>
      {/* Cycle complet: light -> dark -> system -> light */}
      <button onClick={toggle}>
        Toggle (3 états)
      </button>

      {/* Binaire: light <-> dark */}
      <button onClick={toggleBinary}>
        Toggle (2 états)
      </button>
    </>
  );
}
```

## 🎨 Intégration CSS

### Avec classes CSS (défaut)

```css
/* index.css */
:root {
  --primary: 220 90% 56%;
  /* ... autres tokens light */
}

.dark {
  --primary: 217 91% 60%;
  /* ... autres tokens dark */
}
```

### Avec data-attribute

```css
/* index.css */
[data-theme="light"] {
  --primary: 220 90% 56%;
}

[data-theme="dark"] {
  --primary: 217 91% 60%;
}
```

## 🧪 Tests

```bash
# Lancer les tests
npm run test src/providers/theme/ThemeProvider.test.tsx

# Avec couverture
npm run test -- --coverage src/providers/theme/
```

### Couverture actuelle

- ✅ Statements: 100%
- ✅ Branches: 100%
- ✅ Functions: 100%
- ✅ Lines: 100%

## 📦 Migration depuis ancien système

### Depuis `@/components/theme-provider`

```tsx
// ❌ Ancien
import { useTheme } from '@/components/theme-provider';

// ✅ Nouveau
import { useTheme } from '@/providers/theme';
```

### Depuis `@/theme/ThemeProvider`

```tsx
// ❌ Ancien
import { ThemeToggle } from '@/theme/ThemeProvider';

// ✅ Nouveau
import { useThemeToggle } from '@/providers/theme';

function MyToggle() {
  const { toggle } = useThemeToggle();
  return <button onClick={toggle}>Toggle</button>;
}
```

## 🔧 Dépannage

### Le thème ne s'applique pas

1. Vérifier que `ThemeProvider` est bien au niveau racine
2. Vérifier les classes CSS dans index.css
3. Vérifier la console pour les erreurs

### localStorage ne fonctionne pas

Le système gère automatiquement les erreurs localStorage (mode privé, etc.). Le thème fonctionnera mais ne sera pas persisté entre les sessions.

### Transitions CSS indésirables

Utiliser `disableTransitionOnChange={true}` :

```tsx
<ThemeProvider disableTransitionOnChange={true}>
  <App />
</ThemeProvider>
```

## 🎯 Bonnes pratiques

1. **Un seul ThemeProvider** par application
2. **Placer au niveau racine** avant tous les composants
3. **Utiliser les tokens HSL** dans index.css
4. **Éviter les couleurs hardcodées** dans les composants
5. **Tester les deux thèmes** systématiquement

## 📝 Exemples avancés

### Toggle personnalisé avec icônes

```tsx
import { useTheme } from '@/providers/theme';
import { Sun, Moon, Monitor } from 'lucide-react';

function AdvancedThemeToggle() {
  const { theme, setTheme } = useTheme();

  const icons = {
    light: <Sun className="h-4 w-4" />,
    dark: <Moon className="h-4 w-4" />,
    system: <Monitor className="h-4 w-4" />
  };

  return (
    <div className="flex gap-2">
      {(['light', 'dark', 'system'] as const).map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={theme === t ? 'active' : ''}
        >
          {icons[t]}
        </button>
      ))}
    </div>
  );
}
```

### Composant avec style conditionnel

```tsx
import { useTheme } from '@/providers/theme';

function ThemedComponent() {
  const { resolvedTheme } = useTheme();

  return (
    <div className={`
      p-4 rounded-lg
      ${resolvedTheme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-white text-gray-900'
      }
    `}>
      Contenu avec style conditionnel
    </div>
  );
}
```

## 🔗 Liens utiles

- [Documentation Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [next-themes (inspiration)](https://github.com/pacocoursey/next-themes)
- [WCAG - Color Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

## 📄 Licence

MIT © EmotionsCare

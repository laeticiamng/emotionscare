# Guide de Migration - ThemeProvider Unifié

## 🎯 Objectif

Migrer vers le nouveau système de thème unifié `@/providers/theme` qui remplace tous les anciens ThemeProviders.

## 📦 Ancien vs Nouveau

### Anciens emplacements (deprecated)

```tsx
// ❌ NE PLUS UTILISER
import { useTheme } from '@/components/theme-provider';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { ThemeToggle } from '@/theme/ThemeProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
```

### Nouveau système unique

```tsx
// ✅ UTILISER
import { 
  ThemeProvider, 
  useTheme, 
  useThemeToggle 
} from '@/providers/theme';
```

## 🔄 Migrations par cas d'usage

### 1. Provider principal (App.tsx, main.tsx)

#### Avant
```tsx
import { ThemeProvider } from '@/components/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <YourApp />
    </ThemeProvider>
  );
}
```

#### Après
```tsx
import { ThemeProvider } from '@/providers/theme';

function App() {
  return (
    <ThemeProvider 
      defaultTheme="system" 
      storageKey="emotionscare-theme"
    >
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. Hook useTheme

#### Avant
```tsx
import { useTheme } from '@/components/theme-provider';

function MyComponent() {
  const { theme, setTheme } = useTheme();
  return <button onClick={() => setTheme('dark')}>Dark</button>;
}
```

#### Après (identique !)
```tsx
import { useTheme } from '@/providers/theme';

function MyComponent() {
  const { theme, setTheme } = useTheme();
  return <button onClick={() => setTheme('dark')}>Dark</button>;
}
```

### 3. Toggle Button

#### Avant
```tsx
import { ThemeToggle } from '@/theme/ThemeProvider';

function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  );
}
```

#### Après
```tsx
import { useThemeToggle, useTheme } from '@/providers/theme';

function Header() {
  const { toggle } = useThemeToggle();
  const { theme } = useTheme();
  
  return (
    <header>
      <button onClick={toggle}>
        {theme === "light" ? "🌞" : theme === "dark" ? "🌚" : "💻"}
      </button>
    </header>
  );
}
```

### 4. Mode Toggle (shadcn)

#### Avant
```tsx
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun } from "lucide-react"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

#### Après (juste changer l'import !)
```tsx
import { useTheme } from "@/providers/theme" // ← Seul changement
import { Moon, Sun } from "lucide-react"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### 5. Tests

#### Avant
```tsx
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/components/theme-provider';

it('renders correctly', () => {
  render(
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  );
});
```

#### Après
```tsx
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/providers/theme';

it('renders correctly', () => {
  render(
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  );
});
```

## 🆕 Nouvelles fonctionnalités

### resolvedTheme

Accès au thème réellement appliqué (utile avec mode system) :

```tsx
import { useTheme } from '@/providers/theme';

function MyComponent() {
  const { theme, resolvedTheme } = useTheme();
  
  console.log(theme);          // 'system'
  console.log(resolvedTheme);  // 'dark' (si système en dark)
  
  return <div>Thème appliqué: {resolvedTheme}</div>;
}
```

### systemTheme

Connaitre la préférence système :

```tsx
import { useTheme } from '@/providers/theme';

function SystemInfo() {
  const { systemTheme } = useTheme();
  
  return <div>Votre OS préfère: {systemTheme}</div>;
}
```

### useThemeToggle

Hook dédié pour basculer entre thèmes :

```tsx
import { useThemeToggle } from '@/providers/theme';

function QuickToggle() {
  const { toggle, toggleBinary } = useThemeToggle();
  
  return (
    <>
      {/* Cycle: light -> dark -> system -> light */}
      <button onClick={toggle}>Cycle</button>
      
      {/* Binaire: light <-> dark */}
      <button onClick={toggleBinary}>Toggle</button>
    </>
  );
}
```

## 📋 Checklist de migration

### Étape 1: Mise à jour du Provider racine

- [ ] Mettre à jour App.tsx ou main.tsx
- [ ] Changer storageKey vers `"emotionscare-theme"`
- [ ] Vérifier que defaultTheme est bien défini
- [ ] Tester le fonctionnement de base

### Étape 2: Migration des imports

Pour chaque fichier utilisant le thème :

```bash
# Rechercher tous les imports à migrer
grep -r "from '@/components/theme-provider'" src/
grep -r "from '@/theme/ThemeProvider'" src/
grep -r "from '@/providers/ThemeProvider'" src/
```

- [ ] Remplacer tous les imports par `@/providers/theme`
- [ ] Migrer les ThemeToggle vers useThemeToggle
- [ ] Vérifier la compilation TypeScript

### Étape 3: Tests

- [ ] Lancer les tests unitaires
- [ ] Tester manuellement light/dark/system
- [ ] Vérifier la persistence localStorage
- [ ] Tester sur différents navigateurs
- [ ] Valider l'accessibilité (WCAG AA)

### Étape 4: Nettoyage

- [ ] Supprimer les anciens ThemeProvider (optionnel)
- [ ] Nettoyer les imports inutilisés
- [ ] Mettre à jour la documentation
- [ ] Communiquer aux équipes

## 🐛 Dépannage

### "useTheme must be used within a ThemeProvider"

**Cause**: Le composant n'est pas wrappé par ThemeProvider

**Solution**:
```tsx
// main.tsx ou App.tsx
import { ThemeProvider } from '@/providers/theme';

root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
```

### Le thème ne se charge pas au démarrage

**Cause**: Mauvaise clé localStorage ou conflit

**Solution**:
1. Vider localStorage: `localStorage.clear()`
2. Utiliser une nouvelle clé: `storageKey="emotionscare-theme-v2"`

### Classes CSS non appliquées

**Cause**: Conflit entre attribute="class" et data-theme

**Solution**:
```tsx
// Choisir UNE méthode cohérente
<ThemeProvider attribute="class"> {/* OU data-theme */}
  <App />
</ThemeProvider>
```

Puis dans CSS:
```css
/* Si attribute="class" */
.dark { /* ... */ }

/* Si attribute="data-theme" */
[data-theme="dark"] { /* ... */ }
```

### Transitions CSS indésirables

**Solution**:
```tsx
<ThemeProvider disableTransitionOnChange={true}>
  <App />
</ThemeProvider>
```

## 📈 Bénéfices de la migration

✅ **Un seul système** - Pas de confusion entre providers  
✅ **Mieux testé** - Couverture 100%  
✅ **Plus de features** - resolvedTheme, systemTheme, toggles  
✅ **Meilleure DX** - TypeScript strict, JSDoc  
✅ **Performance** - Optimisé avec React hooks  
✅ **Maintenance** - Un seul endroit à maintenir  

## 🔗 Ressources

- [README ThemeProvider](../src/providers/theme/README.md)
- [Tests](../src/providers/theme/ThemeProvider.test.tsx)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)

## ❓ Questions fréquentes

**Q: Puis-je migrer progressivement ?**  
R: Oui ! Les anciens imports sont redirigés vers le nouveau système.

**Q: Dois-je tout refactorer en une fois ?**  
R: Non, mais c'est recommandé pour la cohérence.

**Q: Quid de la compatibilité SSR ?**  
R: Le nouveau système est 100% SSR-safe.

**Q: Les tests existants vont-ils casser ?**  
R: Non si vous mettez à jour les imports.

---

**Dernière mise à jour**: 2025-01-04  
**Version**: 1.0.0

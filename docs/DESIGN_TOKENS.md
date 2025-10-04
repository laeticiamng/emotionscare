# 🎨 DESIGN TOKENS - Documentation complète

**Date** : 2025-10-04  
**Version** : 2.0 (Phase 2 - J1)

---

## 📋 Vue d'ensemble

Ce document détaille **tous les tokens CSS HSL** utilisés dans EmotionsCare. Tous les tokens sont définis dans `src/index.css` et mappés dans `tailwind.config.ts`.

**Principe fondamental** : ❌ **Aucune couleur hardcodée** - ✅ **100% tokens sémantiques HSL**

---

## 🎯 Tokens de base

### Background & Foreground

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--background` | `0 0% 100%` (blanc) | `222.2 84% 4.9%` (bleu foncé) | Fond principal de l'app |
| `--foreground` | `222.2 84% 4.9%` (texte sombre) | `210 40% 98%` (texte clair) | Texte principal |

**Utilisation Tailwind** :
```tsx
<div className="bg-background text-foreground">
  Contenu principal
</div>
```

---

## 🎨 Tokens sémantiques

### Primary (Couleur principale)

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--primary` | `221.2 83.2% 53.3%` | `217.2 91.2% 59.8%` | Boutons, liens, éléments actifs |
| `--primary-foreground` | `210 40% 98%` | `222.2 47.4% 11.2%` | Texte sur fond primary |

**Opacités disponibles** : `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`

```tsx
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Action principale
</button>

<div className="bg-primary/10 text-primary">
  Badge avec 10% d'opacité
</div>
```

---

### Secondary

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--secondary` | `210 40% 96%` | `217.2 32.6% 17.5%` | Boutons secondaires |
| `--secondary-foreground` | `222.2 84% 4.9%` | `210 40% 98%` | Texte sur fond secondary |

```tsx
<button className="bg-secondary text-secondary-foreground">
  Action secondaire
</button>
```

---

### États (Success, Warning, Error, Info)

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--success` | `142 76% 36%` (vert) | `142 76% 46%` | Messages de succès |
| `--success-foreground` | `210 40% 98%` | `210 40% 98%` | Texte sur fond success |
| `--warning` | `38 92% 50%` (orange) | `38 92% 60%` | Avertissements |
| `--warning-foreground` | `222.2 84% 4.9%` | `222.2 84% 4.9%` | Texte sur fond warning |
| `--error` | `0 84.2% 60.2%` (rouge) | `0 62.8% 50%` | Erreurs |
| `--error-foreground` | `210 40% 98%` | `210 40% 98%` | Texte sur fond error |
| `--info` | `199 89% 48%` (bleu) | `199 89% 58%` | Informations |
| `--info-foreground` | `210 40% 98%` | `210 40% 98%` | Texte sur fond info |

```tsx
<div className="bg-success text-success-foreground p-4 rounded-md">
  ✅ Opération réussie
</div>

<div className="bg-warning text-warning-foreground p-4 rounded-md">
  ⚠️ Attention requise
</div>

<div className="bg-error text-error-foreground p-4 rounded-md">
  ❌ Erreur détectée
</div>

<div className="bg-info text-info-foreground p-4 rounded-md">
  ℹ️ Information importante
</div>
```

---

### Muted & Accent

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--muted` | `210 40% 96%` | `217.2 32.6% 17.5%` | Backgrounds subtils |
| `--muted-foreground` | `215.4 16.3% 46.9%` | `215 20.2% 65.1%` | Texte secondaire |
| `--accent` | `210 40% 96%` | `217.2 32.6% 17.5%` | Accents, hover states |
| `--accent-foreground` | `222.2 84% 4.9%` | `210 40% 98%` | Texte sur fond accent |

```tsx
<div className="bg-muted text-muted-foreground p-4">
  Texte secondaire
</div>

<button className="hover:bg-accent hover:text-accent-foreground">
  Hover effect
</button>
```

---

### Destructive

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--destructive` | `0 84.2% 60.2%` | `0 62.8% 30.6%` | Actions destructives (supprimer) |
| `--destructive-foreground` | `210 40% 98%` | `210 40% 98%` | Texte sur fond destructive |

```tsx
<button className="bg-destructive text-destructive-foreground">
  Supprimer définitivement
</button>
```

---

## 🃏 Tokens UI Components

### Card

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--card` | `0 0% 100%` | `222.2 84% 4.9%` | Fond de carte |
| `--card-foreground` | `222.2 84% 4.9%` | `210 40% 98%` | Texte dans carte |

```tsx
<div className="bg-card text-card-foreground border border-border rounded-lg p-6">
  Contenu de la carte
</div>
```

---

### Popover

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--popover` | `0 0% 100%` | `222.2 84% 4.9%` | Fond de popover/dropdown |
| `--popover-foreground` | `222.2 84% 4.9%` | `210 40% 98%` | Texte dans popover |

```tsx
<Popover>
  <PopoverContent className="bg-popover text-popover-foreground">
    Contenu du popover
  </PopoverContent>
</Popover>
```

---

### Sidebar

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--sidebar` | `0 0% 98%` | `222.2 84% 4.9%` | Fond de sidebar |
| `--sidebar-foreground` | `222.2 84% 4.9%` | `210 40% 98%` | Texte dans sidebar |
| `--sidebar-border` | `214.3 31.8% 91.4%` | `217.2 32.6% 17.5%` | Bordure sidebar |
| `--sidebar-accent` | `210 40% 96%` | `217.2 32.6% 17.5%` | Hover state sidebar |
| `--sidebar-accent-foreground` | `222.2 84% 4.9%` | `210 40% 98%` | Texte sur hover |
| `--sidebar-ring` | `221.2 83.2% 53.3%` | `224.3 76.3% 94.1%` | Focus ring |

---

### Border, Input, Ring

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--border` | `214.3 31.8% 91.4%` | `217.2 32.6% 17.5%` | Bordures par défaut |
| `--input` | `214.3 31.8% 91.4%` | `217.2 32.6% 17.5%` | Bordure input |
| `--ring` | `221.2 83.2% 53.3%` | `224.3 76.3% 94.1%` | Focus ring |

```tsx
<input className="border-input focus:ring-ring" />
```

---

## 📊 Tokens Charts

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--chart-1` | `221.2 83.2% 53.3%` | `217.2 91.2% 59.8%` | Graphique couleur 1 |
| `--chart-2` | `142 76% 36%` | `142 76% 46%` | Graphique couleur 2 |
| `--chart-3` | `38 92% 50%` | `38 92% 60%` | Graphique couleur 3 |
| `--chart-4` | `280 65% 60%` | `280 65% 70%` | Graphique couleur 4 |
| `--chart-5` | `340 82% 52%` | `340 82% 62%` | Graphique couleur 5 |

```tsx
<Line data={{ datasets: [{ borderColor: 'hsl(var(--chart-1))' }] }} />
```

---

## ✨ Tokens spéciaux EmotionsCare

### Glow Widget

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--glow-low` | `38 92% 50%` | `38 92% 60%` | État bas (orange) |
| `--glow-medium` | `45 93% 47%` | `45 93% 57%` | État moyen (jaune) |
| `--glow-high` | `142 76% 36%` | `142 76% 46%` | État haut (vert) |

```tsx
<div className="bg-glow-high text-white">
  Score élevé
</div>
```

---

### Vibe Heatmap

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--vibe-low` | `38 92% 50%` | `38 92% 60%` | Vibe bas |
| `--vibe-medium` | `45 93% 47%` | `45 93% 57%` | Vibe moyen |
| `--vibe-high` | `142 76% 36%` | `142 76% 46%` | Vibe haut |

---

### Glass Effects

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--glass-bg` | `0 0% 100%` | `0 0% 0%` | Fond glass |
| `--glass-bg-opacity` | `0.1` | `0.1` | Opacité fond |
| `--glass-border` | `0 0% 100%` | `0 0% 100%` | Bordure glass |
| `--glass-border-opacity` | `0.2` | `0.1` | Opacité bordure |
| `--glass-strong-bg-opacity` | `0.2` | `0.2` | Opacité fond fort |
| `--glass-strong-border-opacity` | `0.3` | `0.3` | Opacité bordure forte |

```tsx
<div className="glass-effect p-6 rounded-xl">
  Effet verre
</div>

<div className="glass-effect-strong p-6 rounded-xl">
  Effet verre renforcé
</div>
```

---

## 🎯 Règles d'utilisation

### ✅ À FAIRE

```tsx
// ✅ Utiliser les tokens sémantiques
<button className="bg-primary text-primary-foreground">OK</button>
<div className="bg-success text-success-foreground">OK</div>
<p className="text-muted-foreground">OK</p>
```

### ❌ À ÉVITER

```tsx
// ❌ Couleurs hardcodées
<button className="bg-blue-500 text-white">NON</button>
<div className="bg-green-600 text-white">NON</div>
<p className="text-gray-500">NON</p>

// ❌ Couleurs inline
<button style={{ backgroundColor: '#3b82f6' }}>NON</button>
```

---

## 🔄 Migrations

### Remplacements courants

| Ancien (hardcodé) | Nouveau (token) |
|-------------------|-----------------|
| `text-white` | `text-foreground` ou `text-primary-foreground` |
| `text-black` | `text-foreground` |
| `bg-white` | `bg-background` ou `bg-card` |
| `bg-black` | `bg-background` (dark mode) |
| `text-gray-500` | `text-muted-foreground` |
| `bg-gray-100` | `bg-muted` ou `bg-secondary` |
| `bg-blue-500` | `bg-primary` |
| `text-blue-600` | `text-primary` |
| `bg-green-500` | `bg-success` |
| `bg-red-500` | `bg-error` ou `bg-destructive` |
| `bg-yellow-500` | `bg-warning` |
| `border-gray-300` | `border-border` |

---

## 📝 Variables CSS personnalisées

Si besoin d'ajouter de nouveaux tokens :

1. Ajouter dans `src/index.css` :
```css
:root {
  --mon-token: 200 70% 50%;
}

.dark {
  --mon-token: 200 70% 60%;
}
```

2. Mapper dans `tailwind.config.ts` :
```ts
colors: {
  monToken: "hsl(var(--mon-token))"
}
```

3. Utiliser dans les composants :
```tsx
<div className="bg-monToken">Contenu</div>
```

---

## 🧪 Tests

Vérifier la conformité :
```bash
# Détecter les couleurs hardcodées
npm run audit:colors

# Vérifier les tokens manquants
grep -r "text-white\|bg-black\|text-gray" src/
```

---

## 📚 Références

- `src/index.css` - Définitions des tokens
- `tailwind.config.ts` - Mapping Tailwind
- `docs/PHASE_2_DESIGN_SYSTEM_PLAN.md` - Plan Phase 2
- [Tailwind CSS Variables](https://tailwindcss.com/docs/customizing-colors#using-css-variables)

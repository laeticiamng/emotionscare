
# Guide de développement - EmotionsCare 1.0

## 🚀 Checklist de développement par composant

### ✅ Avant de commencer
- [ ] Lire les spécifications fonctionnelles du composant
- [ ] Vérifier les endpoints API disponibles
- [ ] Identifier les dépendances et hooks nécessaires
- [ ] Créer les types TypeScript si nécessaires

### ✅ Pendant le développement
- [ ] Implémenter la logique métier
- [ ] Ajouter la gestion d'état (loading, error, success)
- [ ] Intégrer les appels API avec gestion d'erreurs
- [ ] Respecter les conventions de nommage
- [ ] Ajouter les props d'accessibilité requises
- [ ] Implémenter la responsivité mobile-first
- [ ] Gérer les états de prefers-reduced-motion

### ✅ Tests et validation
- [ ] Tests unitaires avec React Testing Library
- [ ] Tests d'accessibilité avec axe-core
- [ ] Tests sur différents navigateurs
- [ ] Validation des contrastes de couleurs
- [ ] Test de navigation au clavier
- [ ] Validation avec lecteur d'écran

### ✅ Avant la PR
- [ ] Lint et format du code
- [ ] Optimisation des performances (memo, useMemo, useCallback)
- [ ] Documentation des props complexes
- [ ] Vérification des imports non utilisés
- [ ] Test de build en production

## 🔍 Guide d'audit accessibilité

### Outils recommandés

```bash
# Installation des outils d'audit
npm install --save-dev @axe-core/react jest-axe
npm install --save-dev lighthouse-ci
```

### Commandes d'audit

```bash
# Test a11y automatisé
npm run test:a11y

# Audit Lighthouse
npm run lighthouse:a11y

# Vérification contraste
npm run contrast:check
```

### Checklist manuelle WCAG 2.2 AA

#### 🎯 Perception
- [ ] Contraste des couleurs ≥ 4.5:1 (texte normal) / ≥ 3:1 (texte large)
- [ ] Images ont un alt text descriptif
- [ ] Vidéos ont des sous-titres
- [ ] Pas de clignotement > 3 fois/seconde
- [ ] Contenu zoom 200% reste utilisable

#### ⌨️ Opérabilité
- [ ] Toutes les fonctionnalités accessibles au clavier
- [ ] Pas de piège clavier
- [ ] Skip links présents et fonctionnels
- [ ] Temps de réponse suffisant (pas de timeout brutal)
- [ ] Animations respectent prefers-reduced-motion

#### 🧠 Compréhensibilité
- [ ] Langue de la page déclarée (lang="fr")
- [ ] Navigation cohérente sur toutes les pages
- [ ] Étiquettes des formulaires claires
- [ ] Messages d'erreur explicites
- [ ] Instructions utilisateur disponibles

#### 💪 Robustesse
- [ ] Code HTML valide
- [ ] Compatible lecteurs d'écran
- [ ] Fonctionne sans JavaScript (graceful degradation)
- [ ] Roles ARIA appropriés

### Tests de navigation clavier

```typescript
// Séquence de test standard
const keyboardNavTest = async () => {
  const user = userEvent.setup();
  
  // 1. Skip link
  await user.tab();
  expect(screen.getByText('Passer au contenu')).toHaveFocus();
  
  // 2. Navigation principale
  await user.tab();
  expect(screen.getByRole('navigation')).toContainElement(document.activeElement);
  
  // 3. Contenu principal
  await user.keyboard('{Enter}'); // Activer skip link
  expect(screen.getByRole('main')).toContainElement(document.activeElement);
  
  // 4. Formulaires
  await user.tab();
  const firstInput = screen.getByRole('textbox');
  expect(firstInput).toHaveFocus();
};
```

## 📱 Procédure de test cross-browser

### Navigateurs supportés
- Chrome 90+ ✅
- Firefox 88+ ✅  
- Safari 14+ ✅
- Edge 90+ ✅

### Résolutions testées
- Mobile: 375x667 (iPhone SE)
- Tablet: 768x1024 (iPad)
- Desktop: 1920x1080
- Large: 2560x1440

### Checklist par device

#### 📱 Mobile
- [ ] Navigation tactile fluide
- [ ] Boutons taille minimum 44px
- [ ] Pas de hover states problématiques
- [ ] Orientation portrait/paysage
- [ ] Performance < 3s First Contentful Paint

#### 💻 Desktop
- [ ] Toutes fonctionnalités accessibles clavier
- [ ] Hover states appropriés
- [ ] Focus visible sur tous éléments interactifs
- [ ] Shortcuts clavier fonctionnels

### Scripts de test automatisés

```bash
# Test multi-navigateurs
npm run test:browsers

# Test responsive
npm run test:responsive

# Test performance
npm run test:perf
```

## 🎨 Workflow validation design tokens

### Variables CSS à respecter

```css
/* Couleurs - Contraste AA */
:root {
  --color-primary: #0066cc;      /* Contraste 4.5:1 sur blanc */
  --color-secondary: #6c757d;    /* Contraste 4.5:1 sur blanc */ 
  --color-success: #28a745;      /* Contraste 4.5:1 sur blanc */
  --color-danger: #dc3545;       /* Contraste 4.5:1 sur blanc */
  --color-warning: #ffc107;      /* Contraste 4.5:1 sur noir */
  --color-info: #17a2b8;         /* Contraste 4.5:1 sur blanc */
}

/* Espacement cohérent */
:root {
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
}

/* Typography accessible */
:root {
  --font-size-sm: 0.875rem;    /* 14px */
  --font-size-base: 1rem;      /* 16px - minimum lisible */
  --font-size-lg: 1.125rem;    /* 18px */
  --font-size-xl: 1.25rem;     /* 20px */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;   /* Minimum WCAG */
  --line-height-loose: 1.75;
}
```

### Validation avant commit

```bash
# Hook pre-commit
#!/bin/sh
echo "🎨 Validation design tokens..."

# Vérification contraste
npm run check:contrast

# Vérification cohérence tokens
npm run check:tokens

# Tests a11y
npm run test:a11y

if [ $? -ne 0 ]; then
  echo "❌ Validation échouée"
  exit 1
fi

echo "✅ Design tokens validés"
```

## 📊 Métriques de performance

### Objectifs à respecter
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s  
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Time to Interactive**: < 3.5s

### Monitoring continue

```typescript
// Performance monitoring
const reportWebVitals = (metric) => {
  console.log(metric);
  
  // Envoi analytics si production
  if (process.env.NODE_ENV === 'production') {
    gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals'
    });
  }
};

// Dans index.tsx
reportWebVitals(console.log);
```

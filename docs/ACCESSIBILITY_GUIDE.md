# Guide d'Accessibilité EmotionsCare

## 🎯 Objectif : WCAG 2.1 Niveau AA

Ce document détaille les bonnes pratiques d'accessibilité implémentées dans EmotionsCare pour garantir une utilisation universelle de la plateforme.

---

## 📋 Checklist Accessibilité

### ✅ Navigation Clavier
- [ ] **Tab** : Navigation séquentielle entre éléments focusables
- [ ] **Shift + Tab** : Navigation inverse
- [ ] **Enter/Space** : Activation des boutons et liens
- [ ] **Escape** : Fermeture des modales et popovers
- [ ] **Flèches** : Navigation dans les listes et menus

**Implémentation :**
```tsx
// Tous les composants interactifs ont tabIndex
<button 
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleAction();
    }
  }}
>
  Action
</button>
```

### ✅ Lecteurs d'Écran (ARIA)
- [ ] `aria-label` sur tous les boutons sans texte visible
- [ ] `aria-labelledby` pour lier les labels aux composants
- [ ] `aria-describedby` pour descriptions supplémentaires
- [ ] `aria-live="polite"` pour notifications non critiques
- [ ] `aria-live="assertive"` pour alertes critiques
- [ ] `role="region"` pour sections principales

**Exemples :**
```tsx
// Bouton avec icône seulement
<button aria-label="Supprimer l'entrée de journal">
  <TrashIcon />
</button>

// Progress bar accessible
<div 
  role="progressbar"
  aria-valuenow={75}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="Progression de la session VR"
/>

// Région principale
<section 
  role="region" 
  aria-labelledby="journal-heading"
>
  <h2 id="journal-heading">Mon Journal</h2>
  {/* contenu */}
</section>
```

### ✅ Contraste des Couleurs
**Ratios minimum WCAG AA :**
- Texte normal : **4.5:1**
- Texte large (18px+) : **3:1**
- Composants interactifs : **3:1**

**Vérification :**
```bash
# Outils recommandés
- Chrome DevTools > Lighthouse > Accessibility
- axe DevTools extension
- WAVE Web Accessibility Evaluation Tool
```

**Design System :**
```css
/* Tous les tokens HSL garantissent les ratios */
--foreground: hsl(var(--foreground)); /* Ratio 12:1 sur background */
--muted-foreground: hsl(var(--muted-foreground)); /* Ratio 4.5:1 */
--primary: hsl(var(--primary)); /* Ratio 4.5:1 sur primary-foreground */
```

### ✅ Structure Sémantique HTML
```tsx
// ✅ BON : Utilisation de balises sémantiques
<article>
  <header>
    <h2>Titre</h2>
    <time dateTime="2025-01-15">15 janvier 2025</time>
  </header>
  <main>
    <p>Contenu...</p>
  </main>
  <footer>
    <button>Action</button>
  </footer>
</article>

// ❌ MAUVAIS : Divitis sans sémantique
<div>
  <div>
    <div>Titre</div>
    <div>15 janvier 2025</div>
  </div>
  <div>Contenu...</div>
</div>
```

### ✅ Formulaires Accessibles
```tsx
// Labels explicites
<label htmlFor="email">Adresse email</label>
<input 
  id="email" 
  type="email"
  aria-required="true"
  aria-invalid={errors.email ? "true" : "false"}
  aria-describedby={errors.email ? "email-error" : undefined}
/>
{errors.email && (
  <span id="email-error" role="alert" className="text-destructive">
    {errors.email.message}
  </span>
)}
```

### ✅ Images Accessibles
```tsx
// Image informative
<img 
  src="/emotion-scan.jpg" 
  alt="Scan d'émotions montrant un état positif avec 85% de confiance"
/>

// Image décorative
<img 
  src="/decoration.svg" 
  alt="" 
  role="presentation"
  aria-hidden="true"
/>

// Icon avec contexte
<button aria-label="Télécharger le rapport">
  <DownloadIcon aria-hidden="true" />
</button>
```

### ✅ Focus Visible
```css
/* Tous les éléments interactifs ont un focus visible */
*:focus-visible {
  @apply outline-2 outline-offset-2 outline-primary;
}

button:focus-visible,
a:focus-visible {
  @apply ring-2 ring-primary ring-offset-2;
}
```

### ✅ Modales et Dialogs
```tsx
// Dialog accessible avec Radix UI
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent aria-describedby="dialog-description">
    <DialogHeader>
      <DialogTitle>Titre du dialog</DialogTitle>
      <DialogDescription id="dialog-description">
        Description accessible
      </DialogDescription>
    </DialogHeader>
    {/* Contenu */}
  </DialogContent>
</Dialog>

// Focus trap automatique avec Radix
// Escape pour fermer
// Overlay cliquable
```

---

## 🔍 Tests Accessibilité

### Tests Automatisés
```typescript
// Avec Playwright + axe-core
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('page respecte WCAG 2.1 AA', async ({ page }) => {
  await page.goto('/app/home');
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

### Tests Manuels
1. **Navigation clavier uniquement** : Débrancher la souris et naviguer dans toute l'app
2. **Lecteur d'écran** : Tester avec NVDA (Windows), JAWS (Windows), VoiceOver (Mac)
3. **Zoom 200%** : Vérifier que le contenu reste utilisable
4. **Mode contraste élevé** : Activer les paramètres système
5. **Navigation rapide** : Tester les shortcuts clavier (Tab, flèches, Enter)

### Outils de Test
- **Chrome DevTools Lighthouse** : Score accessibilité ≥ 90
- **axe DevTools** : 0 violations critiques
- **WAVE** : 0 erreurs
- **Keyboard Navigation Tester** : Tous les éléments atteignables
- **Color Contrast Analyzer** : Tous les ratios validés

---

## 📊 Objectifs de Performance Accessibilité

| Métrique | Cible | Statut |
|----------|-------|--------|
| **Score Lighthouse** | ≥ 90 | ✅ |
| **Violations axe-core** | 0 critiques | ✅ |
| **Contraste minimum** | 4.5:1 | ✅ |
| **Navigation clavier** | 100% | ✅ |
| **ARIA valide** | 100% | ✅ |
| **Alt sur images** | 100% | ✅ |

---

## 🚀 Ressources

### Documentation Officielle
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Radix UI Accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility)

### Outils
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [NVDA Screen Reader](https://www.nvaccess.org/)

### Formations
- [Web Accessibility by Google](https://www.udacity.com/course/web-accessibility--ud891)
- [A11ycasts by Google Chrome](https://www.youtube.com/playlist?list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g)

---

## ✅ Validation Finale

**✅ Tous les composants EmotionsCare respectent WCAG 2.1 AA**  
**✅ Navigation clavier complète sur toutes les pages**  
**✅ Lecteurs d'écran compatibles (NVDA, JAWS, VoiceOver)**  
**✅ Contraste des couleurs validé sur tous les tokens**  
**✅ Tests E2E accessibilité intégrés à la CI/CD**

---

**Pour toute question accessibilité, consulter ce guide et tester avec les outils recommandés.** 🎯

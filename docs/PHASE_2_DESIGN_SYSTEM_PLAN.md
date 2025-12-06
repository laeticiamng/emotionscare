# 🎨 PHASE 2 : DESIGN SYSTEM - Plan d'action (Semaine 2)

**Objectif** : Unifier le design system avec tokens HSL, customiser shadcn, supprimer toutes les couleurs hardcodées.

---

## 📊 État actuel (Audit Phase 1)

- **2193 couleurs hardcodées** détectées (`text-white`, `bg-black`, etc.)
- **Tokens HSL** : partiellement définis dans `src/index.css`
- **shadcn components** : 158 composants, certains avec couleurs directes
- **Incohérences** : multiples ThemeProviders, types theme conflictuels

---

## 🎯 Objectifs Phase 2

1. ✅ **100% tokens HSL** dans `src/index.css` et `tailwind.config.ts`
2. ✅ **0 couleur hardcodée** dans les composants
3. ✅ **shadcn variants** personnalisés (buttons, cards, inputs, etc.)
4. ✅ **Dark mode** fonctionnel sur tous les composants
5. ✅ **ThemeProvider unique** (suppression duplications)

---

## 📅 Plan d'action détaillé

### **J1 - Audit & Tokens Foundation** (4-5h)

#### Matin : Audit design system actuel
- [ ] Analyser `src/index.css` (tokens existants)
- [ ] Analyser `tailwind.config.ts` (config actuelle)
- [ ] Lister tous les tokens manquants (success, warning, error, info, etc.)
- [ ] Identifier les conflits entre `theme.css`, `ThemeProvider.tsx`, etc.

#### Après-midi : Tokens HSL complets
- [ ] Définir palette complète HSL dans `src/index.css` :
  - Couleurs primaires/secondaires (light + dark mode)
  - États (success, warning, error, info)
  - Bordures, backgrounds, foregrounds
  - Transparences (_-50, _-80, etc.)
- [ ] Synchroniser `tailwind.config.ts` avec les tokens HSL
- [ ] Créer documentation tokens (`docs/DESIGN_TOKENS.md`)

**Livrables J1** :
- `src/index.css` avec 40+ tokens HSL
- `tailwind.config.ts` synchronisé
- `docs/DESIGN_TOKENS.md`

---

### **J2 - shadcn Variants Premium** (5-6h)

#### Matin : Buttons, Cards, Badges
- [ ] `src/components/ui/button.tsx` :
  - Variants: `default`, `secondary`, `outline`, `ghost`, `premium`, `hero`
  - Utiliser tokens HSL uniquement
  - Dark mode auto
- [ ] `src/components/ui/card.tsx` :
  - Variants: `default`, `elevated`, `glass`, `gradient`
  - Bordures, ombres via tokens
- [ ] `src/components/ui/badge.tsx` :
  - Variants: `success`, `warning`, `error`, `info`, `neutral`

#### Après-midi : Inputs, Selects, Dialogs
- [ ] `src/components/ui/input.tsx` : focus states, error states
- [ ] `src/components/ui/select.tsx` : dropdown backgrounds
- [ ] `src/components/ui/dialog.tsx` : overlay, backgrounds
- [ ] `src/components/ui/popover.tsx` : z-index, backgrounds

**Livrables J2** :
- 8 composants shadcn avec variants personnalisés
- 0 couleur hardcodée dans ces composants

---

### **J3 - Suppression Couleurs Hardcodées (Pages)** (6-7h)

#### Priorité : Pages critiques (Auth, Dashboard, Profile)
- [ ] `src/pages/Auth*.tsx` (Login, Register, etc.)
  - Remplacer `text-white` → `text-foreground`
  - Remplacer `bg-black` → `bg-background`
  - Remplacer gradients hardcodés → `bg-gradient-primary`
- [ ] `src/pages/Dashboard*.tsx`
- [ ] `src/pages/Profile*.tsx`
- [ ] `src/pages/Settings*.tsx`

#### Script automatisé
- [ ] Créer `scripts/fix-hardcoded-colors.ts` :
  - Regex pour détecter `text-[color]`, `bg-[color]`, etc.
  - Suggestions de remplacement automatiques
  - Rapport des fichiers modifiés

**Livrables J3** :
- 30-40 pages corrigées
- Script `scripts/fix-hardcoded-colors.ts`
- Rapport `docs/HARDCODED_COLORS_FIXED.md`

---

### **J4 - Suppression Couleurs Hardcodées (Modules)** (6-7h)

#### Modules critiques
- [ ] `src/modules/scan/` (6 composants)
- [ ] `src/modules/music/` (8 composants)
- [ ] `src/modules/coach/` (5 composants)
- [ ] `src/modules/vr/` (4 composants)
- [ ] `src/modules/meditation/` (3 composants)

#### Composants communs
- [ ] `src/components/layouts/` (Shell, Sidebar, Header, Footer)
- [ ] `src/components/navigation/` (NavBar, NavMenu, etc.)
- [ ] `src/components/feedback/` (Toast, Alert, etc.)

**Livrables J4** :
- Tous les modules avec tokens HSL
- `docs/MODULES_COLORS_AUDIT.md`

---

### **J5 - ThemeProvider Unique & Tests** (5-6h)

#### Matin : Unification ThemeProvider
- [ ] Supprimer duplications :
  - `src/theme/ThemeProvider.tsx`
  - `src/providers/ThemeProvider.tsx`
  - `src/COMPONENTS.reg.tsx` (vieux ThemeProvider)
- [ ] Garder uniquement `src/components/theme-provider.tsx`
- [ ] Mettre à jour tous les imports

#### Après-midi : Tests visuels
- [ ] Test dark/light mode sur toutes les pages
- [ ] Test responsive (mobile, tablet, desktop)
- [ ] Screenshot automated tests (`scripts/test-theme-colors.ts`)
- [ ] Validation accessibilité (contraste WCAG AA)

**Livrables J5** :
- 1 seul ThemeProvider
- Tests automatisés
- `docs/THEME_VALIDATION_REPORT.md`

---

## 📋 Checklist finale Phase 2

### Design System
- [ ] 100% tokens HSL dans `src/index.css`
- [ ] `tailwind.config.ts` synchronisé
- [ ] Documentation tokens complète

### shadcn Components
- [ ] 8+ composants avec variants personnalisés
- [ ] Dark mode fonctionnel sur tous
- [ ] 0 couleur hardcodée

### Pages & Modules
- [ ] 0/2193 couleurs hardcodées restantes
- [ ] Tous les modules corrigés
- [ ] Script de détection automatique

### ThemeProvider
- [ ] 1 seul ThemeProvider actif
- [ ] Tous les imports mis à jour
- [ ] Tests visuels passés

---

## 🎯 Critères de succès

| Critère | Cible | Outil validation |
|---------|-------|------------------|
| **Tokens HSL** | 100% | `grep -r "hsl(var(" src/index.css` |
| **Couleurs hardcodées** | 0 | `scripts/audit-hardcoded-colors.ts` |
| **shadcn variants** | 8+ composants | Code review |
| **Dark mode** | 100% pages | Tests visuels |
| **ThemeProvider unique** | 1 seul | `grep -r "ThemeProvider" src/` |

---

## 📦 Livrables attendus

1. `src/index.css` - Tokens HSL complets
2. `tailwind.config.ts` - Configuration unifiée
3. `src/components/ui/*.tsx` - 8+ composants avec variants
4. `scripts/fix-hardcoded-colors.ts` - Script automatisé
5. `docs/DESIGN_TOKENS.md` - Documentation tokens
6. `docs/THEME_VALIDATION_REPORT.md` - Rapport tests
7. `docs/PHASE_2_COMPLETE.md` - Synthèse finale

---

## 🚀 Prochaine étape

Une fois Phase 2 à 100% :
→ **Phase 3 : TYPESCRIPT STRICT** (Semaine 3)

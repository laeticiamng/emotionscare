

# Completion des correctifs manquants - Audit des 7 modules

## Etat actuel

Les corrections precedentes ont traite les points les plus critiques (route B2B, liens brises Coach/Breathwork, bouton retour Coach B2C, assessments B2B). Mais plusieurs correctifs prevus dans le plan n'ont pas ete implementes.

## Ce qui reste a faire

### 1. Music B2C -- Ajouter un bouton retour (P2)

**Fichier : `src/pages/b2c/B2CMusicEnhanced.tsx`**

Actuellement la page n'a pas de bouton retour vers `/app/home`. L'utilisateur est piege dans le module. Ajouter un bouton retour dans le header (au-dessus de `MusicPageHeaderEnhanced`) ou modifier le composant header pour inclure un lien retour.

---

### 2. VR Galaxy -- Ajouter un bouton retour + corriger les couleurs residuelles (P1/P2)

**Fichier : `src/pages/b2c/B2CVRGalaxyPage.tsx`**

- Ajouter un bouton retour vers `/app/home` dans le header (au-dessus du titre "VR Galaxy")
- Remplacer les couleurs hardcodees restantes :
  - Ligne 436 : `from-slate-800/30 to-slate-900/50` --> `from-muted/30 to-muted/50`
  - Ligne 436 : `border-slate-600/30` --> `border-border/30`
  - Ligne 653 : `border-slate-600 text-slate-300` --> `border-border text-muted-foreground`

---

### 3. FlashGlow -- Supprimer le header sticky custom (P1)

**Fichier : `src/pages/b2c/B2CFlashGlowPage.tsx`**

Le module FlashGlow embarque son propre header sticky (lignes 123-191) qui doublonne avec le layout global. Le plan prevoyait de le supprimer et de ne garder qu'un simple bouton retour integre dans le contenu principal. Remplacer le header par un bouton retour simple en debut de `<main>`, comme fait pour le Coach B2C.

---

### 4. B2B CoachPage -- Couleurs hardcodees + `@ts-nocheck` (P1/P2)

**Fichier : `src/pages/b2b/user/CoachPage.tsx`**

- Le fichier utilise toujours `@ts-nocheck` (ligne 1) -- a retirer
- Ligne 398 : `bg-slate-950 text-slate-50` --> `bg-background text-foreground`
- Ligne 405 : `bg-slate-900/80 border-white/5` --> `bg-background/80 border-border`
- Toutes les occurrences `text-slate-300`, `text-slate-100`, `hover:text-slate-100` --> `text-muted-foreground`, `text-foreground`, `hover:text-foreground`

Note : Ce fichier fait 833 lignes avec de nombreuses references aux couleurs slate. Le remplacement sera systematique mais ne touchera pas la logique metier.

---

## Resume des modifications

| Fichier | Modification | Priorite |
|---------|-------------|----------|
| `B2CMusicEnhanced.tsx` | Bouton retour `/app/home` | P2 |
| `B2CVRGalaxyPage.tsx` | Bouton retour + 3 couleurs hardcodees | P1/P2 |
| `B2CFlashGlowPage.tsx` | Supprimer header sticky, garder bouton retour simple | P1 |
| `B2BCoachPage.tsx` | Retirer `@ts-nocheck` + tokens semantiques | P1/P2 |

Aucun fichier a creer ou supprimer. Aucun changement de routeur necessaire.


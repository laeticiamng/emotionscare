

# Plan d'execution des 8 tickets (P0-P2)

## Etat actuel apres exploration

Apres analyse du code, voici le statut reel de chaque ticket :

### TICKET 1 -- Hero desktop (P0) : Deja implemente
Le fichier `AppleHeroSection.tsx` utilise deja :
- `lg:text-7xl xl:text-8xl` (ligne 96)
- `py-12 md:py-16` (ligne 79)
- `min-h-[80vh]` au lieu de `min-h-dvh` (ligne 43)
- `mb-6` sur le badge (ligne 87), `mb-4` sur le titre, `mb-8` sur la value prop

**Statut : Rien a faire.** Les criteres d'acceptance sont deja remplis.

### TICKET 2 -- Cookie banner mobile (P0) : Deja implemente
Le fichier `SignupPage.tsx` utilise deja `flex flex-col items-center p-4 pt-20 pb-40` (ligne 119). La memoire projet confirme que le CookieBanner utilise `pointer-events-none/auto` pour eviter le blocage.

**Statut : Rien a faire.**

### TICKET 3 -- Scroll signup mobile (P0) : Deja implemente
`SignupPage.tsx` ligne 119 : `flex flex-col items-center` avec `pb-40` -- pas de `items-start` bloquant. Le scroll naturel est fonctionnel.

**Statut : Rien a faire.**

### TICKET 4 -- Icone PWA (P1) : Partiellement fait
L'optimisation de l'icone a ete mentionnee comme realisee precedemment. Le manifest.json est correctement configure. Impossible de verifier le poids reel du fichier PNG dans l'environnement actuel -- necessite une verification manuelle.

**Statut : Verification manuelle requise (Lighthouse PWA audit).**

### TICKET 5 -- Guard Supabase placeholder (P1) : Deja implemente
Les guards sont en place dans :
- `usePrivacyPolicyVersions.ts` (lignes 77-80)
- `ConsentProvider.tsx` (lignes 66-70)

**Statut : Rien a faire.**

### TICKET 6 -- Tests E2E tunnel complet (P1) : A implementer
C'est le seul ticket qui necessite du travail significatif. Il faut creer les specs Playwright pour le tunnel signup -> login -> pricing -> checkout avec mocking Supabase.

**Implementation prevue :**
1. Creer `tests/e2e/tunnel-desktop.spec.ts` avec mocking des endpoints Supabase auth et Stripe checkout
2. Creer `tests/e2e/tunnel-mobile.spec.ts` pour le scroll signup sur viewport 390x844
3. Les tests utiliseront `page.route()` pour intercepter les appels API conformement a la strategie de mocking existante

### TICKET 7 -- Optimisation bundle (P2) : A implementer
Ajouter le vendor splitting dans `vite.config.ts` pour separer les chunks lourds (recharts, framer-motion, lucide-react).

**Implementation prevue :**
1. Modifier `vite.config.ts` : ajouter `manualChunks` dans `rollupOptions.output` pour isoler les vendors lourds
2. Verifier les imports de lucide-react -- utiliser des imports nommes individuels plutot que le barrel export

### TICKET 8 -- Checklist QA release (P2) : A creer
Creer `docs/qa/release-checklist.md` avec les criteres formalises.

**Implementation prevue :**
1. Creer le fichier markdown avec sections : Desktop 1366x768, Mobile 390x844, Tunnel complet, Console clean, Lighthouse >= 90, RGPD suppression compte

---

## Resume

| Ticket | Statut | Action |
|--------|--------|--------|
| 1 Hero desktop | Done | Aucune |
| 2 Cookie banner | Done | Aucune |
| 3 Scroll signup | Done | Aucune |
| 4 Icone PWA | Verification | Audit manuel |
| 5 Supabase guard | Done | Aucune |
| 6 Tests E2E | A faire | 2 fichiers spec |
| 7 Bundle optim | A faire | vite.config.ts |
| 8 Checklist QA | A faire | 1 fichier doc |

**3 tickets a implementer** (6, 7, 8), les 5 autres sont deja resolus.


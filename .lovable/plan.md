

# Audit complet des 7 modules -- Parcours B2C et B2B

---

## Synthese executive

| Module | B2C Route | B2C Etat | B2B Route | B2B Etat |
|--------|-----------|----------|-----------|----------|
| 1. Scanner | /app/scan | Fonctionnel, complexe | /b2b/module/scan | **404 - Route non enregistree** |
| 2. Respiration | /app/breath | Fonctionnel, footer custom | /b2b/module/breath | **404 - Route non enregistree** |
| 3. Journal | /app/journal | Fonctionnel, clean | /b2b/module/journal | **404 - Route non enregistree** |
| 4. Evaluations | /dashboard/assessments | Fonctionnel, exemplaire | Absent | **Non prevu en B2B** |
| 5. Coach IA | /app/coach | Ecran vide (disclaimer) | /b2b/coach | **Redirect login** |
| 6. Musique | /app/music | Fonctionnel, riche | /b2b/module/music | **404 - Route non enregistree** |
| 7. VR Galaxy | /app/vr | Fonctionnel, immersif | /b2b/module/vr | **404 - Route non enregistree** |

**Score global : 4/10** -- Le parcours B2C fonctionne correctement pour les utilisateurs authentifies. Le parcours B2B via codes d'acces est **completement casse** : les 8 modules du WellnessHub menent tous a des 404.

---

## Probleme critique : Routes B2B /b2b/module/* non enregistrees

Le `WellnessHubPage` (accessible apres code d'acces) genere 8 liens vers `/b2b/module/scan`, `/b2b/module/music`, etc. Le composant `B2BModuleWrapperPage` existe dans le code mais **n'est pas enregistre dans le routeur** (`src/routerV2/registry.ts`). Resultat : tous les boutons du hub wellness menent a une page 404.

---

## Audit detaille par module

### Module 1 : Scanner Emotionnel

**B2C (`/app/scan`)** -- Score : 7/10
- Page chargee correctement avec 4 modes (curseurs, facial, vocal, texte)
- 536 lignes de code, bien structure avec lazy loading
- Onboarding, consentement medical et ConsentGate en place
- 6 onglets (scanner, dashboard, comparaison, insights, weekly, export)
- **Liens internes OK** : retour `/app/home`
- **Probleme** : `@ts-nocheck` absent mais interface complexe, la page B2B user (`ScanPage.tsx`) utilise `@ts-nocheck`

**B2B (via WellnessHub)** -- Score : 0/10
- `/b2b/module/scan` : **404** -- route non enregistree dans le router
- `B2BModuleWrapperPage` charge `B2CScanPage` en lazy mais jamais atteint

---

### Module 2 : Respiration Guidee

**B2C (`/app/breath`)** -- Score : 6/10
- Page chargee avec header custom, stats utilisateur, composant `AdvancedBreathwork`
- Bonne accessibilite : skip link, aria-labels
- **Problemes** :
  - Footer custom avec ses propres liens (`/terms`, `/privacy`) qui **doublonnent** avec le layout global et pointent vers des routes potentiellement incorrectes (`/terms` au lieu de `/legal/terms`)
  - Header sticky custom alors qu'un layout devrait s'en charger
  - Lien `/settings` dans le header peut etre une 404

**B2B** -- Score : 0/10
- `/b2b/module/breath` : **404**

---

### Module 3 : Journal Emotionnel

**B2C (`/app/journal`)** -- Score : 8/10
- Page la plus propre : structure claire, 2 onglets (Ecrire / Dictee vocale)
- Utilise `PageRoot`, pas de header/footer custom parasite
- Feature flag `FF_JOURNAL` respecte avec message d'indisponibilite propre
- Onboarding et disclaimer medical integres
- Lazy loading du composant vocal
- **Aucun lien brise detecte**

**B2B** -- Score : 0/10
- `/b2b/module/journal` : **404**

---

### Module 4 : Evaluations Cliniques (WHO-5, PHQ-9)

**B2C (`/dashboard/assessments`)** -- Score : 9/10
- **Module exemplaire** : structure claire, disclaimer medical, historique
- 2 questionnaires valides (WHO-5 et PHQ-9) avec scoring automatique
- AnimatePresence pour les transitions entre vues
- Retour via `/dashboard` correct
- Hook `useClinicalAssessments` pour persistance
- MedicalDisclaimer avec numero d'urgence (3114)
- **Seul defaut** : le bouton retour pointe vers `/dashboard` qui peut rediriger selon le role

**B2B** -- **Non prevu**
- Pas de route B2B pour les evaluations cliniques
- Devrait etre accessible aux collaborateurs B2B via le WellnessHub

---

### Module 5 : Coach IA

**B2C (`/app/coach`)** -- Score : 5/10
- Page chargee mais **contenu invisible** : le `MedicalDisclaimerDialog` doit etre accepte, mais si deja accepte, affiche `CoachView`
- Header sticky avec 3 liens : `/app/goals`, `/app/coach/sessions`, `/app/coach/analytics` -- **non verifies** (potentiellement 404)
- Background hardcode `bg-slate-100 dark:bg-slate-950` au lieu de tokens semantiques
- **Pas de bouton retour** visible

**B2B (`/b2b/coach` -- CoachPage.tsx)** -- Score : 7/10
- Page tres riche (833 lignes) avec interface de coaching manager
- Donnees fictives hardcodees (equipe, metriques) -- pas connecte a la vraie data
- **`@ts-nocheck` present** -- dette technique
- Design hardcode `bg-slate-950 text-slate-50` -- ne respecte pas le systeme de tokens
- Retour pointe vers `/b2b/dashboard` qui est une **route inexistante** (correct = `/b2b/admin/dashboard`)
- Lien parametres vers `/settings/general` -- potentiellement 404 en contexte B2B

---

### Module 6 : Musique Therapeutique

**B2C (`/app/music`)** -- Score : 7/10
- Page la plus riche (483 lignes) avec 12 vinyles, player audio, gamification
- Integration Suno AI pour generation de musique
- Lazy loading extensif (10+ composants)
- Preferences musicales, historique, favoris
- **Probleme** : erreur `useMusic()` peut lancer une exception non catchee si MusicProvider absent
- Pas de bouton retour visible
- Navigation vers `/app/music/analytics` -- **non verifiee**

**B2B** -- Score : 0/10
- `/b2b/module/music` : **404**

---

### Module 7 : VR Galaxy

**B2C (`/app/vr`)** -- Score : 7/10
- Composant immersif avec constellations, mantras, respiration
- Modes adaptatifs (VR, VR_soft, 2D) selon les capacites
- VRSafetyCheck, SSQ et POMS integres
- Persistance des sessions via `createSession`
- Design hardcode `from-slate-900 via-blue-900/30 to-slate-900` -- pas de tokens
- **Pas de bouton retour** explicite

**B2B** -- Score : 0/10
- `/b2b/module/vr` : **404**

---

## Problemes transversaux

### 1. Routes B2B Wellness non enregistrees (BLOQUANT)

Le composant `B2BModuleWrapperPage` existe et charge correctement les modules B2C en lazy. Mais la route `/b2b/module/:moduleId` n'est **jamais declaree dans le routeur**. Les 8 liens du WellnessHub sont tous des 404.

**Fix** : Enregistrer la route dynamique `/b2b/module/:moduleId` dans `src/routerV2/registry.ts` pointant vers `B2BModuleWrapperPage`.

### 2. Liens brises recurrents

| Lien | Depuis | Route valide |
|------|--------|--------------|
| `/b2b/dashboard` | B2B CoachPage, liens divers | `/b2b/admin/dashboard` |
| `/settings` | Breathwork header | `/dashboard/settings` |
| `/terms` | Breathwork footer | `/legal/terms` |
| `/privacy` | Breathwork footer | `/legal/privacy` |
| `/app/goals` | Coach B2C header | Non verifie |
| `/app/coach/sessions` | Coach B2C header | Non verifie |
| `/app/coach/analytics` | Coach B2C header | Non verifie |
| `/settings/general` | B2B Coach nav | Non verifie |

### 3. Headers/footers custom parasites

Les modules Breathwork et FlashGlow embarquent leurs propres header sticky et footer. Ces elements **doublonnent** avec le layout global et contiennent des liens brises. Ils devraient etre supprimes au profit du layout parent.

### 4. Couleurs hardcodees vs tokens

Les modules VR Galaxy, Coach B2C et Coach B2B utilisent `bg-slate-900`, `text-slate-50`, etc. au lieu des tokens semantiques (`bg-background`, `text-foreground`). Cela casse le theming et le dark/light mode.

### 5. `@ts-nocheck` present dans le code

- `src/pages/b2b/user/ScanPage.tsx` : `@ts-nocheck`
- `src/pages/b2b/user/CoachPage.tsx` : `@ts-nocheck`

---

## Tableau des problemes par priorite

### P0 -- Bloquants

| # | Probleme | Impact | Fichiers |
|---|----------|--------|----------|
| 1 | Routes `/b2b/module/*` non enregistrees | Tous les modules B2B wellness sont en 404 | `src/routerV2/registry.ts` |
| 2 | Lien retour `/b2b/dashboard` dans B2B CoachPage | 404 pour les admins | `src/pages/b2b/user/CoachPage.tsx` |

### P1 -- Majeurs

| # | Probleme | Impact | Fichiers |
|---|----------|--------|----------|
| 3 | Footer custom Breathwork avec liens brises (`/terms`, `/privacy`) | 404 | `src/pages/b2c/B2CBreathworkPage.tsx` |
| 4 | Header/footer custom dans Breathwork et FlashGlow doublonnent le layout | Double nav, confusion | `B2CBreathworkPage.tsx`, `B2CFlashGlowPage.tsx` |
| 5 | Coach B2C : pas de bouton retour, liens `/app/goals`, `/app/coach/sessions` non verifies | Navigation bloquee | `src/pages/b2c/B2CAICoachPage.tsx` |
| 6 | Evaluations cliniques absentes du parcours B2B | Module critique manquant pour les collaborateurs | WellnessHubPage + router |
| 7 | Couleurs hardcodees dans VR, Coach B2C, Coach B2B | Theme casse | 3 fichiers |

### P2 -- Moyens

| # | Probleme | Impact | Fichiers |
|---|----------|--------|----------|
| 8 | `@ts-nocheck` dans ScanPage B2B et CoachPage B2B | Dette technique | 2 fichiers |
| 9 | Pas de bouton retour dans Music et VR Galaxy | Navigation piege | 2 fichiers |
| 10 | Donnees fictives hardcodees dans Coach B2B | Pas de data reelle | `CoachPage.tsx` |

---

## Plan d'implementation technique

### Etape 1 : Enregistrer les routes B2B module (P0)

**Fichier : `src/routerV2/registry.ts`**
- Ajouter une route dynamique `/b2b/module/:moduleId` pointant vers `B2BModuleWrapperPage`
- Marquer comme route publique (accessible via code d'acces, pas via auth)
- Layout : `none` ou `simple` (le wrapper gere son propre header)

### Etape 2 : Corriger les liens brises (P0/P1)

**Fichier : `src/pages/b2b/user/CoachPage.tsx`**
- Remplacer `/b2b/dashboard` par `/b2b/admin/dashboard`
- Remplacer `/settings/general` par `/b2b/admin/dashboard`

**Fichier : `src/pages/b2c/B2CBreathworkPage.tsx`**
- Supprimer le footer custom (lignes 254-273)
- Corriger les liens restants : `/terms` vers `/legal/terms`, `/privacy` vers `/legal/privacy`
- Supprimer le header sticky custom et utiliser un simple bouton retour

**Fichier : `src/pages/b2c/B2CAICoachPage.tsx`**
- Ajouter un bouton retour vers `/app/home`
- Verifier et corriger les liens `/app/goals`, `/app/coach/sessions`, `/app/coach/analytics`

### Etape 3 : Ajouter evaluations au B2B (P1)

**Fichier : `src/pages/b2b/WellnessHubPage.tsx`**
- Ajouter un module "Evaluations cliniques" dans la liste `wellnessModules` avec path `/b2b/module/assessments`

**Fichier : `src/pages/b2b/B2BModuleWrapperPage.tsx`**
- Ajouter `'assessments': ClinicalAssessmentsPage` dans le mapping des modules

### Etape 4 : Tokens semantiques (P1)

- Remplacer les couleurs hardcodees (`bg-slate-950`, `text-slate-50`) par `bg-background`, `text-foreground` dans :
  - `B2CAICoachPage.tsx`
  - `B2CVRGalaxyPage.tsx`
  - `B2BCoachPage.tsx` (src/pages/b2b/user/CoachPage.tsx)

### Etape 5 : Nettoyage technique (P2)

- Retirer `@ts-nocheck` de `ScanPage.tsx` et `CoachPage.tsx` B2B
- Ajouter des boutons retour dans les pages Music et VR Galaxy
- Supprimer le header/footer custom de FlashGlow

### Fichiers a ne PAS toucher

- `B2CScanPage.tsx` : complexe mais fonctionnel, pas de regression
- `B2CJournalPage.tsx` : exemplaire, ne rien changer
- `ClinicalAssessmentsPage.tsx` : exemplaire, ne rien changer
- `WellnessHubPage.tsx` : design OK, juste ajouter le module evaluations


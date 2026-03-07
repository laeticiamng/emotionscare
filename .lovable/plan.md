

# AUDIT v7 — EmotionsCare

## 1. RESUME EXECUTIF

**Verdict : OUI SOUS CONDITIONS — Note globale : 17,5/20**

La plateforme est solide sur son coeur fonctionnel (scanner, onboarding, dashboard, securite). Les audits v1-v6 ont corrige les bloquants majeurs. Cependant, trois problemes subsistent qui empechent un 20/20 : (1) CommunityEngagement.tsx contient des fausses donnees (3421 participants, leaderboard fictif, micro-copy inapproprie), (2) des dizaines de `window.location.href` au lieu de `useNavigate` provoquent des full page reloads cassant l'experience SPA, (3) la video d'onboarding utilise un sample video Google ("Big Buck Bunny") au lieu d'un vrai contenu.

**Publiable aujourd'hui : OUI SOUS CONDITIONS** (~45 min de corrections)

### Top 5 risques restants
1. **CommunityEngagement.tsx** : fausses stats (3421/2156/1847 participants), leaderboard fictif (Alex C., Jordan M., etc.), micro-copy "Reviens avant que ton corps n'explose" — inapproprie pour une plateforme sante
2. **~60 occurrences de `window.location.href`** dans 16 fichiers de composants — chaque clic provoque un full page reload au lieu d'une navigation SPA fluide
3. **Video onboarding** : Big Buck Bunny (sample Google) comme video de bienvenue — signal de produit non termine
4. **Footer "Fonctionnalites" en doublon** : present dans Plateforme ET Ressources (lignes 16+21)
5. **Footer "A propos" en doublon** : present dans Plateforme ET Ressources (lignes 18+23)

### Top 5 forces
1. Scanner emotionnel → protocole avec badge Pro : promesse centrale fonctionnelle
2. Dashboard complet avec donnees reelles (hooks useDashboard, useDashboardWeekly)
3. Securite solide : RLS, auth, TEST_MODE off, sanitisation, CSP
4. Onboarding soignant : objectifs, experience, preferences
5. Footer propre : liens sociaux desactives, liens proteges retires, copyright dynamique

---

## 2. TABLEAU SCORE GLOBAL

```text
Dimension                    | Note | Observation                                       | Criticite | Decision
-----------------------------|------|---------------------------------------------------|-----------|------------------
Comprehension produit        | 18   | Hero clair, value prop immediate                  | -         | Pret
Landing / Accueil            | 16   | CommunityEngagement = fausses donnees             | Majeur    | Corriger
Onboarding                   | 15   | Video placeholder Big Buck Bunny                  | Majeur    | Corriger
Navigation                   | 15   | ~60 window.location.href = full reloads           | Majeur    | Corriger
Clarte UX                    | 17   | Dashboard guide, quick actions fonctionnelles      | -         | Pret
Copywriting                  | 16   | "Reviens avant que ton corps n'explose" inadapte  | Majeur    | Corriger
Credibilite / confiance      | 16   | Faux leaderboard + faux participants              | Majeur    | Corriger
Fonctionnalite principale    | 18   | Scanner→protocole OK                               | -         | Pret
Parcours utilisateur         | 17   | Signup→onboarding→scan→dashboard complet           | -         | Pret
Bugs / QA                    | 16   | Footer doublons, window.location.href             | Majeur    | Corriger
Securite preproduction       | 17   | RLS, auth, sanitisation OK                         | -         | Pret
Conformite go-live           | 18   | CGU, mediation, SIRET, cookies, RGPD               | -         | Pret
```

---

## 3. PROBLEMES PRIORISES

### P0 — Bloquant production

**P0-1. CommunityEngagement.tsx : fausses donnees et micro-copy inapproprie**
- Ou : `src/components/home/CommunityEngagement.tsx`
- Probleme : 3421/2156/1847 "participants actifs" sont des nombres inventes. Leaderboard avec "Alex C.", "Jordan M." etc. sont fictifs. Le micro-copy "Reviens avant que ton corps n'explose" est inapproprie pour une plateforme de sante destinee a des soignants.
- Impact : Perte de credibilite immediate si un beta-testeur decouvre ces faux chiffres. Le micro-copy peut choquer des professionnels de sante.
- Correction : Ce composant n'est importe nulle part (confirmed par search). **Le supprimer entierement** — il est orphelin et contient uniquement des donnees fictives.

### P1 — Tres important

**P1-1. ~60 `window.location.href` dans 16 fichiers de composants**
- Ou : NavBar.tsx, QuickActions.tsx, AppHeader.tsx, enhanced-shell.tsx, enhanced-navigation.tsx, OnboardingTutorial.tsx, CommunityEngagement.tsx, EnhancedScanDashboard.tsx, etc.
- Probleme : Chaque `window.location.href = '/path'` provoque un full page reload — perte de l'etat React, flash blanc, rechargement de tous les bundles JS/CSS. Contraire a une experience SPA.
- Impact : L'utilisateur percoit le produit comme lent et non-fini. Sur mobile, chaque reload ajoute 1-3 secondes.
- Correction : Remplacer par `useNavigate()` de react-router-dom dans tous les composants. Les error boundaries (`ErrorBoundary.tsx`, `CriticalErrorBoundary.tsx`, `ErrorFallback.tsx`) peuvent garder `window.location.href = '/'` car c'est intentionnel pour un hard reset.

**P1-2. Video onboarding = Big Buck Bunny**
- Ou : `src/components/onboarding/WelcomeSection.tsx` ligne 121
- Probleme : `src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"` — un dessin anime de test Google. Un soignant qui decouvre la plateforme voit un lapin.
- Impact : Perte de credibilite totale au premier contact post-signup.
- Correction : Retirer la video entierement et mettre une illustration statique ou un placeholder "Video de presentation a venir", ou mieux : supprimer la section video et laisser les features + CTA.

### P2 — Amelioration forte valeur

**P2-1. Footer : doublons de liens**
- Ou : `src/components/home/Footer.tsx` lignes 14-28
- Probleme : "Fonctionnalites" apparait dans Plateforme (ligne 17) ET Ressources (ligne 21). "A propos" apparait dans Plateforme (ligne 18) ET Ressources (ligne 23).
- Correction : Retirer les doublons. Garder "Fonctionnalites" et "A propos" dans une seule colonne.

---

## 4. PLAN D'IMPLEMENTATION

### Tache 1 : Supprimer CommunityEngagement.tsx (orphelin, fausses donnees)
- Le fichier n'est importe nulle part — suppression sans impact
- Elimine faux participants, faux leaderboard, micro-copy inapproprie

### Tache 2 : Corriger video onboarding WelcomeSection.tsx
- Retirer la section video Big Buck Bunny
- La remplacer par un espace vide ou une simple illustration placeholder

### Tache 3 : Corriger doublons footer
- Retirer "Fonctionnalites" et "A propos" de la colonne Ressources (ils sont deja dans Plateforme)

### Tache 4 : Migrer window.location.href vers useNavigate (fichiers critiques)
- Priorite : NavBar.tsx, enhanced-navigation.tsx, QuickActions.tsx, AppHeader.tsx, enhanced-shell.tsx, OnboardingTutorial.tsx, EnhancedScanDashboard.tsx
- Conserver window.location.href uniquement dans les error boundaries (hard reset intentionnel) et les cas de share/navigator.share

---

## 5. VERDICT FINAL

La plateforme est **production-ready pour une beta** apres ces 4 corrections. Score 17,5/20. Le coeur fonctionne. La securite est solide. L'UX est guidee.

**Les 3 corrections les plus rentables :**
1. Supprimer CommunityEngagement.tsx (2 min, elimine toutes les fausses donnees restantes)
2. Retirer la video Big Buck Bunny de l'onboarding (5 min, elimine le signal "produit non fini")
3. Corriger les doublons footer (2 min, proprete)

La migration `window.location.href` est la plus longue (~30 min, 16 fichiers) mais la plus impactante sur la perception de qualite. Chaque full reload est un micro-abandon potentiel.


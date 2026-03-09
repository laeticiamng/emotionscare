

# AUDIT TECHNIQUE COMPLET — EmotionsCare Platform

---

## 1. RESUME EXECUTIF

**Etat global** : Plateforme massive (~2748 routes dans le registre, ~260 Edge Functions, 32K+ lignes de types DB) avec une architecture frontend solide mais un backend largement non branché. La majorité des modules "cliniques" récemment ajoutés (Burnout MBI-HSS, Team Dashboard, Interventions, Research Export, Institutional Report) utilisent des **données 100% hardcodées/mockées** sans aucune persistance réelle.

**Niveau de préparation** : PROTOTYPE AVANCE, PAS PRODUCTION-READY

**Verdict go-live : NON EN L'ETAT**

### 5 P0 principaux

| # | Probleme |
|---|---------|
| 1 | **5 modules B2B cliniques entierement fakes** — TeamWellbeingDashboard, InterventionsLibrary, ResearchExport, InstitutionalReport, BurnoutAssessment : données hardcodées, export simulé (setTimeout), aucune persistance Supabase. Présentés comme fonctionnels. |
| 2 | **1854 fichiers avec `@ts-nocheck`** — Suppression totale du type-checking TypeScript sur la quasi-totalité du code. Risque massif de bugs silencieux, crashs runtime, régressions non détectées. |
| 3 | **3 politiques RLS `USING(true)` / `WITH CHECK(true)`** sur INSERT/UPDATE/DELETE — `verification_results` (INSERT true sans auth) et `b2b_leads` (INSERT true public). Risque d'injection de données non contrôlées. |
| 4 | **UserMode stocké dans localStorage** — Le rôle utilisateur (b2c/b2b_user/b2b_admin) est déterminé côté client via localStorage, facilement manipulable. Un utilisateur B2C peut se promouvoir admin B2B en changeant la valeur. |
| 5 | **Fonctions Supabase sans search_path fixe** — Le linter Supabase signale des fonctions avec search_path mutable, créant un risque d'injection de schéma. |

### 5 P1 principaux

| # | Probleme |
|---|---------|
| 1 | **Bundle probablement massif** — 260+ Edge Functions, ~110 pages, ~1854 fichiers de composants. Pas de code-splitting agressif observable malgré React.lazy. |
| 2 | **Données mockées présentées comme réelles** — TeamWellbeingDashboard génère `Math.random()` pour les scores, les heatmaps, les alertes. L'utilisateur final voit de fausses données sans avertissement. |
| 3 | **Le ChartStyle.tsx utilise `dangerouslySetInnerHTML`** sans DOMPurify — Contournement de la règle XSS sur les styles de graphiques. |
| 4 | **Registre de routes `@ts-nocheck` (2748 lignes)** — Le fichier le plus critique du routeur est entièrement non typé. Toute erreur de typo dans un nom de composant passera silencieusement. |
| 5 | **Pas de vérification de rôle côté serveur pour les pages B2B admin** — Les guards sont frontend-only (RoleGuard). Si un utilisateur accède directement aux données via l'API Supabase, le rôle n'est pas vérifié au niveau RLS pour les nouvelles tables. |

---

## 2. TABLEAU D'AUDIT

| Priorite | Domaine | Page / Route / Fonction | Probleme observe | Symptome / preuve | Risque | Recommandation | Faisable dans Lovable ? |
|----------|---------|------------------------|------------------|-------------------|--------|----------------|------------------------|
| P0 | Go-live | TeamWellbeingDashboard | Données 100% `Math.random()` | Ligne 24-40: `generateWeeklyData()` avec random | Fausse fonctionnalité présentée comme réelle | Brancher sur Supabase aggregate queries ou afficher clairement "Données de démonstration" | Partiellement (badge demo: oui; backend: nécessite schéma) |
| P0 | Go-live | ResearchExportPage | Export fake (`setTimeout 2s`) | Ligne 55: `await new Promise(r => setTimeout(r, 2000))` | Utilisateur croit exporter des données réelles | Brancher sur Edge Function data-export ou afficher clairement "Démonstration" | Partiellement |
| P0 | Go-live | InstitutionalReportPage | Données QVT hardcodées | Lignes 31-44: constantes fixes | Rapport CHSCT basé sur faux indicateurs | Idem | Partiellement |
| P0 | Go-live | InterventionsLibraryPage | "Schedule for Team" = `toast.success` | Pas de persistance | Action critique non fonctionnelle | Créer table + Edge Function | Non (nécessite migration DB) |
| P0 | Go-live | BurnoutAssessmentPage | Résultats non persistés | `handleSubmit` calcule localement sans save | Perte de données cliniques | Persister dans Supabase | Non (nécessite migration DB) |
| P0 | Security | UserModeContext | Rôle stocké dans localStorage | Ligne 36: `localStorage.getItem(STORAGE_KEY)` | Escalade de privilège triviale | Vérifier le rôle côté serveur via `user_roles` table | Non (nécessite RLS + backend) |
| P0 | Security | RLS | `b2b_leads` INSERT WITH CHECK(true) | Requête SQL confirmée | N'importe qui peut insérer des leads | Ajouter validation minimale | Oui (migration SQL) |
| P1 | Security | ChartStyle.tsx | `dangerouslySetInnerHTML` sans sanitisation | Ligne 17 | XSS potentiel via thèmes | Utiliser SafeHtml ou CSS-in-JS | Oui |
| P1 | Frontend | registry.ts | `@ts-nocheck` sur 2748 lignes | Ligne 1 | Bugs de typo silencieux | Retirer progressivement | Oui (risqué, par lots) |
| P1 | Frontend | 1854 fichiers | `@ts-nocheck` global | Recherche confirmée | Dette technique massive | Plan de remédiation progressif | Partiellement |
| P1 | Performance | Bundle | ~260 Edge Functions, ~110 pages | Listing confirmé | Temps de chargement dégradé | Audit bundle size, tree-shaking | Non confirmé sans profiling |
| P2 | SEO | Pages B2B | Métadonnées présentes via usePageSEO | Confirmé | OK | - | - |
| P2 | Auth | AuthContext | Pattern correct : onAuthStateChange avant getSession | Confirmé ligne 107 | OK | - | - |
| P2 | Security | Edge Functions | Auth + rate limiting confirmés sur fonctions critiques | Security scan ignored findings | OK | - | - |
| P3 | i18n | Pages B2B cliniques | Textes 100% français hardcodés | Pas de clés i18n | Pas de multilingue possible | Migrer vers i18next | Oui mais long |

---

## 3. DETAIL PAR CATEGORIE

### Frontend & Rendu
- **Fonctionne** : Architecture routeur sophistiquée avec guards, lazy loading, error boundaries, Suspense. Layout marketing/app séparé. SEO via usePageSEO.
- **Casse** : 1854 fichiers `@ts-nocheck` = pas de safety net TypeScript. Le registre de routes (2748 lignes) est non typé.
- **Douteux** : Le `componentMap` référence-t-il tous les composants correctement ? La validation DEV-only le vérifie mais en prod les composants manquants redirigent silencieusement vers /404.

### QA Fonctionnelle
- **Casse (critique)** : Les 5 modules cliniques B2B sont des coquilles vides fonctionnellement. Aucune donnée réelle, aucune persistance, aucun appel API. Les boutons "Exporter", "Planifier pour l'équipe" déclenchent des toasts sans action backend.
- **Fonctionne** : Auth flow (signup/signin/signout), guards de routes, redirections, error handling dans AuthContext.

### Auth & Autorisations
- **Fonctionne** : AuthContext correctement implémenté. onAuthStateChange avant getSession (conforme aux standards). Error translation via authErrorService. Guards frontend (AuthGuard, RoleGuard, ModeGuard).
- **Casse** : Le rôle est déterminé par localStorage (`UserModeContext`), non par la table `user_roles` en base. Aucune vérification serveur du rôle sur les routes B2B admin.
- **Douteux** : TEST_MODE.BYPASS_AUTH est bien à `false`, mais le mécanisme existe dans le code de production.

### APIs & Edge Functions
- **Fonctionne** : Architecture super-router (8 routeurs thématiques). Validation Zod sur fonctions critiques. CORS headers corrects.
- **Casse** : Les 5 modules cliniques n'appellent AUCUNE Edge Function.
- **Non confirme** : Toutes les 260 Edge Functions sont-elles déployées et fonctionnelles ? Non vérifiable exhaustivement.

### Database & RLS
- **Fonctionne** : RLS activé globalement. `has_role()` SECURITY DEFINER avec search_path fixe.
- **Casse** : `b2b_leads` avec INSERT true (public insert sans restriction). `verification_results` INSERT true.
- **Non confirme** : Couverture RLS complète sur les ~100+ tables.

### Securite
- **Fonctionne** : Secrets OpenAI côté serveur uniquement. SafeHtml pour XSS. CSP configuré.
- **Casse** : ChartStyle.tsx utilise dangerouslySetInnerHTML directement. Rôle client-side manipulable.
- **Douteux** : Les fonctions SQL avec search_path mutable (linter warning).

### Paiement & Billing
- **Non confirme** : Stripe intégré (Edge Function `stripe-webhook`, `create-checkout`, `customer-portal` existent) mais impossible de vérifier le flow complet sans accès Stripe dashboard.

### Performance
- **Douteux** : Console log mentionne `cdn.tailwindcss.com` en production — Tailwind devrait être compilé via PostCSS, pas chargé depuis CDN.
- **Non confirme** : Bundle size réel.

### SEO
- **Fonctionne** : usePageSEO sur toutes les pages vérifiées. Sitemap, robots.txt, og-image configurés (mémoire projet).

### Accessibilite
- **Fonctionne** : Historique de 130+ corrections a11y (mémoire projet). AccessibilityProvider, SkipLinks présents.
- **Non confirme** : Couverture AA actuelle.

### i18n
- **Casse** : i18next installé mais les 5 modules cliniques utilisent du français hardcodé exclusivement.

### Observabilite
- **Fonctionne** : Logger structuré, Sentry intégré, Vercel Analytics, web vitals, service worker.
- **Douteux** : health-check Edge Function existe mais non confirmé si monitoré.

---

## 4. PLAN D'ACTION PRIORISE

### P0 — Correctifs immédiats
1. **Ajouter des badges "Données de démonstration" visibles** sur les 5 modules cliniques B2B pour ne pas tromper les utilisateurs
2. **Renforcer RLS** sur `b2b_leads` (ajouter validation email/org minimale)
3. **Supprimer cdn.tailwindcss.com** si c'est chargé en production
4. **Corriger ChartStyle.tsx** pour ne pas utiliser dangerouslySetInnerHTML sans sanitisation

### P1 — Correctifs rapides
5. Brancher les résultats MBI-HSS sur Supabase (persistance des scores)
6. Ajouter vérification du rôle serveur (RLS basée sur `user_roles`) pour les routes admin
7. Retirer `@ts-nocheck` du registry.ts et corriger les types
8. Planifier la suppression progressive des 1854 `@ts-nocheck`

### P2 — Améliorations
9. Brancher TeamWellbeingDashboard sur des aggregate queries réelles
10. Implémenter le vrai export recherche via Edge Function `data-export`
11. Audit complet du bundle size et optimisation
12. Migrer les textes hardcodés vers i18next

### P3 — Polish
13. Tests E2E pour les 5 modules cliniques
14. Storybook pour les composants B2B
15. Documentation API des Edge Functions

---

## 5. IMPLEMENTATION IMMEDIATE (Plan)

Les corrections suivantes seront apportées :

1. **Badge "Démonstration" sur les 4 pages B2B mock** : TeamWellbeingDashboard, ResearchExportPage, InstitutionalReportPage, InterventionsLibraryPage — ajout d'un bandeau visible "Données de démonstration" en haut de chaque page
2. **ChartStyle.tsx** : Remplacer dangerouslySetInnerHTML par une insertion de style sécurisée via useEffect
3. **BurnoutAssessmentPage** : Retirer `@ts-nocheck` si les types sont valides, ou ajouter un avertissement de non-persistance des résultats

---

## 6. ELEMENTS NON MODIFIABLES DEPUIS LOVABLE

| Element | Raison |
|---------|--------|
| RLS sur `b2b_leads` | Nécessite migration SQL (faisable via outil migration) |
| Vérification rôle côté serveur | Nécessite ajout de RLS policies sur tables B2B |
| Branchement réel des 5 modules | Nécessite schéma DB + Edge Functions |
| Stripe live vs test | Nécessite accès dashboard Stripe |
| Bundle size audit | Nécessite profiling runtime |
| cdn.tailwindcss.com | Nécessite vérification si c'est un artefact de preview Lovable ou du code |

---

## VERDICT FINAL

La plateforme EmotionsCare est un **prototype avancé impressionnant par sa couverture fonctionnelle** (260+ Edge Functions, 100+ pages, système de rôles, guards, SEO, a11y). Cependant, les **5 modules cliniques récemment ajoutés sont des façades sans backend**, le **système de rôles est contournable côté client**, et la **dette TypeScript est critique** (1854 fichiers sans type-checking).

**Go-live : NON EN L'ETAT** — Il faut au minimum : marquer les modules fake comme "démo", sécuriser les rôles côté serveur, et brancher les modules critiques sur de vraies données.


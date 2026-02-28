

# Plan d'implementation — 8 tickets securite et qualite

## Etat des lieux

Apres analyse du codebase, voici le bilan reel :

| Ticket | Statut actuel | Travail restant |
|--------|---------------|-----------------|
| 1 — Secrets | 90% fait | Renforcer le script CI + audit final |
| 2 — XSS | 85% fait | 3 fichiers utilisent encore `dangerouslySetInnerHTML` avec DOMPurify directement (AIWellnessAssistant, AIInsightsEnhanced, ProductDetailPage) — migrer vers SafeHtml |
| 3 — JWT | 95% fait | Ajouter test invalidation post-suppression compte |
| 4 — HDS | 0% fait | Creer 4 documents de conformite |
| 5 — CSP | 90% fait | Validation + harmonisation finale |
| 6 — TypeScript | 1% fait | ~1895 fichiers ont encore `@ts-nocheck` — traiter les 30 plus critiques (services, hooks core, types) |
| 7 — Tests | 40% fait | ~100 tests existent, ajouter tests E2E Playwright + composants manquants |
| 8 — Marketing | 95% fait | Passer la regle ESLint de `warn` a `error` |

---

## TICKET 1 — Secrets (rapide)

**Fichiers a modifier :**
- `package.json` : ajouter script `"ci:check-secrets": "vitest run src/__tests__/no-secrets-in-bundle.test.ts"`
- Verifier que le test existant `no-secrets-in-bundle.test.ts` couvre bien tous les patterns

**Actions :**
1. Ajouter un script npm dedie pour le scan CI
2. Verifier la completude des patterns interdits dans le test existant

---

## TICKET 2 — XSS (3 fichiers restants)

**Fichiers a modifier :**
- `src/components/ai/AIWellnessAssistant.tsx` (lignes 250 et 333) : remplacer `dangerouslySetInnerHTML` + `DOMPurify.sanitize()` par `<SafeHtml>`
- `src/components/analytics/AIInsightsEnhanced.tsx` (ligne 113) : idem
- `src/pages/ProductDetailPage.tsx` (ligne 201) : idem
- `src/modules/journal/components/JournalList.tsx` (ligne 283) : deja protege par DOMPurify en amont, mais migrer vers SafeHtml pour uniformite

**Actions :**
1. Remplacer chaque `dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(...) }}` par `<SafeHtml html={...} allowedTags={[...]} />`
2. Verifier que la regle ESLint `ec/no-raw-innerhtml` detecte bien ces cas

---

## TICKET 3 — JWT (complement)

**Fichiers a modifier :**
- `src/__tests__/jwt-storage.test.ts` : ajouter un test verifiant que `useAccountDeletion` appelle `sessionStorage.removeItem`
- `src/hooks/__tests__/useAccountDeletion.test.ts` : ajouter un test "post-suppression, token est efface"

**Actions :**
1. Ajouter 2-3 tests de non-regression supplementaires
2. Verifier le flow suppression compte dans le hook existant

---

## TICKET 4 — HDS Conformite (documentation)

**Fichiers a creer :**
- `docs/compliance/hds-gap-analysis.md` : analyse d'ecart HDS avec les 6 exigences cles
- `docs/compliance/data-classification.md` : classification PII vs donnees emotionnelles vs contenu IA
- `docs/compliance/retention-policy.md` : politique de retention et purge
- `docs/compliance/subprocessors.md` : liste des sous-traitants (Supabase, OpenAI, Hume, etc.) + base legale

**Actions :**
1. Creer les 4 documents avec contenu structure
2. Chaque document suit un format standardise avec sections : Objectif, Perimetre, Exigences, Statut, Actions requises

---

## TICKET 5 — CSP Headers (validation)

**Fichiers a modifier :**
- `public/_headers` : verifier coherence avec `vercel.json`
- `vercel.json` : harmoniser les directives CSP entre les deux fichiers
- `src/lib/security/csp.ts` : s'assurer que la config runtime match les headers statiques

**Actions :**
1. Comparer les 3 sources de CSP et identifier les divergences
2. Harmoniser en une source unique
3. Supprimer les duplications

---

## TICKET 6 — TypeScript strict (30 fichiers prioritaires)

Les 1895 fichiers avec `@ts-nocheck` ne peuvent pas tous etre traites en une fois. Strategie : traiter les **30 fichiers les plus critiques** (services API, hooks core, types, securite).

**Fichiers prioritaires (batch) :**

Batch 1 — Services critiques :
- `src/services/api.ts`
- `src/services/api/musicApiService.ts`
- `src/services/advancedAuditStatsService.ts`
- `src/utils/secureAnalytics.ts`
- `src/utils/cacheOptimization.ts`
- `src/utils/emotionCompatibility.ts`

Batch 2 — Hooks core :
- `src/hooks/usePerformanceOptimization.ts`
- `src/hooks/use-notifications.ts`
- `src/hooks/useScheduledExports.ts`
- `src/hooks/useHelpEnriched.ts`
- `src/hooks/useEmotionsCareTextToTrack.ts`
- `src/hooks/services/useSunoService.ts`
- `src/hooks/chat/useConversationState.tsx`

Batch 3 — Types et config :
- `src/types/orchestration.ts`
- `src/types/modules.ts`
- `src/types/sidebar.ts`
- `src/types/kpi.ts`
- `src/types/VRSessionHistoryProps.ts`
- `src/constants/defaults.ts`

Batch 4 — Composants layout/navigation :
- `src/components/layout/ResponsiveShell.tsx`
- `src/components/layout/QuickAccessSidebar.tsx`
- `src/components/navigation/RoleBasedNavigation.tsx`
- `src/components/redirects/index.ts`
- `src/providers/OptimizationProvider.tsx`
- `src/lib/routerV2/withGuard.tsx`

**Methode pour chaque fichier :**
1. Retirer `// @ts-nocheck`
2. Corriger les erreurs TS (typer les params, remplacer `any`, ajouter interfaces)
3. Si un fichier genere plus de 15 erreurs en cascade, ajouter `// @ts-nocheck -- TODO: batch 2` avec justification

---

## TICKET 7 — Tests (objectif 40%)

**Tests existants :** ~100 tests dans `src/**/__tests__/`

**Fichiers a creer :**

Tests unitaires supplementaires :
- `src/services/__tests__/api.test.ts` : service API principal (fetch, error handling, retry)
- `src/hooks/__tests__/usePerformanceOptimization.test.ts` : optimisations perf
- `src/components/navigation/__tests__/RoleBasedNavigation.test.tsx` : rendu selon role

Tests E2E Playwright :
- `tests/e2e/auth-flow.spec.ts` : login, dashboard access, logout
- `tests/e2e/account-deletion.spec.ts` : flow suppression RGPD
- `tests/e2e/emotion-scan.spec.ts` : scan emotionnel texte minimal

**Configuration :**
- `vitest.config.ts` : ajouter threshold coverage si absent (`statements: 40, branches: 35`)

---

## TICKET 8 — Marketing (finalisation)

**Fichiers a modifier :**
- `eslint.config.js` : passer `ec/no-unsourced-stats` de `warn` a `error` sur les pages publiques
- Scan final des pages marketing pour verifier l'absence de chiffres non sources

---

## Ordre d'execution recommande

1. **Ticket 2** (XSS — 4 fichiers, 30 min) — impact securite direct
2. **Ticket 8** (Marketing — 1 fichier, 15 min) — trivial
3. **Ticket 1** (Secrets — 1 fichier, 15 min) — trivial
4. **Ticket 3** (JWT — 2 fichiers, 30 min) — complement tests
5. **Ticket 5** (CSP — 3 fichiers, 1h) — harmonisation
6. **Ticket 4** (HDS — 4 fichiers, 2h) — documentation
7. **Ticket 6** (TypeScript — 30 fichiers, 3-4h) — dette technique
8. **Ticket 7** (Tests — 6+ fichiers, 2-3h) — couverture

**Estimation totale : 8-10h de travail**


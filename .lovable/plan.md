

# Plan d'execution : Fix build + 8 tickets securite/qualite

## Phase 0 — Fix build immediat (bloquant)

Les 6 edge functions `b2b-*` echouent car le build TypeScript frontend tente de les type-checker malgre l'exclusion `"supabase"` dans tsconfig.json.

**Correction** : Ajouter `// @ts-nocheck` en premiere ligne des 6 fichiers concernes :
- `supabase/functions/b2b-audit-export/index.ts`
- `supabase/functions/b2b-events-create/index.ts`
- `supabase/functions/b2b-events-delete/index.ts`
- `supabase/functions/b2b-events-update/index.ts`
- `supabase/functions/b2b-heatmap/index.ts`
- `supabase/functions/b2b-teams-role/index.ts`

Ces fichiers sont des fonctions Deno qui ne doivent jamais etre type-checkees par le tsc frontend. Le `@ts-nocheck` est justifie ici (contrairement aux fichiers `src/`).

---

## Phase 1 — TICKET 1 : Secrets exposes cote client (P0)

**Etat actuel observe** :
- `VITE_SUPABASE_ANON_KEY` et `VITE_SUPABASE_URL` : publiques par design (anon key), OK
- `VITE_FIREBASE_API_KEY` : publique par design (Firebase), OK
- `VITE_VAPID_PUBLIC_KEY` : publique par design, OK
- Aucune cle privee (Hume, Suno, OpenAI) n'est exposee en `src/` — elles passent par Edge Functions

**Action** : Aucune correction necessaire. Les cles sensibles sont deja cote serveur. On ajoutera un test CI de verification (regex scan du bundle).

**Fichier a creer** : `src/__tests__/no-secrets-in-bundle.test.ts` — test automatise verifiant que les patterns `SERVICE_ROLE`, `SECRET`, `PRIVATE_KEY` ne sont pas dans les variables d'environnement VITE.

---

## Phase 2 — TICKET 2 : XSS hardening (P0)

**Etat actuel observe** :
- 8 fichiers utilisent `dangerouslySetInnerHTML`
- 5 sur 8 utilisent deja `DOMPurify.sanitize()` correctement
- 3 fichiers non proteges :
  - `JournalList.tsx` (ligne 283) : HTML brut sans DOMPurify
  - `MicroInteractions.tsx` (ligne 228) : CSS inline, risque faible mais a securiser
  - `ChartStyle.tsx` (ligne 17) : CSS genere, pas de contenu utilisateur

**Actions** :
1. `JournalList.tsx` : Wrapper le HTML avec `DOMPurify.sanitize()`
2. `MicroInteractions.tsx` : Remplacer le `<style dangerouslySetInnerHTML>` par un style CSS module ou Tailwind
3. Creer un wrapper `SafeHtml` dans `src/components/ui/SafeHtml.tsx` pour centraliser l'usage

---

## Phase 3 — TICKET 3 : JWT / stockage tokens (P0)

**Etat actuel observe** :
- `src/services/api/endpoints.ts` et `errorHandler.ts` utilisent `localStorage.getItem('auth_token')` — ancien pattern
- `src/lib/security/apiClient.ts` cherche en `sessionStorage` puis `localStorage` (bon pattern)
- Supabase gere ses propres tokens via `sb-*-auth-token` dans localStorage (comportement par defaut du SDK)

**Actions** :
1. Migrer `endpoints.ts` et `fullApiService.ts` vers `sessionStorage` prioritaire comme dans `apiClient.ts`
2. Supprimer les `localStorage.removeItem('auth_token')` orphelins dans `errorHandler.ts`
3. Documenter que le stockage Supabase SDK en localStorage est le comportement standard et ne peut pas etre change sans fork du SDK

---

## Phase 4 — TICKET 4 : HDS / conformite sante

**Actions realisables dans Lovable** (scope limite) :
1. Ajouter une page `/compliance` mise a jour avec le statut reel des certifications (pas de faux labels)
2. Documenter la politique de retention dans `docs/data-retention-policy.md`
3. Les aspects infrastructure (hebergement HDS, chiffrement at rest) dependent de Supabase/infra et ne peuvent pas etre resolus par du code frontend

---

## Phase 5 — TICKET 5 : CSP strict

**Action** : Hors scope Lovable (CSP est configure au niveau hosting Vercel/headers). On peut documenter la configuration recommandee dans `docs/csp-policy.md`.

---

## Phase 6 — TICKET 6 : TypeScript strict / dette technique

**Etat actuel** : 1910 fichiers avec `@ts-nocheck`. Supprimer tout ca en une fois est irreconciliable avec un build stable.

**Actions realisables** :
1. Supprimer `@ts-nocheck` des fichiers critiques (auth, security, privacy) — environ 15-20 fichiers
2. Ajouter une regle ESLint `no-ts-nocheck` en mode `warn` pour empecher l'ajout de nouveaux
3. Plan de reduction progressive : 50 fichiers par sprint

---

## Phase 7 — TICKET 7 : Couverture tests

Hors scope de ce ticket (2-3 jours de travail). On peut creer le squelette de tests prioritaires :
1. `src/__tests__/auth-flow.test.ts`
2. `src/__tests__/gdpr-export.test.ts`

---

## Phase 8 — TICKET 8 : Contenu marketing factuel

**Actions** :
1. Scanner les composants pour chiffres non sources (regex `\d+,\d+\+|\d+%`)
2. Verifier que les corrections precedentes (suppression temoignages fictifs) sont toujours en place

---

## Scope de cette implementation

Etant donne l'ampleur (8 tickets), je propose d'implementer maintenant :

1. **Fix build** (Phase 0) — 6 fichiers edge functions
2. **XSS hardening** (Phase 2) — 3 fichiers + 1 composant SafeHtml
3. **JWT storage** (Phase 3) — 3 fichiers
4. **Test CI secrets** (Phase 1) — 1 fichier test

Les phases 4-8 necessitent des tickets separes.

### Fichiers modifies

| Fichier | Action |
|---------|--------|
| 6 x `supabase/functions/b2b-*/index.ts` | Ajouter `// @ts-nocheck` |
| `src/modules/journal/components/JournalList.tsx` | Ajouter DOMPurify |
| `src/components/animations/MicroInteractions.tsx` | Remplacer style inline |
| `src/components/ui/SafeHtml.tsx` | Creer wrapper centralise |
| `src/services/api/endpoints.ts` | Migrer vers sessionStorage |
| `src/services/api/fullApiService.ts` | Migrer vers sessionStorage |
| `src/services/api/errorHandler.ts` | Nettoyer reference localStorage |
| `src/__tests__/no-secrets-in-bundle.test.ts` | Test automatise |


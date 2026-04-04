# Rapport de nettoyage des dependances — EmotionsCare

**Date** : 2026-04-04
**Branche** : `claude/audit-and-refresh-emotionscare-dAOaM`

---

## 1. Dependances supprimees (inutilisees)

| Package | Raison de suppression |
|---------|----------------------|
| `@splinetool/react-spline` | Aucun import trouve dans src/ |
| `@sentry/tracing` | Deprecie, fonctionnalites integrees dans `@sentry/react` |
| `@vercel/analytics` | Aucun import dans src/ (reference uniquement dans une page de licences) |
| `lottie-react` | Aucun import dans src/ |
| `react-countup` | Aucun import dans src/ |
| `imagemin-avif` | Aucun import dans le projet |
| `imagemin-webp` | Aucun import dans le projet (dependances transitives vulnerables) |
| `tw-animate-css` | Aucun import dans src/ ni dans les fichiers CSS |
| `@types/react-helmet` | Package correspondant (`react-helmet`) non utilise ; `react-helmet-async` est utilise a la place |
| `lovable-tagger` | Boilerplate Lovable — supprime |
| `esbuild` (dep directe) | Fourni par Vite en tant que dependance transitive |

**Total : 11 dependances supprimees**

---

## 2. Dependances deplacees (dependencies -> devDependencies)

| Package | Raison |
|---------|--------|
| `@axe-core/playwright` | Utilise uniquement dans les tests E2E |
| `@typescript-eslint/eslint-plugin` | Outil de lint |
| `@typescript-eslint/parser` | Outil de lint |
| `@vitejs/plugin-react` | Plugin de build |
| `axe-core` | Utilise uniquement dans les tests |
| `cross-env` | Outil de scripts |
| `dotenv` | Utilise dans les scripts, pas dans le bundle |
| `eslint-plugin-import` | Outil de lint |
| `eslint-plugin-jsx-a11y` | Outil de lint |
| `eslint-plugin-react` | Outil de lint |
| `glob` | Utilise uniquement dans les scripts |
| `globby` | Utilise uniquement dans les scripts |
| `node-fetch` | Utilise uniquement dans les scripts |
| `sharp` | Utilise uniquement dans scripts/optimize-images.js |
| `terser` | Outil de build (minification) |
| `tsx` | Outil d'execution TypeScript pour scripts |

**Total : 16 dependances deplacees vers devDependencies**

---

## 3. Dependances mises a jour

| Package | Avant | Apres |
|---------|-------|-------|
| `react` | `^18.2.0` | `^18.3.1` |
| `react-dom` | `^18.2.0` | `^18.3.1` |

---

## 4. Vulnerabilites identifiees (npm audit)

| Severite | Package | Probleme |
|----------|---------|----------|
| **High** | `fastify` <= 5.8.2 | DoS via sendWebStream, Content-Type bypass, protocol spoofing |
| **High** | `kysely` <= 0.28.13 | SQL Injection via JSON path keys |
| **High** | `cross-spawn` < 6.0.6 | ReDoS (dependance transitive de imagemin-webp, supprime) |
| **High** | `got` <= 11.8.3 | Redirect to UNIX socket (dependance transitive, supprime avec imagemin-webp) |
| **High** | `http-cache-semantics` < 4.1.1 | ReDoS (dependance transitive, supprime avec imagemin-webp) |
| **High** | `lodash` <= 4.17.23 | Code Injection + Prototype Pollution |
| **High** | `minimatch` (multiples) | ReDoS (dependances transitives de eslint, glob, etc.) |
| **High** | `flatted` <= 3.4.1 | DoS + Prototype Pollution |
| **Moderate** | `dompurify` <= 3.3.1 | Mutation XSS, ADD_ATTR bypass, USE_PROFILES pollution |
| **Moderate** | `esbuild` <= 0.24.2 | Dev server request forgery |
| **Moderate** | `ajv` | ReDoS avec option `$data` |
| **Moderate** | `brace-expansion` | Zero-step sequence hang |

> La suppression de `imagemin-avif` et `imagemin-webp` elimine 4 chaines de vulnerabilites transitives (cross-spawn, got, http-cache-semantics, cacheable-request).

---

## 5. Nettoyage Lovable

### Fichiers modifies dans src/

| Fichier | Modification |
|---------|-------------|
| `src/integrations/supabase/client.ts` | Header `X-Client-Info` : `lovable-wellness-app` -> `emotionscare-app` |
| `src/lib/security/csp.ts` | Commentaire `Lovable badge` -> `External CDN` |
| `src/hooks/useSEOMeta.ts` | URL OG image : `emotions-care.lovable.app` -> `emotionscare.com` |
| `src/utils/mobileOptimizations.ts` | Ajout fallback Supabase Storage en plus de `lovable-uploads` |
| `src/contexts/music/useMusicGeneration.ts` | Commentaire JSDoc nettoye |
| `src/pages/admin/SEOAuditPage.tsx` | URL par defaut : `emotions-care.lovable.app` -> `emotionscare.com` |
| `src/pages/legal/PrivacyPolicyPage.tsx` | Hebergeur : `Lovable` -> `Vercel` |
| `src/pages/legal/MentionsLegalesPage.tsx` | Hebergeur web complet mis a jour vers Vercel Inc. |
| `src/features/scan/CameraSampler.tsx` | Log debug nettoye |
| `src/services/journalAIProcessor.ts` | Commentaire JSDoc nettoye |
| `src/hooks/useEmotionAnalysis.tsx` | Commentaire nettoye |
| `src/components/monitoring/MonitoringChatbot.tsx` | Message toast nettoye |
| `src/__tests__/data-management.test.ts` | URL de test : `emotions-care.lovable.app` -> `emotionscare.com` |

### Fichiers root modifies

| Fichier | Modification |
|---------|-------------|
| `vite.config.ts` | Import commente de `lovable-tagger` supprime |
| `package.json` | Script `lovable:push` renomme en `ci:push`, `lovable-tagger` supprime |

### Fichiers NON modifies (hors scope src/)

Les references Lovable dans `supabase/functions/` (CORS origins, API Gateway) et `docs/` n'ont pas ete modifiees car elles concernent l'infrastructure de production Edge Functions et la documentation historique.

---

## 6. Autres modifications

| Modification | Detail |
|-------------|--------|
| `package.json` name | Deja `emotionscare` (correct) |
| `package.json` homepage | Ajoute : `https://emotionscare.com` |
| `README.md` | Reecrit integralement — vitrine professionnelle sans reference Lovable |

---

## Avant / Apres

| Metrique | Avant | Apres |
|----------|-------|-------|
| Dependencies (production) | 128 | 101 |
| DevDependencies | 47 | 63 |
| Total packages declares | 175 + 2 optional | 164 + 2 optional |
| Deps inutilisees | 11 | 0 |
| Deps mal classees (dev en prod) | 16 | 0 |
| References Lovable dans src/ | 16 | 1 (backward compat `lovable-uploads`) |

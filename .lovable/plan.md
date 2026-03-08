

# Audit complet pré-production — EmotionsCare

---

## A. RÉSUMÉ EXÉCUTIF

| Domaine | Score | Verdict |
|---------|-------|---------|
| Sécurité | 7.5/10 | ⚠️ Corrections P0 requises |
| Branding | 5/10 | ❌ 1715 occurrences "Nyvée" résiduelles |
| Qualité du code | 4/10 | ❌ 1864 fichiers @ts-nocheck |
| SEO / Meta | 9/10 | ✅ Solide |
| Performance | 8.5/10 | ✅ Bon (chunking, lazy, cache) |
| Accessibilité | 8/10 | ✅ Bonne base (skip links, providers) |
| Infrastructure | 7/10 | ⚠️ Doublons headers, bun.lock résiduel |
| RGPD / Conformité | 8/10 | ✅ CookieBanner, ConsentProvider, DSAR |

**Verdict global : NON PRÊT pour la production.** 3 bloquants P0 à résoudre.

---

## B. DÉTAIL PAR DOMAINE

### 1. BRANDING — P0 BLOQUANT

**1715 occurrences "Nyvée/Nyvee"** dans 93 fichiers. La purge précédente n'a couvert qu'une fraction.

Fichiers critiques non nettoyés :
- `src/features/dashboard/nudges.ts` — Textes utilisateur : "Nyvée écoute tout en douceur", "Un mot à Nyvée"…
- `src/pages/social/MessagesPage.tsx` — `STORAGE_KEY = 'nyvee-chat-messages'`, nom de fichier export
- `src/modules/nyvee/hooks/useNyvee.ts` — Query keys `nyvee-stats`, `nyvee-sessions`
- `src/features/orchestration/` — Références `nyvee_calm`, `card-nyvee`, log catégorie `'NYVEE'`
- `src/lib/validation/schemas.ts`, orchestrators, spec files…

**Action** : Recherche exhaustive `grep -ri "nyv[ée]e" src/` et remplacement systématique dans les 93 fichiers. Les textes user-facing deviennent "Coach IA" ou "Cocon Respiration". Les clés internes (query keys, storage keys) doivent aussi migrer pour éviter la confusion en maintenance.

### 2. QUALITÉ DU CODE — P0 BLOQUANT

- **1864 fichiers avec `@ts-nocheck` ou `@ts-ignore`** — TypeScript strict est de facto désactivé sur la quasi-totalité du projet. Cela inclut des fichiers critiques : `AuthContext`, services, hooks, pages.
- **691 `console.log`** dans 28 fichiers (tests inclus). Vite `drop_console` en production atténue le risque, mais les fichiers de test devraient utiliser le logger.
- **180 TODO/FIXME** dans 26 fichiers — dette technique non résolue.
- **Estimation réaliste** : le retrait de tous les `@ts-nocheck` est un chantier de plusieurs semaines. Pour la mise en production, prioriser le retrait sur les fichiers critiques (auth, services, providers, routing).

**Action immédiate** : Retirer `@ts-nocheck` des 15 fichiers les plus critiques (AuthContext, api.ts, env.ts, providers, routerV2). Documenter le reste en dette technique avec timeline.

### 3. SÉCURITÉ

**Points positifs :**
- `TEST_MODE.BYPASS_AUTH = false` ✅
- `service_role` jamais côté front, tests de détection en place ✅
- CSP configurée (vercel.json + _headers) ✅
- Headers OWASP complets (HSTS, X-Frame-Options, COOP, CORP) ✅
- XSS : `SafeHtml` + DOMPurify + trigger DB ✅
- Sentry scrubbing des secrets ✅

**Points à corriger :**
- **`unsafe-inline` dans `style-src`** — La CSP dans `_headers` (root) et `csp.ts` inclut `'unsafe-inline'` pour les styles. Le scorecard admin affirme "CSP strict (no unsafe-inline)" ce qui est **faux**. Requis par Tailwind/Radix, mais le scorecard doit refléter la réalité.
- **3 fichiers `_headers`** (root `_headers`, `public/_headers`, `vercel.json`) avec des CSP **divergentes**. En production, une seule source doit prévaloir selon l'hébergeur (Vercel → `vercel.json`).
- **277 fichiers utilisent `localStorage`** — Beaucoup stockent des données non sensibles (préférences, historique UI), mais il faut vérifier qu'aucun JWT ou token n'y transite (memory note indique sessionStorage prioritaire).

**Action** : Unifier les headers en un seul fichier selon l'hébergeur cible. Corriger le scorecard admin. Auditer les 277 usages localStorage pour tout token/secret.

### 4. SEO / META

- `index.html` : JSON-LD riche (Organization, WebApplication, HowTo) ✅
- OG image 1200×630 avec cache-bust ✅
- `robots.txt` : GEO-optimisé (GPTBot, PerplexityBot, ClaudeBot autorisés) ✅
- `sitemap.xml` présent ✅
- `llms.txt` présent ✅
- `<noscript>` fallback ✅
- hreflang manquant dans `index.html` (mentionné dans les memories mais non visible)

**Action** : Ajouter `<link rel="alternate" hreflang="fr" href="https://emotionscare.com" />` et `hreflang="x-default"`.

### 5. PERFORMANCE

- Vite `manualChunks` bien structuré (15+ chunks isolés) ✅
- `terser` avec `drop_console` en prod ✅
- Sourcemaps désactivées en prod ✅
- PWA complète (manifest, service worker, workbox caching) ✅
- Polices Inter en `preload` + `display=swap` ✅
- Preconnect Supabase/Google Fonts ✅
- `chunkSizeWarningLimit: 300` (strict) ✅

**Point d'attention** : `bun.lock` existe à la racine du projet malgré la règle "jamais bun". Le supprimer.

### 6. INFRASTRUCTURE / DÉPLOIEMENT

- **3 fichiers de headers dupliqués** : `_headers` (root, Netlify), `public/_headers` (Netlify copie), `vercel.json` (Vercel). Si le déploiement est Vercel, seul `vercel.json` compte. Les autres sont du bruit.
- **~280 Edge Functions** déployées — consolidation en 8 super-routers documentée mais les fonctions individuelles sont toujours présentes. Elles consomment des ressources et augmentent la surface d'attaque.
- **`flyway.conf`** a `flyway.url` défini deux fois (lignes 1 et 3) — conflit de configuration.

### 7. RGPD / CONFORMITÉ

- `CookieBanner` global dans `RootProvider` ✅
- `ConsentProvider` ✅
- `PolicyAcceptanceModal` ✅
- Edge functions GDPR dédiées (export, deletion, DSAR) ✅
- Documentation HDS dans `docs/compliance/` ✅

---

## C. PLAN D'ACTION PRIORISÉ

### P0 — Bloquants production (à faire AVANT mise en ligne)

| # | Ticket | Estimation |
|---|--------|-----------|
| 1 | **Purge complète Nyvée** — 93 fichiers, textes user-facing + clés internes | 3h |
| 2 | **Retirer @ts-nocheck des 15 fichiers critiques** (auth, api, providers, router) | 2h |
| 3 | **Unifier les headers de sécurité** — Supprimer doublons, garder uniquement le fichier correspondant à l'hébergeur cible | 0.5h |
| 4 | **Ajouter hreflang** dans `index.html` | 0.25h |
| 5 | **Supprimer `bun.lock`** de la racine | 0.1h |
| 6 | **Corriger `flyway.conf`** — double `flyway.url` | 0.1h |

### P1 — Important post-lancement

| # | Ticket | Estimation |
|---|--------|-----------|
| 7 | Auditer les 277 fichiers `localStorage` pour tokens/secrets | 1h |
| 8 | Corriger le scorecard admin (unsafe-inline réalité vs affichage) | 0.25h |
| 9 | Nettoyer les 180 TODO/FIXME restants | 2h |
| 10 | Plan de retrait progressif des @ts-nocheck (1849 fichiers restants) | Planifier |

### P2 — Maintenance continue

| # | Ticket |
|---|--------|
| 11 | Supprimer les Edge Functions individuelles remplacées par les super-routers |
| 12 | Atteindre 90% couverture de tests (objectif custom knowledge) |
| 13 | Supprimer les 691 console.log des fichiers de test |

---

## D. RECOMMANDATION

**Ne pas publier en l'état.** Les 1715 occurrences Nyvée dans l'UI et les 1864 `@ts-nocheck` représentent des risques de confusion utilisateur et de dette technique critique. Les tickets P0 (1–6) totalisent ~6h de travail et sont nécessaires avant toute mise en production.

Souhaitez-vous que j'implémente les tickets P0 ?


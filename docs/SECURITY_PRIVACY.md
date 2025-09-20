# 🔒 Sécurité & Privacy – Règles clés

Ce référentiel regroupe les règles incontournables déjà implémentées dans le codebase. Toute nouvelle feature doit les respecter à la lettre.

## 🚫 Interdiction des imports `node:*` côté client
- ESLint (`eslint.config.js`) interdit `node:*` sur `src/**` (`no-restricted-imports`).
- Utiliser les APIs Web :
  - Hash → `src/lib/hash.ts` (Web Crypto `crypto.subtle`).
  - Fichiers → `File`, `Blob`, `URL`.
  - Streams → `ReadableStream`.
- Exceptions : dossiers `services/**` & `supabase/functions/**` (server/edge uniquement).

## 🔐 Hash & pseudonymisation
- `src/lib/hash.ts` fournit `sha256(text)` basé uniquement sur Web Crypto.
- Edge : `_shared/hash_user.ts` (Deno) applique le même algo → cohérence côté serveur.
- Aucun UUID utilisateur brut n'est loggé ; toujours passer par `hash(user.id)`.

## 🛡️ Sentry sans PII
- `src/lib/sentry-config.ts` sanitize tout avant envoi :
  - URLs tronquées (`sanitizeUrl`).
  - Payloads JSON purgés (`sanitizeData`, `sensitiveKeyPattern`).
  - `event.user` réduit à `{ id, ip_address }` si présent.
  - Breadcrumbs limités à 50 items et `message` scrub.
- Les modules sensibles (Coach, Journal, Community) ajoutent uniquement des longueurs/flags, jamais de texte brut.

## 🗄️ RLS & accès données
- Toutes les tables sensibles (`emotion_scans`, `sessions`, `journal_entries`, `clinical_feature_flags`, `org_assess_rollups`, etc.) sont sous **Row Level Security**.
- Policies : owner-only pour les tables utilisateur, accès service-role restreint sur les Edge (clé `SUPABASE_SERVICE_ROLE_KEY`).
- Scripts/Edge vérifient les variables d'environnement (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) avant d'exécuter.

## 🤖 Robots & indexation
- Les Edge Functions appliquent `X-Robots-Tag: noindex` via `applySecurityHeaders` (`supabase/functions/_shared/http.ts`).
- Côté frontend, `PageSEO` accepte `noIndex` → toutes les pages `/app/` sensibles l'activent.
- Les pages partage B2B (`/app/reports/:period?share=staff`) définissent `noindex` pour éviter toute indexation accidentelle.

## 🙅 Respect du doNotTrack
- `useClinicalConsent` (`src/hooks/useClinicalConsent.ts`) vérifie `navigator.doNotTrack`, `msDoNotTrack`, `window.doNotTrack`.
- Si DNT est actif, les assessments & certains trackers (performance monitor) sont désactivés par défaut.

## ✅ Checklist avant merge
- [ ] Aucune dépendance `node:*` dans `src/**`.
- [ ] Hash utilisateur via `sha256` (Web Crypto) pour tout log/ID client.
- [ ] Nouveaux logs Sentry passent par `captureException`/`addBreadcrumb` sans PII.
- [ ] Nouveaux endpoints Supabase : policies RLS + `noindex` si exposent des données.
- [ ] DNT respecté pour toute nouvelle collecte (fallback opt-out explicite).

> _Cette page complète `docs/PRIVACY.md`. En cas de doute, contacter legal/security avant de merger._

# Observabilité EmotionsCare

Ce document décrit les briques livrées pour l'observabilité actionnable de la plateforme : instrumentation Sentry côté web et edge, export OpenTelemetry, endpoint `/api/health` et vérification CI.

## Sentry — Web (Next.js)

- L'initialisation du SDK se fait dans [`src/lib/obs/sentry.web.ts`](../src/lib/obs/sentry.web.ts). Le module lit les variables :
  - `NEXT_PUBLIC_SENTRY_DSN` (obligatoire pour activer la collecte),
  - `SENTRY_ENVIRONMENT` (tag d'environnement),
  - `SENTRY_RELEASE` (version/release associée aux événements),
  - `SENTRY_TRACES_SAMPLE_RATE` (optionnel, trace sampling entre 0 et 1, `0.2` par défaut).
- Toute donnée transite par le scrubbing `redact` pour supprimer e-mails, tokens, IDs et query params sensibles.
- Pour tracer une action métier, utilisez le helper [`addBreadcrumb`](../src/lib/obs/breadcrumb.ts) :
  ```ts
  import { addBreadcrumb } from '@/lib/obs/breadcrumb';

  addBreadcrumb('ui.click', { id: 'nyvee.start' }, 'cta:nyvee');
  ```
  Le `message` est optionnel, les données sont automatiquement anonymisées.
- Les Web Vitals sont captées par défaut via `@sentry/nextjs` (LCP/FID/CLS) et enrichies par transaction.

## Sentry — Edge Functions

- Le wrapper partagé se trouve dans [`supabase/functions/_shared/sentry.ts`](../supabase/functions/_shared/sentry.ts).
- `initSentry()` retourne un client opérationnel (ou un no-op si le DSN est absent). Les variables attendues :
  - `SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_RELEASE`, `SENTRY_TRACES_SAMPLE_RATE`.
- Le scrubbing supprime headers/cookies, nettoie les contexts et tronque les payloads pour éviter toute fuite PII.
- Exemple d’utilisation dans une Edge Function :
  ```ts
  import { initSentry } from '../_shared/sentry.ts';

  const Sentry = initSentry();

  try {
    // … logique métier …
  } catch (error) {
    Sentry.captureException(error);
    return new Response('error', { status: 500 });
  }
  ```

## OpenTelemetry — Edge

- [`supabase/functions/_shared/otel.ts`](../supabase/functions/_shared/otel.ts) configure un `BasicTracerProvider` avec export OTLP HTTP.
- Variables supportées :
  - `OTEL_EXPORTER_OTLP_ENDPOINT` (URL du collector),
  - `OTEL_EXPORTER_OTLP_HEADERS` (ex. `Authorization=Bearer <token>`),
- Utilisez le helper `traced(name, fn, attributes?)` pour entourer un appel sortant :
  ```ts
  import { traced } from '../_shared/otel.ts';

  const { error } = await traced('supabase.query', () =>
    supabase.from('profiles').select('id', { head: true, count: 'exact' })
  , { 'db.system': 'postgresql', 'db.table': 'profiles' });
  ```
  Les erreurs sont enregistrées sur le span et l’export OTLP est no-op si l’endpoint est vide (rollback simple).

## Endpoint `/api/health`

- Localisation : [`src/app/api/health/route.ts`](../src/app/api/health/route.ts).
- Réponse type :
  ```json
  {
    "status": "ok",
    "supabase_ms": 120,
    "edge_ms": 45,
    "storage_ms": 88,
    "version": "<SENTRY_RELEASE>",
    "env": "<SENTRY_ENVIRONMENT>"
  }
  ```
- Pings réalisés :
  1. `supabase.from('assessments').select('id', { head: true, limit: 1 })` (service role recommandé),
  2. `POST` sur l'Edge Function [`health-edge`](../supabase/functions/health-edge/index.ts) pour mesurer le cold start edge,
  3. `HEAD` sur `storage/v1/object/public/health/pixel.png`.
- Options de sécurité :
  - `HEALTH_ACCESS_KEY` impose un header `X-EC-Health-Key` (401 sinon),
  - `HEALTH_SOFT_FAIL=true` renvoie `status: "degraded"` au lieu d'un HTTP 503 en cas d'échec (pratique pour la CI ou les monitors passifs).
- Latences mesurées via `performance.now()` (no-store et `x-robots-tag: noindex`).

## Workflow CI

- Le job dédié se trouve dans [`.github/workflows/health.yml`](../.github/workflows/health.yml).
- Entrées attendues : `preview-url` (URL du déploiement, par ex. `https://preview-url.vercel.app`).
- Étapes principales :
  1. `curl` sur `<preview>/api/health`,
  2. vérification des seuils (Supabase ≤ 800 ms, Edge ≤ 600 ms, Storage ≤ 600 ms),
  3. mise à disposition du JSON en artefact.

## Variables d’environnement clés

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SENTRY_DSN` | Active la collecte Sentry côté navigateur.
| `SENTRY_RELEASE` | Identifiant de version (généralement `$GITHUB_SHA`). |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | URL du collector OTLP HTTP. |
| `OTEL_EXPORTER_OTLP_HEADERS` | Headers additionnels (`key=value` séparés par des virgules). |
| `NEXT_PUBLIC_BASE_URL` | Base URL publique du frontend (utilisée pour joindre les Edge Functions). |
| `HEALTH_ACCESS_KEY` | Clé optionnelle pour restreindre `/api/health`. |
| `HEALTH_SOFT_FAIL` | `true` ⇒ le endpoint reste en 200 avec `status="degraded"` en cas d’erreur. |

## Troubleshooting

- **Pas d’événements Sentry ?** Vérifier `NEXT_PUBLIC_SENTRY_DSN` et l’environnement (`SENTRY_ENVIRONMENT`).
- **Pas de spans OTEL ?** S’assurer que l’endpoint OTLP est accessible depuis les Edge Functions Supabase et que les headers d’authentification sont valides.
- **/api/health en erreur 503 ?** Tester manuellement chaque ping (Supabase, edge, storage) et consulter la clé `error` du JSON pour la cause (`config_missing`, `supabase_error`, `storage_<code>`, …).
- **Soft fail** : lorsque `HEALTH_SOFT_FAIL=true`, surveillez tout de même `status: degraded` dans la CI — la pipeline échouera si un seuil dépasse la limite.

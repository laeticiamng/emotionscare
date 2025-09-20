# Observabilité EmotionsCare

Ce document décrit la nouvelle instrumentation d'observabilité commune au front (Next.js), aux Edge Functions Supabase et aux vérifications de santé automatisées.

## Sentry Web (Next.js)

- L'initialisation est centralisée dans [`src/lib/obs/sentry.web.ts`](../src/lib/obs/sentry.web.ts). Elle s'active uniquement si `NEXT_PUBLIC_SENTRY_DSN` est défini.
- Les variables supportées :
  - `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE` (défaut `0.2`).
  - `NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE` et `NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE` (désactivés par défaut).
  - `SENTRY_ENVIRONMENT` / `SENTRY_RELEASE` pour le ciblage des environnements et la corrélation avec les déploiements.
- Les événements et breadcrumbs transitent par le redactor [`src/lib/obs/redact.ts`](../src/lib/obs/redact.ts) pour éviter la fuite de PII.
- Un helper unique [`addBreadcrumb`](../src/lib/obs/breadcrumb.ts) masque automatiquement les données sensibles avant de logger l'action :

```ts
import { addBreadcrumb } from '@/lib/obs/breadcrumb';

addBreadcrumb('ui.click', { message: 'nyvee:start', data: { id: 'nyvee.start' } });
```

Ce helper est déjà branché sur les flux musicaux (`useMusicSession`) et d'évaluations (`useAssessment`) pour tracer les CTA et les soumissions sans payload.

## Sentry Edge Functions (Deno)

- Le fichier partagé [`supabase/functions/_shared/sentry.ts`](../supabase/functions/_shared/sentry.ts) initialise Sentry côté Edge (via `@sentry/deno@8`).
- Les helpers `addSentryBreadcrumb`, `captureSentryException` et le nouvel `initSentry()` restent disponibles pour les fonctions critiques.
- Les variables d'environnement à prévoir : `SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_RELEASE` et `SENTRY_TRACES_SAMPLE_RATE` (clampée entre 0.1 et 0.2).

## OpenTelemetry sur les Edge Functions

- [`supabase/functions/_shared/otel.ts`](../supabase/functions/_shared/otel.ts) installe un `BasicTracerProvider` + `BatchSpanProcessor` + export OTLP HTTP.
- Activation automatique dès que `OTEL_EXPORTER_OTLP_ENDPOINT` est défini (headers optionnels via `OTEL_EXPORTER_OTLP_HEADERS`, ex. `Authorization=Bearer <token>`).
- Helper `traced(name, fn, { attributes })` qui enrobe les appels asynchrones (Supabase REST, inserts coach, etc.) pour produire des spans nommés `supabase.query` avec des attributs (`table`, `operation`, `route`, ...).
- Les fonctions `assess-start`, `assess-submit` et `ai-coach` utilisent désormais `traced` sur chaque requête Supabase.

## Endpoint `/api/health`

- Implémenté dans [`src/app/api/health/route.ts`](../src/app/api/health/route.ts) (route handler Next.js, `dynamic = "force-dynamic"`).
- Réponses JSON :
  ```json
  {
    "status": "ok" | "degraded",
    "supabase_ms": <nombre|nul>,
    "edge_ms": <nombre|nul>,
    "storage_ms": <nombre|nul>,
    "version": "...",
    "env": "...",
    "checked_at": "ISO-8601",
    "errors": { "supabase"?: "...", "edge"?: "...", "storage"?: "..." }
  }
  ```
- `status = degraded` si au moins une sonde échoue. Si `HEALTH_SOFT_FAIL=true`, la route renvoie malgré tout `200` (sinon `503`).
- Mesures réalisées :
  - Lecture Supabase (table `assessments`, `select ... limit 1`).
  - Appel de l'Edge Function [`health-edge`](../supabase/functions/health-edge/index.ts) (POST, latence cold-start incluse).
  - `HEAD` sur un objet de stockage public (`/storage/v1/object/public/health/pixel.png`).
- Sécurisation optionnelle via un header `X-EC-Health-Key` (secret `EC_HEALTH_KEY`).
- Caching désactivé (`Cache-Control: no-store`, `X-Robots-Tag: noindex`).

### Variables associées

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_BASE_URL` | Base utilisée pour joindre `/functions/v1/health-edge`.
| `SUPABASE_SERVICE_ROLE_KEY` | Requis pour pinger la base et les Edge Functions.
| `EC_HEALTH_KEY` | (Optionnel) clef d'accès à `/api/health`.
| `HEALTH_SOFT_FAIL` | Permet d'obtenir `200` en cas de dégradation (runbook CI). |

## Health check côté Edge

- Fonction [`supabase/functions/health-edge`](../supabase/functions/health-edge/index.ts) : répond instantanément `200` (`{ ok: true }`) et gère `OPTIONS`.
- Utilisée pour mesurer la latence des Edge Functions (dont le temps de cold start).

## CI – Job de santé

- Workflow GitHub [`health.yml`](../.github/workflows/health.yml) :
  - Déclenché sur `deployment_status` (succès) ou manuellement (`workflow_dispatch`).
  - Récupère l'URL preview (`environment_url` ou input manuel), appelle `/api/health`.
  - Vérifie que les latences sont sous les seuils suivants : Supabase ≤ 800 ms, Edge ≤ 600 ms, Storage ≤ 600 ms.
  - Upload du JSON en artefact (`health-check.json`).
  - Respecte la clef `EC_HEALTH_KEY` si définie (`secrets.EC_HEALTH_KEY`).

## Checklist d'exploitation

1. **Sentry Web** : vérifier que l'environnement/release correspond au déploiement courant et que les breadcrumbs anonymisés apparaissent (`ui.click`, `assess`, `music`, ...).
2. **Sentry Edge** : confirmer la remontée des exceptions sur les fonctions `assess-*` / `ai-coach` et l'absence de PII dans les extras/breadcrumbs.
3. **Traces OTel** : rechercher le service `ec-edge` dans le collecteur OTLP ; chaque requête Supabase doit produire un span `supabase.query` avec la table cible.
4. **/api/health** : observer les latences pour la runbook (objectif < 800/600/600 ms). Utiliser `HEALTH_SOFT_FAIL=false` en production pour forcer un code 503 lors d'une panne.
5. **Workflow CI** : le job `health` doit rester vert avant merge. En cas d'échec, consulter l'artefact JSON et les logs pour identifier le composant fautif.

## Rollback rapide

- **Sentry Web/Edge** : vider `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_DSN`.
- **OTel** : retirer `OTEL_EXPORTER_OTLP_ENDPOINT` → les spans ne sont plus exportés mais le code reste fonctionnel.
- **/api/health** : passer `HEALTH_SOFT_FAIL=true` pour conserver un `200` le temps d'une investigation (sans masquer les champs `errors`).

# Assessments Edge API Contract

These serverless endpoints orchestrate opt-in clinical assessments on Supabase Edge Functions. They expose text-only assets and summaries without revealing any numeric scores or personal responses.

## Shared Requirements

- **Authentication**: Every request must include a valid Supabase JWT in the `Authorization: Bearer <token>` header. Requests without a token return `401`.
- **CORS**: Only origins listed in the `CORS_ORIGINS` environment variable are accepted. Others receive a `403`.
- **Methods & Content Type**: Only `POST` is supported, with `application/json` payloads. `OPTIONS` requests are handled for preflight.
- **Rate limiting**: A per-user token bucket throttles each route (default 30 req/min, configurable via `EDGE_RATE_LIMIT_*` env variables). Exceeding limits yields `429` with retry metadata.
- **Logging & Privacy**: Access is logged with hashed identifiers only. Answers are never logged nor stored; only derived summaries are persisted.
- **Sentry**: Breadcrumbs (`assess:start`, `assess:submit`, `assess:aggregate`) and unexpected errors are reported when `SENTRY_DSN` is configured.

## Catalogue Delivery — `POST /assess/start`

Retrieves the textual items of a validated instrument.

### Request body

```json
{
  "instrument": "WHO5",
  "locale": "fr"
}
```

- `instrument` (required): one of `WHO5`, `STAI6`, `PANAS`.
- `locale` (optional): `fr` (default) or `en`.

### Successful response

```json
{
  "instrument": "WHO5",
  "locale": "fr",
  "version": "1.0.0",
  "items": [
    { "id": "w1", "text": "Je me suis senti(e) joyeux(se) et de bonne humeur.", "scale": ["Jamais", "Parfois", "Souvent", "Très souvent", "Toujours"] }
  ]
}
```

No scores or numeric hints are returned—only text labels and optional scales.

### Errors

- `401` if JWT is missing/invalid.
- `403` if origin is not allowed.
- `405` for unsupported methods.
- `422` for unknown instruments or malformed bodies.
- `429` when rate limited.

## Submission — `POST /assess/submit`

Validates responses, creates a qualitative summary server-side, and inserts it into `assessments` via RLS.

### Request body

```json
{
  "instrument": "WHO5",
  "answers": { "w1": 4, "w2": "souvent" },
  "ts": "2025-03-01T10:15:00.000Z"
}
```

- `instrument`: required and validated against the catalogue.
- `answers`: non-empty record of item IDs to string/number/boolean values.
- `ts` (optional): ISO timestamp used for storage (defaults to current server time).

### Successful response

```json
{
  "status": "ok",
  "stored": true
}
```

### Storage behaviour

- Only the textual summary and qualitative focus are persisted in `assessments.score_json`.
- Individual answers are **never** stored or returned.
- Server-side summarisation ensures no numeric score leaves the edge layer.

### Errors

- `401`, `403`, `405`, `422`, `429` as above.
- `500` with `{ "error": "configuration_error" }` if Supabase env keys are missing.
- `500` with `{ "error": "storage_failed" }` if insertion fails (also captured in Sentry).

## Aggregation — `POST /assess/aggregate`

Reads organisation rollups from `org_assess_rollups` with a defence-in-depth filter enforcing `n ≥ 5`.

### Request body

```json
{
  "org_id": "org-123",
  "period": "2025-Q1",
  "instruments": ["WHO5", "STAI6"]
}
```

- `org_id`: required (hashed in logs).
- `period`: required (e.g. `2025-Q1`).
- `instruments`: optional whitelist; when omitted, all available rollups are returned.

### Successful response

```json
{
  "summaries": [
    {
      "instrument": "WHO5",
      "period": "2025-Q1",
      "text": "Équipe sereine et • initiatives positives."
    }
  ]
}
```

Digits are scrubbed to avoid leaking counts. Each entry represents qualitative phrases only.

### Errors

- `401`, `403`, `405`, `422`, `429` as above.
- `500` with `{ "error": "configuration_error" }` if service key is missing.
- `500` with `{ "error": "read_failed" }` on query failures (also reported to Sentry).

## Environmental Variables

| Variable | Purpose |
| --- | --- |
| `CORS_ORIGINS` | Comma-separated list of allowed origins. |
| `SUPABASE_URL` | Supabase project URL. |
| `SUPABASE_ANON_KEY` | Anonymous key used with end-user JWT for RLS inserts. |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for aggregate reads. |
| `SENTRY_DSN` | Optional DSN to enable Sentry reporting. |
| `EDGE_RATE_LIMIT_ASSESS_START` | Optional override for `/assess/start` rate limit. |
| `EDGE_RATE_LIMIT_ASSESS_SUBMIT` | Optional override for `/assess/submit`. |
| `EDGE_RATE_LIMIT_ASSESS_AGGREGATE` | Optional override for `/assess/aggregate`. |

## Testing

Contract tests live in `supabase/tests/assess-functions.test.ts` and cover:

- Authentication and CORS failures (`401`, `403`).
- Validation errors (`422`).
- Rate limiting (`429`).
- Successful flows with qualitative outputs only.
- Database failure scenarios reporting `500` while protecting payloads.

Run them via:

```bash
npx vitest run supabase/tests/assess-functions.test.ts
```

---

These guarantees ensure the assessment experience stays privacy-first, numeric-free on the client, and observable through Sentry breadcrumbs and hashed audit logs.
# Clinical Assessments Contract

This document captures the canonical schema and guardrails for the opt-in clinical
assessment subsystem. The data model is intentionally minimalistic and stores only
textual summaries that orchestrate B2C modules and unlock aggregated B2B insights.

## Tables

### `public.assessments`
- `id` (`uuid`, PK, default `gen_random_uuid()`)
- `user_id` (`uuid`, FK → `auth.users.id`, cascade delete)
- `instrument` (`text`) — questionnaire code such as `WHO5`, `STAI6`, `PANAS`.
- `score_json` (`jsonb`) — strict summary payload `{ summary: string, subs?: object }`.
- `ts` (`timestamptz`, default `now()`) — assessment capture timestamp.

**Rules**
- Never store raw questionnaire responses or any PII.
- Row Level Security is enabled and locked to the owner (`auth.uid() = user_id`) for
  all operations (select/insert/update/delete).
- Indexed by `(user_id, ts desc)` and `(instrument, ts desc)` for fast lookups.

### `public.org_assess_rollups`
- `id` (`uuid`, PK, default `gen_random_uuid()`)
- `org_id` (`uuid`) — external organization reference.
- `period` (`text`) — aggregation period key such as `2025-W38` or `2025-09`.
- `instrument` (`text`) — questionnaire code such as `WEMWBS`, `CBI`, `UWES`.
- `n` (`int`) — participant count contributing to the rollup (must be ≥ 5).
- `text_summary` (`text`) — qualitative aggregation (“semaine plus posée”, etc.).
- `created_at` (`timestamptz`, default `now()`).

**Rules**
- Absolutely no individual metrics or identifiers; text-only qualitative insight.
- Unique per `(org_id, period, instrument)` to avoid duplicate rollups.
- Database constraint `org_rollups_min_n` enforces `n >= 5`.
- Indexed by `(org_id, period)` and `instrument` for B2B reporting filters.

## Seeds

Development seeds insert two demo assessments and two organization rollups using the
placeholder IDs:
- `demo_uid`: `00000000-0000-0000-0000-000000000001`
- `demo_org_id`: `11111111-1111-1111-1111-111111111111`

Override these variables when running the seed script to match your local Supabase
users and organization references.

## Checks

Post-migration SQL checks verify:
- RLS is enabled and at least two policies exist on `public.assessments`.
- The `org_rollups_min_n` constraint is present and rejects `n < 5` inserts.

Run `pnpm db:check` after applying migrations to assert these guarantees. Any change
to this contract must be documented here and shipped through a dedicated PR.

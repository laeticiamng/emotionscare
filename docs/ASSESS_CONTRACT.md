# Clinical Assessments Edge Contract

This reference freezes the front ↔ edge ↔ database contract for the opt-in clinical
assessment flow. The module is deliberately text-only: neither the edge layer nor the
client ever exposes numeric scores, only validated textual prompts and qualitative
summaries.

## Philosophy & Guardrails

- **Privacy-first**: Inputs stay on the device; only qualitative summaries cross the
  network. All persisted fields are textual.
- **Strict minimum sample size**: Any aggregate leaving the edge obeys `min_n ≥ 5` to
  prevent re-identification.
- **Deterministic interfaces**: Every endpoint uses a stable JSON schema with explicit
  versioning and cache rules so that the front-end can ship without defensive parsing.
- **Respect for consent**: A `X-DNT: 1` header disables telemetry and Sentry breadcrumbs
  while still serving the assessment content.

## Front ↔ Edge ↔ DB Workflow

1. **Catalogue fetch**: The front-end calls `POST /assess/start` to fetch the textual
   items of an instrument. The edge validates cadence rules, then returns the form
   payload, a qualitative `signal_id`, and its TTL.
2. **Local completion**: The user answers locally; the front sends the qualitative
   answers with the opaque `signal_id` to `POST /assess/submit`.
3. **Edge synthesis**: The edge converts answers into a text-only summary and writes it
   into `public.assessments.score_json` using the caller JWT (RLS enforced).
4. **Rollups**: Organisation dashboards call `POST /assess/aggregate` with a service
   token. The edge reads `public.org_assess_rollups` and only returns entries with
   `n ≥ 5`.
5. **Flags broadcast**: Any safeguarding flags computed server-side surface in the
   response so the front-end can decide whether to show crisis resources, without ever
   exposing raw scores.

## Endpoint Catalogue

### `POST /assess/start`

Delivers the textual catalogue and announces cadence, feature flags, and signal TTL.

#### Request schema

```json
{
  "instrument": "WHO5",
  "locale": "fr",
  "preview": false
}
```

- `instrument` (required) — `WHO5`, `STAI6`, `PANAS`, `WEMWBS`.
- `locale` (optional) — defaults to `fr`; `en` supported.
- `preview` (optional) — `true` bypasses cadence checks for staff dashboards. Requires
  a JWT containing `role=staff`.
- Headers: `Authorization: Bearer <JWT>` and optional `X-DNT: 1` to disable telemetry.

#### Successful response

```json
{
  "instrument": "WHO5",
  "locale": "fr",
  "version": "1.1.0",
  "items": [
    {
      "id": "w1",
      "text": "Je me suis senti(e) joyeux(se) et de bonne humeur.",
      "scale": ["Jamais", "Parfois", "Souvent", "Très souvent", "Toujours"]
    }
  ],
  "flags": ["show_self_help"],
  "signal_id": "sig_2q8L7w9",
  "signal_ttl_seconds": 900,
  "next_allowed_at": "2025-03-12T08:00:00.000Z"
}
```

- `flags` — optional front-end toggles (see [Safeguarding flags](#safeguarding-flags)).
- `signal_id` — opaque token echoed on submission to correlate the qualitative summary.
- `signal_ttl_seconds` — TTL for `signal_id` storage in edge KV (text-only metadata).
- `next_allowed_at` — cadence enforcement timestamp calculated per instrument.

#### Error responses

- `401` `{ "error": "unauthorized" }` — missing or invalid JWT.
- `403` `{ "error": "forbidden_origin" }` — origin not in `CORS_ORIGINS`.
- `409` `{ "error": "cadence_violation", "retry_at": "2025-03-12T08:00:00Z" }` —
  instrument requested too soon.
- `422` `{ "error": "invalid_payload", "field": "instrument" }` — schema mismatch.
- `429` `{ "error": "rate_limited", "retry_after": 30 }` — per-user rate limit.

### `POST /assess/submit`

Validates the qualitative answers and stores the summarised payload in Supabase.

#### Request schema

```json
{
  "instrument": "WHO5",
  "answers": {
    "w1": "souvent",
    "w2": "presque toujours"
  },
  "signal_id": "sig_2q8L7w9",
  "ts": "2025-03-11T09:15:00.000Z"
}
```

- `answers` — non-empty object of string/number/boolean values. Raw text is never
  persisted; it is converted to qualitative summaries only.
- `signal_id` — must match an active token from `/assess/start`.
- `ts` — optional ISO timestamp; defaults to current edge clock (UTC).

#### Successful response

```json
{
  "status": "ok",
  "stored": true,
  "flags": ["offer_follow_up"],
  "summary": "Tonalité globalement positive avec besoin de repos annoncé.",
  "ttl_acknowledged": 600
}
```

- `flags` — safeguarding guidance for the UI (text-only cues).
- `summary` — qualitative copy also inserted into `score_json.summary`.
- `ttl_acknowledged` — seconds remaining before the `signal_id` expires server-side.

#### Error responses

- `401` `{ "error": "unauthorized" }` — authentication failure.
- `404` `{ "error": "unknown_signal" }` — stale or unknown `signal_id`.
- `409` `{ "error": "cadence_violation" }` — submission occurred before cooldown.
- `422` `{ "error": "invalid_answers", "field": "answers.w2" }` — schema mismatch.
- `500` `{ "error": "storage_failed", "id": "evt_93c" }` — Supabase insert failed
  (event ID logged in Sentry unless `X-DNT: 1`).

### `POST /assess/aggregate`

Surface text-only organisational rollups sourced from `public.org_assess_rollups`.

#### Request schema

```json
{
  "org_id": "org-123",
  "period": "2025-Q1",
  "instruments": ["WHO5", "STAI6"],
  "include_flags": true
}
```

- Requires a service-role JWT. The edge double-checks `role=service` claims.
- `include_flags` — optional to surface safeguarding flags aggregated at org level.

#### Successful response

```json
{
  "summaries": [
    {
      "instrument": "WHO5",
      "period": "2025-Q1",
      "text": "Équipe sereine et initiatives positives.",
      "flags": [],
      "n": 18
    }
  ],
  "min_n_enforced": true
}
```

- `n` reflects the original sample size but is only returned when `n ≥ 5`. Numeric
  values below 5 are rejected server-side and never leave the edge.

#### Error responses

- `401` `{ "error": "unauthorized" }` — missing/invalid service token.
- `403` `{ "error": "insufficient_role" }` — JWT lacks `role=service`.
- `422` `{ "error": "invalid_period" }` — malformed period filter.
- `429` `{ "error": "rate_limited" }` — aggregate burst throttling (shared pool).
- `500` `{ "error": "read_failed", "id": "evt_b41" }` — database read failure.

## Instrument Cadence & Signal TTL

| Instrument | Cooldown (per user) | Signal TTL | Default Flags | Notes |
| --- | --- | --- | --- | --- |
| `WHO5` | 7 days | 15 minutes | `show_self_help` | Baseline wellbeing pulse. |
| `STAI6` | 3 days | 10 minutes | `offer_follow_up` | Anxiety screen, triggers coach ping when flagged. |
| `PANAS` | 1 day | 10 minutes | none | Used for daily journaling prompts. |
| `WEMWBS` | 14 days | 20 minutes | `show_self_help` | Extended wellbeing module with richer copy. |

Cadence windows are enforced at both `/assess/start` and `/assess/submit`; violating
calls receive `409` with the `retry_at` timestamp.

## Safeguarding Flags

The edge layer emits text-only flags for the front-end to adapt UI copy without any
numeric disclosures:

- `show_self_help` — highlight self-care resources and breathing exercises.
- `offer_follow_up` — suggest booking a coach call; shown only once per cooldown.
- `escalate_hotline` — render crisis hotline text (never auto-dial).
- `dnt_active` — present when `X-DNT: 1` is honoured so that the UI can mirror the
  privacy setting.

Flags propagate through all endpoints. Aggregated flags never enumerate individuals;
only counts ≥ 5 are rolled up before a flag is emitted at org level.

## Schema Reference

### `public.assessments`
- `id` (`uuid`, PK, default `gen_random_uuid()`)
- `user_id` (`uuid`, FK → `auth.users.id`, cascade delete)
- `instrument` (`text`) — questionnaire code such as `WHO5`, `STAI6`, `PANAS`, `WEMWBS`.
- `score_json` (`jsonb`) — `{ "summary": string, "flags": string[] }`, text-only.
- `signal_expires_at` (`timestamptz`) — TTL mirror for auditing (no raw answers).
- `ts` (`timestamptz`, default `now()`) — assessment capture timestamp.

**Rules**
- No raw questionnaire responses or PII stored.
- Row Level Security limits operations to the owner (`auth.uid() = user_id`).
- Indexes on `(user_id, ts DESC)` and `(instrument, ts DESC)` for fast lookups.

### `public.org_assess_rollups`
- `id` (`uuid`, PK, default `gen_random_uuid()`)
- `org_id` (`uuid`) — external organisation reference.
- `period` (`text`) — aggregation key such as `2025-W38` or `2025-09`.
- `instrument` (`text`) — questionnaire code.
- `n` (`int`) — participant count; contrainte `org_rollups_min_n_non_negative` impose `n ≥ 0` (RLS coupe sous 5).
- `text_summary` (`text`) — qualitative aggregation (e.g. “semaine plus posée”).
- `flags` (`text[]`) — union of safeguarding cues already anonymised.
- `created_at` (`timestamptz`, default `now()`).

**Rules**
- Unique per `(org_id, period, instrument)` to avoid duplicates.
- Returns only text fields; metrics sous 5 réponses sont filtrées par RLS côté base.
- Indexes on `(org_id, period)` and `instrument` for reporting filters.

## DNT & Observability

- When the front-end sends `X-DNT: 1`, the edge skips Sentry breadcrumbs and avoids
  writing hashed identifiers to logs. A `dnt_active` flag is added to responses so the
  UI can surface a privacy badge.
- Without `X-DNT: 1`, the edge records hashed user identifiers and event IDs for
  tracing (`assess:start`, `assess:submit`, `assess:aggregate`). All data remains
  text-based.

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `CORS_ORIGINS` | Comma-separated list of allowed origins. |
| `SUPABASE_URL` | Supabase project URL. |
| `SUPABASE_ANON_KEY` | Anonymous key used with end-user JWT for RLS inserts. |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key reserved for batch recompute (Edge cron). |
| `SENTRY_DSN` | Optional DSN to enable Sentry reporting. Ignored when `X-DNT: 1`. |
| `EDGE_RATE_LIMIT_ASSESS_START` | Override for `/assess/start` rate limit. |
| `EDGE_RATE_LIMIT_ASSESS_SUBMIT` | Override for `/assess/submit`. |
| `EDGE_RATE_LIMIT_ASSESS_AGGREGATE` | Override for `/assess/aggregate`. |
| `EDGE_SIGNAL_TTL_OVERRIDE` | Optional global TTL override (seconds). |

## Testing & Monitoring

Contract tests reside in `supabase/tests/assess-functions.test.ts` and cover:

- Authentication and CORS failures (`401`, `403`).
- Cadence violations (`409`).
- Rate limiting (`429`).
- Successful flows returning text-only summaries and flags.
- Database failure scenarios returning `500` while protecting payloads.

Run them via:

```bash
npx vitest run supabase/tests/assess-functions.test.ts
```

Edge observability relies on structured logs with event IDs only. Aggregates are
regularly revalidated through `pnpm db:check`, ensuring the `min_n ≥ 5` constraint
remains effective before every deployment.

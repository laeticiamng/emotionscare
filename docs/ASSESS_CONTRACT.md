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

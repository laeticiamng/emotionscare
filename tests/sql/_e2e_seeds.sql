-- Seed deterministic data for Playwright E2E tests
INSERT INTO users (id, email, role) VALUES
  (1, 'b2c@example.com', 'b2c'),
  (2, 'b2b_user@example.com', 'b2b_user'),
  (3, 'b2b_admin@example.com', 'b2b_admin');

-- Additional seed data for modules can be inserted here
INSERT INTO public.assessments (id, user_id, instrument, score_json, ts)
VALUES
  (
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000001',
    'WHO5',
    '{"summary":"e2e"}',
    now()
  )
ON CONFLICT DO NOTHING;

INSERT INTO public.org_assess_rollups (id, org_id, period, instrument, n, text_summary)
VALUES
  (
    '00000000-0000-0000-0000-000000000201',
    '11111111-1111-1111-1111-111111111111',
    '2025-W38',
    'WHO5',
    6,
    'agrégat e2e'
  )
ON CONFLICT DO NOTHING;

INSERT INTO public.clinical_signals (id, user_id, source_instrument, domain, level, window_type, module_context, expires_at)
VALUES
  (
    '00000000-0000-0000-0000-000000000301',
    '00000000-0000-0000-0000-000000000001',
    'WHO5',
    'wellbeing',
    3,
    'weekly',
    'spotlight',
    now() + interval '7 days'
  )
ON CONFLICT DO NOTHING;

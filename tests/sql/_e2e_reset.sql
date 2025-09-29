-- Reset database for Playwright E2E tests
-- Truncate domain tables and reset identities
TRUNCATE TABLE
  users,
  journal_entries,
  scans,
  vr_sessions
RESTART IDENTITY CASCADE;

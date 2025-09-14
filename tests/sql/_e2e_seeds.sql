-- Seed deterministic data for Playwright E2E tests
INSERT INTO users (id, email, role) VALUES
  (1, 'b2c@example.com', 'b2c'),
  (2, 'b2b_user@example.com', 'b2b_user'),
  (3, 'b2b_admin@example.com', 'b2b_admin');

-- Additional seed data for modules can be inserted here

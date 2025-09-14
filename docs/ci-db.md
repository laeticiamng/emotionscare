# Database CI Runbook

The CI pipeline runs database migrations and tests on every commit.

## Pipeline steps
1. Spin up a temporary PostgreSQL 15 instance.
2. Apply all SQL migrations via `npm run flyway:migrate`.
3. Execute Vitest suites under `tests/db` using `npm run test:db`.
4. Upload the JSON test report as a build artifact.

## Running locally
1. Start a PostgreSQL instance (port 5432) and create an `emotions_test` database.
2. Set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`, and `DATABASE_URL`.
3. Run `npm run flyway:migrate`.
4. Run `npm run test:db` to execute the database tests.

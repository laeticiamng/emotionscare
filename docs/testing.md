# Testing Guide

This project uses Playwright for end-to-end tests and Vitest for unit/integration.

## Database reset and seed

The E2E suite expects a deterministic database state. Before the tests run the
`global-setup` script executes the following helpers:

```bash
npm run test:db:reset
npm run test:db:seed
```

These scripts execute the SQL files located under `tests/sql/` to reset and seed
the database. You can run them locally to get a clean state.

## Storage states

Authentication is performed once during the global setup through real API calls.
The resulting cookies and tokens are stored in JSON files under
`tests/e2e/_setup/state-*.json`. To refresh them manually run:

```bash
npx playwright test --global-setup tests/e2e/_setup/global-setup.ts
```

The setup script will reset and seed the database before logging in with the
different roles (B2C, B2B user and admin).

## data-testid conventions

Selectors used in the tests rely on `data-testid` attributes. When adding new UI
interactions, please expose stable identifiers using this attribute.

Common selectors are centralized in `tests/e2e/_selectors.ts` to avoid
duplication.

## Useful commands

```bash
# End-to-end tests
npm run e2e

# Unit and integration tests
npm test

# Reset and seed the database for tests
npm run test:db:reset
npm run test:db:seed
```

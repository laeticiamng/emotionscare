

# Plan: E2E Playwright Tests + Coverage Threshold

## Overview

The project already has extensive E2E infrastructure (70+ spec files, global setup with role-based auth, Supabase API mocking). The 3 requested scenarios partially exist but need to be consolidated into clean, focused spec files. The vitest coverage thresholds are currently set unrealistically high (80/75/70/80) and need to be lowered to the realistic 40% target.

## Changes

### 1. Create `tests/e2e/auth-flow.spec.ts` -- Login E2E

An `auth.spec.ts` already exists with good coverage (login success, login error, forgot password). This file will be renamed/kept and a new `auth-flow.spec.ts` will add the **full flow**: login, verify dashboard access, then logout.

- Mock Supabase auth endpoints (`/auth/v1/token`, `/auth/v1/user`)
- Navigate to `/login?segment=b2c`, fill email/password, submit
- Assert redirect to `/app/home`
- Find and click logout button
- Assert redirect back to login or homepage
- Test that protected route `/app/home` redirects unauthenticated users

### 2. Create `tests/e2e/account-deletion-rgpd.spec.ts` -- RGPD Deletion

- Mock Supabase auth (reuse pattern from `auth.spec.ts`)
- Navigate to privacy/settings page
- Click "Supprimer mon compte" button
- Fill confirmation dialog (reason, checkbox)
- Mock the deletion Edge Function call
- Assert success toast/banner appears
- Assert session is invalidated (redirect to login)
- Test cancellation flow: request deletion then cancel it

### 3. Create `tests/e2e/emotion-scan-text.spec.ts` -- Emotion Scan (text mode)

- Mock Supabase auth
- Navigate to `/scan` or emotion scan route
- Select text analysis mode
- Enter sample emotional text
- Mock the Edge Function response with emotion scores
- Assert emotion wheel/results display
- Assert score is visible (0-100 range)
- Test empty input validation

### 4. Update `vitest.config.ts` -- Coverage thresholds

Lower the current unrealistic thresholds to the 40% target:

```
thresholds: {
  lines: 40,
  functions: 35,
  branches: 30,
  statements: 40,
}
```

## Technical Details

### Mocking Strategy

All 3 specs use the same Supabase API mocking pattern already established in `auth.spec.ts`:
- `page.route()` to intercept Supabase auth endpoints
- Fulfill with mock JWT payload
- Mock REST API calls (`/rest/v1/**`) to return empty arrays
- Mock Edge Function calls for deletion/scan with expected responses

### File Structure

```
tests/e2e/
  auth-flow.spec.ts          (NEW - login + dashboard + logout)
  account-deletion-rgpd.spec.ts  (NEW - RGPD deletion flow)
  emotion-scan-text.spec.ts  (NEW - text emotion scan)
vitest.config.ts             (EDIT - lower thresholds)
```

### Playwright Project Target

Tests will run on the `chromium` project (no auth state required since we mock inline). Each test mocks its own auth state via `page.route()`.

### Key Routes Used

| Flow | Route | Key selectors |
|------|-------|---------------|
| Login | `/login?segment=b2c` | `data-testid="submit-login"`, `data-testid="auth-error"` |
| Account deletion | `/settings-privacy` or `/account-deletion` | Button with destructive variant, confirmation dialog |
| Emotion scan | `/scan` | Scan mode buttons, text input area |

## Estimation

~2 hours total: 3 spec files + 1 config edit.


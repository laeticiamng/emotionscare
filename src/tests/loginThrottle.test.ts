import test from 'node:test';
import assert from 'node:assert/strict';

import { recordLoginAttempt, isLoginLocked, MAX_LOGIN_ATTEMPTS } from '@/utils/security';

// Basic throttle logic

test('login lock triggers after max failed attempts', () => {
  const email = 'test@example.com';
  for (let i = 0; i < MAX_LOGIN_ATTEMPTS; i++) {
    recordLoginAttempt(email, false);
  }
  assert.equal(isLoginLocked(email), true);
});

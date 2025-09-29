import test from 'node:test';
import assert from 'node:assert/strict';

import authService from '@/services/auth-service';

// Ensure main auth service functions are defined

test('authService exposes signIn, signUp, signOut and sendMagicLink', () => {
  assert.equal(typeof authService.signIn, 'function');
  assert.equal(typeof authService.signUp, 'function');
  assert.equal(typeof authService.signOut, 'function');
  assert.equal(typeof authService.sendMagicLink, 'function');
});

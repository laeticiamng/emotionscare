import test from 'node:test';
import assert from 'node:assert/strict';

import { getRoleHomePath } from '@/hooks/use-role-redirect';

// Ensure correct dashboard path for b2c role

test('getRoleHomePath returns b2c dashboard', () => {
  const path = getRoleHomePath('b2c');
  assert.equal(path, '/b2c/dashboard');
});

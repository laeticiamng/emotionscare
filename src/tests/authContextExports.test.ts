// @ts-nocheck
import test from 'node:test';
import assert from 'node:assert/strict';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Basic export tests for AuthContext module

test('AuthContext exports are available', () => {
  assert.equal(typeof AuthProvider, 'function');
  assert.equal(typeof useAuth, 'function');
});

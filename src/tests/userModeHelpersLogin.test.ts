import test from 'node:test';
import assert from 'node:assert/strict';
import { getModeLoginPath } from '@/utils/userModeHelpers';

test('getModeLoginPath returns path based on mode', () => {
  assert.equal(getModeLoginPath('b2b_user'), '/login-collaborateur');
  assert.equal(getModeLoginPath('b2b_admin'), '/login-admin');
  assert.equal(getModeLoginPath('b2c'), '/b2c/login');
});


import test from 'node:test';
import assert from 'node:assert/strict';
import { getModeLoginPath } from '@/utils/userModeHelpers';

test('getModeLoginPath returns admin login path', () => {
  assert.equal(getModeLoginPath('b2b_admin'), '/b2b/admin/login');
});

test('getModeLoginPath returns user login path', () => {
  assert.equal(getModeLoginPath('b2b_user'), '/b2b/user/login');
});

test('getModeLoginPath falls back to b2c login', () => {
  assert.equal(getModeLoginPath('unknown'), '/b2c/login');
});

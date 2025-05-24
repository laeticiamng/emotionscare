
import test from 'node:test';
import assert from 'node:assert/strict';
import { getModeLoginPath } from '@/utils/userModeHelpers';

test('getModeLoginPath returns path based on mode', () => {
  assert.equal(getModeLoginPath('b2b_user'), '/b2b/user/login');
  assert.equal(getModeLoginPath('b2b_admin'), '/b2b/admin/login');
  assert.equal(getModeLoginPath('b2c'), '/b2c/login');
});

// @ts-nocheck
/* @vitest-environment jsdom */

import test from 'node:test';
import assert from 'node:assert/strict';

import { logSessionRedirect } from '@/utils/securityLogs';

test('securityLogs exports logSessionRedirect', () => {
  assert.equal(typeof logSessionRedirect, 'function');
});

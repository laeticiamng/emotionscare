// @ts-nocheck
/* @vitest-environment jsdom */

import test from 'node:test';
import assert from 'node:assert/strict';

import { logDashboardAccessDenied } from '@/utils/securityLogs';

// Basic export test

test('securityLogs exports logDashboardAccessDenied', () => {
  assert.equal(typeof logDashboardAccessDenied, 'function');
});

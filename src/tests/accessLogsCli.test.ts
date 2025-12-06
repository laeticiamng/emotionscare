// @ts-nocheck
import test from 'node:test';
import assert from 'node:assert/strict';

import { parseArgs } from '../../scripts/viewCriticalAccessLogs';

test('parseArgs extracts options', () => {
  const opts = parseArgs(['--user=42', '--limit=5', '--action=login']);
  assert.equal(opts.user, '42');
  assert.equal(opts.limit, 5);
  assert.equal(opts.action, 'login');
});

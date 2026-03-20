import test from 'node:test';
import assert from 'node:assert/strict';

import { CoachContext, CoachProvider } from '@/contexts/coach';

// Basic export tests for CoachContext module

test('CoachContext exports are available', () => {
  assert.ok(CoachContext, 'CoachContext should be defined');
  assert.equal(typeof CoachProvider, 'function');
});

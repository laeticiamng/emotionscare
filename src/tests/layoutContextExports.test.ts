// @ts-nocheck
import test from 'node:test';
import assert from 'node:assert/strict';

import { LayoutProvider, useLayout } from '@/contexts/LayoutContext';

// Basic export tests for LayoutContext module

test('LayoutContext exports are available', () => {
  assert.equal(typeof LayoutProvider, 'function');
  assert.equal(typeof useLayout, 'function');
});

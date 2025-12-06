// @ts-nocheck
import test from 'node:test';
import assert from 'node:assert/strict';

import { SocialCoconProvider, useSocialCocon } from '@/contexts/SocialCoconContext';

// Basic export tests for SocialCoconContext module

test('SocialCoconContext exports are available', () => {
  assert.equal(typeof SocialCoconProvider, 'function');
  assert.equal(typeof useSocialCocon, 'function');
});

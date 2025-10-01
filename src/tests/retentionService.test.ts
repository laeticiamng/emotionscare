// @ts-nocheck
import test from 'node:test';
import assert from 'node:assert/strict';
import { retentionService } from '@/services/retentionService';

test('retentionService.fetchStats returns stats object', async () => {
  const stats = await retentionService.fetchStats('demo');
  assert.equal(typeof stats.daysActive, 'number');
  assert.ok(Array.isArray(stats.badges));
});

test('retentionService.fetchCampaigns returns campaigns array', async () => {
  const campaigns = await retentionService.fetchCampaigns();
  assert.ok(Array.isArray(campaigns));
});

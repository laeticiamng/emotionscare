import test from 'node:test';
import assert from 'node:assert/strict';
import b2cDashboardService from '@/services/b2cDashboardService';

// Ensure main service functions are defined

test('b2cDashboardService exposes expected methods', () => {
  assert.equal(typeof b2cDashboardService.analyzeEmotion, 'function');
  assert.equal(typeof b2cDashboardService.analyzeJournal, 'function');
  assert.equal(typeof b2cDashboardService.sendCoachMessage, 'function');
  assert.equal(typeof b2cDashboardService.generateMusicRecommendation, 'function');
});

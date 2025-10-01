// @ts-nocheck

import test from 'node:test';
import assert from 'node:assert/strict';
import { Analytics, AnalyticsProvider } from '@/utils/analytics';
import { modeEmitter } from '@/utils/modeChangeEmitter';
import { logModeSelection } from '@/utils/modeSelectionLogger';

// Mock localStorage with analytics enabled
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).localStorage = {
  getItem() {
    return JSON.stringify({ privacy: { analytics: true } });
  },
  setItem() {},
  removeItem() {},
};

test('logModeSelection emits event and tracks analytics', () => {
  const events: any[] = [];
  const received: any[] = [];

  const provider: AnalyticsProvider = {
    trackPageView: () => {},
    trackEvent: (cat, act, label) => {
      events.push({ cat, act, label });
    },
  };

  Analytics.setProvider(provider);
  modeEmitter.on('modeChange', (log) => received.push(log));

  logModeSelection('b2c');

  assert.equal(events.length, 1);
  assert.equal(events[0].act, 'select');
  assert.equal(received.length, 1);
  assert.equal(received[0].mode, 'b2c');
});

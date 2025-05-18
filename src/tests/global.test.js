import test from 'node:test';
import assert from 'node:assert/strict';

// Use declaration merging with global.d.ts.
// Ensure the global property is accessible and typed.
test('window.__APP_DEBUG__ is accessible', () => {
  globalThis.window = {};
  window.__APP_DEBUG__ = true;
  assert.equal(window.__APP_DEBUG__, true);
});

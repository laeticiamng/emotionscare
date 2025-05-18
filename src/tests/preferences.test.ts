import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizePreferences, DEFAULT_PREFERENCES } from '@/types/preferences';

test('normalizePreferences returns defaults when input is null', () => {
  const prefs = normalizePreferences(null);
  assert.deepEqual(prefs, {
    theme: 'system',
    fontSize: 'medium',
    language: 'fr',
    privacy: 'private',
    notifications: { enabled: true, emailEnabled: true, pushEnabled: false }
  });
});

test('normalizePreferences merges provided values', () => {
  const prefs = normalizePreferences({ theme: 'dark', language: 'en' });
  assert.equal(prefs.theme, 'dark');
  assert.equal(prefs.language, 'en');
  assert.equal(prefs.fontSize, 'medium');
});

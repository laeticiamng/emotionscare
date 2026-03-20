import test from 'node:test';
import assert from 'node:assert/strict';

import MusicProvider, { MusicContext, useMusic } from '@/contexts/MusicContext';

test('MusicContext exports are defined', () => {
  assert.ok(MusicContext, 'MusicContext should be defined');
  assert.equal(typeof MusicProvider, 'function');
  assert.equal(typeof useMusic, 'function');
});

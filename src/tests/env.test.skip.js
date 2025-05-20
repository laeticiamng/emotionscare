import test from 'node:test';
import assert from 'node:assert/strict';
import { env } from '../env.mjs';

test('env loads default API URL', () => {
  assert.equal(env.NEXT_PUBLIC_API_URL, 'https://api.example.com');
});

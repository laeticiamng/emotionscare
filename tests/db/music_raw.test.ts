// @ts-nocheck
import { beforeAll, afterAll, expect, it, afterEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { resetTables } from '../helpers/db';

const supabase = createClient(
  process.env.SUPA_URL!, process.env.SUPA_SERVICE_ROLE_KEY!
);

beforeAll(async () => {
  await supabase.rpc('reset_test_schema');
});

afterAll(async () => {
  await supabase.removeAllSubscriptions();
});

afterEach(resetTables);

it('BioTune trigger calcule rmssd_delta et coherence', async () => {
  const { data, error } = await supabase
    .from('biotune_sessions')
    .insert({
      user_id_hash: 'hash123',
      duration_s: 300,
      bpm_target: 70,
      hrv_pre: 50,
      hrv_post: 80,
      energy_mode: 'calm'
    })
    .select('rmssd_delta, coherence')
    .single();
  expect(error).toBeNull();
  expect(data!.rmssd_delta).toBe(30);
  expect(data!.coherence).toBe(50);
});

it('Neon trigger calcule mvpa_min', async () => {
  const { data, error } = await supabase
    .from('neon_walk_sessions')
    .insert({
      user_id_hash: 'hash456',
      steps: 2000,
      avg_cadence: 120,
      joy_idx: 0.6
    })
    .select('mvpa_min')
    .single();
  expect(error).toBeNull();
  expect(data!.mvpa_min).toBeCloseTo(20, 2);
});

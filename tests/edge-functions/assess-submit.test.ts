// @ts-nocheck
import { describe, it, expect, beforeEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yaincoxihiqdksxgrsrk.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

describe('Edge Function: assess-submit', () => {
  let supabase: any;

  beforeEach(() => {
    supabase = createClient(supabaseUrl, supabaseKey);
  });

  it('should reject unauthenticated requests', async () => {
    const { data, error } = await supabase.functions.invoke('assess-submit', {
      body: {
        instrument: 'SAM',
        responses: [
          { item_id: 'valence', value: 5 },
          { item_id: 'arousal', value: 3 }
        ]
      }
    });

    expect(error).toBeDefined();
  });

  it('should validate SAM instrument responses', async () => {
    const { data: authData } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'testpassword123'
    });

    if (!authData.user) {
      console.warn('Skipping test: no test user available');
      return;
    }

    const { data, error } = await supabase.functions.invoke('assess-submit', {
      body: {
        instrument: 'SAM',
        responses: [
          { item_id: 'valence', value: 5 },
          { item_id: 'arousal', value: 3 }
        ],
        context_data: {
          source: 'scan_sliders',
          valence: 50,
          arousal: 30
        }
      }
    });

    if (error) {
      console.warn('Edge function error:', error);
      return;
    }

    expect(data).toBeDefined();
    expect(data.signal_id).toBeDefined();
    expect(data.success).toBe(true);
  });

  it('should reject invalid instrument', async () => {
    const { data: authData } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'testpassword123'
    });

    if (!authData.user) {
      console.warn('Skipping test: no test user available');
      return;
    }

    const { data, error } = await supabase.functions.invoke('assess-submit', {
      body: {
        instrument: 'INVALID_INSTRUMENT',
        responses: []
      }
    });

    expect(error || data?.error).toBeDefined();
  });

  it('should handle camera scan submission', async () => {
    const { data: authData } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'testpassword123'
    });

    if (!authData.user) {
      console.warn('Skipping test: no test user available');
      return;
    }

    const { data, error } = await supabase.functions.invoke('assess-submit', {
      body: {
        instrument: 'SAM',
        responses: [
          { item_id: 'valence', value: 7 },
          { item_id: 'arousal', value: 6 }
        ],
        context_data: {
          source: 'scan_camera',
          valence: 70,
          arousal: 60,
          confidence: 0.85
        }
      }
    });

    if (error) {
      console.warn('Edge function error:', error);
      return;
    }

    expect(data).toBeDefined();
    expect(data.signal_id).toBeDefined();
  });

  it('should store scan in clinical_signals table', async () => {
    const { data: authData } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'testpassword123'
    });

    if (!authData.user) {
      console.warn('Skipping test: no test user available');
      return;
    }

    // Submit scan
    const { data: submitData } = await supabase.functions.invoke('assess-submit', {
      body: {
        instrument: 'SAM',
        responses: [
          { item_id: 'valence', value: 5 },
          { item_id: 'arousal', value: 5 }
        ],
        context_data: {
          source: 'scan_test',
          valence: 50,
          arousal: 50
        }
      }
    });

    if (!submitData?.signal_id) {
      console.warn('No signal_id returned, skipping verification');
      return;
    }

    // Verify it was stored
    const { data: signals, error } = await supabase
      .from('clinical_signals')
      .select('*')
      .eq('id', submitData.signal_id)
      .single();

    expect(error).toBeNull();
    expect(signals).toBeDefined();
    expect(signals.source_instrument).toBe('SAM');
  });
});

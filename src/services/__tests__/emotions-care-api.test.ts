// @ts-nocheck
import { vi, describe, it, expect } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { emotionsCareApi } from '../emotions-care-api';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: { invoke: vi.fn() }
  }
}));

describe('emotions-care-api', () => {
  it('returns fallback playlist when Suno call fails', async () => {
    (supabase.functions.invoke as any).mockRejectedValue(new Error('fail'));
    const playlist = await emotionsCareApi.generateMusic({ emotion: 'happy', intensity: 0.5 });
    expect(playlist.name).toContain('happy');
    expect(supabase.functions.invoke).toHaveBeenCalled();
  });
});

// @ts-nocheck
import { vi, describe, it, expect } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { teamService } from '../teamService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: { invoke: vi.fn() }
  }
}));

describe('teamService', () => {
  it('listTeams calls team-management function', async () => {
    (supabase.functions.invoke as any).mockResolvedValue({ data: { teams: [] }, error: null });
    const teams = await teamService.listTeams();
    expect(supabase.functions.invoke).toHaveBeenCalledWith('team-management', { body: { action: 'list', payload: undefined } });
    expect(teams).toEqual([]);
  });
});

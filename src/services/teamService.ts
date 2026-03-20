import { supabase } from '@/integrations/supabase/client';
import { TeamSummary } from '@/types/dashboard';

export interface TeamPayload {
  id?: string;
  name?: string;
  fields?: Record<string, any>;
}

async function invoke(action: string, payload?: TeamPayload) {
  const { data, error } = await supabase.functions.invoke('team-management', {
    body: { action, payload }
  });
  if (error) throw error;
  return data;
}

export const teamService = {
  async listTeams(): Promise<TeamSummary[]> {
    const data = await invoke('list');
    return data?.teams || [];
  },

  async createTeam(name: string): Promise<TeamSummary> {
    const data = await invoke('create', { name });
    return data.team;
  },

  async updateTeam(id: string, fields: Record<string, any>): Promise<TeamSummary> {
    const data = await invoke('update', { id, fields });
    return data.team;
  },

  async deleteTeam(id: string): Promise<boolean> {
    await invoke('delete', { id });
    return true;
  }
};

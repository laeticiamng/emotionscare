
import { supabase } from '@/integrations/supabase/client';
import type { VRSession } from '@/types';

// Crée une session VR
export async function createVRSession(
  user_id: string,
  duration_seconds: number,
  location_url: string,
  hr_before?: number,
  hr_after?: number
): Promise<VRSession> {
  const { data, error } = await supabase
    .from('vr_sessions')
    .insert({
      user_id,
      date: new Date().toISOString(),
      duration_seconds,
      location_url,
      heart_rate_before: hr_before ?? null,
      heart_rate_after: hr_after ?? null,
    })
    .select()
    .single();
    
  if (error || !data) throw error || new Error('Failed to log VR session');
  return data;
}

// Récupère le nombre de sessions ce mois
export async function fetchVRCountThisMonth(user_id: string): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const { count, error } = await supabase
    .from('vr_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user_id)
    .gte('date', startOfMonth.toISOString());
    
  if (error) throw error;
  return count ?? 0;
}

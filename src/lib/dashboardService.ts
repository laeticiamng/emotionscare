
import { supabase } from '@/integrations/supabase/client';

export const fetchUsersAvgScore = async (): Promise<number> => {
  try {
    // Mock implementation - dans une application réelle, cela viendrait de la base de données
    // Par exemple: const { data } = await supabase.from('users').select('emotional_score')
    return 75.5; // Valeur moyenne simulée
  } catch (error) {
    console.error('Error fetching average score:', error);
    return 0;
  }
};

export const fetchVRCount = async (): Promise<number> => {
  try {
    // Mock implementation - dans une application réelle, cela viendrait de la base de données
    // Par exemple: const { data } = await supabase.from('vr_sessions').select('count')
    const thisMonth = 8;
    return thisMonth;
  } catch (error) {
    console.error('Error fetching VR count:', error);
    return 0;
  }
};

export const fetchBadgesCount = async (userId: string): Promise<number> => {
  try {
    // Mock implementation - dans une application réelle, cela viendrait de la base de données
    // Par exemple: const { data } = await supabase.from('badges').select('count').eq('user_id', userId)
    return userId === '1' ? 2 : 0;
  } catch (error) {
    console.error('Error fetching badges count:', error);
    return 0;
  }
};

export const fetchReports = async (metrics: string[], days: number = 7): Promise<Record<string, any[]>> => {
  try {
    // Mock implementation - dans une application réelle, cela viendrait de la base de données
    const result: Record<string, any[]> = {};
    
    for (const metric of metrics) {
      if (metric === 'absenteeism') {
        result[metric] = [
          { date: '1/5', value: 3.5 },
          { date: '2/5', value: 3.2 },
          { date: '3/5', value: 3.8 },
          { date: '4/5', value: 4.0 },
          { date: '5/5', value: 3.6 },
          { date: '6/5', value: 3.2 },
          { date: '7/5', value: 3.0 },
        ];
      } else if (metric === 'productivity') {
        result[metric] = [
          { date: '1/5', value: 72 },
          { date: '2/5', value: 75 },
          { date: '3/5', value: 78 },
          { date: '4/5', value: 80 },
          { date: '5/5', value: 82 },
          { date: '6/5', value: 85 },
          { date: '7/5', value: 88 },
        ];
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching reports:', error);
    return {};
  }
};

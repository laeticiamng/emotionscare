
import { supabase } from '@/integrations/supabase/client';

export const fetchUsersAvgScore = async (days: number = 7): Promise<Array<{ date: string; value: number }>> => {
  try {
    // Dans une application réelle, cette fonction ferait une requête Supabase 
    // pour obtenir la moyenne des scores émotionnels par jour
    // SELECT DATE(created_at), AVG(emotional_score) FROM users GROUP BY DATE(created_at)
    
    // Données simulées pour la démo
    const mockData = [
      { date: '1/5', value: 72 },
      { date: '2/5', value: 75 },
      { date: '3/5', value: 71 },
      { date: '4/5', value: 74 },
      { date: '5/5', value: 77 },
      { date: '6/5', value: 76 },
      { date: '7/5', value: 75.5 },
    ];
    
    // Simuler plus de données pour des périodes plus longues
    if (days > 7) {
      for (let i = 8; i <= days; i++) {
        mockData.push({
          date: `${i % 30}/5`,
          value: 70 + Math.random() * 10
        });
      }
    }
    
    return mockData;
  } catch (error) {
    console.error('Error fetching average scores:', error);
    return [];
  }
};

export const fetchUsersWithStatus = async (status: string, days: number = 7): Promise<number> => {
  try {
    // Simuler un nombre d'utilisateurs avec un statut spécifique
    return status === 'absent' ? Math.floor(3 + Math.random() * 3) : Math.floor(15 + Math.random() * 10);
  } catch (error) {
    console.error(`Error fetching users with status ${status}:`, error);
    return 0;
  }
};

export const fetchJournalStats = async (days: number = 7): Promise<Array<{ date: string; score: number; count: number }>> => {
  try {
    // Dans une application réelle, cette fonction ferait une requête Supabase
    // pour obtenir les statistiques du journal
    // SELECT DATE(created_at), AVG(mood), COUNT(*) FROM journal_entries GROUP BY DATE(created_at)
    
    // Données simulées pour la démo
    const result = [];
    const today = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      result.push({
        date: `${date.getDate()}/${date.getMonth() + 1}`,
        score: Math.floor(65 + Math.random() * 20),
        count: Math.floor(5 + Math.random() * 15)
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching journal stats:', error);
    return [];
  }
};

export const fetchSocialActivityStats = async (): Promise<{
  totalPosts: number;
  moderationRate: number;
  topHashtags: Array<{ tag: string; count: number }>;
}> => {
  try {
    // Dans une application réelle, cette fonction ferait des requêtes Supabase
    // pour obtenir les statistiques des activités sociales
    
    // Données simulées pour la démo
    return {
      totalPosts: 126,
      moderationRate: 5,
      topHashtags: [
        { tag: "#bienetre", count: 28 },
        { tag: "#teamspirit", count: 21 },
        { tag: "#détente", count: 18 },
        { tag: "#santé", count: 14 },
        { tag: "#équipe", count: 12 },
        { tag: "#motivation", count: 10 }
      ]
    };
  } catch (error) {
    console.error('Error fetching social activity stats:', error);
    return {
      totalPosts: 0,
      moderationRate: 0,
      topHashtags: []
    };
  }
};

export const fetchGamificationStats = async (): Promise<{
  activeUsersPercent: number;
  totalBadges: number;
}> => {
  try {
    // Dans une application réelle, cette fonction ferait des requêtes Supabase
    // pour obtenir les statistiques de gamification
    
    // Données simulées pour la démo
    return {
      activeUsersPercent: 68,
      totalBadges: 24
    };
  } catch (error) {
    console.error('Error fetching gamification stats:', error);
    return {
      activeUsersPercent: 0,
      totalBadges: 0
    };
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

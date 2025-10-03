export interface RetentionStats {
  daysActive: number;
  streak: number;
  badges: string[];
  rewards: string[];
  rituals: string[];
}

export interface ReengagementCampaign {
  id: string;
  name: string;
  target: string;
  status: 'scheduled' | 'running' | 'completed';
  sent: number;
  opened: number;
}

export const retentionService = {
  async fetchStats(userId: string): Promise<RetentionStats> {
    // In a real app this would query Supabase
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      daysActive: 42,
      streak: 5,
      badges: ['Welcome Back', 'Loyal User'],
      rewards: ['Playlist spéciale', 'Badge fidélité'],
      rituals: [
        "Rituels matinaux", 
        "Pause musicale", 
        "Journal quotidien"
      ]
    };
  },

  async fetchCampaigns(): Promise<ReengagementCampaign[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: 'camp-1',
        name: 'Relance utilisateurs inactifs',
        target: 'B2C',
        status: 'running',
        sent: 150,
        opened: 80
      },
      {
        id: 'camp-2',
        name: 'Défi bien-être',
        target: 'B2B',
        status: 'scheduled',
        sent: 0,
        opened: 0
      }
    ];
  }
};

export default retentionService;

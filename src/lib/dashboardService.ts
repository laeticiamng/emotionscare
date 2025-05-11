
// Service pour récupérer les données du tableau de bord
export const fetchBadgesCount = async (userId: string): Promise<number> => {
  // Simulation d'un appel API
  await new Promise(resolve => setTimeout(resolve, 300));
  return Math.floor(Math.random() * 5); // 0-4 badges pour simuler les notifications
};

export const fetchLatestEmotion = async (userId: string) => {
  // Simulation d'un appel API
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const emotions = [
    { emotion: 'calm', score: 85 },
    { emotion: 'energetic', score: 78 },
    { emotion: 'creative', score: 92 },
    { emotion: 'reflective', score: 80 },
    { emotion: 'anxious', score: 65 }
  ];
  
  return emotions[Math.floor(Math.random() * emotions.length)];
};

export const fetchReports = async (reportTypes: string[], days: number, segmentFilter?: any): Promise<any> => {
  // Simulation d'un appel API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockData: Record<string, any[]> = {
    absenteeism: Array(days).fill(0).map((_, i) => ({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
      value: Math.floor(Math.random() * 5) + 2
    })),
    productivity: Array(days).fill(0).map((_, i) => ({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
      value: Math.floor(Math.random() * 15) + 75
    })),
  };
  
  const result: Record<string, any[]> = {};
  reportTypes.forEach(type => {
    if (mockData[type]) {
      result[type] = mockData[type];
    }
  });
  
  return result;
};

export const fetchUsersAvgScore = async (days: number, segmentFilter?: any): Promise<any[]> => {
  // Simulation d'un appel API
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return Array(days).fill(0).map((_, i) => ({
    date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
    value: Math.floor(Math.random() * 20) + 70
  }));
};

export const fetchUsersWithStatus = async (status: string, days: number, segmentFilter?: any): Promise<number> => {
  // Simulation d'un appel API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return Math.floor(Math.random() * 50) + 150; // 150-200 utilisateurs actifs
};

export const generateMockMoodData = (days: number): any[] => {
  return Array(days).fill(0).map((_, i) => ({
    id: `mood-${i}`,
    date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000),
    originalDate: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000),
    value: Math.floor(Math.random() * 40) + 60, // Score entre 60 et 100
    label: ['Excellent', 'Bon', 'Moyen', 'Bas'][Math.floor(Math.random() * 4)]
  }));
};

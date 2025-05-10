
// Fonction simulée pour récupérer le nombre de badges/notifications
export const fetchBadgesCount = async (userId: string): Promise<number> => {
  // Simuler une requête API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Retourner un nombre aléatoire entre 0 et 5
  return Math.floor(Math.random() * 6);
};

// Fonction simulée pour récupérer les données de KPI
export const fetchKpiData = async (userId: string, period: string = 'week'): Promise<any> => {
  // Simuler une requête API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Retourner des données simulées
  return {
    emotionScore: {
      current: 7.8,
      previous: 7.4,
      change: 0.4
    },
    activityCount: {
      current: 12,
      previous: 8,
      change: 4
    },
    streakDays: {
      current: 5,
      previous: 3,
      change: 2
    }
  };
};

// Fonction simulée pour récupérer les données de tendance
export const fetchTrendData = async (userId: string, period: string = 'month'): Promise<any[]> => {
  // Simuler une requête API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Générer des données de tendance pour le graphique
  const days = 30;
  const data = [];
  let moodValue = 6.5;
  
  for (let i = 0; i < days; i++) {
    // Variation aléatoire mais réaliste de l'humeur
    const variation = (Math.random() - 0.5) * 1.5;
    moodValue = Math.max(1, Math.min(10, moodValue + variation));
    
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    data.push({
      date: date.toISOString(),
      mood: parseFloat(moodValue.toFixed(1)),
      activity: Math.floor(Math.random() * 4)
    });
  }
  
  return data;
};

// Ajout des fonctions manquantes pour l'admin dashboard
export const fetchReports = async (
  reportTypes: string[], 
  days: number, 
  segmentFilter?: { dimensionKey: string, optionKey: string }
): Promise<{ [key: string]: any[] }> => {
  // Simuler une requête API
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const result: { [key: string]: any[] } = {};
  
  // Générer des données simulées pour chaque type de rapport
  reportTypes.forEach(type => {
    const data = [];
    let baseValue = type === 'absenteeism' ? 5 : 75;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      // Ajouter une variation aléatoire
      const variation = (Math.random() - 0.5) * 8;
      const value = Math.max(0, Math.min(100, baseValue + variation));
      
      data.push({
        date: `${date.getDate()}/${date.getMonth() + 1}`,
        value: parseFloat(value.toFixed(1))
      });
    }
    
    result[type] = data;
  });
  
  return result;
};

export const fetchUsersAvgScore = async (
  days: number, 
  segmentFilter?: { dimensionKey: string, optionKey: string }
): Promise<any[]> => {
  // Simuler une requête API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const data = [];
  let scoreValue = 75;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    // Ajouter une variation aléatoire
    const variation = (Math.random() - 0.5) * 5;
    scoreValue = Math.max(0, Math.min(100, scoreValue + variation));
    
    data.push({
      date: `${date.getDate()}/${date.getMonth() + 1}`,
      value: parseFloat(scoreValue.toFixed(1))
    });
  }
  
  return data;
};

export const fetchUsersWithStatus = async (
  status: string, 
  days: number,
  segmentFilter?: { dimensionKey: string, optionKey: string }
): Promise<number> => {
  // Simuler une requête API
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Retourner un nombre d'utilisateurs entre 50 et 150
  return Math.floor(Math.random() * 100) + 50;
};


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

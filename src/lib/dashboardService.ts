
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

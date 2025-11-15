// @ts-nocheck
/**
 * Hook pour les recommandations intelligentes du parc émotionnel
 * Basé sur le mood, l'historique de visite et les préférences
 */

import { useAttractionProgress } from './useAttractionProgress';

interface Attraction {
  id: string;
  title: string;
  zone: string;
  icon?: any;
}

interface RecommendationData {
  attraction: Attraction;
  score: number;
  reason: string;
}

export const useParkRecommendations = () => {
  const { visitedAttractions } = useAttractionProgress();

  const getRecommendations = (attractions: Attraction[], currentMood?: string): RecommendationData[] => {
    const recommendations: RecommendationData[] = [];

    attractions.forEach((attraction) => {
      let score = 0;
      let reasons: string[] = [];

      // 1. Bonus si non visité (découverte)
      if (!visitedAttractions[attraction.id]) {
        score += 30;
        reasons.push('Nouvelle attraction');
      }

      // 2. Recommandations basées sur le mood
      if (currentMood) {
        if (currentMood === 'anxious' || currentMood === 'stressed') {
          // Zones calmes
          if (['calm', 'wisdom'].includes(attraction.zone)) {
            score += 25;
            reasons.push('Idéal pour votre état actuel');
          }
        } else if (currentMood === 'happy' || currentMood === 'excited') {
          // Zones créatives et énergiques
          if (['creative', 'energy', 'challenge'].includes(attraction.zone)) {
            score += 25;
            reasons.push('Parfait pour votre énergie');
          }
        } else if (currentMood === 'sad' || currentMood === 'lonely') {
          // Zones sociales et créatives
          if (['social', 'wisdom', 'creative'].includes(attraction.zone)) {
            score += 25;
            reasons.push('Recommandé pour votre mood');
          }
        }
      }

      // 3. Bonus de diversité (ne pas toujours visiter la même zone)
      const visitedZones = Object.entries(visitedAttractions)
        .filter(([, visited]) => visited)
        .map(([id]) =>
          attractions.find(a => a.id === id)?.zone
        )
        .filter(Boolean);

      const zoneVisitCount = visitedZones.filter(z => z === attraction.zone).length;
      if (zoneVisitCount < 3) {
        score += 10;
      }

      // 4. Attractions connexes
      const relatedZones = {
        calm: ['wisdom'],
        wisdom: ['calm'],
        creative: ['energy'],
        energy: ['challenge'],
        challenge: ['wisdom'],
        social: ['creative'],
      };

      const relatedZone = relatedZones[attraction.zone as keyof typeof relatedZones];
      if (relatedZone && relatedZone.some(z =>
        visitedZones.some(vz => vz === z)
      )) {
        score += 15;
        reasons.push('Attraction complémentaire');
      }

      // 5. Bonus pour les attractions de hub (points d'intérêt)
      if (attraction.zone === 'hub') {
        score += 5;
      }

      if (score > 0) {
        recommendations.push({
          attraction,
          score,
          reason: reasons.length > 0 ? reasons[0] : 'Recommandé'
        });
      }
    });

    // Trier par score et retourner les 5 meilleures
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  const getDailyChallenge = (attractions: Attraction[]): Attraction | null => {
    const today = new Date().toDateString();
    const savedChallenge = localStorage.getItem(`daily-challenge-${today}`);

    if (savedChallenge) {
      return JSON.parse(savedChallenge);
    }

    // Sélectionner une attraction aléatoire non visitée aujourd'hui
    const unvisitedToday = attractions.filter(
      a => !visitedAttractions[`${a.id}-today`]
    );

    if (unvisitedToday.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * unvisitedToday.length);
    const challenge = unvisitedToday[randomIndex];
    localStorage.setItem(`daily-challenge-${today}`, JSON.stringify(challenge));
    return challenge;
  };

  return {
    getRecommendations,
    getDailyChallenge
  };
};

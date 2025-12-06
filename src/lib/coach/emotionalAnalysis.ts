/**
 * Utilitaires pour analyser les données émotionnelles
 */

export interface EmotionalSnapshot {
  timestamp: string;
  emotions: {
    joy: number;
    sadness: number;
    anxiety: number;
    anger: number;
    calm: number;
    neutral: number;
  };
  dominantEmotion: string;
  overallScore: number;
}

export interface EmotionalTrend {
  period: string;
  average: number;
  min: number;
  max: number;
  variance: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface EmotionalPattern {
  pattern: string;
  frequency: number;
  timeOfDay: string;
  dayOfWeek: string;
  correlation: number;
}

/**
 * Calcule le score émotionnel global basé sur les émotions individuelles
 */
export const calculateEmotionalScore = (emotions: {
  joy?: number;
  sadness?: number;
  anxiety?: number;
  anger?: number;
  calm?: number;
  neutral?: number;
}): number => {
  const { joy = 0, calm = 0, sadness = 0, anxiety = 0, anger = 0 } = emotions;

  // Formule : (positives - négatives) / total_scale
  const positive = (joy + calm) / 2;
  const negative = (sadness + anxiety + anger) / 3;
  const score = ((positive - negative) + 10) / 2; // Normaliser sur 0-10

  return Math.max(0, Math.min(10, parseFloat(score.toFixed(1))));
};

/**
 * Détermine l'émotion dominante
 */
export const getDominantEmotion = (emotions: {
  joy?: number;
  sadness?: number;
  anxiety?: number;
  anger?: number;
  calm?: number;
  neutral?: number;
}): string => {
  const entries = Object.entries(emotions).filter(([_, v]) => v !== undefined);
  if (entries.length === 0) return 'neutral';

  const [emotion] = entries.reduce((a, b) => (a[1] > b[1] ? a : b));
  return emotion;
};

/**
 * Analyse les tendances émotionnelles sur une période
 */
export const analyzeTrend = (snapshots: EmotionalSnapshot[]): EmotionalTrend => {
  if (snapshots.length === 0) {
    return {
      period: 'unknown',
      average: 0,
      min: 0,
      max: 0,
      variance: 0,
      trend: 'stable',
    };
  }

  const scores = snapshots.map((s) => s.overallScore);
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  const min = Math.min(...scores);
  const max = Math.max(...scores);

  // Calculer la variance
  const variance =
    scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length;

  // Déterminer la tendance
  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (snapshots.length >= 2) {
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    if (secondAvg > firstAvg + 0.5) {
      trend = 'improving';
    } else if (secondAvg < firstAvg - 0.5) {
      trend = 'declining';
    }
  }

  return {
    period: `${snapshots.length} days`,
    average: parseFloat(average.toFixed(1)),
    min: parseFloat(min.toFixed(1)),
    max: parseFloat(max.toFixed(1)),
    variance: parseFloat(variance.toFixed(2)),
    trend,
  };
};

/**
 * Identifie les patterns émotionnels
 */
export const identifyPatterns = (snapshots: EmotionalSnapshot[]): EmotionalPattern[] => {
  const patterns: EmotionalPattern[] = [];

  if (snapshots.length < 3) return patterns;

  // Groupe par heure de la journée
  const byHour = new Map<string, number[]>();
  snapshots.forEach((snap) => {
    const hour = new Date(snap.timestamp).getHours();
    const hourStr = `${hour}:00`;
    if (!byHour.has(hourStr)) {
      byHour.set(hourStr, []);
    }
    byHour.get(hourStr)!.push(snap.overallScore);
  });

  // Trouve les heures avec les plus hautes/basses moyennes
  Array.from(byHour.entries()).forEach(([hour, scores]) => {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (avg > 7) {
      patterns.push({
        pattern: `Émotions positives à ${hour}`,
        frequency: scores.length,
        timeOfDay: hour,
        dayOfWeek: 'all',
        correlation: avg,
      });
    } else if (avg < 4) {
      patterns.push({
        pattern: `Émotions négatives à ${hour}`,
        frequency: scores.length,
        timeOfDay: hour,
        dayOfWeek: 'all',
        correlation: avg,
      });
    }
  });

  return patterns;
};

/**
 * Génère des recommandations basées sur l'analyse émotionnelle
 */
export const generateRecommendations = (
  snapshot: EmotionalSnapshot,
  trend: EmotionalTrend
): string[] => {
  const recommendations: string[] = [];
  const score = snapshot.overallScore;
  const dominant = snapshot.dominantEmotion;

  // Recommandations basées sur le score
  if (score < 3) {
    recommendations.push('Essayez une respiration guidée pour vous calmer');
    recommendations.push('Envisagez de contacter un professionnel de santé');
  } else if (score < 5) {
    recommendations.push('Un moment de journaling pourrait vous aider');
    recommendations.push('Écoutez une musique relaxante');
  } else if (score > 8) {
    recommendations.push('Maintenez cette énergie positive!');
    recommendations.push('Partagez votre bien-être avec quelqu\'un');
  }

  // Recommandations basées sur les émotions dominantes
  if (dominant === 'anxiety' && snapshot.emotions.anxiety > 7) {
    recommendations.push('Pratiquez la technique du 5-4-3-2-1 pour la pleine conscience');
  }

  if (dominant === 'sadness' && snapshot.emotions.sadness > 7) {
    recommendations.push('Faites une activité que vous aimez');
    recommendations.push('Contactez un ami ou un membre de la famille');
  }

  if (dominant === 'anger' && snapshot.emotions.anger > 7) {
    recommendations.push('Faites une pause et prenez du recul');
    recommendations.push('Essayez une activité physique pour canaliser l\'énergie');
  }

  // Recommandations basées sur la tendance
  if (trend.trend === 'declining') {
    recommendations.push('Votre bien-être décline - pensez à augmenter les activités positives');
  } else if (trend.trend === 'improving') {
    recommendations.push('Excellent! Continuez ce que vous faites - vous progressez!');
  }

  return recommendations;
};

/**
 * Calcule la flexibilité psychologique (AAQ-II)
 */
export const calculateFlexibility = (aaqResponses: number[]): {
  score: number;
  level: 'rigide' | 'transition' | 'souple';
  interpretation: string;
} => {
  if (aaqResponses.length === 0) {
    return {
      score: 0,
      level: 'rigide',
      interpretation: 'Pas de données',
    };
  }

  const sum = aaqResponses.reduce((a, b) => a + b, 0);
  const average = sum / aaqResponses.length;
  const score = Math.round((average / 7) * 100);

  let level: 'rigide' | 'transition' | 'souple' = 'transition';
  if (score < 40) {
    level = 'rigide';
  } else if (score > 65) {
    level = 'souple';
  }

  const interpretations = {
    rigide: 'Vous êtes en lutte avec vos pensées et émotions. Le coach peut vous aider à développer la flexibilité.',
    transition: 'Vous êtes en transition vers plus de flexibilité. Continuez votre travail personnel.',
    souple: 'Vous avez une excellente flexibilité psychologique. Maintenez ces pratiques!',
  };

  return {
    score,
    level,
    interpretation: interpretations[level],
  };
};

/**
 * Génère un résumé hebdomadaire
 */
export const generateWeeklySummary = (snapshots: EmotionalSnapshot[]): {
  averageScore: number;
  bestDay: { date: string; score: number };
  worstDay: { date: string; score: number };
  dominantEmotions: { emotion: string; frequency: number }[];
  recommendation: string;
} => {
  const daySnapshots = new Map<string, EmotionalSnapshot[]>();

  snapshots.forEach((snap) => {
    const date = snap.timestamp.split('T')[0];
    if (!daySnapshots.has(date)) {
      daySnapshots.set(date, []);
    }
    daySnapshots.get(date)!.push(snap);
  });

  const dailyAverages = Array.from(daySnapshots.entries()).map(([date, snaps]) => ({
    date,
    score:
      snaps.reduce((sum, s) => sum + s.overallScore, 0) / snaps.length,
  }));

  const averageScore =
    dailyAverages.reduce((sum, d) => sum + d.score, 0) / dailyAverages.length;

  const sortedByScore = [...dailyAverages].sort((a, b) => b.score - a.score);
  const bestDay = sortedByScore[0] || { date: 'N/A', score: 0 };
  const worstDay = sortedByScore[sortedByScore.length - 1] || { date: 'N/A', score: 0 };

  // Compter les émotions dominantes
  const emotionCounts = new Map<string, number>();
  snapshots.forEach((snap) => {
    const emotion = snap.dominantEmotion;
    emotionCounts.set(emotion, (emotionCounts.get(emotion) || 0) + 1);
  });

  const dominantEmotions = Array.from(emotionCounts.entries())
    .map(([emotion, frequency]) => ({ emotion, frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 3);

  let recommendation = 'Continuez votre suivi émotionnel!';
  if (averageScore > 7) {
    recommendation = 'Excellente semaine! Maintenez vos pratiques de bien-être.';
  } else if (averageScore < 4) {
    recommendation = 'Semaine difficile. Augmentez vos activités de self-care.';
  }

  return {
    averageScore: parseFloat(averageScore.toFixed(1)),
    bestDay,
    worstDay,
    dominantEmotions,
    recommendation,
  };
};

/**
 * Compare deux périodes émotionnelles
 */
export const comparePeriods = (
  period1: EmotionalSnapshot[],
  period2: EmotionalSnapshot[]
): {
  improvement: number;
  percentChange: number;
  verdict: string;
} => {
  const avg1 = period1.reduce((sum, s) => sum + s.overallScore, 0) / period1.length;
  const avg2 = period2.reduce((sum, s) => sum + s.overallScore, 0) / period2.length;

  const improvement = avg2 - avg1;
  const percentChange = (improvement / avg1) * 100;

  let verdict = 'Stabilité';
  if (percentChange > 5) {
    verdict = 'Amélioration significative';
  } else if (percentChange < -5) {
    verdict = 'Déclin notable';
  }

  return {
    improvement: parseFloat(improvement.toFixed(1)),
    percentChange: parseFloat(percentChange.toFixed(1)),
    verdict,
  };
};

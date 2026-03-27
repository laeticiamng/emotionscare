// @ts-nocheck
import { EmotionResult, EmotionVector } from '@/types/emotion';
import { BASE_EMOTIONS, EMOTION_CATEGORIES } from './constants';

/**
 * Service d'agrégation et d'analyse de données de scan émotionnel
 */

export interface EmotionTrend {
  emotion: string;
  count: number;
  averageConfidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  percentageChange: number;
}

export interface EmotionStatistics {
  totalScans: number;
  averageConfidence: number;
  dominantEmotion: string;
  emotionDistribution: Record<string, number>;
  averageValence: number;
  averageArousal: number;
  trends: EmotionTrend[];
  timeRange: {
    start: Date;
    end: Date;
    durationMs: number;
  };
}

export interface DailyEmotionSummary {
  date: string;
  scansCount: number;
  dominantEmotion: string;
  averageMood: number; // -1 à +1
  emotionCounts: Record<string, number>;
}

/**
 * Calcule des statistiques détaillées sur un ensemble de scans
 */
export function calculateEmotionStatistics(
  results: EmotionResult[],
  startDate?: Date,
  endDate?: Date
): EmotionStatistics {
  if (results.length === 0) {
    throw new Error('Aucun résultat à analyser');
  }

  // Filtrer par dates si spécifié
  let filteredResults = results;
  if (startDate || endDate) {
    filteredResults = results.filter(r => {
      const timestamp = new Date(r.timestamp);
      if (startDate && timestamp < startDate) return false;
      if (endDate && timestamp > endDate) return false;
      return true;
    });
  }

  if (filteredResults.length === 0) {
    throw new Error('Aucun résultat dans la plage de dates spécifiée');
  }

  // Distribution des émotions
  const emotionDistribution: Record<string, number> = {};
  let totalConfidence = 0;
  let totalValence = 0;
  let totalArousal = 0;
  let valenceCount = 0;
  let arousalCount = 0;

  filteredResults.forEach(result => {
    const emotion = result.emotion.toLowerCase();
    emotionDistribution[emotion] = (emotionDistribution[emotion] || 0) + 1;

    const confidence = typeof result.confidence === 'number'
      ? result.confidence
      : result.confidence?.overall || 0;
    totalConfidence += confidence;

    if (result.valence !== undefined) {
      totalValence += result.valence;
      valenceCount++;
    }

    if (result.arousal !== undefined) {
      totalArousal += result.arousal;
      arousalCount++;
    }
  });

  // Émotion dominante
  const dominantEmotion = Object.entries(emotionDistribution)
    .sort(([, a], [, b]) => b - a)[0][0];

  // Calculer les tendances
  const trends = calculateEmotionTrends(filteredResults);

  // Plage temporelle
  const timestamps = filteredResults.map(r => new Date(r.timestamp).getTime());
  const startTime = Math.min(...timestamps);
  const endTime = Math.max(...timestamps);

  return {
    totalScans: filteredResults.length,
    averageConfidence: totalConfidence / filteredResults.length,
    dominantEmotion,
    emotionDistribution,
    averageValence: valenceCount > 0 ? totalValence / valenceCount : 0,
    averageArousal: arousalCount > 0 ? totalArousal / arousalCount : 0,
    trends,
    timeRange: {
      start: new Date(startTime),
      end: new Date(endTime),
      durationMs: endTime - startTime,
    },
  };
}

/**
 * Calcule les tendances pour chaque émotion
 */
export function calculateEmotionTrends(results: EmotionResult[]): EmotionTrend[] {
  if (results.length < 2) {
    return [];
  }

  // Trier par timestamp
  const sortedResults = [...results].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Diviser en deux moitiés pour comparer
  const midpoint = Math.floor(sortedResults.length / 2);
  const firstHalf = sortedResults.slice(0, midpoint);
  const secondHalf = sortedResults.slice(midpoint);

  // Compter les occurrences dans chaque moitié
  const firstCounts: Record<string, number> = {};
  const secondCounts: Record<string, number> = {};
  const confidences: Record<string, number[]> = {};

  firstHalf.forEach(r => {
    const emotion = r.emotion.toLowerCase();
    firstCounts[emotion] = (firstCounts[emotion] || 0) + 1;
  });

  secondHalf.forEach(r => {
    const emotion = r.emotion.toLowerCase();
    secondCounts[emotion] = (secondCounts[emotion] || 0) + 1;
    const conf = typeof r.confidence === 'number'
      ? r.confidence
      : r.confidence?.overall || 0;
    if (!confidences[emotion]) confidences[emotion] = [];
    confidences[emotion].push(conf);
  });

  const trends: EmotionTrend[] = [];
  const allEmotions = new Set([...Object.keys(firstCounts), ...Object.keys(secondCounts)]);

  allEmotions.forEach(emotion => {
    const firstCount = firstCounts[emotion] || 0;
    const secondCount = secondCounts[emotion] || 0;
    const totalCount = firstCount + secondCount;

    if (totalCount === 0) return;

    const percentageChange = firstCount > 0
      ? ((secondCount - firstCount) / firstCount) * 100
      : secondCount > 0 ? 100 : 0;

    const avgConfidence = confidences[emotion]
      ? confidences[emotion].reduce((a, b) => a + b, 0) / confidences[emotion].length
      : 0;

    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (Math.abs(percentageChange) > 20) {
      trend = percentageChange > 0 ? 'increasing' : 'decreasing';
    }

    trends.push({
      emotion,
      count: totalCount,
      averageConfidence: avgConfidence,
      trend,
      percentageChange,
    });
  });

  return trends.sort((a, b) => b.count - a.count);
}

/**
 * Génère un résumé quotidien des émotions
 */
export function generateDailySummaries(results: EmotionResult[]): DailyEmotionSummary[] {
  const dailyData: Record<string, EmotionResult[]> = {};

  // Grouper par jour
  results.forEach(result => {
    const date = new Date(result.timestamp).toISOString().split('T')[0];
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(result);
  });

  // Créer les résumés
  return Object.entries(dailyData).map(([date, dayResults]) => {
    const emotionCounts: Record<string, number> = {};
    let totalValence = 0;
    let valenceCount = 0;

    dayResults.forEach(r => {
      const emotion = r.emotion.toLowerCase();
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;

      if (r.valence !== undefined) {
        totalValence += r.valence;
        valenceCount++;
      }
    });

    const dominantEmotion = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)[0][0];

    return {
      date,
      scansCount: dayResults.length,
      dominantEmotion,
      averageMood: valenceCount > 0 ? totalValence / valenceCount : 0,
      emotionCounts,
    };
  }).sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Calcule le vecteur émotionnel moyen (VAD)
 */
export function calculateAverageEmotionVector(results: EmotionResult[]): EmotionVector {
  if (results.length === 0) {
    return { valence: 0, arousal: 0, dominance: 0 };
  }

  let totalValence = 0;
  let totalArousal = 0;
  let totalDominance = 0;
  let count = 0;

  results.forEach(r => {
    if (r.vector) {
      totalValence += r.vector.valence;
      totalArousal += r.vector.arousal;
      totalDominance += r.vector.dominance;
      count++;
    } else if (r.valence !== undefined && r.arousal !== undefined) {
      totalValence += r.valence;
      totalArousal += r.arousal;
      totalDominance += 0.5; // Valeur par défaut
      count++;
    }
  });

  if (count === 0) {
    return { valence: 0, arousal: 0.5, dominance: 0.5 };
  }

  return {
    valence: totalValence / count,
    arousal: totalArousal / count,
    dominance: totalDominance / count,
  };
}

/**
 * Détecte les patterns récurrents dans les émotions
 */
export function detectEmotionPatterns(results: EmotionResult[]): {
  morningMood?: string;
  afternoonMood?: string;
  eveningMood?: string;
  weekdayMood?: string;
  weekendMood?: string;
  mostFrequentTransition?: { from: string; to: string; count: number };
} {
  if (results.length < 5) {
    return {};
  }

  const patterns: any = {};

  // Analyser par moment de la journée
  const timeOfDayEmotions: Record<string, string[]> = {
    morning: [],
    afternoon: [],
    evening: [],
  };

  const dayTypeEmotions: Record<string, string[]> = {
    weekday: [],
    weekend: [],
  };

  results.forEach(r => {
    const date = new Date(r.timestamp);
    const hour = date.getHours();
    const day = date.getDay();
    const emotion = r.emotion.toLowerCase();

    // Moment de la journée
    if (hour >= 6 && hour < 12) {
      timeOfDayEmotions.morning.push(emotion);
    } else if (hour >= 12 && hour < 18) {
      timeOfDayEmotions.afternoon.push(emotion);
    } else if (hour >= 18 || hour < 6) {
      timeOfDayEmotions.evening.push(emotion);
    }

    // Type de jour
    if (day === 0 || day === 6) {
      dayTypeEmotions.weekend.push(emotion);
    } else {
      dayTypeEmotions.weekday.push(emotion);
    }
  });

  // Trouver l'émotion la plus fréquente pour chaque catégorie
  patterns.morningMood = findMostFrequent(timeOfDayEmotions.morning);
  patterns.afternoonMood = findMostFrequent(timeOfDayEmotions.afternoon);
  patterns.eveningMood = findMostFrequent(timeOfDayEmotions.evening);
  patterns.weekdayMood = findMostFrequent(dayTypeEmotions.weekday);
  patterns.weekendMood = findMostFrequent(dayTypeEmotions.weekend);

  // Analyser les transitions
  const transitions: Record<string, number> = {};
  for (let i = 0; i < results.length - 1; i++) {
    const from = results[i].emotion.toLowerCase();
    const to = results[i + 1].emotion.toLowerCase();
    const key = `${from}->${to}`;
    transitions[key] = (transitions[key] || 0) + 1;
  }

  const topTransition = Object.entries(transitions)
    .sort(([, a], [, b]) => b - a)[0];

  if (topTransition) {
    const [transition, count] = topTransition;
    const [from, to] = transition.split('->');
    patterns.mostFrequentTransition = { from, to, count };
  }

  return patterns;
}

/**
 * Trouve l'élément le plus fréquent dans un tableau
 */
function findMostFrequent(items: string[]): string | undefined {
  if (items.length === 0) return undefined;

  const counts: Record<string, number> = {};
  items.forEach(item => {
    counts[item] = (counts[item] || 0) + 1;
  });

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)[0]?.[0];
}

/**
 * Calcule un score de bien-être global sur une période
 */
export function calculateWellbeingScore(results: EmotionResult[]): number {
  if (results.length === 0) return 50; // Score neutre

  const stats = calculateEmotionStatistics(results);
  const avgVector = calculateAverageEmotionVector(results);

  // Facteurs du score (0-100):
  // 1. Valence moyenne (40% du score) - émotions positives vs négatives
  const valenceScore = ((avgVector.valence + 1) / 2) * 40;

  // 2. Confiance des scans (20% du score)
  const confidenceScore = (stats.averageConfidence / 100) * 20;

  // 3. Stabilité émotionnelle (20% du score) - moins de variations = plus stable
  const stability = calculateEmotionalStability(results);
  const stabilityScore = stability * 20;

  // 4. Proportion d'émotions positives (20% du score)
  const positiveRatio = calculatePositiveEmotionRatio(results);
  const positiveScore = positiveRatio * 20;

  const totalScore = valenceScore + confidenceScore + stabilityScore + positiveScore;

  return Math.round(Math.max(0, Math.min(100, totalScore)));
}

/**
 * Calcule la stabilité émotionnelle (0-1)
 */
function calculateEmotionalStability(results: EmotionResult[]): number {
  if (results.length < 2) return 1;

  const sortedResults = [...results].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  let totalVariation = 0;
  for (let i = 0; i < sortedResults.length - 1; i++) {
    const current = sortedResults[i];
    const next = sortedResults[i + 1];

    const valenceDiff = Math.abs((current.valence || 0) - (next.valence || 0));
    const arousalDiff = Math.abs((current.arousal || 0) - (next.arousal || 0));

    totalVariation += (valenceDiff + arousalDiff) / 2;
  }

  const avgVariation = totalVariation / (sortedResults.length - 1);
  return Math.max(0, 1 - avgVariation);
}

/**
 * Calcule le ratio d'émotions positives (0-1)
 */
function calculatePositiveEmotionRatio(results: EmotionResult[]): number {
  if (results.length === 0) return 0.5;

  const positiveCount = results.filter(r => {
    const emotion = r.emotion.toLowerCase();
    return EMOTION_CATEGORIES.POSITIVE.includes(emotion);
  }).length;

  return positiveCount / results.length;
}

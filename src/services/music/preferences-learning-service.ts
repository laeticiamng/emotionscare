/**
 * Service d'apprentissage automatique des préférences musicales
 * Ajuste les préférences en fonction de l'historique d'écoute réel
 */

import { logger } from '@/lib/logger';
import { getUserHistory, type MusicHistoryEntry } from './history-service';
import { getUserPreferences, saveUserPreferences, type UserMusicPreferences } from './preferences-service';

interface LearningInsights {
  suggestedGenres: string[];
  adjustedMoods: string[];
  tempoShift: { min: number; max: number };
  energyLevelAdjustment: number;
  tasteChangeDetected: boolean;
  confidence: number;
}

/**
 * Analyser l'historique et générer des insights d'apprentissage
 */
export async function analyzeMusicBehavior(): Promise<LearningInsights | null> {
  try {
    const [history, currentPrefs] = await Promise.all([
      getUserHistory(200), // Analyser les 200 dernières écoutes
      getUserPreferences(),
    ]);

    if (history.length < 10) {
      logger.info('Not enough history for learning', { count: history.length }, 'MUSIC');
      return null;
    }

    // Analyser les genres réellement écoutés
    const genreFrequency = analyzeGenreFrequency(history);
    const moodFrequency = analyzeMoodFrequency(history);
    const tempoAnalysis = analyzeTempoPreferences(history);
    const energyAnalysis = analyzeEnergyLevel(history);

    // Détecter les changements de goût
    const tasteChangeDetected = detectTasteChange(history, currentPrefs);

    // Suggérer de nouveaux genres à découvrir
    const suggestedGenres = suggestNewGenres(genreFrequency, currentPrefs);

    // Calculer la confiance de l'analyse
    const confidence = calculateConfidence(history);

    return {
      suggestedGenres,
      adjustedMoods: moodFrequency.slice(0, 5),
      tempoShift: tempoAnalysis,
      energyLevelAdjustment: energyAnalysis,
      tasteChangeDetected,
      confidence,
    };
  } catch (error) {
    logger.error('Failed to analyze music behavior', error as Error, 'MUSIC');
    return null;
  }
}

/**
 * Appliquer automatiquement les ajustements appris
 */
export async function applyLearningAdjustments(
  insights: LearningInsights,
  autoApply: boolean = false
): Promise<{ success: boolean; message: string }> {
  try {
    const currentPrefs = await getUserPreferences();
    
    if (!currentPrefs) {
      return { success: false, message: 'No existing preferences to adjust' };
    }

    // Ne pas auto-appliquer si la confiance est trop faible
    if (insights.confidence < 0.6 && autoApply) {
      logger.info('Confidence too low for auto-apply', { confidence: insights.confidence }, 'MUSIC');
      return { success: false, message: 'Confidence too low for automatic adjustment' };
    }

    // Préparer les nouvelles préférences
    const adjustedPreferences = {
      genres: mergeGenres(currentPrefs.favorite_genres, insights.suggestedGenres),
      moods: insights.adjustedMoods,
      tempoRange: insights.tempoShift,
      contexts: currentPrefs.listening_contexts,
      energyLevel: Math.round(insights.energyLevelAdjustment),
      instrumentalPreference: currentPrefs.instrumental_preference,
    };

    // Sauvegarder les ajustements
    const result = await saveUserPreferences(adjustedPreferences);

    if (result.success) {
      logger.info('Learning adjustments applied', { 
        newGenres: insights.suggestedGenres.length,
        confidence: insights.confidence 
      }, 'MUSIC');
      
      return { 
        success: true, 
        message: `Préférences ajustées avec ${Math.round(insights.confidence * 100)}% de confiance` 
      };
    }

    return { success: false, message: result.error || 'Failed to save adjustments' };
  } catch (error) {
    logger.error('Failed to apply learning adjustments', error as Error, 'MUSIC');
    return { success: false, message: (error as Error).message };
  }
}

/**
 * Analyser la fréquence des genres
 */
function analyzeGenreFrequency(history: MusicHistoryEntry[]): string[] {
  const genreCounts: Record<string, number> = {};
  
  history.forEach(entry => {
    const genre = entry.metadata?.genre || entry.emotion || 'unknown';
    // Pondérer par le taux de complétion
    const weight = (entry.completion_rate || 50) / 100;
    genreCounts[genre] = (genreCounts[genre] || 0) + weight;
  });

  return Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([genre]) => genre);
}

/**
 * Analyser la fréquence des moods
 */
function analyzeMoodFrequency(history: MusicHistoryEntry[]): string[] {
  const moodCounts: Record<string, number> = {};
  
  history.forEach(entry => {
    if (entry.mood) {
      const weight = (entry.completion_rate || 50) / 100;
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + weight;
    }
  });

  return Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([mood]) => mood);
}

/**
 * Analyser les préférences de tempo
 */
function analyzeTempoPreferences(history: MusicHistoryEntry[]): { min: number; max: number } {
  const tempos: number[] = [];
  
  history.forEach(entry => {
    const bpm = entry.metadata?.bpm || entry.metadata?.tempo;
    if (bpm && entry.completion_rate && entry.completion_rate > 70) {
      tempos.push(bpm);
    }
  });

  if (tempos.length === 0) {
    return { min: 80, max: 140 };
  }

  tempos.sort((a, b) => a - b);
  const p10 = tempos[Math.floor(tempos.length * 0.1)] || 70;
  const p90 = tempos[Math.floor(tempos.length * 0.9)] || 150;

  return {
    min: Math.max(60, Math.round(p10)),
    max: Math.min(180, Math.round(p90)),
  };
}

/**
 * Analyser le niveau d'énergie préféré
 */
function analyzeEnergyLevel(history: MusicHistoryEntry[]): number {
  const energyLevels: number[] = [];
  
  history.forEach(entry => {
    const energy = entry.metadata?.energy || entry.metadata?.energyLevel;
    if (energy && entry.completion_rate && entry.completion_rate > 70) {
      energyLevels.push(energy);
    }
  });

  if (energyLevels.length === 0) {
    return 50;
  }

  const avg = energyLevels.reduce((a, b) => a + b, 0) / energyLevels.length;
  return Math.round(Math.max(0, Math.min(100, avg)));
}

/**
 * Détecter un changement de goût
 */
function detectTasteChange(
  history: MusicHistoryEntry[],
  currentPrefs: UserMusicPreferences | null
): boolean {
  if (!currentPrefs || history.length < 50) return false;

  // Comparer les 25 dernières écoutes avec les 25 précédentes
  const recent = history.slice(0, 25);
  const previous = history.slice(25, 50);

  const recentGenres = new Set(recent.map(e => e.metadata?.genre || e.emotion).filter(Boolean));
  const previousGenres = new Set(previous.map(e => e.metadata?.genre || e.emotion).filter(Boolean));

  // Calculer le taux de changement
  const intersection = new Set([...recentGenres].filter(g => previousGenres.has(g)));
  const changeRate = 1 - (intersection.size / Math.max(recentGenres.size, previousGenres.size));

  return changeRate > 0.4; // Plus de 40% de changement
}

/**
 * Suggérer de nouveaux genres à découvrir
 */
function suggestNewGenres(
  currentGenres: string[],
  preferences: UserMusicPreferences | null
): string[] {
  const _allGenres = [
    'ambient', 'classical', 'electronic', 'jazz', 'pop', 'rock', 
    'lofi', 'world', 'indie', 'soundtrack', 'folk', 'blues',
    'reggae', 'soul', 'funk', 'metal', 'punk', 'country'
  ];

  const existingGenres = new Set([
    ...currentGenres,
    ...(preferences?.favorite_genres || []),
  ]);

  // Genres complémentaires basés sur des affinités
  const genreAffinities: Record<string, string[]> = {
    ambient: ['lofi', 'classical', 'world'],
    electronic: ['ambient', 'indie', 'pop'],
    jazz: ['soul', 'blues', 'funk'],
    rock: ['indie', 'punk', 'metal'],
    classical: ['soundtrack', 'ambient', 'world'],
    lofi: ['ambient', 'jazz', 'indie'],
  };

  const suggestions = new Set<string>();

  // Trouver des genres complémentaires
  currentGenres.forEach(genre => {
    const related = genreAffinities[genre] || [];
    related.forEach(g => {
      if (!existingGenres.has(g)) {
        suggestions.add(g);
      }
    });
  });

  return Array.from(suggestions).slice(0, 3);
}

/**
 * Calculer la confiance de l'analyse
 */
function calculateConfidence(history: MusicHistoryEntry[]): number {
  if (history.length < 10) return 0;
  
  // Facteurs de confiance
  const historySize = Math.min(history.length / 200, 1); // Max à 200 écoutes
  const completionQuality = history.filter(e => (e.completion_rate || 0) > 70).length / history.length;
  const diversity = new Set(history.map(e => e.metadata?.genre || e.emotion)).size / 10; // Max 10 genres

  return Math.min((historySize * 0.4 + completionQuality * 0.4 + diversity * 0.2), 1);
}

/**
 * Fusionner les genres existants avec les suggestions
 */
function mergeGenres(existing: string[], suggestions: string[]): string[] {
  const merged = new Set([...existing]);
  
  // Ajouter jusqu'à 2 nouveaux genres suggérés
  let added = 0;
  for (const genre of suggestions) {
    if (!merged.has(genre) && added < 2) {
      merged.add(genre);
      added++;
    }
  }

  return Array.from(merged);
}

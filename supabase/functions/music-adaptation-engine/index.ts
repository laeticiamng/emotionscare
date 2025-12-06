import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { authorizeRole } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdaptationRequest {
  userId: string;
  currentEmotionalState: {
    valence: number;
    arousal: number;
    stress: number;
    focus: number;
    energy: number;
  };
  targetEmotion: string;
  sessionProgress: number;
  currentPlaylist: any[];
  listeningHistory: any[];
  preferences: {
    genres: string[];
    intensity_preference: number;
    session_length: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const adaptationData = await req.json() as AdaptationRequest;
    
    console.log('Processing music adaptation for user:', adaptationData.userId);

    // Advanced music adaptation algorithm
    const adaptationResult = await processAdaptation(adaptationData);

    return new Response(JSON.stringify(adaptationResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in music-adaptation-engine:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      adaptation_score: 0,
      recommendations: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processAdaptation(data: AdaptationRequest) {
  const { currentEmotionalState, targetEmotion, sessionProgress, preferences } = data;

  // Calculate emotional distance from target
  const targetEmotionalState = getTargetEmotionalState(targetEmotion);
  const emotionalDistance = calculateEmotionalDistance(currentEmotionalState, targetEmotionalState);
  
  // Determine adaptation strategy
  const adaptationStrategy = determineAdaptationStrategy(
    currentEmotionalState,
    targetEmotionalState,
    sessionProgress,
    emotionalDistance
  );

  // Generate music recommendations
  const recommendations = await generateMusicRecommendations(
    currentEmotionalState,
    targetEmotionalState,
    adaptationStrategy,
    preferences,
    sessionProgress
  );

  // Calculate adaptation effectiveness score
  const adaptationScore = calculateAdaptationScore(
    emotionalDistance,
    sessionProgress,
    recommendations.length
  );

  return {
    adaptation_score: adaptationScore,
    emotional_distance: emotionalDistance,
    strategy: adaptationStrategy,
    recommendations,
    next_track_suggestion: recommendations[0] || null,
    session_insights: {
      progress_towards_target: 1 - emotionalDistance,
      estimated_time_to_target: estimateTimeToTarget(emotionalDistance, adaptationStrategy),
      suggested_session_adjustment: getSuggestedAdjustment(currentEmotionalState, targetEmotionalState)
    }
  };
}

function getTargetEmotionalState(targetEmotion: string) {
  const emotionalTargets: Record<string, any> = {
    'calm': { valence: 0.3, arousal: 0.2, stress: 0.1, focus: 0.7, energy: 0.3 },
    'energetic': { valence: 0.8, arousal: 0.9, stress: 0.2, focus: 0.6, energy: 0.9 },
    'focused': { valence: 0.6, arousal: 0.6, stress: 0.3, focus: 0.9, energy: 0.6 },
    'balanced': { valence: 0.5, arousal: 0.5, stress: 0.4, focus: 0.6, energy: 0.5 },
    'uplifting': { valence: 0.9, arousal: 0.7, stress: 0.2, focus: 0.5, energy: 0.7 },
    'contemplative': { valence: 0.4, arousal: 0.3, stress: 0.3, focus: 0.8, energy: 0.4 }
  };

  return emotionalTargets[targetEmotion] || emotionalTargets['balanced'];
}

function calculateEmotionalDistance(current: any, target: any): number {
  const valenceDiff = Math.abs(current.valence - target.valence);
  const arousalDiff = Math.abs(current.arousal - target.arousal);
  const stressDiff = Math.abs(current.stress - target.stress);
  const focusDiff = Math.abs(current.focus - target.focus);
  const energyDiff = Math.abs(current.energy - target.energy);

  return (valenceDiff + arousalDiff + stressDiff + focusDiff + energyDiff) / 5;
}

function determineAdaptationStrategy(
  current: any,
  target: any,
  progress: number,
  distance: number
) {
  // Progressive transition strategy
  if (distance > 0.7) {
    return 'gradual_transition';
  } else if (distance > 0.4) {
    return 'moderate_adjustment';
  } else if (distance > 0.2) {
    return 'fine_tuning';
  } else {
    return 'maintenance';
  }
}

async function generateMusicRecommendations(
  current: any,
  target: any,
  strategy: string,
  preferences: any,
  progress: number
) {
  // Calculate intermediate emotional state for smooth transition
  const transitionRate = getTransitionRate(strategy);
  const intermediateState = {
    valence: current.valence + (target.valence - current.valence) * transitionRate * progress,
    arousal: current.arousal + (target.arousal - current.arousal) * transitionRate * progress,
    energy: current.energy + (target.energy - current.energy) * transitionRate * progress
  };

  // Generate recommendations based on intermediate state
  const recommendations = [];

  // Musical characteristics mapping
  const musicCharacteristics = getMusicCharacteristics(intermediateState, preferences);

  // Generate multiple track suggestions
  for (let i = 0; i < 5; i++) {
    const track = {
      id: `adaptive_${Date.now()}_${i}`,
      title: `Adaptive Track ${i + 1}`,
      artist: 'Therapeutic Music AI',
      genre: selectGenre(musicCharacteristics, preferences.genres),
      bpm: calculateOptimalBPM(intermediateState),
      key: selectKey(intermediateState),
      valence: intermediateState.valence,
      arousal: intermediateState.arousal,
      energy: intermediateState.energy,
      therapeutic_score: calculateTherapeuticScore(intermediateState, target),
      adaptation_weight: 1 - (i * 0.1), // Decreasing weight for alternatives
      reason: getRecommendationReason(strategy, intermediateState)
    };

    recommendations.push(track);
  }

  return recommendations;
}

function getTransitionRate(strategy: string): number {
  const rates: Record<string, number> = {
    'gradual_transition': 0.1,
    'moderate_adjustment': 0.3,
    'fine_tuning': 0.6,
    'maintenance': 0.9
  };

  return rates[strategy] || 0.3;
}

function getMusicCharacteristics(state: any, preferences: any) {
  return {
    intensity: state.arousal * state.energy,
    positivity: state.valence,
    complexity: state.focus,
    rhythm_emphasis: state.arousal > 0.6,
    harmonic_richness: state.valence > 0.5,
    tempo_stability: state.focus > 0.7
  };
}

function selectGenre(characteristics: any, preferredGenres: string[]): string {
  const genreScores: Record<string, number> = {
    'ambient': characteristics.positivity * 0.5 + (1 - characteristics.intensity) * 0.5,
    'classical': characteristics.complexity * 0.7 + characteristics.harmonic_richness * 0.3,
    'electronic': characteristics.intensity * 0.6 + characteristics.rhythm_emphasis * 0.4,
    'nature': (1 - characteristics.intensity) * 0.8 + characteristics.positivity * 0.2,
    'binaural': characteristics.complexity * 0.5 + (1 - characteristics.intensity) * 0.5
  };

  // Boost scores for preferred genres
  preferredGenres.forEach(genre => {
    if (genreScores[genre]) {
      genreScores[genre] *= 1.5;
    }
  });

  // Return genre with highest score
  return Object.entries(genreScores).reduce((a, b) => genreScores[a[0]] > genreScores[b[0]] ? a : b)[0];
}

function calculateOptimalBPM(state: any): number {
  const baseBPM = 80;
  const arousalAdjustment = (state.arousal - 0.5) * 40;
  const energyAdjustment = (state.energy - 0.5) * 30;
  
  return Math.round(baseBPM + arousalAdjustment + energyAdjustment);
}

function selectKey(state: any): string {
  const majorKeys = ['C major', 'D major', 'E major', 'F major', 'G major', 'A major', 'B major'];
  const minorKeys = ['C minor', 'D minor', 'E minor', 'F minor', 'G minor', 'A minor', 'B minor'];
  
  // Higher valence favors major keys
  if (state.valence > 0.6) {
    return majorKeys[Math.floor(Math.random() * majorKeys.length)];
  } else if (state.valence < 0.4) {
    return minorKeys[Math.floor(Math.random() * minorKeys.length)];
  } else {
    // Mixed selection for neutral valence
    const allKeys = [...majorKeys, ...minorKeys];
    return allKeys[Math.floor(Math.random() * allKeys.length)];
  }
}

function calculateTherapeuticScore(current: any, target: any): number {
  // Score based on how well this track configuration helps move towards target
  const valenceDelta = Math.abs(target.valence - current.valence);
  const arousalDelta = Math.abs(target.arousal - current.arousal);
  const stressDelta = Math.abs(target.stress - current.stress);
  
  const totalDelta = valenceDelta + arousalDelta + stressDelta;
  
  // Higher score for configurations that help bridge the gap
  return Math.max(0.1, 1 - totalDelta / 3);
}

function calculateAdaptationScore(distance: number, progress: number, recommendationCount: number): number {
  const distanceScore = 1 - distance; // Closer to target = higher score
  const progressScore = progress; // More progress = higher score
  const diversityScore = Math.min(recommendationCount / 5, 1); // More options = higher score
  
  return (distanceScore * 0.5 + progressScore * 0.3 + diversityScore * 0.2);
}

function estimateTimeToTarget(distance: number, strategy: string): number {
  const baseTime = distance * 20; // Base time in minutes
  
  const strategyMultipliers: Record<string, number> = {
    'gradual_transition': 2.0,
    'moderate_adjustment': 1.5,
    'fine_tuning': 1.0,
    'maintenance': 0.5
  };
  
  return Math.round(baseTime * (strategyMultipliers[strategy] || 1.5));
}

function getSuggestedAdjustment(current: any, target: any) {
  const suggestions = [];
  
  if (Math.abs(current.valence - target.valence) > 0.3) {
    suggestions.push({
      parameter: 'valence',
      direction: current.valence < target.valence ? 'increase' : 'decrease',
      intensity: 'moderate'
    });
  }
  
  if (Math.abs(current.arousal - target.arousal) > 0.3) {
    suggestions.push({
      parameter: 'arousal',
      direction: current.arousal < target.arousal ? 'increase' : 'decrease',
      intensity: 'moderate'
    });
  }
  
  if (current.stress > 0.6) {
    suggestions.push({
      parameter: 'stress',
      direction: 'decrease',
      intensity: 'high'
    });
  }
  
  return suggestions;
}

function getRecommendationReason(strategy: string, state: any): string {
  const reasons: Record<string, string> = {
    'gradual_transition': 'Transition douce vers votre objectif émotionnel',
    'moderate_adjustment': 'Ajustement modéré de votre état actuel',
    'fine_tuning': 'Affinement précis de votre bien-être',
    'maintenance': 'Maintien de votre équilibre émotionnel optimal'
  };
  
  return reasons[strategy] || 'Recommandation personnalisée pour votre bien-être';
}
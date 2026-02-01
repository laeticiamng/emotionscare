/**
 * useAIRouter - Hook intelligent pour orchestration IA proactive
 * 
 * Fonctionnalités:
 * - Analyse du contexte utilisateur en temps réel
 * - Recommandations proactives basées sur l'état émotionnel
 * - Prédiction des besoins utilisateur
 * - Routing intelligent vers les modules appropriés
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMoodUnified } from '@/hooks/unified/useMoodUnified';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// ============================================================================
// TYPES
// ============================================================================

export type ModuleType = 
  | 'breath' 
  | 'music' 
  | 'journal' 
  | 'coach' 
  | 'scan' 
  | 'meditation'
  | 'park'
  | 'challenges';

export interface UserContext {
  mood: {
    valence: number;
    arousal: number;
    vibe: string;
  };
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: number;
  lastActivity?: string;
  lastActivityTime?: Date;
  streak?: number;
  recentEmotions?: string[];
}

export interface AIRecommendation {
  module: ModuleType;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  action: string;
  route: string;
  confidence: number;
  estimatedDuration?: number; // in minutes
  icon?: string;
}

export interface AIRouterState {
  recommendations: AIRecommendation[];
  isAnalyzing: boolean;
  lastAnalysis: Date | null;
  userContext: UserContext | null;
}

// ============================================================================
// DECISION ENGINE
// ============================================================================

function analyzeContext(context: UserContext): AIRecommendation[] {
  const recommendations: AIRecommendation[] = [];
  const { valence, arousal, vibe } = context.mood;
  
  // High stress detection (low valence + high arousal)
  if (valence < -30 && arousal > 60) {
    recommendations.push({
      module: 'breath',
      priority: 'high',
      reason: 'Stress détecté - respiration recommandée',
      action: 'Démarrer une session de cohérence cardiaque',
      route: '/app/breath',
      confidence: 0.92,
      estimatedDuration: 5,
      icon: '🌬️',
    });
    
    recommendations.push({
      module: 'music',
      priority: 'medium',
      reason: 'Musique apaisante pour réduire le stress',
      action: 'Écouter une playlist relaxante',
      route: '/app/music?mood=calm',
      confidence: 0.85,
      estimatedDuration: 15,
      icon: '🎵',
    });
  }
  
  // Low energy detection (low valence + low arousal)
  if (valence < -20 && arousal < 40) {
    recommendations.push({
      module: 'coach',
      priority: 'high',
      reason: 'Moral bas - soutien personnalisé recommandé',
      action: 'Parler à votre coach IA',
      route: '/app/coach',
      confidence: 0.88,
      estimatedDuration: 10,
      icon: '💬',
    });
    
    recommendations.push({
      module: 'journal',
      priority: 'medium',
      reason: 'L\'écriture peut aider à clarifier vos émotions',
      action: 'Écrire dans votre journal',
      route: '/app/journal',
      confidence: 0.78,
      estimatedDuration: 8,
      icon: '📝',
    });
  }
  
  // High positive energy (high valence + high arousal)
  if (valence > 50 && arousal > 60) {
    recommendations.push({
      module: 'challenges',
      priority: 'medium',
      reason: 'Belle énergie - c\'est le moment de progresser !',
      action: 'Relever un défi',
      route: '/gamification',
      confidence: 0.82,
      estimatedDuration: 15,
      icon: '🏆',
    });
    
    recommendations.push({
      module: 'music',
      priority: 'low',
      reason: 'Amplifier votre bonne humeur',
      action: 'Écouter une playlist dynamique',
      route: '/app/music?mood=energy',
      confidence: 0.75,
      estimatedDuration: 20,
      icon: '🎵',
    });
  }
  
  // Calm state (high valence + low arousal)
  if (valence > 30 && arousal < 40) {
    recommendations.push({
      module: 'meditation',
      priority: 'medium',
      reason: 'État calme idéal pour la méditation',
      action: 'Méditer 10 minutes',
      route: '/app/breath?mode=meditation',
      confidence: 0.85,
      estimatedDuration: 10,
      icon: '🧘',
    });
    
    recommendations.push({
      module: 'park',
      priority: 'low',
      reason: 'Explorer votre parc émotionnel',
      action: 'Visiter le parc',
      route: '/app/emotional-park',
      confidence: 0.70,
      estimatedDuration: 5,
      icon: '🌳',
    });
  }
  
  // Time-based recommendations
  if (context.timeOfDay === 'morning') {
    if (!recommendations.some(r => r.module === 'scan')) {
      recommendations.push({
        module: 'scan',
        priority: 'medium',
        reason: 'Commencer la journée par un scan émotionnel',
        action: 'Scanner votre humeur du matin',
        route: '/app/scan',
        confidence: 0.80,
        estimatedDuration: 2,
        icon: '🔍',
      });
    }
  }
  
  if (context.timeOfDay === 'evening') {
    if (!recommendations.some(r => r.module === 'journal')) {
      recommendations.push({
        module: 'journal',
        priority: 'medium',
        reason: 'Bilan de fin de journée',
        action: 'Écrire votre réflexion du soir',
        route: '/app/journal',
        confidence: 0.75,
        estimatedDuration: 5,
        icon: '📝',
      });
    }
  }
  
  // Default recommendation if nothing specific
  if (recommendations.length === 0) {
    recommendations.push({
      module: 'scan',
      priority: 'low',
      reason: 'Faire le point sur vos émotions',
      action: 'Scanner votre humeur',
      route: '/app/scan',
      confidence: 0.65,
      estimatedDuration: 2,
      icon: '🔍',
    });
  }
  
  // Sort by priority and confidence
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.confidence - a.confidence;
  });
}

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour < 6) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

// ============================================================================
// HOOK
// ============================================================================

export function useAIRouter() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const mood = useMoodUnified();
  
  const [state, setState] = useState<AIRouterState>({
    recommendations: [],
    isAnalyzing: false,
    lastAnalysis: null,
    userContext: null,
  });
  
  // Build user context
  const userContext = useMemo((): UserContext => ({
    mood: {
      valence: mood.valence,
      arousal: mood.arousal,
      vibe: mood.vibe,
    },
    timeOfDay: getTimeOfDay(),
    dayOfWeek: new Date().getDay(),
  }), [mood.valence, mood.arousal, mood.vibe]);
  
  // Analyze and generate recommendations
  const analyze = useCallback(async () => {
    setState(prev => ({ ...prev, isAnalyzing: true }));
    
    try {
      // Local analysis (fast, no API call needed for basic recommendations)
      const recommendations = analyzeContext(userContext);
      
      setState({
        recommendations,
        isAnalyzing: false,
        lastAnalysis: new Date(),
        userContext,
      });
      
      logger.info(`AI Router: Generated ${recommendations.length} recommendations`, 'AI');
      
      return recommendations;
    } catch (error) {
      logger.error('AI Router analysis failed', error as Error, 'AI');
      setState(prev => ({ ...prev, isAnalyzing: false }));
      return [];
    }
  }, [userContext]);
  
  // Enhanced analysis with backend AI
  const analyzeWithAI = useCallback(async () => {
    setState(prev => ({ ...prev, isAnalyzing: true }));
    
    try {
      const { data, error } = await supabase.functions.invoke('router-ai', {
        body: {
          action: 'analyze_context',
          context: userContext,
          userId: user?.id,
        },
      });
      
      if (error) throw error;
      
      const aiRecommendations = data?.recommendations || analyzeContext(userContext);
      
      setState({
        recommendations: aiRecommendations,
        isAnalyzing: false,
        lastAnalysis: new Date(),
        userContext,
      });
      
      return aiRecommendations;
    } catch (error) {
      logger.warn('AI backend analysis failed, falling back to local', error as Error, 'AI');
      return analyze();
    }
  }, [userContext, user?.id, analyze]);
  
  // Navigate to recommended module
  const goToRecommendation = useCallback((recommendation: AIRecommendation) => {
    logger.info(`AI Router: Navigating to ${recommendation.module}`, 'AI');
    navigate(recommendation.route);
  }, [navigate]);
  
  // Get top recommendation
  const topRecommendation = useMemo(() => 
    state.recommendations[0] || null
  , [state.recommendations]);
  
  // Quick action - execute top recommendation
  const executeTopRecommendation = useCallback(() => {
    if (topRecommendation) {
      goToRecommendation(topRecommendation);
    }
  }, [topRecommendation, goToRecommendation]);
  
  // Auto-analyze when mood changes significantly
  useEffect(() => {
    const shouldReanalyze = !state.lastAnalysis || 
      (Date.now() - state.lastAnalysis.getTime() > 5 * 60 * 1000); // 5 minutes
    
    if (shouldReanalyze && !state.isAnalyzing) {
      analyze();
    }
  }, [mood.valence, mood.arousal, analyze, state.lastAnalysis, state.isAnalyzing]);
  
  return {
    // State
    recommendations: state.recommendations,
    topRecommendation,
    isAnalyzing: state.isAnalyzing,
    lastAnalysis: state.lastAnalysis,
    userContext: state.userContext,
    
    // Actions
    analyze,
    analyzeWithAI,
    goToRecommendation,
    executeTopRecommendation,
  };
}

export default useAIRouter;

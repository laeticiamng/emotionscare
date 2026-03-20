import { useState, useCallback, useEffect } from 'react';
import { EmotionResult, EmotionRecommendation, ScanSession, EmotionGoal } from '@/types/emotion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLogger } from '@/lib/logger';
import { v4 as uuidv4 } from 'uuid';

interface UseScanPageReturn {
  currentEmotion: string | null;
  recommendations: EmotionRecommendation[];
  alternativeRecommendations: EmotionRecommendation[];
  scanHistory: EmotionResult[];
  currentSession: ScanSession | null;
  emotionGoals: EmotionGoal[];
  isLoadingHistory: boolean;
  handleScanComplete: (result: EmotionResult) => void;
  createEmotionGoal: (goal: Partial<EmotionGoal>) => Promise<void>;
  updateGoalProgress: (goalId: string, progress: number) => Promise<void>;
  getScanInsights: () => Promise<any[]>;
  exportScanData: () => void;
}

export function useScanPage(): UseScanPageReturn {
  const logger = useLogger();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // États locaux
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<ScanSession | null>(null);
  const [recommendations, setRecommendations] = useState<EmotionRecommendation[]>([]);
  const [alternativeRecommendations, setAlternativeRecommendations] = useState<EmotionRecommendation[]>([]);

  // Récupérer l'historique des scans
  const { data: scanHistory = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['scan-history', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('emotion_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        logger.error('Error fetching scan history', { error });
        return [];
      }

      return data.map(item => ({
        id: item.id,
        emotion: item.emotion,
        confidence: { overall: parseFloat(item.confidence) || 0 },
        timestamp: new Date(item.created_at),
        source: item.source as any,
        scanMode: item.scan_mode as any || 'facial',
        duration: item.duration || 0,
        vector: {
          valence: item.valence || 0,
          arousal: item.arousal || 0,
          dominance: item.dominance || 0.5
        }
      })) as EmotionResult[];
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
  });

  // Récupérer les objectifs émotionnels
  const { data: emotionGoals = [] } = useQuery({
    queryKey: ['emotion-goals', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('emotion_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching emotion goals', { error });
        return [];
      }

      return data as EmotionGoal[];
    },
    enabled: !!user?.id,
  });

  // Sauvegarder un résultat de scan
  const saveScanMutation = useMutation({
    mutationFn: async (result: EmotionResult) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('emotion_analyses')
        .insert({
          user_id: user.id,
          emotion: result.emotion,
          confidence: result.confidence.overall.toString(),
          source: result.source,
          scan_mode: result.scanMode,
          duration: result.duration,
          valence: result.vector.valence,
          arousal: result.vector.arousal,
          dominance: result.vector.dominance,
          biometrics: result.biometrics,
          predictions: result.predictions,
          session_id: result.sessionId
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scan-history', user?.id] });
      logger.info('Scan result saved successfully');
    },
    onError: (error) => {
      logger.error('Error saving scan result', { error });
    }
  });

  // Créer un objectif émotionnel
  const createGoalMutation = useMutation({
    mutationFn: async (goalData: Partial<EmotionGoal>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const goal: Partial<EmotionGoal> = {
        ...goalData,
        id: uuidv4(),
        userId: user.id,
        progress: 0,
        milestones: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const { error } = await supabase
        .from('emotion_goals')
        .insert(goal);

      if (error) throw error;
      return goal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotion-goals', user?.id] });
      logger.info('Emotion goal created successfully');
    }
  });

  // Fetch recommendations from Supabase based on emotion
  const fetchRecommendations = useCallback(async (emotion: string): Promise<EmotionRecommendation[]> => {
    try {
      if (!user?.id) return [];

      // Try to fetch from ai_recommendations table
      const { data, error } = await supabase
        .from('ai_recommendations')
        .select('*')
        .or(`emotion.eq.${emotion},emotion.is.null`)
        .order('effectiveness', { ascending: false })
        .limit(5);

      if (error) {
        logger.error('Error fetching recommendations', { error });
        return [];
      }

      if (data && data.length > 0) {
        return data.map((item) => ({
          id: item.id || uuidv4(),
          type: item.type || 'activity',
          title: item.title || '',
          description: item.description || '',
          emotion: item.emotion || emotion,
          content: item.content || '',
          category: item.category || 'general',
          duration: item.duration || 10,
          difficulty: item.difficulty || 'easy',
          effectiveness: item.effectiveness || 70,
        })) as EmotionRecommendation[];
      }

      return [];
    } catch (err) {
      logger.error('Error fetching recommendations', { error: err });
      return [];
    }
  }, [user?.id, logger]);

  // Fetch alternative recommendations from Supabase
  const fetchAlternativeRecommendations = useCallback(async (emotion: string): Promise<EmotionRecommendation[]> => {
    try {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('ai_recommendations')
        .select('*')
        .or(`emotion.eq.${emotion},emotion.is.null`)
        .order('effectiveness', { ascending: true })
        .range(5, 10);

      if (error) {
        logger.error('Error fetching alternative recommendations', { error });
        return [];
      }

      return (data || []).map((item) => ({
        id: item.id || uuidv4(),
        type: item.type || 'activity',
        title: item.title || '',
        description: item.description || '',
        emotion: item.emotion || emotion,
        content: item.content || '',
        category: item.category || 'general',
        duration: item.duration || 10,
        difficulty: item.difficulty || 'easy',
        effectiveness: item.effectiveness || 70,
      })) as EmotionRecommendation[];
    } catch (err) {
      logger.error('Error fetching alternative recommendations', { error: err });
      return [];
    }
  }, [user?.id, logger]);

  // Personalize recommendations based on user history
  const personalizeRecommendations = useCallback(async (baseRecs: EmotionRecommendation[]): Promise<EmotionRecommendation[]> => {
    try {
      if (!user?.id || baseRecs.length === 0) return baseRecs;

      // Fetch user's past recommendation interactions to personalize scores
      const { data: interactions } = await supabase
        .from('recommendation_interactions')
        .select('recommendation_id, rating, usage_count')
        .eq('user_id', user.id);

      const interactionMap = new Map(
        (interactions || []).map((i) => [i.recommendation_id, i])
      );

      return baseRecs.map((rec) => {
        const interaction = interactionMap.get(rec.id);
        return {
          ...rec,
          personalizedScore: rec.effectiveness + (interaction?.rating || 0) * 5,
          usageCount: interaction?.usage_count || 0,
          userRating: interaction?.rating || undefined,
        };
      }).sort((a, b) => (b.personalizedScore || 0) - (a.personalizedScore || 0));
    } catch (err) {
      logger.error('Error personalizing recommendations', { error: err });
      return baseRecs;
    }
  }, [user?.id, logger]);

  // Gestionnaire de fin de scan
  const handleScanComplete = useCallback(async (result: EmotionResult) => {
    try {
      logger.info('Processing scan completion', { emotion: result.emotion });

      setCurrentEmotion(result.emotion);

      // Sauvegarder le résultat
      await saveScanMutation.mutateAsync(result);

      // Fetch and personalize recommendations from Supabase
      const rawRecommendations = await fetchRecommendations(result.emotion);
      const personalizedRecs = await personalizeRecommendations(rawRecommendations);
      setRecommendations(personalizedRecs);

      // Fetch alternatives
      const alternatives = await fetchAlternativeRecommendations(result.emotion);
      setAlternativeRecommendations(alternatives);

      // Mettre à jour la session courante
      if (currentSession) {
        const updatedSession: ScanSession = {
          ...currentSession,
          results: [...currentSession.results, result],
          endTime: new Date(),
          dominantEmotion: result.emotion,
          averageConfidence: (currentSession.averageConfidence + result.confidence.overall) / 2
        };
        setCurrentSession(updatedSession);
      }

      // Vérifier les objectifs
      await checkGoalProgress(result);

    } catch (error) {
      logger.error('Error handling scan completion', { error });
    }
  }, [currentSession, logger, saveScanMutation, fetchRecommendations, fetchAlternativeRecommendations, personalizeRecommendations]);

  // Vérifier et mettre à jour les progrès des objectifs
  const checkGoalProgress = async (result: EmotionResult) => {
    try {
      for (const goal of emotionGoals) {
        let newProgress = goal.progress;

        switch (goal.type) {
          case 'increase_positive':
            if (['happy', 'excited', 'calm'].includes(result.emotion)) {
              newProgress = Math.min(100, goal.progress + 2);
            }
            break;
          case 'reduce_negative':
            if (!['sad', 'angry', 'anxious'].includes(result.emotion)) {
              newProgress = Math.min(100, goal.progress + 1.5);
            }
            break;
          case 'improve_stability':
            if (result.confidence.overall > 80) {
              newProgress = Math.min(100, goal.progress + 1);
            }
            break;
        }

        if (newProgress !== goal.progress) {
          await updateGoalProgress(goal.id, newProgress);
        }
      }
    } catch (error) {
      logger.error('Error checking goal progress', { error });
    }
  };

  // Créer un objectif émotionnel
  const createEmotionGoal = async (goalData: Partial<EmotionGoal>) => {
    await createGoalMutation.mutateAsync(goalData);
  };

  // Mettre à jour le progrès d'un objectif
  const updateGoalProgress = async (goalId: string, progress: number) => {
    try {
      const { error } = await supabase
        .from('emotion_goals')
        .update({
          progress,
          updated_at: new Date().toISOString()
        })
        .eq('id', goalId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['emotion-goals', user?.id] });
      logger.info('Goal progress updated', { goalId, progress });
    } catch (error) {
      logger.error('Error updating goal progress', { error });
    }
  };

  // Obtenir des insights sur les scans
  const getScanInsights = async () => {
    try {
      const recentScans = scanHistory.slice(0, 10);
      const insights = [];

      if (recentScans.length > 0) {
        const emotions = recentScans.map(scan => scan.emotion);
        const mostFrequent = getMostFrequent(emotions);

        insights.push({
          type: 'trend',
          title: `Émotion dominante récente: ${mostFrequent}`,
          description: `Vous ressentez principalement "${mostFrequent}" dans vos derniers scans.`,
          confidence: 85
        });

        const avgConfidence = recentScans.reduce((sum, scan) => sum + scan.confidence.overall, 0) / recentScans.length;

        if (avgConfidence > 85) {
          insights.push({
            type: 'quality',
            title: 'Excellente qualité de détection',
            description: `Votre confiance moyenne est de ${avgConfidence.toFixed(1)}%`,
            confidence: 90
          });
        }
      }

      return insights;
    } catch (error) {
      logger.error('Error generating scan insights', { error });
      return [];
    }
  };

  // Exporter les données de scan
  const exportScanData = () => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        scanHistory: scanHistory.slice(0, 100),
        emotionGoals,
        currentSession,
        recommendations,
        metadata: {
          totalScans: scanHistory.length,
          dateRange: {
            from: scanHistory[scanHistory.length - 1]?.timestamp,
            to: scanHistory[0]?.timestamp
          }
        }
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emotionscare-scan-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      logger.info('Scan data exported successfully');
    } catch (error) {
      logger.error('Error exporting scan data', { error });
    }
  };

  // Initialiser une nouvelle session au chargement
  useEffect(() => {
    if (!user?.id) return;

    const newSession: ScanSession = {
      id: `session_${Date.now()}`,
      userId: user.id,
      startTime: new Date(),
      results: [],
      config: {
        duration: 10,
        sensitivity: 75,
        sources: ['facial'],
        realTimeUpdates: true,
        biometricTracking: true
      },
      averageConfidence: 0,
      dominantEmotion: 'neutral',
      emotionChanges: 0,
      stabilityScore: 100
    };

    setCurrentSession(newSession);
  }, [user?.id]);

  return {
    currentEmotion,
    recommendations,
    alternativeRecommendations,
    scanHistory,
    currentSession,
    emotionGoals,
    isLoadingHistory,
    handleScanComplete,
    createEmotionGoal,
    updateGoalProgress,
    getScanInsights,
    exportScanData
  };
}

// Fonction utilitaire
function getMostFrequent<T>(arr: T[]): T {
  const counts = arr.reduce((acc, item) => {
    acc[item as string] = (acc[item as string] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(counts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] as T || arr[0];
}

export default useScanPage;

import { useState, useCallback, useEffect } from 'react';
import { EmotionResult, EmotionRecommendation, ScanSession, EmotionGoal } from '@/types/emotion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
  
  // États locaux
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<ScanSession | null>(null);
  const [recommendations, setRecommendations] = useState<EmotionRecommendation[]>([]);
  const [alternativeRecommendations, setAlternativeRecommendations] = useState<EmotionRecommendation[]>([]);

  // Récupérer l'historique des scans
  const { data: scanHistory = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['scan-history'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

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
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Récupérer les objectifs émotionnels
  const { data: emotionGoals = [] } = useQuery({
    queryKey: ['emotion-goals'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

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
    }
  });

  // Sauvegarder un résultat de scan
  const saveScanMutation = useMutation({
    mutationFn: async (result: EmotionResult) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

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
      queryClient.invalidateQueries({ queryKey: ['scan-history'] });
      logger.info('Scan result saved successfully');
    },
    onError: (error) => {
      logger.error('Error saving scan result', { error });
    }
  });

  // Créer un objectif émotionnel
  const createGoalMutation = useMutation({
    mutationFn: async (goalData: Partial<EmotionGoal>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

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
      queryClient.invalidateQueries({ queryKey: ['emotion-goals'] });
      logger.info('Emotion goal created successfully');
    }
  });

  // Générer des recommandations basées sur l'émotion
  const generateRecommendations = useCallback(async (emotion: string): Promise<EmotionRecommendation[]> => {
    try {
      // Recommandations spécifiques par émotion
      const emotionRecommendations: Record<string, EmotionRecommendation[]> = {
        happy: [
          {
            id: uuidv4(),
            type: 'activity',
            title: 'Partagez votre joie',
            description: 'Contactez un proche pour partager ce moment positif',
            emotion: 'happy',
            content: 'Appelez un ami ou écrivez un message positif à quelqu\'un que vous aimez.',
            category: 'social',
            duration: 5,
            difficulty: 'easy',
            effectiveness: 85
          },
          {
            id: uuidv4(),
            type: 'music',
            title: 'Playlist énergique',
            description: 'Écoutez de la musique qui amplifie votre énergie positive',
            emotion: 'happy',
            content: 'Une sélection de musiques entraînantes pour maintenir votre bonne humeur.',
            category: 'music',
            duration: 15,
            difficulty: 'easy',
            effectiveness: 78
          }
        ],
        sad: [
          {
            id: uuidv4(),
            type: 'breathing',
            title: 'Respiration apaisante',
            description: 'Technique de respiration pour calmer les émotions difficiles',
            emotion: 'sad',
            content: 'Inspirez pendant 4 temps, retenez pendant 4 temps, expirez pendant 6 temps.',
            category: 'mindfulness',
            duration: 10,
            difficulty: 'easy',
            effectiveness: 82
          },
          {
            id: uuidv4(),
            type: 'journal',
            title: 'Écriture thérapeutique',
            description: 'Exprimez vos sentiments par écrit pour les traiter',
            emotion: 'sad',
            content: 'Prenez 10 minutes pour écrire librement sur ce que vous ressentez.',
            category: 'reflection',
            duration: 15,
            difficulty: 'medium',
            effectiveness: 79
          }
        ],
        anxious: [
          {
            id: uuidv4(),
            type: 'meditation',
            title: 'Méditation de pleine conscience',
            description: 'Technique pour se recentrer et réduire l\'anxiété',
            emotion: 'anxious',
            content: 'Concentrez-vous sur votre respiration et observez vos pensées sans jugement.',
            category: 'mindfulness',
            duration: 12,
            difficulty: 'medium',
            effectiveness: 88
          },
          {
            id: uuidv4(),
            type: 'activity',
            title: 'Marche en nature',
            description: 'Une courte promenade pour apaiser l\'esprit',
            emotion: 'anxious',
            content: 'Sortez prendre l\'air pendant 10-15 minutes en vous concentrant sur vos sens.',
            category: 'physical',
            duration: 15,
            difficulty: 'easy',
            effectiveness: 75
          }
        ]
      };

      const baseRecs = emotionRecommendations[emotion] || emotionRecommendations['happy'];
      
      // Personnaliser les recommandations basées sur l'historique
      const personalizedRecs = await personalizeRecommendations(baseRecs);
      
      return personalizedRecs;
    } catch (error) {
      logger.error('Error generating recommendations', { error });
      return getDefaultRecommendations();
    }
  }, [logger]);

  // Personnaliser les recommandations basées sur l'historique utilisateur
  const personalizeRecommendations = async (baseRecs: EmotionRecommendation[]): Promise<EmotionRecommendation[]> => {
    try {
      // Ici, on pourrait analyser l'historique des préférences utilisateur
      // Pour l'instant, on retourne les recommandations de base avec des scores ajustés
      return baseRecs.map(rec => ({
        ...rec,
        personalizedScore: rec.effectiveness + Math.random() * 10,
        usageCount: Math.floor(Math.random() * 5),
        userRating: Math.random() > 0.5 ? 4 + Math.random() : undefined
      })).sort((a, b) => (b.personalizedScore || 0) - (a.personalizedScore || 0));
    } catch (error) {
      logger.error('Error personalizing recommendations', { error });
      return baseRecs;
    }
  };

  // Recommandations par défaut
  const getDefaultRecommendations = (): EmotionRecommendation[] => [
    {
      id: uuidv4(),
      type: 'breathing',
      title: 'Respiration profonde',
      description: 'Technique simple pour se recentrer',
      emotion: 'neutral',
      content: 'Prenez 5 respirations lentes et profondes.',
      category: 'mindfulness',
      duration: 5,
      difficulty: 'easy',
      effectiveness: 70
    },
    {
      id: uuidv4(),
      type: 'activity',
      title: 'Pause hydratation',
      description: 'Prenez un moment pour vous hydrater',
      emotion: 'neutral',
      content: 'Buvez un verre d\'eau lentement en pleine conscience.',
      category: 'physical',
      duration: 3,
      difficulty: 'easy',
      effectiveness: 65
    }
  ];

  // Gestionnaire de fin de scan
  const handleScanComplete = useCallback(async (result: EmotionResult) => {
    try {
      logger.info('Processing scan completion', { emotion: result.emotion });
      
      setCurrentEmotion(result.emotion);
      
      // Sauvegarder le résultat
      await saveScanMutation.mutateAsync(result);
      
      // Générer des recommandations
      const newRecommendations = await generateRecommendations(result.emotion);
      setRecommendations(newRecommendations);
      
      // Générer des alternatives
      const alternatives = await generateAlternativeRecommendations(result.emotion);
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
  }, [currentSession, logger, saveScanMutation, generateRecommendations]);

  // Générer des recommandations alternatives
  const generateAlternativeRecommendations = async (emotion: string): Promise<EmotionRecommendation[]> => {
    const alternativeMap: Record<string, EmotionRecommendation[]> = {
      happy: [
        {
          id: uuidv4(),
          type: 'creative',
          title: 'Expression créative',
          description: 'Canalisez votre énergie positive dans une activité créative',
          emotion: 'happy',
          content: 'Dessinez, chantez ou dansez pendant quelques minutes.',
          category: 'creative',
          duration: 10,
          difficulty: 'easy',
          effectiveness: 72
        }
      ],
      sad: [
        {
          id: uuidv4(),
          type: 'social',
          title: 'Connexion humaine',
          description: 'Recherchez le soutien d\'un proche',
          emotion: 'sad',
          content: 'Appelez un ami de confiance ou un membre de votre famille.',
          category: 'social',
          duration: 20,
          difficulty: 'medium',
          effectiveness: 81
        }
      ]
    };

    return alternativeMap[emotion] || [];
  };

  // Vérifier et mettre à jour les progrès des objectifs
  const checkGoalProgress = async (result: EmotionResult) => {
    try {
      for (const goal of emotionGoals) {
        let newProgress = goal.progress;
        
        // Logique de mise à jour basée sur le type d'objectif
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
            // Logique basée sur la stabilité émotionnelle
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
      
      queryClient.invalidateQueries({ queryKey: ['emotion-goals'] });
      logger.info('Goal progress updated', { goalId, progress });
    } catch (error) {
      logger.error('Error updating goal progress', { error });
    }
  };

  // Obtenir des insights sur les scans
  const getScanInsights = async () => {
    try {
      // Analyser les tendances récentes
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
        scanHistory: scanHistory.slice(0, 100), // Limiter à 100 scans
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
    const newSession: ScanSession = {
      id: `session_${Date.now()}`,
      userId: 'current-user', // À remplacer par l'ID utilisateur réel
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
  }, []);

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
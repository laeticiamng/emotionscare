/**
 * useScannerHistory - Hook pour gérer l'historique des scans
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ScannerAnswers } from '@/components/scanner/QuestionnaireScanner';
import { calculateWellbeingScore, getDominantEmotion, generateRecommendations } from '@/components/scanner/ScannerResults';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export interface ScanRecord {
  id: string;
  user_id: string;
  scan_type: string;
  mood: string | null;
  emotions: Record<string, unknown>;
  confidence: number | null;
  recommendations: Record<string, unknown>[] | null;
  created_at: string;
}

export const useScannerHistory = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Récupérer l'historique des scans
  const historyQuery = useQuery({
    queryKey: ['emotion-scans', user?.id],
    queryFn: async (): Promise<ScanRecord[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('emotion_scans')
        .select('*')
        .eq('user_id', user.id)
        .eq('scan_type', 'questionnaire')
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) {
        logger.error('Error fetching scan history', error instanceof Error ? error : new Error(String(error)), 'SCAN');
        throw error;
      }

      return (data || []) as ScanRecord[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // Sauvegarder un nouveau scan
  const saveScanMutation = useMutation({
    mutationFn: async (answers: ScannerAnswers) => {
      if (!user) throw new Error('User not authenticated');

      const score = calculateWellbeingScore(answers);
      const dominantEmotion = getDominantEmotion(answers);
      const recommendations = generateRecommendations(answers, score);

      const scanData = {
        user_id: user.id,
        scan_type: 'questionnaire',
        mood: dominantEmotion,
        emotions: {
          answers,
          score,
          dominant: dominantEmotion,
        },
        confidence: score,
        recommendations: recommendations.map(r => ({
          id: r.id,
          title: r.title,
          link: r.link,
          priority: r.priority,
        })),
      };

      const { data, error } = await supabase
        .from('emotion_scans')
        .insert(scanData)
        .select()
        .single();

      if (error) {
        logger.error('Error saving scan', error instanceof Error ? error : new Error(String(error)), 'SCAN');
        throw error;
      }

      return { scan: data, score, dominantEmotion, recommendations };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotion-scans', user?.id] });
      toast.success('Scan enregistré !');
    },
    onError: (error) => {
      logger.error('Error saving scan', error instanceof Error ? error : new Error(String(error)), 'SCAN');
      toast.error('Erreur lors de l\'enregistrement');
    },
  });

  // Données pour le graphique d'évolution
  const chartData = historyQuery.data?.map(scan => ({
    date: new Date(scan.created_at!).toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'short' 
    }),
    score: scan.confidence || 0,
    mood: scan.mood,
  })).reverse() || [];

  return {
    history: historyQuery.data || [],
    chartData,
    isLoading: historyQuery.isLoading,
    saveScan: saveScanMutation.mutateAsync,
    isSaving: saveScanMutation.isPending,
  };
};

export default useScannerHistory;

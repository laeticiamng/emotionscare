// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emotionsCareApi } from '@/services/emotions-care-api';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

/**
 * Hook pour l'analyse d'émotion via texte
 */
export const useEmotionAnalysis = () => {
  return useMutation({
    mutationFn: (text: string) => emotionsCareApi.analyzeEmotionText(text),
    onSuccess: (data) => {
      logger.info('Analyse d\'émotion réussie', data, 'SCAN');
    },
    onError: (error) => {
      logger.error('Erreur analyse émotion', error as Error, 'SCAN');
      toast.error('Erreur lors de l\'analyse d\'émotion');
    },
  });
};

/**
 * Hook pour l'analyse d'émotion via voix
 */
export const useVoiceEmotionAnalysis = () => {
  return useMutation({
    mutationFn: (audioBlob: Blob) => emotionsCareApi.analyzeVoiceEmotion(audioBlob),
    onSuccess: (data) => {
      logger.info('Analyse vocale réussie', data, 'SCAN');
    },
    onError: (error) => {
      logger.error('Erreur analyse vocale', error as Error, 'SCAN');
      toast.error('Erreur lors de l\'analyse vocale');
    },
  });
};

/**
 * Hook pour le chat avec l'IA coach
 */
export const useCoachChat = () => {
  return useMutation({
    mutationFn: ({ message, history }: { message: string; history?: any[] }) => 
      emotionsCareApi.chatWithCoach(message, history),
    onSuccess: (data) => {
      logger.info('Réponse du coach reçue', data, 'UI');
    },
    onError: (error) => {
      logger.error('Erreur chat coach', error as Error, 'UI');
      toast.error('Erreur lors de la communication avec le coach');
    },
  });
};

/**
 * Hook pour récupérer les données du dashboard
 */
export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => emotionsCareApi.getDashboardData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      logger.error('Erreur données dashboard', error as Error, 'ANALYTICS');
      toast.error('Erreur lors du chargement du dashboard');
    },
  });
};

/**
 * Hook pour sauvegarder une entrée de journal
 */
export const useJournalEntry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (content: string) => emotionsCareApi.saveJournalEntry(content),
    onSuccess: () => {
      toast.success('Entrée de journal sauvegardée');
      // Invalider le cache des entrées de journal
      queryClient.invalidateQueries({ queryKey: ['journal'] });
    },
    onError: (error) => {
      logger.error('Erreur sauvegarde journal', error as Error, 'UI');
      toast.error('Erreur lors de la sauvegarde');
    },
  });
};

/**
 * Hook général pour les interactions avec l'API EmotionsCare
 */
export const useEmotionsCare = () => {
  const emotionAnalysis = useEmotionAnalysis();
  const voiceAnalysis = useVoiceEmotionAnalysis();
  const coachChat = useCoachChat();
  const dashboardData = useDashboardData();
  const journalEntry = useJournalEntry();

  return {
    analyzeEmotion: emotionAnalysis.mutate,
    analyzeVoice: voiceAnalysis.mutate,
    chatWithCoach: coachChat.mutate,
    saveJournalEntry: journalEntry.mutate,
    dashboardData: dashboardData.data,
    isLoadingDashboard: dashboardData.isLoading,
    
    // États de chargement
    isAnalyzingEmotion: emotionAnalysis.isPending,
    isAnalyzingVoice: voiceAnalysis.isPending,
    isChatting: coachChat.isPending,
    isSavingJournal: journalEntry.isPending,
  };
};

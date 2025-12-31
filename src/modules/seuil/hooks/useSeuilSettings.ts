/**
 * Hook pour la persistance des paramètres SEUIL
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { SeuilUserSettings } from '../components/SeuilSettings';

const DEFAULT_SETTINGS: SeuilUserSettings = {
  remindersEnabled: false,
  reminderTimes: ['09:00', '20:00'],
  reminderDays: [1, 2, 3, 4, 5],
  soundEnabled: true,
  hapticEnabled: true,
  soundVolume: 50,
  customThresholds: {
    intermediate: 31,
    critical: 61,
    closure: 86,
  },
  showInsights: true,
  showTrends: true,
  compactMode: false,
};

const STORAGE_KEY = 'seuil_settings';

export function useSeuilSettings() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['seuil-settings', user?.id],
    queryFn: async (): Promise<SeuilUserSettings> => {
      // Try localStorage first for quick access
      const stored = localStorage.getItem(`${STORAGE_KEY}_${user?.id}`);
      if (stored) {
        try {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
        } catch {
          // Continue to default
        }
      }
      return DEFAULT_SETTINGS;
    },
    enabled: true,
    staleTime: Infinity, // Settings don't change often
  });
}

export function useSaveSeuilSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: SeuilUserSettings) => {
      // Save to localStorage for persistence
      localStorage.setItem(`${STORAGE_KEY}_${user?.id || 'default'}`, JSON.stringify(settings));
      return settings;
    },
    onSuccess: (settings) => {
      queryClient.setQueryData(['seuil-settings', user?.id], settings);
      toast({
        title: 'Préférences enregistrées',
        description: 'Tes paramètres SEUIL ont été sauvegardés.',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les paramètres.',
        variant: 'destructive',
      });
    },
  });
}

export function useCustomZoneThresholds() {
  const { data: settings } = useSeuilSettings();
  
  return settings?.customThresholds || DEFAULT_SETTINGS.customThresholds;
}

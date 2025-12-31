/**
 * Hook pour les sessions favorites SEUIL
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'seuil_favorites';

export function useSeuilFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: favorites = [] } = useQuery({
    queryKey: ['seuil-favorites', user?.id],
    queryFn: (): string[] => {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${user?.id || 'default'}`);
      return stored ? JSON.parse(stored) : [];
    },
    enabled: true,
  });

  const toggleFavorite = useMutation({
    mutationFn: async (eventId: string) => {
      const current = [...favorites];
      const isFavorite = current.includes(eventId);
      
      const updated = isFavorite 
        ? current.filter(id => id !== eventId)
        : [...current, eventId];
      
      localStorage.setItem(`${STORAGE_KEY}_${user?.id || 'default'}`, JSON.stringify(updated));
      return { updated, added: !isFavorite };
    },
    onSuccess: ({ updated, added }) => {
      queryClient.setQueryData(['seuil-favorites', user?.id], updated);
      toast({
        title: added ? 'Session ajoutée aux favoris' : 'Session retirée des favoris',
        duration: 2000,
      });
    },
  });

  const isFavorite = (eventId: string) => favorites.includes(eventId);

  return {
    favorites,
    toggleFavorite: toggleFavorite.mutate,
    isFavorite,
  };
}


import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ApiError {
  status?: number;
  message?: string;
  code?: string;
}

export const useApiErrorHandler = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleError = useCallback(async (
    error: ApiError,
    context?: string
  ): Promise<void> => {
    console.error(`[API Error] ${context || 'Unknown'}:`, error);

    // Gestion spécifique par code d'erreur
    switch (error.status) {
      case 401:
        toast({
          title: "Session expirée",
          description: "Veuillez vous reconnecter",
          variant: "destructive",
        });
        navigate('/choose-mode');
        break;

      case 403:
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les permissions nécessaires",
          variant: "destructive",
        });
        break;

      case 404:
        toast({
          title: "Service indisponible",
          description: "Cette fonctionnalité est temporairement indisponible",
          variant: "destructive",
        });
        break;

      case 429:
        toast({
          title: "Trop de requêtes",
          description: "Veuillez patienter avant de réessayer",
          variant: "destructive",
        });
        break;

      case 500:
      case 502:
      case 503:
        toast({
          title: "Erreur serveur",
          description: "Nos serveurs rencontrent des difficultés",
          variant: "destructive",
        });
        break;

      default:
        if (context?.includes('analytics')) {
          // Ne pas afficher d'erreur pour les analytics
          console.warn('Analytics error (non-blocking):', error);
        } else {
          toast({
            title: "Erreur inattendue",
            description: error.message || "Une erreur s'est produite",
            variant: "destructive",
          });
        }
    }
  }, [toast, navigate]);

  return { handleError };
};

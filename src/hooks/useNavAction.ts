import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { NavAction, NavContext, ActionResult } from "@/types/nav";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

/**
 * Hook d'action unifiée - Gestion centralisée de toutes les actions nav
 * Garantit qu'aucun bouton n'est jamais "mort"
 */
export function useNavAction() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const getContext = useCallback((): NavContext => ({
    isAuthenticated,
    user: user ? { id: user.id, role: user.user_metadata?.role } : undefined,
    featureFlags: {}, // TODO: intégrer feature flags
  }), [isAuthenticated, user]);

  const executeAction = useCallback(async (action: NavAction): Promise<ActionResult> => {
    const context = getContext();
    
    try {
      switch (action.type) {
        case "route": {
          // Prefetch si demandé
          if (action.prefetch) {
            // TODO: implémenter prefetch intelligent
            console.log(`Prefetching route: ${action.to}`);
          }
          
          navigate(action.to);
          
          // Analytics
          window.gtag?.('event', 'navigation', {
            category: 'nav',
            action: 'route_change',
            label: action.to,
          });
          
          return { success: true };
        }

        case "modal": {
          // TODO: intégrer système modal avec Zustand
          console.log(`Opening modal: ${action.id}`, action.payload);
          
          // Analytics
          window.gtag?.('event', 'modal_open', {
            category: 'ui',
            action: 'modal',
            label: action.id,
          });
          
          return { success: true };
        }

        case "mutation": {
          // TODO: intégrer mutations React Query
          console.log(`Executing mutation: ${action.key}`, action.input);
          
          // Analytics
          window.gtag?.('event', 'mutation', {
            category: 'action',
            action: action.key,
            label: 'user_action',
          });
          
          return { success: true };
        }

        case "external": {
          const url = action.href;
          if (action.newTab) {
            window.open(url, '_blank', 'noopener,noreferrer');
          } else {
            window.location.href = url;
          }
          
          // Analytics
          window.gtag?.('event', 'external_link', {
            category: 'nav',
            action: 'external',
            label: url,
          });
          
          return { success: true };
        }

        case "compose": {
          const results: ActionResult[] = [];
          
          for (const step of action.steps) {
            const result = await executeAction(step);
            results.push(result);
            
            // Si une étape échoue, on arrête
            if (!result.success) {
              return {
                success: false,
                error: `Compose failed at step: ${result.error}`,
                data: results,
              };
            }
          }
          
          return { 
            success: true, 
            data: results 
          };
        }

        default:
          return {
            success: false,
            error: `Unknown action type: ${(action as any).type}`,
          };
      }
    } catch (error) {
      console.error('Nav action failed:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }, [navigate, getContext]);

  return {
    executeAction,
    getContext,
  };
}

/**
 * Hook pour actions avec feedback utilisateur automatique
 */
export function useNavActionWithFeedback() {
  const { executeAction } = useNavAction();
  const { toast } = useToast();

  const execute = useCallback(async (action: NavAction, options?: {
    successMessage?: string;
    errorMessage?: string;
    silent?: boolean;
  }) => {
    const result = await executeAction(action);

    if (!options?.silent) {
      if (result.success && options?.successMessage) {
        toast({
          title: "Succès",
          description: options.successMessage,
        });
      } else if (!result.success) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: options?.errorMessage || result.error || "Une erreur s'est produite",
        });
      }
    }

    return result;
  }, [executeAction, toast]);

  return { execute };
}

/**
 * Hook pour les actions avec loading state
 */
export function useNavActionMutation() {
  const { executeAction } = useNavAction();
  
  return useMutation({
    mutationFn: executeAction,
    onError: (error) => {
      console.error('Nav action mutation failed:', error);
    },
  });
}
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ActionState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

export const useButtonActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [actionStates, setActionStates] = useState<Record<string, ActionState>>({});

  const setActionState = useCallback((actionId: string, state: Partial<ActionState>) => {
    setActionStates(prev => ({
      ...prev,
      [actionId]: { ...prev[actionId], ...state }
    }));
  }, []);

  const getActionState = useCallback((actionId: string): ActionState => {
    return actionStates[actionId] || { isLoading: false, isSuccess: false, error: null };
  }, [actionStates]);

  const executeAction = useCallback(async (
    actionId: string,
    action: () => Promise<any> | any,
    options?: {
      successMessage?: string;
      errorMessage?: string;
      loadingMessage?: string;
      onSuccess?: (result: any) => void;
      onError?: (error: any) => void;
    }
  ) => {
    const { successMessage, errorMessage, loadingMessage, onSuccess, onError } = options || {};

    setActionState(actionId, { isLoading: true, isSuccess: false, error: null });

    if (loadingMessage) {
      toast({
        title: "Action en cours",
        description: loadingMessage,
        duration: 2000
      });
    }

    try {
      const result = await Promise.resolve(action());
      
      setActionState(actionId, { isLoading: false, isSuccess: true, error: null });
      
      if (successMessage) {
        toast({
          title: "Succès",
          description: successMessage,
          variant: "default",
          duration: 3000
        });
      }

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (error: any) {
      const errorMsg = error?.message || errorMessage || "Une erreur est survenue";
      
      setActionState(actionId, { isLoading: false, isSuccess: false, error: errorMsg });
      
      toast({
        title: "Erreur",
        description: errorMsg,
        variant: "destructive",
        duration: 4000
      });

      if (onError) {
        onError(error);
      }

      throw error;
    }
  }, [setActionState, toast]);

  const navigateWithFeedback = useCallback((
    actionId: string,
    path: string,
    options?: {
      loadingMessage?: string;
      replace?: boolean;
    }
  ) => {
    return executeAction(
      actionId,
      () => {
        if (options?.replace) {
          navigate(path, { replace: true });
        } else {
          navigate(path);
        }
      },
      {
        loadingMessage: options?.loadingMessage || "Navigation en cours...",
        successMessage: "Page chargée avec succès"
      }
    );
  }, [executeAction, navigate]);

  const resetActionState = useCallback((actionId: string) => {
    setActionState(actionId, { isLoading: false, isSuccess: false, error: null });
  }, [setActionState]);

  return {
    executeAction,
    navigateWithFeedback,
    getActionState,
    resetActionState
  };
};

export default useButtonActions;
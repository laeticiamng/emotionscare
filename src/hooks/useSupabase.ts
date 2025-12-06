// @ts-nocheck

/**
 * Hook centralisé pour l'utilisation de Supabase
 */
import { supabase } from '@/integrations/supabase/client';
import { useCallback } from 'react';
import { globalErrorService } from '@/lib/errorBoundary';

export const useSupabase = () => {
  const handleSupabaseError = useCallback((error: any, context: string) => {
    if (error) {
      globalErrorService.reportError(
        new Error(error.message || 'Supabase error'),
        `Supabase: ${context}`
      );
    }
  }, []);

  const safeQuery = useCallback(async <T>(
    queryFn: () => Promise<{ data: T | null; error: any }>,
    context: string
  ): Promise<T | null> => {
    try {
      const { data, error } = await queryFn();
      if (error) {
        handleSupabaseError(error, context);
        return null;
      }
      return data;
    } catch (err) {
      handleSupabaseError(err, context);
      return null;
    }
  }, [handleSupabaseError]);

  return {
    supabase,
    handleSupabaseError,
    safeQuery,
  };
};

export default useSupabase;

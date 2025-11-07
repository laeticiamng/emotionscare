// @ts-nocheck
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

/**
 * Type de requête pour l'API unifiée
 */
type UnifiedApiRequest = 
  | { type: "generate_pdf", payload: { reportData: any, reportType: string } }
  | { type: "backup_blockchain", payload: { blockchainData: any[] } }
  | { type: "send_notification", payload: { userId: string, title: string, message: string, severity: "info" | "warning" | "critical" } };

/**
 * Hook pour utiliser l'API unifiée
 * Remplace 3 services externes (PDF, backup S3, notifications push)
 */
export const useUnifiedApi = () => {
  return useMutation({
    mutationFn: async (request: UnifiedApiRequest) => {
      logger.info(`[UnifiedAPI] Calling unified-api with type: ${request.type}`, request, 'SYSTEM');

      const { data, error } = await supabase.functions.invoke('unified-api', {
        body: request
      });

      if (error) {
        logger.error(`[UnifiedAPI] Error calling unified-api`, error, 'SYSTEM');
        throw error;
      }

      if (data.status === 'error') {
        throw new Error(data.message || 'Unknown error from unified API');
      }

      logger.info(`[UnifiedAPI] Success for ${request.type}`, data, 'SYSTEM');
      return data;
    },
    onError: (error: any) => {
      logger.error('[UnifiedAPI] Mutation error', error, 'SYSTEM');
      toast.error(`Erreur API: ${error.message}`);
    }
  });
};

/**
 * Hook spécialisé pour la génération de PDF
 */
export const useGeneratePdf = () => {
  const unifiedApi = useUnifiedApi();

  return useMutation({
    mutationFn: async ({ reportData, reportType }: { reportData: any, reportType: string }) => {
      return unifiedApi.mutateAsync({
        type: "generate_pdf",
        payload: { reportData, reportType }
      });
    },
    onSuccess: (data) => {
      toast.success('Rapport PDF généré avec succès');
      logger.info('[PDF] Report generated', data, 'SYSTEM');
    }
  });
};

/**
 * Hook spécialisé pour le backup blockchain
 */
export const useBlockchainBackup = () => {
  const unifiedApi = useUnifiedApi();

  return useMutation({
    mutationFn: async (blockchainData: any[]) => {
      return unifiedApi.mutateAsync({
        type: "backup_blockchain",
        payload: { blockchainData }
      });
    },
    onSuccess: (data) => {
      toast.success('Backup blockchain effectué avec succès');
      logger.info('[Backup] Blockchain backed up', data, 'SYSTEM');
    }
  });
};

/**
 * Hook spécialisé pour l'envoi de notifications
 */
export const useSendNotification = () => {
  const unifiedApi = useUnifiedApi();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      title, 
      message, 
      severity = 'info' 
    }: { 
      userId: string, 
      title: string, 
      message: string, 
      severity?: "info" | "warning" | "critical" 
    }) => {
      return unifiedApi.mutateAsync({
        type: "send_notification",
        payload: { userId, title, message, severity }
      });
    },
    onSuccess: (data) => {
      logger.info('[Notification] Sent successfully', data, 'SYSTEM');
    }
  });
};

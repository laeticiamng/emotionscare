// @ts-nocheck
import { useCallback } from 'react';
import { useFeedbackStore } from '@/store/feedback.store';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export const useFeedback = () => {
  const {
    isOpen,
    draft,
    loading,
    lastTicket,
    setOpen,
    setDraft,
    setLoading,
    setLastTicket,
    clearDraft
  } = useFeedbackStore();

  const collectDiagnostics = useCallback(() => {
    return {
      ua: navigator.userAgent,
      app_version: '1.0.3',
      locale: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      online: navigator.onLine,
      health_state: 'online', // Would come from health store
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      timestamp: new Date().toISOString()
    };
  }, []);

  const submit = useCallback(async (payload: typeof draft) => {
    try {
      setLoading(true);

      // Prepare final payload
      const finalPayload = {
        ...payload,
        diagnostics: payload.include_diagnostics ? collectDiagnostics() : undefined
      };

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const ticketId = `F2025-${Math.floor(Math.random() * 1000)}`;
      
      // Save last ticket
      setLastTicket({
        id: ticketId,
        timestamp: Date.now()
      });

      // Clear draft
      clearDraft();
      
      // Show success message
      toast.success(`Merci ! Ticket #${ticketId} créé`, {
        description: 'Nous reviendrons vers vous rapidement.',
        duration: 5000
      });

      return { ticket_id: ticketId };
    } catch (error) {
      logger.error('Failed to submit feedback', error as Error, 'UI');
      toast.error('Erreur lors de l\'envoi du feedback');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setLastTicket, clearDraft, collectDiagnostics]);

  const captureScreenshot = useCallback(async (): Promise<string | undefined> => {
    try {
      // In a real implementation, we'd use html2canvas or similar
      // For now, return undefined to indicate no screenshot
      return undefined;
    } catch (error) {
      logger.error('Failed to capture screenshot', error as Error, 'UI');
      toast.error('Erreur lors de la capture d\'écran');
      return undefined;
    }
  }, []);

  return {
    isOpen,
    draft,
    loading,
    lastTicket,
    setOpen,
    setDraft,
    submit,
    captureScreenshot,
    clearDraft
  };
};
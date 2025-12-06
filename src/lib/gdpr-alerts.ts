import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/**
 * Déclencher la détection d'alertes RGPD pour un événement spécifique
 */
export const triggerGDPRAlertDetection = async (
  type: 'export' | 'deletion' | 'consent',
  userId?: string,
  metadata?: {
    urgent?: boolean;
    reason?: string;
    [key: string]: any;
  }
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('gdpr-alert-detector', {
      body: {
        type,
        userId,
        metadata,
      },
    });

    if (error) {
      logger.error('Error triggering GDPR alert detection', error as Error, 'GDPR');
      return false;
    }

    logger.info(
      `GDPR alert detection triggered: ${data?.alertsCreated || 0} alerts created`,
      undefined,
      'GDPR'
    );

    return true;
  } catch (error) {
    logger.error('Error triggering GDPR alert detection', error as Error, 'GDPR');
    return false;
  }
};

/**
 * Marquer une alerte comme résolue
 */
export const resolveGDPRAlert = async (alertId: string): Promise<boolean> => {
  try {
    const user = await supabase.auth.getUser();

    const { error } = await supabase
      .from('gdpr_alerts')
      .update({
        resolved: true,
        resolved_at: new Date().toISOString(),
        resolved_by: user.data.user?.id,
      })
      .eq('id', alertId);

    if (error) {
      logger.error('Error resolving GDPR alert', error as unknown as Error, 'GDPR');
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Error resolving GDPR alert', error as Error, 'GDPR');
    return false;
  }
};

/**
 * Récupérer les alertes RGPD actives
 */
export const getActiveGDPRAlerts = async () => {
  try {
    const { data, error } = await supabase
      .from('gdpr_alerts')
      .select('*')
      .eq('resolved', false)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      logger.error('Error fetching GDPR alerts', error as unknown as Error, 'GDPR');
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error('Error fetching GDPR alerts', error as Error, 'GDPR');
    return [];
  }
};

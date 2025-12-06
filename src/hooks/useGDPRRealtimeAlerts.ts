import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { pushNotificationService } from '@/lib/notifications/pushNotifications';

interface GDPRAlert {
  id: string;
  alert_type: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string | null;
  metadata: any;
  user_id: string | null;
  resolved: boolean;
  created_at: string;
}

interface UseGDPRRealtimeAlertsOptions {
  onCriticalAlert?: (alert: GDPRAlert) => void;
  enableSound?: boolean;
  enableBrowserNotifications?: boolean;
}

/**
 * Hook pour gérer les notifications temps réel des alertes RGPD critiques
 * Utilise Supabase Realtime WebSocket pour écouter les nouvelles alertes
 */
export const useGDPRRealtimeAlerts = ({
  onCriticalAlert,
  enableSound = true,
  enableBrowserNotifications = true,
}: UseGDPRRealtimeAlertsOptions = {}) => {
  const [criticalAlerts, setCriticalAlerts] = useState<GDPRAlert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialiser le son d'alerte
  useEffect(() => {
    if (enableSound) {
      // Créer un son d'alerte simple avec Web Audio API
      audioRef.current = new Audio();
      // Son d'alerte (bip court)
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800; // Fréquence en Hz
      gainNode.gain.value = 0.3; // Volume
    }
  }, [enableSound]);

  // Jouer le son d'alerte
  const playAlertSound = () => {
    if (!enableSound) return;
    
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      logger.error('Error playing alert sound', error as Error, 'GDPR');
    }
  };

  // Afficher une notification navigateur
  const showBrowserNotification = async (alert: GDPRAlert) => {
    if (!enableBrowserNotifications) return;
    
    try {
      await pushNotificationService.showNotification(
        `🚨 Alerte RGPD Critique: ${alert.title}`,
        {
          body: alert.description || 'Une alerte RGPD critique nécessite votre attention immédiate.',
          tag: `gdpr-alert-${alert.id}`,
          requireInteraction: true, // Reste visible jusqu'à interaction
          badge: '/favicon.ico',
          icon: '/favicon.ico',
        }
      );
    } catch (error) {
      logger.error('Error showing browser notification', error as Error, 'GDPR');
    }
  };

  // Gérer une nouvelle alerte critique
  const handleCriticalAlert = async (alert: GDPRAlert) => {
    logger.info(`Critical GDPR alert received: ${alert.title}`, { alert }, 'GDPR');

    // Ajouter à la liste des alertes critiques
    setCriticalAlerts((prev) => [alert, ...prev]);

    // Jouer le son d'alerte
    playAlertSound();

    // Afficher notification navigateur
    await showBrowserNotification(alert);

    // Afficher toast persistant
    toast.error(`🚨 ${alert.title}`, {
      description: alert.description || undefined,
      duration: 0, // Reste affiché jusqu'à fermeture manuelle
      action: {
        label: 'Voir',
        onClick: () => {
          // Rediriger vers la page des alertes
          window.location.hash = '#alerts';
        },
      },
    });

    // Callback personnalisé
    if (onCriticalAlert) {
      onCriticalAlert(alert);
    }
  };

  // Charger les alertes critiques existantes
  const loadCriticalAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('gdpr_alerts')
        .select('*')
        .eq('resolved', false)
        .eq('severity', 'critical')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCriticalAlerts(data || []);
      logger.debug(`Loaded ${data?.length || 0} critical GDPR alerts`, undefined, 'GDPR');
    } catch (error) {
      logger.error('Error loading critical alerts', error as Error, 'GDPR');
    }
  };

  // Configurer WebSocket Realtime
  useEffect(() => {
    logger.debug('Setting up GDPR alerts realtime subscription', undefined, 'GDPR');

    // Charger les alertes existantes
    loadCriticalAlerts();

    // Demander permission pour les notifications navigateur
    if (enableBrowserNotifications) {
      pushNotificationService.requestPermission();
    }

    // S'abonner aux changements en temps réel
    const channel = supabase
      .channel('gdpr-critical-alerts-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'gdpr_alerts',
          filter: 'severity=eq.critical',
        },
        (payload) => {
          const newAlert = payload.new as GDPRAlert;
          logger.debug('New critical alert received via realtime', { newAlert }, 'GDPR');
          
          if (!newAlert.resolved) {
            handleCriticalAlert(newAlert);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'gdpr_alerts',
          filter: 'severity=eq.critical',
        },
        (payload) => {
          const updatedAlert = payload.new as GDPRAlert;
          logger.debug('Critical alert updated via realtime', { updatedAlert }, 'GDPR');
          
          // Retirer de la liste si résolue
          if (updatedAlert.resolved) {
            setCriticalAlerts((prev) => prev.filter((a) => a.id !== updatedAlert.id));
            toast.success(`Alerte critique résolue: ${updatedAlert.title}`);
          }
        }
      )
      .subscribe((status) => {
        logger.debug(`Realtime subscription status: ${status}`, undefined, 'GDPR');
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      logger.debug('Cleaning up GDPR alerts realtime subscription', undefined, 'GDPR');
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [onCriticalAlert, enableSound, enableBrowserNotifications]);

  // Résoudre une alerte critique
  const resolveCriticalAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('gdpr_alerts')
        .update({
          resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('id', alertId);

      if (error) throw error;

      setCriticalAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
      toast.success('Alerte critique résolue');
    } catch (error) {
      logger.error('Error resolving critical alert', error as Error, 'GDPR');
      toast.error('Erreur lors de la résolution de l\'alerte');
    }
  };

  return {
    criticalAlerts,
    isConnected,
    resolveCriticalAlert,
    refreshAlerts: loadCriticalAlerts,
  };
};

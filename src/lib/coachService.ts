
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getPlaylist } from '@/lib/musicService';
import type { Emotion, User } from '@/types';

// Types pour le service Coach
export interface CoachEvent {
  type: 'scan_completed' | 'predictive_alert' | 'daily_reminder';
  user_id: string;
  data?: any;
}

export interface CoachAction {
  type: string;
  payload?: any;
}

export interface CoachRoutine {
  name: string;
  description: string;
  trigger: string;
  actions: CoachAction[];
}

/**
 * Service d'orchestration des routines de bien-être
 */
class CoachService {
  private routines: CoachRoutine[] = [
    {
      name: 'Après Scan',
      description: 'Routine déclenchée après un scan émotionnel',
      trigger: 'scan_completed',
      actions: [
        { type: 'check_emotion_alert' },
        { type: 'suggest_vr_session' },
        { type: 'update_music_playlist' },
        { type: 'check_trend_alert' }
      ]
    },
    {
      name: 'Alerte Préventive',
      description: "Routine déclenchée lors d'une alerte préventive",
      trigger: 'predictive_alert',
      actions: [
        { type: 'send_dashboard_alert', payload: { message: 'Tendance négative détectée.' } },
        { type: 'start_vr_session', payload: { template: 'Relaxation guidée' } },
        { type: 'play_music_preset', payload: { preset: 'Calme profond' } },
        { type: 'find_buddy' },
        { type: 'send_buddy_message' }
      ]
    },
    {
      name: 'Rappel Quotidien',
      description: 'Routine de rappel quotidien',
      trigger: 'daily_reminder',
      actions: [
        { type: 'send_dashboard_notification', payload: { message: 'Bonjour 👋 N\'oubliez pas votre scan émotionnel du jour !' } },
        { type: 'check_scan_status' }
      ]
    }
  ];

  /**
   * Traite un événement et déclenche la routine correspondante
   */
  async processEvent(event: CoachEvent): Promise<void> {
    console.log(`Coach IA: Processing event ${event.type} for user ${event.user_id}`, event);
    
    const matchingRoutine = this.routines.find(routine => routine.trigger === event.type);
    if (!matchingRoutine) {
      console.warn(`No routine found for event type: ${event.type}`);
      return;
    }

    console.log(`Coach IA: Starting routine "${matchingRoutine.name}"`);
    await this.executeRoutine(matchingRoutine, event);
  }

  /**
   * Exécute une routine complète
   */
  private async executeRoutine(routine: CoachRoutine, event: CoachEvent): Promise<void> {
    for (const action of routine.actions) {
      try {
        await this.executeAction(action, event);
      } catch (error) {
        console.error(`Failed to execute action ${action.type}:`, error);
      }
    }
    console.log(`Coach IA: Routine "${routine.name}" completed`);
  }

  /**
   * Exécute une action spécifique
   */
  private async executeAction(action: CoachAction, event: CoachEvent): Promise<void> {
    console.log(`Coach IA: Executing action ${action.type}`);
    
    const { user_id } = event;
    const payload = action.payload || {};

    switch (action.type) {
      case 'check_emotion_alert':
        if (event.data?.emotion) {
          const { emotion, confidence } = event.data;
          if (['tristesse', 'colère'].includes(emotion.toLowerCase()) && confidence > 0.7) {
            this.showToast(user_id, "On dirait que ça n'a pas été facile aujourd'hui. Un petit moment VR pourrait aider ?");
          }
        }
        break;
        
      case 'suggest_vr_session':
        // Implémentation de suggestion de session VR
        // Dans une vraie implémentation, cela pourrait envoyer une notification ou un email
        console.log(`Suggesting VR session for user ${user_id}`);
        break;
        
      case 'update_music_playlist':
        if (event.data?.emotion) {
          try {
            const emotion = event.data.emotion.toLowerCase();
            const playlist = await getPlaylist(emotion);
            console.log(`Updated playlist for ${user_id} based on emotion: ${emotion}`);
            // Dans une vraie implémentation, mettre à jour l'état de l'application
          } catch (error) {
            console.error('Failed to update music playlist:', error);
          }
        }
        break;
        
      case 'check_trend_alert':
        // Implémentation de vérification de tendance
        // Dans une vraie implémentation, cela interrogerait un service de prédiction
        console.log(`Checking trend alerts for user ${user_id}`);
        break;
        
      case 'send_dashboard_alert':
        this.showToast(user_id, payload.message, 'destructive');
        break;
        
      case 'send_dashboard_notification':
        this.showToast(user_id, payload.message);
        break;
        
      case 'start_vr_session':
        console.log(`Starting VR session "${payload.template}" for user ${user_id}`);
        // Dans une vraie implémentation, rediriger vers la page VR avec le bon template
        break;
        
      case 'play_music_preset':
        console.log(`Playing music preset "${payload.preset}" for user ${user_id}`);
        // Dans une vraie implémentation, déclencher la lecture de la playlist
        break;
        
      case 'find_buddy':
        console.log(`Finding buddy for user ${user_id}`);
        // Dans une vraie implémentation, appeler le service de buddy matching
        break;
        
      case 'send_buddy_message':
        this.showToast(user_id, "Votre buddy du jour est prêt à vous écouter anonymement !");
        break;
        
      case 'check_scan_status':
        // Vérifier si un scan a été fait aujourd'hui
        // Dans une vraie implémentation, cela pourrait envoyer un email de rappel
        console.log(`Checking scan status for user ${user_id}`);
        break;
        
      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }

  /**
   * Affiche une notification pour un utilisateur
   */
  private showToast(userId: string, message: string, variant: 'default' | 'destructive' = 'default'): void {
    // Dans une application réelle, cela pourrait être géré via un système de notifications en temps réel
    // ou en stockant les notifications dans une base de données pour affichage ultérieur
    console.log(`[TOAST for ${userId}] ${message} (${variant})`);
    
    // La fonction toast est généralement accessible via un hook React, pas directement ici
    // Cette implémentation est simplifiée pour la démonstration
  }
}

// Export d'une instance singleton du service
export const coachService = new CoachService();

// Helper pour déclencher manuellement un événement Coach IA (pour démo et tests)
export const triggerCoachEvent = (eventType: 'scan_completed' | 'predictive_alert' | 'daily_reminder', userId: string, data?: any) => {
  coachService.processEvent({
    type: eventType,
    user_id: userId,
    data
  });
};

export default coachService;

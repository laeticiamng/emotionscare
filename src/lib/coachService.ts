
import { supabase } from '@/integrations/supabase/client';
// Update import path for getPlaylist
import { getPlaylist } from '@/services/music/playlist-service';
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
  priority: number; // Priorité de la routine (plus élevée = plus importante)
}

export interface CoachNotification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  timestamp: Date;
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
      priority: 2,
      actions: [
        { type: 'check_emotion_alert' },
        { type: 'suggest_vr_session' },
        { type: 'update_music_playlist' },
        { type: 'check_trend_alert' },
        { type: 'record_emotion_data' }
      ]
    },
    {
      name: 'Alerte Préventive',
      description: "Routine déclenchée lors d'une alerte préventive",
      trigger: 'predictive_alert',
      priority: 3,
      actions: [
        { type: 'send_dashboard_alert', payload: { message: 'Tendance négative détectée. Voici des suggestions pour vous aider.' } },
        { type: 'start_vr_session', payload: { template: 'Relaxation guidée' } },
        { type: 'play_music_preset', payload: { preset: 'Calme profond' } },
        { type: 'find_buddy' },
        { type: 'send_buddy_message' },
        { type: 'suggest_journal_entry' }
      ]
    },
    {
      name: 'Rappel Quotidien',
      description: 'Routine de rappel quotidien',
      trigger: 'daily_reminder',
      priority: 1,
      actions: [
        { type: 'send_dashboard_notification', payload: { message: 'Bonjour 👋 N\'oubliez pas votre scan émotionnel du jour !' } },
        { type: 'check_scan_status' },
        { type: 'suggest_wellness_activity' }
      ]
    }
  ];
  
  // Stockage des notifications (dans une application réelle, cela serait persisté en base de données)
  private notifications: Map<string, CoachNotification[]> = new Map();
  
  // Stockage des données utilisateur pour analyse
  private userEmotionalData: Map<string, { 
    lastEmotions: Array<{ emotion: string, timestamp: Date, confidence: number }>,
    averageScore: number,
    trends: { [key: string]: number }
  }> = new Map();

  /**
   * Traite un événement et déclenche la routine correspondante
   */
  async processEvent(event: CoachEvent): Promise<void> {
    console.log(`Coach IA: Processing event ${event.type} for user ${event.user_id}`, event);
    
    // Trouver toutes les routines correspondant au type d'événement, triées par priorité
    const matchingRoutines = this.routines
      .filter(routine => routine.trigger === event.type)
      .sort((a, b) => b.priority - a.priority);
      
    if (matchingRoutines.length === 0) {
      console.warn(`No routine found for event type: ${event.type}`);
      return;
    }

    // Exécuter la routine de plus haute priorité d'abord
    const primaryRoutine = matchingRoutines[0];
    console.log(`Coach IA: Starting primary routine "${primaryRoutine.name}"`);
    await this.executeRoutine(primaryRoutine, event);
    
    // Exécuter les routines secondaires en parallèle si elles existent
    if (matchingRoutines.length > 1) {
      console.log(`Coach IA: Starting ${matchingRoutines.length - 1} secondary routines`);
      await Promise.all(matchingRoutines.slice(1).map(routine => 
        this.executeRoutine(routine, event)
      ));
    }
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
          if (['tristesse', 'colère', 'anxiété'].includes(emotion.toLowerCase()) && confidence > 0.7) {
            this.addNotification(user_id, {
              id: `emotion-alert-${Date.now()}`,
              message: "On dirait que ça n'a pas été facile aujourd'hui. Un petit moment VR pourrait aider ?",
              type: 'info',
              timestamp: new Date()
            });
          }
        }
        break;
        
      case 'suggest_vr_session':
        // Implémentation de suggestion de session VR basée sur l'émotion
        if (event.data?.emotion) {
          const emotion = event.data.emotion.toLowerCase();
          let templateName = '';
          
          if (['tristesse', 'anxiété'].includes(emotion)) {
            templateName = 'Méditation guidée';
          } else if (['colère', 'stress'].includes(emotion)) {
            templateName = 'Relaxation profonde';
          } else if (['joie', 'contentement'].includes(emotion)) {
            templateName = 'Amplification positive';
          } else {
            templateName = 'Équilibre mental';
          }
          
          this.addNotification(user_id, {
            id: `vr-suggest-${Date.now()}`,
            message: `Une session VR "${templateName}" pourrait être bénéfique pour vous en ce moment.`,
            type: 'info',
            timestamp: new Date()
          });
        }
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
        // Implémentation améliorée de vérification de tendance
        this.updateUserEmotionalData(user_id, event.data);
        const userData = this.userEmotionalData.get(user_id);
        
        if (userData) {
          // Vérifier si l'utilisateur a une tendance négative récente
          const negativeEmotions = ['tristesse', 'colère', 'anxiété', 'stress'];
          const recentEmotions = userData.lastEmotions.slice(-3);
          
          const hasNegativeTrend = recentEmotions.length >= 3 && 
            recentEmotions.filter(e => negativeEmotions.includes(e.emotion)).length >= 2;
            
          if (hasNegativeTrend) {
            this.addNotification(user_id, {
              id: `trend-alert-${Date.now()}`,
              message: "J'ai remarqué une tendance émotionnelle qui pourrait mériter attention. Des exercices de bien-être sont disponibles.",
              type: 'warning',
              timestamp: new Date()
            });
          }
        }
        break;
        
      case 'record_emotion_data':
        if (event.data?.emotion) {
          this.updateUserEmotionalData(user_id, event.data);
        }
        break;
        
      case 'send_dashboard_alert':
        this.addNotification(user_id, {
          id: `dashboard-alert-${Date.now()}`,
          message: payload.message,
          type: 'warning',
          timestamp: new Date()
        });
        break;
        
      case 'send_dashboard_notification':
        this.addNotification(user_id, {
          id: `dashboard-notif-${Date.now()}`,
          message: payload.message,
          type: 'info',
          timestamp: new Date()
        });
        break;
        
      case 'start_vr_session':
        console.log(`Starting VR session "${payload.template}" for user ${user_id}`);
        this.addNotification(user_id, {
          id: `vr-session-${Date.now()}`,
          message: `Session VR "${payload.template}" recommandée pour votre bien-être actuel.`,
          type: 'info',
          timestamp: new Date()
        });
        break;
        
      case 'play_music_preset':
        console.log(`Playing music preset "${payload.preset}" for user ${user_id}`);
        this.addNotification(user_id, {
          id: `music-preset-${Date.now()}`,
          message: `Playlist "${payload.preset}" activée pour accompagner votre moment.`,
          type: 'info',
          timestamp: new Date()
        });
        break;
        
      case 'find_buddy':
        console.log(`Finding buddy for user ${user_id}`);
        this.addNotification(user_id, {
          id: `find-buddy-${Date.now()}`,
          message: "Recherche d'un buddy compatible en cours...",
          type: 'info',
          timestamp: new Date()
        });
        break;
        
      case 'send_buddy_message':
        this.addNotification(user_id, {
          id: `buddy-message-${Date.now()}`,
          message: "Votre buddy du jour est prêt à vous écouter anonymement !",
          type: 'success',
          timestamp: new Date()
        });
        break;
        
      case 'check_scan_status':
        // Vérifier si un scan a été fait aujourd'hui
        const hasScannedToday = Math.random() > 0.5; // Simulation
        if (!hasScannedToday) {
          this.addNotification(user_id, {
            id: `scan-reminder-${Date.now()}`,
            message: "Vous n'avez pas encore fait votre scan émotionnel aujourd'hui. Prenez un moment pour vous !",
            type: 'info',
            timestamp: new Date()
          });
        }
        break;

      case 'suggest_journal_entry':
        // Suggérer une entrée de journal
        this.addNotification(user_id, {
          id: `journal-suggest-${Date.now()}`,
          message: "Exprimer vos pensées dans votre journal pourrait vous aider à mieux comprendre vos émotions actuelles.",
          type: 'info',
          timestamp: new Date()
        });
        break;

      case 'suggest_wellness_activity':
        // Suggérer une activité de bien-être
        const activities = [
          "Prenez 5 minutes pour faire des exercices de respiration profonde.",
          "Une courte marche de 10 minutes peut vous aider à vous recentrer.",
          "Hydratez-vous régulièrement pour maintenir votre bien-être.",
          "Avez-vous pris un moment pour vous aujourd'hui ? Un peu de méditation peut aider."
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        
        this.addNotification(user_id, {
          id: `wellness-suggest-${Date.now()}`,
          message: randomActivity,
          type: 'info',
          timestamp: new Date()
        });
        break;
        
      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }

  /**
   * Met à jour les données émotionnelles d'un utilisateur
   */
  private updateUserEmotionalData(userId: string, data: any): void {
    if (!data || !data.emotion) return;
    
    const { emotion, confidence = 0.8 } = data;
    const emotionData = { 
      emotion: emotion.toLowerCase(),
      confidence,
      timestamp: new Date()
    };
    
    // Récupérer ou initialiser les données de l'utilisateur
    if (!this.userEmotionalData.has(userId)) {
      this.userEmotionalData.set(userId, {
        lastEmotions: [],
        averageScore: 0,
        trends: {}
      });
    }
    
    const userData = this.userEmotionalData.get(userId)!;
    
    // Ajouter la nouvelle émotion
    userData.lastEmotions.push(emotionData);
    
    // Limiter l'historique à 10 émotions
    if (userData.lastEmotions.length > 10) {
      userData.lastEmotions.shift();
    }
    
    // Mettre à jour les tendances
    if (!userData.trends[emotion]) {
      userData.trends[emotion] = 0;
    }
    userData.trends[emotion]++;
    
    // Calculer un score moyen (exemple simple)
    const positiveEmotions = ['joie', 'contentement', 'sérénité'];
    const negativeEmotions = ['tristesse', 'colère', 'anxiété', 'stress'];
    
    let totalScore = 0;
    let count = 0;
    
    userData.lastEmotions.forEach(entry => {
      if (positiveEmotions.includes(entry.emotion)) {
        totalScore += 75 + (entry.confidence * 25);
      } else if (negativeEmotions.includes(entry.emotion)) {
        totalScore += 25 + ((1 - entry.confidence) * 25);
      } else {
        totalScore += 50;
      }
      count++;
    });
    
    userData.averageScore = count > 0 ? totalScore / count : 0;
  }

  /**
   * Ajoute une notification pour un utilisateur
   */
  private addNotification(userId: string, notification: CoachNotification): void {
    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }
    
    const userNotifications = this.notifications.get(userId)!;
    userNotifications.push(notification);
    
    // Limiter le nombre de notifications stockées
    if (userNotifications.length > 20) {
      userNotifications.shift();
    }
    
    console.log(`[NOTIFICATION for ${userId}] ${notification.message} (${notification.type})`);
  }
  
  /**
   * Récupère les notifications d'un utilisateur
   */
  getNotifications(userId: string): CoachNotification[] {
    return this.notifications.get(userId) || [];
  }
  
  /**
   * Récupère les données émotionnelles d'un utilisateur
   */
  getUserEmotionalData(userId: string) {
    return this.userEmotionalData.get(userId);
  }
}

// Export d'une instance singleton du service
export const coachService = new CoachService();

// Helper pour déclencher manuellement un événement Coach IA (pour démo et tests)
export const triggerCoachEvent = (eventType: 'scan_completed' | 'predictive_alert' | 'daily_reminder', userId: string, data?: any) => {
  return coachService.processEvent({
    type: eventType,
    user_id: userId,
    data
  });
};

export default coachService;

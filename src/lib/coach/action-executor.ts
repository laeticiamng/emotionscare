
import { CoachAction, CoachEvent } from './types';
import { notificationService } from './notification-service';
import { emotionalDataService } from './emotional-data';
import { getPlaylist } from '@/services/music/playlist-service';

/**
 * Service for executing coach actions
 */
export class ActionExecutor {
  /**
   * Executes a specific coach action
   */
  async executeAction(action: CoachAction, event: CoachEvent): Promise<void> {
    console.log(`Coach IA: Executing action ${action.type}`);
    
    const { user_id } = event;
    const payload = action.payload || {};

    switch (action.type) {
      case 'check_emotion_alert':
        this.handleCheckEmotionAlert(user_id, event.data);
        break;
        
      case 'suggest_vr_session':
        this.handleSuggestVRSession(user_id, event.data);
        break;
        
      case 'update_music_playlist':
        await this.handleUpdateMusicPlaylist(user_id, event.data);
        break;
        
      case 'check_trend_alert':
        this.handleCheckTrendAlert(user_id, event.data);
        break;
        
      case 'record_emotion_data':
        this.handleRecordEmotionData(user_id, event.data);
        break;
        
      case 'send_dashboard_alert':
        this.handleSendDashboardAlert(user_id, payload);
        break;
        
      case 'send_dashboard_notification':
        this.handleSendDashboardNotification(user_id, payload);
        break;
        
      case 'start_vr_session':
        this.handleStartVRSession(user_id, payload);
        break;
        
      case 'play_music_preset':
        this.handlePlayMusicPreset(user_id, payload);
        break;
        
      case 'find_buddy':
        this.handleFindBuddy(user_id);
        break;
        
      case 'send_buddy_message':
        this.handleSendBuddyMessage(user_id);
        break;
        
      case 'check_scan_status':
        this.handleCheckScanStatus(user_id);
        break;

      case 'suggest_journal_entry':
        this.handleSuggestJournalEntry(user_id);
        break;

      case 'suggest_wellness_activity':
        this.handleSuggestWellnessActivity(user_id);
        break;
        
      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }

  private handleCheckEmotionAlert(userId: string, data: any): void {
    if (data?.emotion) {
      const { emotion, confidence } = data;
      if (['tristesse', 'colère', 'anxiété'].includes(emotion.toLowerCase()) && confidence > 0.7) {
        notificationService.addNotification(userId, {
          id: `emotion-alert-${Date.now()}`,
          message: "On dirait que ça n'a pas été facile aujourd'hui. Un petit moment VR pourrait aider ?",
          type: 'info',
          timestamp: new Date()
        });
      }
    }
  }

  private handleSuggestVRSession(userId: string, data: any): void {
    if (data?.emotion) {
      const emotion = data.emotion.toLowerCase();
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
      
      notificationService.addNotification(userId, {
        id: `vr-suggest-${Date.now()}`,
        message: `Une session VR "${templateName}" pourrait être bénéfique pour vous en ce moment.`,
        type: 'info',
        timestamp: new Date()
      });
    }
  }

  private async handleUpdateMusicPlaylist(userId: string, data: any): Promise<void> {
    if (data?.emotion) {
      try {
        const emotion = data.emotion.toLowerCase();
        const playlist = await getPlaylist(emotion);
        console.log(`Updated playlist for ${userId} based on emotion: ${emotion}`);
      } catch (error) {
        console.error('Failed to update music playlist:', error);
      }
    }
  }

  private handleCheckTrendAlert(userId: string, data: any): void {
    emotionalDataService.updateUserEmotionalData(userId, data);
    
    if (emotionalDataService.hasNegativeTrend(userId)) {
      notificationService.addNotification(userId, {
        id: `trend-alert-${Date.now()}`,
        message: "J'ai remarqué une tendance émotionnelle qui pourrait mériter attention. Des exercices de bien-être sont disponibles.",
        type: 'warning',
        timestamp: new Date()
      });
    }
  }

  private handleRecordEmotionData(userId: string, data: any): void {
    if (data?.emotion) {
      emotionalDataService.updateUserEmotionalData(userId, data);
    }
  }

  private handleSendDashboardAlert(userId: string, payload: any): void {
    notificationService.addNotification(userId, {
      id: `dashboard-alert-${Date.now()}`,
      message: payload.message,
      type: 'warning',
      timestamp: new Date()
    });
  }

  private handleSendDashboardNotification(userId: string, payload: any): void {
    notificationService.addNotification(userId, {
      id: `dashboard-notif-${Date.now()}`,
      message: payload.message,
      type: 'info',
      timestamp: new Date()
    });
  }

  private handleStartVRSession(userId: string, payload: any): void {
    console.log(`Starting VR session "${payload.template}" for user ${userId}`);
    notificationService.addNotification(userId, {
      id: `vr-session-${Date.now()}`,
      message: `Session VR "${payload.template}" recommandée pour votre bien-être actuel.`,
      type: 'info',
      timestamp: new Date()
    });
  }

  private handlePlayMusicPreset(userId: string, payload: any): void {
    console.log(`Playing music preset "${payload.preset}" for user ${userId}`);
    notificationService.addNotification(userId, {
      id: `music-preset-${Date.now()}`,
      message: `Playlist "${payload.preset}" activée pour accompagner votre moment.`,
      type: 'info',
      timestamp: new Date()
    });
  }

  private handleFindBuddy(userId: string): void {
    console.log(`Finding buddy for user ${userId}`);
    notificationService.addNotification(userId, {
      id: `find-buddy-${Date.now()}`,
      message: "Recherche d'un buddy compatible en cours...",
      type: 'info',
      timestamp: new Date()
    });
  }

  private handleSendBuddyMessage(userId: string): void {
    notificationService.addNotification(userId, {
      id: `buddy-message-${Date.now()}`,
      message: "Votre buddy du jour est prêt à vous écouter anonymement !",
      type: 'success',
      timestamp: new Date()
    });
  }

  private handleCheckScanStatus(userId: string): void {
    // Vérifier si un scan a été fait aujourd'hui
    const hasScannedToday = Math.random() > 0.5; // Simulation
    if (!hasScannedToday) {
      notificationService.addNotification(userId, {
        id: `scan-reminder-${Date.now()}`,
        message: "Vous n'avez pas encore fait votre scan émotionnel aujourd'hui. Prenez un moment pour vous !",
        type: 'info',
        timestamp: new Date()
      });
    }
  }

  private handleSuggestJournalEntry(userId: string): void {
    notificationService.addNotification(userId, {
      id: `journal-suggest-${Date.now()}`,
      message: "Exprimer vos pensées dans votre journal pourrait vous aider à mieux comprendre vos émotions actuelles.",
      type: 'info',
      timestamp: new Date()
    });
  }

  private handleSuggestWellnessActivity(userId: string): void {
    const activities = [
      "Prenez 5 minutes pour faire des exercices de respiration profonde.",
      "Une courte marche de 10 minutes peut vous aider à vous recentrer.",
      "Hydratez-vous régulièrement pour maintenir votre bien-être.",
      "Avez-vous pris un moment pour vous aujourd'hui ? Un peu de méditation peut aider."
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    
    notificationService.addNotification(userId, {
      id: `wellness-suggest-${Date.now()}`,
      message: randomActivity,
      type: 'info',
      timestamp: new Date()
    });
  }
}

export const actionExecutor = new ActionExecutor();

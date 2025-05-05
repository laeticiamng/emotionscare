
import { CoachAction, CoachEvent } from './types';
import * as handlers from './action-handlers';

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
        handlers.handleCheckEmotionAlert(user_id, event.data);
        break;
        
      case 'suggest_vr_session':
        handlers.handleSuggestVRSession(user_id, event.data);
        break;
        
      case 'update_music_playlist':
        await handlers.handleUpdateMusicPlaylist(user_id, event.data);
        break;
        
      case 'check_trend_alert':
        handlers.handleCheckTrendAlert(user_id, event.data);
        break;
        
      case 'record_emotion_data':
        handlers.handleRecordEmotionData(user_id, event.data);
        break;
        
      case 'send_dashboard_alert':
        handlers.handleSendDashboardAlert(user_id, payload);
        break;
        
      case 'send_dashboard_notification':
        handlers.handleSendDashboardNotification(user_id, payload);
        break;
        
      case 'start_vr_session':
        handlers.handleStartVRSession(user_id, payload);
        break;
        
      case 'play_music_preset':
        handlers.handlePlayMusicPreset(user_id, payload);
        break;
        
      case 'find_buddy':
        handlers.handleFindBuddy(user_id);
        break;
        
      case 'send_buddy_message':
        handlers.handleSendBuddyMessage(user_id);
        break;
        
      case 'check_scan_status':
        handlers.handleCheckScanStatus(user_id);
        break;

      case 'suggest_journal_entry':
        handlers.handleSuggestJournalEntry(user_id);
        break;

      case 'suggest_wellness_activity':
        handlers.handleSuggestWellnessActivity(user_id);
        break;
        
      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }
}

export const actionExecutor = new ActionExecutor();

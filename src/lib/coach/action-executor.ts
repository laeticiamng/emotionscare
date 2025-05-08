import { CoachAction, CoachEvent } from './types';
import { actionHandlerRegistry } from './action-handlers/action-handler-registry';
// Keep the legacy handlers for now for backward compatibility
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

    try {
      // Try to use the handler from the registry first
      const handler = actionHandlerRegistry.getHandler(action.type);
      
      if (handler) {
        // If we have a handler in the registry, use it
        try {
          await handler.execute(user_id, action.payload || event.data || {});
          return;
        } catch (error) {
          console.error(`Error executing handler for action ${action.type}:`, error);
          // Fall back to legacy handlers if registry handler fails
        }
      }
      
      // Fall back to legacy switch-case for backward compatibility
      switch (action.type) {
        case 'check_emotion_alert':
          await handlers.handleCheckEmotionAlert(user_id, event.data);
          break;
          
        case 'suggest_vr_session':
          await handlers.handleSuggestVRSession(user_id, event.data);
          break;
          
        case 'update_music_playlist':
          await handlers.handleUpdateMusicPlaylist(user_id, event.data);
          break;
          
        case 'check_trend_alert':
          await handlers.handleCheckTrendAlert(user_id, event.data);
          break;
          
        case 'record_emotion_data':
          await handlers.handleRecordEmotionData(user_id, event.data);
          break;
          
        case 'send_dashboard_alert':
          await handlers.handleSendDashboardAlert(user_id, payload);
          break;
          
        case 'send_dashboard_notification':
          await handlers.handleSendDashboardNotification(user_id, payload);
          break;
          
        case 'start_vr_session':
          await handlers.handleStartVRSession(user_id, payload);
          break;
          
        case 'play_music_preset':
          await handlers.handlePlayMusicPreset(user_id, payload);
          break;
          
        case 'find_buddy':
          await handlers.handleFindBuddy(user_id);
          break;
          
        case 'send_buddy_message':
          await handlers.handleSendBuddyMessage(user_id);
          break;
          
        case 'check_scan_status':
          await handlers.handleCheckScanStatus(user_id);
          break;

        case 'suggest_journal_entry':
          await handlers.handleSuggestJournalEntry(user_id);
          break;

        case 'suggest_wellness_activity':
          await handlers.handleSuggestWellnessActivity(user_id);
          break;
          
        default:
          console.warn(`Unknown action type: ${action.type}`);
      }
    } catch (error) {
      console.error(`Error executing action ${action.type}:`, error);
      // Continue execution despite errors to avoid blocking the action pipeline
    }
  }
}

export const actionExecutor = new ActionExecutor();


import { CoachRoutine } from './types';

// Predefined routines for the Coach service
export const coachRoutines: CoachRoutine[] = [
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

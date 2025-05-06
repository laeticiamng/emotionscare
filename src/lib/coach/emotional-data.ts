
import { CoachAction, CoachEvent } from './types';

/**
 * Déterminer les actions à effectuer en fonction des données émotionnelles
 */
export function determineActions(event: CoachEvent): CoachAction[] {
  const actions: CoachAction[] = [];
  const data = event.data || {};
  
  // Enregistrer les données émotionnelles
  actions.push({ type: 'record_emotion_data', payload: data });
  
  // Vérifier si les émotions nécessitent une alerte
  if (data.emotion && (data.intensity > 7 || data.score < 30)) {
    actions.push({ type: 'check_emotion_alert', payload: data });
  }
  
  // Suggérer une session VR adaptée
  if (data.emotion && ['tristesse', 'stress', 'anxiété'].includes(data.emotion.toLowerCase())) {
    actions.push({ type: 'suggest_vr_session', payload: { emotion: data.emotion } });
  }
  
  // Mise à jour de la playlist musicale
  if (data.emotion) {
    actions.push({
      type: 'update_music_playlist',
      payload: { emotion: data.emotion, intensity: data.intensity || 5 }
    });
  }
  
  return actions;
}

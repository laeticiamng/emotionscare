
/**
 * Extrait l'identifiant YouTube d'une URL
 * @param url URL YouTube (divers formats supportés)
 * @returns l'identifiant YouTube ou null si non trouvé
 */
export function extractYoutubeID(url: string): string | null {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Calcule la réduction moyenne du rythme cardiaque en BPM
 * @param sessions Liste des sessions VR
 * @returns La réduction moyenne du rythme cardiaque
 */
export function calculateAverageHeartRateReduction(sessions: any[]): number {
  if (!sessions || sessions.length === 0) return 0;
  
  const validSessions = sessions.filter(
    session => session.heart_rate_before && session.heart_rate_after
  );
  
  if (validSessions.length === 0) return 0;
  
  const totalReduction = validSessions.reduce((sum, session) => {
    return sum + (session.heart_rate_before - session.heart_rate_after);
  }, 0);
  
  return Math.round(totalReduction / validSessions.length);
}

/**
 * Calcule le temps total passé en sessions VR en minutes
 * @param sessions Liste des sessions VR
 * @returns Le nombre total de minutes
 */
export function calculateTotalMinutes(sessions: any[]): number {
  if (!sessions || sessions.length === 0) return 0;
  
  return sessions.reduce((sum, session) => {
    // Convertit les secondes en minutes
    const minutes = session.duration_seconds 
      ? Math.round(session.duration_seconds / 60) 
      : session.duration || 0;
    
    return sum + minutes;
  }, 0);
}

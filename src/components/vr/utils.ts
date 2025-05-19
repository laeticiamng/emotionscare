
/**
 * Utilitaires pour les composants VR
 */

/**
 * Formatte la durée en minutes lisible
 */
export function formatDuration(duration?: number | string): string {
  if (!duration) return "Durée inconnue";
  
  const minutes = typeof duration === 'string' ? parseInt(duration, 10) : duration;
  
  if (isNaN(minutes)) return "Durée inconnue";
  
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  }
}

/**
 * Retourne la classe CSS en fonction de la difficulté
 */
export function getDifficultyClass(difficulty?: string): string {
  switch(difficulty?.toLowerCase()) {
    case 'advanced':
    case 'avancé':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'intermediate':
    case 'intermédiaire':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'beginner':
    case 'débutant':
    default:
      return 'bg-green-100 text-green-800 border-green-300';
  }
}

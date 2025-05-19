
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
 * Convertit une durée en nombre de minutes
 */
export function durationToNumber(duration?: number | string): number {
  if (!duration) return 0;
  return typeof duration === 'string' ? parseInt(duration, 10) : duration;
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

/**
 * Normaliser les valeurs de difficulté
 */
export function normalizeDifficulty(difficulty?: string): "beginner" | "intermediate" | "advanced" {
  if (!difficulty) return "beginner";
  
  const lowercaseDifficulty = difficulty.toLowerCase();
  
  if (lowercaseDifficulty === "débutant" || lowercaseDifficulty === "facile" || lowercaseDifficulty === "beginner") {
    return "beginner";
  } else if (lowercaseDifficulty === "intermédiaire" || lowercaseDifficulty === "intermediate") {
    return "intermediate";
  } else if (lowercaseDifficulty === "avancé" || lowercaseDifficulty === "difficile" || lowercaseDifficulty === "advanced") {
    return "advanced";
  }
  
  return "beginner";
}

/**
 * Extraire l'ID YouTube d'une URL
 */
export function extractYoutubeID(url?: string): string | null {
  if (!url) return null;
  
  // Regex pour extraire l'ID YouTube
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  
  return match ? match[1] : null;
}

/**
 * Vérifier si un template est favoris
 */
export function isTemplateFavorite(templateId: string, favorites: string[]): boolean {
  return favorites.includes(templateId);
}

/**
 * Calculer la durée d'une session en minutes
 */
export function calculateSessionDuration(startTime?: string | Date, endTime?: string | Date): number {
  if (!startTime || !endTime) return 0;
  
  const start = startTime instanceof Date ? startTime : new Date(startTime);
  const end = endTime instanceof Date ? endTime : new Date(endTime);
  
  // Durée en millisecondes
  const duration = end.getTime() - start.getTime();
  
  // Convertir en minutes
  return Math.round(duration / (1000 * 60));
}

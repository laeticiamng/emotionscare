/**
 * Mapping des émotions vers des catégories musicales pour les recommandations
 * Basé sur le modèle valence/arousal et les sliders du Mood Mixer
 */

export interface Mood {
  valence?: number; // -1 (négatif) à 1 (positif)
  arousal?: number; // -1 (calme) à 1 (énergique)
  sliders?: {
    energy: number; // 0-100
    calm: number;   // 0-100
    focus: number;  // 0-100
    light: number;  // 0-100 (luminosité/positivité)
  };
}

export type MusicBucket = 
  | 'calm/very_low'    // Très calme, méditation
  | 'calm/low'         // Calme, relaxation
  | 'focus/medium'     // Concentration, étude
  | 'bright/low'       // Positif mais calme
  | 'bright/medium'    // Positif et modérément énergique
  | 'reset'            // Neutre/remise à zéro

/**
 * Convertit un état émotionnel en catégorie musicale
 */
export function moodToBucket(mood: Mood): MusicBucket {
  // Extraire valence et arousal depuis les sliders si disponibles
  const valence = mood.valence ?? (
    mood.sliders ? (mood.sliders.light - 50) / 50 : 0
  );
  
  const arousal = mood.arousal ?? (
    mood.sliders ? (mood.sliders.energy - 50) / 50 : 0
  );

  // Logique de mapping basée sur les quadrants émotionnels
  if (valence < -0.3 && arousal > 0.3) {
    return 'calm/very_low'; // Stress/agitation → Très calme
  }
  
  if (arousal < -0.2) {
    return 'bright/low'; // Faible énergie → Positif mais calme
  }
  
  if (arousal > 0.5 && valence > 0.2) {
    return 'focus/medium'; // Haute énergie + positivité → Concentration
  }
  
  if (valence > 0.4 && arousal <= 0.4) {
    return 'bright/medium'; // Positif modéré → Bien-être équilibré
  }
  
  if (valence <= 0 && arousal <= 0.4) {
    return 'calm/low'; // Neutre-négatif → Relaxation
  }
  
  return 'reset'; // Par défaut
}

/**
 * Obtient une description textuelle de la catégorie musicale
 */
export function getBucketDescription(bucket: MusicBucket): string {
  const descriptions: Record<MusicBucket, string> = {
    'calm/very_low': 'Méditation profonde et apaisement',
    'calm/low': 'Relaxation et détente',
    'focus/medium': 'Concentration et focus',
    'bright/low': 'Douceur positive et sérénité',
    'bright/medium': 'Bien-être équilibré et harmonie',
    'reset': 'Remise à zéro émotionnelle'
  };
  
  return descriptions[bucket];
}
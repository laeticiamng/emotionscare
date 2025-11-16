// Breathing techniques database with educational content

export interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  timings: {
    inhale: number;
    hold: number;
    exhale: number;
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  instructions: string[];
  contraindications?: string[];
  scientific_basis?: string;
}

export const BREATHING_TECHNIQUES: Record<string, BreathingTechnique> = {
  box_breathing: {
    id: 'box_breathing',
    name: 'Respiration Carrée (Box Breathing)',
    description: 'Une technique équilibrée où chaque phase dure 4 secondes, créant un rythme stable et apaisant.',
    benefits: ['Réduit le stress', 'Améliore la concentration', 'Régule le cœur', 'Calme l\'anxiété'],
    timings: { inhale: 4000, hold: 4000, exhale: 4000 },
    difficulty: 'beginner',
    duration_minutes: 5,
    instructions: [
      'Assieds-toi confortablement avec le dos droit',
      'Inspire lentement par le nez pendant 4 secondes',
      'Retiens ton souffle pendant 4 secondes',
      'Expire lentement par la bouche pendant 4 secondes',
      'Garde tes poumons vides pendant 4 secondes',
      'Répète 5 fois (environ 5 minutes)',
    ],
    scientific_basis: 'Utilisée par les militaires pour maîtriser le stress',
  },

  coherence_breathing: {
    id: 'coherence_breathing',
    name: 'Respiration de Cohérence Cardiaque',
    description: 'Un rythme spécifique (5 respirations par minute) qui synchronise le cœur et le système nerveux.',
    benefits: ['Harmonise le cœur et le cerveau', 'Réduit la tension', 'Améliore la résilience émotionnelle', 'Équilibre le système nerveux'],
    timings: { inhale: 5000, hold: 0, exhale: 5000 },
    difficulty: 'beginner',
    duration_minutes: 5,
    instructions: [
      'Adopte une posture confortable',
      'Inspire lentement par le nez pendant 5 secondes',
      'Expire lentement par la bouche pendant 5 secondes',
      'Maintiens ce rythme sans pause',
      'Continue pendant 5 minutes minimum',
    ],
    scientific_basis: 'Reconnue pour synchroniser la variabilité du cœur avec le système nerveux autonome',
  },

  extended_exhale: {
    id: 'extended_exhale',
    name: 'Expiration Prolongée (4-7-8)',
    description: 'Technique puissante avec une expiration deux fois plus longue que l\'inspiration, parfaite pour l\'endormissement.',
    benefits: ['Favorise l\'endormissement', 'Réduit l\'anxiété', 'Calme le système nerveux', 'Détente profonde'],
    timings: { inhale: 4000, hold: 7000, exhale: 8000 },
    difficulty: 'intermediate',
    duration_minutes: 5,
    instructions: [
      'Assure-toi que ta respiration habituelle est apaisée',
      'Inspire silencieusement par le nez pendant 4 secondes',
      'Retiens ton souffle pendant 7 secondes',
      'Expire audiblement par la bouche pendant 8 secondes',
      'C\'est un cycle. Recommence immédiatement',
      'Répète 4 fois (total ~2 minutes)',
    ],
    contraindications: ['Évite si tu as des problèmes respiratoires'],
    scientific_basis: 'Développée par le Dr Andrew Weil pour induire le sommeil',
  },

  alternate_nostril: {
    id: 'alternate_nostril',
    name: 'Respiration Alternée par les Narines (Nadi Shodhana)',
    description: 'Une technique yogique équilibrant qui canalise l\'énergie et clarifie l\'esprit.',
    benefits: ['Équilibre les hémisphères du cerveau', 'Clarifie l\'esprit', 'Réduit le stress', 'Améliore la concentration'],
    timings: { inhale: 4000, hold: 4000, exhale: 4000 },
    difficulty: 'intermediate',
    duration_minutes: 5,
    instructions: [
      'Assieds-toi en position confortable',
      'Ferme ta narine droite avec ton pouce droit',
      'Inspire par la narine gauche pendant 4 secondes',
      'Ferme ta narine gauche, ouvre la droite',
      'Expire par la narine droite pendant 4 secondes',
      'Inspire par la narine droite',
      'Alterne ainsi pendant 5 minutes',
    ],
    scientific_basis: 'Pratique yogique millénaire pour l\'équilibre énergétique',
  },

  lion_breath: {
    id: 'lion_breath',
    name: 'Respiration du Lion (Simhasana)',
    description: 'Une technique énergisante et libératrice avec une expiration puissante et visible.',
    benefits: ['Libère les tensions faciales', 'Énergise le corps', 'Réduit les blocages émotionnels', 'Améliore la confiance'],
    timings: { inhale: 4000, hold: 0, exhale: 4000 },
    difficulty: 'intermediate',
    duration_minutes: 3,
    instructions: [
      'Assieds-toi confortablement ou à genoux',
      'Inspire profondément par le nez',
      'Expire vigoureusement en ouvrant grand la bouche',
      'Laisse ta langue pendre légèrement',
      'Crée un son "ha" puissant en expirant',
      'Répète 5-10 fois avec force et intention',
    ],
    scientific_basis: 'Technique yogique pour libérer les émotions retenues',
  },

  humming_bee: {
    id: 'humming_bee',
    name: 'Respiration de l\'Abeille (Bhramari)',
    description: 'Une technique apaisante avec un son de bourdonnement qui calme l\'esprit et active le parasympathique.',
    benefits: ['Calme l\'anxiété', 'Réduit la tension mentale', 'Apaise les acouphènes', 'Favorise la méditation'],
    timings: { inhale: 4000, hold: 0, exhale: 8000 },
    difficulty: 'beginner',
    duration_minutes: 5,
    instructions: [
      'Assieds-toi dans une position confortable',
      'Ferme les yeux et garde la colonne vertébrale droite',
      'Inspire profondément par le nez',
      'Expire en produisant un son "mmmmm" grave',
      'Sens la vibration dans ta poitrine et ta tête',
      'Continue pendant 5-10 cycles',
    ],
    scientific_basis: 'Reconnue pour activater le système parasympathique',
  },

  equal_breathing: {
    id: 'equal_breathing',
    name: 'Respiration Égale (Sama Vritti)',
    description: 'Un rythme parfaitement équilibré qui créé une sensation d\'harmonie et de stabilité.',
    benefits: ['Crée l\'équilibre émotionnel', 'Réduit l\'agitation', 'Améliore la concentration', 'Calme l\'esprit'],
    timings: { inhale: 4000, hold: 0, exhale: 4000 },
    difficulty: 'beginner',
    duration_minutes: 5,
    instructions: [
      'Trouve une position confortable',
      'Inspire lentement par le nez pendant 4 secondes',
      'Expire lentement par le nez pendant 4 secondes',
      'Pas de pause entre les cycles',
      'Maintiens ce rythme régulier',
      'Continue pendant 5 minutes',
    ],
    scientific_basis: 'Pratique yogique fondamentale pour l\'équilibre énergétique',
  },
};

export const getTechniqueById = (id: string): BreathingTechnique | null => {
  return BREATHING_TECHNIQUES[id] || null;
};

export const getTechniquesByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): BreathingTechnique[] => {
  return Object.values(BREATHING_TECHNIQUES).filter(t => t.difficulty === difficulty);
};

export const getTechniquesByBenefit = (benefit: string): BreathingTechnique[] => {
  return Object.values(BREATHING_TECHNIQUES).filter(t => t.benefits.includes(benefit));
};

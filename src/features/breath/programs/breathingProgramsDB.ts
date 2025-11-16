// Guided breathing programs database

export interface ProgramSession {
  day: number;
  title: string;
  description: string;
  technique: string;
  duration_minutes: number;
  notes: string;
}

export interface BreathingProgram {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  duration_days: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
  sessions: ProgramSession[];
  category: 'stress' | 'sleep' | 'focus' | 'energy' | 'wellbeing';
  estimatedCommitment: string;
}

export const BREATHING_PROGRAMS: Record<string, BreathingProgram> = {
  seven_day_calm: {
    id: 'seven_day_calm',
    name: 'Semaine de Sérénité',
    description: '7 jours pour cultiver la calme et la paix intérieure',
    longDescription: 'Un programme progressif de 7 jours conçu pour développer progressivement ta capacité à trouver le calme dans la vie quotidienne. Chaque jour introduit des techniques complémentaires pour renforcer ton ancrage émotionnel.',
    duration_days: 7,
    difficulty: 'beginner',
    benefits: ['Réduit le stress', 'Améliore la qualité du sommeil', 'Augmente la résilience émotionnelle'],
    category: 'stress',
    estimatedCommitment: '5-10 min par jour',
    sessions: [
      {
        day: 1,
        title: 'Découverte Douce',
        description: 'Commence avec une respiration cohérente simple',
        technique: 'coherence_breathing',
        duration_minutes: 5,
        notes: 'Fais connaissance avec la respiration consciente. Pas de pression, juste de la présence.',
      },
      {
        day: 2,
        title: 'Enracinement',
        description: 'Respiration égale pour l\'équilibre',
        technique: 'equal_breathing',
        duration_minutes: 5,
        notes: 'Sens l\'équilibre naturel de ton souffle. Chaque inspiration = chaque expiration.',
      },
      {
        day: 3,
        title: 'Stabilité',
        description: 'Respiration carrée pour la concentration',
        technique: 'box_breathing',
        duration_minutes: 5,
        notes: 'Construit une structure stable pour ton esprit. La répétition crée le calme.',
      },
      {
        day: 4,
        title: 'Profondeur',
        description: 'Respiration de cohérence renforcée',
        technique: 'coherence_breathing',
        duration_minutes: 7,
        notes: 'Approfondis ta pratique. Remarque les changements dans ton corps et ton esprit.',
      },
      {
        day: 5,
        title: 'Libération',
        description: 'Respiration du lion pour relâcher les tensions',
        technique: 'lion_breath',
        duration_minutes: 5,
        notes: 'Libère ce qui n\'a pas besoin d\'être retenu. C\'est puissant et libérateur.',
      },
      {
        day: 6,
        title: 'Harmonie',
        description: 'Respiration alternée pour l\'équilibre nerveux',
        technique: 'alternate_nostril',
        duration_minutes: 7,
        notes: 'Équilibre tes deux hémisphères cérébraux. Sens l\'harmonisation.',
      },
      {
        day: 7,
        title: 'Intégration',
        description: 'Une séance combinant toutes tes apprentissages',
        technique: 'box_breathing',
        duration_minutes: 10,
        notes: 'Célèbre ta semaine! Fais cette pratique libre en choisissant ce qui résonne le plus.',
      },
    ],
  },

  better_sleep_challenge: {
    id: 'better_sleep_challenge',
    name: 'Défi Sommeil Meilleur',
    description: '5 jours pour transformer ton sommeil',
    longDescription: 'Un programme intensif de 5 jours spécialement conçu pour améliorer la qualité de ton sommeil. Chaque technique est sélectionnée pour activer ton système parasympathique et préparer ton corps au repos profond.',
    duration_days: 5,
    difficulty: 'intermediate',
    benefits: ['Meilleur endormissement', 'Sommeil plus profond', 'Moins de réveils nocturnes'],
    category: 'sleep',
    estimatedCommitment: '10-15 min avant le coucher',
    sessions: [
      {
        day: 1,
        title: 'Préparation du Soir',
        description: 'Initie ton corps au repos',
        technique: 'equal_breathing',
        duration_minutes: 5,
        notes: 'Pratique juste après le dîner pour commencer à ralentir ton système nerveux.',
      },
      {
        day: 2,
        title: 'Bourdonnement Apaisant',
        description: 'Respiration de l\'abeille pour activer le parasympathique',
        technique: 'humming_bee',
        duration_minutes: 5,
        notes: 'Le bourdonnement calme naturellement l\'esprit. Sois régulier dans le son.',
      },
      {
        day: 3,
        title: 'Expiration Prolongée',
        description: 'La technique 4-7-8 pour l\'endormissement',
        technique: 'extended_exhale',
        duration_minutes: 5,
        notes: 'C\'est la technique la plus puissante pour induire le sommeil. Pratique 2h avant le lit.',
      },
      {
        day: 4,
        title: 'Respiration du Soir',
        description: 'Respiration carrée apaisante',
        technique: 'box_breathing',
        duration_minutes: 7,
        notes: 'Le rythme régulier prépare ton corps à la transition sommeil. Pratique au lit.',
      },
      {
        day: 5,
        title: 'Routine Intégrée',
        description: 'Ta routine complète de sommeil',
        technique: 'extended_exhale',
        duration_minutes: 10,
        notes: 'Combine 4-7-8 avec la respiration carrée. Crée une habitude puissante.',
      },
    ],
  },

  focus_master: {
    id: 'focus_master',
    name: 'Maître de la Concentration',
    description: '7 jours pour augmenter ta concentration et ta clarté mentale',
    longDescription: 'Un programme scientifiquement conçu pour optimiser ta concentration et ta performance cognitive. Idéal pour les étudiants, créatifs et professionnels qui veulent maximiser leur potentiel mental.',
    duration_days: 7,
    difficulty: 'intermediate',
    benefits: ['Meilleure concentration', 'Clarté mentale accrue', 'Moins de distractions', 'Performance cognitive'],
    category: 'focus',
    estimatedCommitment: '5-7 min le matin',
    sessions: [
      {
        day: 1,
        title: 'Activation Mentale',
        description: 'Réveille ton esprit avec respiration alternée',
        technique: 'alternate_nostril',
        duration_minutes: 5,
        notes: 'Le matin, cette technique équilibre tes hémisphères et active le mental.',
      },
      {
        day: 2,
        title: 'Clarté de Pensée',
        description: 'Respiration carrée pour la structure mentale',
        technique: 'box_breathing',
        duration_minutes: 5,
        notes: 'Crée une structure mentale claire. Parfait avant le travail important.',
      },
      {
        day: 3,
        title: 'Énergie Équilibrée',
        description: 'Respiration égale pour l\'équilibre énergétique',
        technique: 'equal_breathing',
        duration_minutes: 5,
        notes: 'Équilibre tes énergies. Ni trop excité, ni trop calme. Juste au point.',
      },
      {
        day: 4,
        title: 'Présence Accrue',
        description: 'Respiration du lion pour se dynamiser',
        technique: 'lion_breath',
        duration_minutes: 5,
        notes: 'Booste ton énergie mentale. Libère les blocages créatifs.',
      },
      {
        day: 5,
        title: 'Harmonie Cérébrale',
        description: 'Respiration alternée avancée',
        technique: 'alternate_nostril',
        duration_minutes: 7,
        notes: 'Profondis ta pratique. Sens l\'intégration des deux côtés de ton cerveau.',
      },
      {
        day: 6,
        title: 'Akasha (Aether)',
        description: 'Respiration avec intention de clarté',
        technique: 'box_breathing',
        duration_minutes: 7,
        notes: 'Sois conscient de chaque respiration. Chaque souffle clarifie tes pensées.',
      },
      {
        day: 7,
        title: 'Maîtrise',
        description: 'Intégration et mastery',
        technique: 'alternate_nostril',
        duration_minutes: 10,
        notes: 'Choisis ta technique préférée et pratique en complète liberté consciente.',
      },
    ],
  },

  energy_booster: {
    id: 'energy_booster',
    name: 'Regain d\'Énergie',
    description: '3 jours pour revitaliser ton énergie',
    longDescription: 'Un programme court et puissant pour quand tu as besoin d\'un coup de boost. Conçu pour les moments où tu te sens fatigué ou démotivé, ces techniques vont revitaliser ton énergie rapidement.',
    duration_days: 3,
    difficulty: 'beginner',
    benefits: ['Augmentation de l\'énergie', 'Meilleure vitalité', 'Motivation restaurée'],
    category: 'energy',
    estimatedCommitment: '3-5 min quand tu en as besoin',
    sessions: [
      {
        day: 1,
        title: 'Réveil du Corps',
        description: 'Respiration du lion pour l\'activation',
        technique: 'lion_breath',
        duration_minutes: 3,
        notes: 'Rapide et puissant. Libère l\'énergie bloquée immédiatement.',
      },
      {
        day: 2,
        title: 'Activation Nasale',
        description: 'Respiration alternée pour l\'équilibre énergétique',
        technique: 'alternate_nostril',
        duration_minutes: 5,
        notes: 'Circule l\'énergie dans tout ton corps. Sens le flux.',
      },
      {
        day: 3,
        title: 'Énergie Complète',
        description: 'Combinaison puissante pour la vitalité',
        technique: 'box_breathing',
        duration_minutes: 5,
        notes: 'Crée un équilibre dynamique. Tu es prêt pour ta journée!',
      },
    ],
  },
};

export const getProgramById = (id: string): BreathingProgram | null => {
  return BREATHING_PROGRAMS[id] || null;
};

export const getProgramsByCategory = (category: string): BreathingProgram[] => {
  return Object.values(BREATHING_PROGRAMS).filter(p => p.category === category);
};

export const getProgramsByDifficulty = (difficulty: string): BreathingProgram[] => {
  return Object.values(BREATHING_PROGRAMS).filter(p => p.difficulty === difficulty);
};

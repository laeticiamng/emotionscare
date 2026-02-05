/**
 * Clinical questionnaire definitions - WHO-5 and PHQ-9
 * These are validated, royalty-free clinical tools
 */

export interface ClinicalQuestion {
  id: string;
  text: string;
  options: { value: number; label: string }[];
}

export interface ClinicalQuestionnaire {
  id: 'WHO5' | 'PHQ9';
  name: string;
  description: string;
  instructions: string;
  questions: ClinicalQuestion[];
  scoring: {
    maxScore: number;
    multiplier?: number;
    categories: { min: number; max: number; label: string; severity: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe' }[];
  };
}

// WHO-5 Options (0-5 scale)
const WHO5_OPTIONS = [
  { value: 5, label: 'Tout le temps' },
  { value: 4, label: 'La plupart du temps' },
  { value: 3, label: 'Plus de la moitié du temps' },
  { value: 2, label: 'Moins de la moitié du temps' },
  { value: 1, label: 'De temps en temps' },
  { value: 0, label: 'Jamais' },
];

// PHQ-9 Options (0-3 scale)
const PHQ9_OPTIONS = [
  { value: 0, label: 'Jamais' },
  { value: 1, label: 'Plusieurs jours' },
  { value: 2, label: 'Plus de la moitié des jours' },
  { value: 3, label: 'Presque tous les jours' },
];

export const WHO5_QUESTIONNAIRE: ClinicalQuestionnaire = {
  id: 'WHO5',
  name: 'WHO-5 - Indice de Bien-Être OMS',
  description: 'Évaluation du bien-être psychologique sur les 2 dernières semaines',
  instructions: 'Pour chaque affirmation, veuillez indiquer la réponse qui correspond le mieux à votre ressenti au cours des deux dernières semaines.',
  questions: [
    {
      id: 'who5_1',
      text: 'Je me suis senti(e) gai(e) et de bonne humeur',
      options: WHO5_OPTIONS,
    },
    {
      id: 'who5_2',
      text: 'Je me suis senti(e) calme et tranquille',
      options: WHO5_OPTIONS,
    },
    {
      id: 'who5_3',
      text: 'Je me suis senti(e) actif(ve) et vigoureux(se)',
      options: WHO5_OPTIONS,
    },
    {
      id: 'who5_4',
      text: 'Je me suis réveillé(e) frais(che) et dispos(e)',
      options: WHO5_OPTIONS,
    },
    {
      id: 'who5_5',
      text: 'Ma vie quotidienne a été remplie de choses intéressantes',
      options: WHO5_OPTIONS,
    },
  ],
  scoring: {
    maxScore: 25,
    multiplier: 4, // Score /25 × 4 = score /100
    categories: [
      { min: 0, max: 28, label: 'Bien-être très faible', severity: 'severe' },
      { min: 29, max: 49, label: 'Bien-être faible', severity: 'moderate' },
      { min: 50, max: 69, label: 'Bien-être modéré', severity: 'mild' },
      { min: 70, max: 84, label: 'Bien-être bon', severity: 'minimal' },
      { min: 85, max: 100, label: 'Bien-être excellent', severity: 'minimal' },
    ],
  },
};

export const PHQ9_QUESTIONNAIRE: ClinicalQuestionnaire = {
  id: 'PHQ9',
  name: 'PHQ-9 - Questionnaire sur la Santé du Patient',
  description: 'Évaluation des symptômes dépressifs sur les 2 dernières semaines',
  instructions: 'Au cours des 2 dernières semaines, à quelle fréquence avez-vous été gêné(e) par les problèmes suivants ?',
  questions: [
    {
      id: 'phq9_1',
      text: 'Peu d\'intérêt ou de plaisir à faire les choses',
      options: PHQ9_OPTIONS,
    },
    {
      id: 'phq9_2',
      text: 'Être triste, déprimé(e) ou désespéré(e)',
      options: PHQ9_OPTIONS,
    },
    {
      id: 'phq9_3',
      text: 'Difficultés à s\'endormir ou à rester endormi(e), ou dormir trop',
      options: PHQ9_OPTIONS,
    },
    {
      id: 'phq9_4',
      text: 'Se sentir fatigué(e) ou manquer d\'énergie',
      options: PHQ9_OPTIONS,
    },
    {
      id: 'phq9_5',
      text: 'Avoir peu d\'appétit ou manger trop',
      options: PHQ9_OPTIONS,
    },
    {
      id: 'phq9_6',
      text: 'Avoir une mauvaise opinion de soi-même, ou avoir le sentiment d\'être nul(le), ou d\'avoir déçu sa famille ou s\'être déçu(e) soi-même',
      options: PHQ9_OPTIONS,
    },
    {
      id: 'phq9_7',
      text: 'Avoir du mal à se concentrer, par exemple pour lire le journal ou regarder la télévision',
      options: PHQ9_OPTIONS,
    },
    {
      id: 'phq9_8',
      text: 'Bouger ou parler si lentement que les autres ont pu le remarquer, ou au contraire, être si agité(e) que vous avez eu du mal à rester en place',
      options: PHQ9_OPTIONS,
    },
    {
      id: 'phq9_9',
      text: 'Avoir des pensées de mort ou des pensées de vous faire du mal d\'une manière ou d\'une autre',
      options: PHQ9_OPTIONS,
    },
  ],
  scoring: {
    maxScore: 27,
    categories: [
      { min: 0, max: 4, label: 'Symptômes minimaux', severity: 'minimal' },
      { min: 5, max: 9, label: 'Symptômes légers', severity: 'mild' },
      { min: 10, max: 14, label: 'Symptômes modérés', severity: 'moderate' },
      { min: 15, max: 19, label: 'Symptômes modérément sévères', severity: 'moderately_severe' },
      { min: 20, max: 27, label: 'Symptômes sévères', severity: 'severe' },
    ],
  },
};

export const CLINICAL_QUESTIONNAIRES: Record<string, ClinicalQuestionnaire> = {
  WHO5: WHO5_QUESTIONNAIRE,
  PHQ9: PHQ9_QUESTIONNAIRE,
};

export const getCategory = (
  questionnaire: ClinicalQuestionnaire,
  rawScore: number
): { label: string; severity: string } => {
  const finalScore = questionnaire.scoring.multiplier
    ? rawScore * questionnaire.scoring.multiplier
    : rawScore;

  const category = questionnaire.scoring.categories.find(
    (c) => finalScore >= c.min && finalScore <= c.max
  );

  return category || { label: 'Non défini', severity: 'minimal' };
};

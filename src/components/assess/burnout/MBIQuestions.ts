/**
 * MBI-HSS (Maslach Burnout Inventory - Human Services)
 * 22-item questionnaire with 3 subscales
 * Frequency scale: 0 (Never) to 6 (Every day)
 */

export interface MBIItem {
  id: number;
  text: string;
  subscale: 'EE' | 'DP' | 'PA';
}

export type MBISubscale = 'EE' | 'DP' | 'PA';

export interface MBIResult {
  EE: { score: number; level: 'low' | 'moderate' | 'high' };
  DP: { score: number; level: 'low' | 'moderate' | 'high' };
  PA: { score: number; level: 'low' | 'moderate' | 'high' };
  overallRisk: 'low' | 'moderate' | 'high';
}

export const MBI_FREQUENCY_OPTIONS = [
  { value: 0, label: 'Jamais' },
  { value: 1, label: 'Quelques fois par an' },
  { value: 2, label: 'Une fois par mois' },
  { value: 3, label: 'Quelques fois par mois' },
  { value: 4, label: 'Une fois par semaine' },
  { value: 5, label: 'Quelques fois par semaine' },
  { value: 6, label: 'Chaque jour' },
];

export const MBI_ITEMS: MBIItem[] = [
  { id: 1, text: 'Je me sens émotionnellement vidé(e) par mon travail.', subscale: 'EE' },
  { id: 2, text: 'Je me sens épuisé(e) à la fin de ma journée de travail.', subscale: 'EE' },
  { id: 3, text: 'Je me sens fatigué(e) quand je me lève le matin et que j\'ai à affronter une nouvelle journée de travail.', subscale: 'EE' },
  { id: 4, text: 'Je peux comprendre facilement ce que mes patients ressentent.', subscale: 'PA' },
  { id: 5, text: 'Je sens que je m\'occupe de certains patients de façon impersonnelle, comme s\'ils étaient des objets.', subscale: 'DP' },
  { id: 6, text: 'Travailler avec des gens tout au long de la journée me demande beaucoup d\'effort.', subscale: 'EE' },
  { id: 7, text: 'Je m\'occupe très efficacement des problèmes de mes patients.', subscale: 'PA' },
  { id: 8, text: 'Je sens que je craque à cause de mon travail.', subscale: 'EE' },
  { id: 9, text: 'Je sens que j\'influence positivement la vie d\'autres personnes par mon travail.', subscale: 'PA' },
  { id: 10, text: 'Je suis devenu(e) plus insensible aux gens depuis que j\'ai ce travail.', subscale: 'DP' },
  { id: 11, text: 'Je crains que ce travail ne m\'endurcisse émotionnellement.', subscale: 'DP' },
  { id: 12, text: 'Je me sens plein(e) d\'énergie.', subscale: 'PA' },
  { id: 13, text: 'Je me sens frustré(e) par mon travail.', subscale: 'EE' },
  { id: 14, text: 'Je sens que je travaille trop dur dans mon travail.', subscale: 'EE' },
  { id: 15, text: 'Je ne me soucie pas vraiment de ce qui arrive à certains de mes patients.', subscale: 'DP' },
  { id: 16, text: 'Travailler en contact direct avec les gens me stresse trop.', subscale: 'EE' },
  { id: 17, text: 'J\'arrive facilement à créer une atmosphère détendue avec mes patients.', subscale: 'PA' },
  { id: 18, text: 'Je me sens ragaillardi(e) lorsque dans mon travail j\'ai été proche de mes patients.', subscale: 'PA' },
  { id: 19, text: 'J\'ai accompli beaucoup de choses qui en valent la peine dans ce travail.', subscale: 'PA' },
  { id: 20, text: 'Je me sens au bout du rouleau.', subscale: 'EE' },
  { id: 21, text: 'Dans mon travail, je traite les problèmes émotionnels très calmement.', subscale: 'PA' },
  { id: 22, text: 'J\'ai l\'impression que mes patients me rendent responsable de certains de leurs problèmes.', subscale: 'DP' },
];

/** Healthcare professional norms (Maslach & Jackson, 1996) */
export const HEALTHCARE_NORMS = {
  EE: { mean: 21.35, sd: 11.03 },
  DP: { mean: 7.46, sd: 5.11 },
  PA: { mean: 36.53, sd: 7.34 },
};

/** Thresholds for burnout levels */
export const MBI_THRESHOLDS = {
  EE: { low: 16, high: 27 }, // ≤16 low, 17-26 moderate, ≥27 high
  DP: { low: 6, high: 13 },  // ≤6 low, 7-12 moderate, ≥13 high
  PA: { low: 31, high: 39 }, // ≥39 low burnout, 32-38 moderate, ≤31 high burnout (reversed)
};

export function scoreMBI(answers: Record<number, number>): MBIResult {
  const subscaleScores = { EE: 0, DP: 0, PA: 0 };

  MBI_ITEMS.forEach((item) => {
    const val = answers[item.id] ?? 0;
    subscaleScores[item.subscale] += val;
  });

  const getLevel = (subscale: MBISubscale, score: number): 'low' | 'moderate' | 'high' => {
    const t = MBI_THRESHOLDS[subscale];
    if (subscale === 'PA') {
      // PA is reversed: high score = low burnout
      if (score >= t.high) return 'low';
      if (score >= t.low) return 'moderate';
      return 'high';
    }
    if (score <= t.low) return 'low';
    if (score < t.high) return 'moderate';
    return 'high';
  };

  const eeLevel = getLevel('EE', subscaleScores.EE);
  const dpLevel = getLevel('DP', subscaleScores.DP);
  const paLevel = getLevel('PA', subscaleScores.PA);

  // Overall risk: high if any 2+ subscales are high, moderate if any 1 high or 2+ moderate
  const levels = [eeLevel, dpLevel, paLevel];
  const highCount = levels.filter((l) => l === 'high').length;
  const modCount = levels.filter((l) => l === 'moderate').length;

  let overallRisk: 'low' | 'moderate' | 'high' = 'low';
  if (highCount >= 2) overallRisk = 'high';
  else if (highCount >= 1 || modCount >= 2) overallRisk = 'moderate';

  return {
    EE: { score: subscaleScores.EE, level: eeLevel },
    DP: { score: subscaleScores.DP, level: dpLevel },
    PA: { score: subscaleScores.PA, level: paLevel },
    overallRisk,
  };
}

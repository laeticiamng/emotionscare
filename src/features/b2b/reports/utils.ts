/** Seuil de confidentialité minimum pour afficher une cellule */
export const CONFIDENTIALITY_THRESHOLD = 5;

export interface HeatmapCellInput {
  instrument: string;
  period: string;
  text: string;
  team?: string;
  action?: string;
  /** Nombre de répondants - si < CONFIDENTIALITY_THRESHOLD, cellule masquée */
  n?: number;
}

export interface HeatmapCell {
  instrument: string;
  period: string;
  text: string;
  team?: string;
  action?: string;
}

export type HeatmapTone = 'calm' | 'energized' | 'fatigue' | 'tense' | 'mixed' | 'watchful' | 'neutral';

export interface HeatmapInsight {
  label: string;
  action: string;
  tone: HeatmapTone;
  tooltip: string;
}

const INSTRUMENT_LABELS: Record<string, string> = {
  WEMWBS: 'Bien-être',
  CBI: 'Burnout',
  UWES: 'Engagement',
};

export function labelInstrument(key: string): string {
  return INSTRUMENT_LABELS[key] ?? key;
}

export function mapSummariesToCells(entries: HeatmapCellInput[]): HeatmapCell[] {
  return entries
    .filter((entry) => {
      // Filtre par seuil de confidentialité si n est défini
      if (entry.n !== undefined && entry.n < CONFIDENTIALITY_THRESHOLD) {
        return false;
      }
      return true;
    })
    .map((entry) => ({
      instrument: entry.instrument,
      period: entry.period,
      text: entry.text.trim(),
      team: entry.team?.trim() || undefined,
      action: entry.action?.trim() || undefined,
    }))
    .filter((cell) => cell.text.length > 0);
}

interface DescriptorPattern {
  keywords: string[];
  tone: HeatmapTone;
  label: string;
  action: string;
  tooltip: string;
}

const DESCRIPTOR_PATTERNS: DescriptorPattern[] = [
  {
    keywords: ['posee', 'calme', 'apais', 'stable', 'seren'],
    tone: 'calm',
    label: 'semaine plus posée',
    action: 'prévoir 1 pause courte sans agenda',
    tooltip: 'Ambiance apaisée',
  },
  {
    keywords: ['energie', 'dynamique', 'elan', 'engage', 'motiv'],
    tone: 'energized',
    label: 'élan engagé',
    action: 'célébrer une réussite concrète',
    tooltip: 'Énergie présente',
  },
  {
    keywords: ['fatigue', 'epuis', 'lassitude', 'usure', 'essouff'],
    tone: 'fatigue',
    label: 'fatigue présente',
    action: 'protéger un créneau de récupération',
    tooltip: 'Fatigue partagée',
  },
  {
    keywords: ['tension', 'tendu', 'pression', 'stress', 'charge'],
    tone: 'tense',
    label: 'tension sensible',
    action: 'resserrer la charge de réunions',
    tooltip: 'Tension ressentie',
  },
  {
    keywords: ['fluct', 'oscill', 'altern', 'contrast', 'variat'],
    tone: 'mixed',
    label: 'énergie fluctuante',
    action: 'ouvrir un tour météo express',
    tooltip: 'Énergie variable',
  },
  {
    keywords: ['inquiet', 'fragil', 'vigil', 'baisse', 'ralenti'],
    tone: 'watchful',
    label: 'humeur à écouter',
    action: 'organiser un temps d’écoute dédié',
    tooltip: 'Besoin d’écoute',
  },
];

const DEFAULT_DESCRIPTOR: HeatmapInsight = {
  tone: 'neutral',
  label: 'à observer',
  action: 'planifier un check-in ouvert',
  tooltip: 'Tendance à clarifier',
};

function normalizeSummary(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function deriveHeatmapInsight(
  summaryText: string,
  backendSuggestion?: string | null,
): HeatmapInsight {
  const normalized = normalizeSummary(summaryText);
  const descriptor =
    DESCRIPTOR_PATTERNS.find((pattern) =>
      pattern.keywords.some((keyword) => normalized.includes(keyword)),
    ) ?? DEFAULT_DESCRIPTOR;

  const action = backendSuggestion && backendSuggestion.trim().length > 0 ? backendSuggestion.trim() : descriptor.action;

  return {
    tone: descriptor.tone,
    label: descriptor.label,
    action,
    tooltip: descriptor.tooltip,
  };
}

export function deriveActionSuggestion(summaryText: string, backendSuggestion?: string | null): string {
  return deriveHeatmapInsight(summaryText, backendSuggestion).action;
}

export function groupCellsByInstrument(cells: HeatmapCell[]): Record<string, HeatmapCell[]> {
  return cells.reduce<Record<string, HeatmapCell[]>>((acc, cell) => {
    const key = cell.instrument;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(cell);
    return acc;
  }, {});
}

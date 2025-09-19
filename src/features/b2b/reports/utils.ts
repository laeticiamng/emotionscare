export interface HeatmapCellInput {
  instrument: string;
  period: string;
  text: string;
  team?: string;
  action?: string;
  n?: number | null;
}

export interface HeatmapCell {
  instrument: string;
  period: string;
  text: string;
  team?: string;
  action?: string;
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
      if (typeof entry.n === 'number') {
        return entry.n >= 5;
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
    .filter((entry) => entry.text.length > 0);
}

export function deriveActionSuggestion(summaryText: string, backendSuggestion?: string | null): string {
  if (backendSuggestion && backendSuggestion.trim().length > 0) {
    return backendSuggestion.trim();
  }

  const normalized = summaryText.toLowerCase();

  if (normalized.includes('fatigue')) {
    return 'proposer pause cocon 10 min';
  }

  if (normalized.includes('tendu') || normalized.includes('tension')) {
    return 'respiration 1 min en équipe';
  }

  if (normalized.includes('isolement') || normalized.includes('solitude')) {
    return 'organiser un temps de pairage bienveillant';
  }

  if (normalized.includes('stress')) {
    return 'proposer un rituel de clôture apaisant';
  }

  return 'check-in court sans agenda';
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

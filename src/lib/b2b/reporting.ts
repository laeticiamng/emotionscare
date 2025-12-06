type Bucket = 'low' | 'mid' | 'high' | 'unknown';

function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/[^a-z\s]/gi, '').toLowerCase();
}

export function summarizeWEMWBS(bucket: Bucket): string {
  switch (bucket) {
    case 'high':
      return "Ambiance globalement posée, la cohésion reste douce.";
    case 'mid':
      return "Ambiance plutôt équilibrée, à nourrir avec des respirations partagées.";
    case 'low':
      return "Ambiance plus tendue, prêter attention aux signaux discrets.";
    default:
      return "Ambiance à préciser, restons disponibles aux ressentis exprimés.";
  }
}

export function summarizeCBI(bucket: Bucket): string {
  switch (bucket) {
    case 'high':
      return "Fatigue ressentie, sécuriser des temps calmes dans la semaine.";
    case 'mid':
      return "Quelques signaux de fatigue à accueillir avec attention.";
    case 'low':
      return "Énergie préservée, fatigue peu évoquée collectivement.";
    default:
      return "Fatigue à clarifier ensemble, inviter les retours en douceur.";
  }
}

export function summarizeUWES(bucket: Bucket): string {
  switch (bucket) {
    case 'high':
      return "Implication forte, envie d'avancer partagée.";
    case 'mid':
      return "Implication stable, petits élans réguliers à encourager.";
    case 'low':
      return "Implication en retrait, sécuriser les priorités calmes.";
    default:
      return "Implication à observer, ouvrir la parole sur les envies.";
  }
}

export function suggestAction(params: { wemwbs: string; cbi: string; uwes: string }): string {
  const wemwbs = params.wemwbs.toLowerCase();
  const cbi = params.cbi.toLowerCase();
  const uwes = params.uwes.toLowerCase();

  if (cbi.includes('fatigue') || cbi.includes('tension')) {
    return 'Réunion courte sans agenda pour relâcher.';
  }

  if (wemwbs.includes('posée') && uwes.includes('envie')) {
    return 'Bloquer 30 min focus sans sollicitations, en équipe.';
  }

  return 'Commencer la semaine par un check-in 2 questions, 5 minutes.';
}

export function inferBucketFromText(text: string | null | undefined): Bucket {
  if (!text) {
    return 'unknown';
  }
  const normalized = normalizeText(text);
  if (!normalized) {
    return 'unknown';
  }
  if (/apais|calme|pose|seren|souple|ressourc/.test(normalized)) {
    return 'high';
  }
  if (/fatigu|tension|fragil|stress|lourd|epuis/.test(normalized)) {
    return 'low';
  }
  if (/stable|equilibr|conserve|regular|veille/.test(normalized)) {
    return 'mid';
  }
  return 'unknown';
}

export type { Bucket };

import type { FlashGlowSession } from './flash-glowService';
import { journalService } from '@/modules/journal/journalService';
import type { JournalEntry } from '@/modules/journal/journalService';

export type FlashGlowJournalLabel = FlashGlowSession['label'];

interface CreateFlashGlowJournalEntryParams {
  label?: FlashGlowJournalLabel;
  duration: number;
  intensity: number;
  glowType?: string;
  recommendation?: string;
  context?: string;
}

const LABEL_CONFIG: Record<FlashGlowJournalLabel, { title: string; tone: 'positive' | 'neutral' | 'negative'; reflection: string }> = {
  gain: {
    title: 'Gain ressenti',
    tone: 'positive',
    reflection: 'Cette session a apporté une montée d\'énergie palpable. Conservez cette sensation en identifiant ce qui a le plus contribué à votre regain.'
  },
  'léger': {
    title: 'Effet léger',
    tone: 'neutral',
    reflection: 'Les changements subtils s\'accumulent. Notez les signaux, même légers, qui indiquent une évolution positive.'
  },
  incertain: {
    title: 'Incertain',
    tone: 'neutral',
    reflection: 'Chaque session est une exploration. Identifiez ce qui pourrait soutenir davantage votre prochaine immersion.'
  }
};

const DEFAULT_LABEL_INFO = {
  title: 'Exploration',
  tone: 'neutral' as const,
  reflection: 'Prenez un instant pour noter ce que cette session vous inspire, même si les sensations sont diffuses.'
};

const GLOW_TYPE_LABELS: Record<string, string> = {
  energy: 'Énergie',
  calm: 'Calme',
  creativity: 'Créativité',
  confidence: 'Confiance',
  love: 'Amour',
  doux: 'Velours doux',
  standard: 'Velours standard',
  tonique: 'Velours tonique'
};

const formatGlowType = (glowType?: string): string => {
  if (!glowType) return 'Standard';
  const mapped = GLOW_TYPE_LABELS[glowType];
  if (mapped) return mapped;
  const normalized = glowType.replace(/[-_]/g, ' ');
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

/**
 * Crée une entrée de journal automatique pour Flash Glow.
 * Retourne l'entrée enregistrée ou null si la journalisation n'a pas abouti.
 */
export async function createFlashGlowJournalEntry({
  label,
  duration,
  intensity,
  glowType,
  recommendation,
  context
}: CreateFlashGlowJournalEntryParams): Promise<JournalEntry | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  const safeDuration = Math.max(1, Math.round(duration));
  const safeIntensity = Math.max(0, Math.min(100, Math.round(intensity)));
  const labelInfo = label ? LABEL_CONFIG[label] : DEFAULT_LABEL_INFO;
  const friendlyGlowType = formatGlowType(glowType);
  const sectionTitle = context ?? 'Flash Glow';

  const summary = `${sectionTitle} - ${labelInfo.title}`;
  const contentLines = [
    `✨ ${sectionTitle}`,
    `Ressenti : ${labelInfo.title}`,
    `Mode : ${friendlyGlowType}`,
    `Intensité : ${safeIntensity}%`,
    `Durée : ${safeDuration}s`
  ];

  if (recommendation) {
    contentLines.push('', recommendation.trim());
  }

  if (labelInfo.reflection) {
    contentLines.push('', labelInfo.reflection);
  }

  try {
    const entry = await journalService.saveEntry({
      content: contentLines.join('\n'),
      summary,
      tone: labelInfo.tone,
      ephemeral: false,
      duration: safeDuration
    });

    return entry;
  } catch (error) {
    console.error('Flash Glow auto journalisation échouée:', error);
    return null;
  }
}

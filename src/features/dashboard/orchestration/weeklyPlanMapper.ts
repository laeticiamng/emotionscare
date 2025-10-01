// @ts-nocheck
import type { DashboardWellbeingSignal, WellbeingTone } from '@/store/dashboard.store';

const HEADLINES: Record<WellbeingTone, string> = {
  delicate: 'moment plus délicat',
  steady: 'tempo posé',
  energized: 'belle énergie',
};

const QUICK_ACTION_ORDER: Record<'default' | WellbeingTone, string[]> = {
  default: ['scan', 'music', 'journal', 'nyvee', 'breath', 'ambition'],
  delicate: ['breath', 'nyvee', 'journal', 'music', 'scan', 'ambition'],
  steady: ['scan', 'music', 'nyvee', 'journal', 'breath', 'ambition'],
  energized: ['ambition', 'music', 'scan', 'nyvee', 'journal', 'breath'],
};

export const PLAN_DESCRIPTIONS: Record<WellbeingTone, { intro: string; helper: string }> = {
  delicate: {
    intro: 'On ralentit pour prendre soin de vous cette semaine.',
    helper: 'Respiration douce et cocon Nyvée passent en premier.',
  },
  steady: {
    intro: 'Le rythme reste posé et équilibré.',
    helper: 'Les cartes restent en douceur, prêtes si besoin.',
  },
  energized: {
    intro: 'Belle impulsion repérée dans vos réponses.',
    helper: 'Ambition et musique prennent la tête pour nourrir cet élan.',
  },
};

export const NUDGE_TONE_LABELS: Record<WellbeingTone, string> = {
  delicate: 'On va doucement',
  steady: 'Un pas après l’autre',
  energized: 'Envie d’un petit élan ?',
};

export const deriveToneFromLevel = (level: 0 | 1 | 2 | 3 | 4): WellbeingTone => {
  if (level <= 1) {
    return 'delicate';
  }
  if (level === 2) {
    return 'steady';
  }
  return 'energized';
};

export const buildWellbeingSummary = (
  detail: string,
  level: 0 | 1 | 2 | 3 | 4,
  recordedAt: string,
): DashboardWellbeingSignal => {
  const tone = deriveToneFromLevel(level);
  return {
    tone,
    headline: HEADLINES[tone],
    detail,
    recordedAt,
    level,
  };
};

export const orderQuickActions = <T extends { id: string }>(
  actions: T[],
  tone?: WellbeingTone | null,
): T[] => {
  const order = QUICK_ACTION_ORDER[tone ?? 'default'] ?? QUICK_ACTION_ORDER.default;
  const priority = new Map(order.map((id, index) => [id, index]));

  return [...actions].sort((a, b) => {
    const priorityA = priority.has(a.id) ? priority.get(a.id)! : Number.MAX_SAFE_INTEGER;
    const priorityB = priority.has(b.id) ? priority.get(b.id)! : Number.MAX_SAFE_INTEGER;
    return priorityA - priorityB;
  });
};

export const getHeadlineForTone = (tone: WellbeingTone): string => HEADLINES[tone];

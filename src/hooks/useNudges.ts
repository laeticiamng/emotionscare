import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { useDashboardStore, type Nudge } from '@/store/dashboard.store';
import { NUDGE_TONE_LABELS } from '@/features/dashboard/orchestration/weeklyPlanMapper';

type NudgeTone = keyof typeof NUDGE_TONE_LABELS;

const NUDGE_LIBRARY: Record<'default' | NudgeTone, Nudge[]> = {
  default: [
    {
      text: 'Un souffle ensemble ?',
      deeplink: '/app/breath',
      emoji: '🫧',
    },
    {
      text: 'Poser quelques mots dans le journal ?',
      deeplink: '/app/journal',
      emoji: '🖊️',
    },
  ],
  delicate: [
    {
      text: `${NUDGE_TONE_LABELS.delicate} : un temps de respiration guidée ?`,
      deeplink: '/app/breath',
      emoji: '🫧',
    },
    {
      text: `${NUDGE_TONE_LABELS.delicate} : Nyvée est disponible`,
      deeplink: '/app/coach',
      emoji: '🤍',
    },
  ],
  steady: [
    {
      text: `${NUDGE_TONE_LABELS.steady} : écrire un ressenti ?`,
      deeplink: '/app/journal?mode=quick',
      emoji: '📝',
    },
    {
      text: `${NUDGE_TONE_LABELS.steady} : une ambiance sonore feutrée ?`,
      deeplink: '/app/music',
      emoji: '🎧',
    },
  ],
  energized: [
    {
      text: `${NUDGE_TONE_LABELS.energized} Ambition Arcade est prêt`,
      deeplink: '/app/ambition-arcade',
      emoji: '🚀',
    },
    {
      text: `${NUDGE_TONE_LABELS.energized} Partage cette énergie dans le scan`,
      deeplink: '/app/scan',
      emoji: '✨',
    },
  ],
};

export const useNudges = () => {
  const { nudge, loading, setLoading, setNudge, tone } = useDashboardStore(
    (state) => ({
      nudge: state.nudge,
      loading: state.loading.nudge,
      setLoading: state.setLoading,
      setNudge: state.setNudge,
      tone: state.ephemeralSignal?.tone ?? state.wellbeingSummary?.tone ?? null,
    }),
    shallow,
  );

  useEffect(() => {
    let cancelled = false;

    const fetchNudge = async () => {
      try {
        setLoading('nudge', true);
        await new Promise((resolve) => setTimeout(resolve, 200));

        const toneKey: 'default' | NudgeTone = tone ?? 'default';
        const pool = NUDGE_LIBRARY[toneKey];
        const suggestion = pool[Math.floor(Math.random() * pool.length)];

        if (!cancelled) {
          setNudge(suggestion);
        }
      } catch (error) {
        console.error('Failed to fetch nudge:', error);
        if (!cancelled) {
          setNudge(null);
        }
      } finally {
        if (!cancelled) {
          setLoading('nudge', false);
        }
      }
    };

    fetchNudge();

    return () => {
      cancelled = true;
    };
  }, [setLoading, setNudge, tone]);

  return {
    nudge,
    loading,
  };
};
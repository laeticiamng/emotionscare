/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MeditationPage from '../MeditationPage';
import { useMeditationStats, useMeditationHistory, useMeditationWeeklyProgress } from '@/hooks/useMeditationStats';
import { useMeditationSettings } from '@/hooks/useMeditationSettings';

const mockNavigate = vi.fn();
const mockToast = vi.fn();

const mockInsert = vi.fn();
const mockUpdate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

vi.mock('@/hooks/useMeditationStats', () => ({
  useMeditationStats: vi.fn(),
  useMeditationHistory: vi.fn(),
  useMeditationWeeklyProgress: vi.fn(),
}));

vi.mock('@/hooks/useMeditationSettings', () => ({
  useMeditationSettings: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }),
    },
    from: vi.fn(() => ({
      insert: mockInsert,
      update: mockUpdate,
    })),
  },
}));

vi.mock('@/modules/meditation/ui/MeditationCalendar', () => ({
  MeditationCalendar: () => <div data-testid="meditation-calendar" />,
}));

vi.mock('@/modules/meditation/ui/StreakWidget', () => ({
  StreakWidget: ({ compact }: { compact?: boolean }) => (
    <div data-testid={compact ? 'streak-widget-compact' : 'streak-widget'} />
  ),
}));

vi.mock('@/modules/meditation/ui/AmbientSoundMixer', () => ({
  AmbientSoundMixer: () => <div data-testid="ambient-sound-mixer" />,
}));

vi.mock('@/components/meditation/MeditationRecommendationWidget', () => ({
  MeditationRecommendationWidget: () => <div data-testid="meditation-recommendations" />,
}));

vi.mock('@/components/meditation/MeditationExportButton', () => ({
  MeditationExportButton: () => <button type="button">Exporter</button>,
}));

describe('MeditationPage', () => {
  const defaultStats = {
    completed_sessions: 3,
    total_minutes: 120,
    current_streak: 5,
    avg_mood_delta: 2,
    sessions_this_week: 2,
    completion_rate: 80,
    average_duration_minutes: 12,
    longest_session_minutes: 20,
    favorite_technique: 'mindfulness',
    longest_streak: 7,
  };

  const defaultSettings = {
    withGuidance: true,
    withMusic: true,
    hapticFeedback: false,
    reducedAnimations: false,
    weeklyGoalMinutes: 60,
    volume: 50,
    defaultTechnique: 'mindfulness' as const,
    defaultDuration: 10,
    ambientSound: 'ocean' as const,
    reminderEnabled: false,
    reminderTime: '08:00',
  };

  beforeEach(() => {
    vi.mocked(useMeditationStats).mockReturnValue({
      data: defaultStats,
      isLoading: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useMeditationStats>);
    vi.mocked(useMeditationHistory).mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as ReturnType<typeof useMeditationHistory>);
    vi.mocked(useMeditationWeeklyProgress).mockReturnValue({
      data: [
        { day: 'Lun', minutes: 10 },
        { day: 'Mar', minutes: 0 },
      ],
    } as unknown as ReturnType<typeof useMeditationWeeklyProgress>);
    vi.mocked(useMeditationSettings).mockReturnValue({
      settings: defaultSettings,
      isLoaded: true,
      saveSettings: vi.fn(),
      resetSettings: vi.fn(),
    });

    mockInsert.mockReturnValue({
      select: () => ({
        single: () => Promise.resolve({ data: { id: 'session-123' }, error: null }),
      }),
    });
    mockUpdate.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('affiche les techniques et désactive le bouton démarrer tant qu’aucune technique n’est sélectionnée', () => {
    render(<MeditationPage />);

    expect(screen.getByText('Pleine conscience')).toBeInTheDocument();
    const startButton = screen.getByText(/commencer/i).closest('button');
    expect(startButton).toBeTruthy();
    expect(startButton).toBeDisabled();
  });

  it('permet de sélectionner une technique et une durée', () => {
    render(<MeditationPage />);

    fireEvent.click(screen.getByText('Pleine conscience'));
    const startButton = screen.getByText(/commencer/i).closest('button');
    expect(startButton).toBeEnabled();

    const durationBadge = screen.getByText('15 min');
    fireEvent.click(durationBadge);

    expect(startButton).toHaveTextContent('15 min');
  });

  it('démarre une session après confirmation d’humeur', async () => {
    render(<MeditationPage />);

    fireEvent.click(screen.getByText('Pleine conscience'));
    fireEvent.click(screen.getByRole('button', { name: /commencer/i }));

    expect(screen.getByText('Comment vous sentez-vous ?')).toBeInTheDocument();

    fireEvent.click(screen.getByText('😊'));

    await waitFor(() => {
      expect(screen.getByLabelText('Pause')).toBeInTheDocument();
    });

    expect(mockInsert).toHaveBeenCalled();
  });

  it('démarre un intervalle de minuterie pendant la session', async () => {
    const intervalSpy = vi.spyOn(global, 'setInterval');
    render(<MeditationPage />);

    fireEvent.click(screen.getByText('Pleine conscience'));
    const startButton = screen.getByText(/commencer/i).closest('button');
    expect(startButton).toBeTruthy();
    fireEvent.click(startButton as HTMLButtonElement);
    fireEvent.click(screen.getByText('🙂'));

    await waitFor(() => {
      expect(screen.getByLabelText('Pause')).toBeInTheDocument();
    });

    expect(intervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
    intervalSpy.mockRestore();
  });

  it('ouvre le dialog de fin et enregistre la complétion', async () => {
    render(<MeditationPage />);

    fireEvent.click(screen.getByText('Pleine conscience'));
    fireEvent.click(screen.getByRole('button', { name: /commencer/i }));
    fireEvent.click(screen.getByText('🙂'));

    await waitFor(() => {
      expect(screen.getByLabelText('Pause')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Terminer'));

    expect(screen.getByText('Comment vous sentez-vous maintenant ?')).toBeInTheDocument();

    fireEvent.click(screen.getByText('😊'));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
    });
  });
});

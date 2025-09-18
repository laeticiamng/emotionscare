import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  logBreathworkSession,
  BreathworkSessionAuthError,
  BreathworkSessionPersistError,
} from '../breathworkSessions.service';

const supabaseMocks = vi.hoisted(() => ({
  authGetUser: vi.fn(),
  from: vi.fn(),
  insert: vi.fn(),
  select: vi.fn(),
  single: vi.fn(),
}));

const sessionsMocks = vi.hoisted(() => ({
  logSession: vi.fn(),
}));

const SessionsAuthErrorStub = vi.hoisted(
  () => class SessionsAuthErrorStub extends Error {},
);

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: supabaseMocks.authGetUser,
    },
    from: supabaseMocks.from,
  },
}));

vi.mock('../sessions.service', () => ({
  sessionsService: {
    logSession: sessionsMocks.logSession,
  },
  SessionsAuthError: SessionsAuthErrorStub,
}));

const {
  authGetUser: mockGetUser,
  from: mockFrom,
  insert: mockInsert,
  select: mockSelect,
  single: mockSingle,
} = supabaseMocks;

const { logSession: mockLogSession } = sessionsMocks;

describe('breathworkSessions.service', () => {
  beforeEach(() => {
    mockGetUser.mockReset();
    mockFrom.mockReset();
    mockInsert.mockReset();
    mockSelect.mockReset();
    mockSingle.mockReset();
    mockLogSession.mockReset();

    mockFrom.mockImplementation(() => ({ insert: mockInsert }));
    mockInsert.mockImplementation(() => ({ select: mockSelect }));
    mockSelect.mockImplementation(() => ({ single: mockSingle }));
  });

  it('persiste la session respiration et alimente la table unifiée', async () => {
    const now = new Date().toISOString();
    const supabaseRecord = {
      id: 'breath-1',
      user_id: 'user-1',
      technique_type: '4-7-8',
      duration: 313,
      session_data: {
        started_at: now,
        ended_at: now,
        cycles_planned: 6,
        cycles_completed: 6,
        density: 0.92,
        completed: false,
        cadence: 3.19,
        cues: { sound: true, haptics: true },
      },
    } as any;

    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    mockSingle.mockResolvedValue({ data: supabaseRecord, error: null });
    mockLogSession.mockResolvedValue({ id: 'session-1' });

    const result = await logBreathworkSession({
      technique: '4-7-8',
      durationSec: 312.8,
      startedAt: now,
      endedAt: now,
      cyclesPlanned: 6.4,
      cyclesCompleted: 5.6,
      density: 0.917,
      completed: false,
      cadence: 3.193,
      soundCues: true,
      haptics: true,
    });

    expect(mockFrom).toHaveBeenCalledWith('breathwork_sessions');
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        technique_type: '4-7-8',
        duration: 313,
      }),
    );
    expect(mockLogSession).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'breath',
        durationSec: 313,
        userId: 'user-1',
        meta: expect.objectContaining({
          technique: '4-7-8',
          cyclesPlanned: 6,
          cyclesCompleted: 6,
          density: 0.92,
          cadence: 3.19,
          cues: { sound: true, haptics: true },
        }),
      }),
    );
    expect(result).toEqual(supabaseRecord);
  });

  it('signale une authentification manquante', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    await expect(
      logBreathworkSession({
        technique: 'coherence-5-5',
        durationSec: 120,
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        cyclesPlanned: 2,
        cyclesCompleted: 1,
        density: 0.5,
        completed: false,
        cadence: 6,
        soundCues: false,
        haptics: false,
      }),
    ).rejects.toBeInstanceOf(BreathworkSessionAuthError);
  });

  it('propage les erreurs d’insertion Supabase', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    mockSingle.mockResolvedValue({ data: null, error: { message: 'insert failed' } });

    await expect(
      logBreathworkSession({
        technique: 'coherence-5-5',
        durationSec: 60,
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        cyclesPlanned: 4,
        cyclesCompleted: 3,
        density: 0.6,
        completed: true,
        cadence: 6,
        soundCues: false,
        haptics: false,
      }),
    ).rejects.toBeInstanceOf(BreathworkSessionPersistError);
  });

  it('relève les erreurs de logging unifié comme erreurs de persistance', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    mockSingle.mockResolvedValue({
      data: {
        id: 'breath-1',
        user_id: 'user-1',
        technique_type: 'coherence-5-5',
        duration: 600,
        session_data: {},
      },
      error: null,
    });
    mockLogSession.mockRejectedValueOnce(new Error('network down'));

    await expect(
      logBreathworkSession({
        technique: 'coherence-5-5',
        durationSec: 600,
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        cyclesPlanned: 10,
        cyclesCompleted: 10,
        density: 0.8,
        completed: true,
        cadence: 6,
        soundCues: true,
        haptics: true,
      }),
    ).rejects.toBeInstanceOf(BreathworkSessionPersistError);
  });

  it('requalifie les SessionsAuthError en BreathworkSessionAuthError', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    mockSingle.mockResolvedValue({
      data: {
        id: 'breath-2',
        user_id: 'user-1',
        technique_type: 'triangle-4-6-8',
        duration: 420,
        session_data: {},
      },
      error: null,
    });
    mockLogSession.mockRejectedValueOnce(new SessionsAuthErrorStub('missing user'));

    await expect(
      logBreathworkSession({
        technique: 'triangle-4-6-8',
        durationSec: 420,
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        cyclesPlanned: 9,
        cyclesCompleted: 7,
        density: 0.7,
        completed: false,
        cadence: 5,
        soundCues: false,
        haptics: false,
      }),
    ).rejects.toBeInstanceOf(BreathworkSessionAuthError);
  });
});


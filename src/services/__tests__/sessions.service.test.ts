import { describe, it, expect, beforeEach, vi } from 'vitest';
import { sessionsService, SessionsAuthError } from '../sessions.service';

const supabaseMocks = vi.hoisted(() => ({
  authGetUser: vi.fn(),
  from: vi.fn(),
  insert: vi.fn(),
  select: vi.fn(),
  single: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: supabaseMocks.authGetUser,
    },
    from: supabaseMocks.from,
  },
}));

const {
  authGetUser: mockGetUser,
  insert: mockInsert,
  select: mockSelect,
  single: mockSingle,
  from: mockFrom,
} = supabaseMocks;

describe('sessionsService.logSession', () => {
  beforeEach(() => {
    mockGetUser.mockReset();
    mockInsert.mockReset();
    mockSelect.mockReset();
    mockSingle.mockReset();
    mockFrom.mockReset();

    mockSelect.mockImplementation(() => ({ single: mockSingle }));
    mockInsert.mockImplementation(() => ({ select: mockSelect }));
    mockFrom.mockImplementation(() => ({ insert: mockInsert }));
  });

  it('enregistre une session et normalise les données', async () => {
    const expectedRecord = {
      id: 'session-1',
      created_at: new Date().toISOString(),
      type: 'flash_glow',
      duration_sec: 88,
      mood_delta: 32,
      meta: {
        label: 'gain',
        moodBefore: 40,
        moodAfter: 72,
      },
    };

    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    mockSingle.mockResolvedValue({ data: expectedRecord, error: null });

    const result = await sessionsService.logSession({
      type: 'flash_glow',
      durationSec: 87.6,
      moodBefore: 40,
      moodAfter: 71.6,
      meta: { label: 'gain' },
    });

    expect(mockFrom).toHaveBeenCalledWith('sessions');
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
      user_id: 'user-1',
      type: 'flash_glow',
      duration_sec: 88,
      mood_delta: 32,
      meta: expect.objectContaining({
        moodBefore: 40,
        moodAfter: 72,
        label: 'gain',
      }),
    }));
    expect(mockSelect).toHaveBeenCalledWith('id, created_at, type, duration_sec, mood_delta, meta');
    expect(result).toEqual(expectedRecord);
  });

  it('utilise le delta explicite lorsqu’il est fourni', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    mockSingle.mockResolvedValue({
      data: {
        id: 'session-2',
        created_at: new Date().toISOString(),
        type: 'flash_glow_ultra',
        duration_sec: 60,
        mood_delta: 5,
        meta: null,
      },
      error: null,
    });

    await sessionsService.logSession({
      type: 'flash_glow_ultra',
      durationSec: 60,
      moodBefore: 51,
      moodAfter: 55,
      moodDelta: 5.2,
    });

    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
      mood_delta: 5,
    }));
  });

  it('rejette avec SessionsAuthError si aucun utilisateur', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    await expect(() => sessionsService.logSession({
      type: 'flash_glow',
      durationSec: 40,
    })).rejects.toBeInstanceOf(SessionsAuthError);
  });
});

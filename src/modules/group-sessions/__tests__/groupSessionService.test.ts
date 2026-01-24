/**
 * Tests complets pour GroupSessionService
 * Couvre toutes les opérations CRUD, participants, messages et statistiques
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GroupSessionService } from '../services/groupSessionService';

// Mock Supabase
const mockSupabaseResponse = {
  data: null as any,
  error: null as any,
};

const mockSingle = vi.fn(() => Promise.resolve(mockSupabaseResponse));
const mockMaybeSingle = vi.fn(() => Promise.resolve(mockSupabaseResponse));
const mockLimit = vi.fn(() => Promise.resolve(mockSupabaseResponse));
const mockOrder = vi.fn(() => ({ limit: mockLimit }));
const mockGte = vi.fn(() => ({ order: mockOrder, lte: vi.fn(() => Promise.resolve(mockSupabaseResponse)) }));
const mockLte = vi.fn(() => Promise.resolve(mockSupabaseResponse));
const mockIn = vi.fn(() => ({ gte: mockGte, order: mockOrder }));
const mockOr = vi.fn(() => ({ gte: mockGte }));
const mockEq3 = vi.fn(() => Promise.resolve(mockSupabaseResponse));
const mockEq2 = vi.fn(() => ({
  eq: mockEq3,
  maybeSingle: mockMaybeSingle,
  order: mockOrder,
  select: vi.fn(() => ({ single: mockSingle })),
}));
const mockEq = vi.fn(() => ({
  eq: mockEq2,
  single: mockSingle,
  order: mockOrder,
  or: mockOr,
  gte: mockGte,
  lte: mockLte,
  in: mockIn,
}));
const mockSelect = vi.fn(() => ({
  eq: mockEq,
  in: mockIn,
  order: mockOrder,
  single: mockSingle,
}));
const mockInsert = vi.fn(() => ({ select: mockSelect }));
const mockUpdate = vi.fn(() => ({ eq: mockEq }));
const mockDelete = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn(() => ({
  select: mockSelect,
  insert: mockInsert,
  update: mockUpdate,
  delete: mockDelete,
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (...args: any[]) => mockFrom(...args),
  },
}));

describe('GroupSessionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabaseResponse.data = null;
    mockSupabaseResponse.error = null;
  });

  // ============================================================================
  // GET SESSIONS
  // ============================================================================

  describe('getSessions', () => {
    it('should fetch all sessions without filters', async () => {
      const mockSessions = [
        { id: 'session-1', title: 'Méditation matinale', status: 'scheduled' },
        { id: 'session-2', title: 'Yoga du soir', status: 'scheduled' },
      ];

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockSessions, error: null }),
      };
      mockSelect.mockReturnValueOnce(mockQuery);

      const result = await GroupSessionService.getSessions();

      expect(result).toEqual(mockSessions);
      expect(mockFrom).toHaveBeenCalledWith('group_sessions');
    });

    it('should apply category filter', async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
      mockSelect.mockReturnValueOnce(mockQuery);

      await GroupSessionService.getSessions({ category: 'meditation' });

      expect(mockQuery.eq).toHaveBeenCalledWith('category', 'meditation');
    });

    it('should apply status filter', async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
      mockSelect.mockReturnValueOnce(mockQuery);

      await GroupSessionService.getSessions({ status: 'live' });

      expect(mockQuery.eq).toHaveBeenCalledWith('status', 'live');
    });

    it('should apply search filter', async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
      mockSelect.mockReturnValueOnce(mockQuery);

      await GroupSessionService.getSessions({ search: 'yoga' });

      expect(mockQuery.or).toHaveBeenCalledWith(
        'title.ilike.%yoga%,description.ilike.%yoga%'
      );
    });

    it('should apply date range filters', async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
      mockSelect.mockReturnValueOnce(mockQuery);

      await GroupSessionService.getSessions({
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      });

      expect(mockQuery.gte).toHaveBeenCalledWith('scheduled_at', '2024-01-01');
      expect(mockQuery.lte).toHaveBeenCalledWith('scheduled_at', '2024-01-31');
    });

    it('should throw error on database failure', async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
      };
      mockSelect.mockReturnValueOnce(mockQuery);

      await expect(GroupSessionService.getSessions()).rejects.toEqual({ message: 'DB error' });
    });
  });

  // ============================================================================
  // GET UPCOMING SESSIONS
  // ============================================================================

  describe('getUpcomingSessions', () => {
    it('should fetch upcoming sessions with default limit', async () => {
      const mockSessions = [
        { id: 'session-1', status: 'scheduled' },
        { id: 'session-2', status: 'live' },
      ];

      const mockQuery = {
        in: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockSessions, error: null }),
      };
      mockSelect.mockReturnValueOnce(mockQuery);

      const result = await GroupSessionService.getUpcomingSessions();

      expect(result).toEqual(mockSessions);
      expect(mockQuery.in).toHaveBeenCalledWith('status', ['scheduled', 'live']);
      expect(mockQuery.limit).toHaveBeenCalledWith(10);
    });

    it('should accept custom limit', async () => {
      const mockQuery = {
        in: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
      mockSelect.mockReturnValueOnce(mockQuery);

      await GroupSessionService.getUpcomingSessions(5);

      expect(mockQuery.limit).toHaveBeenCalledWith(5);
    });
  });

  // ============================================================================
  // GET LIVE SESSIONS
  // ============================================================================

  describe('getLiveSessions', () => {
    it('should fetch only live sessions', async () => {
      const mockSessions = [
        { id: 'session-1', status: 'live' },
      ];

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockSessions, error: null }),
      };
      mockSelect.mockReturnValueOnce(mockQuery);

      const result = await GroupSessionService.getLiveSessions();

      expect(result).toEqual(mockSessions);
      expect(mockQuery.eq).toHaveBeenCalledWith('status', 'live');
    });
  });

  // ============================================================================
  // GET SESSION BY ID
  // ============================================================================

  describe('getSession', () => {
    it('should fetch a single session by ID', async () => {
      const mockSession = { id: 'session-123', title: 'Test Session' };

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSession, error: null }),
      };
      mockSelect.mockReturnValueOnce(mockQuery);

      const result = await GroupSessionService.getSession('session-123');

      expect(result).toEqual(mockSession);
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'session-123');
    });

    it('should throw error if session not found', async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
      };
      mockSelect.mockReturnValueOnce(mockQuery);

      await expect(GroupSessionService.getSession('invalid-id')).rejects.toEqual({ message: 'Not found' });
    });
  });

  // ============================================================================
  // CREATE SESSION
  // ============================================================================

  describe('createSession', () => {
    it('should create a new session', async () => {
      const input = {
        title: 'Nouvelle session',
        description: 'Description test',
        scheduled_at: '2024-01-20T10:00:00Z',
        duration_minutes: 60,
        max_participants: 20,
        category: 'meditation',
      };

      const mockSession = {
        id: 'new-session-id',
        ...input,
        host_id: 'host-123',
        status: 'scheduled',
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSession, error: null }),
      };
      mockInsert.mockReturnValueOnce(mockQuery);

      const result = await GroupSessionService.createSession(input, 'host-123');

      expect(result).toEqual(mockSession);
    });

    it('should throw error on creation failure', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert failed' } }),
      };
      mockInsert.mockReturnValueOnce(mockQuery);

      await expect(
        GroupSessionService.createSession({ title: 'Test' } as any, 'host-123')
      ).rejects.toEqual({ message: 'Insert failed' });
    });
  });

  // ============================================================================
  // UPDATE SESSION
  // ============================================================================

  describe('updateSession', () => {
    it('should update a session', async () => {
      const updates = { title: 'Titre modifié' };
      const mockSession = { id: 'session-123', ...updates };

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSession, error: null }),
      };
      mockUpdate.mockReturnValueOnce(mockQuery);

      const result = await GroupSessionService.updateSession('session-123', updates);

      expect(result).toEqual(mockSession);
    });
  });

  // ============================================================================
  // DELETE SESSION
  // ============================================================================

  describe('deleteSession', () => {
    it('should delete a session', async () => {
      const mockQuery = {
        eq: vi.fn().mockResolvedValue({ error: null }),
      };
      mockDelete.mockReturnValueOnce(mockQuery);

      await expect(GroupSessionService.deleteSession('session-123')).resolves.toBeUndefined();
    });

    it('should throw error on delete failure', async () => {
      const mockQuery = {
        eq: vi.fn().mockResolvedValue({ error: { message: 'Delete failed' } }),
      };
      mockDelete.mockReturnValueOnce(mockQuery);

      await expect(GroupSessionService.deleteSession('session-123')).rejects.toEqual({ message: 'Delete failed' });
    });
  });

  // ============================================================================
  // REGISTER FOR SESSION
  // ============================================================================

  describe('registerForSession', () => {
    it('should register user for session', async () => {
      const mockParticipant = {
        id: 'participant-1',
        session_id: 'session-123',
        user_id: 'user-123',
        status: 'registered',
        role: 'participant',
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockParticipant, error: null }),
      };
      mockInsert.mockReturnValueOnce(mockQuery);

      const result = await GroupSessionService.registerForSession('session-123', 'user-123');

      expect(result).toEqual(mockParticipant);
      expect(mockFrom).toHaveBeenCalledWith('group_session_participants');
    });

    it('should throw error on duplicate registration', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: 'duplicate key' } }),
      };
      mockInsert.mockReturnValueOnce(mockQuery);

      await expect(
        GroupSessionService.registerForSession('session-123', 'user-123')
      ).rejects.toEqual({ message: 'duplicate key' });
    });
  });

  // ============================================================================
  // UNREGISTER FROM SESSION
  // ============================================================================

  describe('unregisterFromSession', () => {
    it('should unregister user from session', async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
      };
      mockQuery.eq.mockReturnValueOnce(mockQuery);
      mockQuery.eq.mockResolvedValueOnce({ error: null });
      mockDelete.mockReturnValueOnce(mockQuery);

      await expect(
        GroupSessionService.unregisterFromSession('session-123', 'user-123')
      ).resolves.toBeUndefined();
    });
  });

  // ============================================================================
  // JOIN SESSION
  // ============================================================================

  describe('joinSession', () => {
    it('should update participant status to attended', async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
      };
      mockQuery.eq.mockReturnValueOnce(mockQuery);
      mockQuery.eq.mockResolvedValueOnce({ error: null });
      mockUpdate.mockReturnValueOnce(mockQuery);

      await expect(
        GroupSessionService.joinSession('session-123', 'user-123', 7)
      ).resolves.toBeUndefined();
    });

    it('should work without mood', async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
      };
      mockQuery.eq.mockReturnValueOnce(mockQuery);
      mockQuery.eq.mockResolvedValueOnce({ error: null });
      mockUpdate.mockReturnValueOnce(mockQuery);

      await expect(
        GroupSessionService.joinSession('session-123', 'user-123')
      ).resolves.toBeUndefined();
    });
  });

  // ============================================================================
  // LEAVE SESSION
  // ============================================================================

  describe('leaveSession', () => {
    it('should update participant with leave info', async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
      };
      mockQuery.eq.mockReturnValueOnce(mockQuery);
      mockQuery.eq.mockResolvedValueOnce({ error: null });
      mockUpdate.mockReturnValueOnce(mockQuery);

      await expect(
        GroupSessionService.leaveSession('session-123', 'user-123', 8, 'Great session!', 5)
      ).resolves.toBeUndefined();
    });

    it('should work without optional parameters', async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
      };
      mockQuery.eq.mockReturnValueOnce(mockQuery);
      mockQuery.eq.mockResolvedValueOnce({ error: null });
      mockUpdate.mockReturnValueOnce(mockQuery);

      await expect(
        GroupSessionService.leaveSession('session-123', 'user-123')
      ).resolves.toBeUndefined();
    });
  });

  // ============================================================================
  // GET PARTICIPANTS
  // ============================================================================

  describe('getParticipants', () => {
    it('should fetch session participants', async () => {
      const mockParticipants = [
        { id: '1', user_id: 'user-1', status: 'attended' },
        { id: '2', user_id: 'user-2', status: 'registered' },
      ];

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockParticipants, error: null }),
      };
      mockSelect.mockReturnValueOnce(mockQuery);

      const result = await GroupSessionService.getParticipants('session-123');

      expect(result).toEqual(mockParticipants);
    });
  });

  // ============================================================================
  // IS REGISTERED
  // ============================================================================

  describe('isRegistered', () => {
    it('should return true if user is registered', async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'participant-1' }, error: null }),
      };
      mockQuery.eq.mockReturnValue(mockQuery);
      mockSelect.mockReturnValueOnce(mockQuery);

      const result = await GroupSessionService.isRegistered('session-123', 'user-123');

      expect(result).toBe(true);
    });

    it('should return false if user is not registered', async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      };
      mockQuery.eq.mockReturnValue(mockQuery);
      mockSelect.mockReturnValueOnce(mockQuery);

      const result = await GroupSessionService.isRegistered('session-123', 'user-123');

      expect(result).toBe(false);
    });
  });

  // ============================================================================
  // GET USER SESSIONS
  // ============================================================================

  describe('getUserSessions', () => {
    it('should fetch sessions user has participated in', async () => {
      const mockParticipations = [
        { session_id: 'session-1' },
        { session_id: 'session-2' },
      ];
      const mockSessions = [
        { id: 'session-1', title: 'Session 1' },
        { id: 'session-2', title: 'Session 2' },
      ];

      // First call for participations
      const mockParticipantsQuery = {
        eq: vi.fn().mockResolvedValue({ data: mockParticipations, error: null }),
      };
      mockSelect.mockReturnValueOnce(mockParticipantsQuery);

      // Second call for sessions
      const mockSessionsQuery = {
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockSessions, error: null }),
      };
      mockSelect.mockReturnValueOnce(mockSessionsQuery);

      const result = await GroupSessionService.getUserSessions('user-123');

      expect(result).toEqual(mockSessions);
    });

    it('should return empty array if user has no sessions', async () => {
      const mockQuery = {
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
      mockSelect.mockReturnValueOnce(mockQuery);

      const result = await GroupSessionService.getUserSessions('user-123');

      expect(result).toEqual([]);
    });
  });

  // ============================================================================
  // GET CATEGORIES
  // ============================================================================

  describe('getCategories', () => {
    it('should fetch active categories', async () => {
      const mockCategories = [
        { id: '1', name: 'Méditation', is_active: true },
        { id: '2', name: 'Yoga', is_active: true },
      ];

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockCategories, error: null }),
      };
      mockSelect.mockReturnValueOnce(mockQuery);

      const result = await GroupSessionService.getCategories();

      expect(result).toEqual(mockCategories);
      expect(mockQuery.eq).toHaveBeenCalledWith('is_active', true);
    });
  });

  // ============================================================================
  // SEND MESSAGE
  // ============================================================================

  describe('sendMessage', () => {
    it('should send a message', async () => {
      const mockMessage = {
        id: 'msg-1',
        session_id: 'session-123',
        user_id: 'user-123',
        content: 'Bonjour tout le monde!',
        message_type: 'text',
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockMessage, error: null }),
      };
      mockInsert.mockReturnValueOnce(mockQuery);

      const result = await GroupSessionService.sendMessage(
        'session-123',
        'user-123',
        'Bonjour tout le monde!'
      );

      expect(result).toEqual(mockMessage);
    });

    it('should send a reply message', async () => {
      const mockMessage = {
        id: 'msg-2',
        reply_to_id: 'msg-1',
        content: 'Réponse',
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockMessage, error: null }),
      };
      mockInsert.mockReturnValueOnce(mockQuery);

      const result = await GroupSessionService.sendMessage(
        'session-123',
        'user-123',
        'Réponse',
        'msg-1'
      );

      expect(result.reply_to_id).toBe('msg-1');
    });
  });

  // ============================================================================
  // GET MESSAGES
  // ============================================================================

  describe('getMessages', () => {
    it('should fetch messages with default limit', async () => {
      const mockMessages = [
        { id: 'msg-1', content: 'Message 1' },
        { id: 'msg-2', content: 'Message 2' },
      ];

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockMessages, error: null }),
      };
      mockQuery.eq.mockReturnValue(mockQuery);
      mockSelect.mockReturnValueOnce(mockQuery);

      const result = await GroupSessionService.getMessages('session-123');

      expect(result).toEqual(mockMessages);
      expect(mockQuery.limit).toHaveBeenCalledWith(100);
    });

    it('should accept custom limit', async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
      mockQuery.eq.mockReturnValue(mockQuery);
      mockSelect.mockReturnValueOnce(mockQuery);

      await GroupSessionService.getMessages('session-123', 50);

      expect(mockQuery.limit).toHaveBeenCalledWith(50);
    });
  });

  // ============================================================================
  // ADD REACTION
  // ============================================================================

  describe('addReaction', () => {
    it('should add a reaction', async () => {
      mockInsert.mockResolvedValueOnce({ error: null });

      await expect(
        GroupSessionService.addReaction('msg-123', 'user-123', '👍')
      ).resolves.toBeUndefined();
    });

    it('should ignore duplicate reaction error', async () => {
      mockInsert.mockResolvedValueOnce({ error: { message: 'duplicate key value' } });

      await expect(
        GroupSessionService.addReaction('msg-123', 'user-123', '👍')
      ).resolves.toBeUndefined();
    });

    it('should throw error for other failures', async () => {
      mockInsert.mockResolvedValueOnce({ error: { message: 'Permission denied' } });

      await expect(
        GroupSessionService.addReaction('msg-123', 'user-123', '👍')
      ).rejects.toEqual({ message: 'Permission denied' });
    });
  });

  // ============================================================================
  // REMOVE REACTION
  // ============================================================================

  describe('removeReaction', () => {
    it('should remove a reaction', async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
      };
      mockQuery.eq.mockReturnValue(mockQuery);
      mockQuery.eq.mockResolvedValueOnce({ error: null });
      mockDelete.mockReturnValueOnce(mockQuery);

      await expect(
        GroupSessionService.removeReaction('msg-123', 'user-123', '👍')
      ).resolves.toBeUndefined();
    });
  });

  // ============================================================================
  // GET RESOURCES
  // ============================================================================

  describe('getResources', () => {
    it('should fetch session resources', async () => {
      const mockResources = [
        { id: '1', title: 'Document PDF', resource_type: 'pdf' },
        { id: '2', title: 'Lien vidéo', resource_type: 'video' },
      ];

      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockResources, error: null }),
      };
      mockSelect.mockReturnValueOnce(mockQuery);

      const result = await GroupSessionService.getResources('session-123');

      expect(result).toEqual(mockResources);
    });
  });

  // ============================================================================
  // ADD RESOURCE
  // ============================================================================

  describe('addResource', () => {
    it('should add a resource', async () => {
      const mockResource = {
        id: 'resource-1',
        session_id: 'session-123',
        uploaded_by: 'user-123',
        title: 'Guide de méditation',
        resource_type: 'pdf',
        url: 'https://example.com/guide.pdf',
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockResource, error: null }),
      };
      mockInsert.mockReturnValueOnce(mockQuery);

      const result = await GroupSessionService.addResource(
        'session-123',
        'user-123',
        {
          title: 'Guide de méditation',
          resource_type: 'pdf',
          url: 'https://example.com/guide.pdf',
        }
      );

      expect(result).toEqual(mockResource);
    });
  });

  // ============================================================================
  // GET USER STATS
  // ============================================================================

  describe('getUserStats', () => {
    it('should calculate user statistics', async () => {
      const mockParticipations = [
        {
          mood_before: 5,
          mood_after: 8,
          xp_earned: 50,
          group_sessions: { duration_minutes: 60 },
        },
        {
          mood_before: 4,
          mood_after: 7,
          xp_earned: 50,
          group_sessions: { duration_minutes: 45 },
        },
        {
          mood_before: null,
          mood_after: null,
          xp_earned: 30,
          group_sessions: { duration_minutes: 30 },
        },
      ];

      const mockHosted = [{ id: 'session-1' }];

      // Mock Promise.all responses
      mockFrom
        .mockReturnValueOnce({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ data: mockHosted, error: null }),
        });

      // Override the first from call to return participations
      const mockParticipationsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: mockParticipations, error: null }),
      };
      mockParticipationsQuery.eq.mockReturnValue(mockParticipationsQuery);

      mockFrom
        .mockReset()
        .mockReturnValueOnce(mockParticipationsQuery)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ data: mockHosted, error: null }),
        });

      const result = await GroupSessionService.getUserStats('user-123');

      expect(result).toHaveProperty('totalSessions');
      expect(result).toHaveProperty('hostedSessions');
      expect(result).toHaveProperty('totalMinutes');
      expect(result).toHaveProperty('averageMoodImprovement');
      expect(result).toHaveProperty('xpEarned');
    });

    it('should handle user with no sessions', async () => {
      mockFrom
        .mockReset()
        .mockReturnValueOnce({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        });

      const result = await GroupSessionService.getUserStats('user-123');

      expect(result.totalSessions).toBe(0);
      expect(result.hostedSessions).toBe(0);
      expect(result.averageMoodImprovement).toBe(0);
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('edge cases', () => {
    it('should handle null data responses', async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: null }),
      };
      mockSelect.mockReturnValueOnce(mockQuery);

      const result = await GroupSessionService.getLiveSessions();

      expect(result).toEqual([]);
    });

    it('should handle multiple filter combinations', async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
      mockSelect.mockReturnValueOnce(mockQuery);

      await GroupSessionService.getSessions({
        category: 'meditation',
        status: 'scheduled',
        search: 'morning',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        hostId: 'host-123',
      });

      expect(mockQuery.eq).toHaveBeenCalledTimes(3); // category, status, hostId
      expect(mockQuery.or).toHaveBeenCalled();
      expect(mockQuery.gte).toHaveBeenCalled();
      expect(mockQuery.lte).toHaveBeenCalled();
    });
  });
});

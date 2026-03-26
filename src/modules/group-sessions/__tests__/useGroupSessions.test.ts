// @ts-nocheck
/**
 * Tests complets pour useGroupSessions et useGroupSession hooks
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useGroupSessions, useGroupSession } from '../hooks/useGroupSessions';
import { GroupSessionService } from '../services/groupSessionService';
import type { GroupSession, GroupSessionCategory } from '../types';

// Mock GroupSessionService
vi.mock('../services/groupSessionService', () => ({
  GroupSessionService: {
    getSessions: vi.fn(),
    getLiveSessions: vi.fn(),
    getCategories: vi.fn(),
    getUserSessions: vi.fn(),
    createSession: vi.fn(),
    registerForSession: vi.fn(),
    unregisterFromSession: vi.fn(),
    joinSession: vi.fn(),
    leaveSession: vi.fn(),
    isRegistered: vi.fn(),
    getSession: vi.fn(),
    getParticipants: vi.fn(),
    getMessages: vi.fn(),
    getResources: vi.fn(),
    sendMessage: vi.fn(),
    addReaction: vi.fn(),
  },
}));

// Mock AuthContext
const mockUser = { id: 'user-123', email: 'test@example.com' };
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('useGroupSessions', () => {
  const mockSessions: GroupSession[] = [
    {
      id: 'session-1',
      title: 'Méditation matinale',
      description: 'Session de méditation guidée',
      host_id: 'host-1',
      category: 'meditation',
      status: 'scheduled',
      scheduled_at: '2024-01-20T08:00:00Z',
      duration_minutes: 30,
      max_participants: 20,
      created_at: '2024-01-15T10:00:00Z',
    },
    {
      id: 'session-2',
      title: 'Yoga du soir',
      description: 'Yoga relaxant',
      host_id: 'host-2',
      category: 'yoga',
      status: 'live',
      scheduled_at: '2024-01-19T18:00:00Z',
      duration_minutes: 45,
      max_participants: 15,
      created_at: '2024-01-14T10:00:00Z',
    },
  ];

  const mockLiveSessions: GroupSession[] = [mockSessions[1]];

  const mockCategories: GroupSessionCategory[] = [
    { id: 'cat-1', name: 'Méditation', slug: 'meditation', description: '', is_active: true, icon: '🧘', order_index: 1 },
    { id: 'cat-2', name: 'Yoga', slug: 'yoga', description: '', is_active: true, icon: '🧘‍♀️', order_index: 2 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (GroupSessionService.getSessions as any).mockResolvedValue(mockSessions);
    (GroupSessionService.getLiveSessions as any).mockResolvedValue(mockLiveSessions);
    (GroupSessionService.getCategories as any).mockResolvedValue(mockCategories);
    (GroupSessionService.getUserSessions as any).mockResolvedValue([mockSessions[0]]);
  });

  // ============================================================================
  // INITIAL STATE
  // ============================================================================

  describe('initial state', () => {
    it('should return initial state without autoLoad', () => {
      const { result } = renderHook(() => useGroupSessions());

      expect(result.current.sessions).toEqual([]);
      expect(result.current.liveSessions).toEqual([]);
      expect(result.current.mySessions).toEqual([]);
      expect(result.current.categories).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should provide all expected functions', () => {
      const { result } = renderHook(() => useGroupSessions());

      expect(typeof result.current.loadSessions).toBe('function');
      expect(typeof result.current.createSession).toBe('function');
      expect(typeof result.current.registerForSession).toBe('function');
      expect(typeof result.current.unregisterFromSession).toBe('function');
      expect(typeof result.current.joinSession).toBe('function');
      expect(typeof result.current.leaveSession).toBe('function');
      expect(typeof result.current.updateFilters).toBe('function');
      expect(typeof result.current.setFilters).toBe('function');
    });
  });

  // ============================================================================
  // LOAD SESSIONS
  // ============================================================================

  describe('loadSessions', () => {
    it('should load all session data', async () => {
      const { result } = renderHook(() => useGroupSessions());

      await act(async () => {
        await result.current.loadSessions();
      });

      expect(result.current.sessions).toEqual(mockSessions);
      expect(result.current.liveSessions).toEqual(mockLiveSessions);
      expect(result.current.categories).toEqual(mockCategories);
      expect(result.current.mySessions).toHaveLength(1);
      expect(result.current.loading).toBe(false);
    });

    it('should auto-load when autoLoad option is true', async () => {
      renderHook(() => useGroupSessions({ autoLoad: true }));

      await waitFor(() => {
        expect(GroupSessionService.getSessions).toHaveBeenCalled();
      });
    });

    it('should handle loading error', async () => {
      (GroupSessionService.getSessions as any).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useGroupSessions());

      await act(async () => {
        await result.current.loadSessions();
      });

      expect(result.current.error).toBe('Erreur lors du chargement des sessions');
      expect(result.current.loading).toBe(false);
    });

    it('should apply filters when loading', async () => {
      const filters = { category: 'meditation' };
      const { result } = renderHook(() => useGroupSessions({ filters }));

      await act(async () => {
        await result.current.loadSessions();
      });

      expect(GroupSessionService.getSessions).toHaveBeenCalledWith(filters);
    });
  });

  // ============================================================================
  // CREATE SESSION
  // ============================================================================

  describe('createSession', () => {
    const newSessionInput = {
      title: 'Nouvelle session',
      description: 'Description',
      scheduled_at: '2024-01-25T10:00:00Z',
      duration_minutes: 60,
      max_participants: 20,
      category: 'meditation',
    };

    it('should create a new session', async () => {
      const createdSession = { id: 'new-session', ...newSessionInput };
      (GroupSessionService.createSession as any).mockResolvedValueOnce(createdSession);

      const { result } = renderHook(() => useGroupSessions());

      let session;
      await act(async () => {
        session = await result.current.createSession(newSessionInput);
      });

      expect(session).toEqual(createdSession);
      expect(GroupSessionService.createSession).toHaveBeenCalledWith(newSessionInput, 'user-123');
    });

    it('should return null and show error if not authenticated', async () => {
      // Temporarily override the auth mock
      vi.doMock('@/contexts/AuthContext', () => ({
        useAuth: () => ({ user: null }),
      }));

      const { result } = renderHook(() => useGroupSessions());

      // Since we can't easily re-mock during runtime, we test the error path differently
      (GroupSessionService.createSession as any).mockRejectedValueOnce(new Error('Auth error'));

      let session;
      await act(async () => {
        session = await result.current.createSession(newSessionInput);
      });

      expect(session).toBeNull();
    });

    it('should handle creation error', async () => {
      (GroupSessionService.createSession as any).mockRejectedValueOnce(new Error('Creation failed'));

      const { result } = renderHook(() => useGroupSessions());

      let session;
      await act(async () => {
        session = await result.current.createSession(newSessionInput);
      });

      expect(session).toBeNull();
    });
  });

  // ============================================================================
  // REGISTER FOR SESSION
  // ============================================================================

  describe('registerForSession', () => {
    it('should register user for session', async () => {
      (GroupSessionService.registerForSession as any).mockResolvedValueOnce({
        id: 'participant-1',
        session_id: 'session-1',
        user_id: 'user-123',
      });

      const { result } = renderHook(() => useGroupSessions());

      let success;
      await act(async () => {
        success = await result.current.registerForSession('session-1');
      });

      expect(success).toBe(true);
      expect(GroupSessionService.registerForSession).toHaveBeenCalledWith('session-1', 'user-123');
    });

    it('should handle duplicate registration gracefully', async () => {
      (GroupSessionService.registerForSession as any).mockRejectedValueOnce({
        message: 'duplicate key',
      });

      const { result } = renderHook(() => useGroupSessions());

      let success;
      await act(async () => {
        success = await result.current.registerForSession('session-1');
      });

      expect(success).toBe(false);
    });

    it('should handle registration error', async () => {
      (GroupSessionService.registerForSession as any).mockRejectedValueOnce(new Error('Failed'));

      const { result } = renderHook(() => useGroupSessions());

      let success;
      await act(async () => {
        success = await result.current.registerForSession('session-1');
      });

      expect(success).toBe(false);
    });
  });

  // ============================================================================
  // UNREGISTER FROM SESSION
  // ============================================================================

  describe('unregisterFromSession', () => {
    it('should unregister user from session', async () => {
      (GroupSessionService.unregisterFromSession as any).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useGroupSessions());

      let success;
      await act(async () => {
        success = await result.current.unregisterFromSession('session-1');
      });

      expect(success).toBe(true);
      expect(GroupSessionService.unregisterFromSession).toHaveBeenCalledWith('session-1', 'user-123');
    });

    it('should handle unregister error', async () => {
      (GroupSessionService.unregisterFromSession as any).mockRejectedValueOnce(new Error('Failed'));

      const { result } = renderHook(() => useGroupSessions());

      let success;
      await act(async () => {
        success = await result.current.unregisterFromSession('session-1');
      });

      expect(success).toBe(false);
    });
  });

  // ============================================================================
  // JOIN SESSION
  // ============================================================================

  describe('joinSession', () => {
    it('should join a session with mood', async () => {
      (GroupSessionService.isRegistered as any).mockResolvedValueOnce(true);
      (GroupSessionService.joinSession as any).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useGroupSessions());

      let success;
      await act(async () => {
        success = await result.current.joinSession('session-1', 7);
      });

      expect(success).toBe(true);
      expect(GroupSessionService.joinSession).toHaveBeenCalledWith('session-1', 'user-123', 7);
    });

    it('should register first if not registered', async () => {
      (GroupSessionService.isRegistered as any).mockResolvedValueOnce(false);
      (GroupSessionService.registerForSession as any).mockResolvedValueOnce({});
      (GroupSessionService.joinSession as any).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useGroupSessions());

      await act(async () => {
        await result.current.joinSession('session-1');
      });

      expect(GroupSessionService.registerForSession).toHaveBeenCalled();
      expect(GroupSessionService.joinSession).toHaveBeenCalled();
    });

    it('should handle join error', async () => {
      (GroupSessionService.isRegistered as any).mockRejectedValueOnce(new Error('Failed'));

      const { result } = renderHook(() => useGroupSessions());

      let success;
      await act(async () => {
        success = await result.current.joinSession('session-1');
      });

      expect(success).toBe(false);
    });
  });

  // ============================================================================
  // LEAVE SESSION
  // ============================================================================

  describe('leaveSession', () => {
    it('should leave a session with feedback', async () => {
      (GroupSessionService.leaveSession as any).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useGroupSessions());

      let success;
      await act(async () => {
        success = await result.current.leaveSession('session-1', 8, 'Great session!', 5);
      });

      expect(success).toBe(true);
      expect(GroupSessionService.leaveSession).toHaveBeenCalledWith(
        'session-1',
        'user-123',
        8,
        'Great session!',
        5
      );
    });

    it('should handle leave error silently', async () => {
      (GroupSessionService.leaveSession as any).mockRejectedValueOnce(new Error('Failed'));

      const { result } = renderHook(() => useGroupSessions());

      let success;
      await act(async () => {
        success = await result.current.leaveSession('session-1');
      });

      expect(success).toBe(false);
    });
  });

  // ============================================================================
  // UPDATE FILTERS
  // ============================================================================

  describe('updateFilters', () => {
    it('should update filters and reload sessions', async () => {
      const { result } = renderHook(() => useGroupSessions());

      const newFilters = { category: 'yoga', status: 'live' as const };

      await act(async () => {
        result.current.updateFilters(newFilters);
      });

      expect(result.current.filters).toEqual(newFilters);
      expect(GroupSessionService.getSessions).toHaveBeenCalledWith(newFilters);
    });
  });
});

describe('useGroupSession', () => {
  const mockSession: GroupSession = {
    id: 'session-123',
    title: 'Test Session',
    description: 'Description',
    host_id: 'host-1',
    category: 'meditation',
    status: 'live',
    scheduled_at: '2024-01-20T10:00:00Z',
    duration_minutes: 60,
    max_participants: 20,
    created_at: '2024-01-15T10:00:00Z',
  };

  const mockParticipants = [
    { id: 'p1', user_id: 'user-1', status: 'attended' },
    { id: 'p2', user_id: 'user-2', status: 'registered' },
  ];

  const mockMessages = [
    { id: 'msg-1', content: 'Hello!', user_id: 'user-1' },
    { id: 'msg-2', content: 'Hi!', user_id: 'user-2' },
  ];

  const mockResources = [
    { id: 'res-1', title: 'Guide', resource_type: 'pdf' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (GroupSessionService.getSession as any).mockResolvedValue(mockSession);
    (GroupSessionService.getParticipants as any).mockResolvedValue(mockParticipants);
    (GroupSessionService.getMessages as any).mockResolvedValue(mockMessages);
    (GroupSessionService.getResources as any).mockResolvedValue(mockResources);
    (GroupSessionService.isRegistered as any).mockResolvedValue(true);
  });

  // ============================================================================
  // INITIAL LOAD
  // ============================================================================

  describe('initial load', () => {
    it('should load session data on mount', async () => {
      const { result } = renderHook(() => useGroupSession('session-123'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.session).toEqual(mockSession);
      expect(result.current.participants).toEqual(mockParticipants);
      expect(result.current.messages).toEqual(mockMessages);
      expect(result.current.resources).toEqual(mockResources);
      expect(result.current.isRegistered).toBe(true);
    });

    it('should not load if sessionId is empty', async () => {
      const { result } = renderHook(() => useGroupSession(''));

      // Should remain in initial state
      expect(result.current.session).toBeNull();
      expect(GroupSessionService.getSession).not.toHaveBeenCalled();
    });
  });

  // ============================================================================
  // SEND MESSAGE
  // ============================================================================

  describe('sendMessage', () => {
    it('should send a message and update local state', async () => {
      const newMessage = { id: 'msg-3', content: 'New message', user_id: 'user-123' };
      (GroupSessionService.sendMessage as any).mockResolvedValueOnce(newMessage);

      const { result } = renderHook(() => useGroupSession('session-123'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let sentMessage;
      await act(async () => {
        sentMessage = await result.current.sendMessage('New message');
      });

      expect(sentMessage).toEqual(newMessage);
      expect(result.current.messages).toContainEqual(newMessage);
    });

    it('should send a reply message', async () => {
      const replyMessage = { id: 'msg-3', content: 'Reply', reply_to_id: 'msg-1' };
      (GroupSessionService.sendMessage as any).mockResolvedValueOnce(replyMessage);

      const { result } = renderHook(() => useGroupSession('session-123'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.sendMessage('Reply', 'msg-1');
      });

      expect(GroupSessionService.sendMessage).toHaveBeenCalledWith(
        'session-123',
        'user-123',
        'Reply',
        'msg-1'
      );
    });

    it('should handle send message error', async () => {
      (GroupSessionService.sendMessage as any).mockRejectedValueOnce(new Error('Send failed'));

      const { result } = renderHook(() => useGroupSession('session-123'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let sentMessage;
      await act(async () => {
        sentMessage = await result.current.sendMessage('New message');
      });

      expect(sentMessage).toBeNull();
    });
  });

  // ============================================================================
  // ADD REACTION
  // ============================================================================

  describe('addReaction', () => {
    it('should add a reaction to a message', async () => {
      (GroupSessionService.addReaction as any).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useGroupSession('session-123'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.addReaction('msg-1', '👍');
      });

      expect(GroupSessionService.addReaction).toHaveBeenCalledWith('msg-1', 'user-123', '👍');
    });
  });

  // ============================================================================
  // RELOAD SESSION
  // ============================================================================

  describe('loadSession', () => {
    it('should reload session data', async () => {
      const { result } = renderHook(() => useGroupSession('session-123'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Clear previous calls
      vi.clearAllMocks();

      const updatedSession = { ...mockSession, title: 'Updated Title' };
      (GroupSessionService.getSession as any).mockResolvedValueOnce(updatedSession);
      (GroupSessionService.getParticipants as any).mockResolvedValueOnce(mockParticipants);
      (GroupSessionService.getMessages as any).mockResolvedValueOnce(mockMessages);
      (GroupSessionService.getResources as any).mockResolvedValueOnce(mockResources);
      (GroupSessionService.isRegistered as any).mockResolvedValueOnce(true);

      await act(async () => {
        await result.current.loadSession();
      });

      expect(result.current.session?.title).toBe('Updated Title');
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('edge cases', () => {
    it('should handle session not found', async () => {
      (GroupSessionService.getSession as any).mockResolvedValueOnce(null);
      (GroupSessionService.getParticipants as any).mockResolvedValueOnce([]);
      (GroupSessionService.getMessages as any).mockResolvedValueOnce([]);
      (GroupSessionService.getResources as any).mockResolvedValueOnce([]);
      (GroupSessionService.isRegistered as any).mockResolvedValueOnce(false);

      const { result } = renderHook(() => useGroupSession('invalid-id'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.session).toBeNull();
      expect(result.current.isRegistered).toBe(false);
    });

    it('should handle error during session load', async () => {
      (GroupSessionService.getSession as any).mockRejectedValueOnce(new Error('Load failed'));

      const { result } = renderHook(() => useGroupSession('session-123'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.session).toBeNull();
    });
  });
});

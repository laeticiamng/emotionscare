import { describe, it, expect } from 'vitest';
import type {
  GroupSession,
  GroupSessionParticipant,
  GroupSessionMessage,
  GroupSessionReaction,
  GroupSessionResource,
  GroupSessionCategory,
  GroupSessionFilters,
  CreateSessionInput,
} from '../types';

describe('Group Sessions types', () => {
  describe('GroupSession', () => {
    it('validates a scheduled session', () => {
      const session: GroupSession = {
        id: 'session-123',
        title: 'Morning Meditation Group',
        description: 'A peaceful morning meditation for all levels',
        category: 'meditation',
        session_type: 'open',
        host_id: 'host-456',
        max_participants: 20,
        scheduled_at: new Date().toISOString(),
        duration_minutes: 30,
        status: 'scheduled',
        tags: ['meditation', 'morning', 'beginners'],
        is_recurring: true,
        recurrence_rule: 'FREQ=DAILY;BYDAY=MO,WE,FR',
        xp_reward: 50,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      expect(session.session_type).toBe('open');
      expect(session.status).toBe('scheduled');
      expect(session.is_recurring).toBe(true);
      expect(session.tags).toContain('meditation');
    });

    it('validates a live session with participants', () => {
      const session: GroupSession = {
        id: 'session-789',
        title: 'Live Breathwork Session',
        category: 'breathing',
        session_type: 'moderated',
        host_id: 'host-123',
        max_participants: 50,
        scheduled_at: new Date().toISOString(),
        duration_minutes: 45,
        status: 'live',
        tags: ['breathing', 'live'],
        is_recurring: false,
        meeting_url: 'https://meet.example.com/session-789',
        xp_reward: 75,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        host_name: 'Dr. Wellness',
        host_avatar: 'https://example.com/avatar.png',
        participant_count: 35,
        is_registered: true,
      };

      expect(session.status).toBe('live');
      expect(session.meeting_url).toBeDefined();
      expect(session.participant_count).toBe(35);
    });

    it('validates all session types', () => {
      const sessionTypes: GroupSession['session_type'][] = ['open', 'private', 'moderated'];
      expect(sessionTypes).toHaveLength(3);
    });

    it('validates all session statuses', () => {
      const statuses: GroupSession['status'][] = ['scheduled', 'live', 'completed', 'cancelled'];
      expect(statuses).toHaveLength(4);
    });

    it('validates a completed session with recording', () => {
      const session: GroupSession = {
        id: 'session-completed',
        title: 'Completed Yoga Session',
        category: 'yoga',
        session_type: 'open',
        host_id: 'host-456',
        max_participants: 30,
        scheduled_at: new Date(Date.now() - 86400000).toISOString(),
        duration_minutes: 60,
        status: 'completed',
        tags: ['yoga', 'recorded'],
        is_recurring: false,
        recording_url: 'https://recordings.example.com/session-completed',
        xp_reward: 100,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date().toISOString(),
      };

      expect(session.status).toBe('completed');
      expect(session.recording_url).toBeDefined();
    });
  });

  describe('GroupSessionParticipant', () => {
    it('validates participant registration', () => {
      const participant: GroupSessionParticipant = {
        id: 'participant-123',
        session_id: 'session-456',
        user_id: 'user-789',
        status: 'registered',
        role: 'participant',
        xp_earned: 0,
        created_at: new Date().toISOString(),
      };

      expect(participant.status).toBe('registered');
      expect(participant.role).toBe('participant');
      expect(participant.xp_earned).toBe(0);
    });

    it('validates attended participant with mood tracking', () => {
      const participant: GroupSessionParticipant = {
        id: 'participant-456',
        session_id: 'session-789',
        user_id: 'user-123',
        status: 'attended',
        role: 'participant',
        joined_at: new Date().toISOString(),
        left_at: new Date().toISOString(),
        mood_before: 50,
        mood_after: 80,
        feedback: 'Great session, very relaxing!',
        rating: 5,
        xp_earned: 75,
        created_at: new Date().toISOString(),
        user_name: 'John Doe',
        user_avatar: 'https://example.com/john.png',
      };

      expect(participant.status).toBe('attended');
      expect(participant.mood_after).toBeGreaterThan(participant.mood_before!);
      expect(participant.rating).toBe(5);
      expect(participant.xp_earned).toBe(75);
    });

    it('validates all participant statuses', () => {
      const statuses: GroupSessionParticipant['status'][] = ['registered', 'attended', 'absent', 'cancelled'];
      expect(statuses).toHaveLength(4);
    });

    it('validates all participant roles', () => {
      const roles: GroupSessionParticipant['role'][] = ['participant', 'co-host', 'moderator'];
      expect(roles).toHaveLength(3);
    });

    it('validates co-host role', () => {
      const coHost: GroupSessionParticipant = {
        id: 'cohost-123',
        session_id: 'session-456',
        user_id: 'user-cohost',
        status: 'attended',
        role: 'co-host',
        xp_earned: 100,
        created_at: new Date().toISOString(),
      };

      expect(coHost.role).toBe('co-host');
      expect(coHost.xp_earned).toBe(100);
    });
  });

  describe('GroupSessionMessage', () => {
    it('validates a text message', () => {
      const message: GroupSessionMessage = {
        id: 'msg-123',
        session_id: 'session-456',
        user_id: 'user-789',
        content: 'Hello everyone!',
        message_type: 'text',
        is_pinned: false,
        is_hidden: false,
        created_at: new Date().toISOString(),
        user_name: 'Jane Doe',
      };

      expect(message.message_type).toBe('text');
      expect(message.is_pinned).toBe(false);
    });

    it('validates a pinned system message', () => {
      const message: GroupSessionMessage = {
        id: 'msg-system',
        session_id: 'session-456',
        user_id: 'system',
        content: 'Session has started. Welcome!',
        message_type: 'system',
        is_pinned: true,
        is_hidden: false,
        created_at: new Date().toISOString(),
      };

      expect(message.message_type).toBe('system');
      expect(message.is_pinned).toBe(true);
    });

    it('validates all message types', () => {
      const messageTypes: GroupSessionMessage['message_type'][] = ['text', 'system', 'reaction', 'resource'];
      expect(messageTypes).toHaveLength(4);
    });

    it('validates message with reply', () => {
      const reply: GroupSessionMessage = {
        id: 'msg-reply',
        session_id: 'session-456',
        user_id: 'user-123',
        content: 'I agree!',
        message_type: 'text',
        reply_to_id: 'msg-original',
        is_pinned: false,
        is_hidden: false,
        created_at: new Date().toISOString(),
      };

      expect(reply.reply_to_id).toBe('msg-original');
    });
  });

  describe('GroupSessionReaction', () => {
    it('validates a reaction', () => {
      const reaction: GroupSessionReaction = {
        id: 'reaction-123',
        message_id: 'msg-456',
        user_id: 'user-789',
        emoji: '👍',
        created_at: new Date().toISOString(),
      };

      expect(reaction.emoji).toBe('👍');
      expect(reaction.message_id).toBeDefined();
    });
  });

  describe('GroupSessionResource', () => {
    it('validates all resource types', () => {
      const resourceTypes: GroupSessionResource['resource_type'][] = ['link', 'file', 'image', 'video', 'audio'];
      expect(resourceTypes).toHaveLength(5);
    });

    it('validates a resource', () => {
      const resource: GroupSessionResource = {
        id: 'resource-123',
        session_id: 'session-456',
        uploaded_by: 'host-789',
        title: 'Meditation Guide PDF',
        resource_type: 'file',
        url: 'https://storage.example.com/guide.pdf',
        description: 'A comprehensive meditation guide',
        download_count: 25,
        created_at: new Date().toISOString(),
      };

      expect(resource.resource_type).toBe('file');
      expect(resource.download_count).toBe(25);
    });
  });

  describe('GroupSessionCategory', () => {
    it('validates a category', () => {
      const category: GroupSessionCategory = {
        id: 'cat-123',
        name: 'meditation',
        label: 'Meditation',
        description: 'Guided meditation sessions',
        icon: '🧘',
        color: '#7C3AED',
        order_index: 1,
        is_active: true,
      };

      expect(category.is_active).toBe(true);
      expect(category.order_index).toBe(1);
    });
  });

  describe('GroupSessionFilters', () => {
    it('validates filter options', () => {
      const filters: GroupSessionFilters = {
        category: 'meditation',
        status: 'scheduled',
        search: 'morning',
        startDate: new Date().toISOString(),
        hostId: 'host-123',
        isRegistered: true,
      };

      expect(filters.category).toBe('meditation');
      expect(filters.isRegistered).toBe(true);
    });

    it('validates empty filters', () => {
      const filters: GroupSessionFilters = {};
      expect(Object.keys(filters)).toHaveLength(0);
    });
  });

  describe('CreateSessionInput', () => {
    it('validates minimal input', () => {
      const input: CreateSessionInput = {
        title: 'Quick Meditation',
        category: 'meditation',
        session_type: 'open',
        scheduled_at: new Date().toISOString(),
      };

      expect(input.title).toBe('Quick Meditation');
      expect(input.session_type).toBe('open');
    });

    it('validates complete input', () => {
      const input: CreateSessionInput = {
        title: 'Weekly Yoga Class',
        description: 'Join us for a relaxing yoga session',
        category: 'yoga',
        session_type: 'moderated',
        max_participants: 25,
        scheduled_at: new Date().toISOString(),
        duration_minutes: 60,
        tags: ['yoga', 'weekly', 'all-levels'],
        cover_image: 'https://example.com/yoga-cover.jpg',
        is_recurring: true,
        recurrence_rule: 'FREQ=WEEKLY;BYDAY=SA',
      };

      expect(input.is_recurring).toBe(true);
      expect(input.tags).toContain('yoga');
      expect(input.max_participants).toBe(25);
    });
  });
});

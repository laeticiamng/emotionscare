/**
 * Tests pour les types du module Buddies
 */

import { describe, it, expect } from 'vitest';
import {
  BUDDY_INTERESTS,
  BUDDY_GOALS,
  LOOKING_FOR_OPTIONS,
} from '../types';
import type {
  BuddyProfile,
  BuddyMatch,
  BuddyMessage,
  BuddyActivity,
  BuddyRequest,
  BuddySession,
  BuddyStats,
  BuddyFilters,
} from '../types';

describe('Buddies Types', () => {
  describe('BuddyProfile', () => {
    it('should validate complete buddy profile', () => {
      const profile: BuddyProfile = {
        id: 'buddy-123',
        user_id: 'user-456',
        display_name: 'Jean Dupont',
        bio: 'Passionné de méditation et de développement personnel',
        avatar_url: 'https://example.com/avatar.jpg',
        location: 'Paris, France',
        timezone: 'Europe/Paris',
        age_range: '25-35',
        interests: ['Méditation', 'Yoga', 'Lecture'],
        goals: ['Réduire le stress', 'Améliorer le sommeil'],
        availability_status: 'online',
        looking_for: ['support', 'motivation'],
        languages: ['fr', 'en'],
        mood_preference: 'calm',
        experience_level: 'intermediate',
        badges: ['early_adopter', 'helper_10'],
        xp_points: 1500,
        support_score: 4.8,
        response_rate: 95,
        last_active_at: new Date().toISOString(),
        is_verified: true,
        is_premium: false,
        is_visible: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      expect(profile.id).toBeDefined();
      expect(profile.interests).toHaveLength(3);
      expect(profile.availability_status).toBe('online');
      expect(profile.experience_level).toBe('intermediate');
    });

    it('should accept all availability statuses', () => {
      const statuses: BuddyProfile['availability_status'][] = ['online', 'away', 'busy', 'offline'];
      expect(statuses).toHaveLength(4);
    });

    it('should accept all experience levels', () => {
      const levels: BuddyProfile['experience_level'][] = ['beginner', 'intermediate', 'advanced'];
      expect(levels).toHaveLength(3);
    });

    it('should handle minimal profile', () => {
      const minimalProfile: BuddyProfile = {
        id: 'buddy-min',
        user_id: 'user-min',
        interests: [],
        goals: [],
        availability_status: 'offline',
        looking_for: [],
        languages: ['fr'],
        experience_level: 'beginner',
        badges: [],
        xp_points: 0,
        support_score: 0,
        response_rate: 0,
        last_active_at: new Date().toISOString(),
        is_verified: false,
        is_premium: false,
        is_visible: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      expect(minimalProfile.display_name).toBeUndefined();
      expect(minimalProfile.xp_points).toBe(0);
    });
  });

  describe('BuddyMatch', () => {
    it('should validate match structure', () => {
      const match: BuddyMatch = {
        id: 'match-123',
        user_id_1: 'user-1',
        user_id_2: 'user-2',
        compatibility_score: 87.5,
        match_reason: 'Intérêts communs: Méditation, Yoga',
        mutual_interests: ['Méditation', 'Yoga'],
        status: 'accepted',
        initiated_by: 'user-1',
        matched_at: new Date().toISOString(),
        interaction_count: 15,
        created_at: new Date().toISOString(),
      };

      expect(match.compatibility_score).toBeGreaterThan(0);
      expect(match.mutual_interests).toContain('Méditation');
      expect(match.status).toBe('accepted');
    });

    it('should accept all match statuses', () => {
      const statuses: BuddyMatch['status'][] = ['pending', 'accepted', 'declined', 'blocked'];
      expect(statuses).toHaveLength(4);
    });

    it('should handle pending match', () => {
      const pendingMatch: BuddyMatch = {
        id: 'match-pending',
        user_id_1: 'user-a',
        user_id_2: 'user-b',
        compatibility_score: 75,
        mutual_interests: [],
        status: 'pending',
        interaction_count: 0,
        created_at: new Date().toISOString(),
      };

      expect(pendingMatch.matched_at).toBeUndefined();
      expect(pendingMatch.interaction_count).toBe(0);
    });
  });

  describe('BuddyMessage', () => {
    it('should validate message structure', () => {
      const message: BuddyMessage = {
        id: 'msg-123',
        match_id: 'match-456',
        sender_id: 'user-1',
        receiver_id: 'user-2',
        content: 'Salut ! Comment ça va aujourd\'hui ?',
        message_type: 'text',
        is_read: false,
        created_at: new Date().toISOString(),
      };

      expect(message.content).toBeDefined();
      expect(message.message_type).toBe('text');
      expect(message.is_read).toBe(false);
    });

    it('should accept all message types', () => {
      const types: BuddyMessage['message_type'][] = ['text', 'activity_invite', 'system', 'emoji', 'voice'];
      expect(types).toHaveLength(5);
    });

    it('should handle read message', () => {
      const readMessage: BuddyMessage = {
        id: 'msg-read',
        match_id: 'match-456',
        sender_id: 'user-1',
        receiver_id: 'user-2',
        content: 'Message lu',
        message_type: 'text',
        is_read: true,
        read_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      expect(readMessage.is_read).toBe(true);
      expect(readMessage.read_at).toBeDefined();
    });

    it('should handle reply message', () => {
      const reply: BuddyMessage = {
        id: 'msg-reply',
        match_id: 'match-456',
        sender_id: 'user-2',
        receiver_id: 'user-1',
        content: 'Oui bien sûr !',
        message_type: 'text',
        reply_to_id: 'msg-123',
        is_read: false,
        created_at: new Date().toISOString(),
      };

      expect(reply.reply_to_id).toBe('msg-123');
    });
  });

  describe('BuddyActivity', () => {
    it('should validate activity structure', () => {
      const activity: BuddyActivity = {
        id: 'activity-123',
        match_id: 'match-456',
        created_by: 'user-1',
        title: 'Séance de méditation',
        description: 'Méditation guidée de 15 minutes',
        activity_type: 'meditation',
        scheduled_at: new Date(Date.now() + 3600000).toISOString(),
        duration_minutes: 15,
        status: 'planned',
        xp_reward: 50,
        created_at: new Date().toISOString(),
      };

      expect(activity.activity_type).toBe('meditation');
      expect(activity.duration_minutes).toBe(15);
      expect(activity.status).toBe('planned');
    });

    it('should accept all activity types', () => {
      const types: BuddyActivity['activity_type'][] = [
        'meditation', 'exercise', 'reading', 'gaming', 'creative', 'call', 'challenge'
      ];
      expect(types).toHaveLength(7);
    });

    it('should accept all activity statuses', () => {
      const statuses: BuddyActivity['status'][] = ['planned', 'in_progress', 'completed', 'cancelled'];
      expect(statuses).toHaveLength(4);
    });

    it('should handle completed activity with mood tracking', () => {
      const completed: BuddyActivity = {
        id: 'activity-done',
        match_id: 'match-456',
        created_by: 'user-1',
        title: 'Session terminée',
        activity_type: 'meditation',
        duration_minutes: 20,
        status: 'completed',
        xp_reward: 100,
        participants_mood_before: { 'user-1': 5, 'user-2': 4 },
        participants_mood_after: { 'user-1': 8, 'user-2': 7 },
        outcome_notes: 'Très bonne session, nous avons tous les deux ressenti un apaisement.',
        completed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      expect(completed.status).toBe('completed');
      expect(completed.participants_mood_after).toBeDefined();
    });
  });

  describe('BuddyRequest', () => {
    it('should validate request structure', () => {
      const request: BuddyRequest = {
        id: 'request-123',
        from_user_id: 'user-1',
        to_user_id: 'user-2',
        message: 'Salut ! Je cherche un partenaire de méditation.',
        status: 'pending',
        compatibility_score: 82,
        expires_at: new Date(Date.now() + 604800000).toISOString(), // 7 jours
        created_at: new Date().toISOString(),
      };

      expect(request.status).toBe('pending');
      expect(request.compatibility_score).toBeGreaterThan(0);
    });

    it('should accept all request statuses', () => {
      const statuses: BuddyRequest['status'][] = ['pending', 'accepted', 'declined', 'expired'];
      expect(statuses).toHaveLength(4);
    });
  });

  describe('BuddySession', () => {
    it('should validate session structure', () => {
      const session: BuddySession = {
        id: 'session-123',
        match_id: 'match-456',
        session_type: 'voice_call',
        started_by: 'user-1',
        started_at: new Date().toISOString(),
        xp_earned: 25,
        created_at: new Date().toISOString(),
      };

      expect(session.session_type).toBe('voice_call');
      expect(session.xp_earned).toBeGreaterThan(0);
    });

    it('should accept all session types', () => {
      const types: BuddySession['session_type'][] = ['voice_call', 'video_call', 'co_activity', 'focus_session'];
      expect(types).toHaveLength(4);
    });

    it('should handle completed session with rating', () => {
      const completed: BuddySession = {
        id: 'session-done',
        match_id: 'match-456',
        session_type: 'video_call',
        started_by: 'user-1',
        started_at: new Date(Date.now() - 1800000).toISOString(),
        ended_at: new Date().toISOString(),
        duration_seconds: 1800,
        quality_rating: 5,
        notes: 'Excellente conversation !',
        xp_earned: 50,
        created_at: new Date().toISOString(),
      };

      expect(completed.ended_at).toBeDefined();
      expect(completed.quality_rating).toBe(5);
    });
  });

  describe('BuddyStats', () => {
    it('should validate stats structure', () => {
      const stats: BuddyStats = {
        id: 'stats-123',
        user_id: 'user-456',
        total_buddies: 5,
        total_messages_sent: 150,
        total_messages_received: 120,
        total_activities_completed: 25,
        total_sessions: 30,
        total_session_minutes: 450,
        average_response_time_minutes: 15,
        longest_streak_days: 21,
        current_streak_days: 7,
        xp_from_buddies: 2500,
        last_activity_at: new Date().toISOString(),
      };

      expect(stats.total_buddies).toBe(5);
      expect(stats.current_streak_days).toBeLessThanOrEqual(stats.longest_streak_days);
    });

    it('should handle new user stats', () => {
      const newUserStats: BuddyStats = {
        id: 'stats-new',
        user_id: 'user-new',
        total_buddies: 0,
        total_messages_sent: 0,
        total_messages_received: 0,
        total_activities_completed: 0,
        total_sessions: 0,
        total_session_minutes: 0,
        longest_streak_days: 0,
        current_streak_days: 0,
        xp_from_buddies: 0,
      };

      expect(newUserStats.total_buddies).toBe(0);
      expect(newUserStats.last_activity_at).toBeUndefined();
    });
  });

  describe('BuddyFilters', () => {
    it('should accept empty filters', () => {
      const filters: BuddyFilters = {};
      expect(Object.keys(filters)).toHaveLength(0);
    });

    it('should accept all filter options', () => {
      const filters: BuddyFilters = {
        interests: ['Méditation', 'Yoga'],
        goals: ['Réduire le stress'],
        availability: 'online',
        location: 'Paris',
        ageRange: '25-35',
        experienceLevel: 'intermediate',
        search: 'Jean',
      };

      expect(filters.interests).toHaveLength(2);
      expect(filters.search).toBe('Jean');
    });
  });

  describe('Constants', () => {
    it('should have 16 buddy interests', () => {
      expect(BUDDY_INTERESTS).toHaveLength(16);
      expect(BUDDY_INTERESTS).toContain('Méditation');
      expect(BUDDY_INTERESTS).toContain('Yoga');
      expect(BUDDY_INTERESTS).toContain('Sport');
    });

    it('should have 9 buddy goals', () => {
      expect(BUDDY_GOALS).toHaveLength(9);
      expect(BUDDY_GOALS).toContain('Réduire le stress');
      expect(BUDDY_GOALS).toContain('Améliorer le sommeil');
    });

    it('should have 4 looking for options', () => {
      expect(LOOKING_FOR_OPTIONS).toHaveLength(4);
      expect(LOOKING_FOR_OPTIONS.map(o => o.value)).toContain('support');
      expect(LOOKING_FOR_OPTIONS.map(o => o.value)).toContain('motivation');
    });

    it('should have French labels for looking for options', () => {
      LOOKING_FOR_OPTIONS.forEach(option => {
        expect(option.label).toBeDefined();
        expect(option.value).toBeDefined();
      });
    });
  });
});

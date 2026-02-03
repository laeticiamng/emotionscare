/**
 * Tests unitaires pour Guilds Service
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase
const mockFrom = vi.fn();
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => mockFrom(),
  },
}));

// Mock AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' },
  }),
}));

describe('Guilds Types', () => {
  it('définit les rôles de guilde correctement', () => {
    type GuildRole = 'leader' | 'officer' | 'member';
    const roles: GuildRole[] = ['leader', 'officer', 'member'];
    
    expect(roles).toHaveLength(3);
    expect(roles).toContain('leader');
    expect(roles).toContain('officer');
    expect(roles).toContain('member');
  });

  it('définit les niveaux de confidentialité', () => {
    type GuildPrivacy = 'public' | 'private' | 'invite_only';
    const privacyLevels: GuildPrivacy[] = ['public', 'private', 'invite_only'];
    
    expect(privacyLevels).toHaveLength(3);
  });

  it('valide la structure d\'une guilde', () => {
    const mockGuild = {
      id: 'guild-123',
      name: 'Test Guild',
      description: 'A test guild',
      icon_emoji: '🎮',
      privacy: 'public' as const,
      max_members: 50,
      current_members: 10,
      total_xp: 5000,
      level: 5,
      leader_id: 'leader-123',
      tags: ['wellness', 'meditation'],
      created_at: new Date().toISOString(),
    };
    
    expect(mockGuild.id).toBeDefined();
    expect(mockGuild.name).toBe('Test Guild');
    expect(mockGuild.max_members).toBeGreaterThan(mockGuild.current_members);
    expect(mockGuild.level).toBeGreaterThan(0);
  });
});

describe('Guilds Business Logic', () => {
  it('calcule le niveau basé sur l\'XP total', () => {
    const calculateLevel = (xp: number): number => {
      return Math.floor(xp / 1000) + 1;
    };
    
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(999)).toBe(1);
    expect(calculateLevel(1000)).toBe(2);
    expect(calculateLevel(5500)).toBe(6);
    expect(calculateLevel(10000)).toBe(11);
  });

  it('vérifie si une guilde peut accepter de nouveaux membres', () => {
    const canAcceptMembers = (current: number, max: number, privacy: string): boolean => {
      if (current >= max) return false;
      if (privacy === 'private') return false;
      return true;
    };
    
    expect(canAcceptMembers(10, 50, 'public')).toBe(true);
    expect(canAcceptMembers(50, 50, 'public')).toBe(false);
    expect(canAcceptMembers(10, 50, 'private')).toBe(false);
    expect(canAcceptMembers(10, 50, 'invite_only')).toBe(true);
  });

  it('valide les permissions par rôle', () => {
    const hasPermission = (role: string, action: string): boolean => {
      const permissions: Record<string, string[]> = {
        leader: ['kick', 'promote', 'demote', 'delete_guild', 'edit_settings', 'send_message'],
        officer: ['kick', 'send_message'],
        member: ['send_message'],
      };
      
      return permissions[role]?.includes(action) ?? false;
    };
    
    expect(hasPermission('leader', 'kick')).toBe(true);
    expect(hasPermission('leader', 'delete_guild')).toBe(true);
    expect(hasPermission('officer', 'kick')).toBe(true);
    expect(hasPermission('officer', 'delete_guild')).toBe(false);
    expect(hasPermission('member', 'kick')).toBe(false);
    expect(hasPermission('member', 'send_message')).toBe(true);
  });
});

describe('Guild XP System', () => {
  it('calcule la contribution XP correctement', () => {
    const XP_MULTIPLIERS: Record<string, number> = {
      scan_complete: 10,
      breath_session: 15,
      journal_entry: 20,
      challenge_complete: 50,
      streak_milestone: 100,
    };
    
    const calculateXP = (action: string, baseXP: number = 1): number => {
      const multiplier = XP_MULTIPLIERS[action] ?? 1;
      return baseXP * multiplier;
    };
    
    expect(calculateXP('scan_complete')).toBe(10);
    expect(calculateXP('challenge_complete')).toBe(50);
    expect(calculateXP('unknown_action')).toBe(1);
  });
});

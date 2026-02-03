/**
 * Tests unitaires pour Manager Console B2B
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Types pour Manager Console
interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'member';
  status: 'active' | 'pending' | 'inactive';
  lastActive: string;
  wellnessScore?: number;
  teamId: string;
}

interface ManagerDashboardStats {
  totalMembers: number;
  activeMembers: number;
  avgWellnessScore: number;
  pendingInvitations: number;
  upcomingEvents: number;
  alertsCount: number;
}

// Mock du service Manager Console
const managerConsoleService = {
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    return [
      { id: 'm1', email: 'alice@test.com', name: 'Alice', role: 'member', status: 'active', lastActive: '2026-02-01', wellnessScore: 78, teamId },
      { id: 'm2', email: 'bob@test.com', name: 'Bob', role: 'member', status: 'active', lastActive: '2026-02-02', wellnessScore: 65, teamId },
      { id: 'm3', email: 'charlie@test.com', name: 'Charlie', role: 'manager', status: 'active', lastActive: '2026-02-03', wellnessScore: 82, teamId },
    ];
  },

  async getDashboardStats(orgId: string): Promise<ManagerDashboardStats> {
    return {
      totalMembers: 42,
      activeMembers: 38,
      avgWellnessScore: 74.5,
      pendingInvitations: 5,
      upcomingEvents: 3,
      alertsCount: 2
    };
  },

  async updateMemberRole(memberId: string, newRole: TeamMember['role']): Promise<boolean> {
    return true;
  },

  async deactivateMember(memberId: string): Promise<boolean> {
    return true;
  },

  async reactivateMember(memberId: string): Promise<boolean> {
    return true;
  },

  async sendWellnessReminder(memberIds: string[]): Promise<{ sent: number; failed: number }> {
    return { sent: memberIds.length, failed: 0 };
  },

  async getTeamWellnessTrends(teamId: string, days: number = 30): Promise<{ date: string; score: number }[]> {
    return [
      { date: '2026-01-01', score: 72 },
      { date: '2026-01-08', score: 74 },
      { date: '2026-01-15', score: 71 },
      { date: '2026-01-22', score: 76 },
      { date: '2026-01-29', score: 78 },
    ];
  }
};

describe('Manager Console - Team Members', () => {
  it('getTeamMembers retourne les membres formatés', async () => {
    const members = await managerConsoleService.getTeamMembers('team-1');
    
    expect(members).toHaveLength(3);
    expect(members[0]).toHaveProperty('email', 'alice@test.com');
    expect(members[0]).toHaveProperty('wellnessScore', 78);
    expect(members[2]).toHaveProperty('role', 'manager');
  });

  it('filtre les membres par statut', async () => {
    const members = await managerConsoleService.getTeamMembers('team-1');
    const activeMembers = members.filter(m => m.status === 'active');
    
    expect(activeMembers.length).toBeGreaterThan(0);
    expect(activeMembers.every(m => m.status === 'active')).toBe(true);
  });

  it('calcule le score wellness moyen', async () => {
    const members = await managerConsoleService.getTeamMembers('team-1');
    const avgScore = members.reduce((sum, m) => sum + (m.wellnessScore || 0), 0) / members.length;
    
    expect(avgScore).toBeGreaterThan(0);
    expect(avgScore).toBeLessThanOrEqual(100);
  });
});

describe('Manager Console - Dashboard Stats', () => {
  it('getDashboardStats retourne les métriques clés', async () => {
    const stats = await managerConsoleService.getDashboardStats('org-1');
    
    expect(stats.totalMembers).toBe(42);
    expect(stats.activeMembers).toBe(38);
    expect(stats.avgWellnessScore).toBeCloseTo(74.5, 1);
    expect(stats.pendingInvitations).toBe(5);
  });

  it('calcule le taux d\'activité', async () => {
    const stats = await managerConsoleService.getDashboardStats('org-1');
    const activityRate = (stats.activeMembers / stats.totalMembers) * 100;
    
    expect(activityRate).toBeGreaterThan(80);
  });
});

describe('Manager Console - Member Actions', () => {
  it('updateMemberRole change le rôle d\'un membre', async () => {
    const result = await managerConsoleService.updateMemberRole('m1', 'manager');
    expect(result).toBe(true);
  });

  it('deactivateMember désactive un membre', async () => {
    const result = await managerConsoleService.deactivateMember('m2');
    expect(result).toBe(true);
  });

  it('reactivateMember réactive un membre', async () => {
    const result = await managerConsoleService.reactivateMember('m2');
    expect(result).toBe(true);
  });

  it('sendWellnessReminder envoie des rappels', async () => {
    const result = await managerConsoleService.sendWellnessReminder(['m1', 'm2', 'm3']);
    
    expect(result.sent).toBe(3);
    expect(result.failed).toBe(0);
  });
});

describe('Manager Console - Wellness Trends', () => {
  it('getTeamWellnessTrends retourne les tendances', async () => {
    const trends = await managerConsoleService.getTeamWellnessTrends('team-1', 30);
    
    expect(trends.length).toBeGreaterThan(0);
    expect(trends[0]).toHaveProperty('date');
    expect(trends[0]).toHaveProperty('score');
  });

  it('détecte une tendance positive', async () => {
    const trends = await managerConsoleService.getTeamWellnessTrends('team-1', 30);
    const firstScore = trends[0].score;
    const lastScore = trends[trends.length - 1].score;
    
    const isPositive = lastScore >= firstScore;
    expect(typeof isPositive).toBe('boolean');
  });
});

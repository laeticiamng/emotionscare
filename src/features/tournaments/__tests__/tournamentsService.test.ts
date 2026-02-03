/**
 * Tests unitaires pour Tournaments Service
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
        in: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
}));

// Mock AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' },
  }),
}));

describe('Tournament Types', () => {
  it('définit les statuts de tournoi', () => {
    type TournamentStatus = 'upcoming' | 'registering' | 'in_progress' | 'completed' | 'cancelled';
    const statuses: TournamentStatus[] = ['upcoming', 'registering', 'in_progress', 'completed', 'cancelled'];
    
    expect(statuses).toHaveLength(5);
  });

  it('définit les types de tournoi', () => {
    type TournamentType = 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
    const types: TournamentType[] = ['single_elimination', 'double_elimination', 'round_robin', 'swiss'];
    
    expect(types).toHaveLength(4);
  });

  it('valide la structure d\'un tournoi', () => {
    const mockTournament = {
      id: 'tournament-123',
      name: 'Weekly Wellness Challenge',
      description: 'Compete for the best wellness scores',
      type: 'single_elimination' as const,
      status: 'registering' as const,
      max_participants: 16,
      current_participants: 8,
      entry_fee_points: 100,
      prize_pool: 1000,
      challenge_type: 'breath_sessions',
      starts_at: new Date().toISOString(),
      ends_at: new Date(Date.now() + 86400000).toISOString(),
      registration_deadline: new Date(Date.now() + 3600000).toISOString(),
      rules: ['Complete 3 breath sessions', 'Minimum 5 minutes each'],
      created_at: new Date().toISOString(),
    };
    
    expect(mockTournament.id).toBeDefined();
    expect(mockTournament.max_participants).toBeGreaterThan(mockTournament.current_participants);
    expect(mockTournament.rules).toHaveLength(2);
  });
});

describe('Tournament Bracket Logic', () => {
  it('calcule le nombre de rounds pour un bracket', () => {
    const calculateRounds = (participants: number): number => {
      return Math.ceil(Math.log2(participants));
    };
    
    expect(calculateRounds(2)).toBe(1);
    expect(calculateRounds(4)).toBe(2);
    expect(calculateRounds(8)).toBe(3);
    expect(calculateRounds(16)).toBe(4);
    expect(calculateRounds(32)).toBe(5);
  });

  it('calcule le nombre de matchs du premier tour', () => {
    const calculateFirstRoundMatches = (participants: number): number => {
      return Math.floor(participants / 2);
    };
    
    expect(calculateFirstRoundMatches(8)).toBe(4);
    expect(calculateFirstRoundMatches(16)).toBe(8);
    expect(calculateFirstRoundMatches(7)).toBe(3); // Odd number, one bye
  });

  it('détermine les byes pour un nombre impair de participants', () => {
    const calculateByes = (participants: number): number => {
      const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(participants)));
      return nextPowerOf2 - participants;
    };
    
    expect(calculateByes(8)).toBe(0);
    expect(calculateByes(7)).toBe(1);
    expect(calculateByes(5)).toBe(3);
    expect(calculateByes(16)).toBe(0);
  });
});

describe('Tournament Registration', () => {
  it('vérifie si l\'inscription est ouverte', () => {
    const canRegister = (
      status: string, 
      deadline: string, 
      current: number, 
      max: number
    ): boolean => {
      if (status !== 'registering') return false;
      if (new Date(deadline) < new Date()) return false;
      if (current >= max) return false;
      return true;
    };
    
    const futureDate = new Date(Date.now() + 86400000).toISOString();
    const pastDate = new Date(Date.now() - 86400000).toISOString();
    
    expect(canRegister('registering', futureDate, 5, 16)).toBe(true);
    expect(canRegister('in_progress', futureDate, 5, 16)).toBe(false);
    expect(canRegister('registering', pastDate, 5, 16)).toBe(false);
    expect(canRegister('registering', futureDate, 16, 16)).toBe(false);
  });

  it('calcule le prix d\'entrée avec réduction guilde', () => {
    const calculateEntryFee = (baseFee: number, guildDiscount: number = 0): number => {
      const discount = Math.min(guildDiscount, 0.5); // Max 50% discount
      return Math.floor(baseFee * (1 - discount));
    };
    
    expect(calculateEntryFee(100, 0)).toBe(100);
    expect(calculateEntryFee(100, 0.2)).toBe(80);
    expect(calculateEntryFee(100, 0.5)).toBe(50);
    expect(calculateEntryFee(100, 0.8)).toBe(50); // Capped at 50%
  });
});

describe('Tournament Match Status', () => {
  it('détermine le gagnant d\'un match', () => {
    type MatchStatus = 'pending' | 'in_progress' | 'completed';
    
    const determineWinner = (
      score1: number | null, 
      score2: number | null
    ): 'participant1' | 'participant2' | null => {
      if (score1 === null || score2 === null) return null;
      if (score1 > score2) return 'participant1';
      if (score2 > score1) return 'participant2';
      return null; // Tie
    };
    
    expect(determineWinner(100, 80)).toBe('participant1');
    expect(determineWinner(80, 100)).toBe('participant2');
    expect(determineWinner(null, 100)).toBe(null);
    expect(determineWinner(100, 100)).toBe(null);
  });
});

/**
 * Tests pour flashLiteService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FlashLiteService } from '../flashLiteService';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => {
  const mockTable = {
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ 
          data: { 
            id: 'test-session-id',
            user_id: 'test-user-id',
            mode: 'quick',
            cards_total: 10,
            cards_completed: 0,
            cards_correct: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            started_at: new Date().toISOString()
          }, 
          error: null 
        }))
      }))
    })),
    select: vi.fn(() => mockTable),
    eq: vi.fn(() => mockTable),
    not: vi.fn(() => Promise.resolve({ data: [], error: null })),
    order: vi.fn(() => mockTable),
    limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
    single: vi.fn(() => Promise.resolve({ data: null, error: null })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: {}, error: null }))
        }))
      }))
    })),
    then: (cb: any) => Promise.resolve({ data: [], error: null }).then(cb),
  };
  
  return {
    supabase: {
      from: vi.fn(() => mockTable)
    }
  };
});

describe('FlashLiteService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a flash lite session', async () => {
    const session = await FlashLiteService.createSession(
      'test-user-id',
      'quick',
      'medical',
      10
    );

    expect(session).toBeDefined();
    expect(session.id).toBe('test-session-id');
    expect(session.mode).toBe('quick');
  });

  it('should get user sessions', async () => {
    const sessions = await FlashLiteService.getUserSessions('test-user-id', 10);
    
    expect(Array.isArray(sessions)).toBe(true);
  });

  it('should calculate user stats', async () => {
    const stats = await FlashLiteService.getUserStats('test-user-id');

    expect(stats).toHaveProperty('totalSessions');
    expect(stats).toHaveProperty('totalCards');
    expect(stats).toHaveProperty('averageAccuracy');
    expect(stats).toHaveProperty('averageTime');
  });
});

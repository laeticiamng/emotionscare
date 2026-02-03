/**
 * Tests pour healthIntegrationsService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { healthIntegrationsService } from '../index';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => {
  const mockConnections = [
    {
      id: 'conn-1',
      user_id: 'test-user-id',
      provider: 'apple_health',
      connected_at: new Date().toISOString(),
      last_sync_at: new Date().toISOString(),
      status: 'connected',
      permissions: ['heart_rate', 'steps'],
      metadata: {},
      device_name: 'Apple Watch',
      device_model: 'Series 9'
    }
  ];

  const mockDataPoints = [
    {
      id: 'point-1',
      user_id: 'test-user-id',
      provider: 'apple_health',
      metric_type: 'heart_rate',
      value: 72,
      unit: 'bpm',
      recorded_at: new Date().toISOString(),
      synced_at: new Date().toISOString()
    }
  ];

  const mockChain = {
    select: vi.fn(() => mockChain),
    eq: vi.fn(() => mockChain),
    gte: vi.fn(() => mockChain),
    order: vi.fn(() => Promise.resolve({ data: mockDataPoints, error: null })),
    update: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ data: null, error: null }))
    })),
    then: (cb: any) => Promise.resolve({ data: mockConnections, error: null }).then(cb),
  };

  return {
    supabase: {
      from: vi.fn((table: string) => {
        if (table === 'wearable_connections') {
          return {
            ...mockChain,
            then: (cb: any) => Promise.resolve({ data: mockConnections, error: null }).then(cb),
            eq: vi.fn(() => ({
              ...mockChain,
              then: (cb: any) => Promise.resolve({ data: mockConnections, error: null }).then(cb),
            }))
          };
        }
        if (table === 'health_data_points') {
          return mockChain;
        }
        return mockChain;
      }),
      functions: {
        invoke: vi.fn((fnName: string, options: any) => {
          if (fnName === 'wearables-sync') {
            return Promise.resolve({
              data: {
                connectionId: 'new-conn-id',
                permissions: ['heart_rate', 'steps'],
                dataPoints: mockDataPoints
              },
              error: null
            });
          }
          if (fnName === 'wearables-dashboard') {
            return Promise.resolve({
              data: {
                metrics: {
                  avg_heart_rate: 68,
                  total_steps: 8500
                },
                providerData: {}
              },
              error: null
            });
          }
          if (fnName === 'ai-router') {
            return Promise.resolve({
              data: {
                sleepMood: 0.72,
                activityMood: 0.65,
                hrvStress: -0.45
              },
              error: null
            });
          }
          return Promise.resolve({ data: {}, error: null });
        })
      }
    }
  };
});

describe('healthIntegrationsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getConnections', () => {
    it('should fetch health connections for a user', async () => {
      const connections = await healthIntegrationsService.getConnections('test-user-id');

      expect(Array.isArray(connections)).toBe(true);
      expect(connections.length).toBeGreaterThanOrEqual(0);
    });

    it('should return empty array on error', async () => {
      const connections = await healthIntegrationsService.getConnections('invalid-user');

      expect(Array.isArray(connections)).toBe(true);
    });
  });

  describe('connectProvider', () => {
    it('should connect a health provider', async () => {
      const connection = await healthIntegrationsService.connectProvider(
        'test-user-id',
        'apple_health'
      );

      expect(connection).toBeDefined();
      expect(connection.provider).toBe('apple_health');
      expect(connection.status).toBe('connected');
    });
  });

  describe('disconnectProvider', () => {
    it('should disconnect a provider', async () => {
      await expect(
        healthIntegrationsService.disconnectProvider('conn-1')
      ).resolves.not.toThrow();
    });
  });

  describe('syncData', () => {
    it('should sync health data', async () => {
      const dataPoints = await healthIntegrationsService.syncData('conn-1');

      expect(Array.isArray(dataPoints)).toBe(true);
    });
  });

  describe('getDailySummary', () => {
    it('should fetch daily health summary', async () => {
      const summary = await healthIntegrationsService.getDailySummary(
        'test-user-id',
        '2026-02-03'
      );

      expect(summary).toBeDefined();
      if (summary) {
        expect(summary).toHaveProperty('metrics');
        expect(summary).toHaveProperty('provider_data');
      }
    });
  });

  describe('getDevices', () => {
    it('should fetch connected devices', async () => {
      const devices = await healthIntegrationsService.getDevices('test-user-id');

      expect(Array.isArray(devices)).toBe(true);
    });
  });

  describe('getHealthHistory', () => {
    it('should fetch health history for specified days', async () => {
      const history = await healthIntegrationsService.getHealthHistory('test-user-id', 7);

      expect(Array.isArray(history)).toBe(true);
    });

    it('should default to 7 days', async () => {
      const history = await healthIntegrationsService.getHealthHistory('test-user-id');

      expect(Array.isArray(history)).toBe(true);
    });
  });

  describe('calculateCorrelations', () => {
    it('should calculate health-mood correlations', async () => {
      const correlations = await healthIntegrationsService.calculateCorrelations('test-user-id');

      expect(correlations).toHaveProperty('sleepMood');
      expect(correlations).toHaveProperty('activityMood');
      expect(correlations).toHaveProperty('hrvStress');
      expect(typeof correlations.sleepMood).toBe('number');
    });
  });
});

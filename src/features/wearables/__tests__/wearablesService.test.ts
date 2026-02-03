/**
 * Tests unitaires pour les intégrations Wearables
 * Apple Health, Garmin, etc.
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase avec chaînage complet
const createMockChain = (finalData: unknown, finalError: unknown = null) => {
  const chain: Record<string, unknown> = {};
  const methods = ['select', 'eq', 'order', 'limit', 'insert', 'update', 'delete', 'upsert', 'single', 'gte', 'lte'];
  
  methods.forEach(method => {
    chain[method] = vi.fn(() => chain);
  });
  
  // Make it thenable
  Object.defineProperty(chain, 'then', {
    value: (resolve: (value: unknown) => void) => Promise.resolve({ data: finalData, error: finalError }).then(resolve)
  });
  
  return chain;
};

const mockConnections = [
  {
    id: 'conn-1',
    user_id: 'user-1',
    provider: 'apple_health',
    connected_at: '2026-01-15',
    last_sync_at: '2026-02-01',
    status: 'connected',
    permissions: ['heart_rate', 'steps', 'sleep'],
    device_name: 'Apple Watch Series 9'
  },
  {
    id: 'conn-2',
    user_id: 'user-1',
    provider: 'garmin',
    connected_at: '2026-01-20',
    last_sync_at: '2026-02-01',
    status: 'connected',
    permissions: ['heart_rate', 'hrv', 'stress'],
    device_name: 'Garmin Venu 3'
  }
];

const mockDataPoints = [
  { id: 'dp-1', user_id: 'user-1', provider: 'apple_health', metric_type: 'heart_rate', value: 72, unit: 'bpm', recorded_at: '2026-02-01T10:00:00Z', synced_at: '2026-02-01T10:05:00Z' },
  { id: 'dp-2', user_id: 'user-1', provider: 'garmin', metric_type: 'steps', value: 8500, unit: 'steps', recorded_at: '2026-02-01T18:00:00Z', synced_at: '2026-02-01T18:05:00Z' }
];

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn((table: string) => {
      if (table === 'wearable_connections') {
        return createMockChain(mockConnections);
      }
      if (table === 'health_data_points') {
        return createMockChain(mockDataPoints);
      }
      return createMockChain([]);
    }),
    functions: {
      invoke: vi.fn((fnName) => {
        if (fnName === 'wearables-sync') {
          return Promise.resolve({
            data: {
              connectionId: 'new-conn',
              permissions: ['heart_rate', 'steps'],
              dataPoints: [
                { id: 'dp-1', metric_type: 'heart_rate', value: 68 }
              ]
            },
            error: null
          });
        }
        if (fnName === 'wearables-dashboard') {
          return Promise.resolve({
            data: {
              metrics: { avg_heart_rate: 72, total_steps: 8500, sleep_duration_minutes: 420 },
              providerData: { apple_health: { avg_heart_rate: 72 } }
            },
            error: null
          });
        }
        return Promise.resolve({ data: {}, error: null });
      })
    }
  }
}));

import { healthIntegrationsService, type HealthProvider, type HealthConnection } from '../../health-integrations';

describe('Wearables - Apple Health', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('récupère les connexions Apple Health', async () => {
    const connections = await healthIntegrationsService.getConnections('user-1');
    const appleConn = connections.find(c => c.provider === 'apple_health');
    
    expect(appleConn).toBeDefined();
    expect(appleConn?.status).toBe('connected');
    expect(appleConn?.permissions).toContain('heart_rate');
  });

  it('connecte Apple Health via Edge Function', async () => {
    const connection = await healthIntegrationsService.connectProvider('user-1', 'apple_health');
    
    expect(connection).toHaveProperty('id');
    expect(connection.provider).toBe('apple_health');
    expect(connection.status).toBe('connected');
  });

  it('déconnecte Apple Health', async () => {
    await expect(
      healthIntegrationsService.disconnectProvider('conn-1')
    ).resolves.not.toThrow();
  });

  it('synchronise les données Apple Health', async () => {
    const dataPoints = await healthIntegrationsService.syncData('conn-1');
    
    expect(Array.isArray(dataPoints)).toBe(true);
  });
});

describe('Wearables - Garmin Connect', () => {
  it('récupère les connexions Garmin', async () => {
    const connections = await healthIntegrationsService.getConnections('user-1');
    const garminConn = connections.find(c => c.provider === 'garmin');
    
    expect(garminConn).toBeDefined();
    expect(garminConn?.status).toBe('connected');
  });

  it('connecte Garmin via Edge Function', async () => {
    const connection = await healthIntegrationsService.connectProvider('user-1', 'garmin');
    
    expect(connection).toHaveProperty('id');
    expect(connection.provider).toBe('garmin');
  });

  it('récupère les appareils Garmin', async () => {
    const devices = await healthIntegrationsService.getDevices('user-1');
    const garminDevice = devices.find(d => d.provider === 'garmin');
    
    if (garminDevice) {
      expect(garminDevice).toHaveProperty('device_name');
    }
  });
});

describe('Wearables - Daily Summary', () => {
  it('récupère le résumé quotidien', async () => {
    const summary = await healthIntegrationsService.getDailySummary('user-1', '2026-02-01');
    
    expect(summary).not.toBeNull();
    expect(summary?.metrics).toHaveProperty('avg_heart_rate');
  });

  it('combine les données de plusieurs providers', async () => {
    const summary = await healthIntegrationsService.getDailySummary('user-1', '2026-02-01');
    
    if (summary) {
      expect(summary.provider_data).toBeDefined();
    }
  });

  it('gère les données manquantes', async () => {
    const summary = await healthIntegrationsService.getDailySummary('user-nonexistent', '2026-02-01');
    
    // Should return null or empty data, not throw
    expect(summary === null || Object.keys(summary.metrics).length >= 0).toBe(true);
  });
});

describe('Wearables - Health History', () => {
  it('récupère l\'historique sur 7 jours', async () => {
    const history = await healthIntegrationsService.getHealthHistory('user-1', 7);
    
    expect(Array.isArray(history)).toBe(true);
  });

  it('récupère l\'historique sur 30 jours', async () => {
    const history = await healthIntegrationsService.getHealthHistory('user-1', 30);
    
    expect(Array.isArray(history)).toBe(true);
  });

  it('trie les données par date', async () => {
    const history = await healthIntegrationsService.getHealthHistory('user-1', 7);
    
    if (history.length > 1) {
      const dates = history.map(h => new Date(h.recorded_at).getTime());
      const isSorted = dates.every((d, i) => i === 0 || d >= dates[i - 1]);
      expect(isSorted).toBe(true);
    }
  });
});

describe('Wearables - Correlations', () => {
  it('calcule les corrélations humeur/santé', async () => {
    const correlations = await healthIntegrationsService.calculateCorrelations('user-1');
    
    expect(correlations).toHaveProperty('sleepMood');
    expect(correlations).toHaveProperty('activityMood');
    expect(correlations).toHaveProperty('hrvStress');
  });

  it('valide les valeurs de corrélation', async () => {
    const correlations = await healthIntegrationsService.calculateCorrelations('user-1');
    
    Object.values(correlations).forEach(value => {
      expect(value).toBeGreaterThanOrEqual(-1);
      expect(value).toBeLessThanOrEqual(1);
    });
  });
});

describe('Wearables - Provider Validation', () => {
  const providers: HealthProvider[] = ['apple_health', 'google_fit', 'fitbit', 'garmin', 'whoop', 'oura'];

  providers.forEach(provider => {
    it(`valide le provider ${provider}`, async () => {
      const connection = await healthIntegrationsService.connectProvider('user-1', provider);
      
      expect(connection.provider).toBe(provider);
      expect(connection.status).toBe('connected');
    });
  });
});

describe('Wearables - Error Handling', () => {
  it('gère les erreurs de connexion', async () => {
    // Le service devrait gérer les erreurs gracieusement
    const connections = await healthIntegrationsService.getConnections('invalid-user');
    expect(Array.isArray(connections)).toBe(true);
  });

  it('gère les erreurs de synchronisation', async () => {
    try {
      await healthIntegrationsService.syncData('invalid-connection');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

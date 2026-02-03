/**
 * Tests unitaires pour RH Heatmap Service
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn(() => Promise.resolve({
                data: [
                  {
                    team_id: 't1',
                    team_name: 'Tech',
                    alert_type: 'low_score',
                    severity: 'medium',
                    message: 'Score bas',
                    value: 55,
                    threshold: 60,
                    created_at: '2026-02-01'
                  }
                ],
                error: null
              }))
            }))
          }))
        }))
      }))
    })),
    functions: {
      invoke: vi.fn((fnName) => {
        if (fnName === 'b2b-wellness-aggregates') {
          return Promise.resolve({
            data: {
              rows: [
                {
                  teamId: 't1',
                  teamName: 'Tech',
                  cells: [{ period: 'S1', score: 75 }],
                  avgScore: 75,
                  avgParticipation: 82
                }
              ],
              periods: ['S1', 'S2', 'S3', 'S4'],
              orgAvgScore: 74,
              orgAvgParticipation: 80,
              currentScore: 74,
              previousScore: 72,
              trend: 2.7,
              participation: 80,
              activeTeams: 8,
              totalTeams: 10
            },
            error: null
          });
        }
        return Promise.resolve({ data: { downloadUrl: 'https://example.com/export.pdf' }, error: null });
      })
    }
  }
}));

import { rhHeatmapService, type HeatmapFilters, type HeatmapData, type TeamAlert } from '../rhHeatmapService';

describe('RH Heatmap Service - getHeatmapData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('récupère les données heatmap avec filtres par défaut', async () => {
    const data = await rhHeatmapService.getHeatmapData('org-1');
    
    expect(data).toHaveProperty('rows');
    expect(data).toHaveProperty('periods');
    expect(data).toHaveProperty('orgAvgScore');
    expect(data).toHaveProperty('generatedAt');
  });

  it('applique les filtres de date', async () => {
    const filters: HeatmapFilters = {
      startDate: '2026-01-01',
      endDate: '2026-02-01',
      granularity: 'week'
    };
    
    const data = await rhHeatmapService.getHeatmapData('org-1', filters);
    
    expect(data.periods.length).toBeGreaterThan(0);
  });

  it('filtre par équipes spécifiques', async () => {
    const filters: HeatmapFilters = {
      teamIds: ['t1', 't2'],
      minParticipation: 50
    };
    
    const data = await rhHeatmapService.getHeatmapData('org-1', filters);
    
    expect(data.rows).toBeDefined();
  });

  it('calcule les moyennes organisationnelles', async () => {
    const data = await rhHeatmapService.getHeatmapData('org-1');
    
    expect(typeof data.orgAvgScore).toBe('number');
    expect(data.orgAvgScore).toBeGreaterThanOrEqual(0);
    expect(data.orgAvgScore).toBeLessThanOrEqual(100);
  });
});

describe('RH Heatmap Service - getAlerts', () => {
  it('récupère les alertes actives', async () => {
    const alerts = await rhHeatmapService.getAlerts('org-1');
    
    expect(Array.isArray(alerts)).toBe(true);
  });

  it('formate correctement les alertes', async () => {
    const alerts = await rhHeatmapService.getAlerts('org-1');
    
    if (alerts.length > 0) {
      expect(alerts[0]).toHaveProperty('teamId');
      expect(alerts[0]).toHaveProperty('alertType');
      expect(alerts[0]).toHaveProperty('severity');
      expect(alerts[0]).toHaveProperty('message');
    }
  });
});

describe('RH Heatmap Service - Score Helpers', () => {
  it('getScoreColor retourne la bonne couleur pour score élevé', () => {
    const color = rhHeatmapService.getScoreColor(85);
    expect(color).toBe('bg-green-500');
  });

  it('getScoreColor retourne la bonne couleur pour score moyen', () => {
    const color = rhHeatmapService.getScoreColor(65);
    expect(color).toBe('bg-yellow-400');
  });

  it('getScoreColor retourne la bonne couleur pour score bas', () => {
    const color = rhHeatmapService.getScoreColor(45);
    expect(color).toBe('bg-red-500');
  });

  it('calculateAlertLevel détecte les alertes critiques', () => {
    const level = rhHeatmapService.calculateAlertLevel(45, 'down');
    expect(level).toBe('high');
  });

  it('calculateAlertLevel détecte les alertes moyennes', () => {
    const level = rhHeatmapService.calculateAlertLevel(55, 'stable');
    expect(level).toBe('medium');
  });

  it('calculateAlertLevel retourne none pour bon score', () => {
    const level = rhHeatmapService.calculateAlertLevel(80, 'up');
    expect(level).toBe('none');
  });
});

describe('RH Heatmap Service - Export', () => {
  it('exporte en PDF', async () => {
    const result = await rhHeatmapService.exportData('org-1', 'pdf');
    expect(result).toHaveProperty('url');
  });

  it('exporte en CSV', async () => {
    const result = await rhHeatmapService.exportData('org-1', 'csv');
    expect(result).toHaveProperty('url');
  });

  it('exporte en XLSX', async () => {
    const result = await rhHeatmapService.exportData('org-1', 'xlsx');
    expect(result).toHaveProperty('url');
  });
});

describe('RH Heatmap Service - Global Stats', () => {
  it('récupère les statistiques globales', async () => {
    const stats = await rhHeatmapService.getGlobalStats('org-1');
    
    expect(stats).toHaveProperty('currentScore');
    expect(stats).toHaveProperty('previousScore');
    expect(stats).toHaveProperty('trend');
    expect(stats).toHaveProperty('participation');
    expect(stats).toHaveProperty('activeTeams');
    expect(stats).toHaveProperty('totalTeams');
  });

  it('calcule le trend correctement', async () => {
    const stats = await rhHeatmapService.getGlobalStats('org-1');
    
    const expectedTrend = stats.currentScore - stats.previousScore;
    expect(Math.abs(stats.trend - expectedTrend)).toBeLessThan(5);
  });

  it('valide les valeurs de participation', async () => {
    const stats = await rhHeatmapService.getGlobalStats('org-1');
    
    expect(stats.participation).toBeGreaterThanOrEqual(0);
    expect(stats.participation).toBeLessThanOrEqual(100);
    expect(stats.activeTeams).toBeLessThanOrEqual(stats.totalTeams);
  });
});

describe('RH Heatmap - Data Validation', () => {
  it('valide la structure des données heatmap', async () => {
    const data = await rhHeatmapService.getHeatmapData('org-1');
    
    data.rows.forEach(row => {
      expect(row).toHaveProperty('teamId');
      expect(row).toHaveProperty('teamName');
      expect(row).toHaveProperty('cells');
      expect(row).toHaveProperty('avgScore');
      expect(Array.isArray(row.cells)).toBe(true);
    });
  });

  it('valide que les scores sont dans la plage 0-100', async () => {
    const data = await rhHeatmapService.getHeatmapData('org-1');
    
    data.rows.forEach(row => {
      expect(row.avgScore).toBeGreaterThanOrEqual(0);
      expect(row.avgScore).toBeLessThanOrEqual(100);
      
      row.cells.forEach(cell => {
        expect(cell.score).toBeGreaterThanOrEqual(0);
        expect(cell.score).toBeLessThanOrEqual(100);
      });
    });
  });

  it('valide le format des périodes', async () => {
    const data = await rhHeatmapService.getHeatmapData('org-1', { granularity: 'week' });
    
    data.periods.forEach(period => {
      expect(typeof period).toBe('string');
      expect(period.length).toBeGreaterThan(0);
    });
  });
});

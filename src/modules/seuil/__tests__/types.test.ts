import { describe, it, expect } from 'vitest';
import type {
  SeuilZone,
  SeuilActionType,
  SeuilEvent,
  SeuilZoneConfig,
  SeuilAction,
  CreateSeuilEventInput,
} from '../types';

describe('Seuil (Threshold) types', () => {
  describe('SeuilZone', () => {
    it('validates all zone types', () => {
      const zones: SeuilZone[] = ['low', 'intermediate', 'critical', 'closure'];
      
      zones.forEach((zone) => {
        expect(['low', 'intermediate', 'critical', 'closure']).toContain(zone);
      });
    });
  });

  describe('SeuilActionType', () => {
    it('validates all action types', () => {
      const actionTypes: SeuilActionType[] = [
        '3min',
        '5min_guided',
        'change_activity',
        'postpone',
        'stop_today',
        'close_day',
      ];

      expect(actionTypes).toHaveLength(6);
      expect(actionTypes).toContain('3min');
      expect(actionTypes).toContain('close_day');
    });
  });

  describe('SeuilEvent', () => {
    it('validates a minimal seuil event', () => {
      const event: SeuilEvent = {
        id: 'event-123',
        userId: 'user-456',
        thresholdLevel: 65,
        zone: 'intermediate',
        sessionCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(event.id).toBeDefined();
      expect(event.thresholdLevel).toBe(65);
      expect(event.zone).toBe('intermediate');
      expect(event.sessionCompleted).toBe(false);
    });

    it('validates a complete seuil event with action', () => {
      const event: SeuilEvent = {
        id: 'event-123',
        userId: 'user-456',
        thresholdLevel: 85,
        zone: 'critical',
        actionTaken: 'User completed 5-minute guided breathing',
        actionType: '5min_guided',
        sessionCompleted: true,
        notes: 'Felt better after the exercise',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(event.actionType).toBe('5min_guided');
      expect(event.sessionCompleted).toBe(true);
      expect(event.notes).toBeDefined();
    });

    it('validates low threshold zone', () => {
      const event: SeuilEvent = {
        id: 'event-low',
        userId: 'user-123',
        thresholdLevel: 25,
        zone: 'low',
        sessionCompleted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(event.zone).toBe('low');
      expect(event.thresholdLevel).toBeLessThan(50);
    });

    it('validates closure zone', () => {
      const event: SeuilEvent = {
        id: 'event-closure',
        userId: 'user-123',
        thresholdLevel: 95,
        zone: 'closure',
        actionType: 'close_day',
        sessionCompleted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(event.zone).toBe('closure');
      expect(event.actionType).toBe('close_day');
    });
  });

  describe('SeuilZoneConfig', () => {
    it('validates zone configuration', () => {
      const lowZoneConfig: SeuilZoneConfig = {
        zone: 'low',
        range: [0, 40],
        message: 'You are doing well',
        subMessage: 'Keep up the good work',
        actions: [
          { id: '3min', label: '3-minute break', icon: '⏰' },
        ],
        ambiance: {
          gradient: 'from-green-400 to-emerald-500',
          iconColor: 'text-green-500',
        },
      };

      expect(lowZoneConfig.range[0]).toBe(0);
      expect(lowZoneConfig.range[1]).toBe(40);
      expect(lowZoneConfig.actions).toHaveLength(1);
      expect(lowZoneConfig.ambiance.gradient).toContain('green');
    });

    it('validates critical zone configuration', () => {
      const criticalConfig: SeuilZoneConfig = {
        zone: 'critical',
        range: [70, 90],
        message: 'Take a break now',
        subMessage: 'Your stress level is high',
        actions: [
          { id: '5min_guided', label: 'Guided breathing', description: '5-minute session', icon: '🧘' },
          { id: 'change_activity', label: 'Change activity', icon: '🔄' },
          { id: 'stop_today', label: 'Stop for today', icon: '🛑' },
        ],
        ambiance: {
          gradient: 'from-orange-400 to-red-500',
          iconColor: 'text-red-500',
        },
      };

      expect(criticalConfig.zone).toBe('critical');
      expect(criticalConfig.actions).toHaveLength(3);
      expect(criticalConfig.actions[0].description).toBeDefined();
    });
  });

  describe('SeuilAction', () => {
    it('validates action structure', () => {
      const action: SeuilAction = {
        id: '3min',
        label: 'Take 3-minute break',
        description: 'A quick breathing exercise',
        icon: '⏰',
      };

      expect(action.id).toBe('3min');
      expect(action.label).toBeDefined();
      expect(action.icon).toBe('⏰');
    });

    it('validates action without optional description', () => {
      const action: SeuilAction = {
        id: 'postpone',
        label: 'Postpone',
        icon: '⏭️',
      };

      expect(action.description).toBeUndefined();
    });
  });

  describe('CreateSeuilEventInput', () => {
    it('validates minimal input', () => {
      const input: CreateSeuilEventInput = {
        thresholdLevel: 55,
        zone: 'intermediate',
      };

      expect(input.thresholdLevel).toBe(55);
      expect(input.zone).toBe('intermediate');
      expect(input.actionType).toBeUndefined();
    });

    it('validates complete input', () => {
      const input: CreateSeuilEventInput = {
        thresholdLevel: 80,
        zone: 'critical',
        actionType: '5min_guided',
        actionTaken: 'Completed guided session',
        notes: 'Helped reduce stress',
      };

      expect(input.actionType).toBe('5min_guided');
      expect(input.notes).toBeDefined();
    });
  });
});

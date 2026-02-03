/**
 * Mood Bus - Tests
 * Tests unitaires pour le système d'événements mood
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { publishMoodUpdated, MOOD_UPDATED, type MoodEventDetail } from '../mood-bus';

describe('Mood Bus', () => {
  const originalDispatchEvent = window.dispatchEvent;
  const mockDispatchEvent = vi.fn();

  beforeEach(() => {
    window.dispatchEvent = mockDispatchEvent;
    mockDispatchEvent.mockClear();
  });

  afterEach(() => {
    window.dispatchEvent = originalDispatchEvent;
  });

  describe('MOOD_UPDATED constant', () => {
    it('has correct event name', () => {
      expect(MOOD_UPDATED).toBe('mood.updated');
    });
  });

  describe('publishMoodUpdated', () => {
    it('dispatches a CustomEvent with correct type', () => {
      const detail: MoodEventDetail = {
        source: 'scan_camera',
        valence: 0.8,
        arousal: 0.6,
        valenceLevel: 4,
        arousalLevel: 3,
        quadrant: 'HVAL_HAROUS',
        summary: 'High energy, positive mood',
        ts: new Date().toISOString(),
      };

      publishMoodUpdated(detail);

      expect(mockDispatchEvent).toHaveBeenCalledTimes(1);
      
      const dispatchedEvent = mockDispatchEvent.mock.calls[0][0] as CustomEvent<MoodEventDetail>;
      expect(dispatchedEvent.type).toBe(MOOD_UPDATED);
    });

    it('includes full detail in the event', () => {
      const detail: MoodEventDetail = {
        source: 'scan_sliders',
        valence: 0.3,
        arousal: 0.2,
        valenceLevel: 1,
        arousalLevel: 1,
        quadrant: 'LVAL_LAROUS',
        summary: 'Low energy, negative mood',
        ts: '2024-01-15T10:30:00.000Z',
      };

      publishMoodUpdated(detail);

      const dispatchedEvent = mockDispatchEvent.mock.calls[0][0] as CustomEvent<MoodEventDetail>;
      expect(dispatchedEvent.detail).toEqual(detail);
    });

    it('handles manual source', () => {
      const detail: MoodEventDetail = {
        source: 'manual',
        valence: 0.5,
        arousal: 0.5,
        valenceLevel: 2,
        arousalLevel: 2,
        quadrant: 'HVAL_LAROUS',
        summary: 'Neutral mood',
        ts: new Date().toISOString(),
      };

      publishMoodUpdated(detail);

      const dispatchedEvent = mockDispatchEvent.mock.calls[0][0] as CustomEvent<MoodEventDetail>;
      expect(dispatchedEvent.detail.source).toBe('manual');
    });

    it('works with all quadrant types', () => {
      const quadrants: MoodEventDetail['quadrant'][] = [
        'HVAL_HAROUS',
        'HVAL_LAROUS',
        'LVAL_HAROUS',
        'LVAL_LAROUS',
      ];

      quadrants.forEach((quadrant) => {
        const detail: MoodEventDetail = {
          source: 'scan_camera',
          valence: 0.5,
          arousal: 0.5,
          valenceLevel: 2,
          arousalLevel: 2,
          quadrant,
          summary: `Quadrant: ${quadrant}`,
          ts: new Date().toISOString(),
        };

        publishMoodUpdated(detail);
      });

      expect(mockDispatchEvent).toHaveBeenCalledTimes(4);
    });

    it('handles extreme valence/arousal values', () => {
      const extremeHighDetail: MoodEventDetail = {
        source: 'scan_camera',
        valence: 1.0,
        arousal: 1.0,
        valenceLevel: 4,
        arousalLevel: 4,
        quadrant: 'HVAL_HAROUS',
        summary: 'Maximum values',
        ts: new Date().toISOString(),
      };

      const extremeLowDetail: MoodEventDetail = {
        source: 'scan_sliders',
        valence: 0.0,
        arousal: 0.0,
        valenceLevel: 0,
        arousalLevel: 0,
        quadrant: 'LVAL_LAROUS',
        summary: 'Minimum values',
        ts: new Date().toISOString(),
      };

      publishMoodUpdated(extremeHighDetail);
      publishMoodUpdated(extremeLowDetail);

      expect(mockDispatchEvent).toHaveBeenCalledTimes(2);
    });
  });
});

describe('MoodEventDetail type', () => {
  it('accepts valid source values', () => {
    const sources: MoodEventDetail['source'][] = ['scan_camera', 'scan_sliders', 'manual'];

    sources.forEach((source) => {
      const detail: MoodEventDetail = {
        source,
        valence: 0.5,
        arousal: 0.5,
        valenceLevel: 2,
        arousalLevel: 2,
        quadrant: 'HVAL_LAROUS',
        summary: 'Test',
        ts: new Date().toISOString(),
      };

      // Type check - this would fail at compile time if invalid
      expect(detail.source).toBe(source);
    });
  });

  it('accepts valid valenceLevel values (0-4)', () => {
    const levels: MoodEventDetail['valenceLevel'][] = [0, 1, 2, 3, 4];

    levels.forEach((level) => {
      const detail: MoodEventDetail = {
        source: 'manual',
        valence: level / 4,
        arousal: 0.5,
        valenceLevel: level,
        arousalLevel: 2,
        quadrant: 'HVAL_LAROUS',
        summary: 'Test',
        ts: new Date().toISOString(),
      };

      expect(detail.valenceLevel).toBe(level);
    });
  });

  it('accepts valid arousalLevel values (0-4)', () => {
    const levels: MoodEventDetail['arousalLevel'][] = [0, 1, 2, 3, 4];

    levels.forEach((level) => {
      const detail: MoodEventDetail = {
        source: 'manual',
        valence: 0.5,
        arousal: level / 4,
        valenceLevel: 2,
        arousalLevel: level,
        quadrant: 'HVAL_LAROUS',
        summary: 'Test',
        ts: new Date().toISOString(),
      };

      expect(detail.arousalLevel).toBe(level);
    });
  });
});

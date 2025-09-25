/**
 * Tests unitaires pour le mapping mood → bucket musical
 */

import { describe, it, expect } from 'vitest';
import { moodToBucket, getBucketDescription, type Mood } from '@/services/music/moodMap';

describe('moodToBucket', () => {
  it('devrait mapper valence/arousal vers le bon bucket', () => {
    // Très calme pour stress/agitation
    expect(moodToBucket({ valence: -0.5, arousal: 0.5 })).toBe('calm/very_low');
    
    // Faible énergie → positif calme
    expect(moodToBucket({ valence: 0, arousal: -0.3 })).toBe('bright/low');
    
    // Haute énergie + positivité → focus
    expect(moodToBucket({ valence: 0.3, arousal: 0.6 })).toBe('focus/medium');
    
    // Positif modéré → bien-être équilibré
    expect(moodToBucket({ valence: 0.5, arousal: 0.2 })).toBe('bright/medium');
    
    // Neutre-négatif → relaxation
    expect(moodToBucket({ valence: -0.1, arousal: 0.3 })).toBe('calm/low');
    
    // Par défaut
    expect(moodToBucket({ valence: 0, arousal: 0 })).toBe('reset');
  });
  
  it('devrait utiliser les sliders si valence/arousal non fournis', () => {
    const moodWithSliders: Mood = {
      sliders: {
        energy: 70, // arousal = 0.4
        calm: 30,
        focus: 60,
        light: 80   // valence = 0.6
      }
    };
    
    // valence = 0.6, arousal = 0.4 → bright/medium
    expect(moodToBucket(moodWithSliders)).toBe('bright/medium');
  });
  
  it('devrait prioritiser valence/arousal sur les sliders', () => {
    const moodMixed: Mood = {
      valence: -0.5,
      arousal: 0.5,
      sliders: {
        energy: 10,
        calm: 90,
        focus: 50,
        light: 10
      }
    };
    
    // Doit utiliser valence/arousal, pas les sliders
    expect(moodToBucket(moodMixed)).toBe('calm/very_low');
  });
  
  it('devrait retourner reset pour des valeurs neutres', () => {
    expect(moodToBucket({})).toBe('reset');
    expect(moodToBucket({ valence: 0.1, arousal: 0.1 })).toBe('reset');
  });
});

describe('getBucketDescription', () => {
  it('devrait retourner des descriptions pour tous les buckets', () => {
    expect(getBucketDescription('calm/very_low')).toContain('Méditation');
    expect(getBucketDescription('calm/low')).toContain('Relaxation');
    expect(getBucketDescription('focus/medium')).toContain('Concentration');
    expect(getBucketDescription('bright/low')).toContain('Douceur');
    expect(getBucketDescription('bright/medium')).toContain('Bien-être');
    expect(getBucketDescription('reset')).toContain('Remise à zéro');
  });
});
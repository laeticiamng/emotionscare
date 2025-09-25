/**
 * Tests unitaires pour l'API de recommandations musicales
 */

import { describe, it, expect, vi } from 'vitest';
import { getRecommendations, getTrackById } from '@/services/music/recoApi';

// Mocker le module moodMap
vi.mock('@/services/music/moodMap', () => ({
  moodToBucket: vi.fn((mood) => {
    if (mood.valence < -0.3 && mood.arousal > 0.3) return 'calm/very_low';
    if (mood.arousal < -0.2) return 'bright/low';
    return 'reset';
  })
}));

describe('getRecommendations', () => {
  it('devrait retourner des pistes basées sur le mood', async () => {
    const mood = { valence: 0, arousal: -0.3 };
    
    const tracks = await getRecommendations(mood);
    
    expect(tracks).toHaveLength(2); // Par défaut limit = 5, mais reset a 2 pistes
    expect(tracks[0]).toHaveProperty('id');
    expect(tracks[0]).toHaveProperty('title');
    expect(tracks[0]).toHaveProperty('url');
    expect(tracks[0]).toHaveProperty('duration_sec');
  });
  
  it('devrait respecter la limite de pistes', async () => {
    const mood = { valence: 0, arousal: 0 };
    
    const tracks = await getRecommendations(mood, { limit: 1 });
    
    expect(tracks).toHaveLength(1);
  });
  
  it('devrait retourner des aperçus en mode preview', async () => {
    const mood = { valence: 0, arousal: 0 };
    
    const tracks = await getRecommendations(mood, { preview: true });
    
    expect(tracks).toHaveLength(1);
    expect(tracks[0].duration_sec).toBe(30);
    expect(tracks[0].id).toContain('preview');
  });
  
  it('devrait simuler un délai réseau', async () => {
    const startTime = Date.now();
    await getRecommendations({ valence: 0, arousal: 0 });
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeGreaterThan(180); // Au moins 200ms simulés
  });
});

describe('getTrackById', () => {
  it('devrait trouver une piste par son ID', async () => {
    const track = await getTrackById('reset:001');
    
    expect(track).not.toBeNull();
    expect(track?.id).toBe('reset:001');
    expect(track?.title).toBe('Page blanche');
  });
  
  it('devrait retourner null pour un ID inexistant', async () => {
    const track = await getTrackById('inexistant:999');
    
    expect(track).toBeNull();
  });
  
  it('devrait chercher dans toutes les catégories', async () => {
    // Test avec différents buckets
    const calmTrack = await getTrackById('calm-very-low:001');
    const focusTrack = await getTrackById('focus-medium:001');
    
    expect(calmTrack?.genre).toBe('Méditation');
    expect(focusTrack?.genre).toBe('Focus');
  });
});
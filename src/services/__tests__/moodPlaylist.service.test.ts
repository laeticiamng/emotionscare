// @ts-nocheck
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { requestMoodPlaylist, type MoodPlaylistRequest } from '../moodPlaylist.service';

declare global {
  let fetch: typeof globalThis.fetch;
}

describe('requestMoodPlaylist', () => {
  const baseRequest: MoodPlaylistRequest = {
    mood: 'focus',
    intensity: 0.734,
    durationMinutes: 37.6,
    preferences: {
      energy: 'high',
      includeInstrumental: true,
      includeVocals: false,
      instrumentation: ['piano', 42 as unknown as string, 'synth']
    },
    context: {
      activity: 'creative',
      timeOfDay: 'morning'
    }
  };

  const buildRawResponse = () => ({
    playlist_id: 'playlist-42',
    mood: 'focus',
    requested_mood: 'focus',
    title: 'Focus Flow',
    description: 'Sélection calibrée pour maintenir la concentration.',
    total_duration: 2260,
    tracks: [
      {
        id: 'track-1',
        title: 'Nebula Drift',
        artist: 'EmotionsCare Lab',
        url: 'https://cdn.example.com/nebula.mp3',
        duration: 220,
        mood: 'focus',
        energy: 0.62,
        focus: 'flow',
        instrumentation: ['piano', 'synth', 12],
        tags: ['deep-work', 99],
        description: 'Guided focus track.'
      },
    ],
    energy_profile: {
      baseline: 0.45,
      requested: 0.7,
      recommended: 0.68,
      alignment: 0.94,
      curve: [
        { track_id: 'track-1', start: 0, end: 220, energy: 0.62, focus: 'flow' },
        { track_id: null, start: 220, end: 440, energy: 0.58 }
      ]
    },
    recommendations: ['Hydrate-toi régulièrement'],
    guidance: {
      focus: 'Organise ton flux en blocs de 45 minutes.',
      breathwork: 'Cohérence cardiaque 365.',
      activities: ['Revue hebdo', 12]
    },
    metadata: {
      curated_by: 'Adaptive Music Squad',
      tags: ['focus', 'adaptive', 42],
      dataset_version: '2025.06'
    }
  });

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('serializes the request and normalizes the playlist payload', async () => {
    const raw = buildRawResponse();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, data: raw })
    });

    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    const result = await requestMoodPlaylist(baseRequest);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0] ?? [];
    expect(init?.method).toBe('POST');
    expect(init?.headers).toEqual({ 'Content-Type': 'application/json' });
    const serialized = JSON.parse(String(init?.body ?? '{}'));
    expect(serialized).toMatchObject({
      mood: 'focus',
      intensity: 0.73,
      duration_minutes: 38,
      preferences: {
        energy: 'high',
        include_instrumental: true,
        include_vocals: false,
        instrumentation: ['piano', 'synth']
      },
      context: {
        activity: 'creative',
        time_of_day: 'morning'
      }
    });

    expect(result.playlistId).toBe('playlist-42');
    expect(result.tracks).toHaveLength(1);
    expect(result.tracks[0]?.tags).toEqual(['deep-work']);
    expect(result.energyProfile.curve).toHaveLength(1);
    expect(result.guidance.activities).toEqual(['Revue hebdo']);
    expect(result.metadata.tags).toEqual(['focus', 'adaptive']);
  });

  it('propagates server error messages when the API fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      statusText: 'Bad Request',
      json: async () => ({ error: { message: 'Quota épuisé' } })
    });

    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    await expect(requestMoodPlaylist(baseRequest)).rejects.toThrow('Quota épuisé');
  });

  it('throws when the response payload is missing the playlist data', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, data: null })
    });

    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    await expect(requestMoodPlaylist(baseRequest)).rejects.toThrow('Impossible de récupérer la playlist adaptive');
  });
});

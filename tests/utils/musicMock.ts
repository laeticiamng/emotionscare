// @ts-nocheck
import { Track } from '@/contexts/music';

export const sampleTrack = (id = '1'): Track => ({
  id,
  url: `/track-${id}.mp3`,
  title: `Track ${id}`,
  artist: 'Mock',
});

export const createPlaylist = (n = 3) =>
  Array.from({ length: n }, (_, i) => sampleTrack(String(i + 1)));

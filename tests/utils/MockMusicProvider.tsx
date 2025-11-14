import React, { ReactNode, useState } from 'react';
import { MusicContext } from '@/contexts/music';
import { vi as vitestVi } from 'vitest';

const spy = typeof vitestVi !== 'undefined' ? vitestVi.fn : (globalThis as any).jest?.fn?.() ?? (() => {});

export const MockMusicProvider = ({ children }: { children: ReactNode }) => {
  const [playing, setPlaying] = useState(false);

  const value = {
    playing,
    volume: 0.5,
    playlist: [],
    play: spy(() => setPlaying(true)),
    pause: spy(() => setPlaying(false)),
    loadPlaylistForEmotion: spy(),
    setVolume: spy(),
    next: spy(),
    prev: spy(),
  } as any;

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

import React from 'react';
import { render, RenderOptions, renderHook } from '@testing-library/react';
import { MusicProvider } from '@/contexts/MusicContext';

export const renderWithMusicProvider = (
  ui: React.ReactElement,
  options?: RenderOptions
) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <MusicProvider>{children}</MusicProvider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
};

export function renderHookWithMusicProvider<T>(cb: () => T) {
  return renderHook(cb, {
    wrapper: ({ children }) => <MusicProvider>{children}</MusicProvider>,
  });
}

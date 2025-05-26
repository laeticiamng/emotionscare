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

export const renderHookWithMusicProvider = <T,>(callback: () => T) =>
  renderHook(callback, {
    wrapper: ({ children }) => <MusicProvider>{children}</MusicProvider>,
  });

export const mockResponse = (
  body: unknown,
  init: Partial<Response> & { status: number } = { status: 200 }
): Response =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

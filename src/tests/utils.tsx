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

export function mockResponse({
  ok = true,
  status = 200,
  json = {},
  text = '',
}: {
  ok?: boolean;
  status?: number;
  json?: any;
  text?: string;
}) {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(json),
    text: vi.fn().mockResolvedValue(text),
    headers: new Headers(),
  } as unknown as Response;
}

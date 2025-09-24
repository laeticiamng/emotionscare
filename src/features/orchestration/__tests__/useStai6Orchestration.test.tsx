import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';

import {
  Stai6OrchestrationProvider,
  useStai6Orchestration,
} from '@/features/orchestration/useStai6Orchestration';

describe('useStai6Orchestration', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Stai6OrchestrationProvider>{children}</Stai6OrchestrationProvider>
  );

  it('computes a downward delta when post level decreases', () => {
    const { result } = renderHook(() => useStai6Orchestration(), { wrapper });

    act(() => {
      result.current.register('pre', {
        level: 3,
        summary: 'avant',
        generatedAt: new Date().toISOString(),
      });
      result.current.register('post', {
        level: 1,
        summary: 'après',
        generatedAt: new Date().toISOString(),
      });
    });

    expect(result.current.delta('pre', 'post')).toBe('down');
  });

  it('computes a flat delta when post level equals pre level', () => {
    const { result } = renderHook(() => useStai6Orchestration(), { wrapper });

    act(() => {
      result.current.register('pre', {
        level: 2,
        summary: 'avant',
        generatedAt: new Date().toISOString(),
      });
      result.current.register('post', {
        level: 2,
        summary: 'après',
        generatedAt: new Date().toISOString(),
      });
    });

    expect(result.current.delta('pre', 'post')).toBe('flat');
  });
});

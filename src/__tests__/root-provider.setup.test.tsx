import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ensureI18n } from '@/providers/i18n/client';
import { queryClient } from '@/providers/queryClient';
import { UserModeProvider, useUserMode } from '@/contexts/UserModeContext';
import { ErrorProvider, useError } from '@/contexts';

describe('ensureI18n', () => {
  it('switches to the requested locale', async () => {
    const instance = ensureI18n('en');
    await instance.changeLanguage('en');
    expect(instance.language).toContain('en');
  });
});

describe('queryClient defaults', () => {
  it('uses the expected configuration', () => {
    const defaults = queryClient.getDefaultOptions();
    expect(defaults.queries?.retry).toBe(1);
    expect(defaults.queries?.staleTime).toBe(60_000);
    expect(defaults.queries?.refetchOnWindowFocus).toBe(false);
    expect(defaults.mutations?.retry).toBe(0);
  });
});

describe('UserModeContext', () => {
  it('exposes role helpers and setters', () => {
    const { result } = renderHook(() => useUserMode(), {
      wrapper: ({ children }) => <UserModeProvider>{children}</UserModeProvider>,
    });

    expect(result.current.role).toBeNull();
    expect(result.current.userMode).toBeNull();

    act(() => {
      result.current.setRole('manager');
    });
    expect(result.current.role).toBe('manager');
    expect(result.current.userMode).toBe('b2b_user');

    act(() => {
      result.current.changeUserMode('b2c');
    });
    expect(result.current.role).toBe('user');
    expect(result.current.userMode).toBe('b2c');

    act(() => {
      result.current.clearUserMode();
    });
    expect(result.current.role).toBeNull();
    expect(result.current.userMode).toBeNull();
  });
});

describe('contexts barrel exports', () => {
  it('provides useError aliasing useErrorHandler', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ErrorProvider>{children}</ErrorProvider>
    );
    const { result } = renderHook(() => useError(), { wrapper });
    expect(typeof result.current.addError).toBe('function');
  });
});

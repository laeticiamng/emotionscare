import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@/tests/utils';
vi.mock('@/Shell', () => ({ __esModule: true, default: ({ children }: any) => <>{children}</> }));
import FlowWalkStart from '../FlowWalkStart';

describe('FlowWalkStart', () => {
  it('bouton "Commencer" déclenche navigation', async () => {
    localStorage.setItem('user', JSON.stringify({ id: '1', email: 't@test.com' }));
    render(<FlowWalkStart />);
    await userEvent.click(screen.getByText('Commencer'));
    expect(window.location.pathname).toBe('/breath/flowwalk/live');
    localStorage.clear();
  });
});

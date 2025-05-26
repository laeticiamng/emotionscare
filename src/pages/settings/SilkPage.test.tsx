import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/tests/utils';
import SilkPage from './SilkPage';

vi.mock('@/hooks/use-toast', () => ({ toast: vi.fn() }));

const mockWalls = [{ id: 'abc', mp4Url: '/wall.mp4', thumbnailUrl: '/wall.jpg' }];

describe('SilkPage', () => {
  it('applies wallpaper and shows toast', async () => {
    const fetchMock = vi
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockWalls),
      } as any)
      .mockResolvedValueOnce({ ok: true, status: 200, json: vi.fn() } as any);

    render(<SilkPage />);
    await screen.findByText(/Mes fonds soyeux/);
    fireEvent.click(screen.getByRole('button', { name: /appliquer/i }));
    expect(fetchMock).toHaveBeenCalledWith(
      '/user/wallpapers/abc/apply',
      expect.objectContaining({ method: 'POST' })
    );
    fetchMock.mockRestore();
  });
});

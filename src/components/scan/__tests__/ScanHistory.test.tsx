// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ScanHistory } from '../ScanHistory';

// Mock du hook useScanHistory
vi.mock('@/hooks/useScanHistory', () => ({
  useScanHistory: vi.fn(),
}));

// Mock des analytics
vi.mock('@/lib/analytics/scanEvents', () => ({
  scanAnalytics: {
    historyViewed: vi.fn(),
  },
}));

import { useScanHistory } from '@/hooks/useScanHistory';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('ScanHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading skeleton', () => {
    vi.mocked(useScanHistory).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    render(<ScanHistory />, { wrapper: createWrapper() });

    expect(screen.getAllByTestId('skeleton')).toHaveLength(3);
  });

  it('should render empty state when no history', () => {
    vi.mocked(useScanHistory).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    render(<ScanHistory />, { wrapper: createWrapper() });

    expect(screen.getByText('Aucun scan enregistré pour le moment')).toBeInTheDocument();
    expect(screen.getByText('Historique récent')).toBeInTheDocument();
  });

  it('should render scan history items', () => {
    const mockHistory = [
      {
        id: '1',
        valence: 75,
        arousal: 80,
        source: 'scan_sliders',
        created_at: new Date().toISOString(),
        summary: 'Test summary 1',
      },
      {
        id: '2',
        valence: 30,
        arousal: 20,
        source: 'scan_camera',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '3',
        valence: 50,
        arousal: 90,
        source: 'scan_sliders',
        created_at: new Date(Date.now() - 7200000).toISOString(),
        summary: 'Test summary 3',
      },
    ];

    vi.mocked(useScanHistory).mockReturnValue({
      data: mockHistory,
      isLoading: false,
    } as any);

    render(<ScanHistory />, { wrapper: createWrapper() });

    expect(screen.getByText('Énergique et positif')).toBeInTheDocument();
    expect(screen.getByText('Apaisement recherché')).toBeInTheDocument();
    expect(screen.getByText('Tension ressentie')).toBeInTheDocument();
  });

  it('should display valence and arousal values', () => {
    const mockHistory = [
      {
        id: '1',
        valence: 75,
        arousal: 80,
        source: 'scan_sliders',
        created_at: new Date().toISOString(),
      },
    ];

    vi.mocked(useScanHistory).mockReturnValue({
      data: mockHistory,
      isLoading: false,
    } as any);

    render(<ScanHistory />, { wrapper: createWrapper() });

    expect(screen.getByText(/V:75 A:80/)).toBeInTheDocument();
  });

  it('should show "Voir tout" button when history exists', () => {
    const mockHistory = [
      {
        id: '1',
        valence: 75,
        arousal: 80,
        source: 'scan_sliders',
        created_at: new Date().toISOString(),
      },
    ];

    vi.mocked(useScanHistory).mockReturnValue({
      data: mockHistory,
      isLoading: false,
    } as any);

    render(<ScanHistory />, { wrapper: createWrapper() });

    expect(screen.getByText('Voir tout')).toBeInTheDocument();
  });

  it('should apply correct emotion colors', () => {
    const mockHistory = [
      {
        id: '1',
        valence: 75,
        arousal: 80,
        source: 'scan_sliders',
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        valence: 75,
        arousal: 30,
        source: 'scan_camera',
        created_at: new Date().toISOString(),
      },
      {
        id: '3',
        valence: 30,
        arousal: 80,
        source: 'scan_sliders',
        created_at: new Date().toISOString(),
      },
      {
        id: '4',
        valence: 30,
        arousal: 30,
        source: 'scan_sliders',
        created_at: new Date().toISOString(),
      },
    ];

    vi.mocked(useScanHistory).mockReturnValue({
      data: mockHistory,
      isLoading: false,
    } as any);

    const { container } = render(<ScanHistory />, { wrapper: createWrapper() });

    const items = container.querySelectorAll('.text-green-500, .text-blue-500, .text-orange-500, .text-slate-500');
    expect(items.length).toBeGreaterThan(0);
  });

  it('should display relative time in French', async () => {
    const mockHistory = [
      {
        id: '1',
        valence: 75,
        arousal: 80,
        source: 'scan_sliders',
        created_at: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
      },
    ];

    vi.mocked(useScanHistory).mockReturnValue({
      data: mockHistory,
      isLoading: false,
    } as any);

    render(<ScanHistory />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/il y a/)).toBeInTheDocument();
    });
  });
});

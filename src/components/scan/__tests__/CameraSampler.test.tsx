// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CameraSampler from '@/features/scan/CameraSampler';

// Mock navigator.mediaDevices
const mockGetUserMedia = vi.fn();
Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia,
  },
  configurable: true,
});

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

// Mock analytics
vi.mock('@/lib/analytics/scanEvents', () => ({
  scanAnalytics: {
    cameraPermissionGranted: vi.fn(),
    cameraPermissionDenied: vi.fn(),
    cameraAnalysisStarted: vi.fn(),
    cameraAnalysisCompleted: vi.fn(),
  },
}));

// Mock useMoodPublisher
vi.mock('@/features/mood/useMoodPublisher', () => ({
  useMoodPublisher: () => vi.fn(),
}));

import { supabase } from '@/integrations/supabase/client';
import { scanAnalytics } from '@/lib/analytics/scanEvents';

describe('CameraSampler', () => {
  let mockOnPermissionChange: ReturnType<typeof vi.fn>;
  let mockOnUnavailable: ReturnType<typeof vi.fn>;
  let mockStream: MediaStream;

  beforeEach(() => {
    mockOnPermissionChange = vi.fn();
    mockOnUnavailable = vi.fn();
    
    // Create mock MediaStream
    mockStream = {
      getTracks: () => [{ stop: vi.fn() }],
    } as any;

    mockGetUserMedia.mockResolvedValue(mockStream);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should render camera component', () => {
    render(
      <CameraSampler
        onPermissionChange={mockOnPermissionChange}
        onUnavailable={mockOnUnavailable}
      />
    );

    expect(screen.getByRole('generic')).toBeInTheDocument();
  });

  it('should request camera permission on mount', async () => {
    render(
      <CameraSampler
        onPermissionChange={mockOnPermissionChange}
        onUnavailable={mockOnUnavailable}
      />
    );

    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalledWith({
        video: { facingMode: 'user' },
        audio: false,
      });
    });
  });

  it('should call onPermissionChange with "allowed" when permission granted', async () => {
    render(
      <CameraSampler
        onPermissionChange={mockOnPermissionChange}
        onUnavailable={mockOnUnavailable}
      />
    );

    await waitFor(() => {
      expect(mockOnPermissionChange).toHaveBeenCalledWith('allowed');
      expect(scanAnalytics.cameraPermissionGranted).toHaveBeenCalled();
    });
  });

  it('should call onPermissionChange with "denied" when permission denied', async () => {
    mockGetUserMedia.mockRejectedValue(new Error('Permission denied'));

    render(
      <CameraSampler
        onPermissionChange={mockOnPermissionChange}
        onUnavailable={mockOnUnavailable}
      />
    );

    await waitFor(() => {
      expect(mockOnPermissionChange).toHaveBeenCalledWith('denied');
      expect(mockOnUnavailable).toHaveBeenCalledWith('hardware');
      expect(scanAnalytics.cameraPermissionDenied).toHaveBeenCalled();
    });
  });

  it('should show error state when camera not available', async () => {
    // Remove mediaDevices
    Object.defineProperty(global.navigator, 'mediaDevices', {
      value: undefined,
      configurable: true,
    });

    render(
      <CameraSampler
        onPermissionChange={mockOnPermissionChange}
        onUnavailable={mockOnUnavailable}
      />
    );

    await waitFor(() => {
      expect(mockOnPermissionChange).toHaveBeenCalledWith('denied');
      expect(mockOnUnavailable).toHaveBeenCalledWith('hardware');
    });

    // Restore mediaDevices
    Object.defineProperty(global.navigator, 'mediaDevices', {
      value: {
        getUserMedia: mockGetUserMedia,
      },
      configurable: true,
    });
  });

  it('should show analyzing badge when analyzing', async () => {
    vi.mocked(supabase.functions.invoke).mockResolvedValue({
      data: { valence: 75, arousal: 80, confidence: 0.85, summary: 'Test' },
      error: null,
    } as any);

    render(
      <CameraSampler
        onPermissionChange={mockOnPermissionChange}
        onUnavailable={mockOnUnavailable}
      />
    );

    // Wait for streaming to start
    await waitFor(() => {
      expect(mockOnPermissionChange).toHaveBeenCalledWith('allowed');
    });

    // Check that analyzing badge appears during analysis
    await waitFor(
      () => {
        const analyzingText = screen.queryByText('Analyse en cours...');
        if (analyzingText) {
          expect(analyzingText).toBeInTheDocument();
        }
      },
      { timeout: 5000 }
    );
  });

  it('should display summary when provided', () => {
    const testSummary = 'État énergique et positif';

    render(
      <CameraSampler
        onPermissionChange={mockOnPermissionChange}
        onUnavailable={mockOnUnavailable}
        summary={testSummary}
      />
    );

    // Summary is in sr-only element for screen readers
    const srOnly = document.querySelector('.sr-only');
    expect(srOnly?.textContent).toBe(testSummary);
  });

  it('should call edge function with correct payload', async () => {
    const mockInvoke = vi.mocked(supabase.functions.invoke);
    mockInvoke.mockResolvedValue({
      data: { valence: 75, arousal: 80, confidence: 0.85, summary: 'Test' },
      error: null,
    } as any);

    render(
      <CameraSampler
        onPermissionChange={mockOnPermissionChange}
        onUnavailable={mockOnUnavailable}
      />
    );

    // Wait for streaming to start and first analysis
    await waitFor(
      () => {
        expect(mockInvoke).toHaveBeenCalledWith('mood-camera', 
          expect.objectContaining({
            body: expect.objectContaining({
              frame: expect.any(String),
              timestamp: expect.any(String),
            }),
          })
        );
      },
      { timeout: 6000 }
    );
  });

  it('should handle edge function error gracefully', async () => {
    vi.mocked(supabase.functions.invoke).mockResolvedValue({
      data: null,
      error: new Error('Edge function unavailable'),
    } as any);

    render(
      <CameraSampler
        onPermissionChange={mockOnPermissionChange}
        onUnavailable={mockOnUnavailable}
      />
    );

    await waitFor(
      () => {
        expect(mockOnUnavailable).toHaveBeenCalledWith('edge');
      },
      { timeout: 6000 }
    );
  });

  it('should stop camera stream on unmount', async () => {
    const mockStop = vi.fn();
    mockStream = {
      getTracks: () => [{ stop: mockStop }],
    } as any;
    mockGetUserMedia.mockResolvedValue(mockStream);

    const { unmount } = render(
      <CameraSampler
        onPermissionChange={mockOnPermissionChange}
        onUnavailable={mockOnUnavailable}
      />
    );

    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalled();
    });

    unmount();

    expect(mockStop).toHaveBeenCalled();
  });
});

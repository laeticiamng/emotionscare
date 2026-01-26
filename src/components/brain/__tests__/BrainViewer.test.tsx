/**
 * Tests unitaires - Module Brain Viewer
 * EmotionsCare - DICOM Module
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrainControls } from '../BrainControls';
import { EmotionOverlayPanel } from '../EmotionOverlayPanel';
import { RegionInfoPanel } from '../RegionInfoPanel';
import { SliceViewer } from '../SliceViewer';
import { AAL_REGIONS, EMOTION_BRAIN_MAPPING, type EmotionRegionMap } from '../types';

// Mock Three.js components
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
  useFrame: vi.fn(),
  useThree: () => ({ gl: {}, scene: {}, camera: {} }),
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  Environment: () => null,
  Html: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('BrainControls', () => {
  const defaultProps = {
    viewMode: 'axial' as const,
    onViewModeChange: vi.fn(),
    opacity: 0.8,
    onOpacityChange: vi.fn(),
    showLabels: true,
    onShowLabelsChange: vi.fn(),
    wireframe: false,
    onWireframeChange: vi.fn(),
    showEmotionOverlay: true,
    onShowEmotionOverlayChange: vi.fn(),
    emotionIntensityThreshold: 0.3,
    onEmotionIntensityThresholdChange: vi.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all view buttons', () => {
    render(<BrainControls {...defaultProps} />);
    
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
  });

  it('calls onViewModeChange when view button is clicked', () => {
    render(<BrainControls {...defaultProps} />);
    
    const sagittalButton = screen.getByText('S');
    fireEvent.click(sagittalButton);
    
    expect(defaultProps.onViewModeChange).toHaveBeenCalledWith('sagittal');
  });

  it('shows overlay toggle', () => {
    render(<BrainControls {...defaultProps} />);
    
    expect(screen.getByText(/Overlay/i)).toBeInTheDocument();
  });

  it('disables buttons when loading', () => {
    render(<BrainControls {...defaultProps} isLoading={true} />);
    
    const axialButton = screen.getByText('A');
    expect(axialButton).toBeDisabled();
  });
});

describe('EmotionOverlayPanel', () => {
  const mockMappings: EmotionRegionMap = {
    anxiety: { region: 'Amygdala', intensity: 0.72, color: '#EF4444' },
    joy: { region: 'Nucleus_Accumbens', intensity: 0.45, color: '#10B981' },
    sadness: { region: 'Prefrontal_Cortex', intensity: 0.31, color: '#3B82F6' },
  };

  it('renders emotion list', () => {
    render(
      <EmotionOverlayPanel
        emotions={mockMappings}
        isRealtime={false}
      />
    );
    
    expect(screen.getByText(/Anxiété/i)).toBeInTheDocument();
    expect(screen.getByText(/Joie/i)).toBeInTheDocument();
  });

  it('shows intensity percentages', () => {
    render(
      <EmotionOverlayPanel
        emotions={mockMappings}
        isRealtime={false}
      />
    );
    
    expect(screen.getByText('72%')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('shows realtime indicator when streaming', () => {
    render(
      <EmotionOverlayPanel
        emotions={mockMappings}
        isRealtime={true}
        isPlaying={true}
      />
    );
    
    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('handles empty emotions', () => {
    render(
      <EmotionOverlayPanel
        emotions={{}}
        isRealtime={false}
      />
    );
    
    expect(screen.getByText(/Aucune émotion/i)).toBeInTheDocument();
  });
});

describe('RegionInfoPanel', () => {
  it('renders region information', () => {
    render(
      <RegionInfoPanel
        selectedRegionCode="Amygdala_L"
      />
    );
    
    expect(screen.getByText('Amygdale')).toBeInTheDocument();
    expect(screen.getByText('Gauche')).toBeInTheDocument();
  });

  it('shows emotion affinity', () => {
    render(
      <RegionInfoPanel
        selectedRegionCode="Amygdala_L"
      />
    );
    
    expect(screen.getByText(/Fear/i) || screen.getByText(/Peur/i)).toBeTruthy();
  });

  it('shows empty state when no region selected', () => {
    render(
      <RegionInfoPanel
        selectedRegionCode={null}
      />
    );
    
    expect(screen.getByText(/Sélectionnez une région/i)).toBeInTheDocument();
  });
});

describe('SliceViewer', () => {
  const mockVolumeData = new Float32Array(64 * 64 * 64).fill(0.5);

  it('renders slice tabs', () => {
    render(
      <SliceViewer
        volumeData={mockVolumeData}
        dimensions={[64, 64, 64]}
      />
    );
    
    expect(screen.getByText(/Axiale/i)).toBeInTheDocument();
    expect(screen.getByText(/Sagittale/i)).toBeInTheDocument();
    expect(screen.getByText(/Coronale/i)).toBeInTheDocument();
  });

  it('shows slice position', () => {
    render(
      <SliceViewer
        volumeData={mockVolumeData}
        dimensions={[64, 64, 64]}
      />
    );
    
    expect(screen.getByText(/Coupe/)).toBeInTheDocument();
  });

  it('renders without volume data', () => {
    render(
      <SliceViewer
        dimensions={[64, 64, 64]}
      />
    );
    
    expect(screen.getByText(/Aucune donnée/i)).toBeInTheDocument();
  });
});

describe('AAL_REGIONS', () => {
  it('contains 20 predefined regions', () => {
    expect(AAL_REGIONS.length).toBe(20);
  });

  it('all regions have required properties', () => {
    AAL_REGIONS.forEach(region => {
      expect(region.code).toBeDefined();
      expect(region.name).toBeDefined();
      expect(region.hemisphere).toMatch(/^(left|right|bilateral)$/);
      expect(region.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('contains key emotional regions', () => {
    const codes = AAL_REGIONS.map(r => r.code);
    expect(codes).toContain('Amygdala_L');
    expect(codes).toContain('Hippocampus_L');
    expect(codes).toContain('Prefrontal_L');
    expect(codes).toContain('Insula_L');
    expect(codes).toContain('ACC');
  });
});

describe('EMOTION_BRAIN_MAPPING', () => {
  it('maps anxiety to amygdala', () => {
    expect(EMOTION_BRAIN_MAPPING.anxiety.regions).toContain('Amygdala');
  });

  it('maps joy to nucleus accumbens', () => {
    expect(EMOTION_BRAIN_MAPPING.joy.regions).toContain('Nucleus_Accumbens');
  });

  it('maps sadness to prefrontal cortex', () => {
    expect(EMOTION_BRAIN_MAPPING.sadness.regions).toContain('Prefrontal_Cortex');
  });

  it('all emotions have color codes', () => {
    Object.values(EMOTION_BRAIN_MAPPING).forEach(mapping => {
      expect(mapping.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});

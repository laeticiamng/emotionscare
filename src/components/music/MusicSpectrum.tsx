/**
 * MusicSpectrum Component
 *
 * Composant de visualisation spectrale audio avancée.
 *
 * Features:
 * - Visualisation en temps réel (bar spectrum, line spectrum, circular)
 * - Thèmes personnalisables
 * - Animations fluides
 * - Responsive
 * - Accessible
 *
 * @module components/music/MusicSpectrum
 */

import { useEffect, useRef, useState } from 'react';
import { useMusicVisualization } from '@/hooks/music/useMusicVisualization';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

export type SpectrumStyle = 'bars' | 'line' | 'circular' | 'waveform';

export interface SpectrumTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  glowEffect: boolean;
  mirrorEffect: boolean;
}

export interface MusicSpectrumProps {
  audioElement?: HTMLAudioElement;
  style?: SpectrumStyle;
  theme?: Partial<SpectrumTheme>;
  className?: string;
  width?: number | string;
  height?: number | string;
  barCount?: number;
  barWidth?: number;
  barGap?: number;
  smoothing?: number;
  showFPS?: boolean;
}

// ============================================
// DEFAULT THEMES
// ============================================

const DEFAULT_THEME: SpectrumTheme = {
  primaryColor: '#3b82f6',
  secondaryColor: '#8b5cf6',
  backgroundColor: 'transparent',
  glowEffect: true,
  mirrorEffect: false
};

const THEMES: Record<string, SpectrumTheme> = {
  default: DEFAULT_THEME,
  neon: {
    primaryColor: '#00ff9f',
    secondaryColor: '#00b8ff',
    backgroundColor: '#000000',
    glowEffect: true,
    mirrorEffect: false
  },
  fire: {
    primaryColor: '#ff6b00',
    secondaryColor: '#ff0000',
    backgroundColor: 'transparent',
    glowEffect: true,
    mirrorEffect: false
  },
  ocean: {
    primaryColor: '#0077be',
    secondaryColor: '#00d4ff',
    backgroundColor: 'transparent',
    glowEffect: false,
    mirrorEffect: true
  },
  minimal: {
    primaryColor: '#ffffff',
    secondaryColor: '#cccccc',
    backgroundColor: 'transparent',
    glowEffect: false,
    mirrorEffect: false
  }
};

// ============================================
// COMPONENT
// ============================================

export function MusicSpectrum({
  audioElement,
  style = 'bars',
  theme: customTheme,
  className,
  width = '100%',
  height = 200,
  barCount = 64,
  barWidth = 4,
  barGap = 2,
  smoothing = 0.8,
  showFPS = false
}: MusicSpectrumProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fps, setFps] = useState(0);
  const fpsRef = useRef({ frames: 0, lastTime: performance.now() });

  const theme = { ...DEFAULT_THEME, ...customTheme };

  const {
    visualizationData,
    startAnalysis,
    stopAnalysis,
    isAnalyzing
  } = useMusicVisualization({
    fftSize: barCount * 2,
    smoothingTimeConstant: smoothing
  });

  // Démarrer l'analyse quand l'élément audio est fourni
  useEffect(() => {
    if (audioElement) {
      startAnalysis(audioElement);
    }

    return () => {
      stopAnalysis();
    };
  }, [audioElement, startAnalysis, stopAnalysis]);

  // Dessiner le spectrum
  useEffect(() => {
    if (!canvasRef.current || !visualizationData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const { spectrum } = visualizationData;

    // Clear canvas
    ctx.fillStyle = theme.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw based on style
    switch (style) {
      case 'bars':
        drawBars(ctx, spectrum, canvas.width, canvas.height, theme, barCount, barWidth, barGap);
        break;
      case 'line':
        drawLine(ctx, spectrum, canvas.width, canvas.height, theme, barCount);
        break;
      case 'circular':
        drawCircular(ctx, spectrum, canvas.width, canvas.height, theme, barCount);
        break;
      case 'waveform':
        drawWaveform(ctx, visualizationData.waveform, canvas.width, canvas.height, theme);
        break;
    }

    // Calculate FPS
    if (showFPS) {
      fpsRef.current.frames++;
      const now = performance.now();
      if (now - fpsRef.current.lastTime >= 1000) {
        setFps(fpsRef.current.frames);
        fpsRef.current.frames = 0;
        fpsRef.current.lastTime = now;
      }
    }
  }, [visualizationData, style, theme, barCount, barWidth, barGap, showFPS]);

  return (
    <div className={cn('relative', className)}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height
        }}
        aria-label="Visualisation spectrale audio"
        role="img"
      />

      {showFPS && (
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
          {fps} FPS
        </div>
      )}

      {!isAnalyzing && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 text-white">
          En attente de lecture...
        </div>
      )}
    </div>
  );
}

// ============================================
// DRAWING FUNCTIONS
// ============================================

function drawBars(
  ctx: CanvasRenderingContext2D,
  data: Uint8Array,
  width: number,
  height: number,
  theme: SpectrumTheme,
  barCount: number,
  barWidth: number,
  barGap: number
) {
  const totalBarWidth = barWidth + barGap;
  const usableWidth = barCount * totalBarWidth;
  const offsetX = (width - usableWidth) / 2;

  for (let i = 0; i < barCount; i++) {
    const value = data[i] / 255;
    const barHeight = value * height;

    const x = offsetX + i * totalBarWidth;
    const y = height - barHeight;

    // Gradient
    const gradient = ctx.createLinearGradient(x, y, x, height);
    gradient.addColorStop(0, theme.primaryColor);
    gradient.addColorStop(1, theme.secondaryColor);

    ctx.fillStyle = gradient;

    // Draw bar
    ctx.fillRect(x, y, barWidth, barHeight);

    // Glow effect
    if (theme.glowEffect && value > 0.5) {
      ctx.shadowColor = theme.primaryColor;
      ctx.shadowBlur = 10 * value;
      ctx.fillRect(x, y, barWidth, barHeight);
      ctx.shadowBlur = 0;
    }

    // Mirror effect
    if (theme.mirrorEffect) {
      const mirrorGradient = ctx.createLinearGradient(x, height, x, height + barHeight);
      mirrorGradient.addColorStop(0, theme.secondaryColor + '80');
      mirrorGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = mirrorGradient;
      ctx.fillRect(x, height, barWidth, barHeight * 0.5);
    }
  }
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  data: Uint8Array,
  width: number,
  height: number,
  theme: SpectrumTheme,
  pointCount: number
) {
  const step = width / pointCount;

  ctx.beginPath();
  ctx.moveTo(0, height);

  for (let i = 0; i < pointCount; i++) {
    const value = data[i] / 255;
    const x = i * step;
    const y = height - value * height;

    ctx.lineTo(x, y);
  }

  ctx.lineTo(width, height);
  ctx.closePath();

  // Gradient fill
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, theme.primaryColor + '80');
  gradient.addColorStop(1, theme.secondaryColor + '20');

  ctx.fillStyle = gradient;
  ctx.fill();

  // Line stroke
  ctx.strokeStyle = theme.primaryColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Glow effect
  if (theme.glowEffect) {
    ctx.shadowColor = theme.primaryColor;
    ctx.shadowBlur = 10;
    ctx.stroke();
  }
}

function drawCircular(
  ctx: CanvasRenderingContext2D,
  data: Uint8Array,
  width: number,
  height: number,
  theme: SpectrumTheme,
  barCount: number
) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.3;
  const maxBarHeight = Math.min(width, height) * 0.2;

  for (let i = 0; i < barCount; i++) {
    const value = data[i] / 255;
    const angle = (i / barCount) * Math.PI * 2;

    const x1 = centerX + Math.cos(angle) * radius;
    const y1 = centerY + Math.sin(angle) * radius;

    const barHeight = value * maxBarHeight;
    const x2 = centerX + Math.cos(angle) * (radius + barHeight);
    const y2 = centerY + Math.sin(angle) * (radius + barHeight);

    // Gradient
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, theme.secondaryColor);
    gradient.addColorStop(1, theme.primaryColor);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Glow effect
    if (theme.glowEffect && value > 0.5) {
      ctx.shadowColor = theme.primaryColor;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }
}

function drawWaveform(
  ctx: CanvasRenderingContext2D,
  data: Float32Array,
  width: number,
  height: number,
  theme: SpectrumTheme
) {
  const step = width / data.length;
  const centerY = height / 2;

  ctx.beginPath();
  ctx.moveTo(0, centerY);

  for (let i = 0; i < data.length; i++) {
    const x = i * step;
    const y = centerY + data[i] * centerY;
    ctx.lineTo(x, y);
  }

  ctx.strokeStyle = theme.primaryColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Glow effect
  if (theme.glowEffect) {
    ctx.shadowColor = theme.primaryColor;
    ctx.shadowBlur = 5;
    ctx.stroke();
  }
}

// ============================================
// PRESET THEMES
// ============================================

export function MusicSpectrumNeon(props: Omit<MusicSpectrumProps, 'theme'>) {
  return <MusicSpectrum {...props} theme={THEMES.neon} />;
}

export function MusicSpectrumFire(props: Omit<MusicSpectrumProps, 'theme'>) {
  return <MusicSpectrum {...props} theme={THEMES.fire} />;
}

export function MusicSpectrumOcean(props: Omit<MusicSpectrumProps, 'theme'>) {
  return <MusicSpectrum {...props} theme={THEMES.ocean} />;
}

export function MusicSpectrumMinimal(props: Omit<MusicSpectrumProps, 'theme'>) {
  return <MusicSpectrum {...props} theme={THEMES.minimal} />;
}

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Exemple 1: Utilisation basique
 *
 * ```tsx
 * function MyPlayer() {
 *   const audioRef = useRef<HTMLAudioElement>(null);
 *
 *   return (
 *     <div>
 *       <audio ref={audioRef} src="/music.mp3" />
 *       <MusicSpectrum audioElement={audioRef.current} />
 *     </div>
 *   );
 * }
 * ```
 */

/**
 * Exemple 2: Style circulaire avec thème neon
 *
 * ```tsx
 * <MusicSpectrumNeon
 *   audioElement={audioEl}
 *   style="circular"
 *   height={400}
 * />
 * ```
 */

/**
 * Exemple 3: Personnalisation avancée
 *
 * ```tsx
 * <MusicSpectrum
 *   audioElement={audioEl}
 *   style="bars"
 *   barCount={128}
 *   barWidth={3}
 *   barGap={1}
 *   theme={{
 *     primaryColor: '#ff00ff',
 *     secondaryColor: '#00ffff',
 *     glowEffect: true,
 *     mirrorEffect: true
 *   }}
 *   showFPS
 * />
 * ```
 */

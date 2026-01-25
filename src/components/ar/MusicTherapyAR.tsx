/**
 * Music Therapy AR - Phase 4.5
 * Immersive music visualization with AR themes
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Music, X, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAR } from '@/contexts/ARContext';
import { useMusicAR } from '@/hooks/useARCore';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

export interface MusicTherapyARProps {
  userId: string | undefined;
  playlistId?: string | null;
  trackIds?: string[];
  visualTheme?: 'galaxy' | 'waves' | 'particles';
  onClose?: () => void;
  className?: string;
}

interface AudioData {
  frequency: number[];
  waveform: number[];
  bass: number;
  treble: number;
  mid: number;
}

export function MusicTherapyAR({
  userId,
  playlistId,
  trackIds = [],
  visualTheme: initialTheme = 'galaxy',
  onClose,
  className
}: MusicTherapyARProps) {
  const { currentVisualTheme, setCurrentVisualTheme } = useAR();
  const { startMusicSession, isPlaying, togglePlayPause, nextTrack, previousTrack } =
    useMusicAR(userId);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioDataRef = useRef<AudioData>({
    frequency: new Array(256).fill(0),
    waveform: new Array(256).fill(0),
    bass: 0,
    treble: 0,
    mid: 0
  });
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Initialize audio context
  const initializeAudio = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        analyserRef.current = analyser;

        logger.info('Audio context initialized', {}, 'AR');
      } catch (err) {
        logger.error('Failed to initialize audio context', err as Error, 'AR');
      }
    }
  }, []);

  // Start music session
  useEffect(() => {
    const start = async () => {
      if (userId && trackIds.length > 0) {
        initializeAudio();
        const sessionId = await startMusicSession(playlistId || null, trackIds, initialTheme);
        if (sessionId) {
          setCurrentVisualTheme(initialTheme);
          logger.info('Music AR session started', { theme: initialTheme }, 'AR');
        }
      }
    };

    start();
  }, [userId, trackIds, playlistId, initialTheme, startMusicSession, setCurrentVisualTheme, initializeAudio]);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();

    // Audio analysis
    const updateAudioData = () => {
      if (!analyserRef.current) return;

      const frequencyData = new Uint8Array(analyserRef.current.frequencyBinCount);
      const waveformData = new Uint8Array(analyserRef.current.frequencyBinCount);

      analyserRef.current.getByteFrequencyData(frequencyData);
      analyserRef.current.getByteTimeDomainData(waveformData);

      audioDataRef.current.frequency = Array.from(frequencyData).map((v) => v / 255);
      audioDataRef.current.waveform = Array.from(waveformData).map((v) => (v - 128) / 128);

      // Calculate frequency bands
      audioDataRef.current.bass = audioDataRef.current.frequency.slice(0, 10).reduce((a, b) => a + b) / 10;
      audioDataRef.current.mid = audioDataRef.current.frequency.slice(50, 100).reduce((a, b) => a + b) / 50;
      audioDataRef.current.treble = audioDataRef.current.frequency.slice(200, 256).reduce((a, b) => a + b) / 56;
    };

    const drawGalaxy = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Stars background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw frequency rings
      for (let i = 0; i < audioDataRef.current.frequency.length; i++) {
        const angle = (i / audioDataRef.current.frequency.length) * Math.PI * 2;
        const radius = 100 + audioDataRef.current.frequency[i] * 200;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        const hue = (i / audioDataRef.current.frequency.length * 360) % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, ${50 + audioDataRef.current.frequency[i] * 30}%)`;
        ctx.beginPath();
        ctx.arc(x, y, 3 + audioDataRef.current.frequency[i] * 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Central pulsing circle
      ctx.strokeStyle = `hsl(${(audioDataRef.current.bass * 360) % 360}, 100%, 50%)`;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 100 + audioDataRef.current.bass * 100, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const drawWaves = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerY = canvas.height / 2;

      // Draw multiple wave layers
      for (let layer = 0; layer < 3; layer++) {
        ctx.strokeStyle = `hsl(${200 + layer * 20}, 100%, ${50 + layer * 10}%)`;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6 - layer * 0.1;

        ctx.beginPath();
        for (let i = 0; i < canvas.width; i++) {
          const freq = audioDataRef.current.frequency[Math.floor((i / canvas.width) * audioDataRef.current.frequency.length)] || 0;
          const wave = Math.sin(i * 0.01 + timeRef.current * 0.02) * freq * 100;
          const y = centerY + wave - layer * 50;

          if (i === 0) ctx.moveTo(i, y);
          else ctx.lineTo(i, y);
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      // Frequency bars at bottom
      const barWidth = canvas.width / audioDataRef.current.frequency.length;
      for (let i = 0; i < audioDataRef.current.frequency.length; i++) {
        const height = audioDataRef.current.frequency[i] * canvas.height * 0.3;
        const hue = (i / audioDataRef.current.frequency.length * 360) % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 1, height);
      }
    };

    const drawParticles = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particleCount = Math.floor(audioDataRef.current.bass * 100) + 50;

      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const baseRadius = 200;
        const radius = baseRadius + audioDataRef.current.frequency[i % audioDataRef.current.frequency.length] * 150;

        const x = canvas.width / 2 + Math.cos(angle) * radius;
        const y = canvas.height / 2 + Math.sin(angle) * radius;

        const hue = ((angle * 180) / Math.PI + timeRef.current) % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, ${50 + audioDataRef.current.mid * 30}%)`;
        ctx.globalAlpha = 0.6 + audioDataRef.current.frequency[i % audioDataRef.current.frequency.length] * 0.4;

        const size = 2 + audioDataRef.current.frequency[i % audioDataRef.current.frequency.length] * 8;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    const animate = () => {
      timeRef.current += 0.016;
      updateAudioData();

      // Clear and draw based on theme
      switch (currentVisualTheme) {
        case 'galaxy':
          drawGalaxy();
          break;
        case 'waves':
          drawWaves();
          break;
        case 'particles':
          drawParticles();
          break;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', updateCanvasSize);
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentVisualTheme]);

  const handleThemeChange = useCallback((theme: 'galaxy' | 'waves' | 'particles') => {
    setCurrentVisualTheme(theme);
    logger.info('Music theme changed', { theme }, 'AR');
  }, [setCurrentVisualTheme]);

  return (
    <div className={cn('relative w-full h-full overflow-hidden bg-black', className)}>
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col">
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <Music className="w-6 h-6" />
            <h2 className="text-xl font-bold">Thérapie Musicale AR</h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="pointer-events-auto p-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-lg transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Theme selector */}
        <div className="px-6 py-2">
          <div className="flex gap-2 bg-black bg-opacity-60 rounded-lg p-2">
            {(['galaxy', 'waves', 'particles'] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => handleThemeChange(theme)}
                className={cn(
                  'pointer-events-auto px-4 py-2 rounded-lg font-semibold text-sm transition-all capitalize',
                  currentVisualTheme === theme
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                )}
              >
                {theme === 'galaxy' ? '🌌' : theme === 'waves' ? '🌊' : '✨'} {theme}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1" />

        {/* Bottom controls */}
        <div className="p-6 space-y-4">
          {/* Progress bar */}
          <div className="bg-black bg-opacity-60 rounded-lg p-4">
            <div className="flex items-center gap-4 mb-3">
              <button
                onClick={() => previousTrack()}
                className="pointer-events-auto p-2 hover:bg-gray-700 rounded-lg transition-colors text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => togglePlayPause()}
                className="pointer-events-auto p-3 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors text-white"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={() => nextTrack()}
                className="pointer-events-auto p-2 hover:bg-gray-700 rounded-lg transition-colors text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="flex-1">
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div
                    className="bg-indigo-600 h-1 rounded-full"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="text-center text-white text-sm">
              <p className="font-semibold">
                Track {currentTrackIndex + 1} of {trackIds.length || 1}
              </p>
            </div>
          </div>

          {/* Frequency visualization info */}
          <div className="bg-black bg-opacity-60 rounded-lg p-3 flex justify-around">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {Math.round(audioDataRef.current.bass * 100)}
              </div>
              <p className="text-xs text-gray-300">Bass</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {Math.round(audioDataRef.current.mid * 100)}
              </div>
              <p className="text-xs text-gray-300">Mid</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {Math.round(audioDataRef.current.treble * 100)}
              </div>
              <p className="text-xs text-gray-300">Treble</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

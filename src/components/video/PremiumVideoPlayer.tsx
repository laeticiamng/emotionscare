/**
 * PremiumVideoPlayer — Cinematic, immersive video player
 * Glass frame, ambient glow, progressive controls, fullscreen transitions
 */

import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Maximize2, Minimize2, Volume2, VolumeX, Volume1,
  Settings, RotateCcw, SkipForward, SkipBack
} from 'lucide-react';
import { cn } from '@/lib/utils';
import '@/styles/premium-3d-player.css';

interface Chapter {
  time: number;
  title: string;
}

interface PremiumVideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  subtitle?: string;
  chapters?: Chapter[];
  className?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
  onTimeUpdate?: (time: number) => void;
  aspectRatio?: 'video' | 'cinema' | 'square';
}

type PlayerState = 'idle' | 'loading' | 'playing' | 'paused' | 'ended';

const PremiumVideoPlayer: React.FC<PremiumVideoPlayerProps> = ({
  src,
  poster,
  title,
  subtitle,
  chapters = [],
  className,
  autoPlay = false,
  onEnded,
  onTimeUpdate,
  aspectRatio = 'video',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const [playerState, setPlayerState] = useState<PlayerState>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showRipple, setShowRipple] = useState(false);

  const isPlaying = playerState === 'playing';
  const isPaused = playerState === 'paused';
  const isIdle = playerState === 'idle';
  const isEnded = playerState === 'ended';
  const isLoading = playerState === 'loading';

  const aspectClass = {
    video: 'aspect-video',
    cinema: 'aspect-[2.35/1]',
    square: 'aspect-square',
  }[aspectRatio];

  // --- Video event handlers ---

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    onTimeUpdate?.(video.currentTime);

    if (video.buffered.length > 0) {
      setBuffered(video.buffered.end(video.buffered.length - 1));
    }
  }, [onTimeUpdate]);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    if (playerState === 'loading') {
      setPlayerState('paused');
    }
  }, [playerState]);

  const handleVideoEnded = useCallback(() => {
    setPlayerState('ended');
    setShowControls(true);
    onEnded?.();
  }, [onEnded]);

  const handleWaiting = useCallback(() => {
    if (playerState === 'playing') {
      setPlayerState('loading');
    }
  }, [playerState]);

  const handleCanPlay = useCallback(() => {
    if (playerState === 'loading') {
      setPlayerState('playing');
    }
  }, [playerState]);

  // --- Player controls ---

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setPlayerState('paused');
    } else {
      video.play().then(() => {
        setPlayerState('playing');
      }).catch(() => {
        setPlayerState('paused');
      });
    }

    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 600);
  }, [isPlaying]);

  const handleSeek = useCallback((clientX: number) => {
    const video = videoRef.current;
    const bar = progressRef.current;
    if (!video || !bar) return;

    const rect = bar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const time = percent * duration;
    video.currentTime = time;
    setCurrentTime(time);
  }, [duration]);

  const handleProgressHover = useCallback((e: React.MouseEvent) => {
    const bar = progressRef.current;
    if (!bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverTime(percent * duration);
    setHoverX(e.clientX - rect.left);
  }, [duration]);

  const handleVolumeChange = useCallback((value: number) => {
    const video = videoRef.current;
    if (!video) return;
    const v = Math.max(0, Math.min(1, value));
    video.volume = v;
    setVolume(v);
    if (v > 0) setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const skip = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  }, [duration]);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen not supported
    }
  }, []);

  const handleReplay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().then(() => setPlayerState('playing'));
  }, []);

  const changePlaybackRate = useCallback((rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  }, []);

  // --- Auto-hide controls ---

  const resetHideTimer = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setShowControls(true);

    if (isPlaying && !isDragging) {
      hideTimerRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSettings(false);
      }, 3000);
    }
  }, [isPlaying, isDragging]);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isPlaying, resetHideTimer]);

  // --- Fullscreen change listener ---

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // --- Keyboard shortcuts ---

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skip(e.shiftKey ? -10 : -5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skip(e.shiftKey ? 10 : 5);
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(volume + 0.1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(volume - 0.1);
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [togglePlay, toggleFullscreen, toggleMute, skip, handleVolumeChange, volume]);

  // --- Progress drag ---

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => handleSeek(e.clientX);
    const handleMouseUp = () => setIsDragging(false);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleSeek(e.touches[0].clientX);
    };
    const handleTouchEnd = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleSeek]);

  // --- Helpers ---

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferPercent = duration > 0 ? (buffered / duration) * 100 : 0;

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div
      ref={containerRef}
      className={cn(
        'player-glass-frame relative group select-none',
        isFullscreen ? 'player-glass-frame--fullscreen fixed inset-0 z-[9999]' : aspectClass,
        className
      )}
      onMouseMove={resetHideTimer}
      onMouseEnter={() => setShowControls(true)}
      onClick={(e) => {
        // Click on video area toggles play (not on controls)
        if ((e.target as HTMLElement).closest('.player-control-bar') ||
            (e.target as HTMLElement).closest('.player-settings-popover')) return;
        togglePlay();
      }}
      role="region"
      aria-label={title ? `Lecteur vidéo: ${title}` : 'Lecteur vidéo'}
    >
      {/* Ambient glow — extracts dominant color feel */}
      {poster && (
        <div
          className={cn(
            'player-ambient-glow',
            isPlaying ? 'player-ambient-glow--active' : 'player-ambient-glow--idle'
          )}
          style={{
            backgroundImage: `url(${poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden="true"
        />
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        playsInline
        autoPlay={autoPlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleVideoEnded}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        onPlay={() => setPlayerState('playing')}
        onPause={() => { if (playerState !== 'ended') setPlayerState('paused'); }}
      />

      {/* Idle/Pause overlay gradient */}
      <AnimatePresence>
        {(isIdle || isPaused || showControls) && !isEnded && (
          <motion.div
            className="player-overlay-idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {/* Title overlay */}
      <AnimatePresence>
        {title && (isIdle || isPaused || (showControls && !isEnded)) && (
          <motion.div
            className="player-title-overlay"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h3 className="player-title">{title}</h3>
            {subtitle && <p className="player-subtitle">{subtitle}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center play button */}
      <AnimatePresence>
        {(isIdle || isPaused) && !isEnded && (
          <motion.button
            className="player-play-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            aria-label="Lire la vidéo"
          >
            <Play />
            {showRipple && <span className="play-ripple" />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Loading spinner */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="player-loading-ring"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Ended overlay */}
      <AnimatePresence>
        {isEnded && (
          <motion.div
            className="player-ended-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.button
              className="player-play-center"
              style={{ position: 'relative', top: 'auto', left: 'auto', transform: 'none' }}
              onClick={(e) => { e.stopPropagation(); handleReplay(); }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Rejouer"
            >
              <RotateCcw className="w-7 h-7 !ml-0" />
            </motion.button>
            <span className="text-white/70 text-sm font-medium">Rejouer</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control bar */}
      <div
        className={cn(
          'player-control-bar player-control-bar--glass',
          !showControls && isPlaying && !isDragging && 'player-control-bar--hidden'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div
          ref={progressRef}
          className="player-progress-container mb-3"
          onMouseMove={handleProgressHover}
          onMouseLeave={() => setHoverTime(null)}
          onMouseDown={(e) => { setIsDragging(true); handleSeek(e.clientX); }}
          onTouchStart={(e) => {
            if (e.touches[0]) { setIsDragging(true); handleSeek(e.touches[0].clientX); }
          }}
          role="slider"
          aria-label="Progression vidéo"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
          aria-valuetext={formatTime(currentTime)}
          tabIndex={0}
        >
          <div className="player-progress-track">
            <div
              className="player-progress-buffer"
              style={{ width: `${bufferPercent}%` }}
            />
            <div
              className="player-progress-played"
              style={{ width: `${progressPercent}%` }}
            />
            {/* Chapter markers */}
            {chapters.map((ch, i) => (
              <div
                key={i}
                className="player-chapter-marker"
                style={{ left: `${(ch.time / duration) * 100}%` }}
                title={ch.title}
              />
            ))}
            {/* Thumb */}
            <div
              className="player-progress-thumb"
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          {/* Hover preview */}
          {hoverTime !== null && (
            <div
              className="player-progress-preview"
              style={{ left: `${hoverX}px`, opacity: 1 }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between gap-2">
          {/* Left: play + skip + time */}
          <div className="flex items-center gap-1">
            <button
              className="player-btn player-btn--md player-btn--primary"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Lecture'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              className="player-btn player-btn--sm"
              onClick={() => skip(-10)}
              aria-label="Reculer de 10 secondes"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              className="player-btn player-btn--sm"
              onClick={() => skip(10)}
              aria-label="Avancer de 10 secondes"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 ml-2">
              <span className="player-time player-time--current">
                {formatTime(currentTime)}
              </span>
              <span className="player-time">/</span>
              <span className="player-time">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right: volume + settings + fullscreen */}
          <div className="flex items-center gap-1">
            {/* Volume */}
            <div className="player-volume">
              <button
                className="player-btn player-btn--sm"
                onClick={toggleMute}
                aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
              >
                <VolumeIcon className="w-4 h-4" />
              </button>
              <div className="player-volume-slider">
                <div
                  className="player-volume-track"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    handleVolumeChange((e.clientX - rect.left) / rect.width);
                  }}
                >
                  <div
                    className="player-volume-fill"
                    style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="relative">
              <button
                className="player-btn player-btn--sm"
                onClick={() => setShowSettings(!showSettings)}
                aria-label="Paramètres"
              >
                <Settings className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    className="player-settings-popover absolute bottom-full right-0 mb-2"
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-xs text-white/50 px-3 py-2 font-medium">Vitesse</div>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        className={cn(
                          'player-settings-item w-full',
                          playbackRate === rate && 'player-settings-item--active'
                        )}
                        onClick={() => changePlaybackRate(rate)}
                      >
                        <span>{rate === 1 ? 'Normal' : `${rate}x`}</span>
                        {playbackRate === rate && (
                          <span className="text-xs">✓</span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Fullscreen */}
            <button
              className="player-btn player-btn--sm"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PremiumVideoPlayer);

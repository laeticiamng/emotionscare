/**
 * HeroVideo — Premium video component for hero sections
 * Uses PremiumVideoPlayer for cinematic background video,
 * with reduced-motion fallback and error handling
 */

import React, { useState, useEffect, memo } from 'react';
import { PremiumVideoPlayer } from '@/components/video';
import { logger } from '@/lib/logger';

interface HeroVideoProps {
  className?: string;
  /** If true, renders as a background video (no controls, ambient mode) */
  ambient?: boolean;
  /** Title overlay for the video */
  title?: string;
  subtitle?: string;
}

const HeroVideo: React.FC<HeroVideoProps> = ({
  className = '',
  ambient = true,
  title,
  subtitle,
}) => {
  const [shouldShowVideo, setShouldShowVideo] = useState(true);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setShouldShowVideo(false);
    }
  }, []);

  // Fallback to image if video disabled or errored
  if (!shouldShowVideo || videoError) {
    return (
      <img
        src="/hero/hero-fallback.webp"
        alt="EmotionsCare - Plateforme de bien-être émotionnel"
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
        onError={() => logger.warn('Fallback image also failed to load', {}, 'UI')}
      />
    );
  }

  if (ambient) {
    // Ambient background mode — no controls, autoplay, muted, loop
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        <div className="player-ambient-glow player-ambient-glow--active absolute -inset-[15%] z-0">
          <img
            src="/hero/hero-fallback.webp"
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
        </div>
        <video
          className="relative z-10 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/hero/hero-fallback.webp"
          onError={() => setVideoError(true)}
        >
          <source src="/hero/hero.webm" type="video/webm" />
          <source src="/hero/hero.mp4" type="video/mp4" />
        </video>
      </div>
    );
  }

  // Interactive premium player mode
  return (
    <div className={className}>
      <PremiumVideoPlayer
        src="/hero/hero.mp4"
        poster="/hero/hero-fallback.webp"
        title={title}
        subtitle={subtitle}
        autoPlay={false}
        aspectRatio="cinema"
        onEnded={() => logger.debug('Hero video ended', {}, 'UI')}
      />
    </div>
  );
};

export default memo(HeroVideo);

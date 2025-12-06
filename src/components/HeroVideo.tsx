
import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

interface HeroVideoProps {
  className?: string;
}

const HeroVideo: React.FC<HeroVideoProps> = ({ className = '' }) => {
  const [shouldShowVideo, setShouldShowVideo] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Vérifier les préférences d'animation réduites
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setShouldShowVideo(false);
    }
  }, []);

  const handleVideoError = () => {
    logger.warn('Video failed to load, falling back to image', {}, 'UI');
    setVideoError(true);
  };

  const handleVideoLoaded = () => {
    logger.debug('Video loaded successfully', {}, 'UI');
    setVideoLoaded(true);
  };

  // Fallback vers l'image si vidéo désactivée, en erreur, ou pas encore chargée
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

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Afficher l'image en fallback pendant le chargement */}
      {!videoLoaded && (
        <img
          src="/hero/hero-fallback.webp"
          alt="EmotionsCare - Plateforme de bien-être émotionnel"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      )}
      
      <video
        className={`w-full h-full object-cover ${videoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
        autoPlay
        muted
        loop
        playsInline
        onError={handleVideoError}
        onLoadedData={handleVideoLoaded}
        poster="/hero/hero-fallback.webp"
      >
        <source src="/hero/hero.webm" type="video/webm" />
        <source src="/hero/hero.mp4" type="video/mp4" />
        
        {/* Fallback pour navigateurs non compatibles */}
        <img
          src="/hero/hero-fallback.webp"
          alt="EmotionsCare - Plateforme de bien-être émotionnel"
          className="w-full h-full object-cover"
        />
      </video>
    </div>
  );
};

export default HeroVideo;

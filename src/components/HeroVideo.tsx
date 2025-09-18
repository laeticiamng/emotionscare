
import React, { useState, useEffect } from 'react';

const HeroFallbackImage: React.FC<{ className?: string; priority?: boolean }> = ({ className = '', priority = false }) => (
  <picture className={`block w-full h-full ${className}`.trim()}>
    <source srcSet="/hero/hero-fallback.avif" type="image/avif" />
    <source srcSet="/hero/hero-fallback.webp" type="image/webp" />
    <img
      src="/hero/hero-fallback.webp"
      alt="EmotionsCare - Plateforme de bien-être émotionnel"
      className="w-full h-full object-cover"
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  </picture>
);

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
    console.warn('[HeroVideo] Video failed to load, falling back to image');
    setVideoError(true);
  };

  const handleVideoLoaded = () => {
    console.info('[HeroVideo] Video loaded successfully');
    setVideoLoaded(true);
  };

  // Fallback vers l'image si vidéo désactivée, en erreur, ou pas encore chargée
  if (!shouldShowVideo || videoError) {
    return <HeroFallbackImage className={className} priority={!shouldShowVideo} />;
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Afficher l'image en fallback pendant le chargement */}
      {!videoLoaded && (
        <HeroFallbackImage className="absolute inset-0" />
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
        <HeroFallbackImage />
      </video>
    </div>
  );
};

export default HeroVideo;


import React, { useState, useEffect } from 'react';

interface HeroVideoProps {
  className?: string;
}

const HeroVideo: React.FC<HeroVideoProps> = ({ className = '' }) => {
  const [shouldShowVideo, setShouldShowVideo] = useState(true);
  const [videoError, setVideoError] = useState(false);

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

  // Fallback vers l'image si vidéo désactivée ou en erreur
  if (!shouldShowVideo || videoError) {
    return (
      <img
        src="/hero/hero-fallback.webp"
        alt="EmotionsCare - Plateforme de bien-être émotionnel"
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }

  return (
    <video
      className={`w-full h-full object-cover ${className}`}
      autoPlay
      muted
      loop
      playsInline
      onError={handleVideoError}
      poster="/hero/hero-fallback.webp"
    >
      <source src="/hero/hero.webm" type="video/webm" />
      {/* Fallback pour navigateurs non compatibles */}
      <img
        src="/hero/hero-fallback.webp"
        alt="EmotionsCare - Plateforme de bien-être émotionnel"
        className="w-full h-full object-cover"
      />
    </video>
  );
};

export default HeroVideo;

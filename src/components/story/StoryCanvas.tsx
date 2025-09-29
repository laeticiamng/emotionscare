import React, { useEffect, useState, useRef } from 'react';
import { type StoryChapter } from '@/store/story.store';

interface StoryCanvasProps {
  chapter: StoryChapter | null;
  className?: string;
}

const StoryCanvas: React.FC<StoryCanvasProps> = ({ chapter, className = '' }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Détection du prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Effet machine à écrire ou fade-in
  useEffect(() => {
    if (!chapter?.text) {
      setDisplayedText('');
      return;
    }

    // Clear any existing animation
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (prefersReducedMotion) {
      // Mode réduit : fade-in simple
      setIsAnimating(true);
      setDisplayedText(chapter.text);
      
      timeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    } else {
      // Mode normal : machine à écrire
      setDisplayedText('');
      setIsAnimating(true);
      
      const text = chapter.text;
      const typingSpeed = 30; // ms par caractère
      let currentIndex = 0;

      const typeText = () => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          
          // Vitesse variable selon le caractère
          const char = text[currentIndex - 1];
          const delay = char === '.' || char === '!' || char === '?' ? typingSpeed * 3 :
                       char === ',' || char === ';' ? typingSpeed * 2 : 
                       typingSpeed;
          
          timeoutRef.current = setTimeout(typeText, delay);
        } else {
          setIsAnimating(false);
          
          // Annoncer la fin du chapitre aux lecteurs d'écran
          if (textRef.current) {
            textRef.current.setAttribute('aria-live', 'polite');
            setTimeout(() => {
              if (textRef.current) {
                textRef.current.setAttribute('aria-live', 'off');
              }
            }, 1000);
          }
        }
      };

      // Commencer l'animation avec un petit délai
      timeoutRef.current = setTimeout(typeText, 300);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [chapter?.text, prefersReducedMotion]);

  // Cleanup sur unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!chapter) {
    return (
      <div className={`story-canvas ${className}`}>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 mx-auto animate-pulse bg-primary/20 rounded-full" />
            <p>En attente du premier chapitre...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`story-canvas ${className}`}>
      <div 
        ref={textRef}
        className={`
          prose prose-lg max-w-none
          text-foreground
          leading-relaxed
          transition-opacity duration-300
          ${isAnimating && prefersReducedMotion ? 'opacity-50' : 'opacity-100'}
        `}
        style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
          lineHeight: '1.6',
        }}
        role="main"
        aria-live="off"
        aria-label={`Chapitre ${chapter.id}`}
      >
        {displayedText && (
          <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-2 first-letter:mt-1">
            {displayedText}
          </p>
        )}
        
        {/* Curseur clignotant pendant l'animation (seulement si pas de reduced-motion) */}
        {isAnimating && !prefersReducedMotion && (
          <span className="inline-block w-0.5 h-6 bg-primary ml-1 animate-pulse" />
        )}
      </div>

      {/* Indicateur visuel de fin de chapitre */}
      {!isAnimating && displayedText && (
        <div className="flex justify-center mt-8">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>
      )}
    </div>
  );
};

export default StoryCanvas;
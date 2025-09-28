
import React from 'react';

// Optimisations spécifiques pour mobile avec protection d'erreurs renforcée
export const mobileBreakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
} as const;

export const mobileSpacing = {
  container: 'px-4 sm:px-6 lg:px-8',
  section: 'py-8 sm:py-12 lg:py-16',
  card: 'p-4 sm:p-6 lg:p-8',
  button: 'px-4 py-2 sm:px-6 sm:py-3',
  text: 'text-sm sm:text-base lg:text-lg'
} as const;

export const mobileGrid = {
  responsive: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  cards: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
  features: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
} as const;

// Hook pour détecter la taille d'écran avec protection d'erreurs renforcée
export const useScreenSize = () => {
  const [screenSize, setScreenSize] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const checkScreenSize = () => {
      try {
        const width = window.innerWidth || 0;
        if (width < 768) {
          setScreenSize('mobile');
        } else if (width < 1024) {
          setScreenSize('tablet');
        } else {
          setScreenSize('desktop');
        }
      } catch (error) {
        console.log('⚠️ Screen size detection failed:', error);
        // Fallback sécurisé
        setScreenSize('desktop');
      }
    };
    
    checkScreenSize();
    
    try {
      const handleResize = () => {
        checkScreenSize();
      };
      
      window.addEventListener('resize', handleResize, { passive: true });
      return () => {
        try {
          window.removeEventListener('resize', handleResize);
        } catch (error) {
          console.log('⚠️ Event listener cleanup failed:', error);
        }
      };
    } catch (error) {
      console.log('⚠️ Resize listener setup failed:', error);
    }
  }, []);
  
  return screenSize;
};

// Optimisation des images pour mobile avec validation renforcée
export const getOptimizedImageSrc = (src: string, screenSize: 'mobile' | 'tablet' | 'desktop') => {
  if (!src || typeof src !== 'string') {
    console.log('⚠️ Invalid image src provided:', src);
    return '';
  }
  
  try {
    const sizeMap = {
      mobile: 'w-400',
      tablet: 'w-800', 
      desktop: 'w-1200'
    };
    
    const sizeParam = sizeMap[screenSize] || sizeMap.desktop;
    
    return src.includes('lovable-uploads') 
      ? `${src}?${sizeParam}`
      : src;
  } catch (error) {
    console.log('⚠️ Image optimization failed:', error);
    return src;
  }
};

// Fonction utilitaire pour combiner les classes de manière sécurisée
export const combineClasses = (...classes: (string | undefined | null | false)[]): string => {
  try {
    return classes
      .filter((cls): cls is string => Boolean(cls) && typeof cls === 'string')
      .join(' ')
      .trim();
  } catch (error) {
    console.log('⚠️ Class combination failed:', error);
    return '';
  }
};

// Fonction pour appliquer des classes de manière sécurisée à un élément DOM
export const safeAddClass = (element: Element | null, className: string): void => {
  if (!element) {
    console.log('⚠️ Element is null, cannot add class:', className);
    return;
  }
  
  try {
    if (element.classList && typeof element.classList.add === 'function') {
      element.classList.add(className);
    } else {
      console.log('⚠️ classList not available on element');
    }
  } catch (error) {
    console.log('⚠️ Failed to add class:', className, error);
  }
};

// Fonction pour retirer des classes de manière sécurisée d'un élément DOM
export const safeRemoveClass = (element: Element | null, className: string): void => {
  if (!element) {
    console.log('⚠️ Element is null, cannot remove class:', className);
    return;
  }
  
  try {
    if (element.classList && typeof element.classList.remove === 'function') {
      element.classList.remove(className);
    } else {
      console.log('⚠️ classList not available on element');
    }
  } catch (error) {
    console.log('⚠️ Failed to remove class:', className, error);
  }
};


// Optimisations spécifiques pour mobile
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

// Hook pour détecter la taille d'écran
export const useScreenSize = () => {
  const [screenSize, setScreenSize] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  return screenSize;
};

// Optimisation des images pour mobile
export const getOptimizedImageSrc = (src: string, screenSize: 'mobile' | 'tablet' | 'desktop') => {
  const sizeMap = {
    mobile: 'w-400',
    tablet: 'w-800', 
    desktop: 'w-1200'
  };
  
  return src.includes('lovable-uploads') 
    ? `${src}?${sizeMap[screenSize]}`
    : src;
};


import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the current device is mobile
 * based on screen width
 */
export const useIsMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(() => 
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Set up event listener for window resize
    window.addEventListener('resize', checkIsMobile);

    // Initial check
    checkIsMobile();

    // Clean up event listener
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;

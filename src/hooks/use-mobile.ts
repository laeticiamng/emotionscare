
import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, [breakpoint]);

  return isMobile;
}


import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Set initial value
    onChange();
    
    // Listen for changes
    mql.addEventListener('change', onChange);
    
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}

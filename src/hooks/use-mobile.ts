
import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    console.log('useIsMobile hook initializing');
    
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      console.log('Mobile check:', mobile, 'width:', window.innerWidth);
      setIsMobile(mobile);
    };

    // Check initially
    checkIfMobile();

    // Add listener for window resize
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return isMobile;
}

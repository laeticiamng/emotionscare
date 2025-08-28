import { useState, useEffect } from 'react';
import { useVRBreathStore } from '@/store/vrbreath.store';

export const useXRSession = () => {
  const { xrSupported, inXR, setXRSupported, setInXR } = useVRBreathStore();
  const [xrSystem, setXrSystem] = useState<XRSystem | null>(null);

  // Check XR support on mount
  useEffect(() => {
    const checkXRSupport = async () => {
      if ('navigator' in globalThis && 'xr' in navigator) {
        try {
          const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
          setXRSupported(isSupported);
          
          if (isSupported) {
            setXrSystem(navigator.xr);
          }
        } catch (error) {
          console.warn('XR support check failed:', error);
          setXRSupported(false);
        }
      } else {
        setXRSupported(false);
      }
    };

    checkXRSupport();
  }, [setXRSupported]);

  const enterXR = async () => {
    if (!xrSystem || !xrSupported) {
      console.warn('XR not supported or system not available');
      return;
    }

    try {
      // This will be handled by @react-three/xr
      setInXR(true);
      
      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'vrbreath_enter');
      }
    } catch (error) {
      console.error('Failed to enter XR:', error);
      setInXR(false);
    }
  };

  const exitXR = () => {
    setInXR(false);
    
    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'vrbreath_exit');
    }
  };

  return {
    xrSupported,
    inXR,
    xrSystem,
    enterXR,
    exitXR
  };
};
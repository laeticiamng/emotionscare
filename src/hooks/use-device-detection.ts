
import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
  isChrome: boolean;
  isFirefox: boolean;
  isEdge: boolean;
  isTouchDevice: boolean;
}

export default function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isIOS: false,
    isAndroid: false,
    isSafari: false,
    isChrome: false,
    isFirefox: false,
    isEdge: false,
    isTouchDevice: false,
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const userAgent = navigator.userAgent.toLowerCase();
    
    // Check for mobile and tablet
    const isMobile = /iphone|ipod|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(userAgent);
    const isTablet = /ipad|tablet|playbook|silk|android(?!.*mobile)/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;
    
    // Check OS
    const isIOS = /ipad|iphone|ipod/i.test(userAgent) && !window.MSStream;
    const isAndroid = /android/i.test(userAgent);
    
    // Check browser
    const isSafari = /safari/i.test(userAgent) && !/chrome/i.test(userAgent);
    const isChrome = /chrome/i.test(userAgent) && !/edge|edg/i.test(userAgent);
    const isFirefox = /firefox/i.test(userAgent);
    const isEdge = /edge|edg/i.test(userAgent);
    
    // Touch device check
    const isTouchDevice = 'ontouchstart' in window || 
                          navigator.maxTouchPoints > 0 || 
                          // @ts-ignore - Some browsers may have this property
                          navigator.msMaxTouchPoints > 0;
    
    setDeviceInfo({
      isMobile,
      isTablet,
      isDesktop,
      isIOS,
      isAndroid,
      isSafari,
      isChrome,
      isFirefox,
      isEdge,
      isTouchDevice,
    });
  }, []);

  return deviceInfo;
}

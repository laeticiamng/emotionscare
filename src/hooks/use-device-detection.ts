// @ts-nocheck

import { useEffect, useState } from 'react';

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

export function useDeviceDetection(): DeviceInfo {
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
    isTouchDevice: false
  });

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Check if mobile
    const isMobile = /iphone|ipod|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(userAgent);
    
    // Check if tablet
    const isTablet = /ipad|tablet|playbook|silk|android(?!.*mobile)/i.test(userAgent);
    
    // Check OS
    const isIOS = /ipad|iphone|ipod/.test(userAgent) && !(window as any).MSStream;
    const isAndroid = /android/.test(userAgent);
    
    // Check browser
    const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
    const isChrome = /chrome/.test(userAgent) && !/edge|edg/.test(userAgent);
    const isFirefox = /firefox/.test(userAgent);
    const isEdge = /edge|edg/.test(userAgent);
    
    // Check for touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    setDeviceInfo({
      isMobile,
      isTablet,
      isDesktop: !isMobile && !isTablet,
      isIOS,
      isAndroid,
      isSafari,
      isChrome,
      isFirefox,
      isEdge,
      isTouchDevice
    });
  }, []);
  
  return deviceInfo;
}

export default useDeviceDetection;

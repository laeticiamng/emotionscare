// @ts-nocheck
import { useState, useEffect } from 'react';

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  isTouchDevice: boolean;
  orientation: 'portrait' | 'landscape';
  screenSize: {
    width: number;
    height: number;
  };
  isOnline: boolean;
  devicePixelRatio: number;
  platform: string;
  capabilities: {
    hasCamera: boolean;
    hasMicrophone: boolean;
    hasGeolocation: boolean;
    hasMotionSensors: boolean;
    supportsVibration: boolean;
    supportsFullscreen: boolean;
  };
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: 'desktop',
    isTouchDevice: false,
    orientation: 'landscape',
    screenSize: { width: 1920, height: 1080 },
    isOnline: true,
    devicePixelRatio: 1,
    platform: 'unknown',
    capabilities: {
      hasCamera: false,
      hasMicrophone: false,
      hasGeolocation: false,
      hasMotionSensors: false,
      supportsVibration: false,
      supportsFullscreen: false
    }
  });

  useEffect(() => {
    const updateDeviceInfo = async () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Détection du type d'appareil basée sur la taille d'écran et les capacités
      let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      if (width <= 768) {
        deviceType = 'mobile';
      } else if (width <= 1024) {
        deviceType = 'tablet';
      }

      // Vérification tactile
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Orientation
      const orientation = width > height ? 'landscape' : 'portrait';

      // Capacités de l'appareil
      const capabilities = {
        hasCamera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        hasMicrophone: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        hasGeolocation: 'geolocation' in navigator,
        hasMotionSensors: 'DeviceMotionEvent' in window,
        supportsVibration: 'vibrate' in navigator,
        supportsFullscreen: !!(document.fullscreenEnabled || (document as any).webkitFullscreenEnabled)
      };

      // Détection de la plateforme
      let platform = 'unknown';
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
        platform = 'ios';
      } else if (userAgent.includes('android')) {
        platform = 'android';
      } else if (userAgent.includes('windows')) {
        platform = 'windows';
      } else if (userAgent.includes('mac')) {
        platform = 'macos';
      } else if (userAgent.includes('linux')) {
        platform = 'linux';
      }

      setDeviceInfo({
        type: deviceType,
        isTouchDevice,
        orientation,
        screenSize: { width, height },
        isOnline: navigator.onLine,
        devicePixelRatio: window.devicePixelRatio || 1,
        platform,
        capabilities
      });
    };

    // Mise à jour initiale
    updateDeviceInfo();

    // Écouteurs d'événements
    const handleResize = () => updateDeviceInfo();
    const handleOrientationChange = () => setTimeout(updateDeviceInfo, 100);
    const handleOnlineStatus = () => updateDeviceInfo();

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  return deviceInfo;
};

// Hook pour obtenir des classes CSS adaptatives
export const useResponsiveClasses = () => {
  const device = useDeviceDetection();
  
  const getResponsiveClasses = (base: string = '') => {
    const classes = [base];
    
    // Classes basées sur le type d'appareil
    if (device.type === 'mobile') {
      classes.push('mobile-device');
    } else if (device.type === 'tablet') {
      classes.push('tablet-device');
    } else {
      classes.push('desktop-device');
    }
    
    // Classes pour les appareils tactiles
    if (device.isTouchDevice) {
      classes.push('touch-device');
    } else {
      classes.push('non-touch-device');
    }
    
    // Classes d'orientation
    classes.push(`orientation-${device.orientation}`);
    
    // Classes de plateforme
    classes.push(`platform-${device.platform}`);
    
    return classes.filter(Boolean).join(' ');
  };
  
  return { device, getResponsiveClasses };
};